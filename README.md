<img width="874" height="399" alt="image" src="https://github.com/user-attachments/assets/b38f5d6e-54ab-4bc4-8463-d72928c28202" />

## Стек

**Фронтенд**
- React + TypeScript
- Vite
- Redux Toolkit
- React Router
- Axios
- SCSS Modules

**Бэкенд**
- Node.js + Express
- MongoDB + Mongoose
- JWT авторизация (httpOnly cookie)
- bcrypt

## Функциональность

Авторизация и регистрация с выбором роли. При переходе на сайт, если пользователь не был авторизован и у него отстутсвутют куки, его перенаправляет на страницу авторизации. После входа пользователь попадает на дашборд, где видит только те действия, которые доступны его роли:

- **Все роли** — создание постов, добавление проектов в портфолио, отклики на вакансии
- **HR** — дополнительно: создание вакансий, приглашение пользователей в компании, управление командами
- **Manager** — дополнительно: управление командами и проектами

<img width="642" height="875" alt="image" src="https://github.com/user-attachments/assets/cf39ba3e-f3b4-4dcf-988c-ff58424f5781" />
<img width="580" height="454" alt="image" src="https://github.com/user-attachments/assets/5cdf535d-2eec-45d2-a2bc-fbe2fc7cd719" />
<img width="572" height="502" alt="image" src="https://github.com/user-attachments/assets/3c687395-461d-4d6a-a1fa-6a7588d39670" />
<img width="471" height="424" alt="image" src="https://github.com/user-attachments/assets/496f0e52-8b81-45d0-b46f-8a8ce9183079" />


## Запуск локально

Нужны: Node.js 18+, MongoDB (локальная установка)

**Бэкенд**

```bash
cd server
npm install
```

Создать файл `server/.env`:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dev-platform
JWT_SECRET=твой_секретный_ключ
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
```

**Фронтенд**

```bash
cd client
npm install
npm run dev
```

Приложение будет доступно на `http://localhost:5173`.

## Структура проекта

```
dev-platform/
├── client/                  # React-приложение
│   └── src/
│       ├── api/             # axios-запросы к серверу
│       ├── components/      # переиспользуемые компоненты
│       ├── pages/           # страницы приложения
│       ├── store/           # Redux стор и слайсы
│       ├── types/           # TypeScript типы
│       └── utils/           # утилиты (permissions и др.)
└── server/                  # Express-сервер
    └── src/
        ├── controllers/     # логика эндпоинтов
        ├── models/          # Mongoose-схемы
        └── routes/          # роуты API
```

## API

| Метод | Путь | Описание |
|-------|------|----------|
| POST | /api/register | Регистрация |
| POST | /api/login | Вход |
| GET | /api/auth | Проверка сессии |
| POST | /api/logout | Выход |
