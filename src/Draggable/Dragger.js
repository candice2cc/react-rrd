import React from 'react';
import PropTypes from 'prop-types';

export default class Dragger extends React.Component {
    static propTypes = {
        children: PropTypes.node,
        disabled: PropTypes.bool,
        enableUserSelectHack: PropTypes.bool,
        onStart: PropTypes.func,
        onDrag: PropTypes.func,
        onStop: PropTypes.func,

    };
    static defaultProps = {
        disabled: false,
        enableUserSelectHack: true,
        onStart() {},
        onDrag() {},
        onStop() {},
    };

    state = {
        dragging: false,
        lastX: NaN,
        lastY: NaN,
    };

    render() {
        return React.cloneElement(React.Children.only(this.props.children), {

        });
    }
}
