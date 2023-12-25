import { createClient, RedisClientType } from "redis";

let client: RedisClientType;

export async function connectToRedis() {
	console.log("Connecting to Redis...");

	client = createClient({
		username: process.env.REDIS_USERNAME || "default",
		password: process.env.REDIS_PASSWORD || "",
		socket: {
			port: parseInt(process.env.REDIS_PORT || "6379"),
			host: process.env.REDIS_HOST || "localhost",
		},
	});

	client.on("error", (err) => console.log("Redis Client Error", err));
	client.on("connect", () => console.log("Connected to Redis!"));

	await client.connect();
}

export default function getClient() {
	return client;
}
