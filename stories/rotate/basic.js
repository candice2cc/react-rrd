
import React from 'react';
import { Rotatable } from '../../src';
import cursorRotate from './cursor_rotate.png';

const style = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'solid 1px #ddd',
    backgroundColor: '#fff',
    width: '200px',
    height: '200px',
    background: 'linear-gradient(to left, #f46b45 , #eea849)',
    color: '#fff',
};

const handleStyles = {
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
const handleRotateStart = () => {
    document.getElementById('root').style.cursor = `url(${cursorRotate}),auto`;
};
const handleRotateStop = () => {
    document.getElementById('root').style.cursor = 'auto';
};
export default () => (
    <Rotatable
        style={style}
        degree={0}
        onRotateStart={handleRotateStart}
        onRotateStop={handleRotateStop}
        handleStyles={handleStyles}
    >
        Rotatable
    </Rotatable>
);
