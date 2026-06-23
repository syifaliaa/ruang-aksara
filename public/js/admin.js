let editId = null;

/* =========================
   LOAD BUKU
========================= */
async function loadBooks() {
    const res = await fetch("/api/books");
    const books = await res.json();

    const list = document.getElementById("list");
    list.innerHTML = "";

    books.forEach(b => {
        list.innerHTML += `
            <div class="card">
                <img src="${b.image}" width="100" style="display:block; margin-bottom:10px;">

                <h3>${b.title}</h3>
                <p>Penulis : ${b.author}</p>
                <p>Genre : ${b.genre}</p>
                <p>Status : ${b.status}</p>

                <button onclick="hapus(${b.id})">
                    Hapus
                </button>

                <button onclick='openEdit(${JSON.stringify(b)})'>
                    Edit
                </button>
            </div>
        `;
    });
}

/* =========================
   HAPUS BUKU
========================= */
async function hapus(id) {
    await fetch("/api/books/" + id, {
        method: "DELETE"
    });

    loadBooks();
    loadBookSelect();
}

/* =========================
   BUKA EDIT
========================= */
function openEdit(book) {

    editId = book.id;

    document.getElementById("editBox").style.display = "block";

    document.getElementById("editTitle").value = book.title;
    document.getElementById("editAuthor").value = book.author;
    document.getElementById("editGenre").value = book.genre;
    document.getElementById("editDesc").value = book.description;
}

/* =========================
   SIMPAN EDIT
========================= */
async function saveEdit() {

    await fetch("/api/books/" + editId, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: editTitle.value,
            author: editAuthor.value,
            genre: editGenre.value,
            description: editDesc.value
        })
    });

    document.getElementById("editBox").style.display = "none";

    loadBooks();
    loadBookSelect();
}

/* =========================
   TAMBAH BUKU (UPLOAD GAMBAR FIX)
========================= */
document.getElementById("form").addEventListener("submit", async (e) => {

    e.preventDefault();

    const formData = new FormData(e.target);

    const res = await fetch("/api/books", {
        method: "POST",
        body: formData   // 🔥 WAJIB FORM DATA
    });

    const data = await res.json();
    console.log("UPLOAD RESULT:", data);

    e.target.reset();

    loadBooks();
    loadBookSelect();
});

/* =========================
   LOAD SELECT BUKU
========================= */
async function loadBookSelect() {

    const res = await fetch("/api/books");
    const books = await res.json();

    const select = document.getElementById("bookSelect");

    if (!select) return;

    select.innerHTML = "";

    books
        .filter(b => b.status === "Tersedia")
        .forEach(b => {

            select.innerHTML += `
                <option value="${b.id}">
                    ${b.title}
                </option>
            `;

        });

}

/* =========================
   INPUT PEMINJAMAN
========================= */
document.getElementById("loanForm")?.addEventListener("submit", async (e) => {

    e.preventDefault();

    const data = Object.fromEntries(
        new FormData(e.target)
    );

    await fetch("/api/loans", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    e.target.reset();

    loadBooks();
    loadBookSelect();
    loadLoans();
    loadLateLoans();
});

/* =========================
   LOAD PEMINJAMAN
========================= */
async function loadLoans() {

    const res = await fetch("/api/loans");
    const loans = await res.json();

    const list = document.getElementById("loanList");

    if (!list) return;

    list.innerHTML = "";

    loans.forEach(l => {

        list.innerHTML += `
        <div class="card">

            <h3>${l.borrower}</h3>

            <p>No HP : ${l.phone}</p>
            <p>Alamat : ${l.address}</p>
            <p>Buku : ${l.bookTitle}</p>
            <p>Tanggal Pinjam : ${l.borrowDate}</p>

            <button onclick="returnBook(${l.id})">
                Kembalikan
            </button>

        </div>
        `;
    });
}

/* =========================
   PENGEMBALIAN
========================= */
async function returnBook(id) {

    await fetch("/api/return/" + id, {
        method: "PUT"
    });

    loadBooks();
    loadBookSelect();
    loadLoans();
    loadLateLoans();
}

/* =========================
   KETERLAMBATAN > 7 HARI
========================= */
async function loadLateLoans() {

    const res = await fetch("/api/late");
    const data = await res.json();

    const lateList = document.getElementById("lateList");

    if (!lateList) return;

    lateList.innerHTML = "";

    data.forEach(l => {

        const pesan =
            "Halo, buku yang Anda pinjam sudah melewati batas waktu. Mohon segera dikembalikan.";

        const wa =
            `https://wa.me/${l.phone}?text=${encodeURIComponent(pesan)}`;

        lateList.innerHTML += `
        <div class="card">

            <h3>${l.borrower}</h3>
            <p>Buku : ${l.bookTitle}</p>
            <p>No HP : ${l.phone}</p>
            <p>Terlambat ${l.daysLate} hari</p>

            <a href="${wa}" target="_blank">
                Kirim WhatsApp
            </a>

        </div>
        `;
    });
}

/* =========================
   LOAD AWAL
========================= */
loadBooks();
loadBookSelect();
loadLoans();
loadLateLoans();