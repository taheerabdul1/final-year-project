import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  isAdmin: { type: Boolean, default: false },
  chosenMosqueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mosque' },
  campaigns: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
    },
  ],
});

//not sure what this does
//read below
/*

This plugin simplifies the process of adding password-based authentication using Passport.js.

This is what it does:

Adds fields: It automatically adds a username, a hashed password, and a salt field to the schema to store the credentials securely.
Provides methods: It includes methods like .authenticate(), .serializeUser(), and .deserializeUser() which are essential for handling user login sessions.
Handles hashing: It takes care of hashing passwords and verifying hashed passwords.

*/
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

export default User;