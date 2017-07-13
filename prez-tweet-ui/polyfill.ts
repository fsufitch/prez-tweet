import 'core-js/client/core';
import 'reflect-metadata';
require('zone.js/dist/zone');

if (['prod', 'deploy'].indexOf(process.env.ENV) > -1) {
  // Production

} else {
  // Development

  Error['stackTraceLimit'] = Infinity;

  require('zone.js/dist/long-stack-trace-zone');
}
