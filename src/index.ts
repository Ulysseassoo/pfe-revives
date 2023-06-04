import * as dotenv from "dotenv";
import UserRoute from "./Routes/users";
import ShoesRoute from "./Routes/shoes";
import cors from "cors";
import express from "express";
import ShippingOptionsRoute from "./Routes/shipping_options";
import OrdersRoute from "./Routes/orders";
import ShippingAddressRoute from "./Routes/shipping_addresses";
import Returns from "./Routes/returns";
import Comments from "./Routes/comments";
import Rates from "./Routes/rates";
import Photos from "./Routes/photos";
import Carts from "./Routes/carts";
import Favorites from "./Routes/favorites";
import { Server } from "socket.io"; // Import Socket.IO
import http from "http"; // Import HTTP module
import { UserSocket } from "./Inteface/User";

dotenv.config();

if (!process.env.PORT) {
	process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: process.env.ORIGIN?.split(","),
	},
});

app.use(express.json());
app.use(cors());

// // To use controller
app.use(
	"/api/",
	UserRoute,
	ShoesRoute,
	ShippingOptionsRoute,
	OrdersRoute,
	ShippingAddressRoute,
	Returns,
	Rates,
	Photos,
	Comments,
	Carts,
	Favorites,
);

// Socket
const sockets: UserSocket[] = [];
io.on("connection", (socket) => {
	console.log("a user connected", socket.id);
	sockets.push({
		user_id: null,
		socket_id: socket.id,
	});

	// Emit an event to the connected client
	socket.emit("welcome", "Welcome to Socket.IO!");

	// Handle disconnection
	socket.on("disconnect", () => {
		console.log("Client disconnected");
	});
});

server.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});
