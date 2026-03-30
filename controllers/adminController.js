const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

async function loginAdmin(req, res) {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ message: "Email e senha são obrigatórios" });
        }

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        const senhaCorreta = await bcrypt.compare(senha, admin.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        const token = jwt.sign({
                id: admin._id,
                email: admin.email
            },
            process.env.JWT_SECRET, { expiresIn: "7d" }
        );

        return res.status(200).json({
            message: "Login realizado com sucesso",
            token
        });
    } catch (error) {
        console.error("Erro no login:", error);
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
}

module.exports = { loginAdmin };