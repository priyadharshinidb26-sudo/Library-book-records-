const express = require("express");
const mongoose = require("mongoose");
const bookRoutes = require("./routes/bookRoutes");

const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/libraryDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error(err));

// Routes
app.use("/api/books", bookRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    res.status(400).json({ error: err.message });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
