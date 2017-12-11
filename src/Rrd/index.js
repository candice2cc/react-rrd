import React from 'react';
import PropTypes from 'prop-types';

import Draggable from '../react-draggable/Draggable';
import Resizer from '../Resizable/Resizer';
import { clamp, snap, endsWith, getStringSize } from '../Resizable/index';
import { cursor, cursorNone, calculateAngle } from '../Rotatable/index';
import Rotater from '../Rotatable/Rotater';
import { userSelectAuto, userSelectNone } from '../common/style';
import cursorRotate from '../Rotatable/cursor_rotate.png';

let baseSizeId = 0;
const defaultRotateHandleStyles = {
    topRight: {
        width: '20px',
        height: '20px',
        position: 'absolute',
        right: '-30px',
        top: '-30px',
        cursor: `url(${cursorRotate}),auto`,
    },
    bottomRight: {
        width: '20px',
        height: '20px',
        position: 'absolute',
        right: '-30px',
        bottom: '-30px',
        cursor: `url(${cursorRotate}),auto`,
    },
    bottomLeft: {
        width: '20px',
        height: '20px',
        position: 'absolute',
        left: '-30px',
        bottom: '-30px',
        cursor: `url(${cursorRotate}),auto`,
    },
    topLeft: {
        width: '20px',
        height: '20px',
        position: 'absolute',
        left: '-30px',
        top: '-30px',
        cursor: `url(${cursorRotate}),auto`,
    },
};
export default class Rrd extends React.Component {
    static propTypes = {
        children: PropTypes.node,
        // callback
        onDragStart: PropTypes.func,
        onDrag: PropTypes.func,
        onDragStop: PropTypes.func,
        onResizeStart: PropTypes.func,
        onResize: PropTypes.func,
        onResizeStop: PropTypes.func,
        onRotateStart: PropTypes.func,
        onRotate: PropTypes.func,
        onRotateStop: PropTypes.func,

        // style
        className: PropTypes.string,
        style: PropTypes.object,

        // resize rotate handle enable and style
        enableResizing: PropTypes.shape({
            top: PropTypes.bool,
            right: PropTypes.bool,
            bottom: PropTypes.bool,
            left: PropTypes.bool,
            topRight: PropTypes.bool,
            bottomRight: PropTypes.bool,
            bottomLeft: PropTypes.bool,
            topLeft: PropTypes.bool,
        }),
        enableRotating: PropTypes.shape({
            topRight: PropTypes.bool,
            bottomRight: PropTypes.bool,
            bottomLeft: PropTypes.bool,
            topLeft: PropTypes.bool,
        }),
        resizeHandleStyles: PropTypes.object,
        resizeHandleClasses: PropTypes.string,
        resizeHandleWrapperStyle: PropTypes.object,
        resizeHandleWrapperClass: PropTypes.string,
        rotateHandleStyles: PropTypes.object,
        rotateHandleClasses: PropTypes.string,
        rotateHandleWrapperStyle: PropTypes.object,
        rotateHandleWrapperClass: PropTypes.string,

        // resize props
        resizeGrid: PropTypes.array,
        lockAspectRatio: PropTypes.bool,
        bounds: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element,
        ]),
        width: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        height: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        size: PropTypes.shape({
            width: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
            height: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
        }),
        defaultSize: PropTypes.shape({
            width: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
            height: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
        }),
        minWidth: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        minHeight: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        maxWidth: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        maxHeight: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),

        // rotate props
        degree: PropTypes.number,

        // drag props
        axis: PropTypes.string,
        defaultPosition: PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number,
        }),
        dragGrid: PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number,
        }),


    };
    static defaultProps = {
        onDragStart() {},
        onDrag() {},
        onDragStop() {},
        onResizeStart() {},
        onResize() {},
        onResizeStop() {},
        onRotateStart() {},
        onRotate() {},
        onRotateStop() {},
        enableRotating: {
            topRight: true,
            bottomRight: true,
            bottomLeft: true,
            topLeft: true,
        },
        enableResizing: {
            top: true,
            right: true,
            bottom: true,
            left: true,
            topRight: true,
            bottomRight: true,
            bottomLeft: true,
            topLeft: true,
        },
        resizeGrid: [1, 1],
        lockAspectRatio: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            // resize state
            isResizing: false,
            width: typeof this.getPropsWidth() === 'undefined' ?
                'auto'
                : this.getPropsWidth(),
            height: typeof this.getPropsHeight() === 'undefined' ?
                'auto'
                : this.getPropsHeight(),
            resizeDirection: 'right',
            original: {
                x: 0,
                y: 0,
                width: 0,
                height: 0,

                // rotate state
                angle: 0,
                degree: 0,
            },
            // rotate state
            isRotating: false,
            angle: 0,
            degree: typeof this.props.degree === 'undefined' ?
                0
                : this.pros.degree,
            rotateDirection: 'right',

            // drag state
            x: 0,
            y: 0,

            // control
            disableDragging: false,
            disableResizing: false,
            disableRotating: false,


        };
        this.updateExtendsProps(props);

        this.baseSizeId = `__resizable${baseSizeId}`;
        baseSizeId += 1;

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

    componentDidMount() {
        const size = this.getSize();
        this.setState({
            width: this.state.width || size.width,
            height: this.state.height || size.height,
        });
        const element = document.createElement('div');
        element.id = this.baseSizeId;
        element.style.width = '100%';
        element.style.height = '100%';
        element.style.position = 'relative';
        element.style.transform = 'scale(0, 0)';
        element.style.left = '-2147483647px';
        const parent = this.getParentNode();
        if (!(parent instanceof HTMLElement)) return;
        parent.appendChild(element);
    }
    componentWillUnmount() {
        if (typeof window !== 'undefined') {
            window.removeEventListener('mouseup', this.onMouseUp);
            window.removeEventListener('mousemove', this.onMouseMove);
            window.removeEventListener('touchmove', this.onMouseMove);
            window.removeEventListener('touchend', this.onMouseUp);

            const parent = this.getParentNode();
            const base = document.getElementById(this.baseSizeId);
            if (!base) return;
            if (!(parent instanceof HTMLElement) || !(base instanceof Node)) return;
            parent.removeChild(base);
        }
    }

    updateExtendsProps(props) {
        this.extendsProps = Object.keys(props).reduce((acc, key) => {
            if (Object.keys(Rrd.propTypes).indexOf(key) !== -1) return acc;
            acc[key] = props[key];
            return acc;
        }, {});
    }
    getSize() {
        let width = 0;
        let height = 0;
        if (typeof window !== 'undefined') {
            width = this.resizable.offsetWidth;
            height = this.resizable.offsetHeight;
        }
        return { width, height };
    }
    getParentSize() {
        const base = (document.getElementById(this.baseSizeId));
        if (!base) return { width: window.innerWidth, height: window.innerHeight };
        return {
            width: base.offsetWidth,
            height: base.offsetHeight,
        };
    }
    getParentNode() {
        return this.resizable.parentNode;
    }
    getPropsSize() {
        return this.props.size || this.props.defaultSize;
    }
    getPropsWidth() {
        return this.props.width || (this.getPropsSize() && this.getPropsSize().width);
    }
    getPropsHeight() {
        return this.props.height || (this.getPropsSize() && this.getPropsSize().height);
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

    onResizeStart = (event, direction) => {
        event.stopPropagation();
        let clientX = 0;
        let clientY = 0;
        if (event.nativeEvent instanceof MouseEvent) {
            clientX = event.nativeEvent.clientX;
            clientY = event.nativeEvent.clientY;

            // When user click with right button the resize is stuck in resizing mode
            // until users clicks again, dont continue if right click is used.
            if (event.nativeEvent.which === 3) {
                return false;
            }
        } else if (event.nativeEvent instanceof TouchEvent) {
            clientX = event.nativeEvent.touches[0].clientX;
            clientY = event.nativeEvent.touches[0].clientY;
        }
        if (this.props.onResizeStart) {
            this.props.onResizeStart(event, direction, this.resizable);
        }
        let size = this.getSize();
        this.setState({
            original: {
                x: clientX,
                y: clientY,
                width: size.width,
                height: size.height,
            },
            isResizing: true,
            resizeDirection: direction,
            disableDragging: true,
            disableRotating: true,
        });
    };
    onRotateStart = (event, direction) => {
        event.stopPropagation();
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
            disableDragging: true,
            disableResizing: true,
        });
    };

    onMouseMove = (event) => {
        if (this.state.isResizing) {
            const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
            const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
            const {
                resizeDirection, original, width, height,
            } = this.state;
            const { lockAspectRatio } = this.props;
            let {
                maxWidth, maxHeight, minWidth, minHeight,
            } = this.props;

            // TODO: refactor
            const parentSize = this.getParentSize();
            if (maxWidth && typeof maxWidth === 'string' && endsWith(maxWidth, '%')) {
                const ratio = Number(maxWidth.replace('%', '')) / 100;
                maxWidth = parentSize.width * ratio;
            }
            if (maxHeight && typeof maxHeight === 'string' && endsWith(maxHeight, '%')) {
                const ratio = Number(maxHeight.replace('%', '')) / 100;
                maxHeight = parentSize.height * ratio;
            }
            if (minWidth && typeof minWidth === 'string' && endsWith(minWidth, '%')) {
                const ratio = Number(minWidth.replace('%', '')) / 100;
                minWidth = parentSize.width * ratio;
            }
            if (minHeight && typeof minHeight === 'string' && endsWith(minHeight, '%')) {
                const ratio = Number(minHeight.replace('%', '')) / 100;
                minHeight = parentSize.height * ratio;
            }
            maxWidth = typeof maxWidth === 'undefined' ? undefined : Number(maxWidth);
            maxHeight = typeof maxHeight === 'undefined' ? undefined : Number(maxHeight);
            minWidth = typeof minWidth === 'undefined' ? undefined : Number(minWidth);
            minHeight = typeof minHeight === 'undefined' ? undefined : Number(minHeight);

            const ratio = original.height / original.width;
            let newWidth = original.width;
            let newHeight = original.height;
            if (/right/i.test(resizeDirection)) {
                newWidth = original.width + (clientX - original.x);
                if (lockAspectRatio) newHeight = newWidth * ratio;
            }
            if (/left/i.test(resizeDirection)) {
                newWidth = original.width - (clientX - original.x);
                if (lockAspectRatio) newHeight = newWidth * ratio;
            }
            if (/bottom/i.test(resizeDirection)) {
                newHeight = original.height + (clientY - original.y);
                if (lockAspectRatio) newWidth = newHeight / ratio;
            }
            if (/top/i.test(resizeDirection)) {
                newHeight = original.height - (clientY - original.y);
                if (lockAspectRatio) newWidth = newHeight / ratio;
            }

            if (this.props.bounds === 'parent') {
                const parent = this.getParentNode();
                if (parent instanceof HTMLElement) {
                    const parentRect = parent.getBoundingClientRect();
                    const parentLeft = parentRect.left;
                    const parentTop = parentRect.top;
                    const { left, top } = this.resizable.getBoundingClientRect();
                    const boundWidth = parent.offsetWidth + (parentLeft - left);
                    const boundHeight = parent.offsetHeight + (parentTop - top);
                    maxWidth = maxWidth && maxWidth < boundWidth ? maxWidth : boundWidth;
                    maxHeight = maxHeight && maxHeight < boundHeight ? maxHeight : boundHeight;
                }
            } else if (this.props.bounds === 'window') {
                if (typeof window !== 'undefined') {
                    const { left, top } = this.resizable.getBoundingClientRect();
                    const boundWidth = window.innerWidth - left;
                    const boundHeight = window.innerHeight - top;
                    maxWidth = maxWidth && maxWidth < boundWidth ? maxWidth : boundWidth;
                    maxHeight = maxHeight && maxHeight < boundHeight ? maxHeight : boundHeight;
                }
            } else if (this.props.bounds instanceof HTMLElement) {
                const targetRect = this.props.bounds.getBoundingClientRect();
                const targetLeft = targetRect.left;
                const targetTop = targetRect.top;
                const { left, top } = this.resizable.getBoundingClientRect();
                if (!(this.props.bounds instanceof HTMLElement)) return;
                const boundWidth = this.props.bounds.offsetWidth + (targetLeft - left);
                const boundHeight = this.props.bounds.offsetHeight + (targetTop - top);
                maxWidth = maxWidth && maxWidth < boundWidth ? maxWidth : boundWidth;
                maxHeight = maxHeight && maxHeight < boundHeight ? maxHeight : boundHeight;
            }

            const computedMinWidth = (typeof minWidth === 'undefined' || minWidth < 10) ? 10 : minWidth;
            const computedMaxWidth = (typeof maxWidth === 'undefined' || maxWidth < 0) ? newWidth : maxWidth;
            const computedMinHeight = (typeof minHeight === 'undefined' || minHeight < 10) ? 10 : minHeight;
            const computedMaxHeight = (typeof maxHeight === 'undefined' || maxHeight < 0) ? newHeight : maxHeight;

            if (lockAspectRatio) {
                const lockedMinWidth = computedMinWidth > computedMinHeight / ratio
                    ? computedMinWidth
                    : computedMinHeight / ratio;
                const lockedMaxWidth = computedMaxWidth < computedMaxHeight / ratio
                    ? computedMaxWidth
                    : computedMaxHeight / ratio;
                const lockedMinHeight = computedMinHeight > computedMinWidth * ratio
                    ? computedMinHeight
                    : computedMinWidth * ratio;
                const lockedMaxHeight = computedMaxHeight < computedMaxWidth * ratio
                    ? computedMaxHeight
                    : computedMaxWidth * ratio;
                newWidth = clamp(newWidth, lockedMinWidth, lockedMaxWidth);
                newHeight = clamp(newHeight, lockedMinHeight, lockedMaxHeight);
            } else {
                newWidth = clamp(newWidth, computedMinWidth, computedMaxWidth);
                newHeight = clamp(newHeight, computedMinHeight, computedMaxHeight);
            }
            if (this.props.resizeGrid) {
                newWidth = snap(newWidth, this.props.resizeGrid[0]);
            }
            if (this.props.resizeGrid) {
                newHeight = snap(newHeight, this.props.resizeGrid[1]);
            }

            const delta = {
                width: newWidth - original.width,
                height: newHeight - original.height,
            };

            if (width && typeof width === 'string' && endsWith(width, '%')) {
                const percent = (newWidth / parentSize.width) * 100;
                newWidth = `${percent}%`;
            }

            if (height && typeof height === 'string' && endsWith(height, '%')) {
                const percent = (newHeight / parentSize.height) * 100;
                newHeight = `${percent}%`;
            }

            this.setState({
                width: width !== 'auto' || typeof this.props.width === 'undefined' ? newWidth : 'auto',
                height: height !== 'auto' || typeof this.props.height === 'undefined' ? newHeight : 'auto',
            });

            if (this.props.onResize) {
                this.props.onResize(event, resizeDirection, this.resizable, delta);
            }
        }

        if (this.state.isRotating) {
            const {
                original, rotateDirection,
            } = this.state;
            const angle = calculateAngle(this.getRelativeCoordinates(event));
            const delta = angle - original.angle;
            const newDegree = delta + original.degree;
            this.setState({ angle, degree: newDegree });
            if (this.props.onRotate) {
                this.props.onRotate(event, rotateDirection, this.rotatable, newDegree);
            }
        }
    };

    onMouseUp = (event) => {
        const {
            isResizing, resizeDirection, original, isRotating, rotateDirection, degree,
        } = this.state;
        if (isResizing) {
            const delta = {
                width: this.getSize().width - original.width,
                height: this.getSize().height - original.height,
            };
            if (this.props.onResizeStop) {
                this.props.onResizeStop(event, resizeDirection, this.resizable, delta);
            }
            this.setState({
                isResizing: false,
                disableDragging: false,
                disableRotating: false,
            });
        }
        if (isRotating) {
            if (this.props.onRotateStop) {
                this.props.onRotateStop(event, rotateDirection, this.rotatable, degree);
            }
            this.setState({
                isRotating: false,
                disableDragging: false,
                disableResizing: false,
            });
        }
    };


    handleDrag = (event, coreData) => {
        this.setState({ x: coreData.x, y: coreData.y });
    };
    handleDragStop = (event, coreData) => {
        this.setState({ x: coreData.x, y: coreData.y });
    };

    renderResizer() {
        const {
            enableResizing,
            resizeHandleStyles,
            resizeHandleClasses,
            resizeHandleWrapperStyle,
            resizeHandleWrapperClass,
        } = this.props;

        if (!enableResizing) return null;
        const resizers = Object.keys(enableResizing).map((dir) => {
            if (enableResizing[dir] !== false) {
                return (
                    <Resizer
                        key={dir}
                        direction={dir}
                        onResizeStart={this.onResizeStart}
                        replaceStyles={resizeHandleStyles && resizeHandleStyles[dir]}
                        className={resizeHandleClasses && resizeHandleClasses[dir]}
                        disable={this.state.disableResizing}
                    />
                );
            }
            return null;
        });

        // #93 Wrap the resize box in span (will not break 100% width/height)
        return (
            <span
                className={resizeHandleWrapperClass}
                style={resizeHandleWrapperStyle}
            >
                {resizers}
            </span>);
    }

    renderRotater() {
        const {
            enableRotating,
            rotateHandleClasses,
            rotateHandleWrapperStyle,
            rotateHandleWrapperClass,
        } = this.props;

        const rotateHandleStyles = this.props.rotateHandleStyles || defaultRotateHandleStyles;

        if (!enableRotating) return null;
        const rotaters = Object.keys(enableRotating).map((dir) => {
            if (enableRotating[dir] !== false) {
                return (
                    <Rotater
                        key={dir}
                        direction={dir}
                        onRotateStart={this.onRotateStart}
                        replaceStyles={rotateHandleStyles && rotateHandleStyles[dir]}
                        className={rotateHandleClasses && rotateHandleClasses[dir]}
                        disable={this.state.disableRotating}
                    />
                );
            }
            return null;
        });

        // #93 Wrap the rotate box in span (will not break 100% width/height)
        return (
            <span
                className={rotateHandleWrapperClass}
                style={rotateHandleWrapperStyle}
            >
                {rotaters}
            </span>);
    }

    getRrdStyle() {
        const { size } = this.props;
        const getSize = (key) => {
            if (typeof this.state[key] === 'undefined' || this.state[key] === 'auto') return 'auto';
            if (this.getPropsSize() && this.getPropsSize()[key] && endsWith(this.getPropsSize()[key].toString(), '%')) {
                if (endsWith(this.state[key].toString(), '%')) return this.state[key].toString();
                const parentSize = this.getParentSize();
                const value = Number(this.state[key].toString().replace('px', ''));
                const percent = (value / parentSize[key]) * 100;
                return `${percent}%`;
            }
            return getStringSize(this.state[key]);
        };
        const width = ((size && size.width) && !this.state.isResizing)
            ? getStringSize(size.width)
            : getSize('width');
        const height = ((size && size.height) && !this.state.isResizing)
            ? getStringSize(size.height)
            : getSize('height');

        const { degree, x, y } = this.state;
        return {
            transform: `rotate(${degree}deg) translate(${x}px,${y}px)`,
            width,
            height,
        };
    }


    render() {
        let userSelect = userSelectAuto;
        if (this.state.isResizing || this.state.isRotating) {
            userSelect = userSelectNone;
        }
        const {
            style, maxWidth, maxHeight, minWidth, minHeight, className,
            bounds, axis, defaultPosition, dragGrid,
        } = this.props;
        const { degree, x, y } = this.state;
        return (
            <Draggable
                disabled={this.state.disableDragging}
                bounds={bounds}
                axis={axis}
                defaultPosition={defaultPosition}
                grid={dragGrid}
                onStart={this.handleDragStart}
                onDrag={this.handleDrag}
                onStop={this.handleDragStop}
                transform={ `rotate(${degree}deg) translate(${x}px,${y}px)`}
            >
                <div ref={(c) => { this.rotatable = c; this.resizable = c; }}
                    style={{
                        position: 'relative',
                        ...userSelect,
                        ...style,
                        ...this.getRrdStyle(),
                        maxWidth,
                        maxHeight,
                        minWidth,
                        minHeight,
                        boxSizing: 'border-box',
                    }}
                    className={className}
                    {...this.extendsProps}
                >
                    {this.props.children}
                    {this.renderResizer()}
                    {this.renderRotater()}
                </div>
            </Draggable>
        );
    }
}
