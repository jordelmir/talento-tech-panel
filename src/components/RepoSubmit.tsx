'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { GitBranch, ArrowRight, Loader2, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'

interface RepoSubmitProps {
  userId: string
  moduleName?: string
  variant?: 'compact' | 'full'
  onSubmitSuccess?: () => void
}

export default function RepoSubmit({ userId, moduleName = '0', variant = 'full', onSubmitSuccess }: RepoSubmitProps) {
  const [repoUrl, setRepoUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!repoUrl.trim() || !userId) return

    // Basic URL validation
    if (!repoUrl.includes('github.com/')) {
      setErrorMsg('URL inválida. Usa el formato: https://github.com/usuario/repo')
      setResult('error')
      setTimeout(() => { setResult('idle'); setErrorMsg('') }, 4000)
      return
    }

    setSubmitting(true)
    setResult('idle')
    const supabase = createClient()

    const { error } = await supabase
      .from('repository_submissions')
      .insert({
        student_id: userId,
        repo_url: repoUrl.trim(),
        module_name: moduleName,
        status: 'pending'
      })

    if (error) {
      console.error('[RepoSubmit]', error)
      setErrorMsg(error.message.includes('duplicate') ? 'Este repositorio ya fue enviado.' : 'Error al enviar. Intenta de nuevo.')
      setResult('error')
      setSubmitting(false)
      setTimeout(() => { setResult('idle'); setErrorMsg('') }, 4000)
      return
    }

    setResult('success')
    setSubmitting(false)
    setRepoUrl('')
    onSubmitSuccess?.()
    setTimeout(() => setResult('idle'), 5000)
  }

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/50" />
          <input
            type="url"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/tu-usuario/tu-repo"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
            disabled={submitting}
          />
        </div>
        <button
          type="submit"
          disabled={submitting || !repoUrl.trim()}
          className="shrink-0 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-4 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
          {submitting ? 'Enviando...' : 'Subir'}
        </button>
        {result === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 animate-in fade-in" />}
        {result === 'error' && (
          <div className="flex items-center gap-1 text-rose-400 text-xs shrink-0">
            <XCircle className="w-4 h-4" />
            <span className="text-[10px] sm:text-xs truncate max-w-[120px] sm:max-w-none">{errorMsg}</span>
          </div>
        )}
      </form>
    )
  }

  return (
    <div className="bg-[#0A0A0A]/80 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <GitBranch className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Subir Repositorio</h3>
          <p className="text-[10px] text-gray-500 font-mono tracking-wider">GITHUB_REPO_SUBMIT</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <GitBranch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/50" />
          <input
            type="url"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/tu-usuario/tu-repo"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all font-mono"
            disabled={submitting}
          />
        </div>

        <button
          type="submit"
          disabled={submitting || !repoUrl.trim()}
          className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-wider"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analizando repositorio...
            </>
          ) : (
            <>
              <ArrowRight className="w-4 h-4" />
              Enviar para Evaluación
            </>
          )}
        </button>
      </form>

      {result === 'success' && (
        <div className="mt-3 flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 rounded-xl animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="font-bold">Repositorio enviado exitosamente. Evaluación en proceso.</span>
        </div>
      )}

      {result === 'error' && (
        <div className="mt-3 flex items-center gap-2 text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 rounded-xl animate-in fade-in">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span className="font-bold">{errorMsg}</span>
        </div>
      )}
    </div>
  )
}
