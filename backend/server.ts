import app from "./app";
import { initDb } from "./database";

const PORT = process.env.PORT || 5000;

initDb().then(
  () => app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  })
)