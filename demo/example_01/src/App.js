import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import DateRange from 'date-range-picker';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dateRange: this.tools.initDateRange()
    }
  }

  tools = {
    getLastDay: () => {
      const dayMSec = 24 * 3600 * 1000;
      let now = new Date(),
        lastDay = new Date(now.getTime() - 1 * dayMSec);
      let m = lastDay.getMonth() + 1,
        d = lastDay.getDate(),
        yyyy = lastDay.getFullYear();
      let mm = m > 9 ? m : ('0' + m),
        dd = d > 9 ? d : ('0' + d);
      return new Date(`${yyyy}/${mm}/${dd} 00:00:00`)
    },
    initDateRange: () => {
      const { range } = this.props;
      if (range) {
        return {
          starttime: new Date(range.starttime),
          endtime: new Date(range.endtime),
        }
      } else {
        return { ...this.tools.setNearNRangeDay(7) }
      }
    },
    setNearNRangeDay: (delta) => {
      const dayMSec = 24 * 3600 * 1000;
      const now = new Date();
      let start, end;
      end = now.getTime() - 1 * dayMSec;
      start = new Date(end).getTime() - (delta - 1) * dayMSec;
      return {
        starttime: new Date(start),
        endtime: new Date(end)
      };
    },
  }

  actions = {
    getRange: () => {
      let calendar = this.refs.dateRange;
      var nextRange = calendar.getCurRangeDate();
      console.log(nextRange);
      this.setState({
        dateRange: nextRange,
      })
    }
  }

  render() {
    const { dateRange } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <DateRange
          ref="dateRange"
          startDate={dateRange.starttime}
          endDate={dateRange.endtime}
          maxDate={this.tools.getLastDay()}
          minDate={new Date("2016-01-01 00:00:00")}
        />
        <div className='calendar-footer'>
          <button className='btn confirm' onClick={this.actions.getRange} >确定</button>
          <button className='btn cancel'>取消</button>
        </div>
      </div>
    );
  }
}

export default App;
