import * as mongoose from 'mongoose';

export const ChallengeSchema = new mongoose.Schema(
  {
    dateTime: {
      type: Date,
    },
    status: {
      type: String,
    },
    requestDateTime: {
      type: Date,
    },
    responseDateTime: {
      type: Date,
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
    },
    categoryName: {
      type: String,
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
      },
    ],
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
    },
  },
  { timestamps: true, collection: 'challenges' },
);
