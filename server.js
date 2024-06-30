const WebSocket = require('ws');
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

const keywordsToUrls = {
    "weather": ["https://yandex.ru/pogoda/moscow"],
    "news": ["https://www.rbc.ru/", "https://ria.ru/"]
};

// HTTP Server
app.use(express.static('public'));

const server = app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost: ${port}`)


const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        const urls = keywordsToUrls[message];
        if (urls) {
            ws.send(JSON.stringify(urls));
        } else {
            ws.send("Не найден URL");
        }
    });
});

function downloadFile(url, ws) {
    axios({
        method: 'get',
        url: url,
        responseType: 'stream'
    }).then(response => {
        response.data.on('data', (chunk) => {

            ws.send(`Принят файл ${chunk.length}`);
        });
        response.data.on('end', () => {
            ws.send('Загрузка завершена');
        });
    }).catch(error => {
        ws.send(`Ошибка скачивания файла: ${errormessage}`);
    });
}})
