const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 📦 codes storage
let codes = {};

// 📁 HOME
app.get("/", (req, res) => {
    res.send("Login API running 🚀");
});

// 📧 EMAIL (DIRECT - no env)
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
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

    try {
        await transporter.sendMail({
            from: "GameHub",
            to: email,
            subject: "Your Login Code",
            text: `Your code is: ${code}`
        });

        console.log("Email sent to:", email);

        res.json({ success: true });
    } catch (err) {
        console.log("EMAIL ERROR:", err);
        res.json({ success: false, error: err.message });
    }
});

// ✅ VERIFY CODE
app.post("/verify-code", (req, res) => {
    const { email, code } = req.body;

    if (!codes[email]) {
        return res.json({ success: false, message: "No code found" });
    }

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

// 🟢 START SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
