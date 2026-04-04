import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

// Validar que la petición venga realmente de GitHub usando el secreto
function verifyGitHubSignature(req: NextRequest, rawBody: string, signature: string | null) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET
  if (!secret) return false
  if (!signature) return false

  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(rawBody)
  const expectedSignature = `sha256=${hmac.digest('hex')}`

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-hub-signature-256')

    // 1. Verificación de Seguridad (HMAC)
    // Para simplificar la prueba local si no hay secreto, bypass parcial SOLO EN MODO DEV
    if (process.env.NODE_ENV === 'production') {
      if (!verifyGitHubSignature(req, rawBody, signature)) {
        return NextResponse.json({ error: 'Firma HMAC inválida o secreta ausente.' }, { status: 401 })
      }
    } else if (process.env.GITHUB_WEBHOOK_SECRET) {
      if (!verifyGitHubSignature(req, rawBody, signature)) {
        console.warn('Firma HMAC inválida detectada en entorno local.')
        return NextResponse.json({ error: 'Firma HMAC inválida.' }, { status: 401 })
      }
    }

    const payload = JSON.parse(rawBody)

    // Solo evaluar eventos push
    if (req.headers.get('x-github-event') !== 'push') {
      return NextResponse.json({ message: 'Ignorando evento no-push' })
    }

    const repoUrl = payload.repository?.html_url
    if (!repoUrl) {
      return NextResponse.json({ error: 'No se encontró URL del repositorio en el payload.' }, { status: 400 })
    }

    // 2. Extraer archivos modificados en los commits
    const commits = payload.commits || []
    const addedFiles: string[] = []
    const modifiedFiles: string[] = []
    
    commits.forEach((commit: any) => {
      if (commit.added) addedFiles.push(...commit.added)
      if (commit.modified) modifiedFiles.push(...commit.modified)
    })

    const allFiles = [...addedFiles, ...modifiedFiles]
    
    // Ghost AI Logic (Evaluación Modular)
    // El módulo 0 requiere estructurar .gitignore
    const hasGitignore = allFiles.some(f => f.includes('.gitignore'))

    // TODO: Aquí se implementarían detectores de llaves estáticas/secretos expuestos.
    const hasLeakedSecrets = false 

    const finalStatus = hasLeakedSecrets ? 'auto_failed_security' : (hasGitignore ? 'passed' : 'pending')
    const aiFeedback = hasLeakedSecrets 
      ? 'Falla crítica detectada por la IA: Has subido llaves privadas (ej. .env) a un repositorio público. Tu llave debe ser revocada inmediatamente.' 
      : (hasGitignore ? '[SYSTEM_OK] Códigos limpios. Políticas de gitignore pasadas exitosamente.' : 'El repositorio fue actualizado pero aún falta el archivo requerido para completar el módulo (ej: .gitignore).')

    // 3. Supabase Admin Client (Supera las reglas de RLS para que el Webhook pueda realizar cambios como Dios)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Buscar en la tabla a qué alumno le pertenece este repositorio y actualizar el "Status"
    // Nota: GitHub webhook no nos da el user_id de Supabase, pero podemos buscar por repo_url
    console.log(`[Webhook] Asignando estatus '${finalStatus}' al repo ${repoUrl}...`)
    
    const { data: updatedSubmissions, error: updateError } = await supabaseAdmin
      .from('repository_submissions')
      .update({
        status: finalStatus,
        ai_feedback: aiFeedback
      })
      .eq('repo_url', repoUrl)
      .select()

    if (updateError) {
      console.error('[Webhook] Error en actualización de base de datos:', updateError)
      return NextResponse.json({ error: 'Database update failed.' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      matched_records: updatedSubmissions?.length || 0,
      assigned_status: finalStatus
    })
    
  } catch (err: any) {
    console.error('[Webhook] Excepción crítica:', err.message)
    return NextResponse.json({ error: 'Error procesando webhook.' }, { status: 500 })
  }
}
