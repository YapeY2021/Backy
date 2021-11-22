import { Server } from "socket.io";
import formatMessage from "./utils/messages.js";
import {
	userJoin,
	getCurrentUser,
	userLeave,
	getRoomUsers,
} from "./utils/users.js";

export default async (server, messageRepo, userRepo) => {
	const io = new Server(server, {
		cors: { origin: "*", methods: ["GET", "POST"] },
	});

	const botName = "Humane Bot";
	//Run when client connects
	io.on("connection", (socket) => {
		console.log(`${socket.id} is the name of this socket`);
		socket.on("joinRoom", async (params) => {
			console.log("params", JSON.parse(params));
			const { eid, uid } = JSON.parse(params);
			const [{ firstname }] = await userRepo.getUserById(uid);
			console.log(`${firstname} and ${uid} has joined the room ${eid}`);
			const user = userJoin(socket.id, uid, eid, firstname);
			socket.join(user.room);
			const messages = await messageRepo.getlast30messages(eid);
			console.log("emi", messages);
			// io.to(user.room).emit("lastMessages", messages);
			io.to(socket.id).emit("lastMessages", messages);
			// Welcome current user
			// socket.emit(
			// 	"inout",
			// 	formatMessage(botName, user.room, "Welcome to Chatcord")
			// );

			// Broadcasts when user connects
			// socket.broadcast
			// 	.to(user.room)
			// 	.emit(
			// 		"inout",
			// 		formatMessage(
			// 			botName,
			// 			user.room,
			// 			`${user.username} has joined the chat`
			// 		)
			// 	);

			// Send user and room info
			// io.to(user.room).emit("roomUsers", {
			// 	room: user.room,
			// 	users: getRoomUsers(user.room),
			// });
		});

		//Listen for chatMessage
		socket.on("chatMessage", async (msg) => {
			const user = getCurrentUser(socket.id);
			const jsonMsg = JSON.parse(msg);
			console.log(
				"user",
				formatMessage(user.uid, user.room, jsonMsg.text, "")
			);
			const [{ firstname }] = await userRepo.getUserById(user.uid);
			let newMessage = await messageRepo.addMessage(
				user.room,
				user.username,
				jsonMsg.text,
				firstname
			);
			newMessage = {
				...newMessage,
				firstname,
			};
			// io.to(user.room).emit("message", formatMessage(user.username, jsonMsg.text));
			io.to(user.room).emit("message", newMessage);
		});

		// Runs when client disconnects
		socket.on("disconnect", () => {
			socket.disconnect();
			console.log(`${socket.id} had left the chat`);
			const user = userLeave(socket.id);
			if (user) {
				io.to(user.room).emit(
					"inout",
					formatMessage(
						botName,
						user.room,
						`${user.username} has left the chat`
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
