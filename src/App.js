import React, { Component } from 'react';
import './App.css';
import Create from './components/Create';
import List from './components/List';
import moment from 'moment';
import Dropdown from 'react-dropdown'

import 'react-datepicker/dist/react-datepicker.css';
import 'react-dropdown/style.css'


class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      date: moment(),
      startHour: '',
      endHour: '',
      userName: '',
      recordList: [],
      error: '',
      lastSortedField: '',
      direction: 0,
      tdUser: 'hidden',
      tdMonth: 'hidden',
      tdSumHours: 'hidden',
      tdAvgPerDays: 'hidden',
      tdSumExtra: 'hidden',
      subFiltersClass: 'hidden',
      filterButtonsClass: 'filterTd hidden',
      filter: '',
      subFilter: '',
      copyOfPrintList: [],
      printList: [
        {userName:'avi@mail.com', year: 2018, month: 8, sum_hours: 150, avg_per_day: 15, sum_extra_hours: 50, num_of_days: 10},
        {userName:'moti@mail.com', year: 2018, month: 7, sum_hours: 110, avg_per_day: 11, sum_extra_hours: 10, num_of_days: 10},
        {userName:'gaya@mail.com', year: 2018, month: 6, sum_hours: 120, avg_per_day: 12, sum_extra_hours: 20, num_of_days: 10}
      ]
    }
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeFilter = this.onChangeFilter.bind(this);
    this.onChangeSubFilter = this.onChangeSubFilter.bind(this);
    this.doFilter = this.doFilter.bind(this);
  }

  hours = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24']

  filters = [
    {value: 'userName', label: 'User Name'},
    {value: 'month', label: 'Month'},
    {value: 'sum_hours', label: 'Sum of Hours'},
    {value: 'avg_per_day', label: 'Average Hours Per Days'},
    {value: 'sum_extra_hours', label: 'Sum of Extra Hours'}
  ]

  subFilters = [];

  onChangeDate = date => this.setState({ date: date, error: '' });
  onChangeStartHour = startHour => this.setState({ startHour: startHour.value, error: '' });
  onChangeEndHour = endHour => this.setState({ endHour: endHour.value, error: '' });

  onChangeName(e) {
    this.setState({userName: e.target.value, error: ''});
  }

  validate = e => {
    e.preventDefault();
    
    var n = this.state.userName;
    var d = this.state.date;
    var sh = this.state.startHour;
    var eh = this.state.endHour;
    var er = 0;

    var tmpList = [];
    tmpList = this.state.recordList;

    if(!this.nameIsValid(n)){
      this.setState({error: 'The username you entered is not valid.'});
      er = 1;
    }

    if(eh - sh <= 0){
      this.setState({error: 'End time must be after Start time.'});
      er = 1;
    }

    for(let i=0; i<tmpList.length; i++){
      if(tmpList[i].userName === n){
        if(tmpList[i].date === d){
          this.setState({error: 'You already entered hours for this user on this date.'});
          er = 1;
        }
      }
    }

    if(er === 0){
      var rec = {
        userName: n,
        date: d,
        startHour: sh,
        endHour: eh,
      };

      tmpList.push(rec);
      this.setState({ recordList: tmpList })

      var isExist = 0;
      var tmpList2 = [];
      tmpList2 = this.state.printList;
      for(let i=0; i<tmpList2.length; i++){
        if(tmpList2[i].userName === n){
          if(tmpList2[i].month === d.month()+1 && tmpList2[i].year === d.year()){
            isExist = 1;
            tmpList2[i].num_of_days += 1;
            tmpList2[i].sum_hours += eh-sh;
            tmpList2[i].sum_extra_hours += eh-sh > 8 ? eh-sh-8 : 0;
            tmpList2[i].avg_per_day = tmpList2[i].sum_hours / tmpList2[i].num_of_days;
          }
        }
      }

      if(isExist === 0){
        tmpList2.push({userName: n, year: d.year(), month: d.month()+1, sum_hours: eh-sh, avg_per_day: eh-sh, sum_extra_hours: eh-sh > 8 ? eh-sh-8 : 0, num_of_days: 1});
        this.setState({ printList: tmpList2 })
      }
      
    }
  
  }

  onChangeFilter(col) {
    var tmplst = [];
    tmplst = this.state.printList;
    if(this.state.copyOfPrintList.length > 0){
      this.setState({ printList: this.state.copyOfPrintList });
      tmplst = this.state.copyOfPrintList;
    }
    this.setState({ subFilter: '' });
    this.subFilters = [];
    this.setState({ filter: col.label });
    this.setState({ subFiltersClass: 'visible' });
    this.subFilters = [];
    
    for(let i=0; i<tmplst.length; i++){
      switch(col.value){
        case 'userName':
          this.subFilters.push(tmplst[i].userName);
          break;
        case 'month':
          this.subFilters.push(tmplst[i].month + '/' + tmplst[i].year);
          break;
        case 'sum_hours':
          this.subFilters.push(tmplst[i].sum_hours);
          break;
        case 'avg_per_day':
          this.subFilters.push(tmplst[i].avg_per_day);
          break;
        case 'sum_extra_hours':
          this.subFilters.push(tmplst[i].sum_extra_hours);
          break;
        default:
          break;
      }
    }
  }

  onChangeSubFilter(val) {
    this.setState({ filterButtonsClass: 'visible' });
    this.setState({ subFilter: val.value });
  }

  doFilter() {
    var copyOfPrintList = [];
    copyOfPrintList = this.state.printList;
    this.setState({ copyOfPrintList: copyOfPrintList });
    var tmplst = [];
    for(let i=0; i<copyOfPrintList.length; i++){
      switch(this.state.filter) {
        case 'User Name':
          if(copyOfPrintList[i].userName === this.state.subFilter) {
            tmplst.push(copyOfPrintList[i]);
          }
          break;
        case 'Month':
          if(copyOfPrintList[i].month + '/' + copyOfPrintList[i].year === this.state.subFilter) {
            tmplst.push(copyOfPrintList[i]);
          }
          break;
        case 'Sum of Hours':
          if(copyOfPrintList[i].sum_hours === this.state.subFilter) {
            tmplst.push(copyOfPrintList[i]);
          }
          break;
        case 'Average Hours Per Days':
          if(copyOfPrintList[i].avg_per_day === this.state.subFilter) {
            tmplst.push(copyOfPrintList[i]);
          }
          break;
        case 'Sum of Extra Hours':
          if(copyOfPrintList[i].sum_extra_hours === this.state.subFilter) {
            tmplst.push(copyOfPrintList[i]);
          }
          break;
        default:
          break;
      }
      this.setState({ printList: tmplst });
    }
  }


  sort(field){
    var lastSortedField = this.state.lastSortedField;
    var dir = this.state.direction;
    if(lastSortedField === field){
      dir === 0 ? dir = 1 : dir = 0;
    }else{
      dir = 0;
    }
    this.setState({ direction: dir })

    var tList = [];
    tList = this.state.printList;
    if(tList.length > 1) {

      this.setState({ tdUser: 'hidden' });
      this.setState({ tdMonth: 'hidden' });
      this.setState({ tdSumHours: 'hidden' });
      this.setState({ tdAvgPerDays: 'hidden' });
      this.setState({ tdSumExtra: 'hidden' });

      for(let i=0; i<tList.length-1; i++){
        for(let j=i+1; j<tList.length; j++){
          if(j===i){
            continue;
          }
          switch(field){
            case 'user':
              if(dir === 0){
                if(tList[i].userName > tList[j].userName){
                  this.setState({ tdUser: 'up visible' });
                  this.swap(tList[i], tList[j]);
                }
              }else{
                if(tList[i].userName < tList[j].userName){
                  this.setState({ tdUser: 'down visible' });
                  this.swap(tList[i], tList[j]);
                }
              }
              break;
            case 'month':
              if(dir === 0){
                if((tList[i].month > tList[j].month && tList[i].year === tList[j].year) || tList[i].year > tList[j].year){
                  this.setState({ tdMonth: 'up visible' });
                  this.swap(tList[i], tList[j]);
                }
              }else{
                if((tList[i].month < tList[j].month && tList[i].year === tList[j].year) || tList[i].year < tList[j].year){
                  this.setState({ tdMonth: 'down visible' });
                  this.swap(tList[i], tList[j]);
                }
              }
              break;
            case 'sumHours':
              if(dir === 0){
                if(tList[i].sum_hours > tList[j].sum_hours){
                  this.setState({ tdSumHours: 'up visible' });
                  this.swap(tList[i], tList[j]);
                }
              }else{
                if(tList[i].sum_hours < tList[j].sum_hours){
                  this.setState({ tdSumHours: 'down visible' });
                  this.swap(tList[i], tList[j]);
                }
              }
              break;
            case 'avg':
              if(dir === 0){
                if(tList[i].avg_per_day > tList[j].avg_per_day){
                  this.setState({ tdAvgPerDays: 'up visible' });
                  this.swap(tList[i], tList[j]);
                }
              }else{
                if(tList[i].avg_per_day < tList[j].avg_per_day){
                  this.setState({ tdAvgPerDays: 'down visible' });
                  this.swap(tList[i], tList[j]);
                }
              }
              break;
            case 'sumExtra':
              if(dir === 0){
                if(tList[i].sum_extra_hours > tList[j].sum_extra_hours){
                  this.setState({ tdSumExtra: 'up visible' });
                  this.swap(tList[i], tList[j]);
                }
              }else{
                if(tList[i].sum_extra_hours < tList[j].sum_extra_hours){
                  this.setState({ tdSumExtra: 'down visible' });
                  this.swap(tList[i], tList[j]);
                }
              }
              break;
            default:
              break;
          }
        }
      }
    }
    this.setState({ lastSortedField: field })
  }

  swap(rec1, rec2) {
    let tmp = {};
    tmp.userName = rec1.userName;
    tmp.year = rec1.year;
    tmp.month = rec1.month;
    tmp.sum_hours = rec1.sum_hours;
    tmp.avg_per_day = rec1.avg_per_day;
    tmp.sum_extra_hours = rec1.sum_extra_hours;
    tmp.num_of_days = rec1.num_of_days;

    rec1.userName = rec2.userName;
    rec1.year = rec2.year;
    rec1.month = rec2.month;
    rec1.sum_hours = rec2.sum_hours;
    rec1.avg_per_day = rec2.avg_per_day;
    rec1.sum_extra_hours = rec2.sum_extra_hours;
    rec1.num_of_days = rec2.num_of_days;

    rec2.userName = tmp.userName;
    rec2.year = tmp.year;
    rec2.month = tmp.month;
    rec2.sum_hours = tmp.sum_hours;
    rec2.avg_per_day = tmp.avg_per_day;
    rec2.sum_extra_hours = tmp.sum_extra_hours;
    rec2.num_of_days = tmp.num_of_days;
  }

  nameIsValid(n) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(n).toLowerCase());
  }

  render() {
    return (
      <div className='App'>
        <h1>Hour Report</h1>
        <Create 
          onChangeDate = {this.onChangeDate}
          onChangeStartHour = {this.onChangeStartHour}
          onChangeEndHour = {this.onChangeEndHour}
          onChangeName = {this.onChangeName}
          date = {this.state.date}
          startHour = {this.state.startHour}
          endHour = {this.state.endHour}
          validate = {this.validate}
          userName = {this.state.userName}
          hours = {this.hours}
          error = {this.state.error}
        />
        <div className='records'>
          <table className=''>
            <tbody>
              <tr>
                <td className='filterTd'>
                  <Dropdown options={this.filters} onChange={this.onChangeFilter} value={this.state.filter} placeholder='Filter By...' />
                </td>
                <td className='filterTd'>
                  <Dropdown options={this.subFilters} onChange={this.onChangeSubFilter} value={this.state.subFilter} className={this.state.subFiltersClass}/>
                </td>
                <td className={this.state.filterButtonsClass}>
                  <button onClick={this.doFilter}><a class="fa magnifying-glass"></a> Filter... </button>
                </td>
              </tr>
            </tbody>
          </table>
          <table className='recTable'>
            <tbody>
              <tr>
                <td className='recTd' onClick={()=>this.sort('user')}><i className={this.state.tdUser}></i> User Name</td>
                <td className='recTd' onClick={()=>this.sort('month')}><i className={this.state.tdMonth}></i> Month</td>
                <td className='recTd' onClick={()=>this.sort('sumHours')}><i className={this.state.tdSumHours}></i> Sum of Hours</td>
                <td className='recTd' onClick={()=>this.sort('avg')}><i className={this.state.tdAvgPerDays}></i> Average Hours Per Days</td>
                <td className='recTd' onClick={()=>this.sort('sumExtra')}><i className={this.state.tdSumExtra}></i> Sum of Extra Hours</td>
              </tr>
              {this.state.printList.map((rec, i) => <List key = {i} 
                  printList = {rec} />)}
            </tbody>
          </table>
          </div>
      </div>
    );
  }
}

export default App;
