
import React from 'react';
import { Rotatable } from '../../src';

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

export default () => (
    <Rotatable
        style={style}
    >
        Rotatable
    </Rotatable>
);
