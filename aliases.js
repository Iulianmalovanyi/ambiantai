// =====================================================================
// Hand-authored speech aliases for high-yield factors.
//
// Each entry: canonical factor name (must match a FACTORS[].name) →
// array of natural-speech phrasings.
//
// Matched case-insensitively with K=2 stuffer-word flexibility (e.g. alias
// "pain in my stomach" can match "pain [low down] in my stomach"). The
// negation heuristic suppresses obvious negations.
// =====================================================================

export const ALIASES = {

  // ---------------- Respiratory / chest ----------------
  "Cough": [
    "cough", "coughing", "having a cough", "have a cough", "had a cough",
    "started coughing", "keep coughing", "been coughing", "won't stop coughing",
    "can't stop coughing", "persistent cough", "chronic cough", "nagging cough",
    "dry cough", "wet cough", "tickly cough", "chesty cough", "hacking cough",
    "cough that won't go away", "lingering cough", "irritating cough",
    "cough won't go away", "coughing so much", "coughed and noticed"
  ],

  "Haemoptysis": [
    "coughing up blood", "cough up blood", "coughed up blood",
    "blood when I cough", "blood in my phlegm", "blood in phlegm",
    "blood in the phlegm", "blood in my mucus", "blood in sputum",
    "blood-stained sputum", "spitting blood", "spit up blood",
    "blood-streaked phlegm", "blood streaks in phlegm", "streaks of blood",
    "streak of blood in the phlegm", "tiny streaks of blood",
    "blood mixed in with the phlegm", "blood mixed with phlegm",
    "blood in what I brought up", "brought up blood", "blood in spit"
  ],

  // ---------------- Swallowing / upper GI ----------------
  "Dysphagia": [
    "difficulty swallowing", "trouble swallowing", "hard to swallow",
    "harder to swallow", "food gets stuck", "food sticks",
    "food won't go down", "can't swallow properly", "can't swallow",
    "struggle to swallow", "swallowing problems", "problems swallowing",
    "feels like food is stuck", "feels lodged", "felt lodged",
    "swallowing feels strange", "swallowing has become difficult",
    "swallowing feels different", "food was going down slowly",
    "food was slow going down", "have to wash food down"
  ],

  "Odynophagia (painful swallowing)": [
    "painful swallowing", "swallowing hurts", "hurts to swallow",
    "painful to swallow", "pain when I swallow", "pain on swallowing",
    "swallowing has become painful", "swallowing is painful",
    "painful when I swallow", "sharp discomfort when I swallow",
    "becomes painful to swallow", "swallowing has actually become painful",
    "painful with hot drinks",
    // Captures pattern "[swallowing] has actually become painful, especially with hot drinks"
    // where the "it" referent is swallowing (anaphoric). PoC-grade.
    "actually become painful", "become painful too",
    "actually become painful too", "become painful with hot drinks"
  ],

  "Heartburn": [
    "heartburn", "indigestion", "burning in my chest",
    "burning sensation in my chest", "burning sensation rising",
    "burning feeling rising", "burning feeling in my chest",
    "horrible burning feeling", "horrible indigestion",
    "burning after eating", "fire in my chest"
  ],

  "Reflux": [
    "reflux", "acid reflux", "acid coming up", "acid coming back up",
    "acid coming back", "acid back up", "food coming back up",
    "bringing food back", "regurgitation", "regurgitating",
    "feel acid", "feel acid coming up"
  ],

  // ---------------- Weight / appetite / fatigue ----------------
  "Weight loss": [
    "weight loss", "losing weight", "lost weight", "I've lost weight",
    "I've been losing weight", "dropping weight", "dropped weight",
    "shedding weight", "shed weight", "weight has gone down",
    "weight's dropped", "lost a lot of weight", "lost some pounds",
    "lost a stone", "lost almost a stone", "dropped a stone",
    "dropped almost a stone", "few kilos lighter", "lost a bit of weight",
    "lost quite a bit of weight", "lost a noticeable amount of weight",
    "noticeable amount of weight", "trousers feel loose",
    "clothes feel loose", "clothes are loose", "clothes are looser",
    "clothes fitting looser", "clothes feel looser", "clothes are definitely looser",
    "clothes are hanging off me", "clothes are hanging off",
    "hanging off me", "belt is looser", "unintentional weight loss",
    "unexplained weight loss", "weight has come off", "thinner",
    "look thinner", "looking thinner", "I look thinner",
    "look like I've lost weight", "look like I have lost weight"
  ],

  "Appetite loss": [
    "no appetite", "lost my appetite", "loss of appetite", "lost appetite",
    "not hungry", "never hungry", "off my food", "can't eat much",
    "can't face food", "not eating like I used to", "not eating much",
    "barely eating", "barely enjoying meals", "appetite has gone",
    "appetite's gone", "appetite is gone", "appetite's not great",
    "appetite is not great", "appetite's been poor", "appetite is poor",
    "no interest in food", "lost interest in food", "completely lost my appetite",
    "completely lost appetite", "food doesn't appeal", "dreading mealtimes",
    "dread mealtimes", "dread eating", "stopped enjoying food",
    "eating much smaller portions", "smaller portions", "eating smaller meals",
    "eating less", "eating less overall", "eating much less",
    "i'm eating less", "i am eating less", "i've started eating less",
    "i've stopped enjoying food", "getting full really quickly",
    "full really quickly", "get full quickly", "getting full quickly",
    "few bites and", "after a few bites", "barely eat", "barely eaten",
    "started avoiding meals", "avoiding meals", "avoiding eating",
    "don't enjoy eating", "don't enjoy food",
    "don't really enjoy food", "don't enjoy eating anymore",
    "lose interest in food", "completely lose interest in food"
  ],

  "Severe unexplained fatigue": [
    "tired", "very tired", "really tired", "feel tired", "feeling tired",
    "I'm tired", "always tired", "tired all the time", "tired constantly",
    "constantly tired", "exhausted", "feel exhausted", "exhausted all the time",
    "exhausted constantly", "constantly exhausted", "drained", "feel drained",
    "properly drained", "completely drained", "feel completely drained",
    "feel completely wiped out", "wiped out", "feel wiped out", "knackered",
    "shattered", "worn out", "fatigue", "fatigued", "tiredness",
    "no energy", "low energy", "lack of energy", "lethargic", "lethargy",
    "run down", "feel run down", "feeling run down", "generally run down",
    "can't keep my eyes open", "sleeping all the time", "barely stay awake",
    "wake up tired", "wake up exhausted", "wake up feeling tired",
    "i wake up tired", "tired really easily", "tired easily",
    "drained all the time"
  ],

  // ---------------- Abdominal / GI ----------------
  "Abdominal pain": [
    "abdominal pain", "pain in my abdomen", "stomach pain", "stomach ache",
    "stomach hurts", "tummy pain", "tummy ache", "belly pain", "belly ache",
    "pain in my stomach", "pain in my tummy", "pain in my belly",
    "pain low in my stomach", "pain low in my abdomen", "pain low down in my abdomen",
    "pain low down in my stomach", "low down in my abdomen", "low in my stomach",
    "low in my abdomen", "dull ache in my stomach", "dull ache in my abdomen",
    "ache low in my stomach", "ache low in my abdomen", "ache in my stomach",
    "ache in my abdomen", "ache in my belly", "dull cramping pain",
    "cramping pain", "stomach cramps", "cramps in my stomach",
    "abdominal discomfort", "discomfort in my abdomen", "discomfort in my tummy",
    "discomfort low down in my abdomen", "vague discomfort low down",
    "pelvic pain", "pain low down in my pelvis", "dull ache low",
    "constant pressure in my abdomen", "gut pain"
  ],

  "Abdominal bloating or distension": [
    "bloating", "bloated", "bloated feeling", "feel bloated", "feeling bloated",
    "tummy bloated", "stomach bloated", "swollen tummy", "swollen stomach",
    "stomach feels swollen", "stomach constantly feels swollen",
    "constantly feels swollen", "stomach feels heavy", "feels swollen",
    "feels swollen and heavy", "distended abdomen", "abdominal distension",
    "tummy feels full", "feels like I'm pregnant", "look pregnant",
    "months pregnant", "trousers feel tight", "visibly bloated"
  ],

  "Nausea": [
    "nausea", "nauseous", "feel sick", "feeling sick", "feel sick after meals",
    "I'm sick", "queasy", "feel queasy", "feels like I'm going to be sick",
    "stomach is churning"
  ],

  "Vomiting": [
    "vomiting", "throwing up", "throw up", "been sick", "been vomiting",
    "I'm being sick", "keep being sick", "puking", "retching"
  ],

  "Change in bowel habit": [
    "change in bowel habit", "bowel habit has changed", "bowels have changed",
    "different bowel movements", "going more often", "going to the toilet more",
    "going to the toilet much more", "going to the toilet much more often",
    "going to the toilet more often", "rushing to the toilet",
    "going more frequently", "going less often", "looser stools",
    "alternating constipation and diarrhoea", "alternating between diarrhoea and constipation",
    "alternating between constipation and diarrhoea", "alternating diarrhoea and constipation",
    "not regular anymore", "irregular bowel movements", "toilet habits have changed",
    "digestion has changed", "digestion's definitely changed",
    "going to the loo more", "going to the loo more often",
    "bowel habits have changed", "bowel habits are strange",
    "either rushing to the toilet", "either rushing",
    "either running to the toilet", "running to the toilet",
    "very urgent", "really urgent",
    "three or four times a day", "several times a day",
    "going much more often", "much more often", "bowels are unpredictable",
    "stomach's been unpredictable", "stomach has been unpredictable"
  ],

  "Constipation": [
    "constipated", "constipation", "can't go to the toilet",
    "haven't opened my bowels", "haven't been to the toilet",
    "not been to the toilet", "trouble going", "hard stools",
    "bunged up", "blocked up", "completely blocked up",
    "straining when I go", "blocked up for days", "constipated for days",
    "barely go", "can barely go", "barely able to go",
    "barely go at all", "barely going to the toilet",
    "feel completely blocked up", "completely blocked",
    "constipated for ages"
  ],

  "Diarrhoea": [
    "diarrhoea", "diarrhea", "loose stools", "loose motions",
    "really loose", "very loose", "stools are loose", "stool is loose",
    "runny tummy", "the runs", "watery stools", "going to the toilet a lot",
    "loose poo", "loose poos", "loose stool", "stools have been loose",
    "running to the toilet", "rushing to the toilet",
    "rushing to the toilet several times", "rushing to the toilet a few times",
    "going to the toilet far more often", "going to the toilet much more often",
    "going several times a day", "three or four times a day",
    "several times a day", "many times a day"
  ],

  // ---------------- Bleeding ----------------
  "Rectal bleeding": [
    "rectal bleeding", "bleeding from the bottom", "bleeding from my bottom",
    "bleeding when I go to the toilet", "bleeding when I poo",
    "blood in my poo", "blood in my stool", "blood in stool",
    "blood in stools", "blood in my stools", "blood when I wipe",
    "blood on the tissue", "blood on the paper", "blood on the toilet paper",
    "blood when I opened my bowels", "blood when I open my bowels",
    "blood when opening my bowels", "blood after opening my bowels",
    "blood when going to the toilet", "blood going to the toilet",
    "blood in the toilet", "blood in the bowl", "noticed blood when I",
    "bloody stool", "bloody stools", "passing blood",
    "blood mixed in with my stool", "blood mixed with my stool",
    "blood mixed with stool", "blood mixed in with stool",
    "noticed blood", "spotting blood"
  ],

  "Haematuria - visible and recurrent or persistent despite UTI treatment": [
    "blood in my urine", "blood in my pee", "blood in my wee",
    "blood when I wee", "blood when I urinate", "blood when I pee",
    "blood in the toilet bowl", "pink urine", "red urine", "dark urine",
    "haematuria", "passing blood when I urinate"
  ],

  "Postmenopausal vaginal bleeding (bleeding >12 months after menses have stopped)": [
    "postmenopausal bleeding", "bleeding after menopause",
    "spotting after menopause", "bleeding after the change",
    "started bleeding again", "bleeding again", "had bleeding again",
    "noticed bleeding again", "had bleeding again last month",
    "started bleeding again recently", "period came back",
    "vaginal bleeding after menopause", "bleeding again after menopause"
  ],

  "Abnormal vaginal bleeding (pre or peri menopausal)": [
    "abnormal vaginal bleeding", "abnormal bleeding", "vaginal bleeding",
    "bleeding between periods", "spotting between periods",
    "heavier periods", "longer periods", "irregular vaginal bleeding"
  ],

  "Irregular menstrual bleeding": [
    "irregular periods", "periods are irregular", "missed periods",
    "skipped a period", "skip them altogether", "skip them",
    "skip altogether", "irregular bleeding", "more irregular",
    "periods have become irregular", "periods have become strange",
    "periods are strange", "periods have become more irregular",
    "sometimes heavier", "sometimes much heavier", "sometimes late altogether",
    "sometimes I skip them"
  ],

  // ---------------- Lumps ----------------
  "Breast lump": [
    "breast lump", "lump in my breast", "lump in the breast",
    "lump in my right breast", "lump in my left breast",
    "small lump in my breast", "felt a lump in my breast",
    "found a lump in my breast", "found a lump in my right breast",
    "found a lump in my left breast", "noticed a lump in my breast",
    "noticed a small lump in my", "something in my breast",
    "mass in my breast", "feeling something in my breast"
  ],

  "Neck lump or mass": [
    "neck lump", "lump in my neck", "lump on my neck",
    "lump on the side of my neck", "lump on side of my neck",
    "swollen lump in my neck", "swollen lump on my neck",
    "swelling in my neck", "swollen neck", "swollen glands",
    "swollen lymph nodes", "neck mass", "noticed a lump on the side of my neck"
  ],

  "Testicular lump": [
    "testicular lump", "lump in my testicle", "lump in my testicles",
    "lump on my testicle", "lump on my testicles", "lump in my balls",
    "lump on one of my testicles", "lump in one of my testicles",
    "small lump on one of my testicles", "small lump on my testicle",
    "ball feels different", "lump down there"
  ],

  "Persistent or unexplained testicular symptoms": [
    "swollen testicle", "swollen balls", "pain in my testicle",
    "testicular pain", "ache in my testicle", "aching feeling there",
    "dull ache through the day", "dull aching feeling",
    "heaviness in my testicle", "testicle has changed",
    "side feels heavier", "feeling heavier on that side",
    "feels heavier on that side", "side feels swollen",
    "side feels swollen sometimes", "side started feeling heavier",
    "started feeling heavier", "heavy dragging feeling",
    "dragging feeling", "dull dragging ache", "dull ache that comes and goes",
    "ache that comes and goes", "side feels heavier and occasionally swollen",
    "occasionally swollen", "occasionally it aches", "occasionally aches"
  ],

  // ---------------- Risk factors ----------------
  "Past or current smoker": [
    "smoke", "smoker", "smoking", "I smoke", "I'm a smoker", "I do smoke",
    "I've smoked", "started smoking", "started to smoke", "current smoker",
    "I used to smoke", "used to smoke", "ex-smoker", "former smoker",
    "gave up smoking", "quit smoking", "stopped smoking", "smoked for years",
    "I've smoked for years", "smoked most of my adult life",
    "smoked heavily", "smoked quite heavily", "smoked since I was",
    "smoking since I was", "been smoking since", "I've been smoking",
    "still smoke", "I still smoke", "pack a day", "half a pack a day",
    "ten a day", "ten cigarettes a day", "fifteen cigarettes a day",
    "twenty a day", "twenty cigarettes a day", "thirty years",
    "smoke cigarettes", "smoke roll-ups", "having a cigarette",
    "having cigarettes"
  ],

  "Family history of breast cancer": [
    "family history of breast cancer", "breast cancer runs in the family",
    "mum had breast cancer", "my mum had breast cancer",
    "mother had breast cancer", "my mother had breast cancer",
    "sister had breast cancer", "my sister had breast cancer",
    "daughter had breast cancer", "aunt had breast cancer",
    "my aunt had breast cancer", "auntie had breast cancer",
    "grandmother had breast cancer", "my grandmother had breast cancer",
    "mum and aunt both had breast cancer", "mum and grandmother both had breast cancer",
    "mother and grandmother had breast cancer"
  ],

  "Family history of colorectal cancer": [
    "family history of bowel cancer", "bowel cancer in the family",
    "family history of colon cancer", "colon cancer in the family",
    "dad had bowel cancer", "my dad had bowel cancer",
    "father had bowel cancer", "mum had bowel cancer",
    "my mum had bowel cancer", "mother had bowel cancer",
    "brother had bowel cancer", "sister had bowel cancer"
  ],

  "Family history of lung cancer": [
    "family history of lung cancer", "lung cancer in the family",
    "dad had lung cancer", "my dad had lung cancer",
    "father had lung cancer", "mum had lung cancer",
    "mother had lung cancer", "dad died from lung cancer",
    "my dad died from lung cancer", "father died from lung cancer",
    "brother had lung cancer", "older brother had lung cancer"
  ],

  "Family history of ovarian cancer": [
    "family history of ovarian cancer", "ovarian cancer in the family",
    "mum had ovarian cancer", "sister had ovarian cancer",
    "auntie had ovarian cancer"
  ],

  "Family history of prostate cancer": [
    "family history of prostate cancer", "prostate cancer in the family",
    "dad had prostate cancer", "father had prostate cancer",
    "brother had prostate cancer"
  ],

  // ---------------- Skin / general ----------------
  "Jaundice": [
    "jaundice", "jaundiced", "yellow skin", "skin has gone yellow",
    "skin looks yellow", "eyes have gone yellow", "yellow eyes",
    "whites of my eyes are yellow", "looking yellow"
  ],

  // ---------------- Head and neck ----------------
  "Unexplained persistent sore throat (e.g. more than 3 weeks)": [
    "sore throat", "persistent sore throat", "throat keeps hurting",
    "throat won't get better", "ongoing sore throat", "scratchy throat",
    "scratchy throat that won't go", "throat is sore", "throat's been bad",
    "throat has been bad", "irritated throat", "throat is irritated",
    "throat feels irritated", "throat's been irritated",
    "throat has been irritated", "irritated sore throat",
    "throat that never settles", "throat never settles"
  ],

  "Voice changes": [
    "voice has changed", "voice sounds different", "voice change",
    "voice sounds rough", "voice has sounded rough", "voice sounded rough",
    "voice's rough", "lost my voice", "weak voice", "raspy voice",
    "croaky voice", "voice sounds completely different"
  ],

  "Persistent hoarseness": [
    "hoarse", "hoarseness", "hoarse voice", "husky voice", "voice is hoarse",
    "been hoarse for weeks", "really hoarse", "constantly hoarse",
    "I'm hoarse", "become really hoarse", "i've become really hoarse",
    "really hoarse lately"
  ],

  "Sensation of a lump in the throat": [
    "lump in my throat", "feels like something stuck in my throat",
    "feels like there's something stuck in my throat", "something stuck in my throat",
    "something stuck there", "something in my throat",
    "ball in my throat", "feels blocked in my throat",
    "globus sensation", "feels like there's something stuck"
  ],

  // ---------------- Pelvic / gynae ----------------
  "Vulval pruritus or pain": [
    "vulval itch", "itchy down there", "itching down below",
    "itching and discomfort down below", "itching down below that",
    "vulval pain", "pain down below", "soreness down below",
    "itching down there"
  ],

  // ---------------- Other ----------------
  "Back pain": [
    "back pain", "pain in my back", "my back hurts", "aching back",
    "backache", "sore back"
  ],

  "Bone pain": [
    "bone pain", "pain in my bones", "my bones hurt", "aching bones",
    "deep bone ache"
  ],

  // ---------------- Neurology ----------------
  "Headache - isolated, new-onset, daily headache of less than 12 weeks duration": [
    "headache", "headaches", "new headache", "daily headache",
    "headache every day", "headaches every day", "head hurts",
    "splitting headache", "bad headache", "constant headache",
    "headaches almost every day", "headaches nearly every day",
    "headaches basically every day", "headaches every day recently",
    "horrible headaches", "horrible headaches almost every day"
  ],

  "Confusion": [
    "confused", "confusion", "feeling confused", "feel confused",
    "seem confused", "muddled", "can't think clearly", "foggy brain",
    "forgetful", "forgetfulness", "memory problems", "really forgetful",
    "become forgetful", "i've become forgetful", "i have become forgetful",
    "lose track of conversations", "lose track of what I'm saying",
    "lose track halfway", "losing track halfway", "losing track",
    "losing words", "losing words halfway", "lose words halfway",
    "lost track halfway", "zoning out", "zoning out during conversations",
    "keep repeating myself", "keep forgetting", "forget simple things",
    "walk into rooms and forget", "forget why I went there",
    "forget halfway through", "forget halfway"
  ],

  "New onset seizures": [
    "seizure", "seizures", "had a fit", "fits", "had a seizure",
    "had a seizure or fit", "had some kind of seizure",
    "had some sort of seizure", "kind of seizure",
    "sort of seizure", "convulsion", "convulsions",
    "blacked out and shook", "blacked out briefly", "arms were jerking",
    "had some kind of fit", "collapsed and had", "had a fit or seizure"
  ],

  "Dysuria": [
    "dysuria", "painful to pee", "burning when I pee",
    "burning when I urinate", "stinging when I urinate",
    "pain when I wee", "hurts when I urinate", "burning when peeing"
  ]
};
