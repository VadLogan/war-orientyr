---
name: translate-missing
description: Translate new Ukrainian digest strings to English. Use after publishing or syncing a new issue, or when the user says "translate missing", "i18n missing", "fill English translations", or asks to translate the new digest to en.
---

# Translate missing strings (UA → EN)

1. Run `npm run i18n:missing`. It writes `i18n/missing.json`: every untranslated Ukrainian string mapped to `""`. If it reports 0, stop.
2. Read `i18n/missing.json` in full.
3. Before translating, look up how `i18n/en.json` already renders recurring terms (sources, place names, direction names, loss categories, section names), e.g.:
   ```bash
   node -e 'const e=require("./i18n/en.json");for(const t of process.argv.slice(1)){const k=Object.keys(e).find(k=>k.includes(t));if(k)console.log(k.slice(0,120),"=>",e[k].slice(0,160))}' "Главком" "заявлено рф" "Жертви війни"
   ```
   Reuse those renderings exactly. If a text points to a section in quotes, use that section's English UI name from `en.json` (for example «Жертви війни» → “War victims”, «Удари та ППО» → “Strikes & air defence”).
4. Fill in every value. The keys are long and must match exactly, so don't retype them. Write a scratchpad script that loads `missing.json`, zips `Object.keys()` with an ordered array of translations, asserts the counts match, and writes the file back.
5. Run `npm run i18n:merge`, then `npm run i18n:missing` (it should report 0), then `npm run validate`.
6. Don't commit unless the user asks.

## House style
- Translate the raw text. Don't add house-style formatting such as flags; the app applies that at render time.
- Write lowercase “russia / russian / kremlin”, even at the start of a sentence.
- Use British spelling (defence, armoured, hospitalised, centre).
- Use curly quotes “ ” and the apostrophe ’. Write numbers with comma thousands separators (1,790; ~1,561,020). Keep dates as DD.MM (15.10) and long dates as “16 October 2026”.
- Glossary:
  - Генштаб ЗСУ → Ukraine’s General Staff
  - Повітряні сили → Ukraine’s Air Force
  - ВМС ЗСУ → Ukraine’s Navy
  - Міноборони рф → russia’s MoD
  - МЗС рф → russia’s Foreign Ministry
  - СБС → USF
  - ОК «Південь» → Operational Command “South”
  - ОВА → RMA
  - ДСНС → State Emergency Service
  - Нацполіція → National Police
  - заявлено рф → claimed by russia
  - у переказі → as retold (by X)
  - КАБ → KAB guided bombs / KABs
  - НРК → UGVs
- Directions:
  - Покровський → Pokrovsk
  - Костянтинівський → Kostiantynivka
  - Південно-/Північно-Слобожанський → South/North Slobozhanskyi
  - Гуляйпільський → Huliaipole
  - Олександрівський → Oleksandrivka
  - Придніпровський → Prydniprovskyi
  - Use “— N each” for «по N».
- Media:
  - Главком → Glavcom
  - Слово і Діло → Slovo i Dilo
  - АрміяInform → ArmyInform
  - Оглядач → Obozrevatel
  - Еспресо → Espreso
  - Укрпогляд → Ukrpohliad
  - 24 Канал → 24 Kanal
  - Українська правда → Ukrainska Pravda
  - Укрінформ → Ukrinform
  - Нова газета Європа → Novaya Gazeta Europe
  - РІА «Новини» → RIA Novosti
- Transliteration: use Ukrainian romanisation for Ukrainian places and people (Kropyvnytskyi, Andrii Raikovych). Use the standard English form for places and people in russia (Borisoglebsk, Alexander Gusev, Dmitry Peskov).
