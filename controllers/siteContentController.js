const SiteContent = require("../models/SiteContent");

async function getSiteContent(req, res) {
    try {
        const items = await SiteContent.find();

        const data = {};
        items.forEach((item) => {
            data[item.key] = item.value;
        });

        return res.status(200).json(data);
    } catch (error) {
        console.error("Erro ao buscar conteúdo:", error);
        return res.status(500).json({ message: "Erro ao buscar conteúdo" });
    }
}

async function updateSiteContent(req, res) {
    try {
        const updates = req.body;

        const promises = Object.entries(updates).map(async([key, value]) => {
            return SiteContent.findOneAndUpdate({ key }, { key, value }, { new: true, upsert: true });
        });

        await Promise.all(promises);

        return res.status(200).json({ message: "Conteúdo atualizado com sucesso" });
    } catch (error) {
        console.error("Erro ao atualizar conteúdo:", error);
        return res.status(500).json({ message: "Erro ao atualizar conteúdo" });
    }
}

module.exports = {
    getSiteContent,
    updateSiteContent
};