# Agents de xarxa local

Aquesta carpeta conté petits scripts independents, fora de la web, pensats
per executar-se **dins la xarxa de Terra Cellars** (a l'oficina o al servidor
Azure) en lloc de dins de Vercel. Fan falta perquè Navision, el controlador
UniFi i la comprovació real d'internet només són accessibles des de dins la
xarxa local — Vercel, en canvi, corre als seus propis servidors a internet i
no hi té accés directe.

Tots segueixen el mateix patró de seguretat: **només envien dades cap a
fora**, mai obren cap port d'entrada ni exposen res nou a internet. Cada
agent es connecta a Supabase per HTTPS de sortida (igual que ho fa qualsevol
navegador), exactament igual que ja fa la web.

- [`uptime-agent`](./uptime-agent) — comprova la connexió a internet i en desa un resum diari. **Implementat i llest per desplegar.**
- [`navision-agent`](./navision-agent) — pendent de credencials i de saber exactament quines xifres es volen veure.
- [`unifi-agent`](./unifi-agent) — pendent de credencials i de saber exactament quines dades es volen veure.
