const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const uploadRoutes = require("./routes/uploadRoutes");

dotenv.config();

const connectDB = require("./config/db");

const adminRoutes = require("./routes/adminRoutes");
const siteContentRoutes = require("./routes/siteContentRoutes");
const leadRoutes = require("./routes/leadRoutes");
const contactRoutes = require("./routes/contactRoutes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public")); // 👈 antes de tudo

app.use("/uploads", express.static("uploads"));

app.use("/api/admin", adminRoutes);
app.use("/api/site-content", siteContentRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/upload", uploadRoutes);


const PORT = process.env.PORT || 10000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});