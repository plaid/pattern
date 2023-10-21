/**
 * @file Defines a connection to the PostgreSQL database, using environment
 * variables for connection information.
 */

const { Pool, types } = require('pg');

// node-pg returns numerics as strings by default. since we don't expect to
// have large currency values, we'll parse them as floats instead.
types.setTypeParser(1700, val => parseFloat(val));

// These environment variables are set in the repo root's docker-compose.yml
const { DB_PORT, DB_HOST_NAME, POSTGRES_USER, POSTGRES_PASSWORD } = process.env;

// Create a connection pool. This generates new connections for every request.
const db = new Pool({
  host: DB_HOST_NAME,
  port: DB_PORT,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  max: 5,
  min: 2,
  idleTimeoutMillis: 1000, // close idle clients after 1 second
  connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
});

module.exports = db;
