import * as dotenv from "dotenv";
import UserRoute from "./Routes/users";
import ShoesRoute from "./Routes/shoes";
import cors from "cors";
import express from "express";
import ShippingOptionsRoute from "./Routes/shipping_options";
import OrdersRoute from "./Routes/orders";

dotenv.config();

if (!process.env.PORT) {
	process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(express.json());
app.use(cors());

// // To use controller
app.use("/api/", UserRoute, ShoesRoute, ShippingOptionsRoute, OrdersRoute);

app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});
