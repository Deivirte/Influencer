const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function(req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});

const upload = multer({ storage });

router.post("/", upload.single("imagem"), function(req, res) {
    const url = "http://localhost:3001/uploads/" + req.file.filename;

    res.json({ url });
});

module.exports = router;