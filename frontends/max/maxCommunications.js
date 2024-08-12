document.addEventListener('DOMContentLoaded', () => {
const live = document.getElementById('live');
const sleep = document.getElementById('sleep');
sleep.style.display = '';
live.style.display = 'none';

const iframes = [
    { id: 'iframe1', port: 8001, display: false, verification: 3 },
    { id: 'iframe2', port: 8002, display: false, verification: 3 },
    { id: 'iframe3', port: 8003, display: false, verification: 3 },
  ];

iframes.forEach(iframeConfig => {
    const iframe = document.getElementById(iframeConfig.id);
    iframe.onload = () => {
        if (iframeConfig.id === iframe.id) {
            iframe.contentWindow.postMessage(iframeConfig, '*');
        }
    };
});

window.addEventListener('message', (event) => {
    const data = event.data;
    const iframe = iframes.find(iframeConfig => iframeConfig.port === data.port);
    if (iframe) {
        iframe.display = data.display;
    }
    
    if (iframes.every(iframeConfig => iframeConfig.display === false)) {
        sleep.style.display = '';
        live.style.display = 'none';
    }
    if (iframes.some(iframeConfig => iframeConfig.display === true)) {
        sleep.style.display = 'none';
        live.style.display = '';
    }
});
});