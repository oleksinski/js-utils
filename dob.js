/**
 * @param dateNowString - format "YYYY-MM-DD" [optional, can be used for testing]
 * @returns {Object}
 * @constructor
 */
function DOB(dateNowString) {


    var dateNow = dateNowString !== undefined ? new Date(dateNowString) : new Date();

    // @properties

    var minAge = 18;
    var maxAge = 84;

    var yearNow = dateNow.getFullYear();
    var monthNow = dateNow.getMonth(); // 0-11
    var dayOfMonthNow = dateNow.getDate(); // 1-31

    var yearMin = yearNow - maxAge;
    var yearMax = yearNow - minAge;

    var dateMin = new Date(yearMin, monthNow, dayOfMonthNow);
    var dateMax = new Date(yearMax, monthNow, dayOfMonthNow);

    var yearsN = maxAge - minAge + 1;

    var yearsRange = Array.apply(null, {length: yearsN}).map(function(value, index){
        return yearMin + index;
    });

    // ---

    function parseUserInputDayOfMonth(dayOfMonth) {
        return parseInt(dayOfMonth, 10);
    }

    /**
     *
     * @param dayOfMonth - should be compatible with the Date() format [1-31]
     * @returns {boolean}
     */
    function isValidDayOfMonth(dayOfMonth) {
        return !isNaN(dayOfMonth) && dayOfMonth >= 1 && dayOfMonth <= 31;
    }

    // ---

    function parseUserInputMonth(month) {
        var m = parseInt(month, 10);
        if (!isNaN(m)) {
            m -= 1;
        }
        return m;
    }

    /**
     * @param month - should be compatible with the Date() format [0-11]
     * @returns {boolean}
     */
    function isValidMonth(month) {
        return !isNaN(month) && month >= 0 && month <= 11;
    }

    // ---

    function parseUserInputYear(year) {
        return parseInt(year, 10);
    }

    /**
     * @param year - should be compatible with the Date() format [YYYY]
     * @returns {boolean}
     */
    function isValidYear(year) {
        return !isNaN(year) && year >= yearMin && year <= yearMax;
    }

    // ---

    /**
     * @param month - should be compatible with the Date() format [0-11]
     * @param year - should be compatible with the Date() format [YYYY]
     * @returns {*}
     */
    function getDaysInMonth(month, year) {
        switch (month) {
            case 1 :
                return (year % 4 === 0 && year % 100) || year % 400 === 0 ? 29 : 28;
            case 8 :
            case 3 :
            case 5 :
            case 10 :
                return 30;
            default :
                return 31
        }
    }

    // ---

    function isValidDate(dayOfMonth, month, year) {
        if (!isValidDayOfMonth(dayOfMonth) && !isValidMonth(month) && !isValidYear(year)) {
            return false;
        }
        // check leap year
        return dayOfMonth <= getDaysInMonth(month, year);
    }

    /**
     * All input parameters should be compatible with the Date() format
     *
     * @param dayOfMonth - Date() format [1-31]
     * @param month - Date() format [0-11]
     * @param year - Date() format [YYYY]
     */
    function isOver18Years(dayOfMonth, month, year) {
        if (!isValidDate(dayOfMonth, month, year)) {
            return false;
        }

        var d = new Date(year, month, dayOfMonth);

        // anything involving '=' should use the '+' prefix
        // it will then compare the dates' millisecond values

        return (+d >= +dateMin) && (+d <= +dateMax);
    }

    return {
        getYearsRange: function () {
            return yearsRange;
        },

        validateUserInputDayOfMonth: function (dayOfMonth) {
            return isValidDayOfMonth(parseUserInputDayOfMonth(dayOfMonth));
        },

        validateUserInputMonth: function (month) {
            return isValidMonth(parseUserInputMonth(month));
        },

        validateUserInputYear: function (year) {
            return isValidYear(parseUserInputYear(year));
        },

        validateUserOver18Years: function (dayOfMonth, month, year) {
            var d = parseUserInputDayOfMonth(dayOfMonth);
            var m = parseUserInputMonth(month);
            var y = parseUserInputYear(year);

            return isOver18Years(d, m, y);
        }
    };
}

// tests

var assert = function(condition, message) {
    if (!condition)
        throw Error("Assert failed" + (typeof message !== "undefined" ? ": " + message : ""));
};

var dob = new DOB("2018-06-27");

var dobYearsRange = dob.getYearsRange();
assert(dobYearsRange.length === 67);
assert(dobYearsRange[0] === 1934);
assert(dobYearsRange[dobYearsRange.length - 1] === 2000);

// check date input
for (var d = 1; d <= 31; d++) {
    assert(dob.validateUserInputDayOfMonth(d));
    assert(dob.validateUserInputDayOfMonth("" + d));
    assert(dob.validateUserInputDayOfMonth("0" + d));
    assert(dob.validateUserInputDayOfMonth("00" + d));
}
assert(!dob.validateUserInputDayOfMonth(-1), "day of month -1");
assert(!dob.validateUserInputDayOfMonth(0), "day of month 0");
assert(!dob.validateUserInputDayOfMonth(32), "day of month 32");

// check month input
for (var m = 1; m <= 12; m++) {
    assert(dob.validateUserInputMonth(m));
    assert(dob.validateUserInputMonth("" + m));
    assert(dob.validateUserInputMonth("0" + m));
    assert(dob.validateUserInputMonth("00" + m));
}

assert(!dob.validateUserInputMonth(-1), "month -1");
assert(!dob.validateUserInputMonth(0), "month 0");
assert(!dob.validateUserInputMonth(13), "month 13");

// check year input
assert(dob.validateUserInputYear(dobYearsRange[0]));
assert(dob.validateUserInputYear(dobYearsRange[dobYearsRange.length - 1]));
assert(!dob.validateUserInputYear(dobYearsRange[0] - 1));
assert(!dob.validateUserInputYear(dobYearsRange[dobYearsRange.length - 1] + 1));

assert(dob.validateUserOver18Years(27, 6, 2000), "27-06-2000"); // max range allowed
assert(dob.validateUserOver18Years(27, 6, 1934), "27-06-1934"); // min range allowed

assert(!dob.validateUserOver18Years(27, 7, 2000), "27-07-2000"); // above allowed range
assert(!dob.validateUserOver18Years(27, 5, 1934), "27-05-1934"); // below allowed range

assert(dob.validateUserOver18Years(29, 2, 1996), "29-02-1996"); // leap year
assert(!dob.validateUserOver18Years(29, 2, 1995), "29-02-1995"); // non existent leap year

