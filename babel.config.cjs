module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: { node: 'current' },
      modules: 'commonjs',
      useBuiltIns: 'usage',
      corejs: 3,
    }],
    ['@babel/preset-react', {
      runtime: 'automatic',
      development: process.env.BABEL_ENV !== 'production',
    }],
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      regenerator: true,
      corejs: 3,
    }],
  ],
}; 