import { Server } from "socket.io";
import formatMessage from "./utils/messages.js";
import {
	userJoin,
	getCurrentUser,
	userLeave,
	getRoomUsers,
} from "./utils/users.js";

export default async (server, messageRepo) => {
	const io = new Server(server, {
		cors: { origin: "*", methods: ["GET", "POST"] },
	});

	const botName = "Humane Bot";
	//Run when client connects
	io.on("connection", (socket) => {
		console.log(`${socket.id} is the name of this socket`);
		socket.on("joinRoom", ({ username, room }) => {
			console.log(`${username} has joined the room`);
			const user = userJoin(socket.id, username, room);
			socket.join(user.room);
			console.log(
				JSON.stringify(formatMessage(botName, "Welcome to Chatcord"))
			);
			// Welcome current user
			socket.emit(
				"message",
				JSON.stringify(formatMessage(botName, "Welcome to Chatcord"))
			);

			// Broadcasts when user connects
			socket.broadcast
				.to(user.room)
				.emit(
					"message",
					JSON.stringify(
						formatMessage(
							botName,
							`${user.username} has joined the chat`
						)
					)
				);

			// Send user and room info
			io.to(user.room).emit("roomUsers", {
				room: user.room,
				users: getRoomUsers(user.room),
			});
		});

		//Listen for chatMessage
		socket.on("chatMessage", (msg) => {
			const user = getCurrentUser(socket.id);
			console.log(formatMessage(user.username, msg), "...hola...");
			io.to(user.room).emit(
				"message",
				JSON.stringify(formatMessage(user.username, msg))
			);
		});

		// Runs when client disconnects
		socket.on("disconnect", () => {
			socket.disconnect();
			console.log(`${socket.id} had left the chat`);
			const user = userLeave(socket.id);
			if (user) {
				io.to(user.room).emit(
					"message",
					JSON.stringify(
						formatMessage(
							botName,
							`${user.username} has left the chat`
						)
					)
				);

				io.to(user.room).emit("roomUsers", {
					room: user.room,
					users: getRoomUsers(user.room),
				});
			}
		});
	});

	return io;
};
