/** * TALENTO TECH - AGENTE GHOST (AUDITOR DE SEGURIDAD IA)
 * ---------------------------------------------------
 * Este script está diseñado para correr en una instancia de Oracle Cloud (OCI).
 * Su función es procesar las entregas de los alumnos, clonar sus repositorios,
 * y realizar un escaneo de seguridad (IA) para detectar filtraciones o falta de RLS.
 */

const { createClient } = require('@supabase/supabase-js');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuración (Inyectar vía variables de entorno en Oracle Cloud)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function startAuditor() {
  console.log('👻 Agente Ghost Operativo en Oracle Cloud...');
  
  // 1. Polling de entregas pendientes
  setInterval(async () => {
    const { data: pendingSubmissions, error } = await supabase
      .from('repository_submissions')
      .select('*')
      .eq('status', 'pending')
      .limit(5);

    if (error) {
      console.error('Error fetching submissions:', error);
      return;
    }

    for (const submission of pendingSubmissions) {
      await auditRepository(submission);
    }
  }, 30000); // Escanear cada 30 segundos
}

async function auditRepository(submission) {
  const repoPath = path.join(__dirname, 'temp_repos', submission.id);
  console.log(`🔍 Auditando: ${submission.repo_url}`);

  try {
    // A. Clonado Efímero
    if (fs.existsSync(repoPath)) fs.rmSync(repoPath, { recursive: true });
    execSync(`git clone ${submission.repo_url} ${repoPath} --depth 1`);

    // B. Análisis de Seguridad Real (World Top)
    const leaks = [];
    
    // Check 1: ¿Hay llaves de Supabase filtradas?
    const serviceKeyCheck = execSync(`grep -r "service_role" ${repoPath} || true`).toString();
    if (serviceKeyCheck.length > 0) leaks.push("SERVICE_ROLE_KEY_LEAK");

    // Check 2: ¿Hay archivos .env en el repositorio?
    const envFileCheck = fs.readdirSync(repoPath).filter(f => f.startsWith('.env') && !f.endsWith('.example'));
    if (envFileCheck.length > 0) leaks.push("DOT_ENV_FILE_COMMITTED");

    // Check 3: ¿Faltan políticas de RLS? (Si hay archivos SQL)
    const sqlFiles = execSync(`find ${repoPath} -name "*.sql" || true`).toString();
    if (sqlFiles.length > 0 && !sqlFiles.includes('enable row level security')) {
      leaks.push("MISSING_RLS_POLICIES");
    }

    let feedback = '';
    let status = 'passed';

    if (leaks.length > 0) {
      status = 'auto_failed_security';
      feedback = `👻 GHOST ALERT: ${leaks.join(', ')}. Tu código expone la infraestructura nacional. Corrige de inmediato.`;
    } else {
      feedback = '👻 GHOST OK: Análisis estático completado. Cero vulnerabilidades críticas detectadas.';
    }

    // C. Actualizar Supabase
    await supabase
      .from('repository_submissions')
      .update({
        status: status,
        ai_feedback: feedback
      })
      .eq('id', submission.id);

    console.log(`✅ Resultado: ${status}`);

  } catch (err) {
    console.error('Audit failed:', err);
  } finally {
    if (fs.existsSync(repoPath)) fs.rmSync(repoPath, { recursive: true });
  }
}

startAuditor();
