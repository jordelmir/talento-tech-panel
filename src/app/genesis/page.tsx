'use client'

import Link from 'next/link'
import { Activity, Trophy, ExternalLink, Code2, Users2, ShieldCheck, MapPin, ArrowLeft } from 'lucide-react'

// Dummy Data
const eliteProjects = [
  {
    id: 1,
    title: 'Sistema de Trazabilidad Agrícola',
    student: 'Felipe Vargas',
    institution: 'Colegio Nacional, Medellín',
    module: 'Backend con Supabase RLS',
    tech_stack: ['Next.js', 'Supabase', 'Tailwind'],
    status: 'Producción',
    color: 'emerald'
  },
  {
    id: 2,
    title: 'Billetera Digital Comunitaria',
    student: 'Carolina Gómez',
    institution: 'Universidad del Valle',
    module: 'Autenticación Cero Confianza',
    tech_stack: ['React', 'PostgreSQL', 'Vercel'],
    status: 'Auditoría IA Pasada',
    color: 'cyan'
  },
  {
    id: 3,
    title: 'Predictor Logístico Regional',
    student: 'Luis H. (Ruta Digital)',
    institution: 'Talento Tech Amazonas',
    module: 'Modelado Relacional',
    tech_stack: ['Supabase', 'Python AI'],
    status: 'Producción',
    color: 'fuchsia'
  }
]

export default function MuroGenesis() {
  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-cyan-500/30 overflow-hidden relative">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-b from-cyan-900/20 to-transparent blur-3xl pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-fuchsia-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        
        {/* Top Nav */}
        <div className="flex justify-between items-center mb-12">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-cyan-500 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
              <Activity className="w-5 h-5 text-black" strokeWidth={3} />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">Talento Tech</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Inicio
          </Link>
        </div>

        {/* Header Hero */}
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center justify-center p-2 bg-slate-900 border border-slate-800 rounded-2xl mb-4 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
            <Trophy className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-slate-400 tracking-tight">
            Muro Génesis
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            El escaparate soberano del talento nacional. Proyectos desplegados a producción con código auditado, creados exclusivamente por los arquitectos digitales de Colombia.
          </p>
          
          <div className="flex justify-center gap-4 mt-8">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-4 py-2 rounded-full">
              <ShieldCheck className="w-4 h-4" />
              Securizado por IA
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-4 py-2 rounded-full">
              <Activity className="w-4 h-4" />
              Despliegue Global
            </div>
          </div>
        </div>

        {/* Bento Grid Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eliteProjects.map((project) => (
            <div 
              key={project.id} 
              className="group relative bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
            >
              {/* Top Meta */}
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl bg-${project.color}-500/10 border border-${project.color}-500/20 text-${project.color}-400`}>
                  <Code2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                  {project.status}
                </span>
              </div>

              {/* Data */}
              <div className="space-y-4 mb-8">
                <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {project.title}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Users2 className="w-4 h-4" />
                    <strong className="text-slate-300">{project.student}</strong>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <MapPin className="w-4 h-4" />
                    {project.institution}
                  </div>
                </div>
              </div>

              {/* Tech Stack Bubbles */}
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tech_stack.map(tech => (
                  <span key={tech} className="text-xs font-semibold text-slate-300 bg-slate-800/50 border border-slate-700/50 px-3 py-1.5 rounded-lg">
                    {tech}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <a 
                href="#" 
                className="inline-flex w-full items-center justify-center gap-2 bg-white text-black font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors shadow-lg"
              >
                Auditar Código (PoC)
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
