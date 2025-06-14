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
		age: parseInt(studentData.get('age')),
		photoUrl: photoUrl,
		sex: studentData.get('sex'),
		phoneNo: studentData.get('phoneNo'),
		isOwn: studentData.get('isOwn') === 'on',
		ownerName: studentData.get('ownerName'),
		priesthood: studentData.get('priesthood'),
		isNewStudent: studentData.get('isNewStudent') === 'on',
		registryDate:
			studentData.get('isNewStudent') === 'on'
				? todayEthCalendar()
				: {
						year: parseInt(studentData.get('year')),
						month: studentData.get('month'),
						date: parseInt(studentData.get('date')),
				  },
		classDetails: {
			classroom: studentData.get('classroom'),
			subject: studentData.get('subject'),
			classTime: studentData.get('classTime'),
		},
		confirmStatus: 'registered',
		paymentId: studentData.get('paymentId'),
	});

	try {
		await registrant.save();
	} catch (err) {
		console.log(todayEthCalendar());
		console.log(registrant);
		console.log(err);
		return {
			success: '',
			error: 'እባክዎ አስፈላጊዎቹን መረጃዎች በሙሉ ይሙሉ።',
		};
	}

	await disconnectDatabase();

	return {
		success:
			'ስለተመዘገቡ እናመሰግናለን። ምዝገባዎን ለማረጋገጥ የከፈሉበትን ደረሰኝ ፎቶ አንሥተው @b8874 ላይ በቴሌግራም ይላኩ፤ ወይም ደረሰኙን በአካል ለትምህርት ክፍሉ ያሳዩ።',
		error: '',
	};
}
