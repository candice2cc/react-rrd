import React from 'react';
import PropTypes from 'prop-types';

import { userSelectNone, userSelectAuto } from '../common/style';
import Resizer from './Resizer';

let baseSizeId = 0;

const clamp = (n, min, max) => Math.max(Math.min(n, max), min);
const snap = (n, size) => Math.round(n / size) * size;

const endsWith = (str, searchStr) =>
    str.substr(str.length - searchStr.length, searchStr.length) === searchStr;

const getStringSize = (n) => {
    if (endsWith(n.toString(), 'px')) return n.toString();
    if (endsWith(n.toString(), '%')) return n.toString();
    return `${n}px`;
};
export default class Resizable extends React.Component {
    static propTypes = {
        children: PropTypes.node,
        onResizeStart: PropTypes.func,
        onResize: PropTypes.func,
        onResizeStop: PropTypes.func,
        enable: PropTypes.shape({
            top: PropTypes.bool,
            right: PropTypes.bool,
            bottom: PropTypes.bool,
            left: PropTypes.bool,
            topRight: PropTypes.bool,
            bottomRight: PropTypes.bool,
            bottomLeft: PropTypes.bool,
            topLeft: PropTypes.bool,
        }),
        grid: PropTypes.array,
        lockAspectRatio: PropTypes.bool,
        handleStyles: PropTypes.object,
        handleClasses: PropTypes.string,
        handleWrapperStyle: PropTypes.object,
        handleWrapperClass: PropTypes.string,
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
        className: PropTypes.string,
        style: PropTypes.object,
    };
    static defaultProps = {
        onResizeStart() {},
        onResize() {},
        onResizeStop() {},
        enable: {
            top: true,
            right: true,
            bottom: true,
            left: true,
            topRight: true,
            bottomRight: true,
            bottomLeft: true,
            topLeft: true,
        },
        grid: [1, 1],
        lockAspectRatio: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            isResizing: false,
            width: typeof this.getPropsWidth() === 'undefined' ?
                'auto'
                : this.getPropsWidth(),
            height: typeof this.getPropsHeight() === 'undefined' ?
                'auto'
                : this.getPropsHeight(),
            direction: 'right',
            original: {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
            },
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
            if (Object.keys(Resizable.propTypes).indexOf(key) !== -1) return acc;
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

    onResizeStart = (event, direction) => {
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
            direction,
        });
    };


    onMouseMove = (event) => {
        if (!this.state.isResizing) return;
        const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
        const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
        const {
            direction, original, width, height,
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
        if (/right/i.test(direction)) {
            newWidth = original.width + (clientX - original.x);
            if (lockAspectRatio) newHeight = newWidth * ratio;
        }
        if (/left/i.test(direction)) {
            newWidth = original.width - (clientX - original.x);
            if (lockAspectRatio) newHeight = newWidth * ratio;
        }
        if (/bottom/i.test(direction)) {
            newHeight = original.height + (clientY - original.y);
            if (lockAspectRatio) newWidth = newHeight / ratio;
        }
        if (/top/i.test(direction)) {
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
        if (this.props.grid) {
            newWidth = snap(newWidth, this.props.grid[0]);
        }
        if (this.props.grid) {
            newHeight = snap(newHeight, this.props.grid[1]);
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
            this.props.onResize(event, direction, this.resizable, delta);
        }
    };

    onMouseUp = (event) => {
        const { isResizing, direction, original } = this.state;
        if (!isResizing) return false;
        const delta = {
            width: this.getSize().width - original.width,
            height: this.getSize().height - original.height,
        };
        if (this.props.onResizeStop) {
            this.props.onResizeStop(event, direction, this.resizable, delta);
        }
        this.setState({ isResizing: false });
    };

    getSizeStyle() {
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
        return { width, height };
    }

    renderResizer() {
        const {
            enable, handleStyles, handleClasses, handleWrapperStyle, handleWrapperClass,
        } = this.props;

        if (!enable) return null;
        const resizers = Object.keys(enable).map((dir) => {
            if (enable[dir] !== false) {
                return (
                    <Resizer
                        key={dir}
                        direction={dir}
                        onResizeStart={this.onResizeStart}
                        replaceStyles={handleStyles && handleStyles[dir]}
                        className={handleClasses && handleClasses[dir]}
                    />
                );
            }
            return null;
        });

        // #93 Wrap the resize box in span (will not break 100% width/height)
        return (
            <span
                className={handleWrapperClass}
                style={handleWrapperStyle}
            >
                {resizers}
            </span>);
    }

    render() {
        const userSelect = this.state.isResizing ? userSelectNone : userSelectAuto;
        const {
            style, maxWidth, maxHeight, minWidth, minHeight, className,
        } = this.props;
        return (
            <div ref={(c) => { this.resizable = c; }}
                style={{
                    position: 'relative',
                    ...userSelect,
                    ...style,
                    ...this.getSizeStyle(),
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

            </div>
        );
    }
}
