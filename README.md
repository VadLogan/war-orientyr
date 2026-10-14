# war-digest-next — «Щоденний дайджест війни» на Next.js

Фаза 1 міграції (strangler): сторінка вже працює як Next.js (App Router), дизайн і поведінка не змінені.

- `app/layout.tsx` — шрифти, метадані; `app/globals.css` — стилі з оригінального `index.html` без змін.
- `app/page.tsx` — розмітка-оболонка на React; `components/LegacyApp.tsx` — завантажує d3 і `public/legacy/app.js`
  (оригінальний скрипт 1:1, ~360 КБ), який малює всі вкладки, карти й графіки.
- `public/*.json`, `public/issues/`, `public/maps/` — ті самі файли даних і ті самі відносні шляхи (`digest.json`, `issues/YYYY-MM-DD.json`, …).
- `tools/maps/` — інструменти оновлення знімків карт (`extract.js`, `build.py`).

## Запуск
```
npm install
npm run validate   # перевірка JSON і ключів схеми
npm run dev        # http://localhost:3000
npm run build && npm start
```
Деплой: імпортуйте репозиторій у Vercel/Netlify (без додаткових налаштувань).

## Щоденне оновлення даних
Поки Artifact лишається основним, щоденна задача публікує дані в Artifact. Щоб Next.js-копія не відставала, скопіюйте у `public/`
файли `digest.json`, `issues/<дата>.json`, `issues/index.json`, `strikes.json` (і за потреби `prices.json`, `recruit.json`, `maps/maps.json`),
потім `npm run validate` і коміт — Vercel перебудує сайт. `landcost.json` і `maps/strikes-base.json` не змінюються.

## Наступні фази (план)
1. Типи для JSON (`types/digest.ts`) і серверне завантаження даних (`fetch` у Server Components замість `fetch` у браузері).
2. Винести рендер вкладки «Дайджест» у React-компоненти (секції, пункти, розбіжності, джерела).
3. «Дашборд»: плитки, графіки (d3 → React-компоненти), блоки «Ціна кілометра», «Набір проти втрат», вартість обстрілу.
4. Карти (порівняння DeepState/ISW/DIVGEN, карта ударів) як клієнтські компоненти; лінива підгрузка.
5. Перемкнути щоденну задачу на запис у репозиторій; вимкнути Artifact-версію.
