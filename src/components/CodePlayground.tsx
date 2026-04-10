'use client'

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { Play, RotateCcw, Copy, CheckCircle2, Loader2, Sparkles, Terminal, Code2, Zap, ChevronRight, Download, Users as UsersIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase'

const STARTER_TEMPLATES = [
  { name: 'HTML Básico', lang: 'html', code: `<!DOCTYPE html>\n<html>\n<head>\n  <title>Mi Primera Página</title>\n  <style>\n    body { font-family: sans-serif; background: #0a0a0a; color: white; text-align: center; padding: 40px; }\n    h1 { background: linear-gradient(to right, #06b6d4, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }\n    .card { background: #111; border: 1px solid #333; border-radius: 12px; padding: 20px; margin: 20px auto; max-width: 400px; }\n  </style>\n</head>\n<body>\n  <h1>¡Hola Mundo!</h1>\n  <div class="card">\n    <p>🚀 Mi primer proyecto con Talento Tech</p>\n  </div>\n</body>\n</html>` },
  { name: 'JavaScript Fun', lang: 'javascript', code: `// Variables y funciones\nconst nombre = "Talento Tech"\nconst nivel = 42\n\nfunction saludar(name) {\n  return "¡Hola, " + name + "! 🚀"\n}\n\n// Arrays y loops\nconst tecnologías = ["HTML", "CSS", "JavaScript", "React"]\n\ntecnologías.forEach((tech, i) => {\n  console.log(\`\${i + 1}. Aprendiendo: \${tech}\`)\n})\n\nconsole.log(saludar(nombre))\nconsole.log("Nivel de poder:", nivel)` },
  { name: 'CSS Art', lang: 'html', code: `<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    body { background: #0a0a0a; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }\n    .robot { position: relative; width: 120px; height: 150px; }\n    .head { width: 100px; height: 80px; background: #06b6d4; border-radius: 20px; margin: 0 auto; position: relative; }\n    .eye { width: 20px; height: 20px; background: #fff; border-radius: 50%; position: absolute; top: 25px; animation: blink 3s infinite; }\n    .eye.left { left: 20px; }\n    .eye.right { right: 20px; }\n    .mouth { width: 40px; height: 8px; background: #fff; border-radius: 4px; position: absolute; bottom: 15px; left: 50%; transform: translateX(-50%); }\n    .body { width: 80px; height: 60px; background: #8b5cf6; border-radius: 10px; margin: 10px auto 0; }\n    @keyframes blink { 0%,90%,100% { height: 20px; } 95% { height: 2px; } }\n    .label { color: #666; font-family: monospace; text-align: center; margin-top: 20px; font-size: 12px; }\n  </style>\n</head>\n<body>\n  <div>\n    <div class="robot">\n      <div class="head">\n        <div class="eye left"></div>\n        <div class="eye right"></div>\n        <div class="mouth"></div>\n      </div>\n      <div class="body"></div>\n    </div>\n    <div class="label">CSS Robot 🤖</div>\n  </div>\n</body>\n</html>` },
]

export default function CodePlayground({ accentColor = 'cyan', roomId = 'global_playground' }: { accentColor?: string, roomId?: string }) {
  const [code, setCode] = useState(STARTER_TEMPLATES[0].code)
  const [activeTemplate, setActiveTemplate] = useState(0)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [copied, setCopied] = useState(false)
  const [aiThinking, setAiThinking] = useState(false)
  const [aiFeedback, setAiFeedback] = useState('')
  
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Multiplayer Live-Share Logic
  const [collaborators, setCollaborators] = useState<{ id: string, name: string, color: string }[]>([])
  // We use Math.random inside a ref to ensure stable ID across renders
  const clientId = useRef(typeof window !== 'undefined' ? Math.random().toString(36).substring(2, 9) : '0')
  const channelRef = useRef<any>(null)
  const isTypingRef = useRef(false)
  const typeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const userInfo = useMemo(() => {
    return {
      id: clientId.current,
      name: `Coder_${clientId.current.slice(0, 4)}`,
      color: ['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#f43f5e'][Math.floor(Math.random() * 5)]
    }
  }, [])

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase.channel(roomId, {
      config: {
        presence: { key: clientId.current },
        broadcast: { self: false }
      }
    })
    channelRef.current = channel

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const activeUsers = Object.values(state).map(peers => peers[0] as any)
        setCollaborators(activeUsers)
      })
      .on('broadcast', { event: 'code_change' }, ({ payload }) => {
        if (!isTypingRef.current) {
          setCode(payload.code)
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track(userInfo)
        }
      })

    return () => {
      // @ts-ignore
      supabase.removeChannel(channel)
    }
  }, [roomId, userInfo])

  const colorMap: Record<string, string> = {
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  }
  const accent = colorMap[accentColor] || colorMap.cyan

  const handleRun = useCallback(() => {
    setIsRunning(true)
    setOutput('')
    
    const template = STARTER_TEMPLATES[activeTemplate]
    
    if (template.lang === 'html') {
      setShowPreview(true)
      if (iframeRef.current) {
        const doc = iframeRef.current.contentDocument
        if (doc) {
          doc.open()
          doc.write(code)
          doc.close()
        }
      }
      setTimeout(() => setIsRunning(false), 500)
    } else {
      // JavaScript execution
      try {
        const logs: string[] = []
        const fakeConsole = {
          log: (...args: any[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
          error: (...args: any[]) => logs.push('❌ ' + args.join(' ')),
          warn: (...args: any[]) => logs.push('⚠️ ' + args.join(' ')),
        }
        
        const fn = new Function('console', code)
        fn(fakeConsole)
        setOutput(logs.join('\n'))
        setShowPreview(false)
      } catch (e: any) {
        setOutput(`❌ Error: ${e.message}`)
        setShowPreview(false)
      }
      setTimeout(() => setIsRunning(false), 300)
    }
  }, [code, activeTemplate])

  const handleAIReview = useCallback(() => {
    setAiThinking(true)
    setAiFeedback('')
    
    // Simulated AI feedback (in production, this would call Gemini API)
    setTimeout(() => {
      const feedbacks = [
        `✅ **Estructura correcta.** Tu código sigue buenas prácticas.\n\n💡 **Sugerencia:** Podrías agregar más comentarios para explicar qué hace cada parte. Los programadores profesionales siempre documentan su código.\n\n⭐ **XP Bonus:** +50 por buena estructura`,
        `✅ **¡Excelente trabajo!** El código funciona correctamente.\n\n💡 **Tip Pro:** Intenta usar variables más descriptivas. En lugar de \`x\`, usa \`contadorDeClicks\`. Esto hace el código más legible.\n\n🔥 **Nivel de calidad:** 8/10`,
        `✅ **Bien hecho.** La lógica es sólida.\n\n💡 **Próximo paso:** Intenta agregar manejo de errores con \`try/catch\`. Los ingenieros de Google siempre protegen su código contra errores inesperados.\n\n🚀 **Progreso:** Estás en camino a nivel PRO`,
      ]
      setAiFeedback(feedbacks[Math.floor(Math.random() * feedbacks.length)])
      setAiThinking(false)
    }, 2000)
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleTemplateChange = (index: number) => {
    setActiveTemplate(index)
    setCode(STARTER_TEMPLATES[index].code)
    setOutput('')
    setShowPreview(false)
    setAiFeedback('')
    
    // Broadcast template change safely
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'code_change',
        payload: { code: STARTER_TEMPLATES[index].code }
      })
    }
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value
    setCode(newCode)
    
    isTypingRef.current = true
    if (typeTimeoutRef.current) clearTimeout(typeTimeoutRef.current)
    typeTimeoutRef.current = setTimeout(() => { isTypingRef.current = false }, 1000)

    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'code_change',
        payload: { code: newCode, userId: clientId.current }
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className={`flex items-center gap-2 px-4 py-1.5 ${accent} rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-4 w-fit border`}>
            <Code2 className="w-3 h-3" /> LIVE_CODE_ENGINE_V2_MULTIPLAYER
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic leading-[0.85]">
            CÓDIGO EN <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">VIVO_</span>
          </h2>
          <p className="text-slate-500 text-sm mt-3 font-bold uppercase tracking-[0.2em] max-w-xl">
            Live-Share Pairing: Colabora en tiempo real (estilo Google Docs). Escribe, ejecuta y recibe feedback de IA.
          </p>
        </div>
        
        {/* Collaborators Active Panel */}
        <div className="bg-[#0b1120]/80 border border-white/10 rounded-2xl p-4 flex flex-col gap-3 min-w-[200px]">
           <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-500">
             <span className="flex items-center gap-1.5"><UsersIcon className="w-3 h-3 text-cyan-400"/> PAIR_PROGRAMMING</span>
             <span className="text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/> LIVE {collaborators.length}</span>
           </div>
           <div className="flex -space-x-2 overflow-hidden">
             {collaborators.map((c) => (
                <div 
                   key={c.id} 
                   title={c.name}
                   className="w-8 h-8 rounded-full border-2 border-[#020617] flex items-center justify-center text-[10px] font-black text-white shrink-0 relative transition-transform hover:scale-110 z-10"
                   style={{ backgroundColor: c.color }}
                >
                   {c.name.slice(0, 2).toUpperCase()}
                </div>
             ))}
             {collaborators.length === 0 && (
               <span className="text-xs text-slate-600 font-mono">Esperando compas...</span>
             )}
           </div>
        </div>
      </div>

      {/* Template Selector */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {STARTER_TEMPLATES.map((t, i) => (
          <button
            key={i}
            onClick={() => handleTemplateChange(i)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
              activeTemplate === i
                ? `${accent} shadow-lg scale-105`
                : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Terminal className="w-3 h-3" />
            {t.name}
          </button>
        ))}
      </div>

      {/* Editor + Output Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Code Editor */}
        <div className="bg-[#0b1120]/80 border border-white/10 rounded-xl sm:rounded-[2rem] overflow-hidden backdrop-blur-xl shadow-2xl flex flex-col h-[350px] md:h-[500px]">
          {/* Editor Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#020617]/60 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
              </div>
              <span className="text-[10px] font-mono font-black uppercase text-slate-400 tracking-widest">
                {STARTER_TEMPLATES[activeTemplate].name}.{STARTER_TEMPLATES[activeTemplate].lang === 'html' ? 'html' : 'js'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button title="Copiar código" onClick={handleCopy} className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 hover:scale-105 transition-all">
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              </button>
              <button title="Reiniciar código" onClick={() => handleTemplateChange(activeTemplate)} className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 hover:scale-105 transition-all group">
                <RotateCcw className="w-3.5 h-3.5 text-slate-400 group-hover:-rotate-90 transition-transform" />
              </button>
            </div>
          </div>

          {/* Textarea Editor */}
          <div className="relative flex-1 bg-[#020617]/50">
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#020617]/40 border-r border-white/5 flex flex-col items-center pt-4 text-[9px] font-mono text-slate-700 gap-0 select-none overflow-hidden z-0">
              {code.split('\n').map((_, i) => (
                <div key={i} className="h-[20px] leading-[20px] opacity-60">{i + 1}</div>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={handleCodeChange}
              spellCheck={false}
              className="absolute inset-0 w-full h-full bg-transparent text-slate-300 font-mono text-[13px] p-4 pl-14 outline-none resize-none leading-[20px] selection:bg-purple-500/30 caret-cyan-400 z-10 custom-scrollbar focus:ring-inset focus:ring-1 focus:ring-cyan-500/20"
              style={{ tabSize: 2 }}
            />
          </div>

          {/* Action Bar */}
          <div className="px-6 py-4 bg-[#020617]/80 border-t border-white/5 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
                {isRunning ? 'EJECUTANDO...' : 'RUN_CODE'}
              </button>
              <button
                onClick={handleAIReview}
                disabled={aiThinking}
                className={`flex items-center gap-2 ${accent} border px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100`}
              >
                {aiThinking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {aiThinking ? 'ANALIZANDO...' : 'IA_REVIEW'}
              </button>
            </div>
            <span className="text-[9px] font-mono font-black text-slate-600 uppercase tracking-[0.2em]">
              {code.split('\n').length} lns • {code.length} ch
            </span>
          </div>
        </div>

        {/* Output Panel */}
        <div className="bg-[#0b1120]/80 border border-white/10 rounded-xl sm:rounded-[2rem] overflow-hidden backdrop-blur-xl shadow-2xl flex flex-col h-[350px] md:h-[500px]">
          <div className="px-6 py-4 bg-[#020617]/60 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <Terminal className="w-4 h-4 text-cyan-500" />
               <span className="text-[10px] font-black text-white uppercase tracking-widest">
                 {showPreview ? 'RENDER_VIRTUAL' : 'CONSOLE_VM'}
               </span>
               {output && <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" />}
            </div>
          </div>

          <div className="flex-1 relative overflow-auto custom-scrollbar">
            {showPreview ? (
              <iframe
                ref={iframeRef}
                className="w-full h-full bg-white transition-opacity duration-300"
                sandbox="allow-scripts"
                title="preview"
              />
            ) : output ? (
              <pre className="p-6 text-sm font-mono text-cyan-400 whitespace-pre-wrap leading-relaxed">
                {output}
              </pre>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-50">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                  <Terminal className="w-8 h-8 text-slate-500" />
                </div>
                <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.4em]">
                  AWAITING_EXECUTION
                </p>
                <p className="text-[10px] text-slate-500 font-mono mt-3 uppercase tracking-widest">
                  Hit run to compile
                </p>
              </div>
            )}
          </div>

          {/* AI Feedback */}
          {aiFeedback && (
            <div className="px-6 py-5 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-t border-purple-500/20 animate-in fade-in slide-in-from-bottom-4 shadow-[inset_0_20px_40px_-20px_rgba(168,85,247,0.15)] flex-none h-40 overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between mb-3">
                 <div className="flex items-center gap-2">
                   <div className="p-1.5 bg-purple-500/20 rounded-lg">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                   </div>
                   <span className="text-[10px] font-black text-purple-300 uppercase tracking-[0.3em]">GEMINI_AI_AGENT_REVIEW</span>
                 </div>
                 <button onClick={() => setAiFeedback('')} className="text-slate-500 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                 </button>
              </div>
              <div className="text-[13px] text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                {aiFeedback}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Custom Styles for Scrollbars inserted globally or inline (usually global is better, added here as fallback) */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
      `}} />
    </div>
  )
}

