/**
 * gardenTools.js
 * 1) Search filter (live filtering of catalog cards)
 * 2) Stock check (MODAL) - client-side only (fake stock lookup)
 */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     A) SEARCH FILTER
     - Reads the search input
     - Hides / shows cards using the [hidden] attribute
     - Updates the "results count" text + "no results" message
  ========================================================= */
  const input = document.getElementById("gardenTools-search-input");
  const cards = Array.from(document.querySelectorAll(".gardenTool-card"));
  const countEl = document.getElementById("gardenTools-results-count");
  const noResultsEl = document.getElementById("gardenTools-no-results");

  /* Normalizes text for comparison (lowercase + trim) */
  function normalize(text) {
    return (text || "").toLowerCase().trim();
  }

  /* Main filtering function (runs on every input change) */
  function updateResults() {
    const query = normalize(input?.value || "");
    let visible = 0;

    cards.forEach((card) => {
      /* Grabs the searchable fields: title + description */
      const title = card.querySelector("h3")?.innerText || "";
      const desc = card.querySelector("p")?.innerText || "";
      const haystack = normalize(`${title} ${desc}`);

      /* Empty query = show all. Otherwise, show matches only */
      const match = query === "" || haystack.includes(query);
      card.hidden = !match;

      if (match) visible++;
    });

    /* Updates the UI counter + empty state message */
    if (countEl) countEl.textContent = `מציג ${visible} מתוך ${cards.length}`;
    if (noResultsEl) noResultsEl.hidden = visible !== 0;
  }

  /* Attach input listener + run once on page load */
  if (input) {
    input.addEventListener("input", updateResults);
    updateResults();
  }


  /* =========================================================
     B) STOCK CHECK - MODAL
     - Fake stock "database" object
     - Modal open / close logic
     - Form validation + simulated async stock check
  ========================================================= */

  /* Demo stock values per item name */
  const STOCK_BY_NAME = {
    "מזמרה": 12,
    "כפפות גינון": 8,
    "את חפירה": 4,
    "מגרפה קטנה": 6,
    "כף שתילה": 10,
    "מעדר ידני": 5,
    "קלשון ידני": 3,
    "מספרי גיזום": 7,
    "מסור גיזום": 2,
    "חותך ענפים": 1,
    "משפך השקיה": 9,
    "מרסס ידני": 0,
    "צינור גינה": 11,
    "אקדח השקיה": 6,
    "מגרפה גדולה": 4,
    "מטאטא חצר": 8,
    "דלי גינון": 13,
    "ברך גינון": 5,
    "ארגז לכלי עבודה": 7,
    "כף מדידה לדשן": 12
  };

  /* Simulates a server request (returns a Promise after a short delay) */
  function fakeServerCheckStock(itemName, qty) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const inStock = Number(STOCK_BY_NAME[itemName] ?? 0);
        resolve({
          itemName,
          requested: qty,
          inStock,
          available: qty <= inStock
        });
      }, 300);
    });
  }

  /* Modal DOM elements (shared structure across the catalog pages) */
  const modalBackdrop = document.getElementById("stock-modal");
  const modalSubtitle = document.getElementById("stock-modal-subtitle");
  const modalForm = document.getElementById("stock-modal-form");
  const qtyInput = document.getElementById("stock-modal-qty");
  const errorEl = document.getElementById("stock-modal-error");
  const resultEl = document.getElementById("stock-modal-result");
  const closeBtn = document.getElementById("stock-modal-close");

  /* Keeps track of the currently selected item for the modal */
  let currentItemName = "";

  /* Opens the modal for a specific item */
  function openModal(itemName) {
    currentItemName = itemName;
    modalSubtitle.textContent = `מוצר: ${itemName}`;
    modalBackdrop.hidden = false;
    modalForm.reset();
    errorEl.textContent = "";
    resultEl.textContent = "";
    qtyInput.focus();
  }

  /* Closes the modal and clears messages */
  function closeModal() {
    modalBackdrop.hidden = true;
    errorEl.textContent = "";
    resultEl.textContent = "";
  }

  /* Close: button click */
  closeBtn.addEventListener("click", closeModal);

  /* Close: click outside the modal content (on the backdrop only) */
  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  /* Close: ESC key */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modalBackdrop.hidden) {
      closeModal();
    }
  });

  /* Form submit: validates quantity and runs the fake stock check */
  modalForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    errorEl.textContent = "";
    resultEl.textContent = "";

    const raw = qtyInput.value.trim();
    const qty = Number(raw);

    /* Validation: required */
    if (!raw) {
      errorEl.textContent = "נא להזין כמות.";
      return;
    }

    /* Validation: positive integer */
    if (!Number.isInteger(qty) || qty <= 0) {
      errorEl.textContent = "הכמות חייבת להיות מספר שלם וחיובי.";
      return;
    }

    /* Validation: max limit to prevent unrealistic requests */
    if (qty > 100) {
      errorEl.textContent = "הכמות גדולה מדי (מקסימום 100).";
      return;
    }

    /* Loading message */
    resultEl.textContent = "בודק זמינות...";

    const data = await fakeServerCheckStock(currentItemName, qty);

    /* Final result message */
    if (data.available) {
      resultEl.textContent = `יש במלאי ✅ (זמין: ${data.inStock})`;
    } else {
      resultEl.textContent = `אין מספיק במלאי ❌ (זמין: ${data.inStock})`;
    }
  });


  /* =========================================================
     C) ADD BUTTON TO EACH CARD
     - Creates and injects a "בדיקת זמינות" button into each card caption
     - Avoids duplicates if the button already exists
  ========================================================= */

  cards.forEach((card) => {
    const caption = card.querySelector(".gardenTool-caption");
    if (!caption) return;

    /* Safety: do not create a second button if one already exists */
    if (caption.querySelector(".stock-toggle-btn")) return;

    /* Reads the item name from the card title */
    const itemName = card.querySelector("h3")?.innerText.trim() || "מוצר";

    /* Creates the button element */
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "stock-toggle-btn";
    btn.textContent = "בדיקת זמינות";

    /* Opens the modal with the selected item name */
    btn.addEventListener("click", () => openModal(itemName));

    /* Adds the button as the last element in the caption */
    caption.appendChild(btn);
  });

});
