const axios = require('axios');
const inquirer = require('inquirer');

const API_URL = 'https://api.exchangerate-api.com/v4/latest/';

async function getExchangeRate(baseCurrency, targetCurrency) {
  try {
    const response = await axios.get(`${API_URL}${baseCurrency}`);
    const rates = response.data.rates;
    return rates[targetCurrency];
  } catch (error) {
    console.error('Error fetching exchange rate:', error.message);
    return null;
  }
}

async function main() {
  let exit = false;
  while (!exit) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'baseCurrency',
        message: 'Enter the base currency (e.g., USD):',
      },
      {
        type: 'input',
        name: 'targetCurrency',
        message: 'Enter the target currency (e.g., EUR):',
      },
      {
        type: 'input',
        name: 'amount',
        message: 'Enter the amount to convert:',
        validate: (value) => {
          const valid = !isNaN(parseFloat(value));
          return valid || 'Please enter a number';
        },
        filter: Number,
      },
    ]);

    const { baseCurrency, targetCurrency, amount } = answers;
    const rate = await getExchangeRate(baseCurrency.toUpperCase(), targetCurrency.toUpperCase());

    if (rate) {
      const convertedAmount = (amount * rate).toFixed(2);
      console.log(`${amount} ${baseCurrency.toUpperCase()} is equal to ${convertedAmount} ${targetCurrency.toUpperCase()}`);
    } else {
      console.log('Unable to retrieve exchange rate. Please try again.');
    }

    const { shouldExit } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'shouldExit',
        message: 'Do you want to exit?',
        default: false,
      },
    ]);

    exit = shouldExit;
  }
}

main();
