import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import DateRange from 'date-range-picker';

class App extends Component {

  tools = {
    getLastDay: () => {
      let now = new Date(),
        lastDay = new Date(now.getTime() - 1 * this.dayMSec);
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

  render() {
    var initDateRange = this.tools.initDateRange();
    console.log(initDateRange)
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
          startDate={initDateRange.starttime}
          endDate={initDateRange.endtime}
          maxDate={this.tools.getLastDay()}
          minDate={new Date("2016-01-01 00:00:00")}
        />
      </div>
    );
  }
}

export default App;
