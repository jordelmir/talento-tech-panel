'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  Activity, 
  Zap, 
  GitBranch as Github, 
  ShieldCheck, 
  Globe, 
  Users,
  Code2,
  Gamepad2,
  Trophy,
  BrainCircuit,
  ArrowRight
} from 'lucide-react'
import Footer from '@/components/Footer'

export default function LandingPage() {
  const [hoveredRole, setHoveredRole] = useState<string | null>(null)

  const roles = [
    {
      id: 'escuela',
      title: 'Escuela (Kids)',
      desc: 'UX Gamificada, colores vibrantes y misiones simplificadas.',
      icon: Gamepad2,
      color: 'from-orange-500 to-amber-400',
      shadow: 'group-hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]',
      border: 'group-hover:border-orange-500/50',
      href: '/login?role=escuela'
    },
    {
      id: 'colegio',
      title: 'Colegio (Teen)',
      desc: 'Enfoque en retos, ranking de puntos y comunidad.',
      icon: Trophy,
      color: 'from-purple-500 to-indigo-400',
      shadow: 'group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]',
      border: 'group-hover:border-purple-500/50',
      href: '/login?role=colegio'
    },
    {
      id: 'universidad',
      title: 'Universidad (Pro)',
      desc: 'Dashboard analítico de alta densidad y perfiles de carrera.',
      icon: BrainCircuit,
      color: 'from-blue-500 to-cyan-400',
      shadow: 'group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]',
      border: 'group-hover:border-blue-500/50',
      href: '/login?role=universidad'
    },
    {
      id: 'teacher',
      title: 'Cuerpo Docente',
      desc: 'Panel de gestión de cohorte y telemetría de estudiantes.',
      icon: Users,
      color: 'from-emerald-500 to-teal-400',
      shadow: 'group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]',
      border: 'group-hover:border-emerald-500/50',
      href: '/login?role=teacher'
    },
    {
      id: 'admin',
      title: 'Administrador (NOC)',
      desc: 'Mando de Simulación Global y telemetría de infraestructura crítica.',
      icon: ShieldCheck,
      color: 'from-slate-600 to-slate-400',
      shadow: 'group-hover:shadow-[0_0_30px_rgba(148,163,184,0.3)]',
      border: 'group-hover:border-slate-500/50',
      href: '/admin-panel'
    },
    {
      id: 'familia',
      title: 'Familia (Padres)',
      desc: 'Monitoreo parental de progreso, tiempo activo y alertas de racha.',
      icon: Users,
      color: 'from-pink-500 to-rose-400',
      shadow: 'group-hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]',
      border: 'group-hover:border-pink-500/50',
      href: '/login?role=familia'
    }
  ]

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-emerald-600/10 blur-[130px] -z-10 animate-pulse pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[130px] -z-10 pointer-events-none" />

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2 md:gap-3 group cursor-pointer">
          <div className="bg-gradient-to-tr from-emerald-500 to-cyan-400 p-1.5 md:p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            <Activity className="w-4 h-4 md:w-5 md:h-5 text-black" strokeWidth={3} />
          </div>
          <span className="font-bold text-xl md:text-2xl tracking-tighter">Talento<span className="text-emerald-400">Tech</span></span>
        </div>
        <div className="hidden sm:flex items-center gap-4 md:gap-8 text-[10px] md:text-sm font-medium text-gray-400">
          <Link href="/genesis" className="hover:text-emerald-400 transition-colors uppercase tracking-widest">Génesis</Link>
          <Link href="/curriculum" className="hover:text-emerald-400 transition-colors uppercase tracking-widest">Programas</Link>
          <Link href="/docs" className="hover:text-emerald-400 transition-colors uppercase tracking-widest">Docs</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 backdrop-blur-md">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <span className="text-gray-300 text-xs font-bold tracking-widest uppercase">Sistema Operacional v1.4 Activo</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-6 md:mb-8 bg-gradient-to-br from-white via-gray-200 to-gray-600 bg-clip-text text-transparent px-4">
            EL FUTURO <br />
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">SE ORQUESTA.</span>
          </h1>
          
          <p className="text-base md:text-xl text-gray-400 mb-12 md:mb-16 max-w-2xl mx-auto leading-relaxed font-light px-6">
            Selecciona tu identidad dentro del ecosistema nacional. <br />
            Telemetría activa, auditoría impulsada por IA y fricción cero hacia producción.
          </p>
        </div>

        {/* Identity Selector Grid (The Core Addition) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 max-w-7xl mx-auto mb-32">

          {roles.map((role) => {
            const Icon = role.icon
            const isHovered = hoveredRole === role.id
            return (
              <Link
                href={role.href}
                key={role.id}
                onMouseEnter={() => setHoveredRole(role.id)}
                onMouseLeave={() => setHoveredRole(null)}
                className={`group relative bg-white/5 border border-white/5 p-8 rounded-3xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between overflow-hidden cursor-pointer ${role.border} ${role.shadow}`}
              >
                {/* Glow Background inside card */}
                <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 transition-colors duration-300 ${isHovered ? 'bg-white/10' : ''}`}>
                    <Icon className={`w-7 h-7 text-gray-400 group-hover:text-white transition-colors duration-300`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">{role.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed font-light">{role.desc}</p>
                </div>

                <div className="relative z-10 mt-8 flex items-center text-sm font-bold text-gray-500 group-hover:text-white transition-colors duration-300 tracking-wider uppercase">
                  Acceder
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </Link>
            )
          })}
        </div>
      </main>

      {/* Feature Highlights Minimalist */}
      <section className="border-t border-white/5 bg-black/50 py-24 relative z-10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex gap-4">
            <Github className="w-8 h-8 text-emerald-500 shrink-0" />
            <div>
              <h4 className="text-white font-bold mb-2">Integración GitHub Pulse</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Cada commit de los estudiantes es analizado por nuestro motor de IA para medir el esfuerzo algorítmico y detectar fallos tempranos.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <ShieldCheck className="w-8 h-8 text-blue-500 shrink-0" />
            <div>
              <h4 className="text-white font-bold mb-2">Auditoría Ghost Tier-1</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Agentes silenciosos vigilan roles y RLS. Prevenimos escalada de privilegios a nivel de infraestructura educativa nacional.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Code2 className="w-8 h-8 text-fuchsia-500 shrink-0" />
            <div>
              <h4 className="text-white font-bold mb-2">Cero Fricción a Cloud</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Aprovisionamiento transparente en Oracle Cloud (OCI) y Supabase para que las escuelas no piensen en infraestructura.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer variant="landing" />
    </div>
  )
}
