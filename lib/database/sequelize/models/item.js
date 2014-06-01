module.exports = function(sequelize, DataTypes) {
  var Item = sequelize.define('Item', {
    title: DataTypes.STRING,
    rating: DataTypes.INTEGER,
    date:  DataTypes.DATE,
    priority: DataTypes.INTEGER,
    complete: DataTypes.BOOLEAN,
    fields: DataTypes.TEXT // JSON data
  }, {
    classMethods: {
      associate: function(models) {
        Item.belongsTo(models.Group);
      }
    }
  });

  return Item;
};
