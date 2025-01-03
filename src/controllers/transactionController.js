import getTransactionHistory from '../services/history.js'; 

// Controller to handle history API requests
export const fetchTransactionHistory = async (req, res) => {
  try {
    const filters = req.query; // Get filters from query parameters
    const result = await getTransactionHistory(filters); // Call the model function

    // Return success response
    if (result.status === 'success') {
      return res.status(200).json(result);
    }

    // Return error response
    return res.status(400).json(result);
  } catch (error) {
    // Handle unexpected errors
    return res.status(500).json({ status: 'error', message: error.message });
  }
};


