# Café Novecento — prototipo editoriale

Prototipo statico HTML/CSS/JavaScript. Questa repository serve alla verifica di UI e interazioni; non contiene il tema WordPress né un CMS.

## Avvio

Dalla cartella del progetto:

```sh
python3 -m http.server 8000
```

Aprire `http://localhost:8000`. Non occorrono installazione o build. I link relativi funzionano anche sotto il percorso di GitHub Pages.

## Pagine

- `/`: splash, orologio Roma, CTA sempre visibile, header a comparsa dopo la splash, carosello con frecce, archivio e modulo Wikipedia 1900–1999 come ultimo modulo.
- `/articoli/`: archivio con filtri.
- `/articoli/federalismo-etnico-sovietico/`: template con copertina e corpo di solo testo; estratto esistente.
- `/articoli/retorica-costituzionale/`: template con copertina e una foto nel corpo.
- `/articoli/marx-dopo-il-muro/`: template con copertina e quattro immagini nel corpo, compreso un dittico.
- `/statuto/`: esclusivamente Parte I pubblica, articoli 1–3. Le parti interne e il documento integrale non sono inclusi.
- `/manifesto/`: collegamento alla nuova pagina Statuto, mantenuto per i link precedenti.
- `/calendario/`: navigazione mensile, filtri eventi/uscite, agenda e stato vuoto.
- `/calendario/un-secolo-di-immagini/`: dettaglio evento dimostrativo.
- `/media/`: pagina conservata dal prototipo precedente.

## Riferimento visivo

Figma: https://www.figma.com/design/lfyq2iOzfA4PfxwJQekMVH/900_website

Allineamento del 5 novembre 2026 ai frame Web sync: articoli desktop `2098:193`, `2098:243`, `2098:292` e relative versioni mobile; calendario `2099:254`, dettaglio `2099:532`, statuto pubblico `2098:88`. Il codice conserva la famiglia Helvetica del prototipo; Figma usa Inter come sostituzione.

Le fotografie e l’illustrazione provengono dalla repository immagini del file Figma, scaricate in `assets/`. Le didascalie indicano i crediti e il contesto ancora da completare. I due nuovi articoli usano testo segnaposto esplicito; gli appuntamenti del novembre 2026 sono dimostrativi e non rappresentano un programma confermato.

Il modulo storico usa Wikipedia e può mostrare uno stato di errore quando il servizio non risponde. Orologio e modulo storico richiedono JavaScript; il modulo storico richiede anche rete. Le pagine del prototipo includono `noindex,nofollow`.

## Validazione

Controllati sintassi JavaScript, riferimenti locali, presenza dei soli articoli pubblici dello statuto, resa desktop e mobile a 390 px, navigazione del calendario novembre/dicembre e filtro Eventi. Nessuna integrazione CMS o pubblicazione WordPress è compresa.
