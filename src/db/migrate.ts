import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Client } from "pg";

const client = new Client({
  connectionString: process.env.DATABASE_URL!,
});

const main = async () => {
  try {
    console.log("Migration start");
    await client.connect();
    const db = drizzle(client);
    await migrate(db, { migrationsFolder: "drizzle" });
    console.log("Migration complete");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to migrate database");
  }
};

main();
