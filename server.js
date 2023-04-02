const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
require('./config/db');
const userRouter = require('./router/userRoute');
const cardRouter = require('./router/cardRouter');
const bankRouter = require('./router/bankRouter');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use([userRouter,cardRouter,bankRouter])

app.listen(port, () => {
  console.log(`Our Server is running at port ${port}`);
});
