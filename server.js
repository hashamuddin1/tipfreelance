const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
require('./config/db');
const router = require('./router/route')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use([router])

app.listen(port, () => {
  console.log(`Our Server is running at port ${port}`);
});
