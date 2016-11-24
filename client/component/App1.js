import React from 'react';
import {ProductHeader} from './ProductHeader';
import {HomeProducts} from './HomeProducts';
export class App1 extends React.Component {
    render() {
        return (
            <div id="mainBox">
                <ProductHeader />
                <HomeProducts children={this.props.children}></HomeProducts>
            </div>
        )
    }
}
