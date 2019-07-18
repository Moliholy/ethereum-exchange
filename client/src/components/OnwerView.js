import React, { Component } from 'react';


class OwnerView extends Component {
    render() {
        return (
            <div className="App">
                <h1>I am the owner! {this.props.owner}</h1>
            </div>
        );
    }
}

export default OwnerView;