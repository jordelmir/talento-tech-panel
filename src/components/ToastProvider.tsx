'use client'

import React, { useState, createContext, useContext, useCallback } from 'react'
import { Zap, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'

type ToastType = 'info' | 'success' | 'warning'

interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

let toastId = 0

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const icons = {
    info: <Info className="w-4 h-4 text-cyan-400 shrink-0" />,
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
  }

  const colors = {
    info: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    warning: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 ${colors[toast.type]}`}
          >
            {icons[toast.type]}
            <span className="text-sm font-bold">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="ml-auto opacity-50 hover:opacity-100 transition-opacity">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
