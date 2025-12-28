/**
 * Webpack loader for .nadi files in Next.js
 */

const { compile } = require('@nadi/compiler');

module.exports = function nadiLoader(source) {
  const callback = this.async();
  const options = this.getOptions();

  try {
    const result = compile(source, {
      filename: this.resourcePath,
      ssr: options.isServer,
      isProduction: !options.dev,
    });

    if (result.errors.length > 0) {
      callback(new Error(result.errors[0].message));
      return;
    }

    callback(null, result.code, result.map);
  } catch (error) {
    callback(error);
  }
};
