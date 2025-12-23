document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector(".contact-form");
    const descriptionInput = document.getElementById("description");
    const counterEl = document.getElementById("desc-counter");
    const fileInput = document.getElementById("upload-image");
    const imagePreview = document.getElementById("image-preview");
    const successBox = document.getElementById("form-success-message");
    const phoneInput = document.getElementById("phone");
    const MAX_DESC_LENGTH = 500;


    // Updates the live character counter for the description textarea
    function updateCounter() {
        const length = descriptionInput.value.length;
        counterEl.textContent = `${length}/${MAX_DESC_LENGTH} תווים`;
    }


    // Update counter on each input + initial render
    descriptionInput.addEventListener("input", updateCounter);
    updateCounter();


    // Force numeric-only input in phone field (extra safety beyond HTML pattern)
    phoneInput.addEventListener("input", () => {
        phoneInput.value = phoneInput.value.replace(/\D/g, "");
    });


    // Image preview handling for uploaded file
    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];


        // Reset preview if no file selected
        if (!file) {
            imagePreview.style.display = "none";
            imagePreview.src = "";
            return;
        }


        // Guard against non-image files
        if (!file.type.startsWith("image/")) {
            alert("ניתן להעלות קובצי תמונה בלבד");
            fileInput.value = "";
            imagePreview.style.display = "none";
            imagePreview.src = "";
            return;
        }


        // Read image as Data URL for client-side preview
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreview.style.display = "block";
        };
        reader.readAsDataURL(file);
    });


    // Submit handling
    form.addEventListener("submit", (e) => {
        e.preventDefault();


        // Leverage native browser validation rules
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const submitBtn = form.querySelector(".cta-button");

        submitBtn.textContent = "הפנייה נשלחה בהצלחה! נחזור אליכם בהקדם 🌿";


        // Lock button to prevent double submission
        submitBtn.disabled = true;
        submitBtn.style.backgroundColor = "var(--olive-green)";
        submitBtn.style.cursor = "default";


        // Reset form state after successful submission
        form.reset();
        imagePreview.src = "";
        imagePreview.style.display = "none";
        updateCounter();


        // Ensure any static success box remains hidden (defensive)
        if (successBox) {
            successBox.style.display = "none";
        }
    });
});



