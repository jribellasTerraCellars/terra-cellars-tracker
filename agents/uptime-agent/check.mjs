#!/usr/bin/env node
// Comprova la connectivitat a internet des de la xarxa local i registra el
// resultat a Supabase. Pensat per executar-se com a tasca programada cada
// pocs minuts (Task Scheduler a Windows, cron a Linux/Mac). No depen de cap
// servei extern de monitoratge: nomes fa una petita petició HTTPS contra un
// parell de resolvers publics molt estables (Cloudflare i Google) per saber
// si hi ha sortida a internet.

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY
const TIMEOUT_MS = 5000
const CHECK_TARGETS = ['https://1.1.1.1', 'https://8.8.8.8']

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Falten les variables d\'entorn SUPABASE_URL i/o SUPABASE_ANON_KEY.')
  process.exit(1)
}

async function checkTarget(url) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    await fetch(url, { method: 'HEAD', signal: controller.signal })
    return true
  } catch {
    return false
  } finally {
    clearTimeout(timeout)
  }
}

async function main() {
  const results = await Promise.all(CHECK_TARGETS.map(checkTarget))
  const isUp = results.some(Boolean)

  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/record_uptime_check`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ is_up: isUp }),
  })

  if (!response.ok) {
    console.error(`Error desant el resultat a Supabase: ${response.status} ${await response.text()}`)
    process.exit(1)
  }

  console.log(`[${new Date().toISOString()}] internet ${isUp ? 'UP' : 'DOWN'}`)
}

main()
