'use client'

import React from 'react'
import { ShieldCheck, Globe } from 'lucide-react'

export interface FooterProps {
  variant?: 'landing' | 'dashboard'
}

export default function Footer({ variant = 'landing' }: FooterProps) {
  const isDashboard = variant === 'dashboard'
  
  return (
    <footer className={`border-t border-white/5 py-8 ${isDashboard ? 'bg-[#0A0A0A]/40 backdrop-blur-xl mt-auto' : 'bg-[#050505] mt-20'}`}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-sm tracking-widest uppercase text-gray-300">Talento Tech '26</span>
          </div>
          <div className="h-4 w-px bg-white/10 hidden md:block" />
          <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono tracking-widest uppercase py-1 px-3 border border-white/5 rounded-full bg-white/5">
            <span className="opacity-50">Chief_Engineer:</span>
            <a 
              href="https://github.com/jordelmir?tab=repositories" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-400 font-black hover:text-emerald-300 transition-colors border-b border-transparent hover:border-emerald-500/50"
            >
              Jorge David Del Valle Miranda
            </a>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 text-gray-600 text-[10px] font-mono tracking-widest uppercase font-bold opacity-60">
            <Globe className="w-3 h-3" />
            COLOMBIA_REGION_IAD1
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-[10px] font-mono tracking-widest uppercase font-bold opacity-60">
            <ShieldCheck className="w-3 h-3" />
            OCI/SUPABASE_HARDENED
          </div>
        </div>
      </div>
    </footer>
  )
}
