import fs from 'fs';
import path from 'path';

const articlesPath = 'D:/_DEVE/framework_techno4/TECHNO4FRAMEWORK2/docs-site/content/articles-index.json';
const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));

// All Framework7 Core Components from packages/techno4-framework2-core/src/components
const coreComponentsDir = 'D:/_DEVE/framework_techno4/TECHNO4FRAMEWORK2/packages/techno4-framework2-core/src/components';
const coreComponents = fs.readdirSync(coreComponentsDir).filter(d => fs.statSync(path.join(coreComponentsDir, d)).isDirectory());

// F7 Docs Core Sections mapping
const f7StandardSections = [
  // Getting Started / Architecture
  { category: 'Вступ та Архітектура', name: 'Introduction', slug: 'introduction', alias: 'introduction' },
  { category: 'Вступ та Архітектура', name: 'Installation', slug: 'installation', alias: 'installation' },
  { category: 'Вступ та Архітектура', name: 'Package Structure', slug: 'package-structure', alias: 'package-structure' },
  { category: 'Вступ та Архітектура', name: 'App HTML Layout', slug: 'app-html-layout', alias: 'app-html-layout' },
  { category: 'Вступ та Архітектура', name: 'RTL Layout', slug: 'rtl-layout', alias: 'rtl-layout' },
  { category: 'Вступ та Архітектура', name: 'Initialize App', slug: 'initialize-app', alias: 'initialize-app' },
  { category: 'Вступ та Архітектура', name: 'App / Core', slug: 'app-core', alias: 'app-core' },
  { category: 'Вступ та Архітектура', name: 'Events', slug: 'events', alias: 'events' },
  { category: 'Вступ та Архітектура', name: 'Router Component', slug: 'router-component', alias: 'router-component' },
  { category: 'Вступ та Архітектура', name: 'Routes', slug: 'routes', alias: 'routes' },
  { category: 'Вступ та Архітектура', name: 'Store', slug: 'store', alias: 'store' },

  // UI Components
  { category: 'UI Компоненти', name: 'Accordion / Collapsible', slug: 'accordion', alias: 'accordion-collapsible' },
  { category: 'UI Компоненти', name: 'Action Sheet', slug: 'action-sheet', alias: 'action-sheet' },
  { category: 'UI Компоненти', name: 'Area Chart', slug: 'area-chart', alias: 'area-chart' },
  { category: 'UI Компоненти', name: 'Autocomplete', slug: 'autocomplete', alias: 'autocomplete' },
  { category: 'UI Компоненти', name: 'Badge', slug: 'badge', alias: 'badge' },
  { category: 'UI Компоненти', name: 'Block / Content Block', slug: 'block', alias: 'block-content-block' },
  { category: 'UI Компоненти', name: 'Breadcrumbs', slug: 'breadcrumbs', alias: 'breadcrumbs' },
  { category: 'UI Компоненти', name: 'Button', slug: 'button', alias: 'button' },
  { category: 'UI Компоненти', name: 'Calendar / Date Picker', slug: 'calendar', alias: 'calendar-date-picker' },
  { category: 'UI Компоненти', name: 'Cards', slug: 'cards', alias: 'cards' },
  { category: 'UI Компоненти', name: 'Checkbox', slug: 'checkbox', alias: 'checkbox' },
  { category: 'UI Компоненти', name: 'Chips / Tags', slug: 'chips', alias: 'chips' },
  { category: 'UI Компоненти', name: 'Color Picker', slug: 'color-picker', alias: 'color-picker' },
  { category: 'UI Компоненти', name: 'Contact List', slug: 'contacts-list', alias: 'contact-list' },
  { category: 'UI Компоненти', name: 'Data Table', slug: 'data-table', alias: 'data-table' },
  { category: 'UI Компоненти', name: 'Dialog', slug: 'dialog', alias: 'dialog' },
  { category: 'UI Компоненти', name: 'Elevation', slug: 'elevation', alias: 'elevation' },
  { category: 'UI Компоненти', name: 'Floating Action Button (FAB)', slug: 'fab', alias: 'floating-action-button' },
  { category: 'UI Компоненти', name: 'Form / Form Storage', slug: 'form', alias: 'form' },
  { category: 'UI Компоненти', name: 'Gauge', slug: 'gauge', alias: 'gauge' },
  { category: 'UI Компоненти', name: 'Grid / Layout Grid', slug: 'grid', alias: 'grid-layout-grid' },
  { category: 'UI Компоненти', name: 'Icons', slug: 'icon', alias: 'icons' },
  { category: 'UI Компоненти', name: 'Infinite Scroll', slug: 'infinite-scroll', alias: 'infinite-scroll' },
  { category: 'UI Компоненти', name: 'Inputs / Form Inputs', slug: 'input', alias: 'inputs-form-inputs' },
  { category: 'UI Компоненти', name: 'Link', slug: 'link', alias: 'link' },
  { category: 'UI Компоненти', name: 'List Button', slug: 'list-button', alias: 'list-button' },
  { category: 'UI Компоненти', name: 'List Index', slug: 'list-index', alias: 'list-index' },
  { category: 'UI Компоненти', name: 'List View', slug: 'list', alias: 'list-view' },
  { category: 'UI Компоненти', name: 'Login Screen', slug: 'login-screen', alias: 'login-screen' },
  { category: 'UI Компоненти', name: 'Menu List', slug: 'menu', alias: 'menu-list' },
  { category: 'UI Компоненти', name: 'Messagebar', slug: 'messagebar', alias: 'messagebar' },
  { category: 'UI Компоненти', name: 'Messages', slug: 'messages', alias: 'messages' },
  { category: 'UI Компоненти', name: 'Navbar', slug: 'navbar', alias: 'navbar' },
  { category: 'UI Компоненти', name: 'Notification', slug: 'notification', alias: 'notification' },
  { category: 'UI Компоненти', name: 'Page', slug: 'page', alias: 'page' },
  { category: 'UI Компоненти', name: 'Panel / Side Panels', slug: 'panel', alias: 'panel-side-panels' },
  { category: 'UI Компоненти', name: 'Photo Browser', slug: 'photo-browser', alias: 'photo-browser' },
  { category: 'UI Компоненти', name: 'Picker', slug: 'picker', alias: 'picker' },
  { category: 'UI Компоненти', name: 'Pie Chart', slug: 'pie-chart', alias: 'pie-chart' },
  { category: 'UI Компоненти', name: 'Popover', slug: 'popover', alias: 'popover' },
  { category: 'UI Компоненти', name: 'Popup', slug: 'popup', alias: 'popup' },
  { category: 'UI Компоненти', name: 'Preloader', slug: 'preloader', alias: 'preloader' },
  { category: 'UI Компоненти', name: 'Progressbar', slug: 'progressbar', alias: 'progressbar' },
  { category: 'UI Компоненти', name: 'Pull to Refresh', slug: 'pull-to-refresh', alias: 'pull-to-refresh' },
  { category: 'UI Компоненти', name: 'Radio', slug: 'radio', alias: 'radio' },
  { category: 'UI Компоненти', name: 'Range Slider', slug: 'range', alias: 'range-slider' },
  { category: 'UI Компоненти', name: 'Routable Tabs / Tabs', slug: 'tabs', alias: 'tabs' },
  { category: 'UI Компоненти', name: 'Searchbar', slug: 'searchbar', alias: 'searchbar' },
  { category: 'UI Компоненти', name: 'Segmented', slug: 'segmented', alias: 'segmented' },
  { category: 'UI Компоненти', name: 'Sheet Modal', slug: 'sheet', alias: 'sheet-modal' },
  { category: 'UI Компоненти', name: 'Skeleton', slug: 'skeleton', alias: 'skeleton' },
  { category: 'UI Компоненти', name: 'Smart Select', slug: 'smart-select', alias: 'smart-select' },
  { category: 'UI Компоненти', name: 'Sortable List', slug: 'sortable', alias: 'sortable' },
  { category: 'UI Компоненти', name: 'Statusbar', slug: 'statusbar', alias: 'statusbar' },
  { category: 'UI Компоненти', name: 'Stepper', slug: 'stepper', alias: 'stepper' },
  { category: 'UI Компоненти', name: 'Subnavbar', slug: 'subnavbar', alias: 'subnavbar' },
  { category: 'UI Компоненти', name: 'Swipeout', slug: 'swipeout', alias: 'swipeout' },
  { category: 'UI Компоненти', name: 'Swiper / Slider', slug: 'swiper', alias: 'swiper' },
  { category: 'UI Компоненти', name: 'Text Editor', slug: 'text-editor', alias: 'text-editor' },
  { category: 'UI Компоненти', name: 'Timeline', slug: 'timeline', alias: 'timeline' },
  { category: 'UI Компоненти', name: 'Toast', slug: 'toast', alias: 'toast' },
  { category: 'UI Компоненти', name: 'Toggle', slug: 'toggle', alias: 'toggle' },
  { category: 'UI Компоненти', name: 'Toolbar / Tabbar', slug: 'toolbar', alias: 'toolbar' },
  { category: 'UI Компоненти', name: 'Tooltip', slug: 'tooltip', alias: 'tooltip' },
  { category: 'UI Компоненти', name: 'Touch Ripple / Highlight', slug: 'touch-ripple', alias: 'touch-ripple' },
  { category: 'UI Компоненти', name: 'Treeview', slug: 'treeview', alias: 'treeview' },
  { category: 'UI Компоненти', name: 'View / Views', slug: 'view', alias: 'view' },
  { category: 'UI Компоненти', name: 'Virtual List', slug: 'virtual-list', alias: 'virtual-list' },

  // TECHNO4 2.0 Unique Ecosystem Topics
  { category: 'TECHNO4 FRAMEWORK 2.0 Екосистема', name: 'Apache Cordova Integration (Android / iOS)', slug: 'cordova', alias: 'apache-cordova' },
  { category: 'TECHNO4 FRAMEWORK 2.0 Екосистема', name: 'Hardware: Web Audio API & Synth', slug: 'hardware-audio', alias: 'hardware-web-audio' },
  { category: 'TECHNO4 FRAMEWORK 2.0 Екосистема', name: 'Hardware: Web MIDI Inspector', slug: 'hardware-midi', alias: 'hardware-web-midi' },
  { category: 'TECHNO4 FRAMEWORK 2.0 Екосистема', name: 'Hardware: Web Serial UART Terminal', slug: 'hardware-serial', alias: 'hardware-web-serial' },
  { category: 'TECHNO4 FRAMEWORK 2.0 Екосистема', name: 'Threads Studio: Visual Workflows & Pipelines', slug: 'threads-studio', alias: 'threads-studio' },
  { category: 'TECHNO4 FRAMEWORK 2.0 Екосистема', name: 'Techno4 CLI: Scaffolding & Assets Generator', slug: 'techno4-cli', alias: 'techno4-cli' },
  { category: 'TECHNO4 FRAMEWORK 2.0 Екосистема', name: 'DOM64: Selector Engine & Utilities', slug: 'dom64', alias: 'dom64' },
  { category: 'TECHNO4 FRAMEWORK 2.0 Екосистема', name: 'Rollup & Vite Component Compiler', slug: 'rollup-plugin', alias: 'rollup-plugin-techno4' }
];

// Map articles by alias and normalized name
const articleByAlias = new Map();
articles.forEach(a => {
  articleByAlias.set(a.alias.toLowerCase(), a);
});

let matched = [];
let missing = [];

for (const item of f7StandardSections) {
  let found = articleByAlias.get(item.alias.toLowerCase()) || 
              articles.find(a => a.alias.toLowerCase().includes(item.slug.toLowerCase()) || a.title.toLowerCase().includes(item.slug.toLowerCase()));
  
  if (found) {
    matched.push({ ...item, article: found });
  } else {
    missing.push(item);
  }
}

console.log(`Matched on site: ${matched.length}`);
console.log(`Missing on site: ${missing.length}`);

// Generate Markdown Audit Report
let md = `# Звірка документації: Framework7 vs Сайт techno4.online

Дата звірки: 12.09.2026  
Всього статей на сайті у категорії 11 (Framework): **${articles.length}**  
Охоплено компонентів та розділів: **${matched.length}**  
Відсутні або потребують створення: **${missing.length}**  

---

## 1. Наявні на сайті статті (${matched.length})

| ID | Розділ / Компонент | Назва на сайті | Alias | Розмір (bytes) | YOOtheme макет | Статус |
| :-: | :--- | :--- | :--- | :-: | :-: | :--- |
`;

matched.forEach(m => {
  const a = m.article;
  const status = a.textLength < 100 ? '⚠️ Порожня / Заглушка' : (a.hasYOOtheme ? '✅ Готово (YOOtheme)' : 'ℹ️ Чистий HTML');
  md += `| ${a.id} | **${m.name}** | ${a.title} | \`${a.alias}\` | ${a.textLength} | ${a.hasYOOtheme ? 'Так' : 'Ні'} | ${status} |\n`;
});

md += `\n---

## 2. Відсутні на сайті компоненти та нові розділи TECHNO4 2.0 (${missing.length})

Ці статті необхідно підготувати, перекласти та опублікувати через API сайту:

| Категорія | Компонент / Тема | Slug / Рекомендований Alias | Опис задачі |
| :--- | :--- | :--- | :--- |
`;

missing.forEach(m => {
  md += `| ${m.category} | **${m.name}** | \`${m.alias}\` | Потрібно створити з еталонним шаблоном YOOtheme |\n`;
});

md += `\n---

## 3. Ключові висновки та розбіжності (Audit Insights)

1. **Базові компоненти Framework7**:
   - Більшість базових UI-компонентів (50+ статей) **вже перекладені українською мовою** та оформлені у візуальному макеті YOOtheme Pro версії 4.3.5.
   - Стаття **[22] Introduction** є порожньою заглушкою (розмір 1 байт), потребує повноцінного оновлення під TECHNO4 FRAMEWORK 2.0.
   - Стаття **[96] Установка і налаштування...** містить застарілі відомості першої версії, потребує оновлення під сучасний CLI 2.0 (\`npm install -g techno4-cli\`, \`npx techno4-cli create\`).

2. **Відсутні компоненти інтерфейсу**:
   - Такі важливі елементи як \`Tabs / Routable Tabs\`, \`Smart Select\`, \`Sortable List\`, \`Stepper\`, \`Swipeout\`, \`Swiper / Slider\`, \`Text Editor\`, \`Timeline\`, \`Toast\`, \`Toggle\`, \`Tooltip\`, \`Treeview\`, \`Virtual List\` наразі **відсутні** в категорії 11 на сайті.

3. **Специфічні розділи TECHNO4 FRAMEWORK 2.0 (Абсолютний ексклюзив)**:
   - На сайті взагалі немає розділів про апаратну підсистему (**Web Audio Synth**, **Web MIDI Inspector**, **Web Serial UART Terminal**).
   - Немає статті про візуальне середовище потоків **Threads Studio** (\`techno4-threads\`, \`techno4-total\`, 140+ вузлів).
   - Немає розділу про нативну мобільну розробку на базі **Apache Cordova** (підтримка Android hardware back button, статус-барів, safe-area).
`;

fs.writeFileSync('D:/_DEVE/framework_techno4/TECHNO4FRAMEWORK2/docs-site/AUDIT_FRAMEWORK7_VS_TECHNO4.md', md, 'utf8');
console.log('✅ Audit report generated: D:/_DEVE/framework_techno4/TECHNO4FRAMEWORK2/docs-site/AUDIT_FRAMEWORK7_VS_TECHNO4.md');
