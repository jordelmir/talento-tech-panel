import React from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { Shield, Award, CheckCircle2, Calendar, Fingerprint, ArrowLeft, Sparkles, Code2 } from 'lucide-react'

// ISR setup for Next.js Caching: 1 hour (3600 seconds)
export const revalidate = 3600

export default async function CertificadoPage({ params }: { params: { id: string } }) {
  // Initialize server-side Supabase client for public fetching
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: cert } = await supabase
    .from('certificates')
    .select(`
      *,
      profiles(
        full_name,
        user_roles(
          institutions(level)
        )
      )
    `)
    .eq('custom_id', params.id)
    .single()

  if (!cert) {
    return (
      <div className="min-h-screen bg-[#020617] text-white font-mono flex items-center justify-center p-4">
        <div className="text-center py-32">
          <div className="w-24 h-24 bg-rose-500/10 border border-rose-500/30 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Shield className="w-12 h-12 text-rose-500" />
          </div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4 text-rose-500">CERTIFICADO_NO_ENCONTRADO_</h2>
          <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.4em] mb-8">
            El ID proporcionado no existe en nuestro registro verificado.
          </p>
          <Link href="/" className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">
            VOLVER AL INICIO
          </Link>
        </div>
      </div>
    )
  }

  // Parse institution level
  const institutionLevel = cert.profiles?.user_roles?.[0]?.institutions?.level || 'Colegio'
  const certLevelDisplay = institutionLevel.charAt(0).toUpperCase() + institutionLevel.slice(1)

  return (
    <div className="min-h-screen bg-[#020617] text-white font-mono selection:bg-purple-500/30 overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[140px] rounded-full" />
      </div>

      <main className="max-w-4xl mx-auto p-4 md:p-8 lg:p-12 relative z-10">
        {/* Back */}
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest mb-12 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> VOLVER_AL_INICIO
        </Link>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Verified Badge */}
          <div className="flex items-center gap-3 mb-8 justify-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            <span className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.3em] bg-emerald-500/10 px-5 py-2 rounded-full border border-emerald-500/30">
              ✓ CERTIFICADO VERIFICADO — AUTÉNTICO
            </span>
          </div>

          {/* Certificate Card */}
          <div className="bg-[#0b1120]/80 border border-white/10 rounded-[3rem] p-8 md:p-14 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            {/* Decorative Corner */}
            <div className="absolute top-0 left-0 w-32 h-32 border-l-[3px] border-t-[3px] border-purple-500/20 rounded-tl-[3rem]" />
            <div className="absolute bottom-0 right-0 w-32 h-32 border-r-[3px] border-b-[3px] border-purple-500/20 rounded-br-[3rem]" />
            
            {/* Header */}
            <div className="text-center mb-12 relative z-10">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                  <Award className="w-8 h-8 text-purple-400" />
                </div>
              </div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.5em] mb-4">TALENTO TECH COLOMBIA</p>
              <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-purple-400">
                CERTIFICADO DE <br />COMPETENCIA TÉCNICA
              </h1>
            </div>

            {/* Body */}
            <div className="relative z-10 space-y-8">
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-3">CERTIFICA QUE</p>
                <p className="text-4xl font-black text-white italic tracking-tighter">{cert.profiles?.full_name || 'Estudiante'}</p>
              </div>

              <div className="text-center">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-3">HA COMPLETADO EXITOSAMENTE EL MÓDULO</p>
                <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 italic tracking-tighter">{cert.module}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-white/5">
                <div className="bg-white/5 border border-white/5 rounded-2xl p-5 text-center">
                  <Calendar className="w-5 h-5 text-slate-500 mx-auto mb-2" />
                  <p className="text-sm font-black text-white">{new Date(cert.issued_date).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  <p className="text-[7px] text-slate-600 font-black uppercase tracking-widest mt-1">FECHA_EMISIÓN</p>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl p-5 text-center">
                  <Shield className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                  <p className="text-sm font-black text-white">{certLevelDisplay}</p>
                  <p className="text-[7px] text-slate-600 font-black uppercase tracking-widest mt-1">NIVEL_ACADEMICO</p>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl p-5 text-center">
                  <Sparkles className="w-5 h-5 text-amber-400 mx-auto mb-2" />
                  <p className="text-sm font-black text-amber-400">10,000 XP</p>
                  <p className="text-[7px] text-slate-600 font-black uppercase tracking-widest mt-1">XP_ACUMULADO</p>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl p-5 text-center">
                  <Fingerprint className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
                  <p className="text-[10px] font-mono font-black text-cyan-400 truncate">{cert.id.split('-')[0]}</p>
                  <p className="text-[7px] text-slate-600 font-black uppercase tracking-widest mt-1">HASH_VERIFY</p>
                </div>
              </div>

              {/* Verification Footer */}
              <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">ID: {cert.custom_id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
