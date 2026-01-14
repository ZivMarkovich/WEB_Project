/**
 * plants.js
 * 1) טעינת צמחים מהשרת (Server-side data)
 * 2) סינון וחיפוש (Client-side filtering)
 * 3) בדיקת מלאי אמיתית (Server-side check)
 */

let allPlants = []; // משתנה גלובלי לשמירת רשימת הצמחים

document.addEventListener("DOMContentLoaded", () => {
  // הפעלת הפונקציות הראשיות בטעינת הדף
  loadPlants();
  setupSearch();
  setupStockModal();
});

/* =========================================================
   A) LOAD DATA & RENDER (טעינת נתונים והצגה)
   ========================================================= */

async function loadPlants() {
  const grid = document.getElementById("plants-grid");
  
  try {
    // 1. בקשת נתונים מהשרת
    const response = await fetch('/getPlants'); //
    if (!response.ok) throw new Error('שגיאה בטעינת הנתונים');

    // 2. המרת התשובה ל-JSON
    allPlants = await response.json(); //

    // 3. הצגת הצמחים על המסך
    renderGrid(allPlants);

  } catch (error) {
    console.error("Error:", error);
    grid.innerHTML = `<p style="color:red; text-align:center;">שגיאה בטעינת הצמחים. וודא שהשרת רץ.</p>`;
  }
}

// פונקציה לבניית הכרטיסיות ב-HTML
function renderGrid(plantsToRender) {
  const grid = document.getElementById("plants-grid");
  const countEl = document.getElementById("plants-results-count");
  const noResultsEl = document.getElementById("plants-no-results");

  // ניקוי הגריד לפני בנייה מחדש
  grid.innerHTML = "";

  // עדכון מונה תוצאות
  if (countEl) {
    countEl.textContent = `מציג ${plantsToRender.length} תוצאות`;
  }

  // טיפול במצב שאין תוצאות
  if (plantsToRender.length === 0) {
    if (noResultsEl) noResultsEl.hidden = false;
    return;
  } else {
    if (noResultsEl) noResultsEl.hidden = true;
  }

  // יצירת כרטיסיה לכל צמח
  plantsToRender.forEach((plant) => {
    const card = document.createElement("article");
    card.className = "plant-card";

    // בניית ה-HTML הפנימי של הכרטיסיה
    // שימו לב: אנחנו משתמשים בשדות שמגיעים מה-DB (name, description, image)
    card.innerHTML = `
      <div class="plant-image">
        <img src="${plant.image}" alt="${plant.name}">
      </div>
      <div class="plant-caption">
        <h3>${plant.name}</h3>
        <p>${plant.description}</p>
        <button class="stock-toggle-btn" onclick="openStockModal('${plant.name}')">בדיקת זמינות</button>
      </div>
    `;

    grid.appendChild(card);
  });
}

/* =========================================================
   B) SEARCH FILTER (חיפוש וסינון)
   ========================================================= */

function setupSearch() {
  const input = document.getElementById("plants-search-input");

  if (!input) return;

  input.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase().trim();

    // סינון המערך שיש לנו בזיכרון
    const filtered = allPlants.filter((plant) => 
      plant.name.toLowerCase().includes(term) || 
      plant.description.toLowerCase().includes(term)
    );

    // ציור מחדש של הגריד עם התוצאות המסוננות
    renderGrid(filtered);
  });
}

/* =========================================================
   C) STOCK CHECK - MODAL (בדיקת מלאי מול השרת)
   ========================================================= */

let currentPlantName = ""; // שומר איזה צמח נבחר כרגע

// פונקציה לפתיחת המודל (מוגדרת בחלון הגלובלי כדי שהכפתור ב-HTML יכיר אותה)
window.openStockModal = (plantName) => {
  currentPlantName = plantName;
  const modal = document.getElementById("stock-modal");
  const subtitle = document.getElementById("stock-modal-subtitle");
  const form = document.getElementById("stock-modal-form");
  const resultEl = document.getElementById("stock-modal-result");
  const errorEl = document.getElementById("stock-modal-error");

  subtitle.textContent = `בדיקה עבור: ${plantName}`;
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
  
  // סגירה בלחיצה בחוץ
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
      // שליחת בקשה לשרת עם שם הצמח והכמות
      // שימו לב: זה פונה לנתיב שיצרנו ב-index.js
      const res = await fetch(`/check-plant-stock?name=${currentPlantName}&qty=${qty}`); //
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