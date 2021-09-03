//routes/contractRoutes.js
const contractController = require('../controllers/contractController');
const routes = [
    {
        method: 'GET',
        url: '/api/contract/:id',
        handler: contractController.getSingleContract,
        schema: {
            response: {
                '2xx': {
                    type: 'object',
                    properties: {
                        honeypot: { type: 'boolean' },
                        address: { type: 'string' },
                        name: { type: 'string' },
                        symbol: { type: 'string' },
                        buytax: { type: 'number' },
                        selltax: { type: 'number' },
                        maxtx: { type: 'number' },
                        maxbnb: { type: 'number' },
                        maxsell: { type: 'number' },
                        message: { type: 'string' },
                    }
                }
            }
        }
    }
]
module.exports = routes
