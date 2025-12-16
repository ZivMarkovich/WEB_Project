/**
 * accessories.js
 * חיפוש חופשי לאביזרים
 */

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('accessories-search-input');
  const cards = Array.from(document.querySelectorAll('.accessory-card'));
  const countEl = document.getElementById('accessories-results-count');
  const noResultsEl = document.getElementById('accessories-no-results');

  function normalize(text) {
    return (text || '').toLowerCase().trim();
  }

  function updateResults() {
    const query = normalize(input.value);
    let visible = 0;

    cards.forEach(card => {
      const title = card.querySelector('h3')?.innerText || '';
      const desc = card.querySelector('p')?.innerText || '';
      const match = normalize(title + ' ' + desc).includes(query);

      card.hidden = query && !match;
      if (!card.hidden) visible++;
    });

    countEl.textContent = `מציג ${visible} מתוך ${cards.length}`;
    noResultsEl.hidden = visible !== 0;
  }

  input.addEventListener('input', updateResults);
  updateResults();
});
