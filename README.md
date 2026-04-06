# 🎓 Talento Tech Colombia: Plataforma Educativa de Próxima Generación

> **Ecosistema Multiplayer de Aprendizaje Técnico** — Democratizando la educación en ingeniería de software para toda Colombia.

---

## 🌟 Visión

Talento Tech es una plataforma **productiva a escala nacional** diseñada para democratizar el acceso a la educación técnica en Colombia. Proporciona herramientas de colaboración en tiempo real, portafolios automatizados, telemetría de aprendizaje profesional y paneles adaptativos para estudiantes de todos los niveles: Escuela, Colegio, Universidad, Profesores y Familias.

---

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

### 5. 🎮 Dashboards Adaptativos por Nivel
- **Escuela (TalentoKIDS)**: Gamificado con misiones, squad online y recompensas XP.
- **Colegio (TalentoTEEN)**: Terminal de código, retos binarios y hall of fame.
- **Universidad**: Ingeniería de sistemas, radar de competencias y deployment journal.
- **Profesores (CommandCenter)**: Gestión de cohortes, Ghost Audit IA y telemetría docente.
- **Familias (FamilyHub)**: Monitoreo parental con rastreo de racha, progreso y alertas.

### 6. 🛡️ Ghost Agent (Auditoría IA)
- Sistema de auditoría autónoma con detección de anomalías en código.
- RLS (Row Level Security) enforced en todas las tablas críticas.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Framework** | Next.js 16 (App Router) + React 19 |
| **Styling** | Tailwind CSS 4 (`@tailwindcss/postcss`) |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **State** | Zustand (`useProfileStore`) |
| **Backend & Realtime** | Supabase (PostgreSQL, Realtime, Auth, RLS) |
| **Telemetría** | Sentry (Edge + Server + Session Replay) |
| **Despliegue** | Vercel (CI/CD nativo con GitHub) |
| **Compute** | Oracle Cloud Infrastructure (OCI) |

---

## 🏗️ Guía de Inicio Rápido

### Requisitos Previos
- Node.js 18+
- Instancia de Supabase configurada con RLS policies.

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

## 📱 Diseño Responsive & Adaptativo

La plataforma implementa un sistema de diseño profesional:

- **Mobile-first** con breakpoints Tailwind: `sm:`, `md:`, `lg:`, `xl:`
- **Navegación móvil** con tabs sticky en todos los dashboards
- **Scrollbar personalizado** (dark theme) en Webkit y Firefox
- **Safe-area insets** para dispositivos con notch (iPhone, etc.)
- **Touch targets** de 44px mínimo para accesibilidad móvil
- **overflow-x-hidden** global para prevenir scroll horizontal
- **Tablas horizontalmente scrollables** en vistas de datos

---

## 🔒 Seguridad (RLS & Leaks)

- Todas las tablas críticas (`certificates`, `portfolio_projects`, `user_skills`, `family_links`) cuentan con políticas de **Row Level Security**.
- `.gitignore` configurado para excluir: `.env*`, `.vercel`, `.env.sentry-build-plugin`, `node_modules`.
- No hay tokens o secretos hardcodeados en el código fuente.
- Supabase client usa `process.env.NEXT_PUBLIC_*` exclusivamente.

---

## 📄 Licencia
Este proyecto es propiedad intelectual de **Talento Tech Colombia**. Todos los derechos reservados.

---
*Desarrollado con ❤️ para el talento colombiano por Jorge David Del Valle Miranda.*
