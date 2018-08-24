const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        'bundle': './public/index.tsx'
    },

    output: {
        filename: '[name].js',
        path: __dirname + '/public/built',
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },

    watch: false,

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
                exclude: [/node_modules/]
            },
            {
                test: /\.(css|sass|scss)$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'sass-loader'],
                }),
                exclude: [/node_modules/]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: 'url-loader?limit=10000!img-loader?progressive=true',
            },

            {
                test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                loader: 'file-loader?name=fonts/[name].[ext]',
            }
        ]
    },


    plugins: [
        new ExtractTextPlugin({
            filename: 'style.css',
            allChunks: true
        })
    ],

    devServer: {
        port: 7001,
        open: true,
        contentBase: './public/',
        publicPath: '/built/',
    }
};