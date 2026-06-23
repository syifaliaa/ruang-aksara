const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

/* ================= MULTER UPLOAD ================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/* ================= DATA ================= */

let novels = [
  {
    id: 1,
    title: "Laskar Pelangi",
    author: "Andrea Hirata",
    genre: "Drama",
    status: "Tersedia",
    description: "Novel inspiratif",
    image: "/images/laskar.jpg"
  },
  {
    id: 2,
    title: "Bumi",
    author: "Tere Liye",
    genre: "Fantasi",
    status: "Tersedia",
    description: "Petualangan dunia paralel",
    image: "/images/bumi.jpg"
  }
];

let loans = [];

/* ================= PAGE ROUTES ================= */

app.get("/", (req, res) =>
  res.sendFile(__dirname + "/views/index.html")
);

app.get("/books", (req, res) =>
  res.sendFile(__dirname + "/views/books.html")
);

app.get("/detail", (req, res) =>
  res.sendFile(__dirname + "/views/detail.html")
);

app.get("/login", (req, res) =>
  res.sendFile(__dirname + "/views/login.html")
);

app.get("/admin", (req, res) =>
  res.sendFile(__dirname + "/views/admin.html")
);

/* ================= BOOK API ================= */

/* GET ALL BOOKS */
app.get("/api/books", (req, res) => {
  res.json(novels);
});

/* GET BOOK BY ID */
app.get("/api/books/:id", (req, res) => {
  const book = novels.find(b => b.id == req.params.id);
  res.json(book);
});

/* ADD BOOK (UPLOAD IMAGE) */
app.post("/api/books", upload.single("image"), (req, res) => {

  const book = {
    id: Date.now(),
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    description: req.body.description,
    status: "Tersedia",

    image: req.file
      ? "/uploads/" + req.file.filename
      : "/images/default.jpg"
  };

  novels.push(book);

  res.json(book);
});

/* UPDATE BOOK */
app.put("/api/books/:id", (req, res) => {

  const id = Number(req.params.id);

  novels = novels.map(book => {
    if (book.id === id) {
      return {
        ...book,
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        description: req.body.description
      };
    }
    return book;
  });

  res.json({ success: true });
});

/* DELETE BOOK */
app.delete("/api/books/:id", (req, res) => {

  novels = novels.filter(b => b.id != req.params.id);

  res.json({ success: true });
});

/* ================= LOGIN ================= */

app.post("/api/login", (req, res) => {

  if (
    req.body.username === "admin" &&
    req.body.password === "admin123"
  ) {
    return res.json({ success: true });
  }

  res.json({ success: false });
});

/* ================= LOAN FROM DETAIL ================= */

app.post("/api/loan", (req, res) => {

  const book = novels.find(b => b.id == req.body.bookId);

  if (!book || book.status === "Dipinjam") {
    return res.json({ success: false });
  }

  book.status = "Dipinjam";

  loans.push({
    id: Date.now(),
    bookId: Number(req.body.bookId),
    borrower: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
    borrowDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // TESTING: 8 hari lalu — ganti ke new Date() setelah selesai testing
    returned: false
  });

  res.json({ success: true });
});

/* ================= LOAN FROM ADMIN ================= */

app.post("/api/loans", (req, res) => {

  const book = novels.find(b => b.id == req.body.bookId);

  if (!book || book.status === "Dipinjam") {
    return res.json({ success: false });
  }

  book.status = "Dipinjam";

  loans.push({
    id: Date.now(),
    bookId: Number(req.body.bookId),
    borrower: req.body.borrower,
    phone: req.body.phone,
    address: req.body.address,
    borrowDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // TESTING: 8 hari lalu — ganti ke new Date() setelah selesai testing
    returned: false
  });

  res.json({ success: true });
});

/* ================= LOAN LIST ================= */

app.get("/api/loans", (req, res) => {

  const result = loans
    .filter(l => !l.returned)
    .map(l => {

      const book = novels.find(b => b.id == l.bookId);

      return {
        ...l,
        bookTitle: book ? book.title : "-"
      };

    });

  res.json(result);
});

/* ================= RETURN BOOK ================= */

app.put("/api/return/:id", (req, res) => {

  const loan = loans.find(l => l.id == req.params.id);

  if (loan) {
    loan.returned = true;

    const book = novels.find(b => b.id == loan.bookId);

    if (book) {
      book.status = "Tersedia";
    }
  }

  res.json({ success: true });
});

/* ================= LATE LOANS (>7 DAYS) ================= */

app.get("/api/late", (req, res) => {

  const now = new Date();

  const lateLoans = loans
    .filter(l => !l.returned)
    .map(l => {

      const book = novels.find(b => b.id == l.bookId);

      const daysLate = Math.floor(
        (now - new Date(l.borrowDate)) /
        (1000 * 60 * 60 * 24)
      );

      return {
        ...l,
        bookTitle: book ? book.title : "-",
        daysLate
      };
    })
    .filter(l => l.daysLate > 7);

  res.json(lateLoans);
});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Ruang Aksara berjalan di http://localhost:${PORT}`);
});