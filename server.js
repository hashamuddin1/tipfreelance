const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
require('./config/db');
const userRouter = require('./router/userRoute');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use([userRouter])

app.listen(port, () => {
  console.log(`Our Server is running at port ${port}`);
});
