"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const feathers_1 = __importDefault(require("@feathersjs/feathers"));
require("@feathersjs/transport-commons");
const express_1 = __importDefault(require("@feathersjs/express"));
const socketio_1 = __importDefault(require("@feathersjs/socketio"));
const uuid_1 = require("uuid");
class DeviceService {
    constructor() {
        this.devices = [];
    }
    find() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.devices;
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const device = this.devices.find(({ mac }) => mac === data.mac);
            if (!device) {
                const newDevice = {
                    id: uuid_1.v4(),
                    mac: data.mac,
                    status: data.status || 'Offline',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                this.devices.push(newDevice);
                return device;
            }
            else {
                device.status = 'Online';
                device.updatedAt = new Date();
                return device;
            }
        });
    }
}
const app = express_1.default(feathers_1.default());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(__dirname));
app.configure(express_1.default.rest());
app.configure(socketio_1.default());
app.use('/devices', new DeviceService());
app.use(express_1.default.errorHandler());
app.on('connection', (connection) => app.channel('everybody').join(connection));
app.publish((data) => app.channel('everybody'));
app.listen(3030).on('listening', () => console.log('Feathers server listening on localhost:3030'));
app.service('devices').create({
    mac: '0:80:e1:27:0:39',
});
//# sourceMappingURL=app.js.map