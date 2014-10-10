module.exports = function(sequelize, DataTypes) {
  var Item = sequelize.define('Item', {
    title: {
      type: DataTypes.STRING,
      defaultValue: 'default title',
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    rating: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    priority: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    complete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
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
