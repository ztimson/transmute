export type Config = {
	/** What type of job type should be prioritized, leaving blank will automatically both queues */
	priority: 'healthcheck' | 'transcode' | null;
	/** Enable healthchecks using the given method, leaving blank disables */
	healthcheck: 'quick' | 'verbose' | null;
	/** Automatically delete unhealthy files */
	deleteUnhealthy: boolean;
	/** Require videos pass a healthcheck before being transcoded */
	onlyTranscodeHealthy: boolean;
	/** Delete original video file after it's been successfully transcoded */
	deleteOriginal: boolean;
	/** Desired video container/extension, leaving blank will accept any container type */
	targetContainer: string | null;
	/** Desired video codec, leaving blank will accept any codec */
	targetVideoCodec: string | null;
	/** Desired audio codec, leaving blank will accept any codec */
	targetAudioCodec: string | null;
	/** Only keep 1 audio track if multiple match */
	singleAudioTrack: boolean;
	/** Accepted audio track languages, leaving blank removes all */
	audioWhitelist: string[];
	/** Accepted subtitle languages, leaving blank removes all */
	subtitleWhitelist: string[];
};

export const ConfigDefaults: Config = {
	priority: null,
	healthcheck: null,
	deleteUnhealthy: false,
	onlyTranscodeHealthy: false,
	deleteOriginal: false,
	targetContainer: null,
	targetVideoCodec: null,
	targetAudioCodec: null,
	singleAudioTrack: false,
	audioWhitelist: ['eng', 'unk'],
	subtitleWhitelist: [],
}

export type KeyVal = {
	/** Configuration key */
	key: string;
	/** Configuration value */
	value: any;
}
