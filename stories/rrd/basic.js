
import React from 'react';
import { Rrd } from '../../src';

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
};

export default () => (
    <div style={containerStyle}>
        <Rrd
            style={style}
            bounds={'parent'}
            width={200}
            height={200}
        >
            <div>001</div>
        </Rrd>
    </div>
);
