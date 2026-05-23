async function sendCode() {
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;

    const res = await fetch("http://localhost:3000/send-code", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, username })
    });

    const data = await res.json();

    if (data.success) {
        alert("Code sent!");
        localStorage.setItem("email", email);
        window.location.href = "verify.html";
    } else {
        alert("Error sending email");
    }
}