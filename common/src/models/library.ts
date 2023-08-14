export type Library = {
	/** Primary Key */
	id?: number;
	/** Human-readable name */
	name: string;
	/** Path to library folder */
	path: string;
	/** Monitor directory for changes */
	watch: boolean;
}
