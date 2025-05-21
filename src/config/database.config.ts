export const DATABASE_CONFIG = {
    url: process.env.MONGODB_URL || 'mongodb://localhost:27017',
    dbName: process.env.MONGODB_DB_NAME || 'tres_astronautas_db'
}; 