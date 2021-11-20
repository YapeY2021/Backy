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
		socket.on("joinRoom", (params) => {
			const { eid: room, uid: username } = JSON.parse(params);
			console.log(`${username} has joined the room ${room}`);
			const user = userJoin(socket.id, username, room);
			socket.join(user.room);

			// Welcome current user
			socket.emit(
				"message",
				formatMessage(botName, "Welcome to Chatcord")
			);

			// Broadcasts when user connects
			socket.broadcast
				.to(user.room)
				.emit(
					"message",
					formatMessage(
						botName,
						`${user.username} has joined the chat`
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
			const jsonMsg = JSON.parse(msg);
			console.log("user", formatMessage(user.username, jsonMsg.text));
			const returnMessage = {
				eid: user.room,
				uid: user.username,
				text: jsonMsg.text,
				time: "12:00pm",
			};
			// io.to(user.room).emit("message", formatMessage(user.username, jsonMsg.text));
			io.to(user.room).emit("message", returnMessage);
		});

		// Runs when client disconnects
		socket.on("disconnect", () => {
			socket.disconnect();
			console.log(`${socket.id} had left the chat`);
			const user = userLeave(socket.id);
			if (user) {
				io.to(user.room).emit(
					"message",
					formatMessage(botName, `${user.username} has left the chat`)
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
