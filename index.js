require('dotenv').config();
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { isEmpty } = require("./common/util.functions");
const TwitterRoutes = require("./routes/twitter.routes");
const TwitterStream = require("./services/twitter.service");

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
}))
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

TwitterRoutes(app);

io.on("connection", async () => {
  io.emit("connected", "Client is connected");
  try {
      const { body: { data: existingRules } } = await TwitterStream.getRules();

      if (!isEmpty(existingRules)) {
        const existingRuleIds = existingRules.map(rule => rule.id);

        // remove existing rules
        await TwitterStream.deleteRules(existingRuleIds);
      }
      
      // await TwitterStream.addRule("Barcelona lang:en -is:retweet");
      TwitterStream.streamTweets(io);
  } catch (error) {
      io.emit("initiationError", "Error while connecting to Twitter");
      process.exit(1);
  }
});


const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server is running at ${PORT}`));
