document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(
        new FormData(e.target)
    );

    try {
        const res = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (result.success) {
            localStorage.setItem("isAdmin", "true"); // ← tambah ini
            document.getElementById("msg").innerText =
                "Login berhasil...";
            window.location.href = "/admin";
        } else {
            document.getElementById("msg").innerText =
                "Username atau password salah!";
        }
    } catch (err) {
        document.getElementById("msg").innerText =
            "Terjadi kesalahan.";
    }
});
