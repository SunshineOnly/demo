/**
 * Created by Administrator on 2016/10/20.
 */
import React from 'react';
import {Route, IndexRoute} from 'react-router';
import {App} from './component/App';
import {App1} from './component/App1';
import {Home} from './component/Home';
import {IndexTable} from './component/IndexTable';
import {NewRequire} from './component/NewRequire';
import {LogoGather} from './component/Introduce';
import {ProductInfo} from './component/ProductInfo';
import {ProductPublish} from './component/ProductPublish';
/**
 * 配置react路由
 */
export default (
    <Route>
        <Route component={App1}>
            <Route path="/index" component={ProductInfo}/>
            <Route path="/publish/index" component={ProductPublish}/>
        </Route>
        <Route path="/" component={LogoGather}></Route>
        <Route component={App}>
            <Route path="/main" component={Home}>
                <IndexRoute component={IndexTable}/>
                <Route path="page" component={NewRequire}/>
            </Route>
        </Route>
    </Route>
)