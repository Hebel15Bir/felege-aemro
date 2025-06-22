import mongoose from 'mongoose';

const MONGODB_URI =
	'mongodb+srv://bekemefekede1215:X4B0uuVfI144sM78@cluster0.tkewolw.mongodb.net/gubae';

declare const global: NodeJS.Global;

let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
			return mongoose;
		});
	}

	try {
		cached.conn = await cached.promise;
	} catch (e) {
		cached.promise = null;
		throw e;
	}

	return cached.conn;
}
