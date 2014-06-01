module.exports = function(sequelize, DataTypes) {
  var Item = sequelize.define('Item', {
    title: DataTypes.STRING,
    rating: DataTypes.NUMBER,
    date:  DataTypes.DATE,
    priority: DataTypes.NUMBER,
    complete: DataTypes.BOOLEAN,
    fields: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Item.belongsTo(models.Group);
      }
    }
  });

  return Item;
};
