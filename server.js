const express = require('express');
const app = express();

// Здесь сервер хранит координаты всех активных игроков
let players = {};

// Главный обработчик запросов от игры
app.get('/', (req, res) => {
    let login = req.query.login;
    let x = req.query.x;
    let y = req.query.y;

    // Если игрок передал свои данные — сохраняем/обновляем их
    if (login && x !== undefined && y !== undefined) {
        players[login] = { 
            x: parseInt(x), 
            y: parseInt(y), 
            time: Date.now() // Запоминаем время последнего ответа
        };
    }

    let enemyData = "";

    // Ищем в памяти другого игрока (который выходил на связь за последние 5 секунд)
    for (let p in players) {
        if (p !== login) {
            if (Date.now() - players[p].time < 5000) {
                // Возвращаем координаты соперника в формате "X,Y" (например: "120,85")
                enemyData = players[p].x + "," + players[p].y;
                break;
            }
        }
    }

    // Отправляем строку клиенту в MIDletPascal
    res.send(enemyData);
});

// Запуск сервера на порту, который выдает Render (или 3000 локально)
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log('Server is running on port ' + PORT);
});
