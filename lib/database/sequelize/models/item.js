module.exports = function(sequelize, DataTypes) {
  var Item = sequelize.define('Item', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    rating: DataTypes.INTEGER,
    date:  DataTypes.DATE,
    priority: DataTypes.INTEGER,
    complete: DataTypes.BOOLEAN,
    // JSON data => [{ name: String, type: String, value: String|Number }]
    // ex. [{ title: 'expected date', type: 'Date', value: DateISOString }]
    fields: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        Item.belongsTo(models.Group);
      }
    }
  });

  return Item;
};
