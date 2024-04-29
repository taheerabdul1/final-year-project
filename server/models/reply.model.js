import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  content: { type: String, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const Reply = mongoose.model('Reply', replySchema);

export default Reply;