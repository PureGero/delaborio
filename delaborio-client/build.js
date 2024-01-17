const rewire = require('rewire');
const defaults = rewire('react-scripts/scripts/build.js');
const config = defaults.__get__('config');

/**
 * Do not mangle component names in production for serialization purposes
 */
config.optimization.minimizer[0].options.minimizer.options.keep_classnames = true;