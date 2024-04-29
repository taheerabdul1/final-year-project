import mongoose from 'mongoose';

const mosqueSchema = new mongoose.Schema({
  name: String,
  address: String,
  contact: String,
});

const Mosque = mongoose.model('Mosque', mosqueSchema);

export default Mosque;