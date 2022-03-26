const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking must belong to a Tour!']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a User!']
  },
  price: {
    type: Number,
    require: [true, 'Booking must have a price.']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  verified: {
    type: Boolean,
    default: true
  },
  userID: String
});

bookingSchema.pre(/^find/, function(next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name guides'
  });
  next();
});
bookingSchema.pre('save', function(next) {
  this.userID = this.user.id;
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
