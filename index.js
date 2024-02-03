import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import chalk from 'chalk';
import si from 'systeminformation';

import config from './index.config.js';


const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set('view engine', 'ejs');
app.set('views', '/home/pi/workspace/status-viewer/views');

app.get('/', (req, res, next) => {
    res.render('index');
});

io.on('connection', (socket) => {
    console.log(chalk.green(`Socket connetion: ${socket.id}`));
    Promise.all([si.mem(), si.cpu(), si.fsSize()]).then(([mem, cpu, disk]) => {
        socket.emit('stat', {
    	totalMem: (mem.total / 1073741824).toFixed(3),
    	freeMem: (mem.free / 1073741824).toFixed(3),
    	usedMem: (mem.total / 1073741824 - mem.free / 1073741824).toFixed(3),
    	cpu: cpu.brand,
    	cpuCore: cpu.cores,
    	cpuPhysicalCores: cpu.physicalCores,
    	totalDisk: (disk[0].size / 1073741824 + (disk[1].size / 1073741824)).toFixed(3),
    	usedDisk: (disk[0].used / 1073741824 + (disk[1].used / 1073741824)).toFixed(3),
    	availableDisk: (disk[0].available / 1073741824 + (disk[1].available / 1073741824)).toFixed(3),
    	swapTotal: (mem.swaptotal / 1073741824).toFixed(3),
    	swapUsed: (mem.swapused / 1073741824).toFixed(3),
    	freeSwap: (mem.swapfree / 1073741824).toFixed(3),
        });
    });
});

setInterval(() => {
    Promise.all([si.mem(), si.cpu(), si.fsSize()]).then(([mem, cpu, disk]) => {
        io.sockets.emit('stat', {
    	totalRem: (mem.total / 1073741824).toFixed(3),
    	freeMem: (mem.free / 1073741824).toFixed(3),
    	cpu: cpu.brand,
    	cpuCore: cpu.cores,
    	cpuPhysicalCores: cpu.physicalCores,
    	totalDisk: (disk[0].size / 1073741824 + (disk[1].size / 1073741824)).toFixed(3),
    	usedDisk: (disk[0].used / 1073741824 + (disk[1].used / 1073741824)).toFixed(3),
    	availableDisk: (disk[0].available / 1073741824 + (disk[1].available / 1073741824)).toFixed(3),
    	swapTotal: (mem.swaptotal / 1073741824).toFixed(3),
    	swapUsed: (mem.swapused / 1073741824).toFixed(3)
        });
    });
}, 10000);

server.listen(config.port, config.callback);
