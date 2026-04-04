'use client'

import React from 'react'
import { useProfileStore } from '@/store/useProfileStore'
import { ShieldCheck } from 'lucide-react'

export default function ProfileBanner() {
  const activeProfile = useProfileStore((state) => state.activeProfile)

  if (!activeProfile) return null

  return (
    <div className="w-full bg-[#050505] border-b border-white/5 px-6 py-2 flex items-center justify-center relative z-50">
      <div className="flex items-center gap-2 text-sm font-medium tracking-wide">
        <ShieldCheck size={16} className="text-emerald-400" />
        <span className="text-gray-300">Estás operando bajo el perfil:</span>
        <span className="text-emerald-400 font-bold">{activeProfile}</span>
      </div>
    </div>
  )
}
