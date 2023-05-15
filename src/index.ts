const listEndpoints = require("express-list-endpoints");
const mongoose = require("mongoose");
import { httpServer, expressServer } from "./server";

const port = process.env.PORT || 3001;
mongoose.connect(process.env.MONGO_URL as string);

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected ✅");
  httpServer.listen(port, () => {
    console.table(listEndpoints(expressServer));
    console.log(`Server listening on port ${port}`);
  });
});
