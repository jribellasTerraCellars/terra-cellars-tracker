-- Carrega les tasques pendents recollides manualment, totes en estat 'pendent'

insert into public.tickets (title, description, type, priority, status) values
  ('Estudiar quines línies no estem fent servir per reduir',
   'Mirant les últimes 3 factures, per posar en stand-by les que no estem fent servir.',
   'tasca', 'mitjana', 'pendent'),
  ('El Xavi ha de passar el programa de lectura de QRs de final de línia',
   'Per tindre-ho tot en un mateix PC.',
   'tasca', 'mitjana', 'pendent'),
  ('Buidar discos', null, 'tasca', 'mitjana', 'pendent'),
  ('Guardar tot l''escriptori i descàrregues del Toni al SharePoint', null, 'tasca', 'mitjana', 'pendent'),
  ('DeCA', null, 'tasca', 'mitjana', 'pendent'),
  ('Usuaris a Navision', null, 'tasca', 'mitjana', 'pendent'),
  ('Data del programa de CBL: 24/03/2025',
   'mwCBL.exe a la màquina de les etiquetes de CBL',
   'tasca', 'mitjana', 'pendent'),
  ('Reduir línies de telèfon',
   'Menys 5 línies inactives, per tindre en la recàmara.',
   'tasca', 'mitjana', 'pendent'),
  ('Mirar la factura de Bacolex', null, 'tasca', 'mitjana', 'pendent'),
  ('Buscar alternatives a Factorial',
   'Necessitem: control de fitxatges i control de vacances. El Xavi portarà un fitxador i muntem el crosscheck al cub amb un SQL Server.',
   'tasca', 'mitjana', 'pendent');
