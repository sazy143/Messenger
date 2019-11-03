import React from 'react';
import ReactDOM from 'react-dom';
import Main from './MainPage.js';
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory({
    basename: process.env.PUBLIC_URL
});

ReactDOM.render(<Main />, document.getElementById('root'));
