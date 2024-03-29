const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

const User = require('./models/User');
const Offer = require('./models/Offer');
const Address = require('./models/Address');
const Negotiation = require('./models/Negotiation');
const Purchase = require('./models/Purchase');
const Payment = require('./models/Payment');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);

const offers = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/offers.json`, 'utf-8')
);

const importData = async () => {
  try {
    await User.create(users);
    await Offer.create(offers);
    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

const deleteData = async () => {
  try {
    await Purchase.deleteMany();
    await Negotiation.deleteMany();
    await Address.deleteMany();
    await Offer.deleteMany();
    await User.deleteMany();
    await Payment.deleteMany();
    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
