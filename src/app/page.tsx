'use client'

import React from 'react'
import Link from 'next/link'
import { 
  Activity, 
  ArrowRight, 
  Zap, 
  GitBranch as Github, 
  ShieldCheck, 
  Globe, 
  Users,
  Code2,
  ChevronRight
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans overflow-hidden">
      
      {/* Glow Effects */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-emerald-600/10 blur-[120px] -z-10 animate-pulse" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] -z-10" />

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="bg-emerald-500 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
            <Activity className="w-5 h-5 text-black" strokeWidth={3} />
          </div>
          <span className="font-bold text-xl tracking-tight">Talento Tech</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <Link href="/genesis" className="hover:text-emerald-400 transition-colors">Muro Génesis</Link>
          <a href="#" className="hover:text-emerald-400 transition-colors">Arquitectura</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">Documentación</a>
        </div>
        <Link 
          href="/login" 
          className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm hover:bg-emerald-400 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          Acceso Plataforma
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 relative z-10">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full mb-8 animate-bounce">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Ingeniería de Orquestación v1.0</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 bg-gradient-to-br from-white via-white to-gray-500 bg-clip-text text-transparent">
            EL FUTURO <br />
            <span className="text-emerald-500">SE ORQUESTA.</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-12 max-w-2xl leading-relaxed">
            Democratizando el desarrollo de software profesional en Colombia. <br />
            Usa la IA como motor, Next.js como estructura y despliega proyectos de escala nacional con fricción cero.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/login" 
              className="flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-black px-10 py-5 rounded-2xl font-black text-lg transition-all group"
            >
              Iniciar mi Ruta
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Github className="w-6 h-6 text-gray-400" />
              <div className="text-left">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Telemetría pasiva</p>
                <p className="text-sm font-medium text-gray-300">Monitoreo vía GitHub Pulse</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bento Grid Features */}
      <section className="max-w-7xl mx-auto px-6 pb-40 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="md:col-span-2 bg-gradient-to-br from-gray-900 to-black border border-white/5 p-8 rounded-[2rem] hover:border-emerald-500/30 transition-all group overflow-hidden relative">
            <div className="relative z-10">
              <Users className="w-10 h-10 text-emerald-500 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold mb-3">Enjambre Inteligente</h3>
              <p className="text-gray-500 max-w-sm">Algoritmos de emparejamiento P2P que conectan alumnos bloqueados con expertos en tiempo real.</p>
            </div>
            <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="w-64 h-64 text-emerald-500" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white/5 border border-white/5 p-8 rounded-[2rem] hover:border-emerald-500/30 transition-all flex flex-col justify-between">
            <ShieldCheck className="w-10 h-10 text-blue-500" />
            <div>
              <h3 className="text-xl font-bold mb-2">Auditoría Ghost</h3>
              <p className="text-sm text-gray-500">IA especializada en seguridad y RLS que verifica cada commit de tus estudiantes.</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white/5 border border-white/5 p-8 rounded-[2rem] hover:border-emerald-500/30 transition-all flex flex-col justify-between">
            <Globe className="w-10 h-10 text-purple-500" />
            <div>
              <h3 className="text-xl font-bold mb-2">Muro Génesis</h3>
              <p className="text-sm text-gray-500">Exposición nacional de proyectos destacados directos a producción.</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="md:col-span-2 bg-emerald-500 p-8 rounded-[2rem] text-black">
            <div className="flex justify-between items-start mb-8">
            <Code2 className="w-12 h-12" strokeWidth={2.5} />
              <div className="bg-black/20 px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest">Estrategia B2G</div>
            </div>
            <h3 className="text-4xl font-black tracking-tighter mb-4 leading-none">ZERO-COST INFRASTRUCTURE.</h3>
            <p className="font-medium text-black/70 max-w-md">Propulsando la soberanía tecnológica de Colombia sin dependencias costosas de backends tradicionales.</p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-500" />
            <span className="font-bold text-lg">Talento Tech 2026</span>
          </div>
          <div className="text-gray-500 text-sm font-mono tracking-widest">
            MADE FOR COLOMBIA • ENGINEERED BY ORCHESTRATION
          </div>
        </div>
      </footer>
    </div>
  )
}
