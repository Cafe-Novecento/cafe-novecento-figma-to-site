(() => {
  const filters = document.querySelector('.media-filters');
  if (!filters) return;
  const cards = [...document.querySelectorAll('.media-archive [data-format]')];
  const gallery = document.querySelector('[data-image-gallery]');
  const recordings = document.querySelector('.media-recordings');
  const status = document.querySelector('#media-status');
  filters.hidden = false;
  filters.addEventListener('click', event => {
    const button = event.target.closest('button[data-filter]');
    if (!button) return;
    const format = button.dataset.filter;
    filters.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    cards.forEach(card => { card.hidden = format !== 'all' && card.dataset.format !== format; });
    gallery.hidden = format !== 'all' && format !== 'image';
    recordings.hidden = format === 'image';
    status.textContent = `${cards.filter(card => !card.hidden).length} contenuti · ${button.textContent}`;
  });
})();
