const id = new URLSearchParams(location.search).get("id");

async function loadDetail() {

    const res = await fetch("/api/books/" + id);

    const book = await res.json();

    document.getElementById("detail").innerHTML = `

        <img
            src="${book.image}"
            class="detail-image"
        >

        <h2>${book.title}</h2>

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

        <p>
            ${book.description}
        </p>

    `;

}

loadDetail();