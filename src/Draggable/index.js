import React from 'react';
import PropTypes from 'prop-types';
import Dragger from './Dragger';

export default class Draggable extends React.Component {
    static propTypes = {
        ...Dragger.propTypes,
    };
    static defaultProps = {
        ...Dragger.defaultProps,
    };
    render() {
        const children = React.Children.only(this.props.children);

        return (
            <Dragger >
                {
                    React.cloneElement(React.Children.only(this.props.children), {

                    })
                }
            </Dragger>
        );
    }
}
