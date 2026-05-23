const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 📦 codes
let codes = {};

// 📁 SERVE FRONTEND
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// 📧 EMAIL
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "redzepzenjili26@gmail.com",
        pass: "tlfnfciszphkpvvb"
    }
});

// 🔐 SEND CODE
app.post("/send-code", async (req, res) => {
    const { email, username } = req.body;

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    codes[email] = {
        code,
        username,
        expires: Date.now() + 2 * 60 * 1000
    };

    await transporter.sendMail({
        from: "GameHub",
        to: email,
        subject: "Code",
        text: `Your code: ${code}`
    });

    res.json({ success: true });
});

// ✅ VERIFY
app.post("/verify-code", (req, res) => {
    const { email, code } = req.body;

    if (!codes[email]) return res.json({ success: false });

    if (Date.now() > codes[email].expires) {
        return res.json({ success: false, message: "Expired" });
    }

    if (code === codes[email].code) {
        return res.json({
            success: true,
            username: codes[email].username
        });
    }

    res.json({ success: false, message: "Wrong code" });
});

// 🟢 PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running");
});