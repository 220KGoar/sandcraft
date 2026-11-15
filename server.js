const express = require('express');
const app = express();

app.get('/register', (req, res) => {
    console.log("Пришел запрос на регистрацию!");
    console.log("Login:"+req.query.login);
    console.log("Password:"+req.query.password);
res.status(200).send('Success'); });
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => { console.log(' Сервер запущен на порту ${PORT}'); });
                                     
                                     




