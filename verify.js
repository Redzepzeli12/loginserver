async function verifyCode() {
    const code = document.getElementById("code").value;
    const email = localStorage.getItem("email");

    const res = await fetch("http://localhost:3000/send-code", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, code })
    });

    const data = await res.json();

    if (data.success) {
        localStorage.setItem("username", data.username);
        window.location.href = "lobby.html";
    } else {
        alert(data.message);
    }
}