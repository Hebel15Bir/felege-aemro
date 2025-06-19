import { IRegistrant } from '@/util/types';
import { Document, Model, model, models, Schema } from 'mongoose';

interface IMongoRegistrant extends IRegistrant, Document {}

const registrantSchema = new Schema<IMongoRegistrant>({
	fullName: { type: String },
	kName: { type: String },
	age: { type: Number },
	imageUrl: { type: String },
	sex: { type: String },
	phoneNo: { type: Number },
	isOwn: { type: Boolean },
	ownerName: { type: String },
	priesthood: { type: String },
	isNewStudent: { type: Boolean },
	registryDate: {
		year: { type: Number },
		month: { type: String },
		date: { type: Number },
	},
	classDetails: {
		classroom: { type: String },
		subject: { type: String },
		classTime: { type: String },
	},
	confirmStatus: { type: String, default: 'registered' },
	paymentId: { type: String },
});

export const Registrant: Model<IMongoRegistrant> =
	models.Registrant || model<IMongoRegistrant>('Registrant', registrantSchema);
