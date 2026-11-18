/**
 * @file Defines a connection to the PostgreSQL database, using environment
 * variables for connection information.
 */

const { Pool, types } = require('pg');

// node-pg returns numerics as strings by default. since we don't expect to
// have large currency values, we'll parse them as floats instead.
types.setTypeParser(1700, val => parseFloat(val));

const {
  DB_PORT = '5432',
  DB_HOST_NAME = 'localhost',
  POSTGRES_USER = 'postgres',
  POSTGRES_PASSWORD = 'password',
} = process.env;

// Create a connection pool. This generates new connections for every request.
const db = new Pool({
  host: DB_HOST_NAME,
  port: DB_PORT,
  database: 'plaid_pattern',
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  max: 5,
  idleTimeoutMillis: 10000, // close idle clients after 10 seconds
  connectionTimeoutMillis: 5000, // return an error after 5 seconds if a connection could not be established
});

// Log a hint with every database error, then rethrow it for the caller to handle.
const query = db.query.bind(db);
db.query = (...args) =>
  query(...args).catch(err => {
    console.error(
      'Database error: make sure PostgreSQL is running. If your database was created with an older version of Pattern, `npm run db:reset` may help (this deletes existing data).'
    );
    throw err;
  });

module.exports = db;
