<img width="1897" height="936" alt="image" src="https://github.com/user-attachments/assets/f95e2cb8-3060-4dd7-9ad8-eb9bf561d269" />
<p>Главная страница</p>

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

Авторизация и регистрация с выбором роли. При переходе на сайт, если пользователь не был авторизован и у него отстутсвутют куки, его перенаправляет на страницу авторизации. После входа пользователь попадает на главную страницу, где видит все посты:

<img width="642" height="875" alt="image" src="https://github.com/user-attachments/assets/cf39ba3e-f3b4-4dcf-988c-ff58424f5781" />
<p>Страница авторизации - форма регистрации</p>

<br>
<img width="580" height="454" alt="image" src="https://github.com/user-attachments/assets/5cdf535d-2eec-45d2-a2bc-fbe2fc7cd719" />
<p>Страница авторизации - форма входа</p>

<br>
<img width="1902" height="890" alt="image" src="https://github.com/user-attachments/assets/bfe8979f-d230-4c1e-8cf9-836d95b4bc1e" />
<p>Фильтр постов</p>

<br><br>
В профиле есть редактирование информации о пользователе (доступная только владельцу аккаунта), а также добавление и редактирование постов в портфолио. При клике на портфолио открывается страница с полным описанием проекта:

<img width="1905" height="883" alt="image" src="https://github.com/user-attachments/assets/094034fa-9a2b-41af-9167-379224756565" />
<p>Личная страница пользолвателя с правами на редактирование</p>

<br>
<img width="1882" height="888" alt="image" src="https://github.com/user-attachments/assets/cd705b96-abb8-41be-8097-9bc6b663c98f" />
<p>Страница другого пользолвателя без правам на редактирование</p>

<br>
<img width="1640" height="929" alt="image" src="https://github.com/user-attachments/assets/00af1f2c-8641-479e-a5b6-cefe3f8b0cbb" />
<p>Страница проекта. Редактирование и удаление доступно только автору</p>

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
```

Создать файл `client/.env`:

```
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev
```

Приложение будет доступно на `http://localhost:5173`.
