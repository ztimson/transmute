import {Library, Video} from '@transmute/common';
import {Kysely, SqliteDialect} from 'kysely';
import Database from 'better-sqlite3'

interface Schema {
	library: Library,
	video: Video
}

export const db = new Kysely<Schema>({
	dialect: new SqliteDialect({
		database: new Database('db.sqlite3')
	})
});

// export async function connectAndMigrate() {
// 	const migrator = new Migrator({
// 		db,
// 		provider: new FileMigrationProvider({
// 			fs,
// 			path,
// 			migrationFolder: 'dist/migrations',
// 		})
// 	});
//
// 	const { error, results } = await migrator.migrateToLatest()
//
// 	results?.forEach((it) => {
// 		if (it.status === 'Success') {
// 			console.log(`migration "${it.migrationName}" was executed successfully`);
// 		} else if (it.status === 'Error') {
// 			console.error(`failed to execute migration "${it.migrationName}"`);
// 		}
// 	});
//
// 	if (error) {
// 		console.error('failed to migrate');
// 		console.error(error);
// 		process.exit(1);
// 	}
// }
