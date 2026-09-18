# Agent d'uptime d'internet

Script independent (no forma part de la web) que comprova si hi ha connexió a
internet des de la xarxa de l'oficina i en desa el resultat a Supabase. No fa
servir cap servei extern de monitoratge — només consulta directament dos
resolvers públics molt estables (`1.1.1.1` i `8.8.8.8`).

La base de dades no creix amb cada comprovació: totes les comprovacions d'un
mateix dia s'acumulen en una sola fila (`uptime_daily`), així que només
s'afegeix una fila nova per dia, per sempre.

## Requisits

- Node.js 18 o superior (ja instal·lat a la màquina que faci servir aquest repositori).
- Ha d'executar-se en una màquina sempre encesa dins la xarxa de l'oficina (o amb accés a internet real, no darrere d'un proxy corporatiu que falsegi la connectivitat).

## Configuració

Calen dues variables d'entorn (les mateixes que fa servir la web, es poden copiar de `.env.local`):

```
SUPABASE_URL=https://wftmsnowjsmaqaeeljaf.supabase.co
SUPABASE_ANON_KEY=sb_publishable_X4rq_AkKyJc8fljvrwrLTQ___mu_AgZ
```

## Execució manual

```bash
node check.mjs
```

## Programar-lo perquè s'executi sol

**Windows (Task Scheduler):** crea una tasca que executi cada 5 minuts:

```
Programa: node.exe
Arguments: C:\ruta\a\agents\uptime-agent\check.mjs
```

Cal definir les variables d'entorn `SUPABASE_URL` i `SUPABASE_ANON_KEY` com a variables del sistema, o bé afegir-les al principi de la tasca amb un `.cmd` embolcall.

**Linux/Mac (cron):**

```
*/5 * * * * SUPABASE_URL=... SUPABASE_ANON_KEY=... node /ruta/a/agents/uptime-agent/check.mjs
```

Les dades es veuen a la pestanya **Estadístiques** de l'aplicació.
