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
    };

    static defaultProps = {
        direction: 'bottomRight',
        replaceStyles: {},
        onRotateStart() {},
    };

    render() {
        const { className, replaceStyles, direction } = this.props;
        return (
            <div
                className={className}
                style={{
                    ...styles.base,
                    ...styles[direction],
                    ...(replaceStyles || {}),
                }}
                onMouseDown={(e) => {
                    this.props.onRotateStart(e, direction);
                }}
                onTouchStart={(e) => {
                    this.props.onRotateStart(e, direction);
                }}
            />
        );
    }
}
