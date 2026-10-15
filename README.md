# war-digest-next — «Щоденний дайджест війни» на Next.js

Сторінка повністю на React (Next.js App Router); дизайн і поведінка ті самі, що в оригінальному Artifact.

- `app/layout.tsx` — шрифти, метадані; `app/globals.css` — стилі з оригінального `index.html` без змін.
- Сторінки генеруються під час збірки: `/`, `/2026-10-07`, `/en/…`, `/dashboard/…` (маршрути в `app/(uk)` і `app/(en)`); «Дайджест» — серверні компоненти без клієнтського JS, старі посилання `#дата` перенаправляються.
- `components/digest/` — вкладка «Дайджест»; `components/dash/` — «Дашборд» (графіки — JSX SVG, карти — d3-geo/d3-zoom).
- `lib/` — рядки інтерфейсу (`ui.ts`), домашній стиль і форматування (`text.ts`), іконки, дані ударів; `types/digest.ts` — типи даних.
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

## Наступний крок
Перемкнути щоденну задачу на запис у репозиторій; вимкнути Artifact-версію.
