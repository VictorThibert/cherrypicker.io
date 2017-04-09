import React from 'react'
import ReactDataGrid from 'react-data-grid'

const Datagrid = React.createClass({
  getInitialState() {
    this._columns = [
      {
        key: 'player',
        width: 200,
        name: 'Player'
      },
      {
        key: 'minutes',
        width: 200,
        name: 'Minutes'
      },
      {
        key: 'title',
        width: 200,
        name: 'Title'
      },
      {
        key: 'count',
  
        name: 'Count'
      }
    ];

    return { rows: this.createRows(15) };
  },

  createRows(val) {
    let rows = [];
    for (let i = 1; i < val; i++) {
      rows.push({
        player: 'Bob',
        minutes: i * 5,
        count: i * val,
        isSelected: false,
      });
    }
    return rows;
  },

  rowGetter(i) {
    return this.state.rows[i];
  },

  onRowClick(rowIdx, row) {
    let rows = this.state.rows;
    rows[rowIdx] = Object.assign({}, row, {isSelected: !row.isSelected});
    this.setState({ rows });
  },

  onKeyDown(e) {
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
    return  (
      <ReactDataGrid
        rowKey="id"
        columns={this._columns}
        rowGetter={this.rowGetter}
        rowsCount={this.state.rows.length}
        minHeight={500}
        rowSelection={{
          showCheckbox: false,
          selectBy: {
            isSelectedKey: 'isSelected'
          }
        }}
        onRowClick={this.onRowClick}
        onGridKeyDown={this.onKeyDown} 
        rowHeight={32}
        />

      );
  }
});

export default Datagrid;
