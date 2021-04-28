// An example configuration file.
var HtmlReporter = require('protractor-beautiful-reporter');
var browserConfig = require('./browserConfig');

exports.config = 
{
  directConnect : true,

//Running in chrome browser
capabilities: browserConfig['chrome'],

//capabilities: browserConfig['chromeInstances'],

framework: 'jasmine',

useAllAngular2AppRoots: true,

specs:  ['Testcases/BasicComponents/**.*js','Testcases/IntermediateComponents/**.*js','Testcases/Smallprojects/**.*js','Testcases/Smallprojects/Banking/**.*js','Testcases/Angular/**.*js','Testcases/ProtoCommerce/**.*js'],

allScriptsTimeout: 1000000,


onPrepare: function() {
  // Add a screenshot reporter and store screenshots to `/Reports/screenshots/images`:

  jasmine.getEnv().addReporter(new HtmlReporter( {

     baseDirectory: 'Report/screenshots',

     screenshotsSubfolder: 'images',

     jsonsSubfolder: 'jsons'

  }).getJasmine2Reporter());

},

jasmineNodeOpts: { 
defaultTimeOutInterval: 1000000
}
}

