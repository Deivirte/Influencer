const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Admin = require("./models/Admin");

async function seedAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        await Admin.deleteMany({});

        const senhaHash = await bcrypt.hash("!Umdois2", 10);

        await Admin.create({
            email: "devschotan@gmail.com",
            senha: senhaHash
        });

        console.log("✅ Admin criado com sucesso");
        console.log("Email: devschotan@gmail.com");
        console.log("Senha: !Umdois2");

        process.exit();
    } catch (error) {
        console.error("Erro:", error);
        process.exit(1);
    }
}

seedAdmin();