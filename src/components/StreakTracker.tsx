'use client'

import React, { useState, useEffect } from 'react'
import { Flame, Zap, Calendar, Trophy, Star, Shield } from 'lucide-react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  lastActiveDate: string
  weekActivity: boolean[]
  totalXpMultiplied: number
}

const DAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

function updateWeekActivity(prev: boolean[]): boolean[] {
  const dayOfWeek = new Date().getDay()
  const adjusted = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  const newWeek = [...prev]
  newWeek[adjusted] = true
  return newWeek
}

function getMultiplier(days: number): number {
  if (days >= 30) return 5
  if (days >= 14) return 3
  if (days >= 7) return 2
  if (days >= 3) return 1.5
  return 1
}

export default function StreakTracker({ variant = 'full', accentColor = 'orange' }: { variant?: 'full' | 'compact' | 'mini', accentColor?: string }) {
  const [streak, setStreak] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: '',
    weekActivity: [false, false, false, false, false, false, false],
    totalXpMultiplied: 0
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('talento_streak')
    const today = new Date().toISOString().split('T')[0]
    
    if (saved) {
      const data: StreakData = JSON.parse(saved)
      const lastDate = new Date(data.lastActiveDate)
      const todayDate = new Date(today)
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) {
        setStreak(data)
      } else if (diffDays === 1) {
        // Continue streak
        const newStreak = {
          ...data,
          currentStreak: data.currentStreak + 1,
          longestStreak: Math.max(data.longestStreak, data.currentStreak + 1),
          lastActiveDate: today,
          weekActivity: updateWeekActivity(data.weekActivity),
          totalXpMultiplied: data.totalXpMultiplied + getMultiplier(data.currentStreak + 1) * 100
        }
        setStreak(newStreak)
        localStorage.setItem('talento_streak', JSON.stringify(newStreak))
      } else {
        // Streak broken
        const newStreak = {
          currentStreak: 1,
          longestStreak: data.longestStreak,
          lastActiveDate: today,
          weekActivity: [true, false, false, false, false, false, false],
          totalXpMultiplied: 100
        }
        setStreak(newStreak)
        localStorage.setItem('talento_streak', JSON.stringify(newStreak))
      }
    } else {
      // First time
      const newStreak = {
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: today,
        weekActivity: [true, false, false, false, false, false, false],
        totalXpMultiplied: 100
      }
      setStreak(newStreak)
      localStorage.setItem('talento_streak', JSON.stringify(newStreak))
    }
  }, [])

  if (!mounted) return null

  const multiplier = getMultiplier(streak.currentStreak)
  const isOnFire = streak.currentStreak >= 3

  const colorMap: Record<string, { flame: string, bg: string, border: string, text: string, glow: string }> = {
    orange: { flame: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', glow: 'shadow-[0_0_30px_rgba(249,115,22,0.2)]' },
    purple: { flame: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', glow: 'shadow-[0_0_30px_rgba(168,85,247,0.2)]' },
    cyan: { flame: 'text-cyan-500', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', glow: 'shadow-[0_0_30px_rgba(6,182,212,0.2)]' },
    blue: { flame: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', glow: 'shadow-[0_0_30px_rgba(59,130,246,0.2)]' },
    emerald: { flame: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', glow: 'shadow-[0_0_30px_rgba(16,185,129,0.2)]' },
  }
  const c = colorMap[accentColor] || colorMap.orange

  // ── MINI VARIANT ──
  if (variant === 'mini') {
    return (
      <div className={`flex items-center gap-2 px-4 py-2 ${c.bg} border ${c.border} rounded-full ${c.glow}`}>
        <Flame className={`w-4 h-4 ${c.flame} ${isOnFire ? 'animate-pulse' : ''}`} />
        <span className={`text-[10px] font-black ${c.text} uppercase tracking-widest`}>{streak.currentStreak}d</span>
        {multiplier > 1 && (
          <span className="text-[8px] font-black text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-full border border-yellow-500/20">
            x{multiplier}
          </span>
        )}
      </div>
    )
  }

  // ── COMPACT VARIANT ──
  if (variant === 'compact') {
    return (
      <div className={`${c.bg} border ${c.border} rounded-2xl p-5 ${c.glow} relative overflow-hidden group`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Flame className={`w-6 h-6 ${c.flame} ${isOnFire ? 'animate-pulse' : ''}`} />
            <div>
              <p className="text-2xl font-black text-white italic tracking-tighter leading-none">{streak.currentStreak}</p>
              <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mt-0.5">DÍAS_RACHA</p>
            </div>
          </div>
          {multiplier > 1 && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 px-3 py-1.5 rounded-xl">
              <p className="text-yellow-400 font-black text-xs">x{multiplier} XP</p>
            </div>
          )}
        </div>
        <div className="flex gap-1.5">
          {streak.weekActivity.map((active, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className={`w-6 h-6 rounded-lg ${active ? `${c.bg} border ${c.border}` : 'bg-white/5 border border-white/5'} flex items-center justify-center transition-all`}>
                {active && <Flame className={`w-3 h-3 ${c.flame}`} />}
              </div>
              <span className="text-[6px] font-black text-slate-600 uppercase">{DAY_LABELS[i]}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── FULL VARIANT ──
  return (
    <div className={`bg-[#0b1120]/80 border border-white/10 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-xl ${c.glow} relative overflow-hidden group shadow-2xl`}>
      <div className={`absolute -top-10 -right-10 w-40 h-40 ${c.bg} blur-[80px] rounded-full opacity-30 group-hover:opacity-50 transition-opacity`} />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 ${c.bg} border ${c.border} rounded-2xl flex items-center justify-center ${c.glow} relative`}>
              <Flame className={`w-8 h-8 ${c.flame} ${isOnFire ? 'animate-pulse' : ''}`} />
              {isOnFire && <div className={`absolute inset-0 ${c.bg} blur-xl rounded-full opacity-50`} />}
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">RACHA_STREAK_PROTOCOL</p>
              <p className="text-4xl font-black text-white italic tracking-tighter leading-none">
                {streak.currentStreak} <span className="text-lg text-slate-500">días</span>
              </p>
            </div>
          </div>
          
          {multiplier > 1 && (
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 px-5 py-3 rounded-2xl text-center shadow-[0_0_20px_rgba(234,179,8,0.15)]">
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">MULTIPLIER</p>
              <p className="text-2xl font-black text-yellow-400 italic">x{multiplier}</p>
            </div>
          )}
        </div>

        {/* Week Calendar */}
        <div className="grid grid-cols-7 gap-3 mb-8">
          {streak.weekActivity.map((active, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className={`w-full aspect-square rounded-2xl flex items-center justify-center transition-all ${
                active 
                  ? `${c.bg} border ${c.border} ${c.glow}` 
                  : 'bg-white/5 border border-white/5'
              }`}>
                {active ? (
                  <Flame className={`w-5 h-5 ${c.flame} ${isOnFire ? 'animate-pulse' : ''}`} />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-white/10" />
                )}
              </div>
              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{DAY_LABELS[i]}</span>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-center">
            <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
            <p className="text-lg font-black text-white italic">{streak.longestStreak}</p>
            <p className="text-[7px] text-slate-600 font-black uppercase tracking-widest">RÉCORD_MÁXIMO</p>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-center">
            <Zap className="w-5 h-5 text-amber-400 mx-auto mb-2" />
            <p className="text-lg font-black text-white italic">{streak.totalXpMultiplied}</p>
            <p className="text-[7px] text-slate-600 font-black uppercase tracking-widest">XP_BONUS_TOTAL</p>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-center">
            <Shield className={`w-5 h-5 ${c.flame} mx-auto mb-2`} />
            <p className={`text-lg font-black ${c.text} italic`}>x{multiplier}</p>
            <p className="text-[7px] text-slate-600 font-black uppercase tracking-widest">MULTI_ACTIVO</p>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="mt-6 pt-4 border-t border-white/5 text-center">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">
            {streak.currentStreak >= 30 ? '🔥 ¡LEYENDA VIVIENTE! RACHA ÉPICA.' :
             streak.currentStreak >= 14 ? '⚡ ¡IMPARABLE! x3 MULTIPLICADOR DESBLOQUEADO.' :
             streak.currentStreak >= 7 ? '🚀 ¡UNA SEMANA! x2 XP ACTIVO.' :
             streak.currentStreak >= 3 ? '💪 ¡3 DÍAS! x1.5 MULTIPLICADOR ACTIVO.' :
             '🎯 MANTÉN TU RACHA PARA DESBLOQUEAR MULTIPLICADORES'}
          </p>
        </div>
      </div>
    </div>
  )
}
