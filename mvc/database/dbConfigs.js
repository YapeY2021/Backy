const devConfig_b = {
	client: "postgres",
	connection: {
		host: "localhost",
		user: "postgres",
		password: "password",
		database: "postgres",
	},
};

const devConfig_f = {
	client: "postgres",
	connection: {
		host: "db",
		user: "postgres",
		password: "password",
		database: "postgres",
	},
};

let devConfig = devConfig_b;

if (process.env.NODE_ENV === "Front") {
	devConfig = devConfig_f;
}
// const DATABASE_URL = `postgres://postgres:password@postgres:5431`;

// const devConfig = {
//   client: "postgres",
//   connection: DATABASE_URL,
// };

const proConfig = {
	client: "postgres",
	connection: process.env.DATABASE_URL,
	ssl: {
		/* <----- Add SSL option */
		require: true,
		rejectUnauthorized: false,
	}, // heroku add ons
};

export { proConfig, devConfig };
