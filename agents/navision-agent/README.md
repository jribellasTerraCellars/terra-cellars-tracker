# Agent de Navision (pendent de credencials)

Encara no implementat. Segueix el mateix patró que l'agent d'uptime: un
script que corre a prop del servidor Azure amb NAV 2018 (o en el mateix
servidor), consulta les dades localment, i envia només un resum a Supabase
(taula `external_metrics`) via una petició HTTPS de sortida — mai s'obre cap
port d'entrada al servidor de Navision.

## El que falta per poder-lo construir

No s'ha d'inventar cap camp ni suposar cap dada de negoci. Per completar-lo cal:

1. **Confirmar que els Web Services de NAV estan activats** al servidor (NAV 2018 els exposa via OData v4 o SOAP; per defecte només són accessibles dins la xarxa/VNet d'Azure, no des d'internet — per això l'agent ha de córrer a prop, no des de Vercel).
2. **Un usuari de servei** amb permisos de només lectura sobre les taules necessàries (evitar fer servir un usuari administrador).
3. **Quines dades exactes es volen veure**, per exemple:
   - "Càrregues": quin concepte exacte? (comandes de venda, albarans, tones, nombre d'enviaments...)
   - "Facturació": import total facturat per dia/setmana/mes? Per client? Per família de producte?
   - "Productes": més venuts per quantitat, per import, o estoc actual?
4. **Nom de la companyia** dins Navision (una instal·lació pot tenir més d'una empresa configurada).

Amb això es pot escriure l'script de consulta (OData/SOAP) i el mapeig cap a `external_metrics` (`source = 'navision'`, `metric_key` per cada xifra, `metric_value`, `captured_at`).
