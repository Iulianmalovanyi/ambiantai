// =====================================================================
// Local LLM detection (PoC) — talks to a local Ollama server running on
// the clinician's machine. Free, private, no API key, no data leaves
// the device.
//
// Expected setup on the clinician's machine:
//   brew install ollama
//   ollama pull qwen2.5:3b
//   OLLAMA_ORIGINS="*" ollama serve
//
// The PoC POSTs each new transcript utterance to /v1/chat/completions
// (Ollama exposes an OpenAI-compatible API). The model returns a JSON
// list of detected factor names which we map back to the canonical
// factor records.
// =====================================================================

const OLLAMA_URL = 'http://localhost:11434/v1/chat/completions';
const MODEL_NAME = 'qwen2.5:3b';
const REQUEST_TIMEOUT_MS = 12000;

let factorList = []; // [{ name, hint }] — passed to the model in the prompt
let ready = false;
let lastError = null;

/**
 * Check whether the local Ollama server is reachable and the model is
 * available. Should be called on boot.
 *
 * Returns { ok, model, error }
 */
export async function probeOllama() {
  try {
    const r = await fetch('http://localhost:11434/api/tags', { method: 'GET' });
    if (!r.ok) return { ok: false, error: `Ollama responded with HTTP ${r.status}` };
    const data = await r.json();
    const hasModel = data.models?.some(m => m.name?.startsWith(MODEL_NAME));
    if (!hasModel) {
      return { ok: false, error: `Model ${MODEL_NAME} not pulled. Run: ollama pull ${MODEL_NAME}` };
    }
    return { ok: true, model: MODEL_NAME };
  } catch (err) {
    // CORS errors look the same as network errors from the browser side
    return { ok: false, error: `Cannot reach Ollama: ${err.message}. Is "ollama serve" running with OLLAMA_ORIGINS="*"?` };
  }
}

/**
 * Initialise the detector with the list of factors the model should
 * recognise. `factors` is an array of factor objects with at least
 * { name, categories }. We build a compact factor list for the prompt.
 */
export function initLocalLlm({ factors }) {
  // Skip factors with absurdly long compound names (the endometrial /
  // back-pain red-flag entries that bundle multiple criteria).
  factorList = factors
    .filter(f => !(f.name.length > 80 && /;|<|>|≥|≤/.test(f.name)))
    .map(f => ({ name: f.name, categories: f.categories || [] }));
  ready = true;
  return factorList.length;
}

export function isLocalLlmReady() { return ready; }
export function getLastError() { return lastError; }

/**
 * Build the prompt for the model. We give it a list of factor names and
 * an utterance, and ask for a strict JSON response.
 *
 * To keep the prompt manageable we pass canonical factor names only
 * (no aliases — the model already knows the synonyms).
 */
function buildPrompt(utterance) {
  const names = factorList.map(f => `- ${f.name}`).join('\n');
  return [
    {
      role: 'system',
      content: `You are a clinical assistant that listens to short utterances from a primary care consultation and detects which cancer risk factors from a fixed list the patient is describing.

You will receive:
1. A canonical list of risk factors (some symptoms, signs, family history items, or lifestyle factors).
2. A single utterance from the patient or clinician.

Your task:
- Decide which factors from the list the utterance describes.
- Treat the utterance generously: medical jargon, lay terms, partial descriptions, hedged language, and mentions of close relatives all count.
- IGNORE negations: if the speaker is denying / never had / explicitly ruled out a factor, do not include it.
- If nothing in the list applies, return an empty array.
- Output ONLY valid JSON in this exact shape, no prose, no markdown:
  {"matches":[{"name":"<exact factor name from the list>","quote":"<short verbatim phrase from utterance>","confidence":0.0-1.0}]}
- "name" MUST be one of the listed factor names, character for character.`
    },
    {
      role: 'user',
      content: `Risk factors:
${names}

Utterance:
"${utterance}"

Respond with JSON only.`
    }
  ];
}

/**
 * Run detection on a single utterance. Returns an array of
 * { name, quote, confidence } objects. Empty array on failure.
 */
export async function localLlmDetect(utterance) {
  if (!ready) return [];
  const trimmed = (utterance || '').trim();
  if (!trimmed) return [];
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const r = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: buildPrompt(trimmed),
        temperature: 0,        // deterministic for clinical use
        response_format: { type: 'json_object' },
        stream: false
      })
    });
    clearTimeout(timeoutId);
    if (!r.ok) {
      lastError = `HTTP ${r.status}`;
      console.warn('[LLM] error response', await r.text());
      return [];
    }
    const data = await r.json();
    const content = data.choices?.[0]?.message?.content || '';
    return parseLlmResponse(content);
  } catch (err) {
    clearTimeout(timeoutId);
    lastError = err.message;
    console.warn('[LLM] request failed', err);
    return [];
  }
}

/**
 * Parse the model's JSON response defensively. Some small models
 * occasionally wrap JSON in code fences or add stray prose; we strip
 * common variants before parsing.
 */
function parseLlmResponse(raw) {
  if (!raw) return [];
  // Strip ```json … ``` if the model wraps the output
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```$/i, '')
    .trim();
  try {
    const parsed = JSON.parse(cleaned);
    const matches = Array.isArray(parsed.matches) ? parsed.matches : [];
    const validNames = new Set(factorList.map(f => f.name));
    return matches
      .filter(m => m && typeof m.name === 'string' && validNames.has(m.name))
      .map(m => ({
        name: m.name,
        quote: typeof m.quote === 'string' ? m.quote : '',
        confidence: typeof m.confidence === 'number' ? m.confidence : 0.7
      }));
  } catch (err) {
    console.warn('[LLM] could not parse response:', cleaned);
    return [];
  }
}
