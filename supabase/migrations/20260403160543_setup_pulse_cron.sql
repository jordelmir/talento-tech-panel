-- ==============================================================================-- GITHUB PULSE - CRON SETUP (ZERO-COST POLLING)
-- ==============================================================================

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS pg_net;
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. Schedule the Pulse (Every 5 minutes)
-- Nota: La URL y la Anon Key están inyectadas basadas en la configuración actual del proyecto.
-- En un entorno de producción B2G, esto se manejaría mediante Vault o Variables de Entorno de DB.
SELECT cron.schedule(
  'github-pulse-cron',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://tvloaojbawvaugjyvacp.supabase.co/functions/v1/github-pulse',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer sb_publishable_FHJF5QlXAxfQ67VnbzBGpg_5Pzr3mZe"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);

COMMENT ON COLUMN live_sessions.last_commit_at IS 'Sincronizado via Edge Function github-pulse cada 5 minutos.';
