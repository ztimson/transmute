import express from 'express';
import http from 'http';
import {ConfigController} from './controllers/config.controller';
import {LibraryController} from './controllers/library.controller';
import {environment} from './environments/environment';
import {ErrorMiddleware} from './middleware/error-handler.middleware';
import {LoggerMiddleware} from './middleware/logger.middleware';
import {ConfigService} from './services/config.service';
import {LibraryService} from './services/library.service';
import {QueueService} from './services/queue.service';
import {SocketService} from './services/socket.service';
import * as SourceMap from 'source-map-support';
import {VideoService} from './services/video.service';
import * as cors from 'cors';

SourceMap.install();

// Globals
export const app = express();
export const server = http.createServer(app);

// Singleton services
// await connectAndMigrate();
export const config = new ConfigService();
export const socket = new SocketService(server);
export const queue = new QueueService();

export const videos = new VideoService();
export const libraries = new LibraryService(videos);

// Express setup
(async () => {
	// Middleware
	app.use(cors.default());
	app.use(express.json());
	app.use(LoggerMiddleware);

	// API
	new ConfigController();
	new LibraryController();

	// Client/WebUI
	console.log(environment.clientPath);
	app.get('*', express.static(environment.clientPath));

	// Error handling
	app.use(ErrorMiddleware);
	process.on('unhandledRejection', ErrorMiddleware);

	// Start
	server.listen(environment.port, () => console.log(`Listening on http://localhost:${environment.port}`));
})();
