// infra/scripts/stop-services.js
const { spawn } = require('child_process');
const path = require('path');

async function stopServices() {
  await spawn('docker', ["compose", "down"], {
    cwd: path.resolve(__dirname, "../"),
    stdio: ['ignore', 'ignore', 'ignore']
  });}


process.on('SIGINT', () => {
  console.log("🔴 Parando os containers Docker...");
  stopServices();
  process.exit(); });


setInterval(() => {}, 1000); 