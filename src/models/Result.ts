import mongoose from 'mongoose';

export interface IResult extends mongoose.Document {
  userId: string;
  score: number;
  timestamp: Date;
}

const resultSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  score: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
}, { collection: 'binh', versionKey: false });

export const Result = mongoose.models.Result || mongoose.model<IResult>('Result', resultSchema);
