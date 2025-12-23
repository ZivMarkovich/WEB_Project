/**
 * plants.js
 * 1) Search filter (client-side)
 * 2) Stock check modal (client-side demo)
 */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     A) SEARCH FILTER (Filter cards by title/description)
  ========================================================= */
  const input = document.getElementById("plants-search-input");
  const cards = Array.from(document.querySelectorAll(".plant-card"));
  const countEl = document.getElementById("plants-results-count");
  const noResultsEl = document.getElementById("plants-no-results");

  /* Normalize text so search is case-insensitive and clean */
  function normalize(text) {
    return (text || "").toLowerCase().trim();
  }

  /* Updates which cards are visible based on the search input */
  function updateResults() {
    const query = normalize(input?.value || "");
    let visible = 0;

    cards.forEach((card) => {
      const title = card.querySelector("h3")?.innerText || "";
      const desc = card.querySelector(".plant-caption p")?.innerText || "";
      const haystack = normalize(`${title} ${desc}`);

      const match = query === "" || haystack.includes(query);

      /* Uses the HTML [hidden] attribute (CSS hides it with display:none) */
      card.hidden = !match;
      if (match) visible++;
    });

    /* Update "X out of Y" counter */
    if (countEl) {
      countEl.textContent = `מציג ${visible} מתוך ${cards.length}`;
    }

    /* Show "no results" message only when nothing matches */
    if (noResultsEl) {
      noResultsEl.hidden = visible !== 0;
    }
  }

  /* Connect search input to live filtering */
  if (input) {
    input.addEventListener("input", updateResults);
    updateResults(); // initial state
  }


  /* =========================================================
     B) STOCK CHECK - MODAL (Fake stock logic)
  ========================================================= */

  /* Demo stock data by plant name */
  const STOCK_BY_NAME = {
    "לבנדר": 12,
    "רוזמרין": 8,
    "גרניום": 0,
    "בזיליקום": 15,
    "אלוורה": 6,
    "קקטוס": 20,
    "פוטוס": 5,
    "סנסיווריה": 3,
    "פלרגוניום": 9,
    "מרווה": 4,
    "נענע": 18,
    "טימין": 7,
    "לנטנה": 2,
    "פטוניה": 11,
    "יסמין": 1,
    "בוגנוויליה": 0,
    "ורדים": 10,
    "גרברה": 5,
    "ביגוניה": 6,
    "הדס": 13
  };

  /* Simulates a server request (returns after 300ms) */
  function fakeServerCheckStock(plantName, qty) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const inStock = Number(STOCK_BY_NAME[plantName] ?? 0);

        resolve({
          plantName,
          requested: qty,
          inStock,
          available: qty <= inStock
        });
      }, 300);
    });
  }

  /* Modal elements */
  const modalBackdrop = document.getElementById("stock-modal");
  const modalSubtitle = document.getElementById("stock-modal-subtitle");
  const modalForm = document.getElementById("stock-modal-form");
  const qtyInput = document.getElementById("stock-modal-qty");
  const errorEl = document.getElementById("stock-modal-error");
  const resultEl = document.getElementById("stock-modal-result");
  const closeBtn = document.getElementById("stock-modal-close");

  let currentPlantName = "";

  /* Opens modal and resets previous messages */
  function openModal(plantName) {
    currentPlantName = plantName;
    modalSubtitle.textContent = `מוצר: ${plantName}`;
    modalBackdrop.hidden = false;

    modalForm.reset();
    errorEl.textContent = "";
    resultEl.textContent = "";

    qtyInput.focus();
  }

  /* Closes modal and clears text */
  function closeModal() {
    modalBackdrop.hidden = true;
    errorEl.textContent = "";
    resultEl.textContent = "";
  }

  /* Close by button */
  closeBtn.addEventListener("click", closeModal);

  /* Close when clicking outside the modal box */
  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  /* Close by ESC key (only when modal is open) */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modalBackdrop.hidden) {
      closeModal();
    }
  });

  /* Submit: validate input, then check stock */
  modalForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    errorEl.textContent = "";
    resultEl.textContent = "";

    const raw = qtyInput.value.trim();
    const qty = Number(raw);

    /* Basic validations */
    if (!raw) {
      errorEl.textContent = "נא להזין כמות.";
      return;
    }

    if (!Number.isInteger(qty) || qty <= 0) {
      errorEl.textContent = "הכמות חייבת להיות מספר שלם וחיובי.";
      return;
    }

    if (qty > 100) {
      errorEl.textContent = "הכמות גדולה מדי (מקסימום 100).";
      return;
    }

    resultEl.textContent = "בודק זמינות...";

    const data = await fakeServerCheckStock(currentPlantName, qty);

    /* Show result */
    if (data.available) {
      resultEl.textContent = `יש במלאי ✅ (זמין: ${data.inStock})`;
    } else {
      resultEl.textContent = `אין מספיק במלאי ❌ (זמין: ${data.inStock})`;
    }
  });


  /* =========================================================
     C) ADD "CHECK STOCK" BUTTON TO EACH CARD
  ========================================================= */

  /* Creates the button once per card (prevents duplicates) */
  cards.forEach((card) => {
    const caption = card.querySelector(".plant-caption");
    if (!caption) return;

    /* Safety: do not add a second button if it already exists */
    if (caption.querySelector(".stock-toggle-btn")) return;

    const plantName = card.querySelector("h3")?.innerText.trim() || "מוצר";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "stock-toggle-btn";
    btn.textContent = "בדיקת זמינות";

    btn.addEventListener("click", () => openModal(plantName));

    caption.appendChild(btn);
  });

});
