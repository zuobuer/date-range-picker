'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./style.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import './style.css';

var CalendarTable = function (_Component) {
    _inherits(CalendarTable, _Component);

    function CalendarTable(props) {
        _classCallCheck(this, CalendarTable);

        var _this = _possibleConstructorReturn(this, (CalendarTable.__proto__ || Object.getPrototypeOf(CalendarTable)).call(this, props));

        _this.selectOneDay = function (item) {
            return function (e) {
                _this.props.onSelect && _this.props.onSelect(item);
            };
        };

        _this.mouserOver = function (item) {
            return function (e) {
                // console.log(this.props.isHoverEffect)
                _this.props.onSelect && _this.props.onMouseOver && _this.props.onMouseOver(item);
            };
        };

        return _this;
    }

    /**
     * @function 
     * @param {number 当前年份每月日历中显示的table} year 
     * @param {number 当前年份每月日历中显示的table} month 
     * @param {number 当前年份每月日历中显示的table} day 
     * @return {返回year-month-day的一个显示table数据}
     */


    _createClass(CalendarTable, [{
        key: 'displayDaysPerMonth',
        value: function displayDaysPerMonth(year, curMonth, day) {
            var _this2 = this;

            //定义每个月的天数，如果是闰年第二月改为29天
            var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
                daysInMonth[1] = 29;
            }

            //定义一个数组，保存上一个月的天数
            // [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
            // [31, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30]
            var daysInPreviousMonth = [].concat(daysInMonth);
            daysInPreviousMonth.unshift(daysInPreviousMonth.pop());

            //获取每一个月显示数据中需要补足上个月的天数数组，从0计数起
            var addDaysFromPreMonth = new Array(12).fill(null).map(function (item, index) {
                // 看第一天是星期几
                var day = new Date(year, index, 1).getDay();
                if (day === 0) {
                    return 7;
                } else {
                    return day;
                }
            });

            // 判断起始结束时间在这个table中的表现形式{year, month, day}
            var _props = this.props,
                start = _props.start,
                end = _props.end,
                maxDate = _props.maxDate,
                minDate = _props.minDate;
            //已数组形式返回一年中每个月的显示数据,每个数据为6行*7天

            return new Array(12).fill([]).map(function (month, monthIndex) {
                var addDays = addDaysFromPreMonth[monthIndex],
                    daysCount = daysInMonth[monthIndex],
                    daysCountPrevious = daysInPreviousMonth[monthIndex],
                    monthData = [];
                var oneDaySec = 24 * 3600 * 1000,
                    maxDay = parseInt(maxDate / oneDaySec),
                    minDay = parseInt(minDate / oneDaySec);
                var curDay = void 0;
                //补足上一个月
                for (; addDays > 0; addDays--) {
                    //上一个月是否在时间段内
                    var preYear = curMonth === 1 ? year - 1 : year,
                        preMonth = curMonth === 1 ? 12 : curMonth - 1,
                        preDay = daysCountPrevious;
                    var preInRange = true;
                    if (_this2.formatYearMonthDayToDate({ year: preYear, month: preMonth, day: preDay }) < _this2.formatYearMonthDayToDate(start)) {
                        preInRange = false;
                    }
                    if (_this2.formatYearMonthDayToDate({ year: preYear, month: preMonth, day: preDay }) > _this2.formatYearMonthDayToDate(end)) {
                        preInRange = false;
                    }
                    var preDDay = preDay > 9 ? preDay : '0' + preDay,
                        preMMonth = preMonth > 9 ? preMonth : '0' + preMonth;
                    curDay = parseInt(new Date(preYear + '/' + preMMonth + '/' + preDDay + ' 00:00:00') / oneDaySec);
                    monthData.unshift({
                        day: daysCountPrevious--,
                        isCurMonth: -1,
                        isInRange: preInRange,
                        isDisable: curDay < minDay || curDay > maxDay
                    });
                }
                //添入当前月
                for (var i = 0; i < daysCount;) {
                    //当前月是否在时间段内
                    var curYear = year,
                        _curDay = i + 1;
                    var curInRange = true;
                    if (_this2.formatYearMonthDayToDate({ year: curYear, month: curMonth, day: _curDay }) < _this2.formatYearMonthDayToDate(start)) {
                        curInRange = false;
                    }
                    if (_this2.formatYearMonthDayToDate({ year: curYear, month: curMonth, day: _curDay }) > _this2.formatYearMonthDayToDate(end)) {
                        curInRange = false;
                    }
                    var curDDay = _curDay > 9 ? _curDay : '0' + _curDay,
                        curMMonth = curMonth > 9 ? curMonth : '0' + curMonth;
                    _curDay = parseInt(new Date(curYear + '/' + curMMonth + '/' + curDDay + ' 00:00:00') / oneDaySec);
                    monthData.push({
                        day: ++i,
                        isCurMonth: 0,
                        isInRange: curInRange,
                        isDisable: _curDay < minDay || _curDay > maxDay
                    });
                }
                //补足下一个月
                for (var _i = 42 - monthData.length, j = 0; j < _i;) {
                    //上一个月是否在时间段内                    
                    var nextYear = curMonth === 12 ? year + 1 : year,
                        nextMonth = curMonth === 12 ? 1 : curMonth + 1,
                        nextDay = j + 1;
                    var nextInRange = true;
                    if (_this2.formatYearMonthDayToDate({ year: nextYear, month: nextMonth, day: nextDay }) < _this2.formatYearMonthDayToDate(start)) {
                        nextInRange = false;
                    }
                    if (_this2.formatYearMonthDayToDate({ year: nextYear, month: nextMonth, day: nextDay }) > _this2.formatYearMonthDayToDate(end)) {
                        nextInRange = false;
                    }
                    var nextDDay = nextDay > 9 ? nextDay : '0' + nextDay,
                        nextMMonth = nextMonth > 9 ? nextMonth : '0' + nextMonth;
                    curDay = parseInt(new Date(nextYear + '/' + nextMMonth + '/' + nextDDay + ' 00:00:00') / oneDaySec);
                    monthData.push({
                        day: ++j,
                        isCurMonth: 1,
                        isInRange: nextInRange,
                        isDisable: curDay < minDay || curDay > maxDay
                    });
                }
                return monthData;
            })[curMonth - 1];
        }

        /**
         * 
         * @param {Object:{year:number, month: number: day: number}} YMD 
         * @return {返回YMD对应时间对象}
         */

    }, {
        key: 'formatYearMonthDayToDate',
        value: function formatYearMonthDayToDate(YMD) {
            var year = YMD.year,
                month = YMD.month,
                day = YMD.day;

            var _year = year,
                _month = month < 9 ? '0' + month : month,
                _day = day < 9 ? '0' + day : day;
            // console.log(`${_year}-${_month}-${_day} 00:00`);
            return new Date(_year + '/' + _month + '/' + _day + ' 00:00:00');
        }

        /**
         * 
         * @param {number 当前年份} year
         * @param {number 当前月份} month 
         * @param {array 当前年月份的 6 * 7 的二维数组}
         */

    }, {
        key: 'formatMonthRows',
        value: function formatMonthRows(year, month, day) {
            var days = this.displayDaysPerMonth(year, month, day);
            var rowDays = [];
            days.forEach(function (day, index) {
                if ((index + 7) % 7 === 0) {
                    rowDays.push(days.slice(index, index + 7));
                }
            });
            return rowDays;
        }

        /**
         * @function 返回月份对应的中文字符串
         * @param {number} month
         * @return {string} 
         */

    }, {
        key: 'formatMonthStr',
        value: function formatMonthStr(month) {
            var monthStrArr = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
            return monthStrArr[month - 1];
        }

        /**
         * @function tableItem点击时间处理
         */

    }, {
        key: 'renderBaseCalendar',


        /**
         * 
         * @param {number: 当前年份} year 
         * @param {number: 当前月份} month 
         * @param {object: 当前模式所在状态} opts
         * @return {jsx template}
         */
        value: function renderBaseCalendar(year, month, day) {
            var _this3 = this;

            var monthDaysRows = this.formatMonthRows(year, month, day);
            var isHoverEffect = this.props.isHoverEffect;

            return _react2.default.createElement(
                'div',
                { className: '_calendar' },
                _react2.default.createElement(
                    'div',
                    { className: '_calendar_head' },
                    _react2.default.createElement(
                        'div',
                        { className: '_calendar_head_year' },
                        _react2.default.createElement(
                            'span',
                            null,
                            year + '年'
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: '_calendar_head_month' },
                        _react2.default.createElement(
                            'span',
                            null,
                            this.formatMonthStr(month)
                        )
                    )
                ),
                _react2.default.createElement(
                    'table',
                    { className: '_calendar_body' },
                    _react2.default.createElement(
                        'thead',
                        null,
                        _react2.default.createElement(
                            'tr',
                            null,
                            _react2.default.createElement(
                                'th',
                                null,
                                '\u5468\u65E5'
                            ),
                            _react2.default.createElement(
                                'th',
                                null,
                                '\u5468\u4E00'
                            ),
                            _react2.default.createElement(
                                'th',
                                null,
                                '\u5468\u4E8C'
                            ),
                            _react2.default.createElement(
                                'th',
                                null,
                                '\u5468\u4E09'
                            ),
                            _react2.default.createElement(
                                'th',
                                null,
                                '\u5468\u56DB'
                            ),
                            _react2.default.createElement(
                                'th',
                                null,
                                '\u5468\u4E94'
                            ),
                            _react2.default.createElement(
                                'th',
                                null,
                                '\u5468\u516D'
                            )
                        )
                    ),
                    _react2.default.createElement(
                        'tbody',
                        null,
                        monthDaysRows.map(function (row, rowIndex) {
                            return _react2.default.createElement(
                                'tr',
                                { key: rowIndex },

                                // !(row[row.length - 1].isCurMonth !== 0 && row[0].isCurMonth !== 0) && row.map((item, index) => {
                                row.map(function (item, index) {
                                    return _react2.default.createElement(
                                        'td',
                                        {
                                            key: index,
                                            className: (item.isCurMonth === 0 ? '' : '_bg_grey') + ' ' + (item.isInRange ? 'on' : '') + ' ' + (item.isDisable ? 'disable' : ''),
                                            onClick: _this3.selectOneDay(item),
                                            onMouseOver: _this3.mouserOver(item)
                                        },
                                        _react2.default.createElement(
                                            'span',
                                            null,
                                            '' + item.day
                                        ),
                                        _react2.default.createElement('span', { className: '_day_bg' })
                                    );
                                })
                            );
                        })
                    )
                )
            );
        }
    }, {
        key: 'render',
        value: function render() {
            var now = new Date();
            var _props2 = this.props,
                _props2$year = _props2.year,
                year = _props2$year === undefined ? now.getFullYear() : _props2$year,
                _props2$month = _props2.month,
                month = _props2$month === undefined ? now.getMonth() + 1 : _props2$month,
                _props2$day = _props2.day,
                day = _props2$day === undefined ? now.getDate() : _props2$day;

            return this.renderBaseCalendar(year, month, day);
        }
    }]);

    return CalendarTable;
}(_react.Component);

var DateMultiRangeCalendar = function (_Component2) {
    _inherits(DateMultiRangeCalendar, _Component2);

    function DateMultiRangeCalendar(props) {
        _classCallCheck(this, DateMultiRangeCalendar);

        var _this4 = _possibleConstructorReturn(this, (DateMultiRangeCalendar.__proto__ || Object.getPrototypeOf(DateMultiRangeCalendar)).call(this, props));

        _this4.dayMSec = 24 * 3600 * 1000;

        _this4._preMonth = function () {
            var leftTable = _this4.state.leftTable;
            //左边一月份向后退一月

            leftTable.day = 1;
            if (leftTable.month === 1) {
                // 上一年的12月1号            
                --leftTable.year;
                leftTable.month = 12;
            } else {
                --leftTable.month;
            }
            _this4.setState({
                leftTable: leftTable,
                rightTable: _this4._getRightTableByleftTable(leftTable)
            });
        };

        _this4._nextMonth = function () {
            var leftTable = _this4.state.leftTable;
            //左边11月份往前走一月

            leftTable.day = 1;
            if (leftTable.month === 12) {
                ++leftTable.year;
                leftTable.month = 1;
            } else {
                ++leftTable.month;
            }
            _this4.setState({
                leftTable: leftTable,
                rightTable: _this4._getRightTableByleftTable(leftTable)
            });
        };

        _this4._selectCallback = function (table) {
            return function (item) {
                var _this4$state = _this4.state,
                    clickState = _this4$state.clickState,
                    firstSelectDate = _this4$state.firstSelectDate,
                    secondSelectDate = _this4$state.secondSelectDate;

                secondSelectDate = _this4._formatSelectItem(item, table);
                if (clickState === 0) {
                    //第一次点击
                    firstSelectDate = _this4._formatSelectItem(item, table);
                    clickState = 1;
                } else if (clickState === 1) {
                    clickState = 0;
                }
                _this4.setState(_extends({
                    clickState: clickState,
                    firstSelectDate: firstSelectDate,
                    secondSelectDate: secondSelectDate
                }, _this4._getRangeFromDate(firstSelectDate, secondSelectDate)));
            };
        };

        _this4._mouserOverCallback = function (table) {
            return function (item) {
                var _this4$state2 = _this4.state,
                    firstSelectDate = _this4$state2.firstSelectDate,
                    secondSelectDate = _this4$state2.secondSelectDate;

                secondSelectDate = _this4._formatSelectItem(item, table);
                _this4.setState(_extends({
                    secondSelectDate: secondSelectDate
                }, _this4._getRangeFromDate(firstSelectDate, secondSelectDate)));
            };
        };

        var initRange = _this4._initRange();
        _this4.state = _extends({}, initRange, _this4._initCalendarTable(initRange), {
            //处理点击行为带来的时间段变化
            clickState: 0, //0,1,2 
            firstSelectDate: new Date("1970/01/01 00:00"),
            secondSelectDate: new Date("1970/01/01 00:00")
        });
        return _this4;
    }

    _createClass(DateMultiRangeCalendar, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var nextRange = this._initRange(nextProps);
            var curRange = {
                start: this.state.start,
                end: this.state.end
            };
            if (!this._equalObj(nextRange, curRange)) {
                this.setState(_extends({}, nextRange, this._initCalendarTable(nextRange), {
                    //处理点击行为带来的时间段变化
                    clickState: 0 //0,1,2 
                }));
            }
        }

        /**
         * @function 向外暴露的获取当前日历数据的方法
         */

    }, {
        key: 'getCurRangeString',
        value: function getCurRangeString() {
            var _state = this.state,
                start = _state.start,
                end = _state.end;

            return {
                starttime: this._getYMDString(start),
                endtime: this._getYMDString(end)
            };
        }
        /**
         * @function 向外暴露的获取当前日历数据的方法
         */

    }, {
        key: 'getCurRangeDate',
        value: function getCurRangeDate() {
            var _state2 = this.state,
                start = _state2.start,
                end = _state2.end;

            return {
                starttime: this._getCurDate(start),
                endtime: this._getCurDate(end)
            };
        }

        /**
         * 
         * @param {object 对象} Obj 
         * @param {object 对比对象} compareObj 
         */

    }, {
        key: '_equalObj',
        value: function _equalObj(Obj, compareObj) {
            if (JSON.stringify(Obj) === JSON.stringify(compareObj)) {
                return true;
            }
            return false;
        }

        /** 
         * @function 初始化时间段
         * @param {Object: props}
         * @return
        */

    }, {
        key: '_initRange',
        value: function _initRange() {
            var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
            var startDate = props.startDate,
                endDate = props.endDate;

            return this._getRangeFromDate(startDate, endDate);
        }

        /**
        * @function 根据y-m-d返回一个时间对象
        * @param {{year:number, month:number, day:number}} YMD 
        */

    }, {
        key: '_getCurDate',
        value: function _getCurDate(YMD) {
            var year = YMD.year,
                month = YMD.month,
                day = YMD.day;

            var _year = year,
                _month = month < 9 ? '0' + month : month,
                _day = day < 9 ? '0' + day : day;
            return new Date(_year + '/' + _month + '/' + _day + ' 00:00:00');
        }
    }, {
        key: '_getYMDString',
        value: function _getYMDString(YMD) {
            var year = YMD.year,
                month = YMD.month,
                day = YMD.day;

            var _year = year,
                _month = month < 9 ? '0' + month : month,
                _day = day < 9 ? '0' + day : day;
            return _year + '-' + _month + '-' + _day;
        }

        /** 
         * @function 初始化一个YMD对象 
         */

    }, {
        key: '_initYMD',
        value: function _initYMD() {
            return {
                year: 1970,
                month: 1,
                day: 1
            };
        }

        /**
         * 
         * @param {Date: startDate 开始日期 }
         * @param {Date: endDate 结束日期}  
         * @return {Object: {start:YMD, end: YMD}}
         */

    }, {
        key: '_getRangeFromDate',
        value: function _getRangeFromDate(startDate, endDate) {
            var _props3 = this.props,
                _props3$maxDate = _props3.maxDate,
                maxDate = _props3$maxDate === undefined ? new Date() : _props3$maxDate,
                _props3$minDate = _props3.minDate,
                minDate = _props3$minDate === undefined ? new Date("1970/01/01 00:00:00") : _props3$minDate;

            if (minDate >= maxDate) {
                maxDate = minDate;
                minDate = this.props.maxDate;
            }
            var oneDaySec = 24 * 3600 * 1000,
                maxDay = parseInt(maxDate / oneDaySec),
                minDay = parseInt(minDate / oneDaySec),
                startDay = parseInt(startDate / oneDaySec),
                endDay = parseInt(endDate / oneDaySec);
            if (startDate instanceof Date && endDate instanceof Date) {
                if (startDay >= endDay) {
                    if (endDay <= minDay) {
                        endDate = minDate;
                    }
                    if (startDay >= maxDay) {
                        startDate = maxDate;
                    }
                    return {
                        start: this._formatDateToYMD(endDate),
                        end: this._formatDateToYMD(startDate)
                    };
                } else {
                    if (startDay <= minDay) {
                        startDate = minDate;
                    }
                    if (endDay >= maxDay) {
                        endDate = maxDate;
                    }
                    return {
                        start: this._formatDateToYMD(startDate),
                        end: this._formatDateToYMD(endDate)
                    };
                }
            } else {
                return {
                    start: this._formatDateToYMD(minDate),
                    end: this._formatDateToYMD(maxDate)
                };
            }
        }

        /**
         * @function 初始化左右两个日历table
         * @param {object：当前时间段} initRange 
         * @return {返回当前时间对应的左右table的props}
         */

    }, {
        key: '_initCalendarTable',
        value: function _initCalendarTable(dateRange) {
            var start = dateRange.start,
                end = dateRange.end;
            // 左边的table是基准

            var leftTable = Object.assign({}, start);
            // 根据起始时间生成右边时间
            return {
                leftTable: leftTable,
                rightTable: this._getRightTableByleftTable(leftTable)
            };
        }

        /**
         * @param {leftTable: YMD}
         */

    }, {
        key: '_getRightTableByleftTable',
        value: function _getRightTableByleftTable(leftTable) {
            var rightYear = 1970,
                rightMonth = 1,
                rightDay = 1;
            if (leftTable.month === 12) {
                rightYear = leftTable.year + 1;
            } else {
                rightYear = leftTable.year;
                rightMonth = leftTable.month + 1;
            }
            return {
                year: rightYear,
                month: rightMonth,
                day: 1
            };
        }

        /**
         * @function 上一月
         */


        /**
         * @function 下一月
         */

    }, {
        key: '_formatDateToYMD',


        /**
         * 
         * @param {Date} date 
         * @return {返回当前时间的年月日}
         */
        value: function _formatDateToYMD(date) {
            if (!(date instanceof Date)) {
                date = new Date();
            }
            return {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            };
        }

        /**
         * @function 获得当前日期对应的时间对象
         * @param {*当前选中的日期} item 
         * @param {*选中日期所属table} table
         * @return {返回当前选中日期对应的时间对象}
         */

    }, {
        key: '_formatSelectItem',
        value: function _formatSelectItem(item, table) {
            var _table$year = table.year,
                year = _table$year === undefined ? 1970 : _table$year,
                _table$month = table.month,
                month = _table$month === undefined ? 1 : _table$month;

            switch (item.isCurMonth) {
                case -1:
                    //前一月
                    month === 1 ? (--year, month = 12) : --month;
                    break;
                case 0:
                    //当前月
                    break;
                case 1:
                    //下一个月
                    month === 12 ? (++year, month = 1) : ++month;
                    break;
            }
            return this._getCurDate({
                year: year,
                month: month,
                day: item.day
            });
        }

        /**
         * @function 点击回调事件处理
         * 
         */

    }, {
        key: '_getLastDay',
        value: function _getLastDay() {
            var now = new Date(),
                lastDay = new Date(now.getTime() - 1 * this.dayMSec);
            var m = lastDay.getMonth() + 1,
                d = lastDay.getDate(),
                yyyy = lastDay.getFullYear();
            var mm = m > 9 ? m : '0' + m,
                dd = d > 9 ? d : '0' + d;
            return new Date(yyyy + '/' + mm + '/' + dd + ' 00:00:00');
        }
    }, {
        key: '_switchMaxMinDate',
        value: function _switchMaxMinDate() {
            var _props4 = this.props,
                _props4$maxDate = _props4.maxDate,
                maxDate = _props4$maxDate === undefined ? new Date() : _props4$maxDate,
                _props4$minDate = _props4.minDate,
                minDate = _props4$minDate === undefined ? new Date("1970/01/01 00:00:00") : _props4$minDate;

            if (minDate >= maxDate) {
                maxDate = minDate;
                minDate = this.props.maxDate;
            }
            return {
                maxDate: maxDate,
                minDate: minDate
            };
        }
    }, {
        key: 'render',
        value: function render() {
            var _state3 = this.state,
                start = _state3.start,
                end = _state3.end,
                leftTable = _state3.leftTable,
                rightTable = _state3.rightTable,
                firstSelectDate = _state3.firstSelectDate,
                clickState = _state3.clickState;
            var _props$type = this.props.type,
                type = _props$type === undefined ? 'mutil' : _props$type;

            if (type !== 'mutil') {
                type = 'single';
            }
            return _react2.default.createElement(
                'div',
                { className: '_calendar_wrapper' },
                _react2.default.createElement('div', { className: '_pre_month', onClick: this._preMonth }),
                _react2.default.createElement('div', { className: '_next_month', onClick: this._nextMonth }),
                _react2.default.createElement(
                    'div',
                    { className: '_calendar_' + type },
                    _react2.default.createElement(CalendarTable, _extends({}, leftTable, this._switchMaxMinDate(), {
                        start: start,
                        end: end,
                        onSelect: this._selectCallback(leftTable),
                        onMouseOver: clickState === 1 && this._mouserOverCallback(leftTable)
                    })),
                    type === 'mutil' ? _react2.default.createElement(CalendarTable, _extends({}, rightTable, this._switchMaxMinDate(), {
                        start: start,
                        end: end,
                        onSelect: this._selectCallback(rightTable),
                        onMouseOver: clickState === 1 && this._mouserOverCallback(rightTable)
                    })) : null
                )
            );
        }
    }]);

    return DateMultiRangeCalendar;
}(_react.Component);

exports.default = DateMultiRangeCalendar;