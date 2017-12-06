
import React from 'react';
import { Resizable } from '../../src';

const style = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'solid 1px #ddd',
    background: '#f0f0f0',
    margin: '8px',
};
const onMouseUp = (event) => {
    console.log(event);
};

export default () => (
    <div onMouseUp={onMouseUp}>
        <Resizable
            style={style}
            width={200}
            height={200}
        >
            001
        </Resizable>
        <Resizable
            style={style}
            width={200}
            height={200}
        >
            001
        </Resizable>
    </div>


);
