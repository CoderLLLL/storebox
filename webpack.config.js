'use strict';

const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    entry: './src/index.ts',
    mode:'development',
    devtool:'source-map',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
        environment:{
            arrowFunction:false
        }
    },
    module: {
        rules: [
            {
                test:/\.ts$/,
                use:[
                    {
                        loader:'babel-loader',
                        options:{
                            presets:[
                                [
                                    '@babel/preset-env',
                                    {
                                        targets:{
                                            'chrome':'58',
                                            'ie':'11'
                                        },
                                        'corejs':'3',
                                        "useBuiltIns":"entry"
                                    }
                                ]
                            ]
                        }
                    },
                    'ts-loader',
                ],
                exclude:/node-moudule/
            },
        ]
    },

    resolve:{
        extensions:['.ts','.js']
    },

    plugins: [
        new CleanWebpackPlugin()
    ]
};
