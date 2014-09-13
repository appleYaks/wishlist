function sequelizeTransform (type, prefix, id) {
  if (typeof id !== 'number' && isNaN(+id)) {
    throw new Error('Tried to get all of a prefixed type, but the id was not in a proper format!', id);
  }

  id = +id;

  // change prefix to fit Sequelize property name style
  // original type is like 'groups', need 'GroupId'
  prefix = prefix[0].toUpperCase() + prefix.slice(1, prefix.length-1);
  prefix += 'Id';

  return [type, prefix, id];
}

export default sequelizeTransform;