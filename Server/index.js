const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const port = 3000;

// הגדרת Middleware לעיבוד בקשות 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// הגדרת הגישה לקבצי הלקוח (תמונות, CSS, JS)
app.use('/Client', express.static(path.join(__dirname, '../Client')));

// נתיב ראשי לדף הבית
app.get('/', (req, res) => {
    // השרת יוצא מתיקיית Server ושולח את הקובץ מתיקיית Client
    res.sendFile(path.join(__dirname, "../Client/homePage/homePage.html"));
});

// נתיב לדף אודות 
app.get('/aboutUs', (req, res) => {
    res.sendFile(path.join(__dirname, "../Client/aboutUs/aboutUs.html"));
});

// נתיב לדף שירותים
app.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, "../Client/services/services.html"));
});

// נתיב לדף צור קשר
app.get('/contactUs', (req, res) => {
    res.sendFile(path.join(__dirname, "../Client/contactUs/contactUs.html"));
});

// נתיב לדף אביזרים
app.get('/accessories', (req, res) => {
    res.sendFile(path.join(__dirname, "../Client/accessories/accessories.html"));
});

// נתיב לדף כלי גינון
app.get('/gardenTools', (req, res) => {
    res.sendFile(path.join(__dirname, "../Client/gardenTools/gardenTools.html"));
});

// נתיב לדף צמחים
app.get('/plants', (req, res) => {
    res.sendFile(path.join(__dirname, "../Client/plants/plants.html"));
});

const CRUD = require("./CRUD_functions");

// נתיבי ה-API לשליפת הנתונים
app.get('/getPlants', CRUD.getAllPlants);
app.get('/getTools', CRUD.getAllTools);
app.get('/getAccessories', CRUD.getAllAccessories);
//  לבדיקת מלאי
app.get('/check-plant-stock', CRUD.checkPlantStock);
app.get('/check-tool-stock', CRUD.checkToolStock);
app.get('/check-accessory-stock', CRUD.checkAccessoryStock);
app.post('/contact-submit', CRUD.createNewInquiry); //

// הפעלת השרת
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});