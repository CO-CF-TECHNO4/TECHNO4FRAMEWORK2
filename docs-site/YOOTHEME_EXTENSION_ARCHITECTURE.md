# Архітектура розширення YOOtheme Pro для TECHNO4 (`yootheme-techno4`)

<div align="center">

**Технічна специфікація та план створення плагіна кастомних елементів для YOOtheme Pro (Joomla 5)**  
*Custom Elements Extension Specification for YOOtheme Pro & TECHNO4 Components*

---

</div>

## 1. Мета розширення

Розширення призначене для інтеграції реактивних та апаратних компонентів **TECHNO4 FRAMEWORK 2** безпосередньо у візуальний конструктор **YOOtheme Pro** на Joomla 5.

Це дозволить:
1. Додавати живі апаратні віджети (**Web Audio Synth**, **Web Serial Terminal**, **Web MIDI Monitor**) безпосередньо через інтерфейс YOOtheme Builder на будь-яку сторінку сайту.
2. Вбудовувати інтерактивні демонстрації компонентів (таби, кнопки, слайдери, карточки) з живим рендерингом `$h` VDOM.
3. Візуально розміщувати монітори потоків **Threads Studio** на сторінках новин та документації.

---

## 2. Структура плагіна Joomla (`plg_system_yootheme_techno4`)

```
plugins/system/yootheme_techno4/
├── yootheme_techno4.xml        # Маніфест плагіна Joomla 5
├── yootheme_techno4.php        # Головний клас плагіна
├── bootstrap.php               # Точка входу модуля YOOtheme Pro
├── assets/                     # Статичні скрипти та стилі
│   ├── techno4.bundle.min.js
│   ├── techno4.bundle.min.css
│   └── techno4-yootheme.js
└── elements/                   # Каталог кастомних елементів Builder
    ├── techno4_synth/          # Елемент: Web Audio Synth & Oscilloscope
    │   ├── element.json        # Конфігурація та UI поля в конструкторі
    │   └── templates/
    │       └── template.php    # Рендеринг елемента
    ├── techno4_serial/         # Елемент: Serial Terminal
    │   ├── element.json
    │   └── templates/
    │       └── template.php
    ├── techno4_tabs/           # Елемент: Routable Tabs
    │   ├── element.json
    │   └── templates/
    │       └── template.php
    └── techno4_threads/        # Елемент: Threads Stream Live Monitor
        ├── element.json
        └── templates/
            └── template.php
```

---

## 3. Реєстрація елементів у YOOtheme Pro (`bootstrap.php`)

```php
<?php

use YOOtheme\Builder;
use YOOtheme\Path;

return [
    'events' => [
        'customizer.init' => [
            function () {
                // Реєстрація псевдоніма шляху до розширення
                Path::set('~techno4_elements', __DIR__ . '/elements');
            }
        ]
    ],
    'extend' => [
        Builder::class => function (Builder $builder) {
            // Автоматичне завантаження всіх element.json із підпапок elements/
            $builder->addTypePath(Path::get('~techno4_elements/*/element.json'));
        }
    ]
];
```

---

## 4. Специфікація кастомних елементів

### 4.1. Елемент `techno4_synth` (Web Audio Синтезатор)
- **Категорія в білдері**: `TECHNO4 Hardware`
- **Іконка**: `waveform` / `audio`
- **Налаштування в Builder**:
  - Тип хвилі за замовчуванням (Sine, Square, Sawtooth, Triangle).
  - Увімкнення осцилографа на Canvas (так/ні, колір лінії, висота канвасу).
  - Діапазон октав (C3-C4, C4-C5).
- **Шаблон (`template.php`)**:
  Рендерить контейнер `<div class="t4-synth-widget" data-config="...">` та ініціалізує Web Audio поліфонічні генератори.

### 4.2. Елемент `techno4_serial` (Serial COM Terminal)
- **Категорія в білдері**: `TECHNO4 Hardware`
- **Налаштування**:
  - Режим підключення (Web Serial API / Total.js Bridge).
  - Бодрейт за замовчуванням (9600, 115200).
  - Висота вікна консолі.

### 4.3. Елемент `techno4_tabs` (Routable Tabs Preview)
- **Категорія в білдері**: `TECHNO4 UI`
- **Налаштування**:
  - Стиль вкладок (Standard, Segmented Strong, Raised, Round).
  - Список вкладок (Tab 1, Tab 2, Tab 3) з контентом для кожної.

---

## 5. Взаємодія наявних інструментів через обгортку `docs-site/lib/yootheme.mjs`

Наша створена бібліотека `YOOthemeWrapper`:
1. Читає будь-яку статтю з бекенду через REST API.
2. Розбирає JSON-структуру макета YOOtheme Pro 4.x.
3. Дозволяє програмно додавати або оновлювати блоки документації, коду та інтерактивних модулів.
4. Збирає фінальний текст із валідним HTML-фолбеком для пошукових систем та JSON-коментарем для YOOtheme Builder.
