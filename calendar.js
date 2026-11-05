(() => {
  const grid = document.getElementById('calendar-days');
  if (!grid) return;
  const events = [
    { day: 6, kind: 'release', type: 'USCITA / PODCAST', title: 'Voci dal Novecento', time: '08:00', place: 'Online', description: 'Un episodio per tornare alle fonti e alle voci del secolo.' },
    { day: 13, kind: 'event', type: 'EVENTO / INCONTRO', title: 'Un secolo di immagini', time: '18:30', place: 'Luogo da confermare', description: 'Un confronto sul rapporto fra documenti, rappresentazione e memoria.', href: 'un-secolo-di-immagini/' },
    { day: 27, kind: 'release', type: 'USCITA / NEWSLETTER', title: 'Lettere dal Café', time: '09:00', place: 'Newsletter', description: 'Una selezione di letture, immagini e percorsi di ricerca.' },
  ];
  let year = 2026, month = 10, filter = 'all';
  const months = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
  const agenda = document.getElementById('agenda-items');
  function render() {
    const title = `${months[month]} ${year}`;
    document.getElementById('month-label').textContent = title;
    grid.setAttribute('aria-label', `Calendario ${title}`);
    document.getElementById('agenda-label').textContent = `Agenda / ${months[month]} ${year}`;
    const entries = year === 2026 && month === 10 ? events.filter(e => filter === 'all' || e.kind === filter) : [];
    const offset = (new Date(year,month,1).getDay()+6)%7;
    const days = new Date(year,month+1,0).getDate();
    grid.replaceChildren();
    for (let cell = 0; cell < Math.ceil((offset+days)/7)*7; cell++) {
      const box = document.createElement('div');
      box.className = 'calendar-cell';
      const day = cell-offset+1;
      if (day > 0 && day <= days) {
        const entry = entries.find(e => e.day === day);
        if (entry) {
          box.classList.add('has-event');
          const link = document.createElement('a');
          link.href = `#agenda-${day}`;
          link.setAttribute('aria-label', `${day} ${title}: ${entry.title}, ${entry.type.toLowerCase()}`);
          const number = document.createElement('span'); number.textContent = String(day).padStart(2,'0');
          const kind = document.createElement('small'); kind.textContent = entry.type;
          link.append(number,kind); box.append(link);
        } else box.textContent = String(day).padStart(2,'0');
      } else box.setAttribute('aria-hidden','true');
      grid.append(box);
    }
    agenda.replaceChildren();
    for (const e of entries) {
      const row = document.createElement('article'); row.className = 'agenda-row'; row.id = `agenda-${e.day}`; row.tabIndex = -1;
      const time = document.createElement('time'); time.dateTime = `2026-11-${String(e.day).padStart(2,'0')}T${e.time}:00+01:00`; time.textContent = `${String(e.day).padStart(2,'0')} NOV`;
      const detail = document.createElement('div');
      const type = document.createElement('span'); type.className = 'eyebrow'; type.textContent = e.type;
      const heading = document.createElement('h3');
      if (e.href) { const a = document.createElement('a'); a.href = e.href; a.textContent = e.title; heading.append(a); }
      else heading.textContent = e.title;
      const meta = document.createElement('p'); meta.className = 'meta'; meta.textContent = `Ore ${e.time} · ${e.place}`;
      const description = document.createElement('p'); description.textContent = e.description;
      detail.append(type,heading,meta,description);
      if (e.href) { const a = document.createElement('a'); a.className = 'textlink'; a.href = e.href; a.textContent = 'Dettagli dell’incontro'; detail.append(a); }
      row.append(time,detail); agenda.append(row);
    }
    if (!entries.length) {
      const p = document.createElement('p'); p.className = 'empty';
      p.textContent = filter === 'all' ? 'Non ci sono eventi o uscite in programma per questo mese.' : 'Nessun appuntamento per il filtro selezionato.'; agenda.append(p);
    }
  }
  function move(delta) { const date = new Date(year,month+delta,1); year = date.getFullYear(); month = date.getMonth(); render(); }
  document.getElementById('month-prev').addEventListener('click',()=>move(-1));
  document.getElementById('month-next').addEventListener('click',()=>move(1));
  document.querySelectorAll('[data-event-filter]').forEach(button=>button.addEventListener('click',()=>{
    filter = button.dataset.eventFilter;
    document.querySelectorAll('[data-event-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    render();
  }));
  render();
})();
