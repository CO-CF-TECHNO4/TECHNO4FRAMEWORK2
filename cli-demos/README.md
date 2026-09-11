# Techno4 Tabs Cordova Android

## Techno4 CLI Опції

Techno4 застосунок згенеровано з наступними опціями:

```
{
  "cwd": "D:\\_DEVE\\framework_techno4\\TECHNO4FRAMEWORK2\\cli-demos",
  "type": [
    "cordova"
  ],
  "name": "Techno4 Tabs Cordova Android",
  "pkg": "io.techno4.tabsandroid",
  "cordova": {
    "folder": "cordova",
    "platforms": [
      "android"
    ],
    "plugins": [
      "cordova-plugin-statusbar",
      "cordova-plugin-keyboard",
      "cordova-plugin-splashscreen"
    ]
  },
  "framework": "core",
  "template": "tabs",
  "bundler": "vite",
  "cssPreProcessor": false,
  "theming": {
    "customColor": false,
    "color": "#007aff",
    "darkTheme": false,
    "iconFonts": true,
    "fillBars": false
  },
  "customBuild": false
}
```

## Встановіть залежності
```
npm install
```

## Доступні наступні NPM скрипти

* 🔥 `start` - run development server
* 🔧 `dev` - run development server
* 🔧 `build` - build web app for production
* 📱 `build-cordova` - build cordova app

## Vite

Проєкт використовує [Vite](https://vitejs.dev) генератор пакунків. Ви маєте працювати лише з файлами з каталогу `/src`. Конфігураційний файл Vite знайдете тут: `vite.config.js`.
## Cordova

Cordova project located in `cordova` folder. You shouldn't modify content of `cordova/www` folder. Its content will be correctly generated when you call `npm run cordova-build-prod`.





## Assets

Assets (icons, splash screens) source images located in `assets-src` folder. To generate your own icons and splash screen images, you will need to replace all assets in this directory with your own images (pay attention to image size and format), and run the following command in the project directory:

```
techno4 assets
```

Or launch UI where you will be able to change icons and splash screens:

```
techno4 assets --ui
```



## Documentation & Resources

* [Techno4 Core Documentation](https://techno4.online/надбання/фреймворк)
* [Techno4 Icons Reference](https://techno4.online/надбання/фреймворк)