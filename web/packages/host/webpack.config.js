const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: './src/index.tsx',
    mode: argv.mode || 'development',
    devServer: {
      port: 3000,
      historyApiFallback: true,
      hot: true,
      open: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].js',
      clean: true,
      publicPath: isProduction ? '/mindease/' : 'http://localhost:3000/',
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: 'host',
        remotes: {
          painelCognitivo: isProduction 
            ? 'painelCognitivo@/mindease/painel-cognitivo/remoteEntry.js'
            : 'painelCognitivo@http://localhost:3001/remoteEntry.js',
          organizadorTarefas: isProduction
            ? 'organizadorTarefas@/mindease/organizador-tarefas/remoteEntry.js'
            : 'organizadorTarefas@http://localhost:3002/remoteEntry.js',
          perfilUsuario: isProduction
            ? 'perfilUsuario@/mindease/perfil-usuario/remoteEntry.js'
            : 'perfilUsuario@http://localhost:3003/remoteEntry.js',
        },
        shared: {
          react: {
            singleton: true,
            requiredVersion: '^18.2.0',
          },
          'react-dom': {
            singleton: true,
            requiredVersion: '^18.2.0',
          },
          'react-router-dom': {
            singleton: true,
            requiredVersion: '^6.21.0',
          },
        },
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        favicon: './public/favicon.ico',
        title: 'MindEase - Acessibilidade Cognitiva',
      }),
    ],
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
          },
        },
      },
    },
  };
};
