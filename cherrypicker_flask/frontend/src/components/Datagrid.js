/* eslint-disable */

import React from 'react'
import ReactDataGrid from 'react-data-grid'

let headers = ["Player", "Minutes", "FG%", "3P%", "FT%", "PPG", "APG", "RPG", "SPG", "BPG"];


const Datagrid = React.createClass({
  getInitialState() {
    this._columns = [
      {
        key: 'Player',
        width: 200,
        name: 'Player',
        sortable: true
      },
      {
        key: 'Minutes',
        name: 'Minutes',
        sortable: true
      },
      {
        key: 'FG%',
        name: 'FG%',
        sortable: true
      },
      {
        key: '3P%',
        name: '3P%',
        sortable: true
      },
      {
        key: 'PPG',
        name: 'PPG',
        sortable: true
      },
      {
        key: 'APG',
        name: 'APG',
        sortable: true
      },
      {
        key: 'RPG',
        name: 'RPG',
        sortable: true
      },
      {
        key: 'SPG',
        name: 'SPG',
        sortable: true
      },
      {
        key: 'BPG',
        name: 'BPG',
        sortable: true
      }
    ];

    let rows = this.createRows(15)

    return { rows: rows };
  },

  createRows(val) {
    let rows = [];
    for (let i = 1; i < val; i++) {
      rows.push({
        Player: i * 100,
        Minutes: Math.floor(Math.random() * 100),
        'FG%': 'temp',
        '3P%': 'temp',
        PPG: 'temp',
        APG: 'temp',
        RPG: 'temp',
        SPG: 'temp',
        BPG: 'temp',
        isSelected: false,
      });
    }
    return rows;
  },

  handleGridSort(sortColumn, sortDirection) {
    const comparer = (a, b) => {
      if (sortDirection === 'ASC') {
        return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
      } else if (sortDirection === 'DESC') {
        return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
      }
    };

    const rows = this.state.rows.sort(comparer);

    this.setState({ rows });
  },

  rowGetter(i) {
    return this.state.rows[i];
  },

  onRowClick(rowIdx, row) {
    if (rowIdx < 0) { // prevent breaking when select the header row, which would return a -1 as rowIdx
      return;
    }
    let rows = this.state.rows;

    rows[rowIdx] = Object.assign({}, row, {isSelected: !row.isSelected});
    this.setState({ rows });
  },

  onKeyDown(e) {
    console.log('See props for datagrid: ', this.props)
    if (e.ctrlKey && e.keyCode === 65) {
      e.preventDefault();

      let rows = [];
      this.state.rows.forEach((r) =>{
        rows.push(Object.assign({}, r, {isSelected: true}));
      });

      this.setState({ rows });
    }
  },

  render() {
    let rowHeight = 32;
    return  (
      <ReactDataGrid
        rowKey="id"
        columns={this._columns}
        rowGetter={this.rowGetter}
        rowsCount={this.state.rows.length}
        minHeight={rowHeight * this.state.rows.length}
        rowSelection={{
          showCheckbox: false,
          selectBy: {
            isSelectedKey: 'isSelected'
          }
        }}
        onRowClick={this.onRowClick}
        onGridKeyDown={this.onKeyDown} 
        onGridSort={this.handleGridSort}
        rowHeight={rowHeight}
        />

      );
  }
});

export default Datagrid;
