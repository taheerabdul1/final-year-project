import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  amount: Number,
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mosque: { type: mongoose.Schema.Types.ObjectId, ref: 'Mosque' },
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
});

const Donation = mongoose.model('Donation', donationSchema);

export default Donation;