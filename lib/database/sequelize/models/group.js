module.exports = function(sequelize, DataTypes) {
  var Group = sequelize.define('Group', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
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
        Group.hasMany(models.Item);
      }
    }
  });

  return Group;
};
