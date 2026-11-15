const express = require('express');
const app = express();
const users={};

app.get('/register', (req, res) => {
     const { login, password } = req.query;
    if (!login || !password) {
        return res.status(400).send('Bad Request'); }
    if (users[login]) { console.log(` Попытка регистрации занятого логина: ${login}`);
                       return.status(409).send('Login taken'); }
    users[login]=password;
    console.log(`Успешная регистрация пользывателя ${login}`);
    
res.status(200).send('Success'); });
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => { console.log(` Сервер запущен на порту: ${PORT}`); });
                                     
                                     




