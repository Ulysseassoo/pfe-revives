import * as dotenv from "dotenv";
// import UserRoute from "./Routes/users";
// import ProductsRoute from "./Routes/products";
import cors from "cors";
import express from "express";

dotenv.config();

if (!process.env.PORT) {
	process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(express.json());
app.use(cors());

// // To use controller
// app.use("/api/", UserRoute);
// app.use("/api/", ProductsRoute);

app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});
