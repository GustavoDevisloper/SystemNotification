document.getElementById('subscribe').addEventListener('click', function() {
    const statusElement = document.getElementById('status');
    statusElement.textContent = '';

    if ('serviceWorker' in navigator && 'PushManager' in window) {
        navigator.serviceWorker.register('public/service-worker.js')
        .then(function(registration) {
            console.log('Service Worker registrado com sucesso:', registration);
            statusElement.textContent = 'Service Worker registrado com sucesso.';

            Notification.requestPermission().then(function(permission) {
                if (permission === 'granted') {
                    console.log('Permissão concedida para notificações.');
                    statusElement.textContent += '\nPermissão concedida para notificações.';

                    const applicationServerKey = urlB64ToUint8Array('BEWonHbBqgTgidt-lAaVBT2FRzivXUxVSAp-Ad16n8rlQ3hFFNnm_R0brwzXGhQZ3XYmFixsvRvjZHFKVSFzeiI');
                    registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: applicationServerKey
                    }).then(function(subscription) {
                        console.log('Subscrito ao Push Service:', subscription);
                        statusElement.textContent += '\nSubscrito ao Push Service.';

                        fetch('/subscribe', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(subscription)
                        }).then(response => {
                            if (response.ok) {
                                console.log('Subscrição enviada ao servidor com sucesso.');
                                statusElement.textContent += '\nSubscrição enviada ao servidor com sucesso.';
                            } else {
                                console.error('Erro ao enviar subscrição ao servidor.');
                                statusElement.textContent += '\nErro ao enviar subscrição ao servidor.';
                            }
                        }).catch(error => {
                            console.error('Erro na requisição ao servidor:', error);
                            statusElement.textContent += '\nErro na requisição ao servidor.';
                        });
                    }).catch(function(error) {
                        console.error('Erro ao subscrever ao Push Manager:', error);
                        statusElement.textContent += '\nErro ao subscrever ao Push Manager.';
                    });
                } else {
                    console.log('Permissão para notificações negada.');
                    statusElement.textContent += '\nPermissão para notificações negada.';
                }
            }).catch(function(error) {
                console.error('Erro ao solicitar permissão para notificações:', error);
                statusElement.textContent += '\nErro ao solicitar permissão para notificações.';
            });
        })
        .catch(function(error) {
            console.log('Falha no registro do Service Worker:', error);
            statusElement.textContent += '\nFalha no registro do Service Worker.';
        });
    } else {
        console.warn('Push messaging is not supported');
        statusElement.textContent += '\nPush messaging is not supported';
    }
});

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
