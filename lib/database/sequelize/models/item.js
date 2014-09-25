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
    fields: {
      type: DataTypes.TEXT,
      get: function () {
        return JSON.parse(this.getDataValue('fields'));
      },
      set: function (fieldsJSON) {
        return this.setDataValue('fields', JSON.stringify(fieldsJSON));
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        Item.belongsTo(models.Group);
      }
    }
  });

  return Item;
};
