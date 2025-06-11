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
			'ምዝገባዎ በአግባቡ ተጠናቋል። የክፍያ ደረሰኝ በመያዝ ወደ ጉባኤ ቤቱ ጽሕፈት ቤት ሔደው ምዝገባዎን ያረጋግጡ።',
		error: '',
	};
}

export async function verifyStudent(studentData) {
	await connectToDatabase();

	const classroom = studentData.get('classroom');
	const subject = studentData.get('subject');
	const classTime = studentData.get('classTime');
	const fullName = studentData.get('fullName');
	const photoUrl = studentData.get('photoUrl');
	const studentId = studentData.get('studentId');

	const total = await Registrant.find().length;
	const inClass = await Registrant.find({ 'classDetail.classroom': classroom })
		.length;

	const uniqueId = `${total}/${inClass}`;

	if (!classroom || !subject || !classTime) {
		return {
			success: '',
			error: 'እባክዎ አስፈላጊውን መረጃ ያሟሉ።',
		};
	}

	try {
		const imageBuffer = await fetch(photoUrl).then((res) => res.arrayBuffer());
		const filePath = `./public/students/${fullName.replace(' ', '_')}.jpg`;
		await fs.writeFile(filePath, Buffer.from(imageBuffer));
	} catch (err) {
		console.log(err);
		return {
			success: '',
			error: 'የተማሪው ምስል ወደ ኮምፒዩተርዎት አልወረደም። እባክዎ በድጋሚ ይሞክሩ።',
		};
	}

	const updateData = {
		uniqueId: uniqueId,
		confirmStatus: 'verified',
		'classDetails.classroom': classroom,
		'classDetails.classTime': classTime,
		'classDetails.subject': subject,
	};

	const student = await Registrant.findByIdAndUpdate(studentId, updateData, {
		new: true,
		runValidators: true,
	}).exec();

	await disconnectDatabase();

	const process = spawn('python', [
		'src/other/sendSms.py',
		`${fullName.split(' ')[0]}`,
		uniqueId,
		`+251${student.phoneNo}`,
	]);

	process.stdout.on('data', (data) => {
		console.log(`Python output: ${data}`);
	});

	process.stderr.on('data', (data) => {
		console.error(`Python error: ${data}`);
	});

	process.on('close', (code) => {
		console.log(`Python script exited with code ${code}`);
	});

	process.on('error', (err) => {
		console.error(`Failed to start Python process: ${err.message}`);
	});

	return {
		success: '',
		error: '',
	};
}
