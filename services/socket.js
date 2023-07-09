const jwtService = require("../services/jwt");
const GeneralError = require("../handlers/generalError");
const Chat = require("../models/chat");
const Message = require("../models/message");

exports.getActiveUserSessions = (io) => {
  const users = [];
  for (let [socketId, socketObject] of io.of("/").sockets) {
    users.push({
      user_id: socketObject.userId,
      socket_id: socketId,
    });
  }
  return users;
};

exports.hookListeners = async (io) => {
  io.on("connection", function (socket) {
    console.log("Socket with ID " + socket.id + " connected!");

    socket.on("disconnect", function () {
      console.log("Socket with ID " + socket.id + " disconnected!");
    });

    socket.on("get-active-user-sessions", function () {
      console.log("Sending active user sessions to all");
      io.emit("active-user-sessions", module.exports.getActiveUserSessions(io));
    });

    socket.on("get-chats", function () {
      const promise = Chat.find({
        $or: [{ creator_id: socket.userId }, { participant_id: socket.userId }],
      })
        .sort({ created_at: -1 })
        .select(["-__v"])
        .populate("messages")
        .exec();
      promise
        .then((chats) => {
          console.log("Chats " + chats.length + " will be emited to user");
          socket.emit("chats", chats);
        })
        .catch((err) => {});
    });

    // TODO - all other chat functionality
  });
};

exports.addAuthenticationMiddleware = (io) => {
  io.use((socket, next) => {
    const userId = socket.handshake.auth.userId;
    const token = socket.handshake.auth.token;
    if (!userId || !token || !jwtService.verify(token, userId)) {
      console.log("User with ID" + userId + " does not match the token!");
      return next(new GeneralError(401, "InvalidUserError", "Invalid user"));
    }
    socket.userId = userId;
    next();
  });
};
