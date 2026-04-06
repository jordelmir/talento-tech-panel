# 🎓 Talento Tech Colombia: Plataforma Educativa de Próxima Generación

![Talento Tech Banner](https://placehold.co/1200x400/0f172a/white?text=Talento+Tech+Colombia+-+Multiplayer+Coding+Ecosystem)

## 🌟 Visión
Talento Tech es una plataforma diseñada para democratizar el acceso a la educación técnica en Colombia, proporcionando herramientas de colaboración en tiempo real, portafolios automatizados y telemetría de aprendizaje de nivel profesional.

## 🚀 Características Principales

### 1. 🤝 Pair Programming Multijugador (Live-Share)
- **Tecnología**: Supabase Realtime (Presence & Broadcast).
- **Funcionalidad**: Colaboración simultánea en el `CodePlayground` con presencia de cursores y sincronización de código en milisegundos.

### 2. ⚡ Portafolios y Certificados SSR (Edge Optimized)
- **Arquitectura**: Server Components con Next.js e ISR (Incremental Static Regeneration).
- **Beneficio**: Carga instantánea de perfiles públicos y certificados con datos hidratados directamente desde Supabase en el Edge.

### 3. 📊 Dashboard O.C.T.A.V.O (Teacher & Family Monitoring)
- **Propósito**: Seguimiento detallado del progreso del estudiante.
- **Vistas**: Central de comandos para profesores y monitoreo dinámico para familias (`family_links`).

### 4. 🛰️ Telemetría y Resiliencia (Sentry Pro)
- Monitoreo de errores en tiempo real y **Session Replay** para depuración visual.
- Optimización de performance con Distributed Tracing.

---

## 🛠️ Stack Tecnológico
- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Lucide Icons, Recharts.
- **Backend & Realtime**: Supabase (PostgreSQL, Realtime, Auth, Storage).
- **Telemetría**: Sentry.
- **Despliegue**: Vercel (CI/CD nativo con GitHub).

---

## 🏗️ Guía de Inicio Rápido

### Requisitos Previos
- Node.js 18+
- Instancia de Supabase configurada con el esquema "God-Tier".

### Configuración del Entorno
Crea un archivo `.env.local` con las siguientes variables:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
NEXT_PUBLIC_SENTRY_DSN=tu_dsn_de_sentry
```

### Instalación
```bash
npm install
npm run dev
```

---

## 🔒 Seguridad (RLS)
Todas las tablas críticas (`certificates`, `portfolio_projects`, `user_skills`) cuentan con políticas de **Row Level Security** integradas para asegurar que los datos de los estudiantes estén protegidos y solo sean accesibles por los roles autorizados.

## 📄 Licencia
Este proyecto es propiedad intelectual de **Talento Tech Colombia**. Todos los derechos reservados.

---
*Desarrollado con ❤️ para el talento colombiano.*
