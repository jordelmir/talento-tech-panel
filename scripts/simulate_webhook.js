const crypto = require('crypto');

const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET || 'test-secret';
const targetRepoUrl = process.argv[2];

if (!targetRepoUrl) {
  console.error("❌ Error: Debes proveer la URL del repositorio como argumento.");
  console.log("Ejemplo: node simulate_webhook.js https://github.com/tu-usuario/tu-repo");
  process.exit(1);
}

// Emulamos el payload de GitHub de un push event
const payload = {
  repository: {
    html_url: targetRepoUrl
  },
  commits: [
    {
      id: "1234567890",
      added: [".gitignore", ".env.example"],
      modified: ["README.md"]
    }
  ]
};

const payloadString = JSON.stringify(payload);

// Firmamos matemáticamente usando HMAC-SHA256
const hmac = crypto.createHmac('sha256', webhookSecret);
hmac.update(payloadString);
const signature = `sha256=${hmac.digest('hex')}`;

async function run() {
  console.log(`🚀 Simulando evento 'push' desde GitHub...`);
  console.log(`📦 Repositorio Objetivo: ${targetRepoUrl}`);
  console.log(`🔐 Firma Computada: ${signature.substring(0, 20)}...`);

  try {
    const response = await fetch('http://localhost:3001/api/webhooks/github', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-github-event': 'push',
        'x-hub-signature-256': signature
      },
      body: payloadString
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ [ÉXITO] Webhook aceptado por Talento Tech.`);
      console.log(data);
    } else {
      console.error(`❌ [ERROR] Operación denegada por Talento Tech:`, response.status);
      console.error(data);
    }
  } catch (err) {
    console.error(`💥 [CRITICAL FALLBACK] Error de conexión: ${err.message}`);
    console.log(`Asegúrate de que el servidor (npm run dev) esté corriendo en el puerto 3001`);
  }
}

run();
