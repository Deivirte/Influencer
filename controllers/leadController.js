const Lead = require("../models/Lead");

async function createLead(req, res) {
    try {
        const { nome, telefone } = req.body;

        if (!nome || !telefone) {
            return res.status(400).json({ message: "Nome e telefone são obrigatórios" });
        }

        const lead = await Lead.create({ nome, telefone });

        return res.status(201).json({
            message: "Lead salvo com sucesso",
            lead
        });
    } catch (error) {
        console.error("Erro ao salvar lead:", error);
        return res.status(500).json({ message: "Erro ao salvar lead" });
    }
}

module.exports = { createLead };