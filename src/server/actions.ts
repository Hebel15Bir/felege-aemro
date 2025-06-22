'use server';

import { FormInfo } from '@/util/types';
import { connectToDatabase } from './db';
import { Registrant } from './models';
import { restructure } from '@/util';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
	cloud_name: 'dxmwtld0d',
	api_key: '143241854443167',
	api_secret: 'E0PKUYkmSHhaQqHfPKi-YMUfw0o',
});

export async function uploadImage(file: File): Promise<string> {
	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	return new Promise((resolve, reject) => {
		const uploadStream = cloudinary.uploader.upload_stream(
			{
				transformation: [
					{ width: 150, height: 200, crop: 'thumb', gravity: 'face' },
					{ angle: 'auto' },
					{ fetch_format: 'jpg' },
				],
			},
			(error, result) => {
				if (error || !result) reject(error);
				else resolve(result.secure_url);
			}
		);

		uploadStream.end(buffer);
	});
}

export async function registerStudent(
	formData: FormInfo
): Promise<{ error: string }> {
	await connectToDatabase();
	const alreadyRegistered = await Registrant.findOne({
		fullName: formData.fullName.trim(),
		paymentId: formData.paymentId.trim(),
	});

	if (alreadyRegistered) {
		return {
			error: 'ከዚህ በፊት ተመዝግበዋል። መረጃ ለመቀየር ከሆነ ወደ ትምህርት ቢሮ ሔደው ያመልክቱ።',
		};
	}

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
		imageUrl = await uploadImage(file);
	} catch {
		return {
			error: 'ምስሉ በአግባቡ አልተጫነም። እባክዎ እንደገና ይሞክሩ።',
		};
	}

	const registrantData = restructure(formData, imageUrl);

	const registrant = new Registrant(registrantData);
	await registrant.save();

	return {
		error: '',
	};
}
