import React from 'react';
import PropTypes from 'prop-types';

const styles = {
    base: {
        position: 'absolute',
    },
    top: {
        width: '100%',
        height: '10px',
        top: '-5px',
        left: '0px',
        cursor: 'row-resize',
    },
    right: {
        width: '10px',
        height: '100%',
        top: '0px',
        right: '-5px',
        cursor: 'col-resize',
    },
    bottom: {
        width: '100%',
        height: '10px',
        bottom: '-5px',
        left: '0px',
        cursor: 'row-resize',
    },
    left: {
        width: '10px',
        height: '100%',
        top: '0px',
        left: '-5px',
        cursor: 'col-resize',
    },
    topRight: {
        width: '20px',
        height: '20px',
        position: 'absolute',
        right: '-10px',
        top: '-10px',
        cursor: 'ne-resize',
    },
    bottomRight: {
        width: '20px',
        height: '20px',
        position: 'absolute',
        right: '-10px',
        bottom: '-10px',
        cursor: 'se-resize',
    },
    bottomLeft: {
        width: '20px',
        height: '20px',
        position: 'absolute',
        left: '-10px',
        bottom: '-10px',
        cursor: 'sw-resize',
    },
    topLeft: {
        width: '20px',
        height: '20px',
        position: 'absolute',
        left: '-10px',
        top: '-10px',
        cursor: 'nw-resize',
    },
};

export default class Resizer extends React.Component {
    static propTypes = {
        direction: PropTypes.string,
        className: PropTypes.string,
        replaceStyles: PropTypes.object,
        onResizeStart: PropTypes.func,
    };

    static defaultProps = {
        direction: 'top',
        replaceStyles: {},
        onResizeStart() {},
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
                    this.props.onResizeStart(e, direction);
                }}
                onTouchStart={(e) => {
                    this.props.onResizeStart(e, direction);
                }}
            />
        );
    }
}
