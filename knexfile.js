const {
  DB_URL
} = process.env;

const ENV = process.env.NODE_ENV || 'development';

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations'
  },
  seeds: {
    directory: './db/seeds'
  }
};

const customConfig = {
  development: {
    connection: {
      database: 'nc_news',
      username: 'helenjanei',
      password: 'password'
    },
    production: {
      connection: {
        connectionString: DB_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    },
  },
  test: {
    connection: {
      database: 'nc_news_test',
      username: 'helenjanei',
      password: 'password'
    }
  }
};

const log = console.log;
console.log = (...args) => {
  if (!/FsMigrations/.test(args[0])) log(...args);
};

module.exports = {
  ...customConfig[ENV],
  ...baseConfig
};