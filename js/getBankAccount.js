const randomInt = require('random-int');
//const IBAN = require('iban');

const getBankAccount = async (checkMethod) => {
  // Define Methods for diff. Bank account Checks // checkmethod not in use - later use to support different calc methods of different banks
  try {
    let bankAccountCheckSumMethod = [2, 1, 2, 1, 2, 1, 2, 1, 2]; // Check Method for 00// Check Method for 00

    let rndBankAccountReverseTotal = 0; // Adds all correct array values for later use
    let bankAccountCheckSumResult = 0;

    // Define Methods for calculations
    const digitSum = (number) => {
      result = 0;
      while (number) {
        result += number % 10;
        number = parseInt(number / 10);
      }
      return result;
    };

    let rndBankAccount = randomInt(1001, 9999);
    let iRun = 0;
    //let rndBankAccountLength = rndBankAccount.toString().length
    let rndBankAccountArray = ('' + rndBankAccount).split('');
    let rndBankAccountArrayReverse = rndBankAccountArray.reverse();

    //do the Calc esp. for Sum00 Method
    rndBankAccountArrayReverse.forEach((value) => {
      rndBankAccountArrayReverse[iRun] =
        rndBankAccountArrayReverse[iRun] * bankAccountCheckSumMethod[iRun];
      if (rndBankAccountArrayReverse[iRun] > 9) {
        rndBankAccountArrayReverse[iRun] = digitSum(
          rndBankAccountArrayReverse[iRun]
        );
      }
      rndBankAccountReverseTotal += rndBankAccountArrayReverse[iRun]; // Adds the values to a totalValue for later use
      iRun += 1;
    });

    let rndBankAccountReverseTotalLastDigit = rndBankAccountReverseTotal
      .toString()
      .split('')
      .pop();
    if (rndBankAccountReverseTotal == 10) bankAccountCheckSumResult = 0;
    else bankAccountCheckSumResult = 10 - rndBankAccountReverseTotalLastDigit;
    console.log(
      'ok Account: ' +
        rndBankAccount.toString() +
        bankAccountCheckSumResult.toString()
    );
    return {
      bankAccountNumber: parseInt(
        rndBankAccount.toString() + bankAccountCheckSumResult.toString()
      ),
    };
  } catch (error) {
    console.log('Eerror');
  }
};

module.exports = getBankAccount;
