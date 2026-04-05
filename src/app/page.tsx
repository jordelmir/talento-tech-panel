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
  GraduationCap,
  Building2,
  Terminal,
  ArrowRight
} from 'lucide-react'

export default function LandingPage() {
  const [hoveredRole, setHoveredRole] = useState<string | null>(null)

  const roles = [
    {
      id: 'student',
      title: 'Estudiantes',
      desc: 'Accede a tu cápsula de aprendizaje, conecta tu GitHub y recibe auditoría en tiempo real.',
      icon: GraduationCap,
      color: 'from-blue-500 to-cyan-400',
      shadow: 'group-hover:shadow-[0_0_30px_rgba(56,189,248,0.3)]',
      border: 'group-hover:border-blue-500/50',
      href: '/login?role=student'
    },
    {
      id: 'teacher',
      title: 'Profesores expert',
      desc: 'Evalúa el progreso algorítmico, aprueba pull requests y gestiona tus células educativas.',
      icon: Users,
      color: 'from-purple-500 to-fuchsia-400',
      shadow: 'group-hover:shadow-[0_0_30px_rgba(217,70,239,0.3)]',
      border: 'group-hover:border-fuchsia-500/50',
      href: '/login?role=teacher'
    },
    {
      id: 'institution',
      title: 'Institución (B2B)',
      desc: 'Métricas de éxito escolar, telemetría general y estadísticas enlazadas al plan nacional.',
      icon: Building2,
      color: 'from-emerald-500 to-teal-400',
      shadow: 'group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]',
      border: 'group-hover:border-emerald-500/50',
      href: '/login?role=institution'
    },
    {
      id: 'admin',
      title: 'NOC / Admin',
      desc: 'Centro de comando táctico, observabilidad global y control total de infraestructura IA.',
      icon: Terminal,
      color: 'from-red-500 to-orange-400',
      shadow: 'group-hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]',
      border: 'group-hover:border-red-500/50',
      href: '/login?role=admin'
    }
  ]

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-emerald-600/10 blur-[130px] -z-10 animate-pulse pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[130px] -z-10 pointer-events-none" />

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="bg-gradient-to-tr from-emerald-500 to-cyan-400 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            <Activity className="w-5 h-5 text-black" strokeWidth={3} />
          </div>
          <span className="font-bold text-2xl tracking-tighter">Talento<span className="text-emerald-400">Tech</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <Link href="/genesis" className="hover:text-emerald-400 transition-colors">Muro Génesis</Link>
          <Link href="/curriculum" className="hover:text-emerald-400 transition-colors">Programas</Link>
          <Link href="/docs" className="hover:text-emerald-400 transition-colors">Documentación Core</Link>
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
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 bg-gradient-to-br from-white via-gray-200 to-gray-600 bg-clip-text text-transparent">
            EL FUTURO <br />
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">SE ORQUESTA.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-16 max-w-2xl mx-auto leading-relaxed font-light">
            Selecciona tu identidad dentro del ecosistema nacional. <br />
            Telemetría activa, auditoría impulsada por IA y fricción cero hacia producción.
          </p>
        </div>

        {/* Identity Selector Grid (The Core Addition) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-32">
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

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-sm tracking-widest uppercase text-gray-300">Talento Tech '26</span>
          </div>
          <div className="text-gray-600 text-xs font-mono tracking-widest text-center">
            PROUDLY ENGINEERED IN COLOMBIA • OCI/SUPABASE BACKED
          </div>
        </div>
      </footer>
    </div>
  )
}
