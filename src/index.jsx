import React, { Component } from 'react';
import './style.css';
// import './style.css';

class CalendarTable extends Component {

    constructor(props) {
        super(props);
    }

    /**
     * @function 
     * @param {number 当前年份每月日历中显示的table} year 
     * @param {number 当前年份每月日历中显示的table} month 
     * @param {number 当前年份每月日历中显示的table} day 
     * @return {返回year-month-day的一个显示table数据}
     */
    displayDaysPerMonth(year, curMonth, day) {
        //定义每个月的天数，如果是闰年第二月改为29天
        let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
            daysInMonth[1] = 29
        }

        //定义一个数组，保存上一个月的天数
        // [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        // [31, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30]
        let daysInPreviousMonth = [].concat(daysInMonth)
        daysInPreviousMonth.unshift(daysInPreviousMonth.pop())

        //获取每一个月显示数据中需要补足上个月的天数数组，从0计数起
        let addDaysFromPreMonth = new Array(12)
            .fill(null)
            .map((item, index) => {
                // 看第一天是星期几
                let day = new Date(year, index, 1).getDay()
                if (day === 0) {
                    return 7
                } else {
                    return day
                }
            });

        // 判断起始结束时间在这个table中的表现形式{year, month, day}
        let { start, end, maxDate, minDate } = this.props;
        //已数组形式返回一年中每个月的显示数据,每个数据为6行*7天
        return new Array(12)
            .fill([])
            .map((month, monthIndex) => {
                let addDays = addDaysFromPreMonth[monthIndex],
                    daysCount = daysInMonth[monthIndex],
                    daysCountPrevious = daysInPreviousMonth[monthIndex],
                    monthData = [];
                let oneDaySec = 24 * 3600 * 1000,
                    maxDay = parseInt(maxDate / oneDaySec),
                    minDay = parseInt(minDate / oneDaySec);
                let curDay;
                //补足上一个月
                for (; addDays > 0; addDays--) {
                    //上一个月是否在时间段内
                    let preYear = curMonth === 1 ? (year - 1) : year,
                        preMonth = curMonth === 1 ? 12 : (curMonth - 1),
                        preDay = daysCountPrevious;
                    let preInRange = true;
                    if (this.formatYearMonthDayToDate({ year: preYear, month: preMonth, day: preDay }) < this.formatYearMonthDayToDate(start)) {
                        preInRange = false;
                    }
                    if (this.formatYearMonthDayToDate({ year: preYear, month: preMonth, day: preDay }) > this.formatYearMonthDayToDate(end)) {
                        preInRange = false;
                    }
                    let preDDay = preDay > 9 ? preDay : ('0' + preDay),
                        preMMonth = preMonth > 9 ? preMonth : ('0' + preMonth);
                    curDay = parseInt(new Date(`${preYear}/${preMMonth}/${preDDay} 00:00:00`) / oneDaySec);
                    monthData.unshift({
                        day: daysCountPrevious--,
                        isCurMonth: -1,
                        isInRange: preInRange,
                        isDisable: curDay < minDay || curDay > maxDay,
                    })
                }
                //添入当前月
                for (let i = 0; i < daysCount;) {
                    //当前月是否在时间段内
                    let curYear = year,
                        curDay = i + 1;
                    let curInRange = true;
                    if (this.formatYearMonthDayToDate({ year: curYear, month: curMonth, day: curDay }) < this.formatYearMonthDayToDate(start)) {
                        curInRange = false;
                    }
                    if (this.formatYearMonthDayToDate({ year: curYear, month: curMonth, day: curDay }) > this.formatYearMonthDayToDate(end)) {
                        curInRange = false;
                    }
                    let curDDay = curDay > 9 ? curDay : ('0' + curDay),
                        curMMonth = curMonth > 9 ? curMonth : ('0' + curMonth);
                    curDay = parseInt(new Date(`${curYear}/${curMMonth}/${curDDay} 00:00:00`) / oneDaySec);
                    monthData.push({
                        day: ++i,
                        isCurMonth: 0,
                        isInRange: curInRange,
                        isDisable: curDay < minDay || curDay > maxDay,
                    })
                }
                //补足下一个月
                for (let i = 42 - monthData.length, j = 0; j < i;) {
                    //上一个月是否在时间段内                    
                    let nextYear = curMonth === 12 ? (year + 1) : year,
                        nextMonth = curMonth === 12 ? 1 : (curMonth + 1),
                        nextDay = j + 1;
                    let nextInRange = true;
                    if (this.formatYearMonthDayToDate({ year: nextYear, month: nextMonth, day: nextDay }) < this.formatYearMonthDayToDate(start)) {
                        nextInRange = false;
                    }
                    if (this.formatYearMonthDayToDate({ year: nextYear, month: nextMonth, day: nextDay }) > this.formatYearMonthDayToDate(end)) {
                        nextInRange = false;
                    }
                    let nextDDay = nextDay > 9 ? nextDay : ('0' + nextDay),
                        nextMMonth = nextMonth > 9 ? nextMonth : ('0' + nextMonth);
                    curDay = parseInt(new Date(`${nextYear}/${nextMMonth}/${nextDDay} 00:00:00`) / oneDaySec);
                    monthData.push({
                        day: ++j,
                        isCurMonth: 1,
                        isInRange: nextInRange,
                        isDisable: curDay < minDay || curDay > maxDay,
                    })
                }
                return monthData
            })[curMonth - 1]
    }


    /**
     * 
     * @param {Object:{year:number, month: number: day: number}} YMD 
     * @return {返回YMD对应时间对象}
     */
    formatYearMonthDayToDate(YMD) {
        let { year, month, day } = YMD;
        let _year = year,
            _month = month < 9 ? ('0' + month) : month,
            _day = day < 9 ? ('0' + day) : day;
        // console.log(`${_year}-${_month}-${_day} 00:00`);
        return new Date(`${_year}/${_month}/${_day} 00:00:00`);
    }

    /**
     * 
     * @param {number 当前年份} year
     * @param {number 当前月份} month 
     * @param {array 当前年月份的 6 * 7 的二维数组}
     */
    formatMonthRows(year, month, day) {
        const days = this.displayDaysPerMonth(year, month, day);
        let rowDays = [];
        days.forEach((day, index) => {
            if ((index + 7) % 7 === 0) {
                rowDays.push(days.slice(index, index + 7));
            }
        })
        return rowDays;
    }

    /**
     * @function 返回月份对应的中文字符串
     * @param {number} month
     * @return {string} 
     */
    formatMonthStr(month) {
        const monthStrArr = ["一月", "二月", "三月", "四月", "五月",
            "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
        return monthStrArr[month - 1];
    }

    /**
     * @function tableItem点击时间处理
     */
    selectOneDay = (item) => {
        return (e) => {
            this.props.onSelect && this.props.onSelect(item)
        }
    }

    mouserOver = (item) => {
        return (e) => {
            // console.log(this.props.isHoverEffect)
            this.props.onSelect && this.props.onMouseOver && this.props.onMouseOver(item)
        }
    }


    /**
     * 
     * @param {number: 当前年份} year 
     * @param {number: 当前月份} month 
     * @param {object: 当前模式所在状态} opts
     * @return {jsx template}
     */
    renderBaseCalendar(year, month, day) {
        const monthDaysRows = this.formatMonthRows(year, month, day);
        const { isHoverEffect } = this.props;
        return (
            <div className='_calendar'>
                <div className='_calendar_head'>
                    <div className='_calendar_head_year'>
                        <span>{year + '年'}</span>
                    </div>
                    <div className='_calendar_head_month'>
                        <span>{this.formatMonthStr(month)}</span>
                    </div>
                </div>
                <table className='_calendar_body'>
                    <thead>
                        <tr>
                            <th>周日</th>
                            <th>周一</th>
                            <th>周二</th>
                            <th>周三</th>
                            <th>周四</th>
                            <th>周五</th>
                            <th>周六</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            monthDaysRows.map((row, rowIndex) => {
                                return (
                                    <tr key={rowIndex}>
                                        {
                                            // !(row[row.length - 1].isCurMonth !== 0 && row[0].isCurMonth !== 0) && row.map((item, index) => {
                                            row.map((item, index) => {
                                                return (
                                                    <td
                                                        key={index}
                                                        className={`${item.isCurMonth === 0 ? '' : '_bg_grey'} ${item.isInRange ? 'on' : ''} ${item.isDisable ? 'disable' : ''}`}
                                                        onClick={this.selectOneDay(item)}
                                                        onMouseOver={this.mouserOver(item)}
                                                    >
                                                        <span>{`${item.day}`}</span>
                                                        <span className='_day_bg'></span>
                                                    </td>
                                                )
                                            })
                                        }
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        )
    }

    render() {
        const now = new Date();
        const { year = now.getFullYear(), month = now.getMonth() + 1, day = now.getDate() } = this.props;
        return this.renderBaseCalendar(year, month, day);
    }
}

class DateMultiRangeCalendar extends Component {

    dayMSec = 24 * 3600 * 1000;

    constructor(props) {
        super(props);
        let initRange = this._initRange();
        this.state = {
            ...initRange,
            ...this._initCalendarTable(initRange),
            //处理点击行为带来的时间段变化
            clickState: 0, //0,1,2 
            firstSelectDate: new Date("1970/01/01 00:00"),
            secondSelectDate: new Date("1970/01/01 00:00"),
        }
    }

    componentWillReceiveProps(nextProps) {
        let nextRange = this._initRange(nextProps);
        let curRange = {
            start: this.state.start,
            end: this.state.end
        }
        if (!this._equalObj(nextRange, curRange)) {
            this.setState({
                ...nextRange,
                ...this._initCalendarTable(nextRange),
                //处理点击行为带来的时间段变化
                clickState: 0, //0,1,2 
            })
        }
    }

    /**
     * @function 向外暴露的获取当前日历数据的方法
     */
    getCurRangeString() {
        const { start, end } = this.state;
        return {
            starttime: this._getYMDString(start),
            endtime: this._getYMDString(end),
        }
    }
    /**
     * @function 向外暴露的获取当前日历数据的方法
     */
    getCurRangeDate() {
        const { start, end } = this.state;
        return {
            starttime: this._getCurDate(start),
            endtime: this._getCurDate(end),
        }
    }

    /**
     * 
     * @param {object 对象} Obj 
     * @param {object 对比对象} compareObj 
     */
    _equalObj(Obj, compareObj) {
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
    _initRange(props = this.props) {
        const { startDate, endDate } = props;
        return this._getRangeFromDate(startDate, endDate);
    }

    /**
    * @function 根据y-m-d返回一个时间对象
    * @param {{year:number, month:number, day:number}} YMD 
    */
    _getCurDate(YMD) {
        let { year, month, day } = YMD;
        let _year = year,
            _month = month < 9 ? ('0' + month) : month,
            _day = day < 9 ? ('0' + day) : day;
        return new Date(`${_year}/${_month}/${_day} 00:00:00`);
    }

    _getYMDString(YMD) {
        let { year, month, day } = YMD;
        let _year = year,
            _month = month < 9 ? ('0' + month) : month,
            _day = day < 9 ? ('0' + day) : day;
        return `${_year}-${_month}-${_day}`
    }

    /** 
     * @function 初始化一个YMD对象 
     */
    _initYMD() {
        return {
            year: 1970,
            month: 1,
            day: 1
        }
    }

    /**
     * 
     * @param {Date: startDate 开始日期 }
     * @param {Date: endDate 结束日期}  
     * @return {Object: {start:YMD, end: YMD}}
     */
    _getRangeFromDate(startDate, endDate) {
        let { maxDate = new Date(), minDate = new Date("1970/01/01 00:00:00") } = this.props;
        if (minDate >= maxDate) {
            maxDate = minDate;
            minDate = this.props.maxDate;
        }
        let oneDaySec = 24 * 3600 * 1000,
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
                }
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
                }
            }
        } else {
            return {
                start: this._formatDateToYMD(minDate),
                end: this._formatDateToYMD(maxDate)
            }
        }

    }

    /**
     * @function 初始化左右两个日历table
     * @param {object：当前时间段} initRange 
     * @return {返回当前时间对应的左右table的props}
     */
    _initCalendarTable(dateRange) {
        const { start, end } = dateRange;
        // 左边的table是基准
        let leftTable = Object.assign({}, start);
        // 根据起始时间生成右边时间
        return {
            leftTable: leftTable,
            rightTable: this._getRightTableByleftTable(leftTable)
        }
    }

    /**
     * @param {leftTable: YMD}
     */
    _getRightTableByleftTable(leftTable) {
        let rightYear = 1970,
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
        }
    }

    /**
     * @function 上一月
     */
    _preMonth = () => {
        let { leftTable } = this.state;
        //左边一月份向后退一月
        leftTable.day = 1;
        if (leftTable.month === 1) {
            // 上一年的12月1号            
            --leftTable.year;
            leftTable.month = 12;
        } else {
            --leftTable.month;
        }
        this.setState({
            leftTable: leftTable,
            rightTable: this._getRightTableByleftTable(leftTable)
        })
    }

    /**
     * @function 下一月
     */
    _nextMonth = () => {
        let { leftTable } = this.state;
        //左边11月份往前走一月
        leftTable.day = 1;
        if (leftTable.month === 12) {
            ++leftTable.year;
            leftTable.month = 1;
        } else {
            ++leftTable.month;
        }
        this.setState({
            leftTable: leftTable,
            rightTable: this._getRightTableByleftTable(leftTable)
        })
    }

    /**
     * 
     * @param {Date} date 
     * @return {返回当前时间的年月日}
     */
    _formatDateToYMD(date) {
        if (!(date instanceof Date)) {
            date = new Date();
        }
        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
        }
    }

    /**
     * @function 获得当前日期对应的时间对象
     * @param {*当前选中的日期} item 
     * @param {*选中日期所属table} table
     * @return {返回当前选中日期对应的时间对象}
     */
    _formatSelectItem(item, table) {
        let { year = 1970, month = 1 } = table;
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
            year,
            month,
            day: item.day
        })
    }

    /**
     * @function 点击回调事件处理
     * 
     */
    _selectCallback = (table) => {
        return (item) => {
            let { clickState, firstSelectDate, secondSelectDate } = this.state;
            secondSelectDate = this._formatSelectItem(item, table);
            if (clickState === 0) {
                //第一次点击
                firstSelectDate = this._formatSelectItem(item, table);
                clickState = 1;
            } else if (clickState === 1) {
                clickState = 0;
            }
            this.setState({
                clickState,
                firstSelectDate,
                secondSelectDate,
                ...this._getRangeFromDate(firstSelectDate, secondSelectDate)
            })
        }
    }

    _mouserOverCallback = (table) => {
        return (item) => {
            let { firstSelectDate, secondSelectDate } = this.state;
            secondSelectDate = this._formatSelectItem(item, table);
            this.setState({
                secondSelectDate,
                ...this._getRangeFromDate(firstSelectDate, secondSelectDate)
            })
        }
    }

    _getLastDay() {
        let now = new Date(),
            lastDay = new Date(now.getTime() - 1 * this.dayMSec);
        let m = lastDay.getMonth() + 1,
            d = lastDay.getDate(),
            yyyy = lastDay.getFullYear();
        let mm = m > 9 ? m : ('0' + m),
            dd = d > 9 ? d : ('0' + d);
        return new Date(`${yyyy}/${mm}/${dd} 00:00:00`)
    }

    _switchMaxMinDate() {
        let { maxDate = new Date(), minDate = new Date("1970/01/01 00:00:00") } = this.props;
        if (minDate >= maxDate) {
            maxDate = minDate;
            minDate = this.props.maxDate;
        }
        return {
            maxDate,
            minDate
        }
    }

    render() {
        const { start, end, leftTable, rightTable, firstSelectDate, clickState } = this.state;
        let { type = 'mutil' } = this.props;
        if (type !== 'mutil') {
            type = 'single'
        }
        return (
            <div className='_calendar_wrapper'>
                <div className='_pre_month' onClick={this._preMonth}></div>
                <div className='_next_month' onClick={this._nextMonth}></div>
                <div className={`_calendar_${type}`}>
                    <CalendarTable
                        {...leftTable}
                        {...this._switchMaxMinDate()}
                        start={start}
                        end={end}
                        onSelect={this._selectCallback(leftTable)}
                        onMouseOver={clickState === 1 && this._mouserOverCallback(leftTable)}
                    />
                    {
                        type === 'mutil' ? <CalendarTable
                            {...rightTable}
                            {...this._switchMaxMinDate()}
                            start={start}
                            end={end}
                            onSelect={this._selectCallback(rightTable)}
                            onMouseOver={clickState === 1 && this._mouserOverCallback(rightTable)}
                        />
                            :
                            null
                    }

                </div>
            </div>
        );
    }
}

export default DateMultiRangeCalendar;