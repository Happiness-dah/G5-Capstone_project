// services/reportService.js

import Transactions from '../models/Transactions.js';
import { Op } from 'sequelize';

const generate = async (reportType, dateRange) => {
  try {
    let reportData = [];

    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);

    if (reportType === 'transactions') {
      // Fetch transactions within the date range
      reportData = await Transactions.findAll({
        where: {
          created_at: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
          },
        },
      });
    } else {
      throw new Error('Unknown report type');
    }

    return reportData;
  } catch (error) {
    throw new Error('Error generating report: ' + error.message);
  }
};

export default { generate };
