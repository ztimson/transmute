import {File} from 'buffer';

export type JobType = 'healthcheck' | 'transcode'

export type Job = {
	type: JobType,
	file: File
}
