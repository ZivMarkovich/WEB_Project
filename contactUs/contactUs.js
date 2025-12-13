// מוודא שהקוד ירוץ רק אחרי שה-DOM נטען
document.addEventListener("DOMContentLoaded", () => {


    // אלמנטים עיקריים מהטופס
    const form = document.querySelector(".contact-form");
    const descriptionInput = document.getElementById("description");
    const counterEl = document.getElementById("desc-counter");
    const fileInput = document.getElementById("upload-image");
    const imagePreview = document.getElementById("image-preview");
    const successBox = document.getElementById("form-success-message"); // הודעת הצלחה קיימת ב-HTML (כרגע מוסתרת)
    const phoneInput = document.getElementById("phone");
    const MAX_DESC_LENGTH = 500;


    // פונקציה שמעדכנת את מונה התווים בתיאור
    function updateCounter() {
        const length = descriptionInput.value.length;
        counterEl.textContent = `${length}/${MAX_DESC_LENGTH} תווים`;
    }


    // עדכון המונה בכל הקלדה + אתחול בעת טעינה
    descriptionInput.addEventListener("input", updateCounter);
    updateCounter();


    // מניעת הקלדת תווים לא מספריים בשדה הטלפון (משאיר רק ספרות)
    phoneInput.addEventListener("input", () => {
        phoneInput.value = phoneInput.value.replace(/\D/g, "");
    });


    // תצוגה מקדימה של התמונה שנבחרה בשדה הקובץ
    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];


        // אם לא נבחר קובץ – מסתירים את התצוגה המקדימה
        if (!file) {
            imagePreview.style.display = "none";
            imagePreview.src = "";
            return;
        }


        // בדיקה שהקובץ הוא מסוג תמונה
        if (!file.type.startsWith("image/")) {
            alert("ניתן להעלות קובצי תמונה בלבד");
            fileInput.value = "";
            imagePreview.style.display = "none";
            imagePreview.src = "";
            return;
        }


        // קריאת הקובץ והצגה שלו כ-preview
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreview.style.display = "block";
        };
        reader.readAsDataURL(file);
    });


    // טיפול באירוע שליחת הטופס
    form.addEventListener("submit", (e) => {
        e.preventDefault();


        // שימוש בולידציה המובנית של הדפדפן (required, type, pattern)
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }


        // בחירת כפתור השליחה
        const submitBtn = form.querySelector(".cta-button");


        // שינוי טקסט הכפתור להודעת הצלחה
        submitBtn.textContent = "הפנייה נשלחה בהצלחה! נחזור אליכם בהקדם 🌿";


        // כיבוי הכפתור כדי למנוע שליחה חוזרת
        submitBtn.disabled = true;
        submitBtn.style.backgroundColor = "var(--olive-green)";
        submitBtn.style.cursor = "default";


        // איפוס הטופס אחרי שליחה
        form.reset();
        imagePreview.src = "";
        imagePreview.style.display = "none";
        updateCounter();


        // ליתר ביטחון – דואגים שהקופסת הצלחה ב-HTML תישאר מוסתרת
        if (successBox) {
            successBox.style.display = "none";
        }
    });
});



