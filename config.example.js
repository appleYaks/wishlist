var path = require('path'),
    config;

config = {
  database: {
    client: 'sqlite',
    filename: path.join(__dirname, '/content/data/wishlist.db'),
    username: 'admin',
    password: 'password'
  }
};

module.exports = config;
