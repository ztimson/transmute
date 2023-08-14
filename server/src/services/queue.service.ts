import {videos} from '../main';

export class QueueService {
	private healthcheckJobs: number[] = [];
	private transcodeJobs: number[] = [];

	mode: 'auto' | 'healthcheck' | 'transcode' = 'auto';

	async getJob(type?: 'healthcheck' | 'transcode'): Promise<['healthcheck' | 'transcode', number]> {
		if((type || this.mode) == 'healthcheck')
			return ['healthcheck', this.healthcheckJobs.pop()];
		if((type || this.mode) == 'transcode')
			return ['transcode', this.transcodeJobs.pop()];

		// Auto - Get next transcode job or it's healthcheck if it's needed still required
		const id = this.transcodeJobs.pop();
		const video = await videos.read(id);
		if(video.healthy != null)
			return [video.healthy ? 'transcode' : 'healthcheck', id]
	}

	createJob(id: number, type: 'healthcheck' | 'transcode') {
		(type == 'healthcheck' ?
			this.healthcheckJobs :
			this.transcodeJobs).push(id);
	}
}
