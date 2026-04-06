'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Play, RotateCcw, Copy, CheckCircle2, Loader2, Sparkles, Terminal, Code2, Zap, ChevronRight, Download } from 'lucide-react'

const STARTER_TEMPLATES = [
  { name: 'HTML Básico', lang: 'html', code: `<!DOCTYPE html>\n<html>\n<head>\n  <title>Mi Primera Página</title>\n  <style>\n    body { font-family: sans-serif; background: #0a0a0a; color: white; text-align: center; padding: 40px; }\n    h1 { background: linear-gradient(to right, #06b6d4, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }\n    .card { background: #111; border: 1px solid #333; border-radius: 12px; padding: 20px; margin: 20px auto; max-width: 400px; }\n  </style>\n</head>\n<body>\n  <h1>¡Hola Mundo!</h1>\n  <div class="card">\n    <p>🚀 Mi primer proyecto con Talento Tech</p>\n  </div>\n</body>\n</html>` },
  { name: 'JavaScript Fun', lang: 'javascript', code: `// Variables y funciones\nconst nombre = "Talento Tech"\nconst nivel = 42\n\nfunction saludar(name) {\n  return "¡Hola, " + name + "! 🚀"\n}\n\n// Arrays y loops\nconst tecnologías = ["HTML", "CSS", "JavaScript", "React"]\n\ntecnologías.forEach((tech, i) => {\n  console.log(\`\${i + 1}. Aprendiendo: \${tech}\`)\n})\n\nconsole.log(saludar(nombre))\nconsole.log("Nivel de poder:", nivel)` },
  { name: 'CSS Art', lang: 'html', code: `<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    body { background: #0a0a0a; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }\n    .robot { position: relative; width: 120px; height: 150px; }\n    .head { width: 100px; height: 80px; background: #06b6d4; border-radius: 20px; margin: 0 auto; position: relative; }\n    .eye { width: 20px; height: 20px; background: #fff; border-radius: 50%; position: absolute; top: 25px; animation: blink 3s infinite; }\n    .eye.left { left: 20px; }\n    .eye.right { right: 20px; }\n    .mouth { width: 40px; height: 8px; background: #fff; border-radius: 4px; position: absolute; bottom: 15px; left: 50%; transform: translateX(-50%); }\n    .body { width: 80px; height: 60px; background: #8b5cf6; border-radius: 10px; margin: 10px auto 0; }\n    @keyframes blink { 0%,90%,100% { height: 20px; } 95% { height: 2px; } }\n    .label { color: #666; font-family: monospace; text-align: center; margin-top: 20px; font-size: 12px; }\n  </style>\n</head>\n<body>\n  <div>\n    <div class="robot">\n      <div class="head">\n        <div class="eye left"></div>\n        <div class="eye right"></div>\n        <div class="mouth"></div>\n      </div>\n      <div class="body"></div>\n    </div>\n    <div class="label">CSS Robot 🤖</div>\n  </div>\n</body>\n</html>` },
]

export default function CodePlayground({ accentColor = 'cyan' }: { accentColor?: string }) {
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
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className={`flex items-center gap-2 px-4 py-1.5 ${accent} rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-4 w-fit border`}>
            <Code2 className="w-3 h-3" /> LIVE_CODE_ENGINE_V1
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic leading-[0.85]">
            CÓDIGO EN <span className={`text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400`}>VIVO_</span>
          </h2>
          <p className="text-slate-500 text-sm mt-3 font-bold uppercase tracking-[0.2em]">
            Escribe, ejecuta y recibe feedback de IA en tiempo real 🤖
          </p>
        </div>
      </div>

      {/* Template Selector */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {STARTER_TEMPLATES.map((t, i) => (
          <button
            key={i}
            onClick={() => handleTemplateChange(i)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
              activeTemplate === i
                ? `${accent} border shadow-lg`
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
        <div className="bg-[#0b1120]/80 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-xl shadow-2xl flex flex-col">
          {/* Editor Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#020617]/60 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
              </div>
              <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">
                {STARTER_TEMPLATES[activeTemplate].name}.{STARTER_TEMPLATES[activeTemplate].lang === 'html' ? 'html' : 'js'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleCopy} className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all">
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              </button>
              <button onClick={() => handleTemplateChange(activeTemplate)} className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all">
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Textarea Editor */}
          <div className="relative flex-1 min-h-[400px]">
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#020617]/40 border-r border-white/5 flex flex-col items-center pt-4 text-[9px] font-mono text-slate-700 gap-0 select-none">
              {code.split('\n').map((_, i) => (
                <div key={i} className="h-[20px] leading-[20px]">{i + 1}</div>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full h-full bg-transparent text-white font-mono text-sm p-4 pl-14 outline-none resize-none leading-[20px] selection:bg-purple-500/30 caret-cyan-400"
              style={{ tabSize: 2 }}
            />
          </div>

          {/* Action Bar */}
          <div className="px-6 py-4 bg-[#020617]/60 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-emerald-400/30 disabled:opacity-50"
              >
                {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                {isRunning ? 'EJECUTANDO...' : 'EJECUTAR'}
              </button>
              <button
                onClick={handleAIReview}
                disabled={aiThinking}
                className={`flex items-center gap-2 ${accent} border px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50`}
              >
                {aiThinking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {aiThinking ? 'ANALIZANDO...' : 'REVIEW_IA'}
              </button>
            </div>
            <span className="text-[8px] font-mono text-slate-700 uppercase tracking-widest hidden md:block">
              {code.split('\n').length} LÍNEAS • {code.length} CHARS
            </span>
          </div>
        </div>

        {/* Output Panel */}
        <div className="bg-[#0b1120]/80 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-xl shadow-2xl flex flex-col">
          <div className="px-6 py-4 bg-[#020617]/60 border-b border-white/5 flex items-center gap-3">
            <Terminal className="w-4 h-4 text-emerald-500" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              {showPreview ? 'PREVIEW_RENDER' : 'CONSOLE_OUTPUT'}
            </span>
            {output && <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />}
          </div>

          <div className="flex-1 min-h-[400px] relative">
            {showPreview ? (
              <iframe
                ref={iframeRef}
                className="w-full h-full bg-white"
                sandbox="allow-scripts"
                title="preview"
              />
            ) : output ? (
              <pre className="p-6 text-sm font-mono text-emerald-400 whitespace-pre-wrap leading-relaxed">
                {output}
              </pre>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <Terminal className="w-12 h-12 text-slate-800 mb-4" />
                <p className="text-[11px] font-black text-slate-700 uppercase tracking-[0.4em]">
                  ESPERANDO_EJECUCIÓN...
                </p>
                <p className="text-[9px] text-slate-800 font-mono mt-2">
                  Presiona EJECUTAR para ver el resultado
                </p>
              </div>
            )}
          </div>

          {/* AI Feedback */}
          {aiFeedback && (
            <div className="px-6 py-5 bg-purple-500/5 border-t border-purple-500/20 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">GEMINI_AI_REVIEW</span>
              </div>
              <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                {aiFeedback}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
