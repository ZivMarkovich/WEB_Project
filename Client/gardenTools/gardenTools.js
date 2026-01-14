/**
 * gardenTools.js
 * 1) טעינת כלי עבודה מהשרת (Server-side data)
 * 2) סינון וחיפוש (Client-side filtering)
 * 3) בדיקת מלאי אמיתית (Server-side check)
 */

let allTools = []; // משתנה גלובלי לשמירת רשימת הכלים

document.addEventListener("DOMContentLoaded", () => {
  // הפעלת הפונקציות הראשיות בטעינת הדף
  loadTools();
  setupSearch();
  setupStockModal();
});

/* =========================================================
   A) LOAD DATA & RENDER (טעינת נתונים והצגה)
   ========================================================= */

async function loadTools() {
  const grid = document.getElementById("gardenTools-grid");
  
  try {
    // 1. בקשת נתונים מהשרת (נתיב חדש שיצרנו ב-index.js)
    const response = await fetch('/getTools'); //
    if (!response.ok) throw new Error('שגיאה בטעינת הנתונים');

    // 2. המרת התשובה ל-JSON
    allTools = await response.json(); //

    // 3. הצגת הכלים על המסך
    renderGrid(allTools);

  } catch (error) {
    console.error("Error:", error);
    grid.innerHTML = `<p style="color:red; text-align:center;">שגיאה בטעינת כלי העבודה. וודא שהשרת רץ.</p>`;
  }
}

// פונקציה לבניית הכרטיסיות ב-HTML
function renderGrid(toolsToRender) {
  const grid = document.getElementById("gardenTools-grid");
  const countEl = document.getElementById("gardenTools-results-count");
  const noResultsEl = document.getElementById("gardenTools-no-results");

  // ניקוי הגריד
  grid.innerHTML = "";

  // עדכון מונה תוצאות
  if (countEl) {
    countEl.textContent = `מציג ${toolsToRender.length} תוצאות`;
  }

  // טיפול במצב שאין תוצאות
  if (toolsToRender.length === 0) {
    if (noResultsEl) noResultsEl.hidden = false;
    return;
  } else {
    if (noResultsEl) noResultsEl.hidden = true;
  }

  // יצירת כרטיסיה לכל כלי
  toolsToRender.forEach((tool) => {
    const card = document.createElement("article");
    card.className = "gardenTool-card"; // שימו לב למחלקה הנכונה של CSS

    card.innerHTML = `
      <div class="gardenTool-image">
        <img src="${tool.image}" alt="${tool.name}">
      </div>
      <div class="gardenTool-caption">
        <h3>${tool.name}</h3>
        <p>${tool.description}</p>
        <button class="stock-toggle-btn" onclick="openStockModal('${tool.name}')">בדיקת זמינות</button>
      </div>
    `;

    grid.appendChild(card);
  });
}

/* =========================================================
   B) SEARCH FILTER (חיפוש וסינון)
   ========================================================= */

function setupSearch() {
  const input = document.getElementById("gardenTools-search-input");

  if (!input) return;

  input.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase().trim();

    // סינון המערך הגלובלי
    const filtered = allTools.filter((tool) => 
      tool.name.toLowerCase().includes(term) || 
      tool.description.toLowerCase().includes(term)
    );

    renderGrid(filtered);
  });
}

/* =========================================================
   C) STOCK CHECK - MODAL (בדיקת מלאי מול השרת)
   ========================================================= */

let currentToolName = "";

// פונקציה לפתיחת המודל
window.openStockModal = (toolName) => {
  currentToolName = toolName;
  const modal = document.getElementById("stock-modal");
  const subtitle = document.getElementById("stock-modal-subtitle");
  const form = document.getElementById("stock-modal-form");
  const resultEl = document.getElementById("stock-modal-result");
  const errorEl = document.getElementById("stock-modal-error");

  subtitle.textContent = `בדיקה עבור: ${toolName}`;
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

  const closeModal = () => { modal.hidden = true; };
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // שליחת הטופס לבדיקה בשרת
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
      // שליחת בקשה לנתיב הכלים בשרת
      // שימו לב: הפעם זה /check-tool-stock
      const res = await fetch(`/check-tool-stock?name=${currentToolName}&qty=${qty}`); //
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