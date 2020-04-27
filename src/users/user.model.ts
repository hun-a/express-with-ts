import * as mongoose from 'mongoose';
import User from './user.interface';

const addressSchema = new mongoose.Schema({
  country: String,
  city: String,
  street: String,
});

const userSchema = new mongoose.Schema({
  address: addressSchema,
  firstName: String,
  lastName: String,
  email: String,
  password: String
});

const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);

export default userModel;