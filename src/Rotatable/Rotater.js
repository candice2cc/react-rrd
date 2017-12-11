import React from 'react';
import PropTypes from 'prop-types';
import cursorRotate from './cursor_rotate.png';

const styles = {
    base: {
        position: 'absolute',
    },
    topRight: {
        width: '20px',
        height: '20px',
        position: 'absolute',
        right: '-10px',
        top: '-10px',
        cursor: `url(${cursorRotate}),auto`,
    },
    bottomRight: {
        width: '20px',
        height: '20px',
        position: 'absolute',
        right: '-10px',
        bottom: '-10px',
        cursor: `url(${cursorRotate}),auto`,
    },
    bottomLeft: {
        width: '20px',
        height: '20px',
        position: 'absolute',
        left: '-10px',
        bottom: '-10px',
        cursor: `url(${cursorRotate}),auto`,
    },
    topLeft: {
        width: '20px',
        height: '20px',
        position: 'absolute',
        left: '-10px',
        top: '-10px',
        cursor: `url(${cursorRotate}),auto`,
    },
};

export default class Resizer extends React.Component {
    static propTypes = {
        direction: PropTypes.string,
        className: PropTypes.string,
        replaceStyles: PropTypes.object,
        onRotateStart: PropTypes.func,
        disable: false,

    };

    static defaultProps = {
        direction: 'bottomRight',
        replaceStyles: {},
        onRotateStart() {},
        disable: PropTypes.bool,

    };
    handleRotateStart = (e, direction) => {
        if (!this.props.disable) {
            this.props.onRotateStart(e, direction);
        }
    };

    render() {
        const {
            className, replaceStyles, direction, disable,
        } = this.props;
        let style = {
            ...styles.base,
            ...styles[direction],
            ...(replaceStyles || {}),
        };
        if (disable) {
            style.cursor = 'auto';
        }
        return (
            <div
                className={className}
                style={style}
                onMouseDown={(e) => {
                    this.handleRotateStart(e, direction);
                }}
                onTouchStart={(e) => {
                    this.handleRotateStart(e, direction);
                }}
            />
        );
    }
}
