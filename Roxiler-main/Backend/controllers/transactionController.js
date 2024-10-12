const axios = require('axios');
const Transaction = require('../models/Transaction');

const initializeDatabase = async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const data = response.data;
        await Transaction.insertMany(data);
        res.status(200).json({ message: 'Database initialized with seed data' });
    } catch (error) {
        res.status(500).json({ message: 'Error initializing database', error });
    }
};

const listTransactions = async (req, res) => {
    const { month, search, page = 1, perPage = 10 } = req.query;
    const regexMonth = new RegExp(`-${month}-`, 'i');
    const query = { dateOfSale: regexMonth };

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { price: search }
        ];
    }

    try {
        const transactions = await Transaction.find(query)
            .skip((page - 1) * perPage)
            .limit(Number(perPage));
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transactions', error });
    }
};

const getStatistics = async (req, res) => {
    const { month } = req.query;
    const regexMonth = new RegExp(`-${month}-`, 'i');

    try {
        const transactions = await Transaction.find({ dateOfSale: regexMonth });
        const totalSales = transactions.reduce((sum, t) => sum + t.price, 0);
        const soldItems = transactions.filter(t => t.sold).length;
        const unsoldItems = transactions.length - soldItems;
        res.json({ totalSales, soldItems, unsoldItems });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching statistics', error });
    }
};

const getBarChartData = async (req, res) => {
    const { month } = req.query;
    const regexMonth = new RegExp(`-${month}-`, 'i');

    try {
        const transactions = await Transaction.find({ dateOfSale: regexMonth });
        const priceRanges = {
            '0-100': 0, '101-200': 0, '201-300': 0, '301-400': 0,
            '401-500': 0, '501-600': 0, '601-700': 0, '701-800': 0,
            '801-900': 0, '901-above': 0
        };

        transactions.forEach(({ price }) => {
            if (price <= 100) priceRanges['0-100']++;
            else if (price <= 200) priceRanges['101-200']++;
            else if (price <= 300) priceRanges['201-300']++;
            else if (price <= 400) priceRanges['301-400']++;
            else if (price <= 500) priceRanges['401-500']++;
            else if (price <= 600) priceRanges['501-600']++;
            else if (price <= 700) priceRanges['601-700']++;
            else if (price <= 800) priceRanges['701-800']++;
            else if (price <= 900) priceRanges['801-900']++;
            else priceRanges['901-above']++;
        });

        res.json(priceRanges);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bar chart data', error });
    }
};

const getPieChartData = async (req, res) => {
    const { month } = req.query;
    const regexMonth = new RegExp(`-${month}-`, 'i');

    try {
        const transactions = await Transaction.find({ dateOfSale: regexMonth });
        const categories = {};

        transactions.forEach(({ category }) => {
            categories[category] = (categories[category] || 0) + 1;
        });

        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pie chart data', error });
    }
};

module.exports = { initializeDatabase, listTransactions, getStatistics, getBarChartData, getPieChartData };
