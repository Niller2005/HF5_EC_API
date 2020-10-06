import feathers from '@feathersjs/feathers';
import '@feathersjs/transport-commons';
import express from '@feathersjs/express';
import socketio from '@feathersjs/socketio';
import { v4 as uuidv4 } from 'uuid';

interface Device {
  id: string;
  mac: string;
  status: 'Offline' | 'Online';
  createdAt: Date;
  updatedAt: Date;
}

class DeviceService {
  devices: Device[] = [];

  async find() {
    return this.devices;
  }

  async create(data: Pick<Device, 'mac' | 'status'>) {
    const device = this.devices.find(({ mac }) => mac === data.mac);
    if (!device) {
      const newDevice: Device = {
        id: uuidv4(),
        mac: data.mac,
        status: data.status || 'Offline',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.devices.push(newDevice);
      return device;
    } else {
      device.status = 'Online';
      device.updatedAt = new Date();
      return device;
    }
  }
}

const app = express(feathers());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.configure(express.rest());
app.configure(socketio());
app.use('/devices', new DeviceService());
app.use(express.errorHandler());

app.on('connection', (connection) => app.channel('everybody').join(connection));
app.publish((data) => app.channel('everybody'));

app.listen(3030).on('listening', () => console.log('Feathers server listening on localhost:3030'));

app.service('devices').create({
  mac: '0:80:e1:27:0:39',
});
