require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 📦 codes storage
let codes = {};

// 📁 FRONTEND (login page)
app.get("/", (req, res) => {
    res.send(`
    <h2>Login System API is running 🚀</h2>
    <p>Use /send-code and /verify-code</p>
    `);
});

// 📧 EMAIL TRANSPORT (FIXED SMTP)
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// 🔐 SEND CODE
app.post("/send-code", async (req, res) => {
    const { email, username } = req.body;

    if (!email) {
        return res.json({ success: false, message: "Email missing" });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    codes[email] = {
        code,
        username,
        expires: Date.now() + 2 * 60 * 1000
    };

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your Login Code",
            text: `Your login code is: ${code}`
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

    const data = codes[email];

    if (Date.now() > data.expires) {
        return res.json({ success: false, message: "Code expired" });
    }

    if (code === data.code) {
        return res.json({
            success: true,
            username: data.username
        });
    }

    res.json({ success: false, message: "Wrong code" });
});

// 🟢 PORT (RENDER FIX)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});