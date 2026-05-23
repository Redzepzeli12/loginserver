const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 📦 codes storage
let codes = {};

// 📧 EMAIL TRANSPORT (DIRECT SETUP)
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

    if (!email) {
        return res.json({ success: false, message: "Email is required" });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    codes[email] = {
        code,
        username,
        expires: Date.now() + 2 * 60 * 1000 // 2 min
    };

    try {
        await transporter.sendMail({
            from: "GameHub",
            to: email,
            subject: "Your Login Code",
            text: `Your login code is: ${code}`
        });

        res.json({ success: true, message: "Code sent" });
    } catch (err) {
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
            message: "Login successful",
            username: data.username
        });
    } else {
        return res.json({ success: false, message: "Wrong code" });
    }
});

// 🟢 START SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});