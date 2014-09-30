var months = [{
  name: 'Jan', val: 1
}, {
  name: 'Feb', val: 2
}, {
  name: 'Mar', val: 3
}, {
  name: 'Apr', val: 4
}, {
  name: 'May', val: 5
}, {
  name: 'Jun', val: 6
}, {
  name: 'Jul', val: 7
}, {
  name: 'Aug', val: 8
}, {
  name: 'Sep', val: 9
}, {
  name: 'Oct', val: 10
}, {
  name: 'Nov', val: 11
}, {
  name: 'Dec', val: 12
}];

var days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

var years = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038];

var DateTimePicker = Ember.Component.extend({
  init: function () {
    // preset selected date based on model
    var modelDate = this.get('modelDate'),
        year = moment(modelDate).year(),
        day = moment(modelDate).date(),
        month = moment(modelDate).month(),
        days;

    if (year < years[0] || year > years[years.length-1]) {
      year = years[0];
    }

    if (month < 0 || month > months.length) {
      month = 0;
    }

    // need to set month and year before clamping the day
    this.set('selectedMonth', months[month]);
    this.set('selectedYear', year);
    // get days based on month and year
    days = this.get('days');

    if (day < 1 || day > days[days.length-1]) {
      day = 1;
    }

    this.set('selectedDay', day);

    // TODO: remove after testing
    this.set('momentDate', moment(modelDate).format('LLL'));

    this._super();
  },

  years: years,
  months: months,
  // vary days to choose from based on month/year
  days: function () {
    var month = this.get('selectedMonth');

    if (['Apr', 'Jun', 'Sep', 'Nov'].indexOf(month)) {
      return days.slice(0, 30);
    }

    if (month === 'Feb') {
      if (this.get('selectedYear') % 4 === 0) {
        return days.slice(0, 29);
      }

      return days.slice(0, 28);
    }

    return days;
  }.property('selectedMonth', 'selectedYear'),

  selectChanged: function () {
    alert('wooty woot!');
  }
});

export default DateTimePicker;
