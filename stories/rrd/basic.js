
import React from 'react';
import { Rrd } from '../../src';
import cursorRotate from './cursor_rotate.png';

const style = {
    display: 'inline-block',
    border: 'solid 1px #ddd',
    background: '#f0f0f0',
    position: 'relative',
    left: '100px',
    top: '100px',
};

const containerStyle = {
    display: 'block',
    width: '100%',
    height: '100%',
    border: '1px solid #ccc',
    overflow: 'hidden',
};

const onResizeStart = (event, direction, resizable) => {
    // style.cursor = ''

};


class BasicRrd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cursor: 'auto',

        };
    }
    handleResizeStart = (event, resizeDirection, resizable) => {
        let cursor;
        switch (resizeDirection) {
        case 'top':
            cursor = 'row-resize';
            break;
        case 'right':
            cursor = 'col-resize';
            break;
        case 'bottom':
            cursor = 'row-resize';

            break;
        case 'left':
            cursor = 'col-resize';

            break;
        case 'topRight':
            cursor = 'ne-resize';

            break;
        case 'bottomRight':
            cursor = 'se-resize';

            break;
        case 'bottomLeft':
            cursor = 'sw-resize';

            break;
        case 'topLeft':
            cursor = 'nw-resize';

            break;
        default:
            cursor = 'auto';
        }
        this.setState({ cursor });
    };

    handleResize = (event, resizeDirection, resizable, delta) => {

    };
    handleResizeStop = (event, resizeDirection, resizable, delta) => {
        this.setState({ cursor: 'auto' });
    };
    handleRotateStart = (event, direction, rotatable) => {
        this.setState({ cursor: `url(${cursorRotate}),auto` });
    };
    handleRotate = (event, rotateDirection, rotatable, degree) => {};
    handleRotateStop = (event, rotateDirection, rotatable, degree) => {
        this.setState({ cursor: 'auto' });
    };


    handleDragStart = (e, coreEvent) => {

    };
    handleDrag = (e, coreEvent) => {

    };
    handleDragStop = (e, coreEvent) => {

    };

    render() {
        let containerStyle2 = {
            ...containerStyle,
            cursor: this.state.cursor,
        };
        return (<div style= {containerStyle2}>
            <Rrd
                style= {style}
                width={200}
                height={200}
                onResizeStart={this.handleResizeStart}
                onResize={this.handleResize}
                onResizeStop={this.handleResizeStop}
                onRotateStart={this.handleRotateStart}
                onRotate={this.handleRotate}
                onRotateStop={this.handleRotateStop}
                onDragStart={this.handleDragStart}
                onDrag={this.handleDrag}
                onDragStop={this.handleDragStop}
                // TODO bounds error
                // bounds={'parent'}
            >
                <div>001</div>
            </Rrd>
        </div>);
    }
}

export default BasicRrd;
