import mongoose from 'mongoose';

const MONGODB_URI =
  'mongodb+srv://bekemefekede1215:X4B0uuVfI144sM78@cluster0.tkewolw.mongodb.net/gubae';

export async function connectToDatabase() {
  return await mongoose
    .connect(MONGODB_URI)
    .catch((err) => {
      console.log(err);
    })
    .then(() => console.log('connected'));
}

export async function disconnectDatabase() {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }
}
