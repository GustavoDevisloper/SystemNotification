const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Configuração das chaves VAPID
const publicVapidKey = 'BEWonHbBqgTgidt-lAaVBT2FRzivXUxVSAp-Ad16n8rlQ3hFFNnm_R0brwzXGhQZ3XYmFixsvRvjZHFKVSFzeiI';
const privateVapidKey = 'hLy8zH1JDyJ4CgTw4AV_odUlHGC2Lwpus16cno9LOvM';

webpush.setVapidDetails('mailto:your-email@example.com', publicVapidKey, privateVapidKey);

// Middleware para processar JSON e servir arquivos estáticos
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para subscrever ao Push Service
app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    res.status(201).json({});

    const payload = JSON.stringify({ title: 'Push Test', body: 'This is a test notification' });

    webpush.sendNotification(subscription, payload).catch(error => {
        console.error(error.stack);
    });
});

// Inicializa o servidor
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
