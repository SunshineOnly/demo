/**
 * Created by Administrator on 2016/10/20.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, browserHistory} from 'react-router';
import routes from './routes';
import '../public/css/main.css';


ReactDOM.render(
    <Router history={browserHistory}>{routes}</Router>,
    document.getElementById('app')
);
