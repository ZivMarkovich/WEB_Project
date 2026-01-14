document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");
    const phoneInput = document.getElementById("phone");
    const descInput = document.getElementById("description");
    const descCounter = document.getElementById("desc-counter");

    // 1. מניעת אותיות בשדה הטלפון
    if (phoneInput) {
        phoneInput.addEventListener("input", (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    // 2. מונה תווים לתיאור
    if (descInput && descCounter) {
        descInput.addEventListener("input", () => {
            const currentLength = descInput.value.length;
            const maxLength = descInput.getAttribute("maxlength") || 500;
            descCounter.textContent = `${currentLength} / ${maxLength}`;
        });
    }

    // 3. שליחת הטופס
    if (form) {
        form.addEventListener("submit", async (e) => {
            // הפקודה עוצרת את המעבר לעמוד חדש
            e.preventDefault();

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            // הגדרת משתנים חסרים 
            const submitBtn = form.querySelector(".cta-button");
            const originalText = submitBtn.textContent;
            const url = form.getAttribute("action");
            const method = form.getAttribute("method") || "POST";

            // איסוף הנתונים לתוך משתנה data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // שינוי ויזואלי התחלתי
            submitBtn.textContent = "שולח...";
            submitBtn.disabled = true;

            try {
                // שימוש ב-Fetch לשליחה שקטה מאחורי הקלעים
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    // הצלחה - שינוי הכפתור והישארות בדף
                    submitBtn.textContent = "הפנייה נשלחה בהצלחה! נחזור אליכם בהקדם 🌿";
                    submitBtn.style.backgroundColor = "#4CAF50";
                    submitBtn.style.color = "white";
                    form.reset();
                    if (descCounter) descCounter.textContent = "0 / 500";
                } else {
                    throw new Error("שגיאת שרת");
                }
            } catch (error) {
                console.error("Error:", error);
                submitBtn.textContent = "שגיאה בשליחה. נסה שוב.";
                submitBtn.style.backgroundColor = "#f44336";
            } finally {
                // החזרת הכפתור למצב רגיל אחרי 5 שניות בכל מקרה
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.backgroundColor = "";
                    submitBtn.style.color = "";
                    submitBtn.disabled = false;
                }, 5000);
            }
        });
    }
});