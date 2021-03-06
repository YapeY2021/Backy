import dotenv from "dotenv";
import http from "http";
import nodeCron from "node-cron";
import chalk from "chalk";
import WebSocketWrapper from "./websocket/WebSocketWrapper.js";
import AppManager from "./container/AppManager.js";

dotenv.config();

let appManager = AppManager();

let app = appManager.App;

const server = http.Server(app);
// sets port and listener
const PORT = process.env.PORT || 5001;
// only listen if not in test environment
server.listen(PORT, async () => {
	console.log(
		chalk.blue.bold(
			`------------------------Server is listening on port: ${process.env.PORT}!--------------------`
		)
	);

	if (process.env.NODE_ENV !== "test") {
		await appManager.Migrate;
		await appManager.Seed;
		const dateTime = new Date().toLocaleString().split("/");
		const scheduleTime = `${dateTime[2].split(",")[0]}-${dateTime[0]}-${
			dateTime[1]
		}`;

		await appManager.EventScrapper;

		const job = nodeCron.schedule("0 12 * * *", async () => {
			await crawlEvents(scheduleTime);
		});
		job.start();
	}
});

// wraps our server application
WebSocketWrapper(server, appManager.MessageRepo, appManager.UserRepo);

export default app;
