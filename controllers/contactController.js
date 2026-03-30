const Contact = require("../models/Contact");

async function createContact(req, res) {
    try {
        const { nome, telefone, email, interesse, mensagem } = req.body;

        if (!nome || !telefone || !email || !interesse) {
            return res.status(400).json({
                message: "Nome, telefone, e-mail e interesse são obrigatórios"
            });
        }

        const contact = await Contact.create({
            nome,
            telefone,
            email,
            interesse,
            mensagem: mensagem || ""
        });

        return res.status(201).json({
            message: "Mensagem enviada com sucesso",
            contact
        });
    } catch (error) {
        console.error("Erro ao salvar contato:", error);
        return res.status(500).json({
            message: "Erro ao salvar contato"
        });
    }
}

module.exports = { createContact };