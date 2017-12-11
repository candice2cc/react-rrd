import React from 'react';
import PropTypes from 'prop-types';

import { userSelectNone, userSelectAuto } from '../common/style';
import Rotater from './Rotater';
import cursorRotate from './cursor_rotate.png';

export const cursor = {
    cursor: `url(${cursorRotate}),auto`,
};

export const cursorNone = {
    cursor: 'auto',
};
export const calculateAngle = (coordinates) => {
    let radians = Math.atan2(coordinates.mouseX, coordinates.mouseY);
    return (radians * (180 / Math.PI) * -1);
};
export default class Rotatable extends React.Component {
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
        disable: PropTypes.bool,
        degree: PropTypes.number,
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
        disable: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            isRotating: false,
            angle: 0,
            degree: typeof this.props.degree === 'undefined' ?
                0
                : this.props.degree,
            original: {
                angle: 0,
                degree: 0,
            },
            direction: 'right',
        };
        this.updateExtendsProps(props);

        if (typeof window !== 'undefined') {
            window.addEventListener('mouseup', this.onMouseUp);
            window.addEventListener('mousemove', this.onMouseMove);
            window.addEventListener('touchmove', this.onMouseMove);
            window.addEventListener('touchend', this.onMouseUp);
        }
    }
    componentWillReceiveProps(nextProps) {
        this.updateExtendsProps(nextProps);
    }


    componentWillUnmount() {
        if (typeof window !== 'undefined') {
            window.removeEventListener('mouseup', this.onMouseUp);
            window.removeEventListener('mousemove', this.onMouseMove);
            window.removeEventListener('touchmove', this.onMouseMove);
            window.removeEventListener('touchend', this.onMouseUp);
        }
    }
    updateExtendsProps(props) {
        this.extendsProps = Object.keys(props).reduce((acc, key) => {
            if (Object.keys(Rotatable.propTypes).indexOf(key) !== -1) return acc;
            acc[key] = props[key];
            return acc;
        }, {});
    }

    /**
     * 鼠标坐标相对target元素圆心坐标
     * @param event
     * @returns {{mousex: number, mousey: number}}
     */
    getRelativeCoordinates(event) {
        const clientRect = this.rotatable.getBoundingClientRect();
        return {
            mouseX: event.pageX - clientRect.left - (clientRect.width / 2),
            mouseY: event.pageY - clientRect.top - (clientRect.height / 2),
        };
    }


    onRotateStart = (event, direction) => {
        if (event.nativeEvent.which === 3) {
            return false;
        }
        if (this.props.onRotateStart) {
            this.props.onRotateStart(event, direction, this.rotatable);
        }
        const angle = calculateAngle(this.getRelativeCoordinates(event));
        const { degree } = this.state;
        this.setState({
            original: {
                angle,
                degree,
            },
            isRotating: true,
            direction,
        });
    };


    onMouseMove = (event) => {
        if (!this.state.isRotating) return false;
        const {
            original, direction,
        } = this.state;
        const angle = calculateAngle(this.getRelativeCoordinates(event));
        const delta = angle - original.angle;
        const newDegree = delta + original.degree;
        this.setState({ angle, degree: newDegree });
        if (this.props.onRotate) {
            this.props.onRotate(event, direction, this.rotatable, newDegree);
        }
    };
    onMouseUp = (event) => {
        const { isRotating, direction, degree } = this.state;
        if (!isRotating) return false;
        if (this.props.onRotateStop) {
            this.props.onRotateStop(event, direction, this.rotatable, degree);
        }
        this.setState({ isRotating: false });
    };

    getRotateStyle() {
        const { degree } = this.state;
        return {
            transform: `rotate(${degree}deg)`,
        };
    }


    renderRotater() {
        const {
            enable, handleStyles, handleClasses, handleWrapperStyle, handleWrapperClass, disable,
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
                        disable={disable}
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
        const cursorStyle = this.state.isRotating ? cursor : cursorNone;
        const {
            style, className,
        } = this.props;
        return (
            <div ref={(c) => { this.rotatable = c; }}
                style={{
                    position: 'relative',
                    ...userSelect,
                    ...cursorStyle,
                    ...style,
                    ...this.getRotateStyle(),
                    boxSizing: 'border-box',

                }}
                className={className}
                {...this.extendsProps}

            >
                {this.props.children}
                {this.renderRotater()}

            </div>
        );
    }
}
