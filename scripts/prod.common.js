import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';

export default {
    input: 'src/index.js',
    plugins: [
        babel({
            plugins: ['external-helpers'],
        }),
        replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
    ],
    sourcemap: true,
    exports: 'named',
    name: 'react-rrd',
    external: ['react', 'react-dom'],
    globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
    },
};
