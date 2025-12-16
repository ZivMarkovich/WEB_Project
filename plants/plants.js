/**
 * plants.js
 * חיפוש חופשי שמסנן כרטיסים לפי שם/תיאור.
 */

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('plants-search-input');
  const cards = Array.from(document.querySelectorAll('.plant-card'));
  const countEl = document.getElementById('plants-results-count');
  const noResultsEl = document.getElementById('plants-no-results');

  if (!input || cards.length === 0) return;

  function normalize(text) {
    return (text || '')
      .toLowerCase()
      .trim();
  }

  function updateResults() {
    const query = normalize(input.value);

    let visibleCount = 0;

    cards.forEach(card => {
      const title = card.querySelector('h3')?.innerText || '';
      const desc = card.querySelector('p')?.innerText || '';
      const haystack = normalize(`${title} ${desc}`);

      const match = query === '' || haystack.includes(query);
      card.hidden = !match;

      if (match) visibleCount++;
    });

    // count text
    if (countEl) {
      countEl.textContent = `מציג ${visibleCount} מתוך ${cards.length}`;
    }

    // no results
    if (noResultsEl) {
      noResultsEl.hidden = visibleCount !== 0;
    }
  }

  input.addEventListener('input', updateResults);

  // init
  updateResults();
});
