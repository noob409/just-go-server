import "dotenv/config.js";

import db from "./src/database.js";

await db.connect();
await db.resolve();
await db.sequelize.sync({ force: true }); // 只要npm run sync就會刪除table重建
