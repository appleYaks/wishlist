module.exports = function(sequelize, DataTypes) {
  var Group = sequelize.define('Group', {
    title: DataTypes.STRING,
    order: DataTypes.INTEGER,
    date:  DataTypes.DATE,
    fields: DataTypes.TEXT // JSON data
  }, {
    classMethods: {
      associate: function(models) {
        Group.hasMany(models.Item);
      }
    }
  });

  return Group;
};
