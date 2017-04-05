import React from 'react';
import ReactDOM from 'react-dom';
import Appexport from './App';
import Playground from './Playground'
import './index.css';

ReactDOM.render(
    <div>
        <Appexport />
        <Playground />
    </div>,
    document.getElementById('root')
);
