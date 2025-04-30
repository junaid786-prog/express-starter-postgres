const { sequelize, testConnection } = require('../config/database');
const logger = require('../config/logger');

// Import all models to ensure they're registered with Sequelize
require('../api/models');

const startDatabase = async () => {
    try {
        // Test database connection
        await testConnection();

        // Sync models with database
        if (process.env.NODE_ENV === 'development' && process.env.DB_SYNC === 'true') {
            logger.info('Syncing database models...');
            await sequelize.sync({ alter: true });
            logger.info('Database sync completed');
        }

        return sequelize;
    } catch (error) {
        logger.error('Database initialization failed:', error);
        throw error;
    }
};

module.exports = startDatabase;