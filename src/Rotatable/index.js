import React from 'react';
import PropTypes from 'prop-types';

import { userSelectNone, userSelectAuto } from '../common/style';
import Rotater from './Rotater';


export default class Resizable extends React.Component {
    static propTypes = {
        children: PropTypes.node,
        onRotateStart: PropTypes.func,
        onRotate: PropTypes.func,
        onRotateStop: PropTypes.func,
        enable: PropTypes.shape({
            topRight: PropTypes.bool,
            bottomRight: PropTypes.bool,
            bottomLeft: PropTypes.bool,
            topLeft: PropTypes.bool,
        }),
        handleStyles: PropTypes.object,
        handleClasses: PropTypes.string,
        handleWrapperStyle: PropTypes.object,
        handleWrapperClass: PropTypes.string,
        className: PropTypes.string,
        style: PropTypes.object,
    };
    static defaultProps = {
        onRotateStart() {},
        onRotate() {},
        onRotateStop() {},
        enable: {
            topRight: true,
            bottomRight: true,
            bottomLeft: true,
            topLeft: true,
        },
    };

    constructor(props) {
        super(props);
        this.state = {
            isRotating: false,
            original: {
            },
        };


        if (typeof window !== 'undefined') {
            window.addEventListener('mouseup', this.onMouseUp);
            window.addEventListener('mousemove', this.onMouseMove);
            window.addEventListener('touchmove', this.onMouseMove);
            window.addEventListener('touchend', this.onMouseUp);
        }
    }
    componentDidMount() {
    }

    componentWillUnmount() {
        if (typeof window !== 'undefined') {
            window.removeEventListener('mouseup', this.onMouseUp);
            window.removeEventListener('mousemove', this.onMouseMove);
            window.removeEventListener('touchmove', this.onMouseMove);
            window.removeEventListener('touchend', this.onMouseUp);
        }
    }

    onRotateStart = (event, direction) => {
        console.log(direction);
    };
    onMouseMove = (event) => {

    };
    onMouseUp = (event) => {

    };


    renderRotater() {
        const {
            enable, handleStyles, handleClasses, handleWrapperStyle, handleWrapperClass,
        } = this.props;

        if (!enable) return null;
        const rotaters = Object.keys(enable).map((dir) => {
            if (enable[dir] !== false) {
                return (
                    <Rotater
                        key={dir}
                        direction={dir}
                        onRotateStart={this.onRotateStart}
                        replaceStyles={handleStyles && handleStyles[dir]}
                        className={handleClasses && handleClasses[dir]}
                    />
                );
            }
            return null;
        });

        // #93 Wrap the rotate box in span (will not break 100% width/height)
        return (
            <span
                className={handleWrapperClass}
                style={handleWrapperStyle}
            >
                {rotaters}
            </span>);
    }
    render() {
        const userSelect = this.state.isRotating ? userSelectNone : userSelectAuto;
        const {
            style, className,
        } = this.props;
        return (
            <div ref={(c) => { this.rotatable = c; }}
                style={{
                    position: 'relative',
                    ...userSelect,
                    ...style,
                    boxSizing: 'border-box',
                }}
                className={className}
            >
                {this.props.children}
                {this.renderRotater()}

            </div>
        );
    }
}
