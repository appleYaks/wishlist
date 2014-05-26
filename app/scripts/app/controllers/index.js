var IndexController = Em.ArrayController.extend({
  // if this isn't set, and the user starts on, say, /person/velma,
  // then transitions to index, the list of people will be out of
  // order (based on ID), will Velma first, even though she's not `id: 1`
  sortProperties: ['id'],
  sortAscending: true,
});

export default IndexController;
