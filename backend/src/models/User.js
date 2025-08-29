const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name : {type: String, required: true, unique: true, minlength: 2, match: /^[A-Za-z]{2,20}( [A-Za-z]{2,20}){0,10}$/},
    username : {type: String, required: true, unique: true, lowercase: true, minlength: 3, match: /^[a-z\d]{3,25}$/},
    email : {type: String, required: true, unique: true, lowercase: true, match: /^[A-Za-z\d._]{3,20}@[a-z]{4,15}\.[a-z]{2,15}$/},
    password : {type: String, select: false, required: true,},
    role: {type: String, enum: ['user', 'admin', 'superadmin'], default: 'user'}
});
userSchema.pre('save', async function(next) {
  if(!this.isModified('password')) return next()
  
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    }
});

module.exports = mongoose.model('User', userSchema);