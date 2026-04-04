#!/bin/bash
# TALENTO TECH - GHOST AGENT AUTO-INSTALLER
# -----------------------------------------

echo "👻 Iniciando Instalación del Agente Ghost..."

# 1. Instalar dependencias si no existen
if ! command -v node &> /dev/null; then
    echo "📦 Instalando Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

if ! command -v pm2 &> /dev/null; then
    echo "📦 Instalando PM2..."
    sudo npm install -g pm2
fi

# 2. Configuración de Variables
echo "🔐 Configuración de Secretos (Supabase & GitHub):"
read -p "SUPABASE_URL: " sb_url
read -p "SUPABASE_SERVICE_ROLE_KEY: " sb_key
read -p "GITHUB_TOKEN: " gh_token

# 3. Crear archivo .env
cat <<EOF > .env
SUPABASE_URL=$sb_url
SUPABASE_SERVICE_ROLE_KEY=$sb_key
GITHUB_TOKEN=$gh_token
EOF

echo "✅ Archivo .env configurado."

# 4. Iniciar con PM2
pm2 start ghost-auditor.js --name "ghost-agent"
pm2 save
pm2 startup

echo "🚀 Agente Ghost en línea y auditando la seguridad nacional."
