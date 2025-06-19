'use server';

import { FormInfo } from '@/util/types';
import { connectToDatabase, disconnectDatabase } from './db';
import { Registrant } from './models';
import { restructure } from '@/util';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
	cloud_name: 'dxmwtld0d',
	api_key: '143241854443167',
	api_secret: 'E0PKUYkmSHhaQqHfPKi-YMUfw0o',
});

export async function registerStudent(
	formData: FormInfo
): Promise<{ error: string }> {
	const file = formData.image;
	if (!file) {
		return {
			error: 'እባክዎ የተማሪ ፎቶ ያስገቡ።',
		};
	}
	if (!file.size) {
		return {
			error: 'እባክዎ የተማሪ ፎቶ ያስገቡ።',
		};
	}

	let imageUrl: string;

	try {
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		imageUrl = await new Promise((resolve, reject) => {
			cloudinary.uploader
				.upload_stream({}, (error, result) => {
					if (error || !result) reject(error);
					else resolve(result.secure_url);
				})
				.end(buffer);
		});
	} catch {
		return {
			error: 'ምስሉ በአግባቡ አልተጫነም። እባክዎ እንደገና ይሞክሩ።',
		};
	}

	const registrantData = restructure(formData, imageUrl);

	await connectToDatabase();
	const registrant = new Registrant(registrantData);
	await registrant.save();

	await disconnectDatabase();

	return {
		error: '',
	};
}
