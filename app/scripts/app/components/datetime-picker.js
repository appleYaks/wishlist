var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

var days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

var years = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038];

var hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

var minutes = ['00', '05', 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

var AMPM = ['AM', 'PM'];

var DateTimePicker = Ember.Component.extend({
  init: function () {
    // preset selected datetime based on model
    var date = this.get('date'),
        year = moment(date).year(),
        day = moment(date).date(),
        month = moment(date).month(),
        hour = moment(date).hour(),
        minute = moment(date).minute(),
        // index for AMPM array
        ampm = hour < 12 ? 0 : 1,
        days;

    if (year < years[0] || year > years[years.length-1]) {
      year = years[0];
    }

    if (month < 0 || month > 11) {
      month = 0;
    }

    // need to set month and year before clamping the day
    this.set('selectedMonth', months[month]);
    this.set('selectedYear', year);
    // get days based on month and year
    this.getDays();
    days = this.get('days');

    if (day < 1 || day > days[days.length-1]) {
      day = 1;
    }

    this.set('selectedDay', day);

    // 0 means 12 AM
    if (hour === 0) {
      hour = 12;
    }

    if (hour < 0 || hour > 12) {
      hour = Math.abs(hour) % 12;
    }

    if (minute < 0) {
      minute = 0;
    }

    if (minute > 55) {
      minute = 55;
    }

    // clamp to 5-minute intervals, lower-bound
    minute = minute - minute % 5;

    this.set('selectedHour', hour);
    this.set('selectedMinute', minutes[minute/5]);
    this.set('selectedAMPM', AMPM[ampm]);

    if (this.get('triggerActionOnStart') === 'true') {
      this.publish();
    }

    // TODO: remove after testing
    this.set('momentDate', moment(date).format('LLL'));

    this._super();
  },

  hours: hours,
  minutes: minutes,
  ampm: AMPM,
  years: years,
  months: months,
  days: days,

  // vary days to choose from based on month/year
  getDays: function () {
    var month = this.get('selectedMonth'),
        wasSet = false,
        newDays;

    if (['Apr', 'Jun', 'Sep', 'Nov'].indexOf(month) !== -1) {
      newDays = days.slice(0, 30);
      wasSet = true;
    }

    if (month === 'Feb') {
      if (this.get('selectedYear') % 4 === 0) {
        newDays = days.slice(0, 29);
      } else {
        newDays = days.slice(0, 28);
      }

      wasSet = true;
    }

    if (!wasSet) {
      newDays = days;
    }

    if (this.get('selectedDay') > newDays.length) {
      this.set('selectedDay', newDays.length);
    }

    this.set('days', newDays);
  }.observes('selectedMonth', 'selectedYear'),

  composeDate: function () {
    var year = this.get('selectedYear'),
        month = this.get('selectedMonth'),
        day = this.get('selectedDay'),
        hour = this.get('selectedHour'),
        minute = this.get('selectedMinute'),
        ampm = this.get('selectedAMPM'),
        ISOdate;

    // compose date from its components.
    // i guess it's kinda slow, but the use of +=
    // should speed it up a bit over regular concatting
    ISOdate = month;
    ISOdate += ' ';
    ISOdate += day;
    ISOdate += ', ';
    ISOdate += year;
    ISOdate += ' ';
    ISOdate += hour;
    ISOdate += ':';
    ISOdate += minute;
    ISOdate += ' ';
    ISOdate += ampm;

    // moment will only give us the format with the local hour offset at the end
    ISOdate = moment(ISOdate, 'MMM DD, YYYY hh:mm a').format();

    // I like the unified format of having 'Z' at the end to signify UTC
    ISOdate = (new Date(ISOdate)).toISOString();

    return ISOdate;
  },

  selectWasChanged: function () {
    this.publish();
  }.observes('selectedYear', 'selectedMonth', 'selectedDay', 'selectedHour', 'selectedMinute', 'selectedAMPM'),

  publish: function () {
    this.sendAction('action', this.composeDate(), this.get('data'));
  },
});

export default DateTimePicker;
