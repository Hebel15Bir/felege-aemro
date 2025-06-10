import { todayEthCalendar } from '../other/util';
import { model, models, Schema } from 'mongoose';

const registrantSchema = new Schema({
  fullName: { type: String, required: true },
  kName: { type: String, required: true },
  age: { type: Number, required: true },
  photoUrl: { type: String, required: true },
  sex: { type: String, required: true },
  phoneNo: { type: String, required: true },
  isOwn: { type: Boolean, required: true },
  ownerName: {
    type: String,
    required: function () {
      return !this.isOwn;
    },
  },
  priesthood: { type: String, default: 'ምእመን' },
  isNewStudent: { type: Boolean, default: false },
  registryDate: {
    year: { type: Number, required: true },
    month: { type: String, required: true },
    date: { type: Number, required: true },
  },
  classDetails: {
    classroom: { type: String },
    subject: { type: String },
    classTime: { type: String, default: 'የጠዋት' },
  },
  confirmStatus: { type: String, default: 'registered' },
  progress: { type: String },
  paymentId: { type: String, required: true },
});

registrantSchema.pre('save', function (next) {
  if (this.isOwn) {
    this.ownerName = this.fullName;
  }
  if (this.isNewStudent) {
    this.classDetails.classTime = 'የጠዋት';
    this.registryDate = todayEthCalendar();
  }
  next();
});

export const Registrant =
  models.Registrant || model('Registrant', registrantSchema);
