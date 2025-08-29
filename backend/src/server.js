const app = require("./app");
const connectDB = require("./config/db")
require("dotenv").config({ path: "../.env" });

const PORT = Number(process.env.PORT) || 1018;
connectDB();

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));