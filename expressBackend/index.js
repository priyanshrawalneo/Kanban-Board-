const express = require("express");
const app = express();
const cors = require("cors");
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const bodyParser = require('body-parser')
const config = require('./config')

// middlewares
app.use(express.json());
app.use(cors());
// routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard",dashboardRoutes );


app.listen(config.port, console.log(`Listening on port ${config.port}...`));
