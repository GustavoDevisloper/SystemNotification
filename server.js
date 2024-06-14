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

// Armazena a subscrição
let subscription;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/subscribe', (req, res) => {
    subscription = req.body;
    console.log('Recebida nova subscrição:', subscription);
    res.status(201).json({});
});

app.post('/sendNotification', (req, res) => {
    const payload = JSON.stringify({ title: 'Manual Notification', body: 'This is a manually triggered notification' });

    webpush.sendNotification(subscription, payload).then(response => {
        console.log('Notificação enviada com sucesso:', response);
        res.status(200).json({ message: 'Notification sent successfully' });
    }).catch(error => {
        console.error('Erro ao enviar notificação:', error);
        res.status(500).json({ error: 'Failed to send notti', details: error.toString() });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
