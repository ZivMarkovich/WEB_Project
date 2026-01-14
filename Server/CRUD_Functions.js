const sql = require("./db");

/* =========================================================
   צמחים
 ========================================================= */

// 1. שליפת כל הצמחים
const getAllPlants = (req, res) => {
    sql.query("SELECT * FROM plants", (err, results) => {
        if (err) {
            console.log("error: ", err);
            res.status(500).send("שגיאה בשליפת צמחים");
            return;
        }
        res.send(results);
    });
};

// 2. בדיקת זמינות מלאי
const checkPlantStock = (req, res) => {
    const plantName = req.query.name;
    const requestedQty = parseInt(req.query.qty);

    sql.query("SELECT stock_quantity FROM plants WHERE name = ?", [plantName], (err, results) => {
        if (err || results.length === 0) return res.status(500).send("Product not found");

        const available = results[0].stock_quantity >= requestedQty;
        res.send({ available: available, stock: results[0].stock_quantity });
    });
};


/* =========================================================
   כלי גינון
========================================================= */

// 2. שליפת כל כלי הגינון
const getAllTools = (req, res) => {
    sql.query("SELECT * FROM gardenTools", (err, results) => {
        if (err) {
            console.log("error: ", err);
            res.status(500).send("שגיאה בשליפת כלי עבודה");
            return;
        }
        res.send(results);
    });
};

// 2. בדיקת מלאי כלי גינון
const checkToolStock = (req, res) => {
    const toolName = req.query.name;
    const requestedQty = parseInt(req.query.qty);

    sql.query("SELECT stock_quantity FROM gardenTools WHERE name = ?", [toolName], (err, results) => {
        if (err || results.length === 0) return res.status(500).send("Product not found");

        const available = results[0].stock_quantity >= requestedQty;
        res.send({ available: available, stock: results[0].stock_quantity });
    });
};

/* =========================================================
   מוצרים נלווים
 ========================================================= */

// 3. שליפת כל האביזרים
const getAllAccessories = (req, res) => {
    sql.query("SELECT * FROM accessories", (err, results) => {
        if (err) {
            console.log("error: ", err);
            res.status(500).send("שגיאה בשליפת אביזרים");
            return;
        }
        res.send(results);
    });
};

// 3. בדיקת מלאי אביזרים
const checkAccessoryStock = (req, res) => {
    const accName = req.query.name;
    const requestedQty = parseInt(req.query.qty);

    sql.query("SELECT stock_quantity FROM accessories WHERE name = ?", [accName], (err, results) => {
        if (err || results.length === 0) return res.status(500).send("Product not found");

        const available = results[0].stock_quantity >= requestedQty;
        res.send({ available: available, stock: results[0].stock_quantity });
    });
};

/* =========================================================
   פניות
  ========================================================= */

const createNewInquiry = (req, res) => {
    // 1. בדיקה שהגיעו נתונים מהטופס
    if (!req.body) {
        res.status(400).send({ message: "התוכן לא יכול להיות ריק" });
        return;
    }

    // 2. יצירת האובייקט לשמירה 
    const newInquiry = {
        full_name: req.body.full_name,
        email: req.body.email,
        phone: req.body.phone,
        service: req.body.service,
        address: req.body.address,
        garden_size: req.body.garden_size,
        description: req.body.description,
        availability: req.body.availability
    };

    // 3. שאילתת SQL לשמירת הנתונים
    sql.query("INSERT INTO INQUIRIES SET ?", newInquiry, (err, mysqlRes) => {
        if (err) {
            console.log("error: ", err);
            // אם יש שגיאה, מחזירים הודעה ללקוח
            res.status(500).send({ message: "שגיאה בשמירת הפנייה: " + err.sqlMessage });
            return;
        }
        console.log("נוצרה פנייה חדשה, מזהה:", mysqlRes.insertId);
        res.send({ message: "הפנייה נשלחה בהצלחה!", id: mysqlRes.insertId });
    });
};

// ייצוא של כל הפונקציות יחד
module.exports = {
    getAllPlants,
    getAllTools,
    getAllAccessories,
    checkPlantStock,
    checkToolStock,
    checkAccessoryStock,
    createNewInquiry
};