# ☁️ Despliegue de Seguridad Nacional: Oracle Cloud (OCI)

El **Agente Ghost** es el componente de auditoría pesada de la plataforma Talento Tech. Al correr en una instancia de **Oracle Cloud**, garantizamos soberanía tecnológica y capacidad de procesamiento fuera del "Edge" de Vercel.

## 🛠️ Requisitos en OCI

1. **Compute Instance:** Una instancia "Always Free" (Ampere A1 o AMD) con Ubuntu/Oracle Linux.
2. **Node.js:** Versión 20+ instalada.
3. **Network:** Acceso saliente (Egress) para clonar de GitHub y conectar a Supabase.

## 🚀 Pasos de Instalación Express

### 1. Preparar el Entorno
Conéctate por SSH a tu instancia de Oracle y ejecuta:
```bash
sudo apt update && sudo apt install -y nodejs npm git
sudo npm install -g pm2
```

### 2. Clonar y Configurar
Crea una carpeta para el auditor:
```bash
mkdir ghost-auditor && cd ghost-auditor
# Copia el archivo scripts/ghost-auditor.js a esta carpeta
```

### 3. Variables de Envío (Crítico)
Crea un archivo `.env` en la instancia:
```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_secreta
GITHUB_TOKEN=tu_personal_access_token
```

### 4. Lanzamiento con PM2 (Daemonizado)
```bash
pm2 start ghost-auditor.js --name "ghost-agent"
pm2 save
pm2 startup
```

## 👻 ¿Qué está haciendo el Ghost ahora?
- **Polling:** Escanea la tabla `repository_submissions` cada 30 segundos.
- **Auditoría IA:** Clona repositorios de alumnos de forma efímera.
- **Seguridad:** Busca llaves de Supabase filtradas y políticas RLS faltantes.
- **Feedback:** Reporta directamente al Dashboard del Profesor en tiempo real.

## ⚡ Comando Maestro OCI (Instalación en 1 Paso)

Si ya tienes una instancia limpia de Ubuntu en Oracle Cloud, pega este comando para configurar todo el Agente Ghost automáticamente:

```bash
curl -fsSL https://raw.githubusercontent.com/jordelmir/talento-tech-panel/main/scripts/install_ghost.sh | bash
```

> [!NOTE]
> Este comando instalará Node.js, PM2, clonará el script y te pedirá las variables de entorno interactivamente.
