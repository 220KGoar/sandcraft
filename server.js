const express = require('express');
const app = express();

// Разрешаем серверу понимать JSON и данные из форм
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Обработка запроса регистрации от нашей Pascal-программы
app.post('/register', (req, res) => {
    const login = req.body.login;
    const password = req.body.password;

    // Проверка, переданы ли данные
    if (!login || !password) {
        return res.status(400).send('Error: Missing login or password');
    }

    console.log(`Новая регистрация -> Логин: ${login}, Пароль: ${password}`);

    // Здесь в будущем можно добавить сохранение в базу данных (например, MongoDB или файл)

    // Отправляем клиенту ответ об успехе
    res.status(200).send('Success');
});

// Запуск сервера на порту, который укажет хостинг, или на 3000 локально
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
