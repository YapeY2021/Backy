import RedisClient from "../mvc/redis/RedisClient.js";
import TokenRedisRepo from "../mvc/redis/TokenRedisRepo.js";

export default function (container) {
	container.service("RedisClient", async () => {
		const environment = process.env.NODE_ENV;
		if (environment == "test") {
			return {};
		} else {
			return RedisClient();
		}
	});
	container.service("TokenRedisRepo", (container) => {
		return new TokenRedisRepo();
	});
}
