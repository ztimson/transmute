import {Server as HTTP} from 'http';
import {Server} from 'socket.io';

export class SocketService {
	private socket !: any;

	constructor(server: HTTP) {
		this.socket = new Server(server);
		this.socket.on('connection', (socket) => {
			console.log('a user connected');
		});

		this.socket.on('disconnect', () => {
			console.log('user disconnected');
		});
	}

	scanStatus(library: string, complete: number, pending: number) {
		this.socket.emit('scan', {
			library,
			complete,
			pending,
		});
	}
}
