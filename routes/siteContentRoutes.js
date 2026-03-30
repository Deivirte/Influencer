const express = require("express");
const authMiddleware = require("../middleware/auth");
const {
    getSiteContent,
    updateSiteContent
} = require("../controllers/siteContentController");

const router = express.Router();

router.get("/", getSiteContent);
router.put("/", authMiddleware, updateSiteContent);

module.exports = router;