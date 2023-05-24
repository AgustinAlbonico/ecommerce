const express = require("express");
const app = express();
let bodyParser = require("body-parser");
const { dbConnect } = require("./config/dbConnect");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");

const routes = require("./routes/index");
const { notFound, errorHandler } = require("./middleware/errorHandler");

dbConnect();

const port = process.env.PORT || 8000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cookieParser());
app.use(cors());
app.use(morgan("dev"));

//RUTAS
app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log("Server corriendo en el puerto: " + port);
});
