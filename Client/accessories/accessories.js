/**
 * accessories.js
 * 1) טעינת אביזרים מהשרת (Real Server Data)
 * 2) סינון וחיפוש (Client-side filtering)
 * 3) בדיקת מלאי אמיתית (Real Server Check)
 */

let allAccessories = []; // משתנה גלובלי לשמירת רשימת האביזרים

document.addEventListener("DOMContentLoaded", () => {
  loadAccessories();
  setupSearch();
  setupStockModal();
});

/* =========================================================
   A) LOAD DATA & RENDER (טעינת נתונים והצגה)
   ========================================================= */

async function loadAccessories() {
  const grid = document.getElementById("accessories-grid");
  
  try {
    // 1. שליפת הנתונים מהשרת
    const response = await fetch('/getAccessories'); //
    if (!response.ok) throw new Error('Network response was not ok');

    // 2. המרה ל-JSON
    allAccessories = await response.json(); //

    // 3. הצגה במסך
    renderGrid(allAccessories);

  } catch (error) {
    console.error("Error loading accessories:", error);
    grid.innerHTML = `<p style="color:red; text-align:center;">שגיאה בטעינת האביזרים. וודא שהשרת פעיל.</p>`;
  }
}

// פונקציה לבניית הכרטיסיות ב-HTML
function renderGrid(itemsToRender) {
  const grid = document.getElementById("accessories-grid");
  const countEl = document.getElementById("accessories-results-count");
  const noResultsEl = document.getElementById("accessories-no-results");

  // ניקוי הגריד
  grid.innerHTML = "";

  // עדכון מונה תוצאות
  if (countEl) countEl.textContent = `מציג ${itemsToRender.length} תוצאות`;

  // טיפול במצב שאין תוצאות
  if (itemsToRender.length === 0) {
    if (noResultsEl) noResultsEl.hidden = false;
    return;
  } else {
    if (noResultsEl) noResultsEl.hidden = true;
  }

  // יצירת כרטיסיה לכל אביזר
  itemsToRender.forEach((item) => {
    const card = document.createElement("article");
    card.className = "accessory-card"; // שימוש במחלקה שמתאימה ל-CSS

    // שימו לב: שימוש בנתונים שמגיעים מה-DB
    card.innerHTML = `
      <div class="accessory-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="accessory-caption">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <button class="stock-toggle-btn" onclick="openStockModal('${item.name}')">בדיקת זמינות</button>
      </div>
    `;

    grid.appendChild(card);
  });
}

/* =========================================================
   B) SEARCH FILTER (חיפוש וסינון)
   ========================================================= */

function setupSearch() {
  const input = document.getElementById("accessories-search-input");
  if (!input) return;

  input.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase().trim();

    // סינון המערך הגלובלי
    const filtered = allAccessories.filter((item) => 
      item.name.toLowerCase().includes(term) || 
      item.description.toLowerCase().includes(term)
    );

    renderGrid(filtered);
  });
}

/* =========================================================
   C) STOCK CHECK - MODAL (בדיקת מלאי מול השרת)
   ========================================================= */

let currentItemName = "";

// פתיחת המודל (גלובלי)
window.openStockModal = (itemName) => {
  currentItemName = itemName;
  const modal = document.getElementById("stock-modal");
  const subtitle = document.getElementById("stock-modal-subtitle");
  const form = document.getElementById("stock-modal-form");
  const resultEl = document.getElementById("stock-modal-result");
  const errorEl = document.getElementById("stock-modal-error");

  subtitle.textContent = `בדיקה עבור: ${itemName}`;
  resultEl.textContent = "";
  errorEl.textContent = "";
  form.reset();
  
  modal.hidden = false;
};

function setupStockModal() {
  const modal = document.getElementById("stock-modal");
  const closeBtn = document.getElementById("stock-modal-close");
  const form = document.getElementById("stock-modal-form");
  const qtyInput = document.getElementById("stock-modal-qty");
  const resultEl = document.getElementById("stock-modal-result");
  const errorEl = document.getElementById("stock-modal-error");

  // סגירת המודל
  const closeModal = () => { modal.hidden = true; };
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // שליחת טופס לבדיקה בשרת
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.textContent = "";
    resultEl.textContent = "בודק נתונים...";

    const qty = parseInt(qtyInput.value);

    if (!qty || qty < 1) {
      errorEl.textContent = "נא להזין כמות תקינה";
      return;
    }

    try {
      // שליחת בקשה לשרת - שימו לב לנתיב /check-accessory-stock
      const res = await fetch(`/check-accessory-stock?name=${currentItemName}&qty=${qty}`); //
      const data = await res.json(); //

      if (data.available) {
        resultEl.innerHTML = `<span style="color: green; font-weight:bold;">יש במלאי! ✅ (נותרו ${data.stock})</span>`;
      } else {
        resultEl.innerHTML = `<span style="color: red; font-weight:bold;">אין מספיק מלאי ❌ (נותרו ${data.stock})</span>`;
      }

    } catch (err) {
      console.error(err);
      resultEl.textContent = "שגיאה בתקשורת עם השרת";
    }
  });
}