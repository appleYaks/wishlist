var validateField = require('../validators/field.js');

module.exports = function(sequelize, DataTypes) {
  var Group = sequelize.define('Group', {
    title: {
      type: DataTypes.STRING,
      defaultValue: 'default title',
      validate: {
        notNull: true,
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: '',
      validate: {
        notNull: true,
      },
    },
    // JSON data => [{ type: String, key: String, val: String|Number }]
    // ex. [{ type: 'Date', key: 'expected date', val: DateISOString }]
    fields: {
      type: DataTypes.TEXT,
      defaultValue: '[]',
      validate: {
        notNull: true,
      },
    }
  }, {
    classMethods: {
      associate: function(models) {
        Group.hasMany(models.Item);
      }
    },
    validate: {
      fieldsInvalid: function () {
        var fields = this.fields;

        // client sends an array if `fields` isn't empty, but nothing if it is
        // the defaultValue is a string if nothing was sent
        if (typeof fields === 'string') {
          fields = JSON.parse(fields);
        }

        fields.forEach(validateField);
      }
    },
    getterMethods: {
      fields: function () {
        return JSON.parse(this.getDataValue('fields'));
      },
    },
    setterMethods: {
      fields: function (fieldsJSON) {
        // client sends an array if `fields` isn't empty, but nothing if it is
        // the defaultValue is a string if nothing was sent
        if (typeof fieldsJSON === 'string') {
          fieldsJSON = JSON.parse(fieldsJSON);
        }

        // scrub bad properties
        fieldsJSON.forEach(function (field) {
          for (var prop in field) {
            if (['key', 'val', 'type'].indexOf(prop) === -1) {
              delete field[prop];
            }
          }
        });

        return this.setDataValue('fields', JSON.stringify(fieldsJSON));
      }
    },
  });

  return Group;
};
