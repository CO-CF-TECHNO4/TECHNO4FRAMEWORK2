# Документація REST API: techno4.online

<div align="center">

**Специфікація взаємодії з бекендом та контентом сайту techno4.online через Web Services REST API**  
*REST API interaction guide and technical reference for techno4.online*

---

</div>

## 1. Загальна інформація та архітектура

- **Базовий хост**: `https://techno4.online`
- **Кореневий префікс API**: `/api/v1/` (повний URL: `https://techno4.online/api/v1/`)
- **Стек сайту**: **Joomla! 5 (Web Services)**
- **Специфікація стандарту**: **JSON:API** (`application/vnd.api+json`)
- **Формат обміну даними**: JSON (UTF-8)

---

## 2. Аутентифікація та авторизація

API використовує Bearer Token авторизацію за стандартом Joomla API Tokens.

### Заголовки запиту:
```http
Authorization: Bearer <API_TOKEN>
Accept: application/vnd.api+json
Content-Type: application/json
```
*(Також підтримується альтернативний заголовок `X-Joomla-Token: <API_TOKEN>`)*.

### Інформація про підключений токен:
- **Токен**: `c2hhMjU2Ojk3NDowYzgxMTJmMDFlMDhiNzg1MDMxOGEzN2Y2MzY4YTUzYmJkMjJmMTU2MDhiMWI3ZTUzYjUzOWU5OGFkZmQ4NDhl`
- **Декодована структура**: `sha256:974:0c8112f01e08b7850318a37f6368a53bbd22f15608b1b7e53b539e98adfd848e`
- **Ідентифікатор користувача**: ID `974` (`BioRobot`, `biorobot@techno4.online`)
- **Рівень прав**: **Група 7 (Administrator)** — повний доступ до читання, публікації та оновлення статей, категорій і тегів.

---

## 3. Формат JSON:API (Запити та відповіді)

### Успішна відповідь (Resource Object):
```json
{
  "links": {
    "self": "https://techno4.online/api/v1/content/articles?page[offset]=0&page[limit]=20",
    "next": "https://techno4.online/api/v1/content/articles?page[offset]=20&page[limit]=20",
    "last": "https://techno4.online/api/v1/content/articles?page[offset]=140&page[limit]=20"
  },
  "data": [
    {
      "type": "articles",
      "id": "134",
      "attributes": {
        "title": "Skeleton",
        "alias": "skeleton",
        "state": 1,
        "text": "...",
        "created": "2023-01-10 12:00:00"
      },
      "relationships": {
        "category": {
          "data": {
            "type": "categories",
            "id": "11"
          }
        }
      }
    }
  ]
}
```

### Відповідь з помилкою:
```json
{
  "errors": [
    {
      "title": "Resource not found",
      "code": 404
    }
  ]
}
```

---

## 4. Довідник ендпоінтів (Endpoints Reference)

### 4.1. Статті контенту (`/content/articles`)

Головний ендпоінт для роботи з документацією та статтями.

| Метод | Шлях | Опис |
| :--- | :--- | :--- |
| `GET` | `/api/v1/content/articles` | Отримання списку статей (з пагінацією та фільтрами) |
| `GET` | `/api/v1/content/articles/{id}` | Отримання статті за ID |
| `POST` | `/api/v1/content/articles` | Створення нової статті |
| `PATCH` | `/api/v1/content/articles/{id}` | Оновлення існуючої статті |
| `DELETE` | `/api/v1/content/articles/{id}` | Видалення статті |

#### Параметри запиту (Query Parameters):
- `filter[category]={cat_id}` — фільтрація за категорією (наприклад, `11` для Framework).
- `filter[search]={query}` — повнотекстовий пошук за заголовком/текстом.
- `filter[state]={0|1|2|-2}` — стан публікації (1 = Опубліковано, 0 = Чернетка, 2 = В архіві, -2 = У кошику).
- `page[offset]={int}` — зміщення пагінації (за замовчуванням: `0`).
- `page[limit]={int}` — ліміт на сторінку (за замовчуванням: `20`, макс: `100`).
- `sort={[-field]}` — сортування результатів (наприклад, `-created`, `title`, `ordering`).

#### Ключові атрибути статті (`attributes`):
- `title` *(string)*: Заголовок статті.
- `alias` *(string)*: ЧПУ URL-псевдонім статті.
- `text` *(string)*: Тіло статті (HTML-розмітка / JSON лейаут YOOtheme Pro).
- `state` *(int)*: 1 (Published), 0 (Unpublished).
- `catid` *(int)*: ID категорії статті (для фреймворку: `11`).
- `language` *(string)*: Мова статті (`*` для всіх, або `uk-UA`, `en-GB`).
- `metakey` *(string)*: Ключові слова SEO.
- `metadesc` *(string)*: Мета-опис для пошукових систем.

---

### 4.2. Категорії (`/content/categories`)

| Метод | Шлях | Опис |
| :--- | :--- | :--- |
| `GET` | `/api/v1/content/categories` | Список усіх категорій |
| `GET` | `/api/v1/content/categories/{id}` | Отримання категорії за ID |
| `POST` | `/api/v1/content/categories` | Створення нової категорії |
| `PATCH` | `/api/v1/content/categories/{id}` | Редагування категорії |

#### Ключові категорії сайту для TECHNO4:
- **ID 9**: `Надбання` (батьківський розділ, рівень 1).
- **ID 11**: `Framework` (офіційна категорія документації, рівень 2, URL на сайті: `https://techno4.online/надбання/фреймворк`).

---

### 4.3. Меню та навігація (`/menus/site/items`)

| Метод | Шлях | Опис |
| :--- | :--- | :--- |
| `GET` | `/api/v1/menus/site/items` | Список усіх активних пунктів меню сайту |
| `GET` | `/api/v1/menus/site/items/{id}` | Деталі окремого пункту меню |

---

### 4.4. Теги (`/tags`)

| Метод | Шлях | Опис |
| :--- | :--- | :--- |
| `GET` | `/api/v1/tags` | Отримання списку тегів контенту |
| `POST` | `/api/v1/tags` | Створення нового тегу |

---

### 4.5. Користувачі (`/users`)

| Метод | Шлях | Опис |
| :--- | :--- | :--- |
| `GET` | `/api/v1/users/{id}` | Отримання профілю користувача за ID |

---

## 5. Приклади взаємодії через код (Node.js / ES Modules)

### 5.1. Читання списку статей документації фреймворку:
```javascript
import https from 'https';

const API_URL = 'https://techno4.online/api/v1';
const API_TOKEN = process.env.TECHNO4_DOCS_API_KEY;

async function getFrameworkArticles() {
  const res = await fetch(`${API_URL}/content/articles?filter[category]=11&page[limit]=50`, {
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Accept': 'application/vnd.api+json'
    }
  });

  const body = await res.json();
  return body.data.map(item => ({
    id: item.id,
    title: item.attributes.title,
    alias: item.attributes.alias,
    state: item.attributes.state
  }));
}
```

### 5.2. Створення нової статті через API:
```javascript
async function createArticle({ title, alias, text, catid = 11 }) {
  const payload = {
    title,
    alias,
    text,
    catid,
    state: 1,
    language: '*'
  };

  const res = await fetch(`${API_URL}/content/articles`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return await res.json();
}
```

### 5.3. Оновлення існуючої статті:
```javascript
async function updateArticle(articleId, updates) {
  const res = await fetch(`${API_URL}/content/articles/${articleId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });

  return await res.json();
}
```

---

## 6. Візія та архітектура майбутнього пакунка (`@techno4/cms-client` / `techno4-docs-sync`)

На основі цього API планується створення нового пакунка:
1. **SDK / Client**: легковаговий клієнт для взаємодії з REST API сайту:
   ```javascript
   import { Techno4CMS } from 'techno4-cms-client';
   const client = new Techno4CMS({ token, baseUrl });
   const docs = await client.articles.list({ category: 11 });
   ```
2. **Docs Sync Engine**: утиліта автоматичної синхронізації markdown-документації з монорепозиторію TECHNO4 безпосередньо у статті сайту `https://techno4.online/надбання/фреймворк` (двосторонній синк або git-to-cms деплой).
