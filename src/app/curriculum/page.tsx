'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import {
  Activity,
  Terminal,
  Cloud,
  Sparkles,
  Bot,
  Database,
  Bug,
  Shield,
  Container,
  Briefcase,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Clock,
  ArrowLeft,
  BookOpen,
  Zap,
  Lock,
  GitBranch,
  Server,
  Cpu,
  Globe,
  Rocket,
  Users,
  TrendingUp
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  DATA: Los 9 Módulos del Programa Formativo                        */
/* ------------------------------------------------------------------ */

type ModuleData = {
  id: number
  title: string
  subtitle: string
  icon: React.ElementType
  color: string // tailwind color name
  completed: boolean
  description: string
  steps: string[]
  deliverable: string
  tags: string[]
}

const MODULES: ModuleData[] = [
  {
    id: 0,
    title: 'Fundamentos y el Poder de la Terminal',
    subtitle: 'El verdadero centro de control del desarrollador',
    icon: Terminal,
    color: 'slate',
    completed: false,
    description:
      'Antes de tocar la IA, el alumno debe entender dónde opera el software. Este módulo elimina el miedo a la línea de comandos y establece las bases universales de cómo se comunican los sistemas modernos y cómo se protege la información crítica.',
    steps: [
      'Dominio Magistral de la Terminal: interfaz de línea de comandos (CLI), navegación de directorios, creación de archivos y ejecución de scripts básicos.',
      'Anatomía del Software: Frontend (lo que el usuario ve) y Backend (el motor y los datos). Comunicación vía APIs (peticiones HTTP, JSON).',
      'Lógica de Negocios vs. Lógica de Sistemas: las reglas que hacen que el negocio gane dinero vs. las reglas que mantienen el sistema vivo.',
      'Seguridad y Control de Versiones: creación del .env, configuración del .gitignore, Git y GitHub — repos públicos vs. privados, cómo invitar colaboradores.',
    ],
    deliverable:
      'Crear un repositorio en GitHub (uno público y uno privado), inicializarlo desde la terminal, crear un .env y un .gitignore, y hacer el primer commit.',
    tags: ['CLI', '.env', '.gitignore', 'Git', 'GitHub'],
  },
  {
    id: 1,
    title: 'La Nube como tu PC Personal (Hardware Cero)',
    subtitle: 'Estación de trabajo de alto rendimiento desde cualquier dispositivo',
    icon: Cloud,
    color: 'sky',
    completed: false,
    description:
      'Configurar una estación de trabajo de alto rendimiento accesible desde cualquier lugar. El servidor en la nube hace el trabajo pesado y el teléfono será el cliente ligero.',
    steps: [
      'Infraestructura Oracle Cloud: creación de cuenta y despliegue de instancia ARM (Ampere A1) Always Free con 24GB RAM y 4 vCPUs.',
      'El Cliente Ligero (Android/Termux): configuración de Termux en dispositivos móviles — el teléfono se convierte en el puente.',
      'Conexión y Entorno: generación de llaves SSH en Termux y conexión al servidor Oracle.',
      'Setup del Servidor: instalación de Node.js, Python, Git y Gemini CLI en Oracle. El trabajo pesado ocurre en la nube.',
    ],
    deliverable:
      'Captura de terminal en Android mostrando conexión SSH exitosa a Oracle y ejecución de un comando de prueba con Gemini CLI.',
    tags: ['Oracle Cloud', 'Termux', 'SSH', 'ARM', 'Gemini CLI'],
  },
  {
    id: 2,
    title: 'Mi Primera App y FinOps',
    subtitle: 'Orquestar la IA para crear software y blindar tu economía',
    icon: Sparkles,
    color: 'violet',
    completed: false,
    description:
      'El alumno no escribirá código desde cero, sino que aprenderá a orquestar la IA para generar la primera versión de un producto funcional. Además, blindará su economía contra loops infinitos y gastos descontrolados.',
    steps: [
      'Google AI Studio: creación de cuenta, sincronización con GitHub e iteración de una interfaz gráfica (UI/UX).',
      'Generación Iterativa: crear el esqueleto de la primera app y solicitar mejoras específicas a la IA.',
      'Economía de APIs (FinOps): entender los tiers gratuitos, configurar límites de facturación y alertas.',
      'Refinamiento: iterar sobre la aplicación para hacerla más bonita y completa.',
    ],
    deliverable:
      'Repositorio con la app iterada por IA y captura de las alertas de facturación configuradas.',
    tags: ['Google AI Studio', 'FinOps', 'UI/UX', 'Billing Limits'],
  },
  {
    id: 3,
    title: 'Entorno Agéntico y MCPs (Google Antigravity)',
    subtitle: 'De usuario de chat a orquestador de agentes IA',
    icon: Bot,
    color: 'cyan',
    completed: false,
    description:
      'El núcleo técnico avanzado. Transformar al alumno de un "usuario de chat" a un "orquestador de agentes" utilizando herramientas de última generación.',
    steps: [
      'Instalación y Configuración: descarga y setup de Google Antigravity. Configuración Básico, Medio y Avanzado.',
      'Model Context Protocol (MCP): qué son y por qué revolucionan la IA. Configuración de los MCPs más famosos (lectura de archivos, búsqueda web, ejecución de comandos).',
      'CLI Agénticos y Skills: instalación de herramientas CLI impulsadas por IA y skills especializadas.',
      'Auditoría de IA: leer logs para verificar que Gemini usa las herramientas y MCPs configurados, y no alucina respuestas.',
    ],
    deliverable:
      'Ejecución de un CLI agéntico en Oracle, disparado desde Termux, que analice un directorio local mediante un MCP.',
    tags: ['Antigravity', 'MCP', 'Skills', 'Gemini', 'Agentes IA'],
  },
  {
    id: 4,
    title: 'Arquitectura de Datos (Supabase)',
    subtitle: 'Persistencia de datos con seguridad de grado empresarial',
    icon: Database,
    color: 'emerald',
    completed: false,
    description:
      'Dar vida a la aplicación estructurando la base de datos y conectándola mediante los agentes configurados. Seguridad a nivel de fila y automatización con triggers.',
    steps: [
      'Creación de cuenta en Supabase. Diseño de tablas, tipos de datos y relaciones (Foreign Keys).',
      'Seguridad a Nivel de Fila (RLS): configuración de políticas estrictas. El Frontend nunca accede sin validación.',
      'Automatización con Triggers: funciones automáticas en la base de datos (ej. actualizar timestamp al modificar una fila).',
      'Integración Total: conectar Supabase a Antigravity usando Project URL, Publishable Key, Direct Connection String y CLI agéntico.',
    ],
    deliverable:
      'Base de datos Supabase con tablas, políticas RLS activas, y operaciones CRUD exitosas ejecutadas a través de la IA.',
    tags: ['Supabase', 'PostgreSQL', 'RLS', 'Triggers', 'CRUD'],
  },
  {
    id: 5,
    title: 'Debugging, Pruebas y Despliegue (Vercel)',
    subtitle: 'Código resiliente y expuesto al internet real',
    icon: Bug,
    color: 'amber',
    completed: false,
    description:
      'La fase de producción. Código resiliente con pruebas automatizadas, debugging agéntico y el primer despliegue en internet.',
    steps: [
      'Debugging Agéntico: leer errores de red y terminal. Alimentar a la IA con contexto de fallos exactos, no quejas.',
      'Testing con IA: generar pruebas unitarias de la lógica de negocios usando el Phront Maestro.',
      'El "Phront Maestro": técnicas avanzadas de prompting para delegar el ensamblaje final. Uso de Gemini, Claude o ChatGPT.',
      'Despliegue: conectar Vercel vía CLI/MCP/Skills. Compilar, hacer commit y gatillar despliegue automático. URL pública en internet.',
    ],
    deliverable:
      'URL pública de la aplicación funcionando en internet con conexión a la base de datos.',
    tags: ['Vercel', 'Testing', 'Debugging', 'Phront Maestro', 'CI/CD'],
  },
  {
    id: 6,
    title: 'Seguridad Defensiva y PromptOps',
    subtitle: 'Asumir que el sistema será atacado',
    icon: Shield,
    color: 'rose',
    completed: false,
    description:
      'Seguridad proactiva. Usar agentes IA para hackear tu propio código y versionar las instrucciones como si fueran código fuente.',
    steps: [
      'Red Teaming de IA: usar un agente para intentar hackear el código escrito por otro agente (ej. inyección SQL).',
      'PromptOps: versionar los Phronts Maestros y configuraciones de MCPs en GitHub como si fueran código fuente.',
      'Parches de Seguridad: corregir vulnerabilidades detectadas por el agente atacante.',
      'Auditoría de historial: mantener un log versionado de todos los prompts y configuraciones.',
    ],
    deliverable:
      'Repositorio actualizado con historial de prompts versionado y parche de seguridad aplicado.',
    tags: ['Red Teaming', 'PromptOps', 'Seguridad', 'SQL Injection'],
  },
  {
    id: 7,
    title: 'Expansión y Contenedores',
    subtitle: 'Autonomía tecnológica y distribución multiplataforma',
    icon: Container,
    color: 'indigo',
    completed: false,
    description:
      'Romper la dependencia de una sola herramienta. Exploración masiva de tecnologías para la autonomía total.',
    steps: [
      'Alternativas de Backend: prácticas con Railway, Stitch y otros servicios cloud.',
      'Docker con IA: contenerizar aplicaciones dentro del servidor Oracle. Aislar apps como estándar de la industria.',
      'Desarrollo Móvil: configuración básica de Android Studio y Apple Xcode. Compilación de APKs.',
      'Distribución: publicación en Google Play Store, Apple App Store. Alternativas: PWAs, tiendas de terceros.',
    ],
    deliverable:
      'Dockerfile funcional desplegado o APK de prueba compilado utilizando asistencia de IA.',
    tags: ['Docker', 'Railway', 'APK', 'Play Store', 'App Store', 'PWA'],
  },
  {
    id: 8,
    title: 'El Mundo Real — Arquitecturas Maestras y Prospección',
    subtitle: 'Monetizar. Resolver problemas reales del entorno.',
    icon: Briefcase,
    color: 'amber',
    completed: false,
    description:
      'El desarrollo no sirve si no resuelve problemas reales. Transición de estudiante a profesional independiente capaz de monetizar sus habilidades.',
    steps: [
      'Planos Arquitectónicos: estudio de sistemas complejos pre-diseñados listos para adaptar (ride-hailing, gestión de loterías, etc.).',
      'Identidad Profesional: estructurar perfil, portafolio y marca personal enfocada en soluciones.',
      'Inteligencia Comercial: identificar negocios locales con problemas operativos que se resuelven con software.',
      'El Ciclo de Venta: seleccionar cliente, construir la app con IA en tiempo récord, presentar la solución funcional.',
    ],
    deliverable:
      'Despliegue completo de un producto end-to-end (Frontend, Backend, Seguridad, Despliegue) diseñado para un cliente real.',
    tags: ['Marca Personal', 'Prospección', 'Freelance', 'Portafolio'],
  },
]

/* ------------------------------------------------------------------ */
/*  COMPONENT: Module Accordion Card                                  */
/* ------------------------------------------------------------------ */

const colorMap: Record<string, { border: string; glow: string; bg: string; text: string; badge: string; dot: string }> = {
  slate:   { border: 'border-slate-500/40',   glow: 'shadow-slate-500/10',   bg: 'bg-slate-500/10',   text: 'text-slate-400',   badge: 'bg-slate-500/15 text-slate-300 border-slate-500/30',   dot: 'bg-slate-400' },
  sky:     { border: 'border-sky-500/40',     glow: 'shadow-sky-500/10',     bg: 'bg-sky-500/10',     text: 'text-sky-400',     badge: 'bg-sky-500/15 text-sky-300 border-sky-500/30',         dot: 'bg-sky-400' },
  violet:  { border: 'border-violet-500/40',  glow: 'shadow-violet-500/10',  bg: 'bg-violet-500/10',  text: 'text-violet-400',  badge: 'bg-violet-500/15 text-violet-300 border-violet-500/30', dot: 'bg-violet-400' },
  cyan:    { border: 'border-cyan-500/40',    glow: 'shadow-cyan-500/10',    bg: 'bg-cyan-500/10',    text: 'text-cyan-400',    badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',       dot: 'bg-cyan-400' },
  emerald: { border: 'border-emerald-500/40', glow: 'shadow-emerald-500/10', bg: 'bg-emerald-500/10', text: 'text-emerald-400', badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', dot: 'bg-emerald-400' },
  amber:   { border: 'border-amber-500/40',   glow: 'shadow-amber-500/10',   bg: 'bg-amber-500/10',   text: 'text-amber-400',   badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',     dot: 'bg-amber-400' },
  rose:    { border: 'border-rose-500/40',    glow: 'shadow-rose-500/10',    bg: 'bg-rose-500/10',    text: 'text-rose-400',    badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',       dot: 'bg-rose-400' },
  indigo:  { border: 'border-indigo-500/40',  glow: 'shadow-indigo-500/10',  bg: 'bg-indigo-500/10',  text: 'text-indigo-400',  badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30', dot: 'bg-indigo-400' },
}

function ModuleCard({ mod, index, isOpen, onToggle }: { mod: ModuleData; index: number; isOpen: boolean; onToggle: () => void }) {
  const colors = colorMap[mod.color] || colorMap.slate
  const Icon = mod.icon

  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-500
        ${isOpen ? `${colors.border} shadow-2xl ${colors.glow}` : 'border-white/5 hover:border-white/15'}
        bg-[#0A0A0A]/80 backdrop-blur-md overflow-hidden`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Header — always visible */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-5 p-6 md:p-8 text-left cursor-pointer"
      >
        {/* Module number + icon */}
        <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center ${colors.bg} transition-transform group-hover:scale-110`}>
          <Icon className={`w-7 h-7 ${colors.text}`} />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <span className={`text-xs font-mono font-bold uppercase tracking-widest ${colors.text}`}>
              Módulo {mod.id}
            </span>
            {/* Traffic light */}
            {mod.completed ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" /> Completado
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2.5 py-0.5 rounded-full">
                <Clock className="w-3.5 h-3.5" /> Pendiente
              </span>
            )}
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white truncate">{mod.title}</h3>
          <p className="text-sm text-slate-500 truncate">{mod.subtitle}</p>
        </div>

        {/* Chevron */}
        <div className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-5 h-5 text-slate-500" />
        </div>
      </button>

      {/* Body — expanded */}
      <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 md:px-8 pb-8 pt-0 space-y-6 border-t border-white/5">

          {/* Description */}
          <p className="text-slate-400 leading-relaxed pt-6">
            {mod.description}
          </p>

          {/* Steps */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              Guía Paso a Paso
            </h4>
            <div className="space-y-3">
              {mod.steps.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <div className="shrink-0 mt-1.5">
                    <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {mod.tags.map((tag) => (
              <span key={tag} className={`text-xs font-semibold px-3 py-1 rounded-lg border ${colors.badge}`}>
                {tag}
              </span>
            ))}
          </div>

          {/* Deliverable */}
          <div className={`rounded-xl border p-5 ${mod.completed ? 'bg-emerald-950/20 border-emerald-800/40' : 'bg-rose-950/15 border-rose-800/30'}`}>
            <div className="flex items-start gap-3">
              {mod.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <Rocket className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div>
                <h5 className={`text-sm font-bold uppercase tracking-wider mb-1 ${mod.completed ? 'text-emerald-400' : 'text-rose-400'}`}>
                  Entregable {mod.completed ? '— ✅ Aprobado' : '— 🔴 Pendiente'}
                </h5>
                <p className="text-sm text-slate-400 leading-relaxed">{mod.deliverable}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function CurriculumPage() {
  const [openModule, setOpenModule] = useState<number | null>(null)
  const [completedModuleIds, setCompletedModuleIds] = useState<number[]>([])

  useEffect(() => {
    let isMounted = true
    const fetchProgress = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !isMounted) return

      const { data, error } = await supabase
        .from('repository_submissions')
        .select('module_name, status')
        .eq('student_id', user.id)

      if (data && !error && isMounted) {
        const passedIds = data
          .filter(sub => sub.status === 'passed' || sub.status === 'exceptional')
          .map(sub => parseInt(sub.module_name, 10))
          .filter(id => !isNaN(id))
        setCompletedModuleIds(passedIds)
      }
    }
    fetchProgress()
    return () => { isMounted = false }
  }, [])

  const dynamicModules = MODULES.map(mod => ({
    ...mod,
    completed: completedModuleIds.includes(mod.id)
  }))

  const completedCount = dynamicModules.filter((m) => m.completed).length
  const totalCount = dynamicModules.length
  const progressPercent = Math.round((completedCount / totalCount) * 100)

  const toggle = (id: number) => {
    setOpenModule((prev) => (prev === id ? null : id))
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-emerald-500/30 overflow-hidden">
      {/* Glow */}
      <div className="fixed top-0 left-1/3 w-[600px] h-[600px] bg-emerald-600/10 blur-[150px] -z-10 pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 blur-[120px] -z-10 pointer-events-none" />

      {/* Header / Nav */}
      <nav className="max-w-6xl mx-auto px-6 py-8 flex justify-between items-center relative z-10">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-emerald-500 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
            <Activity className="w-5 h-5 text-black" strokeWidth={3} />
          </div>
          <span className="font-bold text-xl tracking-tight">Talento Tech</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Inicio
        </Link>
      </nav>

      {/* Page Title */}
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-4 relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <Zap className="w-5 h-5 text-emerald-400" />
          <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">
            Programa Formativo
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 bg-gradient-to-r from-white via-white to-slate-500 bg-clip-text text-transparent">
          Módulos del Programa
        </h1>
        <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
          Ingeniería Full-Stack y Desarrollo Autónomo Asistido por IA. Desde los fundamentos absolutos hasta la completa autonomía operativa, comercial y técnica.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Progreso General</h2>
              <p className="text-sm text-slate-500">
                {completedCount} de {totalCount} módulos completados
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <span className="text-slate-400">Completado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                <span className="text-slate-400">Pendiente</span>
              </div>
            </div>
          </div>

          {/* Bar */}
          <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000 ease-out relative"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>
          </div>
          <div className="mt-2 text-right">
            <span className="text-2xl font-black text-emerald-400 font-mono">{progressPercent}%</span>
          </div>

          {/* Module dots */}
          <div className="flex gap-2 mt-4">
            {dynamicModules.map((mod) => (
              <button
                key={mod.id}
                onClick={() => toggle(mod.id)}
                className={`flex-1 h-2 rounded-full transition-all cursor-pointer ${
                  mod.completed
                    ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]'
                    : 'bg-rose-500/40 hover:bg-rose-500/70'
                }`}
                title={`Módulo ${mod.id}: ${mod.title}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Module List — Accordion */}
      <div className="max-w-6xl mx-auto px-6 pb-32 relative z-10">
        <div className="space-y-4">
          {dynamicModules.map((mod, i) => (
            <ModuleCard
              key={mod.id}
              mod={mod}
              index={i}
              isOpen={openModule === mod.id}
              onToggle={() => toggle(mod.id)}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-500" />
            <span className="font-bold text-lg">Talento Tech 2026</span>
          </div>
          <p className="text-sm text-slate-500 font-mono tracking-wider">
            INGENIERÍA DE ORQUESTACIÓN • FÁBRICA DE AUTONOMÍA
          </p>
        </div>
      </footer>
    </div>
  )
}
