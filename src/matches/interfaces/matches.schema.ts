import * as mongoose from 'mongoose';

export const MatchSchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
    },
    players: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Player',
      },
    ],
    defender: {
      type: mongoose.Types.ObjectId,
      ref: 'Player',
    },
    result: [
      {
        set: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true, collection: 'matches' },
);
