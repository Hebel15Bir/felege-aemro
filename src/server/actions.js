'use server';

import { v2 as cloudinary } from 'cloudinary';
import { connectToDatabase, disconnectDatabase } from './db';
import { Registrant } from './models';
import { todayEthCalendar } from '../other/util';
import fs from 'fs/promises';
import { spawn } from 'child_process';

cloudinary.config({
	cloud_name: 'dxmwtld0d',
	api_key: '143241854443167',
	api_secret: 'E0PKUYkmSHhaQqHfPKi-YMUfw0o',
});

export async function registerStudent(studentData) {
	const file = studentData.get('file');
	if (!file) {
		return {
			success: '',
			error: 'እባክዎ የተማሪ ምስል ያስገቡ።',
		};
	}
	if (!file.size) {
		return {
			success: '',
			error: 'እባክዎ የተማሪ ምስል ያስገቡ።',
		};
	}

	let photoUrl;

	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	try {
		photoUrl = await new Promise((resolve, reject) => {
			cloudinary.uploader
				.upload_stream({}, (error, result) => {
					if (error) reject(error);
					else resolve(result.secure_url);
				})
				.end(buffer);
		});
	} catch {
		return {
			success: '',
			error: 'ምስሉ በአግባቡ አልተጫነም። እባክዎ እንደገና ይሞክሩ።',
		};
	}

	await connectToDatabase();
	const registrant = new Registrant({
		fullName: studentData.get('fullName'),
		kName: studentData.get('kName'),
		age: parseInt(studentData.getያሳዩ።',
		error: '',
	};
}
