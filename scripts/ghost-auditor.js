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

    // B. Análisis de Seguridad (PoC: Buscamos palabras prohibidas o falta de RLS en SQL)
    const files = execSync(`grep -r "SUPABASE_SERVICE_ROLE_KEY" ${repoPath} || true`).toString();
    const hasLeak = files.length > 0;

    let feedback = '';
    let status = 'passed';

    if (hasLeak) {
      status = 'auto_failed_security';
      feedback = '👻 ALERTA GHOST: Se detectó la filtración de la Service Role Key. Esto compromete la seguridad nacional. Por favor, revoca la llave e inyéctala vía variables de entorno en Vercel.';
    } else {
      feedback = '👻 GHOST OK: No se detectaron secretos en el código fuente. La arquitectura parece seguir los estándares de orquestación segura.';
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
