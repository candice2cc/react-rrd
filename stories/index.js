import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import DraggableStory from './draggable';
import Basic from './resize/basic';
import AutoWidth from './resize/auto_width';
import BoundsParent from './resize/bounds_parent';
import Grid from './resize/grid';
import LookAspect from './resize/lock_aspect';
import PercentSize from './resize/percent_size';
import Mutiple from './resize/multiple';

import './styles.css';

storiesOf('Button', module)
    .add('with text', () => (
        <button onClick={action('clicked')}>Hello Button</button>
    ))
    .add('with some emoji', () => (
        <button onClick={action('clicked')}>😀 😎 👍 💯</button>
    ));


storiesOf('Draggable', module)
    .add('with text', () => (
        <DraggableStory/>
    ));
storiesOf('Resizable', module)
    .add('basic.', () => (
        <Basic/>
    ))
    .add('auto width.', () => (
        <AutoWidth/>
    ))
    .add('bounds parent.', () => (
        <BoundsParent/>
    ))
    .add('grid w10 h20.', () => (
        <Grid/>
    ))
    .add('look aspect.', () => (
        <LookAspect/>
    ))
    .add('percent size.', () => (
        <PercentSize/>
    ))
    .add('mutiple resize.', () => (
        <Mutiple/>
    ));
