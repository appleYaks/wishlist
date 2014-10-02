module.exports = function(sequelize, DataTypes) {
  var Item = sequelize.define('Item', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    rating: DataTypes.INTEGER,
    priority: DataTypes.INTEGER,
    complete: DataTypes.BOOLEAN,
    // JSON data => [{ type: String, key: String, val: String|Number }]
    // ex. [{ type: 'Date', key: 'expected date', val: DateISOString }]
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
