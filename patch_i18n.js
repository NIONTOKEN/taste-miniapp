const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'i18n.ts');
let content = fs.readFileSync(file, 'utf8');

// Check if already patched
if (content.includes('"hard_cap_title"')) {
  console.log('hard_cap keys already exist. Nothing to do.');
  process.exit(0);
}

// EN: Insert hard_cap keys before "lock_reason_title" in EN section
const enSearch = `                    "lock_reason_title": "\uD83D\uDD12 Why Was So Much Token Locked?"`;
const enReplace = `                    "hard_cap_title": "Hard Cap Commitment",\r\n                    "hard_cap_desc": "TASTE is a finite digital asset. The total supply is permanently capped at 25,000,000. This is a core promise to all holders:",\r\n                    "hard_cap_points": [\r\n                        "25,000,000 TASTE hard cap - immutable and final",\r\n                        "No new tokens will ever be minted. Zero. Never.",\r\n                        "88.4% is locked in JVault - circulating supply is extremely limited",\r\n                        "Scarcity is baked into the design, not just a promise"\r\n                    ],\r\n                    "lock_reason_title": "\uD83D\uDD12 Why Was So Much Token Locked?"`;

if (content.includes(enSearch)) {
  content = content.replace(enSearch, enReplace);
  console.log('EN hard_cap keys added.');
} else {
  console.log('EN search string not found! Trying alternate...');
  // Try without the emoji
  const enSearch2 = '"lock_reason_title": "🔒 Why Was So Much Token Locked?"';
  if (content.includes(enSearch2)) {
    content = content.replace(enSearch2, enReplace.replace('\uD83D\uDD12', '🔒'));
    console.log('EN hard_cap keys added (alternate match).');
  } else {
    console.log('EN: Could not find insertion point.');
  }
}

// TR: Insert hard_cap keys before Turkish "lock_reason_title"
const trSearch = '"lock_reason_title": "\uD83D\uDD12 Neden Bu Kadar';
const trSearch2 = '"lock_reason_title": "🔒 Neden Bu Kadar';

const trReplace = `"hard_cap_title": "Hard Cap Taahhüdü",\r\n                    "hard_cap_desc": "TASTE sonlu bir dijital varliktir. Toplam arz sonsuza dek 25.000.000 TASTE ile sinirlidir. Tüm sahiplerimize verilen temel taahhütlerimiz:",\r\n                    "hard_cap_points": [\r\n                        "25.000.000 TASTE hard cap - degistirilemez ve kalicidir",\r\n                        "Hicbir zaman yeni token üretilmeyecektir. Sifir. Asla.",\r\n                        "%88.4 JVault kilidi - dolasimda arz son derece sinirli",\r\n                        "Kitlik tasarima islenmistir, sadece bir söz degil"\r\n                    ],\r\n                    ` + trSearch2;

if (content.includes(trSearch)) {
  content = content.replace(trSearch, `"hard_cap_title": "Hard Cap Taahhüdü",\r\n                    "hard_cap_desc": "TASTE sonlu bir dijital varliktir. Toplam arz sonsuza dek 25.000.000 TASTE ile sinirlidir. Tüm sahiplerimize verilen temel taahhütlerimiz:",\r\n                    "hard_cap_points": [\r\n                        "25.000.000 TASTE hard cap - degistirilemez ve kalicidir",\r\n                        "Hicbir zaman yeni token üretilmeyecektir. Sifir. Asla.",\r\n                        "%88.4 JVault kilidi - dolasimda arz son derece sinirli",\r\n                        "Kitlik tasarima islenmistir, sadece bir söz degil"\r\n                    ],\r\n                    ` + trSearch);
  console.log('TR hard_cap keys added.');
} else if (content.includes(trSearch2)) {
  content = content.replace(trSearch2, `"hard_cap_title": "Hard Cap Taahhüdü",\r\n                    "hard_cap_desc": "TASTE sonlu bir dijital varliktir. Toplam arz sonsuza dek 25.000.000 TASTE ile sinirlidir. Tüm sahiplerimize verilen temel taahhütlerimiz:",\r\n                    "hard_cap_points": [\r\n                        "25.000.000 TASTE hard cap - degistirilemez ve kalicidir",\r\n                        "Hicbir zaman yeni token üretilmeyecektir. Sifir. Asla.",\r\n                        "%88.4 JVault kilidi - dolasimda arz son derece sinirli",\r\n                        "Kitlik tasarima islenmistir, sadece bir söz degil"\r\n                    ],\r\n                    ` + trSearch2);
  console.log('TR hard_cap keys added (alternate match).');
} else {
  console.log('TR: Could not find insertion point.');
}

fs.writeFileSync(file, content, 'utf8');
console.log('File saved successfully.');
