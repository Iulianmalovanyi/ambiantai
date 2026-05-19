/* =====================================================================
   AmbiantAI PoC — UI exploration overlay
   Self-contained, does not import from or modify app.js.
   Adds: view-switcher chip, replica toolbar markup (Figma-accurate),
   Ambient AI surface (attached + separate variants), click proxying to
   existing buttons, read-only state mirroring, Web Audio voice meter,
   device label, draggable toolbar with localStorage position persistence.
   ===================================================================== */
(function () {
  if (new URL(location.href).searchParams.get('mic')) return; // skip phone-mic page

  const STORAGE_VIEW = 'ambient-ui-view';
  const STORAGE_SEP_POS = 'ambient-ui-sep-pos';
  const STORAGE_TB_POS = 'ambient-ui-tb-pos';
  const VIEWS = ['attached', 'separate', 'components'];

  // Figma-extracted SVG symbols live in index.html (the static <defs> block
  // labelled "Figma-aligned symbols") so they're available on the
  // phone-mic page too — prototype.js short-circuits there.

  // -------- 1. View switcher chip ----------------------------------------
  const chip = document.createElement('div');
  chip.className = 'proto-chip';
  chip.setAttribute('role', 'group');
  chip.setAttribute('aria-label', 'UI direction');
  chip.innerHTML = `
    <span class="proto-chip__label">Direction</span>
    <button class="proto-chip__btn" data-view="attached">Attached</button>
    <button class="proto-chip__btn" data-view="separate">Separate</button>
    <button class="proto-chip__btn" data-view="components">Components</button>
  `;
  document.body.appendChild(chip);

  function setView(view) {
    if (!VIEWS.includes(view)) view = 'attached';
    document.body.classList.remove('view-attached', 'view-separate', 'view-components');
    document.body.classList.add(`view-${view}`);
    chip.querySelectorAll('[data-view]').forEach((b) => {
      b.classList.toggle('is-active', b.dataset.view === view);
    });
    try { localStorage.setItem(STORAGE_VIEW, view); } catch (e) {}
    if (typeof machine !== 'undefined' && machine.state === 'listening') startMeter();
  }
  chip.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-view]');
    if (btn) setView(btn.dataset.view);
  });

  // -------- 2. Replica toolbar (Figma Panel 2.0 + Ask) -------------------
  // Structure: a wrapper with the 4 buttons + 1 Menu, all 44×44 (Menu 52×44),
  // outer wrapper bg #034E8E, buttons bg #1671BE, 8px radius, inset shadows.
  const toolbarWrap = document.getElementById('toolbarWrap');
  if (!toolbarWrap) return;

  const replicaToolbar = document.createElement('div');
  replicaToolbar.className = 'proto-toolbar';
  replicaToolbar.setAttribute('role', 'toolbar');
  replicaToolbar.setAttribute('aria-label', 'C the Signs toolbar (replica)');
  replicaToolbar.innerHTML = `
    <div class="proto-tb-wrap">
      <div class="proto-tb-primary">
        <button class="proto-tb-btn" type="button" data-proto-btn="patient" aria-label="Patient">
          <svg class="proto-tb-icon"><use href="#fic-patient"/></svg>
        </button>
        <button class="proto-tb-btn" type="button" data-proto-btn="dashboard" aria-label="Dashboard">
          <svg class="proto-tb-icon"><use href="#fic-dashboard"/></svg>
        </button>
        <button class="proto-tb-btn" type="button" data-proto-btn="inbox" aria-label="Inbox">
          <svg class="proto-tb-icon"><use href="#fic-inbox"/></svg>
        </button>
        <button class="proto-tb-btn" type="button" data-proto-btn="ask" aria-label="Ask">
          <svg class="proto-tb-icon"><use href="#fic-ask"/></svg>
        </button>
      </div>
      <button class="proto-tb-btn proto-tb-menu" type="button" data-proto-btn="menu" aria-label="Menu">
        <svg class="proto-tb-icon proto-tb-icon--menu"><use href="#fic-menu-cts"/></svg>
      </button>
      <div class="proto-tb-handle" role="button" tabindex="0" aria-label="Drag toolbar" title="Drag to move">
        <span></span><span></span>
        <span></span><span></span>
        <span></span><span></span>
        <span></span><span></span>
      </div>
    </div>
  `;
  toolbarWrap.appendChild(replicaToolbar);

  // -------- 3. Ambient AI surface (unchanged from previous iteration) ----
  function buildAiSurface(variant) {
    const root = document.createElement('div');
    root.className = `proto-ai proto-ai--${variant}`;
    root.setAttribute('role', 'group');
    root.setAttribute('aria-label', 'Ambient AI controls');
    root.innerHTML = `
      <div class="proto-ai__container">
        <div class="proto-ai__row">
          <button class="proto-ai__pill proto-ai__pause" type="button" data-proxy="tbPause" aria-label="Pause listening">
            <svg class="proto-ai__ic"><use href="#fic-pause-sm"/></svg>
          </button>
          <button class="proto-ai__pill proto-ai__primary" type="button" data-proto-action="toggle" aria-label="Start listening">
            <span class="proto-ai__rec" aria-hidden="true"></span>
            <span class="proto-ai__primary-label">Start listening</span>
            <span class="proto-ai__primary-meta" aria-hidden="true" hidden>0:00</span>
          </button>
        </div>
        <div class="proto-ai__row proto-ai__row--device">
          <div class="proto-ai__mic-row">
            <svg class="proto-ai__ic" aria-hidden="true"><use href="#fic-mic-sm"/></svg>
            <span class="proto-ai__device">Microphone</span>
            <div class="proto-ai__meter" aria-hidden="true">
              <span data-band="0"></span><span data-band="1"></span><span data-band="2"></span><span data-band="3"></span><span data-band="4"></span>
            </div>
          </div>
          <button class="proto-ai__phone" type="button" data-proxy="tbPhone" aria-label="Use phone as microphone">
            <svg class="proto-ai__ic"><use href="#fic-phone-sm"/></svg>
          </button>
        </div>
      </div>
      <div class="proto-ai__grip" role="button" tabindex="0" aria-label="Drag" title="Drag to move">
        <svg class="proto-ai__ic"><use href="#fic-grip-v"/></svg>
      </div>
    `;
    return root;
  }

  const aiAttached = buildAiSurface('attached');
  const aiSeparate = buildAiSurface('separate');
  toolbarWrap.appendChild(aiAttached);
  document.body.appendChild(aiSeparate);

  // -------- 3b. Components gallery (Direction = Components) --------------
  // Non-interactive showcase of the main building blocks. Each card holds a
  // freshly-built static representation — IDs stripped so they don't clash
  // with the live UI above. Buttons inside the cards are not wired up.
  function buildAiPreview(variant, opts = {}) {
    // Same markup as buildAiSurface but with display-state classes baked in
    // (no live state machine). `opts.state` controls what's shown.
    const state = opts.state || 'idle'; // idle | listening | paused
    const meta = state !== 'idle' ? `<span class="proto-ai__primary-meta">${opts.timer || '0:00'}</span>` : '';
    const label = state === 'listening' ? 'Stop listening'
                : state === 'paused'    ? 'Resume listening'
                : 'Start listening';
    const showPause = state === 'listening' ? 'inline-flex' : 'none';
    const recState = state === 'listening' ? 'is-rec-on is-rec-breath'
                   : state === 'paused'    ? 'is-rec-on'
                   : '';
    const barHeights = state === 'listening' ? [9, 13, 5, 8, 6]
                     : state === 'paused'    ? [9, 13, 5, 8, 6]
                     : [3, 3, 3, 3, 3];
    const barOpacity = state === 'idle' ? '0' : '1';
    const barColor = state === 'paused' ? '#B0AC97' : '#5CA246';

    return `
      <div class="proto-ai proto-ai--${variant} proto-ai--preview">
        <div class="proto-ai__container">
          <div class="proto-ai__row">
            <button class="proto-ai__pill proto-ai__pause" style="display:${showPause}">
              <svg class="proto-ai__ic"><use href="#fic-pause-sm"/></svg>
            </button>
            <button class="proto-ai__pill proto-ai__primary">
              <span class="proto-ai__rec ${recState}"></span>
              <span class="proto-ai__primary-label">${label}</span>
              ${meta}
            </button>
            ${variant === 'separate' ? `<div class="proto-ai__grip"><svg class="proto-ai__ic"><use href="#fic-grip-v"/></svg></div>` : ''}
          </div>
          <div class="proto-ai__row proto-ai__row--device">
            <div class="proto-ai__mic-row">
              <svg class="proto-ai__ic"><use href="#fic-mic-sm"/></svg>
              <span class="proto-ai__device">Microphone</span>
              <div class="proto-ai__meter">
                ${barHeights.map((h, i) => `<span data-band="${i}" style="height:${h}px;opacity:${barOpacity};background:${barColor}"></span>`).join('')}
              </div>
            </div>
            <button class="proto-ai__phone">
              <svg class="proto-ai__ic"><use href="#fic-phone-sm"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function buildToolbarPreview() {
    return `
      <div class="proto-toolbar proto-toolbar--preview">
        <div class="proto-tb-wrap">
          <div class="proto-tb-primary">
            <button class="proto-tb-btn"><svg class="proto-tb-icon"><use href="#fic-patient"/></svg></button>
            <button class="proto-tb-btn"><svg class="proto-tb-icon"><use href="#fic-dashboard"/></svg></button>
            <button class="proto-tb-btn"><svg class="proto-tb-icon"><use href="#fic-inbox"/></svg></button>
            <button class="proto-tb-btn"><svg class="proto-tb-icon"><use href="#fic-ask"/></svg></button>
          </div>
          <button class="proto-tb-btn proto-tb-menu">
            <svg class="proto-tb-icon proto-tb-icon--menu"><use href="#fic-menu-cts"/></svg>
          </button>
          <div class="proto-tb-handle">
            <span></span><span></span><span></span><span></span>
            <span></span><span></span><span></span><span></span>
          </div>
        </div>
      </div>
    `;
  }

  function buildComponentsGallery() {
    const root = document.createElement('div');
    root.className = 'proto-components';
    root.setAttribute('role', 'region');
    root.setAttribute('aria-label', 'Components gallery');
    root.innerHTML = `
      <header class="proto-components__head">
        <h1>Components</h1>
        <p>Non-interactive previews of the main UI building blocks in this prototype. For reviewing surface inventory — not a behaviour spec.</p>
      </header>

      <article class="proto-comp">
        <header class="proto-comp__head">
          <h2>Toolbar</h2>
          <p>Figma-aligned replica. Patient · Dashboard · Inbox · Ask · Menu, plus the 8-dot drag handle.</p>
        </header>
        <div class="proto-comp__stage proto-comp__stage--toolbar">
          ${buildToolbarPreview()}
        </div>
        <footer class="proto-comp__foot">
          <p><strong>States:</strong> default · hover · pressed (yellow ribbon + 1 px push) · keyboard focus · opened (darker tile, no ribbon) · disabled.</p>
        </footer>
      </article>

      <article class="proto-comp">
        <header class="proto-comp__head">
          <h2>Ambient AI bar — Attached</h2>
          <p>Docks flush under the toolbar when a patient is open. Same width as the toolbar.</p>
        </header>
        <div class="proto-comp__stage proto-comp__stage--ai">
          <div class="proto-comp__ai-row">
            <div class="proto-comp__ai-cell">
              <span class="proto-comp__caption">Idle</span>
              ${buildAiPreview('attached', { state: 'idle' })}
            </div>
            <div class="proto-comp__ai-cell">
              <span class="proto-comp__caption">Listening</span>
              ${buildAiPreview('attached', { state: 'listening', timer: '4:18' })}
            </div>
            <div class="proto-comp__ai-cell">
              <span class="proto-comp__caption">Paused</span>
              ${buildAiPreview('attached', { state: 'paused', timer: '4:18' })}
            </div>
          </div>
        </div>
        <footer class="proto-comp__foot">
          <p><strong>States:</strong> idle · starting (300 ms) · listening (breathing) · paused (frozen) · stopping (300 ms fade).</p>
        </footer>
      </article>

      <article class="proto-comp">
        <header class="proto-comp__head">
          <h2>Ambient AI bar — Separate</h2>
          <p>Independent floating bar. Always visible. Has its own drag grip on the right.</p>
        </header>
        <div class="proto-comp__stage proto-comp__stage--ai">
          <div class="proto-comp__ai-row">
            <div class="proto-comp__ai-cell">
              <span class="proto-comp__caption">Idle</span>
              ${buildAiPreview('separate', { state: 'idle' })}
            </div>
            <div class="proto-comp__ai-cell">
              <span class="proto-comp__caption">Listening</span>
              ${buildAiPreview('separate', { state: 'listening', timer: '4:18' })}
            </div>
          </div>
        </div>
        <footer class="proto-comp__foot">
          <p>Drag the grip on the right to reposition. Position persists across reloads.</p>
        </footer>
      </article>

      <article class="proto-comp">
        <header class="proto-comp__head">
          <h2>Risk Summary modal</h2>
          <p>Opens from the notification card's "Details" link after detections come in. Shows a summary header + a list of detected risk factors.</p>
        </header>
        <div class="proto-comp__stage proto-comp__stage--modal">
          <div class="proto-comp__modal-preview proto-comp__modal-preview--summary">
            <header class="patient-bar">
              <span class="nhs-tag">NHS</span>
              <span class="patient-id">123 456 7890</span>
              <span class="patient-name"><span class="muted">Mr.</span> <strong>Willington, Albert</strong></span>
              <span class="patient-meta-badge">M</span>
              <span class="patient-meta">59yrs</span>
              <span class="patient-meta">12 Nov 1967</span>
              <button class="icon-btn icon-btn--light"><svg class="ic"><use href="#ic-close"/></svg></button>
            </header>
            <div class="modal-body">
              <div class="summary-head">
                <div class="summary-title-row">
                  <svg class="ic ic--sparkles"><use href="#ic-sparkles"/></svg>
                  <span class="eyebrow">RISK SUMMARY</span>
                </div>
                <h2>3 cancer signals identified</h2>
                <p class="summary-lede">We found factors mentioned during the consultation that may indicate cancer risk. Review the evidence, then confirm or edit the factors in risk assessment.</p>
              </div>
              <div class="summary-list">
                <div class="summary-card"><strong>Persistent cough</strong><p class="muted">"…this annoying little cough that hasn't gone away…"</p></div>
                <div class="summary-card"><strong>Unintentional weight loss</strong><p class="muted">"…lost about a stone without trying…"</p></div>
                <div class="summary-card"><strong>Haematuria</strong><p class="muted">"…urine looked pinkish yesterday…"</p></div>
              </div>
            </div>
          </div>
        </div>
        <footer class="proto-comp__foot">
          <p>Currently lives at <code>#detailsOverlay</code> in <code>index.html</code>. Trigger: detection count &gt; 0.</p>
        </footer>
      </article>

      <article class="proto-comp">
        <header class="proto-comp__head">
          <h2>Risk Assessment modal</h2>
          <p>Multi-factor selection with search + A–Z navigation. Reached from the Summary modal via "Start risk assessment".</p>
        </header>
        <div class="proto-comp__stage proto-comp__stage--modal">
          <div class="proto-comp__modal-preview proto-comp__modal-preview--ra">
            <header class="patient-bar">
              <svg class="ic ic--lg"><use href="#ic-butterfly"/></svg>
              <span class="patient-name"><span class="muted">Mrs.</span> <strong>Stone, Emma</strong></span>
              <span class="patient-meta">69yrs · 18 Jun 1955</span>
              <span class="spacer"></span>
              <span class="nhs-tag">NHS</span>
              <span class="patient-id">271 212 7328</span>
              <button class="icon-btn icon-btn--light"><svg class="ic"><use href="#ic-close"/></svg></button>
            </header>
            <div class="ra-body">
              <div class="ra-selected-row">
                <span class="proto-comp__chip">Persistent cough ✕</span>
                <span class="proto-comp__chip">Weight loss ✕</span>
              </div>
              <div class="ra-toolbar">
                <div class="ra-search">
                  <svg class="ic"><use href="#ic-search"/></svg>
                  <input type="search" placeholder="Type factors, symptoms, sign, or investigations" disabled />
                </div>
                <button class="btn btn--primary btn--large">Proceed <svg class="ic ic--sm"><use href="#ic-chevron"/></svg></button>
              </div>
            </div>
          </div>
        </div>
        <footer class="proto-comp__foot">
          <p>Currently lives at <code>#raOverlay</code>. Reached from the Summary's "Start risk assessment" CTA.</p>
        </footer>
      </article>

      <article class="proto-comp">
        <header class="proto-comp__head">
          <h2>Mobile mic page</h2>
          <p>Phone-side capture screen reached by scanning the QR in the Phone Connection modal. URL contains <code>?mic=&lt;peer-id&gt;</code>.</p>
        </header>
        <div class="proto-comp__stage proto-comp__stage--phone">
          <div class="proto-phone-frame">
            <div class="proto-phone-frame__notch"></div>
            <div class="proto-phone-frame__screen">
              <div class="mobile-mic proto-mobile-mic--preview">
                <div class="mm-header">
                  <svg class="ic ic--lg mm-logo-ic"><use href="#fic-menu-cts"/></svg>
                  <strong>C the Signs — Ambient AI</strong>
                </div>
                <div class="mm-status">
                  <span class="dot dot--connected"></span>
                  <span>Connected to laptop</span>
                </div>
                <div class="mm-mic-area">
                  <button class="mm-mic-btn">
                    <svg class="ic ic--xl mm-mic-ic"><use href="#fic-mic-sm"/></svg>
                    <span>Tap to listen</span>
                  </button>
                </div>
                <div class="mm-transcript">
                  <span class="muted">Transcript appears here as you speak.</span>
                </div>
                <p class="mm-footnote">Audio stays on this phone. Only the transcribed text is sent to the laptop.</p>
              </div>
            </div>
          </div>
        </div>
        <footer class="proto-comp__foot">
          <p>Full-screen page when active. Container above is for preview only — the real page fills the whole viewport.</p>
        </footer>
      </article>

      <article class="proto-comp">
        <header class="proto-comp__head">
          <h2>Status pill (dev utility)</h2>
          <p>PoC-only control surface: transcript toggle, "New patient open" simulation, language picker, STT status line. Will not ship to production.</p>
        </header>
        <div class="proto-comp__stage proto-comp__stage--util">
          <div class="proto-comp__status-pill">
            <div class="status-pill-row">
              <span class="status-feature">
                <svg class="ic ic--sm"><use href="#ic-sparkles"/></svg>
                Ambient AI <span class="poc-tag">PoC</span>
              </span>
              <span class="lang-picker-wrap">
                <label class="lang-label">Patient speaks:</label>
                <select class="lang-picker" disabled>
                  <option>English</option>
                </select>
              </span>
            </div>
            <div class="status-pill-row status-pill-actions">
              <button class="btn btn--ghost">Show transcript</button>
              <button class="btn btn--primary">
                <svg class="ic ic--sm"><use href="#ic-user-plus"/></svg>
                New patient open
              </button>
            </div>
            <div class="status-pill-note">Web Speech API ready · Click the mic button to begin</div>
          </div>
        </div>
        <footer class="proto-comp__foot">
          <p>Top-left of the viewport. Hidden in the Components direction.</p>
        </footer>
      </article>

      <article class="proto-comp">
        <header class="proto-comp__head">
          <h2>Notification card</h2>
          <p>Floats below the Patient button when detections come in. "Risk assess", "Details", "Hide" actions.</p>
        </header>
        <div class="proto-comp__stage proto-comp__stage--util">
          <div class="proto-comp__notif">
            <div class="notif-body">
              <div class="notif-badge">3</div>
              <div class="notif-content">
                <div class="notif-title">3 risk factors detected</div>
                <div class="notif-sub">Latest: Persistent cough · from the consultation</div>
                <div class="notif-actions">
                  <button class="link link--primary">Risk assess</button>
                  <button class="link">Details</button>
                  <button class="link">Hide</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer class="proto-comp__foot">
          <p>Currently lives at <code>.notif</code> in <code>index.html</code>.</p>
        </footer>
      </article>
    `;
    return root;
  }
  document.body.appendChild(buildComponentsGallery());

  // -------- 4. State machine ---------------------------------------------
  // Single source of truth for the recording lifecycle:
  //   idle → starting → listening ↔ paused
  //                          ↓
  //                       stopping → idle
  //
  // `starting` and `stopping` are short transitional states (300 ms each)
  // that give the indicator time to morph between idle and listening.
  // The underlying app.js action (#tbStart.click / #tbStop.click) fires
  // immediately on user input — the transition state only smooths the UI.
  //
  // Inputs that feed the machine:
  //   - User events on the proto pills (Start, Stop, Pause, Resume)
  //   - DOM mutations on #tbStart and #listenChip (so the machine still
  //     reconciles when app.js changes state for other reasons —
  //     "New patient open" sim, STT errors, etc.)
  const tbStart = document.getElementById('tbStart');
  const tbPause = document.getElementById('tbPause');
  const tbStop  = document.getElementById('tbStop');
  const tbPhone = document.getElementById('tbPhone');
  const listenChip = document.getElementById('listenChip');

  const RECORDING_STATES = ['idle', 'starting', 'listening', 'paused', 'stopping'];
  const TRANSITION_MS = 300;
  const LABELS = {
    idle:      'Start listening',
    starting:  'Starting…',
    listening: 'Stop listening',
    paused:    'Resume listening',
    stopping:  'Stopping…',
  };

  function fmtTimer(secs) {
    secs = Math.max(0, Math.floor(secs));
    const s = secs % 60;
    const m = Math.floor(secs / 60) % 60;
    const h = Math.floor(secs / 3600);
    const ss = String(s).padStart(2, '0');
    if (h) return `${h}:${String(m).padStart(2, '0')}:${ss}`;
    return `${m}:${ss}`;
  }

  // Timer accumulator — counts only seconds spent in 'listening'
  let elapsedAccum = 0;
  let segmentStart = 0;
  let tickId = null;
  function paintTimer() {
    const now = performance.now();
    const live = (machine.state === 'listening' && segmentStart) ? (now - segmentStart) : 0;
    const text = fmtTimer((elapsedAccum + live) / 1000);
    document.querySelectorAll('.proto-ai__primary-meta').forEach((el) => {
      el.textContent = text;
    });
  }
  function startTick() {
    if (tickId) return;
    tickId = setInterval(paintTimer, 250);
  }
  function stopTick() {
    if (!tickId) return;
    clearInterval(tickId);
    tickId = null;
  }

  const machine = (() => {
    let state = 'idle';
    let transitionTimer = null;

    function clearTransitionTimer() {
      if (transitionTimer) {
        clearTimeout(transitionTimer);
        transitionTimer = null;
      }
    }

    function isTransitional() {
      return state === 'starting' || state === 'stopping';
    }

    function set(next) {
      if (!RECORDING_STATES.includes(next) || next === state) return;
      clearTransitionTimer();
      const prev = state;
      state = next;
      render(prev, next);
      // Auto-advance from transient states
      if (next === 'starting') {
        transitionTimer = setTimeout(() => set('listening'), TRANSITION_MS);
      } else if (next === 'stopping') {
        transitionTimer = setTimeout(() => set('idle'), TRANSITION_MS);
      }
    }

    function render(prev, next) {
      RECORDING_STATES.forEach((s) => {
        document.body.classList.toggle(`proto-${s}`, s === next);
      });

      // Primary pill label + aria
      const label = LABELS[next];
      document.querySelectorAll('.proto-ai__primary-label').forEach((el) => {
        el.textContent = label;
      });
      document.querySelectorAll('.proto-ai__primary').forEach((b) => {
        b.setAttribute('aria-label', label);
      });

      // Timer meta visibility — shown for any state where the timer reading
      // is meaningful: listening (live), paused (frozen), stopping (final
      // value briefly visible). Hidden in idle and starting (no value yet).
      const showMeta = next === 'listening' || next === 'paused' || next === 'stopping';
      document.querySelectorAll('.proto-ai__primary-meta').forEach((el) => {
        el.hidden = !showMeta;
      });

      // Timer accounting
      const wasListening = prev === 'listening';
      const isListening = next === 'listening';
      if (isListening && !wasListening) {
        // Fresh start = reset accumulator; resume from pause = keep it
        if (prev !== 'paused' && prev !== 'starting') elapsedAccum = 0;
        if (prev === 'starting' && elapsedAccum === 0 && prev !== 'paused') {
          // Coming from starting, but the starting may itself have followed
          // either idle or paused. Use a marker we set on entering starting.
        }
        segmentStart = performance.now();
        startTick();
      } else if (!isListening && wasListening) {
        // Leaving listening — bank the segment
        elapsedAccum += performance.now() - segmentStart;
        segmentStart = 0;
        stopTick();
      }
      if (next === 'idle' || next === 'starting') {
        // Reset accumulator at the start of a fresh session. We do it on
        // the way INTO starting from idle, so the timer renders 0:00 when
        // listening kicks in. Resume from paused keeps accum.
        if (prev === 'idle' && next === 'starting') elapsedAccum = 0;
      }
      paintTimer();

      // Web Audio meter
      if (isListening) startMeter();
      else if (next !== 'paused') stopMeter();
    }

    function reconcileFromDOM() {
      // Skip reconciliation while we're in a transient state — the timer
      // will resolve it. This avoids race conditions where the underlying
      // app.js fires immediately after a click and the observer would
      // overwrite our intentional 'starting' / 'stopping' state.
      if (isTransitional()) return;
      const isActive = !!(tbStart && tbStart.classList.contains('is-active'));
      const isPaused = !isActive &&
                       !!(listenChip && listenChip.classList.contains('is-paused')) &&
                       !!(listenChip && !listenChip.hidden);
      const want = isActive ? 'listening' : isPaused ? 'paused' : 'idle';
      if (want !== state) set(want);
    }

    return { get state() { return state; }, set, reconcileFromDOM };
  })();

  if (tbStart) {
    new MutationObserver(() => machine.reconcileFromDOM()).observe(tbStart, {
      attributes: true,
      attributeFilter: ['class', 'disabled'],
    });
  }
  if (listenChip) {
    new MutationObserver(() => machine.reconcileFromDOM()).observe(listenChip, {
      attributes: true,
      attributeFilter: ['class', 'hidden'],
    });
  }
  if (tbPhone) {
    new MutationObserver(() => {
      const isConn = tbPhone.classList.contains('is-connected');
      document.querySelectorAll('.proto-ai__phone').forEach((b) => {
        b.classList.toggle('is-connected', isConn);
      });
    }).observe(tbPhone, { attributes: true, attributeFilter: ['class'] });
  }

  // -------- 5. Click proxying — routes through the state machine --------
  // The proto pills set machine state intentionally; the underlying
  // tbStart/tbPause/tbStop actions fire alongside so app.js still owns
  // the audio pipeline.
  document.querySelectorAll('[data-proxy="tbPause"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (tbPause && !tbPause.disabled) tbPause.click();
      machine.set('paused');
    });
  });
  document.querySelectorAll('[data-proxy="tbPhone"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (tbPhone && !tbPhone.disabled) tbPhone.click();
    });
  });
  document.querySelectorAll('[data-proto-action="toggle"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      // Listening    → Stop (full reset, with 300ms 'stopping' transition)
      // Paused       → Resume via Start
      // Idle         → Start fresh
      // Starting     → ignore (already starting)
      // Stopping     → ignore (already stopping)
      const s = machine.state;
      if (s === 'listening') {
        machine.set('stopping');
        if (tbStop && !tbStop.disabled) tbStop.click();
      } else if (s === 'paused' || s === 'idle') {
        machine.set('starting');
        if (tbStart && !tbStart.disabled) tbStart.click();
      }
    });
  });

  // Replica toolbar buttons — visual only for now. No sticky "open" class:
  // press/release feedback comes purely from CSS :active. Production menus
  // can re-introduce a sticky state when the corresponding surface opens.

  // -------- Patient-context gate ----------------------------------------
  // Attached variant: AI surface only appears once a patient is opened.
  // Separate variant: AI surface is always visible (CSS handles that
  // override) and ignores this gate entirely.
  //
  // Triggers that flip the gate:
  //   1. Clicking the Patient button on the replica toolbar (toggle)
  //   2. Clicking "New patient open" in the existing status pill (set)
  //
  // While the gate is true, the Patient button shows a sticky "opened"
  // state — same darker bg as :active but WITHOUT the yellow underline
  // or icon shift (those are reserved for the pressed/keyboard-focus
  // states only).
  const PATIENT_KEY = 'ambient-ui-patient-open';
  const patientBtn = replicaToolbar.querySelector('[data-proto-btn="patient"]');
  function setPatientOpen(open) {
    document.body.classList.toggle('patient-open', open);
    if (patientBtn) patientBtn.classList.toggle('is-surface-open', open);
    try { sessionStorage.setItem(PATIENT_KEY, open ? '1' : '0'); } catch (e) {}
  }
  if (patientBtn) {
    patientBtn.addEventListener('click', () => {
      setPatientOpen(!document.body.classList.contains('patient-open'));
    });
  }
  const newPatientBtn = document.getElementById('btnNewPatient');
  if (newPatientBtn) {
    newPatientBtn.addEventListener('click', () => setPatientOpen(true));
  }
  // Restore last state for the session
  try {
    if (sessionStorage.getItem(PATIENT_KEY) === '1') setPatientOpen(true);
  } catch (e) {}

  // -------- 6. Voice meter (synthetic, no parallel mic stream) -----------
  // Originally this opened a parallel getUserMedia stream to drive the bars
  // from real audio levels. That competes with the SpeechRecognition stream
  // owned by app.js — Chrome shares device-level audio settings across
  // getUserMedia streams and the resulting audio pipeline silently breaks
  // Web Speech API transcription (interim "Hearing speech…" fires but no
  // final transcript ever lands). We hit this exact issue earlier in the
  // project and removed our own audio meter for the same reason.
  // The bars are now driven by a synthetic animation while listening, which
  // preserves the visual feedback without touching the mic.
  let rafId = null;

  function startMeter() {
    if (rafId) return;
    const bandCount = 5;
    const startedAt = performance.now();
    function tick(now) {
      const bars = document.querySelectorAll('.proto-ai__meter span');
      const t = (now - startedAt) / 1000;
      for (let i = 0; i < bandCount; i++) {
        // Each band oscillates at a slightly different speed for an organic feel
        const phase = t * (2.2 + i * 0.6) + i * 1.3;
        const ceiling = (i === 0 || i === bandCount - 1) ? 10 : 14;
        const amp = (Math.sin(phase) * 0.35 + 0.45 + Math.random() * 0.2);
        const h = Math.max(3, Math.round(amp * ceiling));
        bars.forEach((el) => {
          if (parseInt(el.dataset.band, 10) === i) el.style.height = h + 'px';
        });
      }
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
  }
  function stopMeter() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    document.querySelectorAll('.proto-ai__meter span').forEach((el) => { el.style.height = ''; });
  }

  // -------- 7. Drag — replica toolbar handle (moves #toolbarWrap) --------
  // Restore saved toolbar position
  try {
    const tbPos = JSON.parse(localStorage.getItem(STORAGE_TB_POS) || 'null');
    if (tbPos && typeof tbPos.x === 'number' && typeof tbPos.y === 'number') {
      toolbarWrap.style.left = tbPos.x + 'px';
      toolbarWrap.style.top = tbPos.y + 'px';
      toolbarWrap.style.transform = 'none';
    }
  } catch (e) {}

  const tbHandle = replicaToolbar.querySelector('.proto-tb-handle');
  let tbDrag = null;

  function tbDragStart(cx, cy) {
    const rect = toolbarWrap.getBoundingClientRect();
    // Switch from centred-transform to absolute pixel positioning
    toolbarWrap.style.transform = 'none';
    toolbarWrap.style.left = rect.left + 'px';
    toolbarWrap.style.top = rect.top + 'px';
    tbDrag = { mx: cx, my: cy, x: rect.left, y: rect.top };
    document.body.style.cursor = 'grabbing';
  }
  function tbDragMove(cx, cy) {
    if (!tbDrag) return;
    const nx = tbDrag.x + (cx - tbDrag.mx);
    const ny = tbDrag.y + (cy - tbDrag.my);
    const maxX = window.innerWidth - toolbarWrap.offsetWidth;
    const maxY = window.innerHeight - toolbarWrap.offsetHeight;
    toolbarWrap.style.left = Math.min(Math.max(0, nx), maxX) + 'px';
    toolbarWrap.style.top  = Math.min(Math.max(0, ny), maxY) + 'px';
  }
  function tbDragEnd() {
    if (!tbDrag) return;
    tbDrag = null;
    document.body.style.cursor = '';
    const rect = toolbarWrap.getBoundingClientRect();
    try { localStorage.setItem(STORAGE_TB_POS, JSON.stringify({ x: rect.left, y: rect.top })); } catch (e) {}
  }

  tbHandle.addEventListener('mousedown', (e) => { e.preventDefault(); tbDragStart(e.clientX, e.clientY); });
  tbHandle.addEventListener('touchstart', (e) => {
    const t = e.touches[0]; tbDragStart(t.clientX, t.clientY);
  }, { passive: true });

  // -------- 8. Drag — separate AI bar ------------------------------------
  try {
    const sepPos = JSON.parse(localStorage.getItem(STORAGE_SEP_POS) || 'null');
    if (sepPos && typeof sepPos.x === 'number' && typeof sepPos.y === 'number') {
      aiSeparate.style.left = sepPos.x + 'px';
      aiSeparate.style.top = sepPos.y + 'px';
    }
  } catch (e) {}

  const sepGrip = aiSeparate.querySelector('.proto-ai__grip');
  let sepDrag = null;

  function sepDragStart(cx, cy) {
    const rect = aiSeparate.getBoundingClientRect();
    sepDrag = { mx: cx, my: cy, x: rect.left, y: rect.top };
    document.body.style.cursor = 'grabbing';
  }
  function sepDragMove(cx, cy) {
    if (!sepDrag) return;
    const nx = sepDrag.x + (cx - sepDrag.mx);
    const ny = sepDrag.y + (cy - sepDrag.my);
    const maxX = window.innerWidth - aiSeparate.offsetWidth;
    const maxY = window.innerHeight - aiSeparate.offsetHeight;
    aiSeparate.style.left = Math.min(Math.max(0, nx), maxX) + 'px';
    aiSeparate.style.top  = Math.min(Math.max(0, ny), maxY) + 'px';
  }
  function sepDragEnd() {
    if (!sepDrag) return;
    sepDrag = null;
    document.body.style.cursor = '';
    const rect = aiSeparate.getBoundingClientRect();
    try { localStorage.setItem(STORAGE_SEP_POS, JSON.stringify({ x: rect.left, y: rect.top })); } catch (e) {}
  }

  sepGrip.addEventListener('mousedown', (e) => { e.preventDefault(); sepDragStart(e.clientX, e.clientY); });
  sepGrip.addEventListener('touchstart', (e) => {
    const t = e.touches[0]; sepDragStart(t.clientX, t.clientY);
  }, { passive: true });

  // Shared move/end listeners — single source for both drags
  document.addEventListener('mousemove', (e) => { tbDragMove(e.clientX, e.clientY); sepDragMove(e.clientX, e.clientY); });
  document.addEventListener('mouseup', () => { tbDragEnd(); sepDragEnd(); });
  document.addEventListener('touchmove', (e) => {
    if (!tbDrag && !sepDrag) return;
    const t = e.touches[0]; tbDragMove(t.clientX, t.clientY); sepDragMove(t.clientX, t.clientY);
  }, { passive: true });
  document.addEventListener('touchend', () => { tbDragEnd(); sepDragEnd(); });

  // -------- 9. Bootstrap initial view ------------------------------------
  let initialView = 'attached';
  try {
    const fromUrl = new URL(location.href).searchParams.get('view');
    if (fromUrl && VIEWS.includes(fromUrl)) initialView = fromUrl;
    else {
      const saved = localStorage.getItem(STORAGE_VIEW);
      if (saved && VIEWS.includes(saved)) initialView = saved;
    }
  } catch (e) {}
  setView(initialView);
  machine.reconcileFromDOM();
})();
