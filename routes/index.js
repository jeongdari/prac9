var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({ unit: 'IFN666' });
});

router.get("/books", (req, res) => {
  const books = [
    { title: "To Kill a Mockingbird", author: "Harper Lee" },
    { title: "1984", author: "George Orwell" },
    { title: "Pride and Prejudice", author: "Jane Austen" },
  ];
  res.json(books);
});

router.get("/books/:title", (req, res) => {
  const title = req.params.title;
  res.send(`You requested information about the book with title: ${title}`);
});

router.get("/books/store/buy", (req, res) => {
  const order = req.query.order || "asc";
  // You could use the order value to sort and retrieve books accordingly
  res.send(`Listing books in ${order}ending order`);
});

router.get("/api/city", async (req, res) => {
  try {
    const cities = await req.db.from("city").select("name", "district");
    res.json({ error: false, cities });
  } catch (error) {
    res.json({ error: true, message: error });
  }
});

router.get("/api/city/:CountryCode", async (req, res) => {
  try {
    const cities = await req.db
      .from("city")
      .select("name", "district")
      .where("CountryCode", req.params.CountryCode);
    res.json({ error: false, cities });
  } catch (error) {
    res.json({ error: true, message: error });
  }
});

module.exports = router;
