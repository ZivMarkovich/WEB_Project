/**
 * accessories.js
 * 1) Search filter
 * 2) Stock check (MODAL) - client-side only
 */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     A) SEARCH FILTER
  ========================================================= */

  /* --- DOM Elements --- */
  /* Search input + cards list + UI elements for results count / empty state */
  const input = document.getElementById("accessories-search-input");
  const cards = Array.from(document.querySelectorAll(".accessory-card"));
  const countEl = document.getElementById("accessories-results-count");
  const noResultsEl = document.getElementById("accessories-no-results");

  /* --- Helper: Normalize Text --- */
  /* Lowercase + trim to allow consistent matching */
  function normalize(text) {
    return (text || "").toLowerCase().trim();
  }

  /* --- Filter Logic --- */
  /* Hides cards that do not match the query and updates "showing X out of Y" */
  function updateResults() {
    const query = normalize(input?.value || "");
    let visible = 0;

    cards.forEach((card) => {
      const title = card.querySelector("h3")?.innerText || "";
      const desc = card.querySelector("p")?.innerText || "";
      const haystack = normalize(`${title} ${desc}`);

      const match = query === "" || haystack.includes(query);
      card.hidden = !match;
      if (match) visible++;
    });

    /* Update results counter */
    if (countEl) countEl.textContent = `מציג ${visible} מתוך ${cards.length}`;

    /* Show "no results" message only when nothing is visible */
    if (noResultsEl) noResultsEl.hidden = visible !== 0;
  }

  /* --- Bind Search Events --- */
  /* Runs filtering on every input change + initial run on load */
  if (input) {
    input.addEventListener("input", updateResults);
    updateResults();
  }


  /* =========================================================
     B) STOCK CHECK - MODAL
  ========================================================= */

  /* --- Demo Stock Data --- */
  /* This is a client-side simulation (no real server calls) */
  const STOCK_BY_NAME = {
    "עציץ קרמי": 10,
    "חיפוי אדמה": 7,
    "מתלה לעציצים": 3,
    "תחתית לעציץ": 12,
    "דשא סינטטי": 4,
    "בד נוף": 9,
    "חומר ריסוס לצמחים": 2,
    "תוויות סימון לצמחים": 20,
    "קשירות לצמחים": 15,
    "מקלות תמיכה": 11,
    "אדמת שתילה": 13,
    "קומפוסט": 8,
    "דשן לצמחים": 6,
    "טוף או חלוקי נחל": 5,
    "עציץ תלוי": 4,
    "מעמד לעציצים": 2,
    "מד לחות לאדמה": 1,
    "רשת צל": 7,
    "סלסלת אחסון לגינה": 3,
    "כיסוי הגנה לצמחים": 6
  };

  /* --- Fake "Server" Check --- */
  /* Adds a small delay and returns availability result */
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

  /* --- Modal DOM Elements --- */
  const modalBackdrop = document.getElementById("stock-modal");
  const modalSubtitle = document.getElementById("stock-modal-subtitle");
  const modalForm = document.getElementById("stock-modal-form");
  const qtyInput = document.getElementById("stock-modal-qty");
  const errorEl = document.getElementById("stock-modal-error");
  const resultEl = document.getElementById("stock-modal-result");
  const closeBtn = document.getElementById("stock-modal-close");

  /* Stores the current clicked item name */
  let currentItemName = "";

  /* --- Open Modal --- */
  /* Sets subtitle + resets UI + focuses the qty field */
  function openModal(itemName) {
    currentItemName = itemName;
    modalSubtitle.textContent = `מוצר: ${itemName}`;
    modalBackdrop.hidden = false;
    modalForm.reset();
    errorEl.textContent = "";
    resultEl.textContent = "";
    qtyInput.focus();
  }

  /* --- Close Modal --- */
  /* Hides modal and clears any messages */
  function closeModal() {
    modalBackdrop.hidden = true;
    errorEl.textContent = "";
    resultEl.textContent = "";
  }

  /* --- Close Button --- */
  closeBtn.addEventListener("click", closeModal);

  /* --- Click Outside Modal --- */
  /* Only closes when clicking on the backdrop itself */
  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  /* --- ESC Key Close --- */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modalBackdrop.hidden) {
      closeModal();
    }
  });

  /* --- Form Submit (Check Stock) --- */
  /* Validates qty and prints result */
  modalForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    errorEl.textContent = "";
    resultEl.textContent = "";

    const raw = qtyInput.value.trim();
    const qty = Number(raw);

    /* Validation: empty value */
    if (!raw) {
      errorEl.textContent = "נא להזין כמות.";
      return;
    }

    /* Validation: must be positive integer */
    if (!Number.isInteger(qty) || qty <= 0) {
      errorEl.textContent = "הכמות חייבת להיות מספר שלם וחיובי.";
      return;
    }

    /* Validation: prevent unrealistic values */
    if (qty > 100) {
      errorEl.textContent = "הכמות גדולה מדי (מקסימום 100).";
      return;
    }

    /* Loading state */
    resultEl.textContent = "בודק זמינות...";

    const data = await fakeServerCheckStock(currentItemName, qty);

    /* Result message */
    if (data.available) {
      resultEl.textContent = `יש במלאי ✅ (זמין: ${data.inStock})`;
    } else {
      resultEl.textContent = `אין מספיק במלאי ❌ (זמין: ${data.inStock})`;
    }
  });


  /* =========================================================
     C) ADD BUTTON TO EACH CARD
  ========================================================= */

  /* --- Inject Button Per Card --- */
  /* Prevents duplicates by checking if button already exists */
  cards.forEach((card) => {
    const caption = card.querySelector(".accessory-caption");
    if (!caption) return;

    /* If button already exists (safety), skip */
    if (caption.querySelector(".stock-toggle-btn")) return;

    const itemName = card.querySelector("h3")?.innerText.trim() || "מוצר";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "stock-toggle-btn";
    btn.textContent = "בדיקת זמינות";

    /* Opens the modal with the current item name */
    btn.addEventListener("click", () => openModal(itemName));

    caption.appendChild(btn);
  });

});
