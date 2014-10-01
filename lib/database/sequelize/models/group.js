module.exports = function(sequelize, DataTypes) {
  var Group = sequelize.define('Group', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
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
        Group.hasMany(models.Item);
      }
    }
  });

  return Group;
};
