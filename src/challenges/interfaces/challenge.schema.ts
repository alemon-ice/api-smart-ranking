import * as mongoose from 'mongoose';

export const ChallengeSchema = new mongoose.Schema(
  {
    datetimeChallenge: { type: Date },
    status: { type: String },
    datetimeRequest: { type: Date },
    datetimeResponse: { type: Date },
    challenger: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    category: { type: String },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
  },
  { timestamps: true, collection: 'challenges' },
);
