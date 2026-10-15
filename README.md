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
Новий випуск: `npm run publish -- шлях/до/нового-digest.json` — поточний `digest.json` переноситься в архів (`issues/<дата>.json`), новий стає `digest.json`, дата додається в `issues/index.json` (той самий день — заміна без архівування). Далі `npm run validate` і переклад (`npm run i18n:missing` → `npm run i18n:merge`).

Поки Artifact лишається основним, щоденна задача публікує дані в Artifact. Щоб Next.js-копія не відставала, скопіюйте у `public/`
файли `digest.json`, `issues/<дата>.json`, `issues/index.json`, `strikes.json` (і за потреби `prices.json`, `recruit.json`, `maps/maps.json`),
потім `npm run validate` і коміт — Vercel перебудує сайт. `landcost.json` і `maps/strikes-base.json` не змінюються.

Англійська версія: `npm run i18n:missing` створює `i18n/missing.json` з новими рядками без перекладу; заповніть англійські значення, виконайте `npm run i18n:merge` і закомітьте `i18n/en.json`. Поки переклад не додано, сторінки `/en` показують українські тексти з приміткою.

## Наступний крок
Перемкнути щоденну задачу на запис у репозиторій; вимкнути Artifact-версію.
