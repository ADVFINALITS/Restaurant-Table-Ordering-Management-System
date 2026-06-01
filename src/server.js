require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const gatewayRoutes = require("./routes/gatewayRoutes");

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api", gatewayRoutes);

app.get("/", (req, res) => {
    res.send("Restaurant API Gateway Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});