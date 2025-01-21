// services/PaystackService.js
import fetch from 'node-fetch' // Assuming you use node-fetch or any fetch polyfill for Node.js

export const resolveBankAccountPaystack = async (bankName, accountNumber) => {
  const bankCode = getBankCodePaystack(bankName) // Function that maps bank name to Paystack code

  const resolveUrl = `https://api.paystack.co/bank/resolve?account_number=${encodeURIComponent(
    accountNumber
  )}&bank_code=${encodeURIComponent(bankCode)}`

  try {
    const resolveResponse = await fetch(resolveUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Cache-Control': 'no-cache'
      }
    })

    const resolveData = await resolveResponse.json()

    if (!resolveResponse.ok) {
      throw new Error(
        resolveData.error ||
          'An error occurred while resolving the bank account.'
      )
    }

    return resolveData.data
  } catch (error) {
    throw new Error(`Internal server error: ${error.message}`)
  }
}

const getBankCodePaystack = bankName => {
  // Bank Code Mapping between VTU Africa and Paystack
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
}
