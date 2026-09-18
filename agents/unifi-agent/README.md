# Agent de UniFi (pendent de credencials)

Encara no implementat. Mateix patró que l'agent d'uptime: un script que corre
en una màquina de l'oficina amb accés a `https://172.26.0.253:8443` (la IP
és privada, per això no es pot consultar directament des de Vercel), i envia
només un resum a Supabase (taula `external_metrics`) via HTTPS de sortida.

## El que falta per poder-lo construir

1. **Un usuari de només lectura** al controlador UniFi (no facis servir el teu usuari admin personal per a un script automatitzat).
2. **Confirmar la versió del controlador** (UniFi Network Application clàssic vs. UniFi OS): l'autenticació i les rutes de l'API canvien entre versions.
3. **Quines dades es volen veure a l'aplicació**, per exemple:
   - Estat de la WAN (connectat/desconnectat, IP pública)?
   - Nombre de clients connectats (per xarxa/VLAN)?
   - Estat de cada punt d'accés o switch (online/offline)?
   - Ús d'ample de banda?

Amb el certificat/usuari i la llista de dades, es pot escriure l'script que fa login al controlador, consulta l'API local i envia el resum a `external_metrics` (`source = 'unifi'`).

Nota: com que el certificat del controlador sol ser autofirmat, l'script haurà de confiar explícitament en ell (no s'ha de desactivar la verificació TLS globalment al sistema, només per aquesta connexió concreta).
