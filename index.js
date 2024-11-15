const authMiddleware = require("./middlewares/authMiddleware");
const express = require("express");
const cors = require("cors");
const router = require("./routes");
const app = express();
const port = process.env.port || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authMiddleware);
app.use(router);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
