// index.js
import express from "express";
import router from "./routes.js";
import { initializeData } from "./storage-utils.js";
import cors from 'cors'


const app = express();
app.use(cors())
const PORT = process.env.PORT || 3000;

// Use the router
app.use("/", router);

// Start the server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await initializeData();
  console.log(`Server is ready`);
});
