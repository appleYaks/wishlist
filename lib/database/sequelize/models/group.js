module.exports = function(sequelize, DataTypes) {
  var Group = sequelize.define('Group', {
    title: DataTypes.STRING,
    order: DataTypes.NUMBER,
    date:  DataTypes.DATE,
    fields: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Group.hasMany(models.Task);
      }
    }
  });

  return Group;
};
