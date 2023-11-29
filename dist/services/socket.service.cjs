"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketService = void 0;
const logger_service_cjs_1 = require("./logger.service.cjs");
const socket_io_1 = require("socket.io");
var gIo = null;
const SOCKET_LOGIN = 'set-user-socket';
const SOCKET_LOGOUT = 'unset-user-socket';
const SOCKET_SET_TOPIC = 'chat-set-topic';
const SOCKET_ADD_MSG = 'chat-add-msg';
const SOCKET_SEND_MSG = 'chat-send-msg';
const SOCKET_USER_UPDATED = 'user-updated';
const SOCKET_ORDER_ADDED = 'order-added';
const SOCKET_ORDER_UPDATED = 'order-updated';
function setupSocketAPI(http) {
    gIo = new socket_io_1.Server(http, {
        cors: {
            origin: '*',
        },
    });
    gIo.on('connection', (socket) => {
        logger_service_cjs_1.loggerService.info(`New connected socket [id: ${socket.id}]`);
        socket.on('disconnect', (socket) => {
            logger_service_cjs_1.loggerService.info(`Socket disconnected [id: ${socket.id}]`);
        });
        socket.on(SOCKET_SET_TOPIC, (topic) => {
            console.log('topic', topic);
            if (socket.myTopic === topic)
                return;
            if (socket.myTopic) {
                socket.leave(socket.myTopic);
                logger_service_cjs_1.loggerService.info(`Socket is leaving topic ${socket.myTopic} [id: ${socket.id}]`);
            }
            socket.join(topic);
            socket.myTopic = topic;
        });
        socket.on(SOCKET_ORDER_UPDATED, (data) => {
            console.log(' socketservice  updated order', data);
            logger_service_cjs_1.loggerService.info(`New activity from socket [id: ${socket.id}], emitting to topic ${socket.myTopic}`);
            gIo.emit(SOCKET_ORDER_UPDATED, data);
        });
        socket.on(SOCKET_ORDER_ADDED, (data) => {
            console.log(' socketservice added order', data);
            logger_service_cjs_1.loggerService.info(`New activity from socket [id: ${socket.id}], emitting to topic ${socket.myTopic}`);
            gIo.emit(SOCKET_ORDER_ADDED, data);
        });
        socket.on(SOCKET_USER_UPDATED, (user) => {
            console.log('user update', user);
            logger_service_cjs_1.loggerService.info(`New user update from socket [id: ${socket.id}], emitting to userId ${socket.myTopic}`);
            gIo.emit(SOCKET_USER_UPDATED, user);
        });
        // socket.on('task-dropped', (data) => {
        //   console.log('task dropped', data)
        //   logger.info(
        //     `New activity from socket [id: ${socket.id}], emitting to topic ${socket.myTopic}`
        //   )
        //   gIo.to(socket.myTopic).emit('task-dropped', data)
        // })
        // socket.on('user-invited', (data) => {
        //   const { stayId, userId, type } = data
        //   const res = {
        //     type,
        //     data: stayId,
        //     userId,
        //   }
        //   logger.info(`user with id: ${userId} invited to stay with id: ${stayId}`)
        //   emitToUser(res)
        // })
        socket.on(SOCKET_SEND_MSG, (msg) => {
            console.log(msg);
            logger_service_cjs_1.loggerService.info(`New chat msg from socket [id: ${socket.id}], emitting to topic ${socket.myTopic}`);
            // emits to all sockets:
            // gIo.emit('chat addMsg', msg)
            // emits only to sockets in the same room
            gIo.to(socket.myTopic).emit(SOCKET_ADD_MSG, msg);
        });
        socket.on('user-watch', (userId) => {
            logger_service_cjs_1.loggerService.info(`user-watch from socket [id: ${socket.id}], on user ${userId}`);
            socket.join('watching:' + userId);
        });
        socket.on(SOCKET_LOGIN, (userId) => {
            logger_service_cjs_1.loggerService.info(`Setting socket.userId = ${userId} for socket [id: ${socket.id}]`);
            socket.userId = userId;
        });
        socket.on(SOCKET_LOGOUT, () => {
            logger_service_cjs_1.loggerService.info(`Removing socket.userId for socket [id: ${socket.id}]`);
            delete socket.userId;
        });
    });
}
function emitTo({ type, data, label }) {
    if (label)
        gIo.to('watching:' + label.toString()).emit(type, data);
    else
        gIo.emit(type, data);
}
async function emitToUser({ type, data, userId }) {
    console.log('type', type, 'data', data);
    userId = userId.toString();
    const socket = await _getUserSocket(userId);
    if (socket) {
        logger_service_cjs_1.loggerService.info(`Emiting event: ${type} to user: ${userId} socket [id: ${socket.id}]`);
        socket.emit(type, data);
    }
    else {
        logger_service_cjs_1.loggerService.info(`No active socket for user: ${userId}`);
        // _printSockets()
    }
}
// If possible, send to all sockets BUT not the current socket
// Optionally, broadcast to a room / to all
async function broadcast({ type, data, room = null, userId }) {
    userId = userId.toString();
    logger_service_cjs_1.loggerService.info(`Broadcasting event: ${type}`);
    const excludedSocket = await _getUserSocket(userId);
    if (room && excludedSocket) {
        logger_service_cjs_1.loggerService.info(`Broadcast to room ${room} excluding user: ${userId}`);
        excludedSocket.broadcast.to(room).emit(type, data);
    }
    else if (excludedSocket) {
        logger_service_cjs_1.loggerService.info(`Broadcast to all excluding user: ${userId}`);
        excludedSocket.broadcast.emit(type, data);
    }
    else if (room) {
        logger_service_cjs_1.loggerService.info(`Emit to room: ${room}`);
        gIo.to(room).emit(type, data);
    }
    else {
        logger_service_cjs_1.loggerService.info(`Emit to all`);
        gIo.emit(type, data);
    }
}
async function _getUserSocket(userId) {
    const sockets = await _getAllSockets();
    const socket = sockets.find((s) => s.userId === userId);
    return socket;
}
async function _getAllSockets() {
    // return all Socket instances
    const sockets = await gIo.fetchSockets();
    return sockets;
}
async function _printSockets() {
    const sockets = await _getAllSockets();
    console.log(`Sockets: (count: ${sockets.length}):`);
    sockets.forEach(_printSocket);
}
function _printSocket(socket) {
    console.log(`Socket - socketId: ${socket.id} userId: ${socket.userId}`);
}
exports.socketService = {
    // set up the sockets service and define the API
    setupSocketAPI,
    // emit to everyone / everyone in a specific room (label)
    emitTo,
    // emit to a specific user (if currently active in system)
    emitToUser,
    // Send to all sockets BUT not the current socket - if found
    // (otherwise broadcast to a room / to all)
    broadcast,
};
//# sourceMappingURL=socket.service.cjs.map