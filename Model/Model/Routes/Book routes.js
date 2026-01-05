const express = require("express");
const Book = require("../models/Book");

const router = express.Router();


// 1️⃣ INSERT – Minimum 7 Books
router.post("/seed", async (req, res, next) => {
    try {
        const books = await Book.insertMany([
            { title: "Node Basics", author: "John", category: "Programming", publishedYear: 2018, availableCopies: 5 },
            { title: "MongoDB Guide", author: "Anna", category: "Database", publishedYear: 2016, availableCopies: 3 },
            { title: "Express JS", author: "Mark", category: "Programming", publishedYear: 2019, availableCopies: 4 },
            { title: "Clean Code", author: "Robert", category: "Software", publishedYear: 2008, availableCopies: 2 },
            { title: "JavaScript Deep", author: "Kyle", category: "Programming", publishedYear: 2020, availableCopies: 6 },
            { title: "Python AI", author: "Andrew", category: "AI", publishedYear: 2021, availableCopies: 1 },
            { title: "Web Design", author: "Steve", category: "Design", publishedYear: 2014, availableCopies: 3 }
        ]);
        res.json(books);
    } catch (err) {
        next(err);
    }
});


// 2️⃣ READ – All Books
router.get("/", async (req, res, next) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        next(err);
    }
});


// 📘 Books by Category
router.get("/category/:category", async (req, res, next) => {
    try {
        const books = await Book.find({ category: req.params.category });
        res.json(books);
    } catch (err) {
        next(err);
    }
});


// 📅 Books after year 2015
router.get("/after/2015", async (req, res, next) => {
    try {
        const books = await Book.find({ publishedYear: { $gt: 2015 } });
        res.json(books);
    } catch (err) {
        next(err);
    }
});


// 3️⃣ UPDATE – Increase / Decrease Copies
router.put("/copies/:id", async (req, res, next) => {
    try {
        const { change } = req.body; // +1 or -1
        const book = await Book.findById(req.params.id);

        if (!book) throw new Error("Book not found");

        if (book.availableCopies + change < 0)
            throw new Error("Negative stock not allowed");

        book.availableCopies += change;
        await book.save();

        res.json(book);
    } catch (err) {
        next(err);
    }
});


// ✏️ Change Category
router.put("/category/:id", async (req, res, next) => {
    try {
        const book = await Book.findByIdAndUpdate(
            req.params.id,
            { category: req.body.category },
            { new: true }
        );

        if (!book) throw new Error("Book not found");

        res.json(book);
    } catch (err) {
        next(err);
    }
});


// 4️⃣ DELETE – Remove book if copies = 0
router.delete("/:id", async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) throw new Error("Book not found");

        if (book.availableCopies !== 0)
            throw new Error("Cannot delete book with available copies");

        await book.deleteOne();
        res.json({ message: "Book removed successfully" });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
