import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import image from 'rollup-plugin-image';

export default {
    input: 'src/index.js',
    plugins: [
        image(),
        babel({
            plugins: ['external-helpers'],
        }),
        replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),

    ],
    sourcemap: true,
    exports: 'named',
    name: 'react-rrd',
    external: ['react', 'react-dom', 'prop-types', 'react-draggable'],
    globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        'prop-types': 'PropTypes',
        'react-draggable': 'Draggable',
    },
};
