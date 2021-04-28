//Running tests in chrome browser
var chrome = 
{
    'browserName': 'chrome',

};

//Running tests in chrome browser parallelly with 3 browser instance
var chromeInstances = 
{
    'browserName': 'chrome',
    'shardTestFiles': true,

    //Browser instance count
    'maxInstances': 2
};

//Running tests in firefox browser
var firefox = {
    'browserName': 'firefox',

};

//Running tests in firefox browser parallelly with 2 browser instance
var firefoxInstances = 
{
    'browserName': 'firefox',
    'shardTestFiles': true,

    //Browser instance count
    'maxInstances': 2

};

//Running tests in chrome and firefox browser parallelly
var firefox_chrome = 
[{
        'browserName': 'chrome'
    },
    {
        'browserName': 'firefox'
    },
];

//Running tests in chrome and firefox browser parallelly with 2 browser instance for each
var firefox_chromeInstances = 
[{
        'browserName': 'chrome',
        'shardTestFiles': true,

        //Browser instance count
        'maxInstances': 2
    },
    {
        'browserName': 'firefox',
        'shardTestFiles': true,

        //Browser instance count
        'maxInstances': 2
        
    },

];

module.exports = 
{
    chrome,
    firefox,
    firefox_chrome,
    chromeInstances,
    firefoxInstances,
    firefox_chromeInstances
}