import RedisClient from "../mvc/redis/RedisClient.js";
import TokenRedisRepo from "../mvc/redis/TokenRedisRepo.js";

export default function (container) {
	container.service("RedisClient", async () => {
		if (environment == "test") {
			return {};
		} else {
			return RedisClient();
		}
	});
	container.service("TokenRedisRepo", (container) => {
		const environment = process.env.NODE_ENV;
		if (environment == "test") {
			return {};
		} else {
			return new TokenRedisRepo();
		}
	});
}
