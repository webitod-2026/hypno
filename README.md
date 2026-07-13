# Site · Mist Grove · Елена Самбур

Статичний лендинг (UA) + юридичні сторінки.

## Відкрити локально

```bash
# з кореня репо
cd site
# будь-який статичний сервер, напр.:
npx --yes serve .
# або Python:
python -m http.server 5173
```

Відкрийте `http://localhost:5173` (або порт, який видасть сервер).

## GitHub Pages

Сайт лежить у папці **`site/`** (не в корені репо).

### Правильно
1. Settings → Pages → Source: **GitHub Actions**  
   (workflow `.github/workflows/deploy-pages.yml` деплоїть саме `site/`)
2. Або Pages → Deploy from branch → folder **`/site`** (якщо інтерфейс дозволяє)

### Неправильно
- залити лише `index.html` без `css/`, `js/`, `assets/`
- відкривати корінь репо як сайт (`css/styles.css` тоді 404 → «голий» список з буллетами)

Перевірка на Pages: відкрийте  
`https://USER.github.io/REPO/css/styles.css` — має віддатися CSS, не 404.

## Адаптив

Mobile-first. Перевірте в DevTools:

| Діапазон | Поведінка |
|----------|-----------|
| &lt; 600px | 1 колонка, full-width CTA, hamburger, компактний hero |
| 600–899px | 2 col pain/steps/offers частково, hamburger |
| 900px+ | desktop nav |
| 1024px+ | split method, 3 offers, 5 steps |

Safe-area для notch/home indicator. Без горизонтального скролу.

## Файли

| Файл | |
|------|--|
| `index.html` | Лендінг |
| `privacy.html` | Персональні дані |
| `disclaimer.html` | Відмова від відповідальності |
| `terms.html` | Умови |
| `cookies.html` | Cookies |
| `css/styles.css` | Mist Grove tokens + layout |
| `js/main.js` | Nav, booking form stub, reveal |

## Запис

Кнопки ведуть на `#zapis` (форма). Бекенд відправки - підключити пізніше (email / CRM / webhook).

## Фото

Локально: `site/assets/images/`

| Файл | Секція |
|------|--------|
| `hero-forest.jpg` | Hero |
| `method-morning.jpg` | Method |
| `session-forest.jpg` | Session |
| `final-path.jpg` | Final CTA |
| `elena-sambur-portrait.jpg` | About (оброблений портрет) |
| `about-sample-stock.jpg` | старий stock-референс |

Джерело портрета: `photo_orig/elena_sambur.jpg` · скрипт: `_process_assets.py`
