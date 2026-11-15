const express = require('express');
const fs = require('fs');
const app = express();

const DB_FILE = 'users.json';

// Функция для чтения базы пользователей из файла
function loadUsers() {
    try {
        if (fs.existsSync(DB_FILE)) {
            const data = fs.readFileSync(DB_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (err) {
        console.error('Ошибка чтения базы:', err);
    }
    return {};
}

// Функция для сохранения базы пользователей в файл
function saveUsers(users) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2), 'utf8');
    } catch (err) {
        console.error('Ошибка записи базы:', err);
    }
}

// Массив для хранения последних сообщений чата (в памяти)
let chatMessages = [];

// --- 0. ПРОВЕРКА СВЯЗИ (ПИНГ) ---
app.get('/ping', (req, res) => {
    res.status(200).send('ONLINE');
});

// --- 1. РЕГИСТРАЦИЯ ---
app.get('/register', (req, res) => {
    const { login, password } = req.query;
    
    if (!login || !password) {
        return res.status(400).send('Bad Request');
    }

    const users = loadUsers();

    if (users[login]) {
        console.log(`Попытка регистрации занятого логина: ${login}`);
        return res.status(409).send('Login taken');
    }

    users[login] = password;
    saveUsers(users);
    
    console.log(`Успешная регистрация пользователя: ${login}`);
    res.status(200).send('Success');
});

// --- 2. ВХОД (АВТОРИЗАЦИЯ) ---
app.get('/login', (req, res) => {
    const { login, password } = req.query;
    
    if (!login || !password) {
        return res.status(400).send('Bad Request');
    }

    const users = loadUsers();

    if (!users[login]) {
        console.log(`Попытка входа: пользователь не найден -> ${login}`);
        return res.status(404).send('User not found');
    }

    if (users[login] !== password) {
        console.log(`Попытка входа: неверный пароль для -> ${login}`);
        return res.status(401).send('Wrong password');
    }

    console.log(`Успешный вход пользователя: ${login}`);
    res.status(200).send('Success');
});

// --- 3. ЧАТ: ОТПРАВКА СООБЩЕНИЯ ---
app.get('/send', (req, res) => {
    const { login, text } = req.query;
    
    if (!login || !text) {
        return res.status(400).send('Bad Request');
    }

    // Добавляем сообщение в общий список (храним последние 15 штук)
    chatMessages.push({ login, text });
    if (chatMessages.length > 15) {
        chatMessages.shift();
    }

    console.log(`[Чат] ${login}: ${text}`);
    res.status(200).send('OK');
});

// --- 4. ЧАТ: ПОЛУЧЕНИЕ СООБЩЕНИЙ ---
app.get('/get_messages', (req, res) => {
    // Отправляем массив сообщений в формате JSON
    res.json(chatMessages);
});

// Запуск сервера
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту: ${PORT}`);
});
