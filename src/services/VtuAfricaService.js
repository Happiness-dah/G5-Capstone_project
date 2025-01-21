// services/VtuAfricaService.js
import fetch from 'node-fetch';

export const verifyBankDetailsVtu = async (bankName, accountNumber) => {
  const bankCode = getBankCodeVtu(bankName); // Function that maps bank name to VTU Africa code

  const host = `https://vtuafrica.com.ng/portal/api/merchant-verify/?apikey=1234&serviceName=BankTransfer&accountNo=${encodeURIComponent(accountNumber)}&bankcode=${encodeURIComponent(bankCode)}`;

  try {
    const response = await fetch(host, {
      method: 'GET',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'An error occurred while verifying the bank details.');
    }

    return data;
  } catch (error) {
    throw new Error(`Internal server error: ${error.message}`);
  }
};

const getBankCodeVtu = (bankName) => {
    const bankCodeMapping = {
        'Access Bank Nigeria': {
          vtuAfrica: '044',
          paystack: '44'
        },
        'Ecobank Nigeria PLC': {
          vtuAfrica: '050',
          paystack: '50'
        },
        'Fidelity Bank PLC': {
          vtuAfrica: '070',
          paystack: '70'
        },
        'First Bank PLC': {
          vtuAfrica: '011',
          paystack: '11'
        },
        'First City Monument Bank (FCMB)': {
          vtuAfrica: '214',
          paystack: '214'
        },
        'GTBank PLC': {
          vtuAfrica: '058',
          paystack: '58'
        },
        'Polaris Bank PLC': {
          vtuAfrica: '076',
          paystack: '76'
        },
        'Providus Bank PLC': {
          vtuAfrica: '101',
          paystack: '101'
        },
        'Stanbic IBTC Bank PLC': {
          vtuAfrica: '221',
          paystack: '221'
        },
        'Sterling Bank PLC': {
          vtuAfrica: '232',
          paystack: '232'
        },
        'Union Bank of Nigeria PLC': {
          vtuAfrica: '032',
          paystack: '32'
        },
        'United Bank for Africa PLC (UBA)': {
          vtuAfrica: '033',
          paystack: '33'
        },
        'Zenith Bank PLC': {
          vtuAfrica: '057',
          paystack: '57'
        },
        'Wema Bank PLC': {
          vtuAfrica: '035',
          paystack: '35'
        }
        // Add more banks as needed
      }
};
