import MessageRepo from "../mvc/database/MessageRepo.js";
import ChatRoute from "../mvc/routes/chatRoutes.js";

export default function (container) {
	container.service(
		"MessageRepo",
		(container) => new MessageRepo(container.Database)
	);
	container.service(
		"MessageRoute",
		(container) => new ChatRoute(container.MessageRepo)
	);
}
