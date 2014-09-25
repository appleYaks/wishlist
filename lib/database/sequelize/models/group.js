module.exports = function(sequelize, DataTypes) {
  var Group = sequelize.define('Group', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    date:  DataTypes.DATE,
    // JSON data => [{ name: String, type: String, value: String|Number }]
    // ex. [{ title: 'expected date', type: 'Date', value: DateISOString }]
    fields: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        Group.hasMany(models.Item);
      }
    }
  });

  return Group;
};
