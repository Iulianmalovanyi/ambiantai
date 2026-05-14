// =====================================================================
// PoC-only factor entries.
// Background: extraction from factors.json revealed gaps for high-yield
// clinical concepts (likely tagging issues in the source data). These
// entries are added here only for the PoC so the demo can showcase them.
// In production these should be resolved in the source factors.json.
//
// Flagged gaps:
//  - Dyspnoea / breathlessness — absent from filtered set
//  - Night sweats — tagged CHILDHOOD_ONLY in source
//  - Anaemia (clinical sign) — only present as INVESTIGATION
//  - Generic "lump" — only site-specific lumps exist
//  - Generic "family history of cancer" — only "Strong family history…"
//    exists and is CHILDHOOD_ONLY
// =====================================================================

export const POC_EXTRA_FACTORS = [
  { id: "pocDyspnoea",           name: "Dyspnoea",                       type: "SYMPTOM",     categories: ["CHEST"] },
  { id: "pocNightSweats",        name: "Night sweats",                   type: "SYMPTOM",     categories: ["HAEMATOLOGICAL", "NON_SPECIFIC"] },
  { id: "pocAnaemia",            name: "Anaemia",                        type: "SIGN",        categories: ["GASTROINTESTINAL", "NON_SPECIFIC"] },
  { id: "pocLump",               name: "New lump",                       type: "SIGN",        categories: ["NON_SPECIFIC"] },
  { id: "pocFamilyHxCancer",     name: "Family history of cancer",       type: "RISK_FACTOR", categories: ["NON_SPECIFIC"] }
];

export const POC_EXTRA_ALIASES = {
  "Dyspnoea": [
    "shortness of breath",
    "short of breath",
    "out of breath",
    "getting out of breath",
    "getting breathless",
    "breathless",
    "breathlessness",
    "puffed out",
    "leaves me puffed",
    "leaves me puffing",
    "puffing",
    "can't catch my breath",
    "catch my breath",
    "hard to breathe",
    "difficulty breathing",
    "trouble breathing"
  ],
  "Night sweats": [
    "night sweats",
    "sweating at night",
    "waking up sweating",
    "waking up drenched",
    "drenched at night",
    "drenched in sweat",
    "drenched in sweat at night",
    "soaking the sheets",
    "soaking sheets",
    "soak the sheets",
    "soaking wet at night",
    "sweating during the night",
    "wake up drenched"
  ],
  "Anaemia": [
    "anaemia",
    "anemia",
    "iron deficiency",
    "low iron",
    "low haemoglobin",
    "feel pale",
    "looking pale",
    "look pale",
    "i look pale",
    "i'm pale",
    "look really pale",
    "people keep saying I look pale",
    "people keep commenting that I look pale",
    "keep commenting that I look pale",
    "keep commenting i look pale",
    "look pale lately",
    "looking pale recently",
    "look pale recently"
  ],
  "New lump": [
    "found a lump",
    "felt a lump",
    "a lump",
    "noticed a lump",
    "there's a lump"
  ],
  "Family history of cancer": [
    "family history of cancer",
    "my mother had cancer",
    "mother had cancer",
    "my mum had cancer",
    "mum had cancer",
    "my father had cancer",
    "father had cancer",
    "my dad had cancer",
    "dad had cancer",
    "my sister had cancer",
    "sister had cancer",
    "my brother had cancer",
    "brother had cancer",
    "older brother had cancer",
    "my older brother had cancer",
    "younger brother had cancer",
    "auntie had cancer",
    "aunt had cancer",
    "grandmother had cancer",
    "grandfather had cancer",
    "uncle had cancer",
    "cancer runs in my family",
    "cancer in the family",
    "cancer in our family",
    "had cancer in his forties",
    "had cancer in his sixties",
    "had cancer at",
    "both had cancer",
    "brother had cancer in his forties"
  ]
};
