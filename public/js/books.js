let books = [];

async function loadBooks() {

    const res = await fetch("/api/books");

    books = await res.json();

    applyFilter();

}


function renderBooks(data) {

    const container = document.getElementById("bookList");

    container.innerHTML = "";

    if (data.length === 0) {

        container.innerHTML = `
            <h3>Tidak ada buku ditemukan.</h3>
        `;

        return;
    }

    data.forEach(book => {

        container.innerHTML += `

            <div class="card">

                <img
                    src="${book.image}"
                    class="book-image"
                >

                <h3>${book.title}</h3>

                <p>
                    <b>Penulis :</b>
                    ${book.author}
                </p>

                <p>
                    <b>Genre :</b>
                    ${book.genre}
                </p>

                <p>
                    <b>Status :</b>
                    ${book.status}
                </p>

                <a href="/detail?id=${book.id}">
                    Lihat Detail
                </a>

            </div>

        `;

    });

}


/* FILTER UTAMA */

function applyFilter() {

    const keyword =
        document
        .getElementById("search")
        .value
        .toLowerCase();

    const genre =
        document
        .getElementById("filter")
        .value;

    const status =
        document
        .getElementById("statusFilter")
        .value;


    let filtered = books;


    /* SEARCH */

    filtered = filtered.filter(b =>

        b.title.toLowerCase().includes(keyword)

        ||

        b.author.toLowerCase().includes(keyword)

    );


    /* FILTER GENRE */

    if (genre) {

        filtered = filtered.filter(b =>

            b.genre === genre

        );

    }


    /* FILTER STATUS */

    if (status) {

        filtered = filtered.filter(b =>

            b.status === status

        );

    }

    renderBooks(filtered);

}


/* SEARCH */

document
.getElementById("search")
.addEventListener(
    "input",
    applyFilter
);


/* FILTER GENRE */

document
.getElementById("filter")
.addEventListener(
    "change",
    applyFilter
);


/* FILTER STATUS */

document
.getElementById("statusFilter")
.addEventListener(
    "change",
    applyFilter
);


/* LOAD AWAL */

loadBooks();