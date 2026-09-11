# TECHNO4 FRAMEWORK2

<div align="center">

**Фулстек реактивна екосистема для мобільних, десктопних застосунків та апаратних систем керування**  
*Fullstack Reactive Ecosystem for Mobile, Desktop, and Hardware Control Systems*

[![License: LGPL-3.0-or-later](https://img.shields.io/badge/License-LGPL--3.0--or--later-blue.svg)](LICENSE)
[![Organization](https://img.shields.io/badge/Organization-CO%20%C2%ABCF%20TECHNO4%C2%BB-green.svg)](https://techno4.online)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-brightgreen.svg)](package.json)
[![Tests](https://img.shields.io/badge/Tests-221%20Passing-success.svg)](scripts/)

---

### [🇺🇦 Українська](#-techno4-framework2---українська) &nbsp;|&nbsp; [🇬🇧 English](#-techno4-framework2---english)

---

</div>

<br>

---

## 🇺🇦 TECHNO4 FRAMEWORK2 - Українська

### 🎯 Мета проєкту
> **Вільна ініціатива підтримки сучасних інструментів розробника за підтримки благодійної організації «БЛАГОДІЙНИЙ ФОНД ТЕХНО4» (CO «CF TECHNO4»).**

**TECHNO4 FRAMEWORK2** — це відкрита, високопродуктивна та незалежна фулстек-платформа, орієнтована на розробку мобільних, десктопних і вбудованих веб-застосунків, а також промислових рішень та апаратних контролерів (Serial, MIDI, Web Audio).

---

### 📦 Структура монорепозиторію та пакунки

Проєкт організовано як мета-репозиторій на базі **Git Submodules** та **npm Workspaces**:

| Пакунок / Застосунок | Директорія | Опис | Репозиторій |
| :--- | :--- | :--- | :--- |
| **`techno4`** | `packages/techno4-framework2-core` | Реактивне UI-ядро, Snabbdom VDOM, єдина тема Techno4, роутер, Store, Web Components | [techno4-framework](https://github.com/CO-CF-TECHNO4/techno4-framework) |
| **`dom64`** | `packages/techno4-framework2-dom64` | Швидка, ультралегка бібліотека маніпуляції DOM та вибірок | [techno4-framework-dom64](https://github.com/CO-CF-TECHNO4/techno4-framework-dom64) |
| **`techno4-total`** | `packages/techno4-framework2-total` | Headless бекенд-рушій для Serial COM, Rust Web Audio, MIDI, NoSQL, REST, WebSocket, MQTT | [techno4-total2](https://github.com/CO-CF-TECHNO4/techno4-total2) |
| **`techno4-threads`** | `packages/techno4-framework2-threads` | Візуальний редактор для створення та керування сервісами Serial COM, Rust Web Audio, MIDI, NoSQL, REST, WebSocket, MQTT | [techno4-threads](https://github.com/CO-CF-TECHNO4/techno4-threads) |
| **`techno4-threads-components`** | `packages/techno4-framework2-threads-components` | Бібліотека вузлів та компонентів FlowStream для Threads Studio | [techno4-theadscomponents](https://github.com/CO-CF-TECHNO4/techno4-theadscomponents) |
| **`rollup-plugin-techno4`** | `packages/techno4-framework2-rollup` | Плагін для Rollup та Vite для компіляції Single-File Components (`.t4.html`, `.t4`) | [techno4-framework-rollup-plugin](https://github.com/CO-CF-TECHNO4/techno4-framework-rollup-plugin) |
| **`techno4-cli`** | `packages/techno4-framework2-cli` | Утиліти командного рядка TECHNO4 FRAMEWORK2 | [techno4-framework-cli](https://github.com/CO-CF-TECHNO4/techno4-framework-cli) |
| **`boonker`** | `apps/techno4-framework2-boonker` | Демонстраційний застоснок для всіх складових TECHNO4 FRAMEWORK2 | Включено в монорепо |

---

### 🚀 Розгортання Boonker Studio

Boonker — це інтерактивне середовище розробки та демонстрації всіх 111 компонентів фреймворка, апаратних лабораторій та візуальних потоків:

1. **Клонування репозиторію разом із сабмодулями**:
   ```bash
   git clone --recurse-submodules git@github.com:CO-CF-TECHNO4/TECHNO4FRAMEWORK2.git
   cd TECHNO4FRAMEWORK2
   ```

2. **Встановлення залежностей**:
   ```bash
   npm install
   ```

3. **Запуск у режимі розробки (Fullstack)**:
   ```bash
   npm run dev
   ```
   *Запускає Vite клієнт на `http://localhost:3000` та бекенд Threads Studio на `http://localhost:8000`.*

4. **Клієнтський режим (без бекенду)**:
   ```bash
   npm run dev:client
   ```

5. **Збірка всіх бібліотек**:
   ```bash
   npm run build
   ```

6. **Запуск автоматизованих тестів (221 тест)**:
   ```bash
   npm test
   ```

---

### 🛠 Створення застосунку із шаблону за допомогою CLI

Для швидкого створення нового проекту на базі **TECHNO4 FRAMEWORK2** використовуйте **`techno4-cli`**:

```bash
# Швидкий запуск через npx
npx techno4-cli create

# Або глобальне встановлення
npm install -g techno4-cli
t4 create
```

У процесі інтерактивного генератора ви зможете:
- Вказати назву та ідентифікатор застосунку.
- Обрати тип проєкту: **Single Page App (PWA)**, **Cordova Android / iOS** або **Десктопний клієнт**.
- Обрати стартовий шаблон: *Single View*, *Tabbed Views*, *Split View Panel* або *Hardware Control*.
- Запустити локальний сервер розробки однією командою.

---

### 📚 Офіційна документація

Офіційний розділ документації Techno4 Framework доступний на порталі організації:
👉 **[https://techno4.online/надбання/фреймворк](https://techno4.online/%D0%BD%D0%B0%D0%B4%D0%B1%D0%B0%D0%BD%D0%BD%D1%8F/%D1%84%D1%80%D0%B5%D0%B9%D0%BC%D0%B2%D0%BE%D1%80%D0%BA)**

> **Зверніть увагу**: Велика частина документації, що створювалася для першої версії фреймворка, повністю перекладена українською мовою. Наразі триває процес адаптації та синхронізації матеріалів під архітектуру версії 2.0. Для синхронізації статей через API створено локальну секцію `docs-site/`.

---

### ⚖️ Ліцензія та права
Вихідний код поширюється за ліцензією **LGPL-3.0-or-later**.  
Підтримується та поширюється **благодійною організацією «БЛАГОДІЙНИЙ ФОНД ТЕХНО4»** (`CO «CF TECHNO4»`).  
Автор: **Mykola Zghurskyi** (`mykola@techno4.online`).  
Проєкт містить адаптовані компоненти із відкритих проектів ліцензії MIT (Framework7, Total.js, FlowStream).

<br>

---

## 🇬🇧 TECHNO4 FRAMEWORK2 - English

### 🎯 Project Mission
> **A free initiative supporting modern developer tools, supported by the charitable organization "CO «CF TECHNO4»" (благодійна організація «БЛАГОДІЙНИЙ ФОНД ТЕХНО4»).**

**TECHNO4 FRAMEWORK2** is an open-source, high-performance, independent fullstack ecosystem designed for mobile, desktop, and embedded web applications, as well as industrial control systems and hardware interfacing (Serial COM, MIDI, Web Audio).

---

### 📦 Monorepo Architecture & Packages

The project is architected as a meta-repository using **Git Submodules** and **npm Workspaces**:

| Package / Application | Path | Description | Repository |
| :--- | :--- | :--- | :--- |
| **`techno4`** | `packages/techno4-framework2-core` | Reactive UI core, Snabbdom VDOM, Unified Techno4 theme, router, Store, Web Components | [techno4-framework](https://github.com/CO-CF-TECHNO4/techno4-framework) |
| **`dom64`** | `packages/techno4-framework2-dom64` | Fast, ultra-lightweight DOM manipulation and selector engine | [techno4-framework-dom64](https://github.com/CO-CF-TECHNO4/techno4-framework-dom64) |
| **`techno4-total`** | `packages/techno4-framework2-total` | Headless backend engine for Serial COM, Rust Web Audio, MIDI, NoSQL, REST, WebSocket, MQTT | [techno4-total2](https://github.com/CO-CF-TECHNO4/techno4-total2) |
| **`techno4-threads`** | `packages/techno4-framework2-threads` | Visual editor for creating and managing Serial COM, Rust Web Audio, MIDI, NoSQL, REST, WebSocket, MQTT services | [techno4-threads](https://github.com/CO-CF-TECHNO4/techno4-threads) |
| **`techno4-threads-components`** | `packages/techno4-framework2-threads-components` | FlowStream node and component library for Threads Studio | [techno4-theadscomponents](https://github.com/CO-CF-TECHNO4/techno4-theadscomponents) |
| **`rollup-plugin-techno4`** | `packages/techno4-framework2-rollup` | Rollup and Vite plugin for compiling Single-File Components (`.t4.html`, `.t4`) | [techno4-framework-rollup-plugin](https://github.com/CO-CF-TECHNO4/techno4-framework-rollup-plugin) |
| **`techno4-cli`** | `packages/techno4-framework2-cli` | Command-line utilities for TECHNO4 FRAMEWORK2 | [techno4-framework-cli](https://github.com/CO-CF-TECHNO4/techno4-framework-cli) |
| **`boonker`** | `apps/techno4-framework2-boonker` | Showcase application for all components of TECHNO4 FRAMEWORK2 | Included in monorepo |

---

### 🚀 Running Boonker Studio

Boonker is an interactive studio and developer sandbox featuring 111 fully tested components, hardware simulators, and visual threads:

1. **Clone the repository with all submodules**:
   ```bash
   git clone --recurse-submodules git@github.com:CO-CF-TECHNO4/TECHNO4FRAMEWORK2.git
   cd TECHNO4FRAMEWORK2
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start Fullstack Development Environment**:
   ```bash
   npm run dev
   ```
   *Spawns the Vite client at `http://localhost:3000` and the Threads Studio backend at `http://localhost:8000`.*

4. **Client-Only Development Mode**:
   ```bash
   npm run dev:client
   ```

5. **Build All Distribution Packages**:
   ```bash
   npm run build
   ```

6. **Run Full Test Suite (221 passing tests)**:
   ```bash
   npm test
   ```

---

### 🛠 Scaffolding Applications with CLI

To generate a new application from an official template, use **`techno4-cli`**:

```bash
# Instant launch via npx
npx techno4-cli create

# Or install globally
npm install -g techno4-cli
t4 create
```

Features:
- Scaffold **Single Page Apps (PWA)**, **Cordova Android / iOS** packages, or **Desktop Web** views.
- Select from clean starter templates: *Single View*, *Tabbed Views*, *Split View*, or *Hardware Studio*.
- Immediate hot-reload dev server configuration.

---

### 📚 Official Documentation

Visit the official documentation portal:  
👉 **[https://techno4.online/надбання/фреймворк](https://techno4.online/%D0%BD%D0%B0%D0%B4%D0%B1%D0%B0%D0%BD%D0%BD%D1%8F/%D1%84%D1%80%D0%B5%D0%B9%D0%BC%D0%B2%D0%BE%D1%80%D0%BA)**

> Ukrainian translations from the first version of the framework are actively being adapted and synced with **TECHNO4 FRAMEWORK2** architecture. An isolated `docs-site/` directory is prepared for API-based content management.

---

### ⚖️ License & Legal Attribution

Distributed under the **LGPL-3.0-or-later** license.  
Maintained and published by **CO «CF TECHNO4»** (`благодійна організація «БЛАГОДІЙНИЙ ФОНД ТЕХНО4»`).  
Author: **Mykola Zghurskyi** (`mykola@techno4.online`).  
Contains derivative work from open-source MIT projects (Framework7, Total.js, FlowStream).
