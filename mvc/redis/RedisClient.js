import chalk from "chalk";
import redis from "redis";

const RedisClient = () => {
	const PORT = 6379;

	let redisClient;

	const environment = process.env.NODE_ENV;
	if (environment == "test") {
		return {};
	} else {
		if (process.env.REDIS_TLS_URL) {
			const redisUrl = process.env.REDIS_TLS_URL
				? process.env.REDIS_TLS_URL
				: process.env.REDIS_URL;
			const redisDefaults = {
				tls: {
					// Heroku uses self-signed certificate, which will cause error in connection, unless check is disabled
					rejectUnauthorized: false,
				},
			};
			redisClient = redis.createClient(redisUrl, redisDefaults);
		} else {
			const PORT = process.env.REDIS_PORT || 6379;
			let host = "localhost";

			if (process.env.NODE_ENV === "Front") {
				host = "redis";
			}
			redisClient = redis.createClient(PORT, host);
		}

		redisClient.on("connect", function () {
			console.log(
				chalk.red.bold(
					`------------------------Redis client connected ------------------`
				)
			);
		});

		redisClient.on("error", (err) => {
			console.log(chalk.yellow.bold(err));
		});
	}
	return redisClient;
};

export default RedisClient;
