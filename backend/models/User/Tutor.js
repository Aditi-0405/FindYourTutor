const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const tutorSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: { type: String, required: true }
});

tutorSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


tutorSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Tutor', tutorSchema);