const express = require('express');
const fs = require('fs');
const cors = require('cors');
const randomInt = require('random-int');
const morgan = require('morgan');
require('dotenv').config();
const getBankAccount = require('./js/getBankAccount');
const IBAN = require('iban');

// Instance of express
const app = express();
const port = 1337 || proces.env.PORT;

// Middleware
app.use(cors());
app.use(morgan('tiny'));

// Routes
app.get('/', async (req, res, next) => {
  try {
    res.status(200).json(await getAccount());
  } catch (err) {
    next(err);
  }
});

// Errorhandler
// Default Errorhandler Express : http://expressjs.com/en/guide/error-handling.html
// const errorHandler = (err, req, res, next) => {
//   if (res.headersSent) {
//     return next(err);
//   }
//   res.status(500);
//   console.error('Hello');
//   res.render('error', { error: err });
// };

// const logErrors = (err, req, res, next) => {
//   console.error('StackTrace: ' + err.stack);
//   next(err);
// };

app.use((err, req, res, next) => {
  console.error('StackTrace: ' + err.stack);

  res.status(500).json({
    message: 'An error has occured!',
    stack: process.env.NODE_ENV == 'development' ? err.stack : 'n/a',
  });
});

// Functions
const getBankDetails = async () => {
  const rawdata = JSON.parse(fs.readFileSync('data/checkSum00.json'));
  const rndNumber = randomInt(0, rawdata.length);
  console.log(rawdata[rndNumber]);
  return rawdata[rndNumber];
};

const getAccount = async () => {
  //   // Actual Program when input is correct, e.,g. DE for Germany

  const bankAccount = await getBankAccount(00); // Calls function from imported file getValidBankAccount to get a valid BankAccount with Method e.g. 00
  const bankDetails = await getBankDetails();
  let createAccountZeros = Array(
    10 - bankAccount.bankAccountNumber.toString().length + 1
  ).join('0'); // Calculates the missing zeros for BBAN (10 digits for DE)
  let finalBban =
    bankDetails.bankCode.toString() +
    createAccountZeros.toString() +
    bankAccount.bankAccountNumber.toString(); //bankId + leadingAccountZeros if necessary + AccountNumber
  console.log('finalBBAN: ' + finalBban);

  let finalIban = IBAN.fromBBAN('DE', finalBban); // creates the IBAN from finalBBAN with imported method

  return {
    bankAccount: {
      Iban: finalIban,
      bankCode: bankDetails.BIC,
      AccountNumber: bankAccount.bankAccountNumber,
      bankId: bankDetails.bankCode,
      bankName: bankDetails.Description,
    },
  };
};

// start server on port
app.listen(port, () => {
  console.log(`Server listening on Port: ${port}`);
});
