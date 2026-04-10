'use client'

import React, { useState } from 'react'
import { Users, Star, MessageSquare, GitPullRequest, Shield, ChevronRight, Search, Sparkles, Award, ArrowUpDown, CheckCircle2, Clock } from 'lucide-react'

interface MentorPair {
  mentor: { name: string; level: string; avatar: string; xp: number }
  mentee: { name: string; level: string; avatar: string; xp: number }
  status: 'active' | 'pending' | 'completed'
  topic: string
  reviewCount: number
}

const MOCK_PAIRS: MentorPair[] = [
  {
    mentor: { name: 'Ana_García_U', level: 'Universidad', avatar: 'AG', xp: 8900 },
    mentee: { name: 'Carlos_Tech_C', level: 'Colegio', avatar: 'CT', xp: 2100 },
    status: 'active',
    topic: 'React Hooks & State',
    reviewCount: 12,
  },
  {
    mentor: { name: 'Luis_Dev_C', level: 'Colegio', avatar: 'LD', xp: 4500 },
    mentee: { name: 'Sofía_Star_E', level: 'Escuela', avatar: 'SS', xp: 800 },
    status: 'active',
    topic: 'HTML & CSS Basics',
    reviewCount: 8,
  },
  {
    mentor: { name: 'María_Hacker_U', level: 'Universidad', avatar: 'MH', xp: 12400 },
    mentee: { name: 'Pedro_Code_C', level: 'Colegio', avatar: 'PC', xp: 3200 },
    status: 'pending',
    topic: 'API REST + Fetch',
    reviewCount: 0,
  },
  {
    mentor: { name: 'Diego_Pro_C', level: 'Colegio', avatar: 'DP', xp: 5100 },
    mentee: { name: 'Valentina_E', level: 'Escuela', avatar: 'VE', xp: 450 },
    status: 'completed',
    topic: 'Variables & Funciones',
    reviewCount: 15,
  },
]

const PEER_REVIEWS = [
  { reviewer: 'Ana_García_U', reviewee: 'Carlos_Tech_C', project: 'todo-app-react', rating: 4, comment: 'Buen uso de useState, pero falta useEffect para el fetch.', date: '2h ago' },
  { reviewer: 'Luis_Dev_C', reviewee: 'Sofía_Star_E', project: 'mi-primera-web', rating: 5, comment: '¡Perfecto! Los colores CSS están increíbles. 🎨', date: '5h ago' },
  { reviewer: 'María_Hacker_U', reviewee: 'Diego_Pro_C', project: 'api-rest-node', rating: 3, comment: 'Falta manejo de errores en los endpoints. Agrega try/catch.', date: '1d ago' },
]

export default function MentorshipPanel({ accentColor = 'cyan' }: { accentColor?: string }) {
  const [activeView, setActiveView] = useState<'pairs' | 'reviews'>('pairs')
  
  const statusColors = {
    active: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    pending: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    completed: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  }

  const levelColors: Record<string, string> = {
    Universidad: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    Colegio: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    Escuela: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-purple-400 mb-4 w-fit">
            <Users className="w-3 h-3" /> PEER_MENTORSHIP_PROTOCOL_V1
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic leading-[0.85]">
            MENTORÍAS <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">INVERSAS_</span>
          </h2>
          <p className="text-slate-500 text-sm mt-3 font-bold uppercase tracking-[0.2em]">
            Seniors mentorean juniors. El código se revisa entre pares.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setActiveView('pairs')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
              activeView === 'pairs' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' : 'bg-white/5 text-slate-500 border-white/10 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Pares_Activos
          </button>
          <button
            onClick={() => setActiveView('reviews')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
              activeView === 'reviews' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' : 'bg-white/5 text-slate-500 border-white/10 hover:text-white'
            }`}
          >
            <GitPullRequest className="w-3.5 h-3.5" /> Peer_Reviews
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'PARES_ACTIVOS', value: MOCK_PAIRS.filter(p => p.status === 'active').length.toString(), color: 'text-emerald-400' },
          { label: 'REVIEWS_TOTAL', value: PEER_REVIEWS.length.toString(), color: 'text-purple-400' },
          { label: 'XP_FROM_REVIEWS', value: '2,400', color: 'text-amber-400' },
          { label: 'MATCH_RATE', value: '94%', color: 'text-cyan-400' },
        ].map((s, i) => (
          <div key={i} className="bg-[#0b1120]/80 border border-white/5 rounded-2xl p-5 text-center backdrop-blur-xl shadow-2xl hover:border-white/20 transition-all">
            <p className={`text-2xl font-black italic ${s.color}`}>{s.value}</p>
            <p className="text-[7px] text-slate-600 font-black uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Pairs View */}
      {activeView === 'pairs' && (
        <div className="space-y-4">
          {MOCK_PAIRS.map((pair, i) => (
            <div key={i} className="bg-[#0b1120]/80 border border-white/5 rounded-[2rem] p-6 md:p-8 backdrop-blur-xl shadow-2xl hover:border-purple-500/20 transition-all group relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-l-full" />
              
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
                {/* Mentor → Mentee */}
                <div className="flex items-center gap-4 flex-1">
                  {/* Mentor */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-14 h-14 rounded-2xl bg-[#020617] border border-white/10 flex items-center justify-center font-black text-purple-400 text-sm shadow-inner group-hover:border-purple-500/40 transition-all">
                      {pair.mentor.avatar}
                    </div>
                    <div>
                      <p className="font-black text-base text-white uppercase tracking-tighter leading-none group-hover:text-purple-400 transition-colors mb-1">{pair.mentor.name}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${levelColors[pair.mentor.level]} uppercase tracking-widest`}>
                          {pair.mentor.level}
                        </span>
                        <span className="text-[8px] font-mono text-slate-600">{pair.mentor.xp.toLocaleString()} XP</span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex flex-col items-center gap-1 px-4">
                    <Shield className="w-4 h-4 text-purple-500" />
                    <div className="text-[7px] font-black text-slate-600 uppercase tracking-widest">MENTORES</div>
                    <ChevronRight className="w-4 h-4 text-purple-400 animate-pulse" />
                  </div>

                  {/* Mentee */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-14 h-14 rounded-2xl bg-[#020617] border border-white/10 flex items-center justify-center font-black text-cyan-400 text-sm shadow-inner group-hover:border-cyan-500/40 transition-all">
                      {pair.mentee.avatar}
                    </div>
                    <div>
                      <p className="font-black text-base text-white uppercase tracking-tighter leading-none mb-1">{pair.mentee.name}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${levelColors[pair.mentee.level]} uppercase tracking-widest`}>
                          {pair.mentee.level}
                        </span>
                        <span className="text-[8px] font-mono text-slate-600">{pair.mentee.xp.toLocaleString()} XP</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-white uppercase tracking-tighter mb-1">{pair.topic}</p>
                    <p className="text-[8px] text-slate-600 font-mono">{pair.reviewCount} reviews</p>
                  </div>
                  <span className={`text-[9px] font-black px-4 py-2 rounded-xl border uppercase tracking-widest ${statusColors[pair.status]}`}>
                    {pair.status === 'active' ? '● ACTIVO' : pair.status === 'pending' ? '◌ PENDIENTE' : '✓ COMPLETADO'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reviews View */}
      {activeView === 'reviews' && (
        <div className="space-y-4">
          {PEER_REVIEWS.map((review, i) => (
            <div key={i} className="bg-[#0b1120]/80 border border-white/5 rounded-[2rem] p-6 md:p-8 backdrop-blur-xl shadow-2xl hover:border-purple-500/20 transition-all group relative overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                      <GitPullRequest className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-white uppercase tracking-tighter">
                        <span className="text-purple-400">{review.reviewer}</span>
                        <span className="text-slate-600 mx-2">→</span>
                        <span>{review.reviewee}</span>
                      </p>
                      <p className="text-[9px] text-slate-600 font-mono">{review.project} • {review.date}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-300 leading-relaxed pl-[52px] font-sans">{review.comment}</p>
                </div>

                <div className="flex items-start gap-1 pl-[52px] md:pl-0">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-4 h-4 ${s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-800'}`} />
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* CTA */}
          <button className="w-full bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/20 hover:border-purple-500/40 rounded-[2rem] p-8 text-center group transition-all shadow-2xl">
            <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-4 group-hover:animate-pulse" />
            <p className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">SOLICITAR_PEER_REVIEW</p>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
              Un mentor senior revisará tu código y te dará feedback
            </p>
          </button>
        </div>
      )}
    </div>
  )
}
