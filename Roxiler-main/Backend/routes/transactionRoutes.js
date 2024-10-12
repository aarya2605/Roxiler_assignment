const express = require('express');
const router = express.Router();
const { initializeDatabase, listTransactions, getStatistics, getBarChartData, getPieChartData } = require('../controllers/transactionController');

router.get('/initialize', initializeDatabase);
router.get('/transactions', listTransactions);
router.get('/statistics', getStatistics);
router.get('/bar-chart', getBarChartData);
router.get('/pie-chart', getPieChartData);

module.exports = router;
