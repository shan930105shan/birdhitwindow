// ws-server.js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8081 });

let clients = [];

wss.on('connection', (ws) => {
  console.log('🔗 客戶端連線');
  clients.push(ws);

  ws.on('message', (message) => {
    console.log('📨 收到訊息:', message);
    // 廣播給所有瀏覽器端（p5.js）
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('❌ 客戶端離線');
    clients = clients.filter(client => client !== ws);
  });
});
