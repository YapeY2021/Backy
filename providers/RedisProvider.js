import RedisClient from "../mvc/redis/RedisClient.js";
import TokenRedisRepo from "../mvc/redis/TokenRedisRepo.js";

export default function (container) {
	container.service("RedisClient", async () => {
		await RedisClient();
	});
	container.service("TokenRedisRepo", (container) => {
		return new TokenRedisRepo();
	});
}
