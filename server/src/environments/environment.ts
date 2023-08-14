import {join} from 'path';
import * as process from 'process';

export const environment = {
	clientPath: process.env['CLIENT_PATH'] ?? join(process.cwd(), '../client/dist'),
	port: process.env['PORT'] ?? 5000
}
