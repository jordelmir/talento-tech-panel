'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Activity,
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Target,
  Shield,
  DollarSign,
  Bug,
  TestTube,
  Webhook,
  Bot,
  Users,
  Gamepad2,
  Globe,
  BarChart3,
  Briefcase,
  Smartphone,
  Server,
  Terminal,
  ChevronRight,
  ExternalLink,
  Zap,
  Lock,
  Database,
  Rocket,
  Eye,
  Brain,
  Trophy,
  Network,
  FileCode2,
  ChevronUp,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  DOCS SECTIONS DATA                                                 */
/* ------------------------------------------------------------------ */

type Section = {
  id: string
  title: string
  icon: React.ElementType
}

const SECTIONS: Section[] = [
  { id: 'metodologia', title: 'Metodología de Progreso', icon: Target },
  { id: 'curriculo', title: 'Currículo Maestro', icon: GraduationCap },
  { id: 'finops', title: 'FinOps y Control de Daños', icon: DollarSign },
  { id: 'debugging', title: 'Debugging Agéntico', icon: Bug },
  { id: 'testing', title: 'Testing Automatizado con IA', icon: TestTube },
  { id: 'seguridad', title: 'Seguridad Defensiva', icon: Shield },
  { id: 'plataforma', title: 'Arquitectura de la Plataforma', icon: Server },
  { id: 'webhooks', title: 'Validación Automatizada', icon: Webhook },
  { id: 'tutor-ia', title: 'Tutor IA Contextualizado', icon: Bot },
  { id: 'matchmaking', title: 'Matchmaking P2P', icon: Users },
  { id: 'gamificacion', title: 'Gamificación Hardcore', icon: Gamepad2 },
  { id: 'portafolio', title: 'Portafolio Dinámico', icon: Trophy },
  { id: 'infraestructura', title: 'Infraestructura Móvil', icon: Smartphone },
  { id: 'admin', title: 'Panel del Administrador', icon: BarChart3 },
  { id: 'alumni', title: 'Red de Alumni', icon: Briefcase },
]

/* ------------------------------------------------------------------ */
/*  COMPONENTS                                                         */
/* ------------------------------------------------------------------ */

function SectionBlock({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 mb-16">
      {children}
    </section>
  )
}

function SectionTitle({ icon: Icon, children, color = 'emerald' }: { icon: React.ElementType; children: React.ReactNode; color?: string }) {
  const colorClasses: Record<string, string> = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    violet: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
    sky: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
  }
  const cls = colorClasses[color] || colorClasses.emerald
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className={`p-2.5 rounded-xl border ${cls}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">{children}</h2>
    </div>
  )
}

function InfoCard({ title, children, variant = 'default' }: { title: string; children: React.ReactNode; variant?: 'default' | 'warning' | 'success' | 'danger' }) {
  const variants: Record<string, string> = {
    default: 'border-white/10 bg-white/5',
    warning: 'border-amber-500/30 bg-amber-500/10',
    success: 'border-emerald-500/30 bg-emerald-500/10',
    danger: 'border-rose-500/30 bg-rose-500/10',
  }
  return (
    <div className={`rounded-xl border p-6 ${variants[variant]} mb-4`}>
      <h4 className="text-base font-bold text-white mb-2">{title}</h4>
      <div className="text-sm text-slate-400 leading-relaxed space-y-2">{children}</div>
    </div>
  )
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-[#0A0A0A] border border-white/5 rounded-lg p-4 overflow-x-auto text-sm font-mono text-emerald-300 my-4 whitespace-pre-wrap">
      {children}
    </pre>
  )
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('metodologia')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting)
        if (visible?.target.id) setActiveSection(visible.target.id)
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0.1 }
    )

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-emerald-500/30">
      {/* Background */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-cyan-900/10 blur-[150px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-emerald-900/10 blur-[150px] pointer-events-none -z-10" />

      {/* Top Nav */}
      <nav className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-emerald-500 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
              <Activity className="w-5 h-5 text-black" strokeWidth={3} />
            </div>
            <span className="font-bold text-xl tracking-tight">Talento Tech</span>
            <span className="text-xs font-mono text-slate-500 ml-2 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              DOCS
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/curriculum" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1">
              <BookOpen className="w-4 h-4" /> Módulos
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Inicio
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto py-8 pr-6 pl-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Contenido</h3>
            <nav className="space-y-1">
              {SECTIONS.map((s) => {
                const Icon = s.icon
                return (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                      activeSection === s.id
                        ? 'bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20'
                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{s.title}</span>
                  </a>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-50 bg-emerald-500 text-black p-3 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-110 transition-transform"
        >
          <BookOpen className="w-5 h-5" />
        </button>

        {/* Mobile sidebar */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
            <div className="absolute right-0 top-0 bottom-0 w-72 bg-[#0A0A0A] border-l border-white/10 overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Contenido</h3>
              <nav className="space-y-1">
                {SECTIONS.map((s) => {
                  const Icon = s.icon
                  return (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                        activeSection === s.id
                          ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{s.title}</span>
                    </a>
                  )
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-12 py-8 sm:py-12">

          {/* Hero */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Documentación Oficial</span>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tighter mb-4 bg-gradient-to-r from-white via-white to-slate-500 bg-clip-text text-transparent leading-tight">
              Programa Formativo:<br />Ingeniería Full-Stack Autónoma
            </h1>
            <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
              Diseñado con el rigor de una arquitectura de software de nivel empresarial. Cada módulo está orientado a la ejecución y al despliegue. Sin teoría sin aplicación directa.
            </p>
          </div>

          {/* ============================================ */}
          {/*  SECTION: Metodología                        */}
          {/* ============================================ */}
          <SectionBlock id="metodologia">
            <SectionTitle icon={Target}>Metodología de Progreso y Evaluación</SectionTitle>
            <p className="text-slate-400 leading-relaxed mb-6">
              El avance del alumno <strong className="text-white">no se mide por exámenes teóricos</strong>, sino por código desplegado y repositorios funcionales. Cada módulo cuenta con un entregable práctico verificable.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard title="🔴 Pendiente" variant="danger">
                <p>El alumno aún no domina el concepto o no ha entregado el enlace al repositorio/proyecto funcional.</p>
              </InfoCard>
              <InfoCard title="🟢 Completado" variant="success">
                <p>El alumno ha entregado el repositorio, el código está versionado correctamente y la arquitectura básica es funcional.</p>
              </InfoCard>
            </div>
            <InfoCard title="Validación Automática">
              <p>La plataforma se conecta a la API de GitHub del alumno. Cuando se detecta un push correcto que cumple los requisitos del módulo, el estado cambia automáticamente de 🔴 a 🟢 en milisegundos, sin intervención humana.</p>
            </InfoCard>
          </SectionBlock>

          {/* ============================================ */}
          {/*  SECTION: Currículo                           */}
          {/* ============================================ */}
          <SectionBlock id="curriculo">
            <SectionTitle icon={GraduationCap} color="cyan">Currículo Maestro &mdash; 9 Módulos</SectionTitle>
            <p className="text-slate-400 leading-relaxed mb-6">
              El programa se divide en 9 módulos secuenciales, cada uno construyendo sobre el anterior, desde los fundamentos de la terminal hasta la monetización real.
            </p>
            <div className="space-y-3">
              {[
                { n: 0, t: 'Fundamentos y el Poder de la Terminal', d: 'CLI, Frontend/Backend, .env, .gitignore, Git' },
                { n: 1, t: 'La Nube como tu PC Personal', d: 'Oracle Cloud ARM, Termux, SSH, Gemini CLI' },
                { n: 2, t: 'Mi Primera App y FinOps', d: 'Google AI Studio, GitHub sync, billing limits' },
                { n: 3, t: 'Entorno Agéntico y MCPs', d: 'Google Antigravity, MCP setup, auditoría de IA' },
                { n: 4, t: 'Arquitectura de Datos', d: 'Supabase, PostgreSQL, RLS, Triggers, CRUD agéntico' },
                { n: 5, t: 'Debugging, Pruebas y Despliegue', d: 'Testing IA, Phront Maestro, Vercel deploy' },
                { n: 6, t: 'Seguridad Defensiva y PromptOps', d: 'Red Teaming, versionado de prompts' },
                { n: 7, t: 'Expansión y Contenedores', d: 'Docker, APKs, Play Store, App Store, PWA' },
                { n: 8, t: 'El Mundo Real', d: 'Arquitecturas maestras, prospección, primer cliente' },
              ].map((m) => (
                <div key={m.n} className="flex items-center gap-4 bg-[#0A0A0A] border border-white/5 rounded-xl p-4 hover:border-white/15 transition-colors">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm">
                    {m.n}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white">{m.t}</h4>
                    <p className="text-xs text-slate-500 truncate">{m.d}</p>
                  </div>
                  <Link href="/curriculum" className="shrink-0 ml-auto text-slate-500 hover:text-emerald-400 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </SectionBlock>

          {/* ============================================ */}
          {/*  SECTION: FinOps                              */}
          {/* ============================================ */}
          <SectionBlock id="finops">
            <SectionTitle icon={DollarSign} color="amber">FinOps y Control de Daños</SectionTitle>
            <InfoCard title="El Problema" variant="danger">
              <p>El uso de APIs (OpenAI, Anthropic, Gemini, Supabase, Vercel) tiene costos asociados. Un <strong className="text-rose-300">loop infinito</strong> generado por una IA en el código de un alumno puede vaciarle la tarjeta de crédito.</p>
            </InfoCard>
            <InfoCard title="La Solución" variant="success">
              <p>Enseñar a configurar <strong className="text-emerald-300">límites de facturación</strong> (billing limits), alertas de presupuesto y a entender los tiers gratuitos. El alumno debe saber cómo proteger su infraestructura a nivel financiero antes de desplegar cualquier cosa.</p>
            </InfoCard>
            <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6 mt-4">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" /> Checklist FinOps
              </h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex gap-2"><span className="text-amber-400">→</span> Configurar billing alerts en Google Cloud Console</li>
                <li className="flex gap-2"><span className="text-amber-400">→</span> Establecer spending caps en Supabase y Vercel</li>
                <li className="flex gap-2"><span className="text-amber-400">→</span> Revisar los tiers gratuitos de cada servicio antes de integrarlo</li>
                <li className="flex gap-2"><span className="text-amber-400">→</span> Nunca dejar API keys con permisos ilimitados en producción</li>
                <li className="flex gap-2"><span className="text-amber-400">→</span> Usar variables de entorno para todas las credenciales: <code className="bg-slate-900 px-1.5 py-0.5 rounded text-emerald-300 text-xs">.env.local</code></li>
              </ul>
            </div>
          </SectionBlock>

          {/* ============================================ */}
          {/*  SECTION: Debugging                           */}
          {/* ============================================ */}
          <SectionBlock id="debugging">
            <SectionTitle icon={Bug} color="rose">Debugging Agéntico y Manejo de Alucinaciones</SectionTitle>
            <InfoCard title="El Problema" variant="danger">
              <p>La IA se equivoca. Si la aplicación falla y la IA no sabe cómo arreglarlo, el alumno autodidacta se frustra y abandona.</p>
            </InfoCard>
            <InfoCard title="La Solución" variant="success">
              <p>Enseñar a <strong className="text-emerald-300">leer logs de terminal</strong>, inspeccionar la red en el navegador (Network Tab) y estructurar prompts de debugging. El alumno debe aprender a alimentar a la IA con los <strong className="text-emerald-300">errores exactos y el contexto del sistema</strong>, en lugar de decirle &quot;no funciona, arréglalo&quot;.</p>
            </InfoCard>
            <CodeBlock>{`# ❌ Prompt malo:
"Mi app no funciona, arréglala"

# ✅ Prompt de debugging efectivo:
"Estoy usando Next.js 16 + Supabase. Al hacer POST a /api/submit 
obtengo error 500. El log del servidor dice:
'RLS policy violation on table submissions'. 
Mi política RLS actual es: ... [pegar la política]
¿Qué está mal con la policy?"`}</CodeBlock>
          </SectionBlock>

          {/* ============================================ */}
          {/*  SECTION: Testing                             */}
          {/* ============================================ */}
          <SectionBlock id="testing">
            <SectionTitle icon={TestTube} color="violet">Testing Automatizado Generado por IA</SectionTitle>
            <InfoCard title="El Principio">
              <p>Código de producción sin pruebas es una bomba de tiempo. Antes del despliegue final, el alumno usa el <strong className="text-white">Phront Maestro</strong> para generar pruebas unitarias de la lógica de negocios. <em className="text-violet-400">Que la IA pruebe a la IA.</em></p>
            </InfoCard>
            <CodeBlock>{`# Ejemplo de prompt para generar tests:
"Genera pruebas unitarias completas para la función 
calculateTripPrice() que valide:
1. Precio base correcto según distancia
2. Recargo por hora pico (6-9am, 5-8pm)
3. Descuento por usuario frecuente (>10 viajes)
4. Manejo de input inválido (distancia negativa, null)
Usa Vitest como framework de testing."`}</CodeBlock>
          </SectionBlock>

          {/* ============================================ */}
          {/*  SECTION: Seguridad                           */}
          {/* ============================================ */}
          <SectionBlock id="seguridad">
            <SectionTitle icon={Shield} color="rose">Seguridad Defensiva y PromptOps</SectionTitle>
            <p className="text-slate-400 leading-relaxed mb-6">
              Asumir que el sistema será atacado. Usar agentes IA ofensivos contra tu propio código y tratar las instrucciones como código fuente.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard title="Red Teaming con IA" variant="warning">
                <p>Usar un agente para intentar hackear el código escrito por otro agente: inyección SQL, XSS, credenciales expuestas, bypass de RLS.</p>
              </InfoCard>
              <InfoCard title="PromptOps" variant="default">
                <p>Versionar los Phronts Maestros y configuraciones de MCPs en GitHub como si fueran código fuente. Cada cambio tiene su commit con mensaje descriptivo.</p>
              </InfoCard>
            </div>
          </SectionBlock>

          {/* ============================================ */}
          {/*  SECTION: Plataforma                          */}
          {/* ============================================ */}
          <SectionBlock id="plataforma">
            <SectionTitle icon={Server} color="cyan">Arquitectura de la Plataforma (La App de la Academia)</SectionTitle>
            <p className="text-slate-400 leading-relaxed mb-6">
              La aplicación donde estudian los alumnos no es un LMS tradicional. Es un <strong className="text-cyan-300">entorno interactivo de ingeniería</strong> que escala a miles de usuarios simultáneos con retroalimentación en milisegundos.
            </p>
            <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6">
              <h4 className="text-sm font-bold text-white mb-4">Funciones Core de la Plataforma</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {[
                  { icon: Webhook, t: 'Webhooks de GitHub', d: 'Validación automática 🔴→🟢' },
                  { icon: Bot, t: 'Tutor IA RAG', d: 'Soporte 24/7 contextualizado' },
                  { icon: Users, t: 'Matchmaking P2P', d: 'Pair programming inteligente' },
                  { icon: Gamepad2, t: 'Gamificación', d: 'Rachas, leaderboard, logros' },
                  { icon: Trophy, t: 'Portafolio Dinámico', d: 'Generación automática por módulo' },
                  { icon: Globe, t: 'CDN / Edge Networks', d: 'Baja latencia global' },
                ].map((f) => (
                  <div key={f.t} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                    <f.icon className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div>
                      <span className="font-bold text-white text-xs">{f.t}</span>
                      <span className="text-slate-500 text-xs ml-2">{f.d}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionBlock>

          {/* ============================================ */}
          {/*  SECTION: Webhooks                            */}
          {/* ============================================ */}
          <SectionBlock id="webhooks">
            <SectionTitle icon={Webhook} color="emerald">Validación Automatizada (Webhooks de GitHub)</SectionTitle>
            <p className="text-slate-400 leading-relaxed mb-6">
              No dependemos de que un profesor revise si el alumno hizo el trabajo. El sistema lo valida automáticamente.
            </p>
            <InfoCard title="Flujo Técnico" variant="success">
              <p>1. El alumno conecta su cuenta de GitHub al crear su perfil en la plataforma.</p>
              <p>2. Cuando un módulo exige &quot;crear un .gitignore y hacer commit&quot;, el backend escucha el push de GitHub.</p>
              <p>3. La plataforma verifica automáticamente que el repositorio cumple los requisitos.</p>
              <p>4. El estado cambia de 🔴 a 🟢 al instante. <strong className="text-emerald-300">Cero intervención humana.</strong></p>
            </InfoCard>
            <CodeBlock>{`// Ejemplo de webhook listener (Edge Function)
export async function POST(req: Request) {
  const payload = await req.json()
  const { repository, commits } = payload
  
  // Verificar que existe .gitignore en el push
  const hasGitignore = commits.some(c => 
    c.added.includes('.gitignore') || 
    c.modified.includes('.gitignore')
  )
  
  if (hasGitignore) {
    await supabase
      .from('module_progress')
      .update({ status: 'completed' }) // 🔴 → 🟢
      .eq('student_id', studentId)
      .eq('module_id', 0)
  }
}`}</CodeBlock>
          </SectionBlock>

          {/* ============================================ */}
          {/*  SECTION: Tutor IA                            */}
          {/* ============================================ */}
          <SectionBlock id="tutor-ia">
            <SectionTitle icon={Bot} color="violet">Tutor IA Contextualizado (RAG)</SectionTitle>
            <InfoCard title="Arquitectura RAG">
              <p>Un bot en la interfaz alimentado <strong className="text-white">exclusivamente con la documentación del curso</strong> y los errores comunes de Termux/Oracle/Supabase.</p>
              <p className="mt-2">Si un alumno tiene un error de conexión SSH a las 2 AM, la IA diagnostica el problema basándose en la <em className="text-violet-300">metodología oficial del programa</em>, no en información genérica de internet.</p>
            </InfoCard>
            <div className="bg-[#0A0A0A] border border-violet-500/20 rounded-xl p-6 mt-4">
              <h4 className="text-sm font-bold text-violet-400 mb-3 flex items-center gap-2">
                <Brain className="w-4 h-4" /> Fuentes del RAG
              </h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex gap-2"><span className="text-violet-400">•</span> Documentación completa del programa (Módulos 0-8)</li>
                <li className="flex gap-2"><span className="text-violet-400">•</span> Errores comunes de Termux y SSH</li>
                <li className="flex gap-2"><span className="text-violet-400">•</span> Configuración de Supabase (RLS, Triggers, Auth)</li>
                <li className="flex gap-2"><span className="text-violet-400">•</span> Setup de Google Antigravity y MCPs</li>
                <li className="flex gap-2"><span className="text-violet-400">•</span> Guías de despliegue en Vercel</li>
                <li className="flex gap-2"><span className="text-violet-400">•</span> Historial de errores resueltos por otros alumnos</li>
              </ul>
            </div>
          </SectionBlock>

          {/* ============================================ */}
          {/*  SECTION: Matchmaking                         */}
          {/* ============================================ */}
          <SectionBlock id="matchmaking">
            <SectionTitle icon={Users} color="sky">Algoritmo de Matchmaking / Pair Programming</SectionTitle>
            <p className="text-slate-400 leading-relaxed mb-6">
              El aprendizaje solitario es duro. La plataforma detecta automáticamente a estudiantes que llevan <strong className="text-sky-300">48 horas atascados</strong> en el mismo módulo y les sugiere abrir una sala de chat o videollamada interna para resolverlo juntos.
            </p>
            <InfoCard title="Motor Bayesiano P2P">
              <p>El algoritmo empareja a un estudiante bloqueado con otro que <strong className="text-white">acaba de resolver exactamente el mismo problema</strong>. Ejemplo: si María resolvió el error de RLS hace 12 minutos, se le sugiere conectarse con Carlos que lleva 55 minutos atascado en lo mismo.</p>
              <p className="mt-2 text-sky-400 font-bold">Match sugerido al 98% de efectividad.</p>
            </InfoCard>
          </SectionBlock>

          {/* ============================================ */}
          {/*  SECTION: Gamificación                        */}
          {/* ============================================ */}
          <SectionBlock id="gamificacion">
            <SectionTitle icon={Gamepad2} color="amber">Motor de Gamificación Hardcore</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoCard title="🔥 Rachas de Commits">
                <p>Al estilo Duolingo: mantén tu racha de días haciendo commits consecutivos. Perder la racha cuesta.</p>
              </InfoCard>
              <InfoCard title="🏆 Leaderboard en Vivo">
                <p>Ranking en tiempo real: quién ha desplegado más proyectos, quién consiguió su primer cliente pago.</p>
              </InfoCard>
              <InfoCard title="⭐ Sistema de Logros">
                <p>Badges por hitos: &quot;Primer Despliegue&quot;, &quot;RLS Master&quot;, &quot;Primer Cliente&quot;, &quot;Docker Ninja&quot;.</p>
              </InfoCard>
            </div>
          </SectionBlock>

          {/* ============================================ */}
          {/*  SECTION: Portafolio                          */}
          {/* ============================================ */}
          <SectionBlock id="portafolio">
            <SectionTitle icon={Trophy} color="amber">Generador de Portafolio Dinámico</SectionTitle>
            <InfoCard title="El Cierre Perfecto" variant="success">
              <p>A medida que los indicadores pasan a 🟢, la aplicación compila automáticamente una <strong className="text-emerald-300">página pública de perfil</strong> para el estudiante.</p>
              <p className="mt-2">Al llegar al Módulo 8, el alumno ya tiene un portafolio web estilizado generado por la plataforma con todos sus despliegues enlazados.</p>
            </InfoCard>
            <CodeBlock>{`// Ejemplo de URL de portafolio generado:
https://academia.talento-tech.com/alumnos/juan-perez

// Contenido auto-generado:
- Perfil profesional con foto de GitHub
- Lista de proyectos desplegados (con URLs live)
- Stack tecnológico dominado
- Badges y logros del programa
- Enlace directo a repositorios`}</CodeBlock>
          </SectionBlock>

          {/* ============================================ */}
          {/*  SECTION: Infraestructura Móvil               */}
          {/* ============================================ */}
          <SectionBlock id="infraestructura">
            <SectionTitle icon={Smartphone} color="sky">Infraestructura Móvil (Termux + Oracle Cloud)</SectionTitle>
            <p className="text-slate-400 leading-relaxed mb-6">
              La pieza maestra para la <strong className="text-sky-300">democratización absoluta</strong> del desarrollo. Eliminar la barrera del hardware costoso convierte cualquier dispositivo Android en una terminal de grado empresarial.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard title="📱 Cliente Ligero (Android)">
                <p>El teléfono ejecuta Termux y solo envía comandos vía SSH. No necesita capacidad de procesamiento propia.</p>
              </InfoCard>
              <InfoCard title="☁️ Servidor Pesado (Oracle ARM)">
                <p>Instancia Always Free: 24GB RAM, 4 vCPUs ARM Ampere A1. Compila código, ejecuta modelos, corre Docker.</p>
              </InfoCard>
            </div>
            <div className="bg-[#0A0A0A] border border-sky-500/20 rounded-xl p-6 mt-4">
              <h4 className="text-sm font-bold text-sky-400 mb-3">Barreras Eliminadas</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-400">
                <div className="flex gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>¿No tengo dinero para una PC? → <strong className="text-white">Resuelto</strong></span>
                </div>
                <div className="flex gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>¿Me frustro a las 3 AM? → <strong className="text-white">Tutor IA RAG</strong></span>
                </div>
                <div className="flex gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>¿No sé vender? → <strong className="text-white">Módulo 8</strong></span>
                </div>
                <div className="flex gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>¿Cómo cobro en mi país? → <strong className="text-white">SINPE Móvil</strong></span>
                </div>
              </div>
            </div>
          </SectionBlock>

          {/* ============================================ */}
          {/*  SECTION: Admin Panel                         */}
          {/* ============================================ */}
          <SectionBlock id="admin">
            <SectionTitle icon={BarChart3} color="cyan">Panel del Administrador — Telemetría de Fricción</SectionTitle>
            <InfoCard title="Heatmaps de Aprendizaje">
              <p>Panel de control exclusivo para el creador. Rastrea el <strong className="text-white">tiempo promedio</strong> que tardan los alumnos en pasar de 🔴 a 🟢 en cada módulo.</p>
              <p className="mt-2">Si el 60% de los estudiantes se queda atascado más de 3 días en el Módulo 4 (RLS y Triggers), el sistema envía una alerta. El curso se optimiza basado en <strong className="text-cyan-300">datos, no en suposiciones</strong>.</p>
            </InfoCard>
          </SectionBlock>

          {/* ============================================ */}
          {/*  SECTION: Alumni                              */}
          {/* ============================================ */}
          <SectionBlock id="alumni">
            <SectionTitle icon={Briefcase} color="amber">Red de Alumni — Economía Circular Interna</SectionTitle>
            <InfoCard title="Micro-trabajos Internos" variant="warning">
              <p>Cuando un alumno graduado consigue un cliente grande y necesita ayuda, la plataforma permite publicar <strong className="text-amber-300">&quot;micro-trabajos&quot;</strong> en un tablón interno.</p>
              <p className="mt-2">Ejemplo: <em>&quot;Necesito que me hagas la interfaz en Vercel, te pago $50&quot;</em>. Los alumnos del Módulo 3-4 pueden tomarlo. Esto genera <strong className="text-white">casos de éxito inmediatos</strong> y retiene a la comunidad.</p>
            </InfoCard>

            {/* Final CTA */}
            <div className="mt-16 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center">
              <Rocket className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-2xl font-black text-white mb-3">¿Listo para empezar?</h3>
              <p className="text-slate-400 max-w-xl mx-auto mb-6">
                Este no es un curso. Es una fábrica de empresas tecnológicas y desarrolladores autónomos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/curriculum"
                  className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 py-3 rounded-xl transition-all"
                >
                  <BookOpen className="w-5 h-5" /> Ver Módulos
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3 rounded-xl transition-all border border-white/10"
                >
                  Acceso Plataforma <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </SectionBlock>

          {/* Back to top */}
          <div className="flex justify-center mt-12">
            <a
              href="#metodologia"
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-400 transition-colors"
            >
              <ChevronUp className="w-4 h-4" />
              Volver al inicio
            </a>
          </div>

        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-500" />
            <span className="font-bold text-lg">Talento Tech 2026</span>
          </div>
          <p className="text-sm text-slate-500 font-mono tracking-wider">
            DOCUMENTACIÓN OFICIAL • INGENIERÍA DE ORQUESTACIÓN
          </p>
        </div>
      </footer>
    </div>
  )
}
