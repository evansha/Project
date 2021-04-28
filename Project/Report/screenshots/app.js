var app = angular.module('reportingApp', []);

//<editor-fold desc="global helpers">

var isValueAnArray = function (val) {
    return Array.isArray(val);
};

var getSpec = function (str) {
    var describes = str.split('|');
    return describes[describes.length - 1];
};
var checkIfShouldDisplaySpecName = function (prevItem, item) {
    if (!prevItem) {
        item.displaySpecName = true;
    } else if (getSpec(item.description) !== getSpec(prevItem.description)) {
        item.displaySpecName = true;
    }
};

var getParent = function (str) {
    var arr = str.split('|');
    str = "";
    for (var i = arr.length - 2; i > 0; i--) {
        str += arr[i] + " > ";
    }
    return str.slice(0, -3);
};

var getShortDescription = function (str) {
    return str.split('|')[0];
};

var countLogMessages = function (item) {
    if ((!item.logWarnings || !item.logErrors) && item.browserLogs && item.browserLogs.length > 0) {
        item.logWarnings = 0;
        item.logErrors = 0;
        for (var logNumber = 0; logNumber < item.browserLogs.length; logNumber++) {
            var logEntry = item.browserLogs[logNumber];
            if (logEntry.level === 'SEVERE') {
                item.logErrors++;
            }
            if (logEntry.level === 'WARNING') {
                item.logWarnings++;
            }
        }
    }
};

var convertTimestamp = function (timestamp) {
    var d = new Date(timestamp),
        yyyy = d.getFullYear(),
        mm = ('0' + (d.getMonth() + 1)).slice(-2),
        dd = ('0' + d.getDate()).slice(-2),
        hh = d.getHours(),
        h = hh,
        min = ('0' + d.getMinutes()).slice(-2),
        ampm = 'AM',
        time;

    if (hh > 12) {
        h = hh - 12;
        ampm = 'PM';
    } else if (hh === 12) {
        h = 12;
        ampm = 'PM';
    } else if (hh === 0) {
        h = 12;
    }

    // ie: 2013-02-18, 8:35 AM
    time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;

    return time;
};

var defaultSortFunction = function sortFunction(a, b) {
    if (a.sessionId < b.sessionId) {
        return -1;
    } else if (a.sessionId > b.sessionId) {
        return 1;
    }

    if (a.timestamp < b.timestamp) {
        return -1;
    } else if (a.timestamp > b.timestamp) {
        return 1;
    }

    return 0;
};

//</editor-fold>

app.controller('ScreenshotReportController', ['$scope', '$http', 'TitleService', function ($scope, $http, titleService) {
    var that = this;
    var clientDefaults = {};

    $scope.searchSettings = Object.assign({
        description: '',
        allselected: true,
        passed: true,
        failed: true,
        pending: true,
        withLog: true
    }, clientDefaults.searchSettings || {}); // enable customisation of search settings on first page hit

    this.warningTime = 1400;
    this.dangerTime = 1900;
    this.totalDurationFormat = clientDefaults.totalDurationFormat;
    this.showTotalDurationIn = clientDefaults.showTotalDurationIn;

    var initialColumnSettings = clientDefaults.columnSettings; // enable customisation of visible columns on first page hit
    if (initialColumnSettings) {
        if (initialColumnSettings.displayTime !== undefined) {
            // initial settings have be inverted because the html bindings are inverted (e.g. !ctrl.displayTime)
            this.displayTime = !initialColumnSettings.displayTime;
        }
        if (initialColumnSettings.displayBrowser !== undefined) {
            this.displayBrowser = !initialColumnSettings.displayBrowser; // same as above
        }
        if (initialColumnSettings.displaySessionId !== undefined) {
            this.displaySessionId = !initialColumnSettings.displaySessionId; // same as above
        }
        if (initialColumnSettings.displayOS !== undefined) {
            this.displayOS = !initialColumnSettings.displayOS; // same as above
        }
        if (initialColumnSettings.inlineScreenshots !== undefined) {
            this.inlineScreenshots = initialColumnSettings.inlineScreenshots; // this setting does not have to be inverted
        } else {
            this.inlineScreenshots = false;
        }
        if (initialColumnSettings.warningTime) {
            this.warningTime = initialColumnSettings.warningTime;
        }
        if (initialColumnSettings.dangerTime) {
            this.dangerTime = initialColumnSettings.dangerTime;
        }
    }


    this.chooseAllTypes = function () {
        var value = true;
        $scope.searchSettings.allselected = !$scope.searchSettings.allselected;
        if (!$scope.searchSettings.allselected) {
            value = false;
        }

        $scope.searchSettings.passed = value;
        $scope.searchSettings.failed = value;
        $scope.searchSettings.pending = value;
        $scope.searchSettings.withLog = value;
    };

    this.isValueAnArray = function (val) {
        return isValueAnArray(val);
    };

    this.getParent = function (str) {
        return getParent(str);
    };

    this.getSpec = function (str) {
        return getSpec(str);
    };

    this.getShortDescription = function (str) {
        return getShortDescription(str);
    };
    this.hasNextScreenshot = function (index) {
        var old = index;
        return old !== this.getNextScreenshotIdx(index);
    };

    this.hasPreviousScreenshot = function (index) {
        var old = index;
        return old !== this.getPreviousScreenshotIdx(index);
    };
    this.getNextScreenshotIdx = function (index) {
        var next = index;
        var hit = false;
        while (next + 2 < this.results.length) {
            next++;
            if (this.results[next].screenShotFile && !this.results[next].pending) {
                hit = true;
                break;
            }
        }
        return hit ? next : index;
    };

    this.getPreviousScreenshotIdx = function (index) {
        var prev = index;
        var hit = false;
        while (prev > 0) {
            prev--;
            if (this.results[prev].screenShotFile && !this.results[prev].pending) {
                hit = true;
                break;
            }
        }
        return hit ? prev : index;
    };

    this.convertTimestamp = convertTimestamp;


    this.round = function (number, roundVal) {
        return (parseFloat(number) / 1000).toFixed(roundVal);
    };


    this.passCount = function () {
        var passCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.passed) {
                passCount++;
            }
        }
        return passCount;
    };


    this.pendingCount = function () {
        var pendingCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.pending) {
                pendingCount++;
            }
        }
        return pendingCount;
    };

    this.failCount = function () {
        var failCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (!result.passed && !result.pending) {
                failCount++;
            }
        }
        return failCount;
    };

    this.totalDuration = function () {
        var sum = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.duration) {
                sum += result.duration;
            }
        }
        return sum;
    };

    this.passPerc = function () {
        return (this.passCount() / this.totalCount()) * 100;
    };
    this.pendingPerc = function () {
        return (this.pendingCount() / this.totalCount()) * 100;
    };
    this.failPerc = function () {
        return (this.failCount() / this.totalCount()) * 100;
    };
    this.totalCount = function () {
        return this.passCount() + this.failCount() + this.pendingCount();
    };


    var results = [
    {
        "description": "Multiform Assertion|Multiform Assertion",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13444,
        "browser": {
            "name": "chrome",
            "version": "90.0.4430.93"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://www.globalsqa.com/wp-content/cache/minify/72cc3.default.include.306296.js 0:0 Uncaught ReferenceError: jQuery is not defined",
                "timestamp": 1619596521218,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js 215:117 Uncaught P: adsbygoogle.push() error: Only one 'enable_page_level_ads' allowed per page.",
                "timestamp": 1619596521976,
                "type": ""
            }
        ],
        "screenShotFile": "images\\004e003a-003f-00eb-0040-0005004c00cd.png",
        "timestamp": 1619596519935,
        "duration": 14323
    },
    {
        "description": "Searchfilter Assertion|Searchfilter Assertion",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13444,
        "browser": {
            "name": "chrome",
            "version": "90.0.4430.93"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://www.globalsqa.com/wp-content/cache/minify/72cc3.default.include.306296.js 0:0 Uncaught ReferenceError: jQuery is not defined",
                "timestamp": 1619596534940,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js 65:977 Uncaught P: adsbygoogle.push() error: Only one 'enable_page_level_ads' allowed per page.",
                "timestamp": 1619596535035,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00560092-00c9-0053-005f-0029007d00c5.png",
        "timestamp": 1619596534534,
        "duration": 3151
    },
    {
        "description": "WebTable Assertion|WebTable Assertion",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13444,
        "browser": {
            "name": "chrome",
            "version": "90.0.4430.93"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://www.globalsqa.com/wp-content/cache/minify/72cc3.default.include.306296.js 0:0 Uncaught ReferenceError: jQuery is not defined",
                "timestamp": 1619596538989,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js 65:977 Uncaught P: adsbygoogle.push() error: Only one 'enable_page_level_ads' allowed per page.",
                "timestamp": 1619596539082,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00f300d8-00d8-0045-0091-003700d6008c.png",
        "timestamp": 1619596538118,
        "duration": 4764
    },
    {
        "description": "Signin with invalid username and password and assert the error labels|Assert RegistrationLogin Section",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13444,
        "browser": {
            "name": "chrome",
            "version": "90.0.4430.93"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://www.globalsqa.com/wp-content/cache/minify/72cc3.default.include.306296.js 0:0 Uncaught ReferenceError: jQuery is not defined",
                "timestamp": 1619596543612,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js 65:977 Uncaught P: adsbygoogle.push() error: Only one 'enable_page_level_ads' allowed per page.",
                "timestamp": 1619596543684,
                "type": ""
            }
        ],
        "screenShotFile": "images\\001f0015-0066-0011-0082-009d0035006c.png",
        "timestamp": 1619596543236,
        "duration": 8643
    },
    {
        "description": "Assert login is successful, and assert the labels shown |Assert RegistrationLogin Section",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13444,
        "browser": {
            "name": "chrome",
            "version": "90.0.4430.93"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://www.globalsqa.com/wp-content/cache/minify/72cc3.default.include.306296.js 0:0 Uncaught ReferenceError: jQuery is not defined",
                "timestamp": 1619596552834,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js 65:977 Uncaught P: adsbygoogle.push() error: Only one 'enable_page_level_ads' allowed per page.",
                "timestamp": 1619596552919,
                "type": ""
            }
        ],
        "screenShotFile": "images\\000a00a2-0052-003e-0079-00e500ca0089.png",
        "timestamp": 1619596552012,
        "duration": 9940
    },
    {
        "description": "Assert various search boxes and search result|Assert Scrollable Section",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13444,
        "browser": {
            "name": "chrome",
            "version": "90.0.4430.93"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://www.globalsqa.com/wp-content/cache/minify/72cc3.default.include.306296.js 0:0 Uncaught ReferenceError: jQuery is not defined",
                "timestamp": 1619596562965,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js 65:977 Uncaught P: adsbygoogle.push() error: Only one 'enable_page_level_ads' allowed per page.",
                "timestamp": 1619596563024,
                "type": ""
            }
        ],
        "screenShotFile": "images\\001900ba-0055-0068-0007-0073009a000a.png",
        "timestamp": 1619596562091,
        "duration": 2917
    },
    {
        "description": "Assert and upload image|Assert UploadImage Section",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13444,
        "browser": {
            "name": "chrome",
            "version": "90.0.4430.93"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js 215:117 Uncaught P: adsbygoogle.push() error: Only one 'enable_page_level_ads' allowed per page.",
                "timestamp": 1619596566158,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00de0083-0008-004a-0092-001100b700d6.png",
        "timestamp": 1619596565187,
        "duration": 3147
    },
    {
        "description": "Normal intake Consumption Calculations|Assert UploadImage Section",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13444,
        "browser": {
            "name": "chrome",
            "version": "90.0.4430.93"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://www.globalsqa.com/wp-content/cache/minify/72cc3.default.include.306296.js 0:0 Uncaught ReferenceError: jQuery is not defined",
                "timestamp": 1619596569327,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js 65:977 Uncaught P: adsbygoogle.push() error: Only one 'enable_page_level_ads' allowed per page.",
                "timestamp": 1619596569376,
                "type": ""
            }
        ],
        "screenShotFile": "images\\0011008c-008c-003a-0023-0046004c00bb.png",
        "timestamp": 1619596568918,
        "duration": 3340
    },
    {
        "description": "Excess Intake Consumption Calculations|Assert UploadImage Section",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13444,
        "browser": {
            "name": "chrome",
            "version": "90.0.4430.93"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://www.globalsqa.com/wp-content/cache/minify/72cc3.default.include.306296.js 0:0 Uncaught ReferenceError: jQuery is not defined",
                "timestamp": 1619596572773,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js 65:977 Uncaught P: adsbygoogle.push() error: Only one 'enable_page_level_ads' allowed per page.",
                "timestamp": 1619596572860,
                "type": ""
            }
        ],
        "screenShotFile": "images\\004b00e1-0079-009b-003b-00d500e900c1.png",
        "timestamp": 1619596572392,
        "duration": 1603
    },
    {
        "description": "Assert for valid calculation in Angular js Calculator|Simple Calculator Assertion",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13444,
        "browser": {
            "name": "chrome",
            "version": "90.0.4430.93"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://www.globalsqa.com/wp-content/cache/minify/72cc3.default.include.306296.js 0:0 Uncaught ReferenceError: jQuery is not defined",
                "timestamp": 1619596574536,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js 65:977 Uncaught P: adsbygoogle.push() error: Only one 'enable_page_level_ads' allowed per page.",
                "timestamp": 1619596574592,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00560081-00cc-0019-00b6-00b00060007f.png",
        "timestamp": 1619596574157,
        "duration": 8684
    },
    {
        "description": "Assert for Invalid calculation in Angular js Calculator|Simple Calculator Assertion",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13444,
        "browser": {
            "name": "chrome",
            "version": "90.0.4430.93"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://www.globalsqa.com/wp-content/cache/minify/72cc3.default.include.306296.js 0:0 Uncaught ReferenceError: jQuery is not defined",
                "timestamp": 1619596583365,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js 65:977 Uncaught P: adsbygoogle.push() error: Only one 'enable_page_level_ads' allowed per page.",
                "timestamp": 1619596583451,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00060079-0087-000b-00ae-00b000cd00c3.png",
        "timestamp": 1619596582976,
        "duration": 1147
    },
    {
        "description": "CustomersTransaction Functionality_check|XYZ_Bank_Customers_Functionalitycheck",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13444,
        "browser": {
            "name": "chrome",
            "version": "90.0.4430.93"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://www.globalsqa.com/wp-content/cache/minify/72cc3.default.include.306296.js 0:0 Uncaught ReferenceError: jQuery is not defined",
                "timestamp": 1619596585119,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js 215:117 Uncaught P: adsbygoogle.push() error: Only one 'enable_page_level_ads' allowed per page.",
                "timestamp": 1619596585209,
                "type": ""
            }
        ],
        "screenShotFile": "images\\004000aa-00f5-00a1-0005-0081007800ed.png",
        "timestamp": 1619596584297,
        "duration": 4177
    },
    {
        "description": "Customers Deposit Functionality_check|XYZ_Bank_Customers_Functionalitycheck",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13444,
        "browser": {
            "name": "chrome",
            "version": "90.0.4430.93"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://www.globalsqa.com/wp-content/cache/minify/72cc3.default.include.306296.js 0:0 Uncaught ReferenceError: jQuery is not defined",
                "timestamp": 1619596589051,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js 65:977 Uncaught P: adsbygoogle.push() error: Only one 'enable_page_level_ads' allowed per page.",
                "timestamp": 1619596589112,
                "type": ""
            }
        ],
        "screenShotFile": "images\\008d00be-0096-0069-0022-00a1003500d8.png",
        "timestamp": 1619596588633,
        "duration": 1749
    },
    {
        "description": "Customers Withdrawal Functionality_check|XYZ_Bank_Customers_Functionalitycheck",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13444,
        "browser": {
            "name": "chrome",
            "version": "90.0.4430.93"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://www.globalsqa.com/wp-content/cache/minify/72cc3.default.include.306296.js 0:0 Uncaught ReferenceError: jQuery is not defined",
                "timestamp": 1619596590978,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js 65:977 Uncaught P: adsbygoogle.push() error: Only one 'enable_page_level_ads' allowed per page.",
                "timestamp": 1619596591066,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00770068-0003-00ba-00ee-00d9005500fb.png",
        "timestamp": 1619596590587,
        "duration": 1954
    },
    {
        "description": "Home page Assert|XYZ Bank Homepage Assert",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13444,
        "browser": {
            "name": "chrome",
            "version": "90.0.4430.93"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://www.globalsqa.com/wp-content/cache/minify/72cc3.default.include.306296.js 0:0 Uncaught ReferenceError: jQuery is not defined",
                "timestamp": 1619596593191,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js 65:977 Uncaught P: adsbygoogle.push() error: Only one 'enable_page_level_ads' allowed per page.",
                "timestamp": 1619596593243,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00410012-00e0-007c-00b3-007c00ea0057.png",
        "timestamp": 1619596592762,
        "duration": 1010
    },
    {
        "description": "Managers_addCustomers_functionality_Check|XYZ_Bank_Managerlogin_Functionalitycheck",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13444,
        "browser": {
            "name": "chrome",
            "version": "90.0.4430.93"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://www.globalsqa.com/wp-content/cache/minify/72cc3.default.include.306296.js 0:0 Uncaught ReferenceError: jQuery is not defined",
                "timestamp": 1619596594887,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js 65:977 Uncaught P: adsbygoogle.push() error: Only one 'enable_page_level_ads' allowed per page.",
                "timestamp": 1619596594929,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00f10074-000b-00d7-002b-00d700cc0026.png",
        "timestamp": 1619596594051,
        "duration": 4982
    },
    {
        "description": "manager_Accountfunctionality_check|XYZ_Bank_Managerlogin_Functionalitycheck",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13444,
        "browser": {
            "name": "chrome",
            "version": "90.0.4430.93"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js 215:117 Uncaught P: adsbygoogle.push() error: Only one 'enable_page_level_ads' allowed per page.",
                "timestamp": 1619596600242,
                "type": ""
            }
        ],
        "screenShotFile": "images\\004d00fd-00bc-0030-000a-00f100bc00a9.png",
        "timestamp": 1619596599270,
        "duration": 5304
    },
    {
        "description": "manager_Customerfunctionality_check|XYZ_Bank_Managerlogin_Functionalitycheck",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13444,
        "browser": {
            "name": "chrome",
            "version": "90.0.4430.93"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "SEVERE",
                "message": "https://www.globalsqa.com/wp-content/cache/minify/72cc3.default.include.306296.js 0:0 Uncaught ReferenceError: jQuery is not defined",
                "timestamp": 1619596605149,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js 65:977 Uncaught P: adsbygoogle.push() error: Only one 'enable_page_level_ads' allowed per page.",
                "timestamp": 1619596605238,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00c60056-0078-0044-00ae-004000e900c3.png",
        "timestamp": 1619596604778,
        "duration": 4465
    },
    {
        "description": "Get Titles|AngularPage_assertion",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13444,
        "browser": {
            "name": "chrome",
            "version": "90.0.4430.93"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "WARNING",
                "message": "https://angular.io/ - ::-webkit-details-marker pseudo element selector is deprecated. Please use ::marker instead. See https://chromestatus.com/feature/6730096436051968 for more details.",
                "timestamp": 1619596609773,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://angular.io/polyfills-es2015.1a4c72da9816597260d1.js 0 A preload for 'https://angular.io/generated/navigation.json' is found, but is not used because the request headers do not match.",
                "timestamp": 1619596609912,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://angular.io/polyfills-es2015.1a4c72da9816597260d1.js 0 A preload for 'https://angular.io/generated/docs/index.json' is found, but is not used because the request headers do not match.",
                "timestamp": 1619596609942,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00cc0027-0094-000a-00c5-003800e200a9.png",
        "timestamp": 1619596609497,
        "duration": 1587
    },
    {
        "description": "Get Bodytext|AngularPage_assertion",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13444,
        "browser": {
            "name": "chrome",
            "version": "90.0.4430.93"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "WARNING",
                "message": "https://angular.io/polyfills-es2015.1a4c72da9816597260d1.js 0 A preload for 'https://angular.io/generated/navigation.json' is found, but is not used because the request headers do not match.",
                "timestamp": 1619596612077,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://angular.io/polyfills-es2015.1a4c72da9816597260d1.js 0 A preload for 'https://angular.io/generated/docs/index.json' is found, but is not used because the request headers do not match.",
                "timestamp": 1619596612104,
                "type": ""
            }
        ],
        "screenShotFile": "images\\007100c0-0056-006c-0082-002b00000042.png",
        "timestamp": 1619596611925,
        "duration": 1642
    },
    {
        "description": "Assert Images |AngularPage_assertion",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13444,
        "browser": {
            "name": "chrome",
            "version": "90.0.4430.93"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "WARNING",
                "message": "https://angular.io/ - ::-webkit-details-marker pseudo element selector is deprecated. Please use ::marker instead. See https://chromestatus.com/feature/6730096436051968 for more details.",
                "timestamp": 1619596614763,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://angular.io/polyfills-es2015.1a4c72da9816597260d1.js 0 A preload for 'https://angular.io/generated/navigation.json' is found, but is not used because the request headers do not match.",
                "timestamp": 1619596614783,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://angular.io/polyfills-es2015.1a4c72da9816597260d1.js 0 A preload for 'https://angular.io/generated/docs/index.json' is found, but is not used because the request headers do not match.",
                "timestamp": 1619596614796,
                "type": ""
            }
        ],
        "screenShotFile": "images\\0078004f-0060-007d-0085-002c001a00d5.png",
        "timestamp": 1619596614021,
        "duration": 1061
    },
    {
        "description": "Assert LogoBox|AngularPage_assertion",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13444,
        "browser": {
            "name": "chrome",
            "version": "90.0.4430.93"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "WARNING",
                "message": "https://angular.io/polyfills-es2015.1a4c72da9816597260d1.js 0 A preload for 'https://angular.io/generated/navigation.json' is found, but is not used because the request headers do not match.",
                "timestamp": 1619596615593,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://angular.io/polyfills-es2015.1a4c72da9816597260d1.js 0 A preload for 'https://angular.io/generated/docs/index.json' is found, but is not used because the request headers do not match.",
                "timestamp": 1619596615607,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00be0091-00d8-00fe-0076-008e00f10066.png",
        "timestamp": 1619596615528,
        "duration": 326
    },
    {
        "description": "Home page functionalities|ProtoCommerce Homepage Functionality",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13444,
        "browser": {
            "name": "chrome",
            "version": "90.0.4430.93"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "images\\00c90098-006e-0093-004b-00b20089002a.png",
        "timestamp": 1619596616270,
        "duration": 4754
    },
    {
        "description": "print product details|ProtoCommerce Shop_page Functionality",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13444,
        "browser": {
            "name": "chrome",
            "version": "90.0.4430.93"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "WARNING",
                "message": "https://rahulshettyacademy.com/angularpractice/shop - Mixed Content: The page at 'https://rahulshettyacademy.com/angularpractice/shop' was loaded over HTTPS, but requested an insecure element 'http://placehold.it/900x350'. This request was automatically upgraded to HTTPS, For more information see https://blog.chromium.org/2019/10/no-more-mixed-messages-about-https.html",
                "timestamp": 1619596621464,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://rahulshettyacademy.com/angularpractice/shop - Mixed Content: The page at 'https://rahulshettyacademy.com/angularpractice/shop' was loaded over HTTPS, but requested an insecure element 'http://placehold.it/900x350'. This request was automatically upgraded to HTTPS, For more information see https://blog.chromium.org/2019/10/no-more-mixed-messages-about-https.html",
                "timestamp": 1619596621464,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://rahulshettyacademy.com/angularpractice/shop - Mixed Content: The page at 'https://rahulshettyacademy.com/angularpractice/shop' was loaded over HTTPS, but requested an insecure element 'http://placehold.it/900x350'. This request was automatically upgraded to HTTPS, For more information see https://blog.chromium.org/2019/10/no-more-mixed-messages-about-https.html",
                "timestamp": 1619596621465,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://placehold.it/900x350 - Failed to load resource: net::ERR_CERT_DATE_INVALID",
                "timestamp": 1619596622135,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://rahulshettyacademy.com/angularpractice/shop - Mixed Content: The page at 'https://rahulshettyacademy.com/angularpractice/shop' was loaded over HTTPS, but requested an insecure element 'http://placehold.it/900x350'. This request was automatically upgraded to HTTPS, For more information see https://blog.chromium.org/2019/10/no-more-mixed-messages-about-https.html",
                "timestamp": 1619596622273,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://rahulshettyacademy.com/angularpractice/shop - Mixed Content: The page at 'https://rahulshettyacademy.com/angularpractice/shop' was loaded over HTTPS, but requested an insecure element 'http://placehold.it/900x350'. This request was automatically upgraded to HTTPS, For more information see https://blog.chromium.org/2019/10/no-more-mixed-messages-about-https.html",
                "timestamp": 1619596622274,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://rahulshettyacademy.com/angularpractice/shop - Mixed Content: The page at 'https://rahulshettyacademy.com/angularpractice/shop' was loaded over HTTPS, but requested an insecure element 'http://placehold.it/900x350'. This request was automatically upgraded to HTTPS, For more information see https://blog.chromium.org/2019/10/no-more-mixed-messages-about-https.html",
                "timestamp": 1619596622274,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://placehold.it/900x350 - Failed to load resource: net::ERR_CERT_DATE_INVALID",
                "timestamp": 1619596622293,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00fa002c-00a6-0080-00dd-0009006700d3.png",
        "timestamp": 1619596621280,
        "duration": 1428
    },
    {
        "description": "add to Cart|ProtoCommerce Shop_page Functionality",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13444,
        "browser": {
            "name": "chrome",
            "version": "90.0.4430.93"
        },
        "message": "Passed",
        "browserLogs": [
            {
                "level": "WARNING",
                "message": "https://rahulshettyacademy.com/angularpractice/shop - Mixed Content: The page at 'https://rahulshettyacademy.com/angularpractice/shop' was loaded over HTTPS, but requested an insecure element 'http://placehold.it/900x350'. This request was automatically upgraded to HTTPS, For more information see https://blog.chromium.org/2019/10/no-more-mixed-messages-about-https.html",
                "timestamp": 1619596623180,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://rahulshettyacademy.com/angularpractice/shop - Mixed Content: The page at 'https://rahulshettyacademy.com/angularpractice/shop' was loaded over HTTPS, but requested an insecure element 'http://placehold.it/900x350'. This request was automatically upgraded to HTTPS, For more information see https://blog.chromium.org/2019/10/no-more-mixed-messages-about-https.html",
                "timestamp": 1619596623180,
                "type": ""
            },
            {
                "level": "WARNING",
                "message": "https://rahulshettyacademy.com/angularpractice/shop - Mixed Content: The page at 'https://rahulshettyacademy.com/angularpractice/shop' was loaded over HTTPS, but requested an insecure element 'http://placehold.it/900x350'. This request was automatically upgraded to HTTPS, For more information see https://blog.chromium.org/2019/10/no-more-mixed-messages-about-https.html",
                "timestamp": 1619596623181,
                "type": ""
            },
            {
                "level": "SEVERE",
                "message": "https://placehold.it/900x350 - Failed to load resource: net::ERR_CERT_DATE_INVALID",
                "timestamp": 1619596623843,
                "type": ""
            }
        ],
        "screenShotFile": "images\\00ff001d-00f0-00ba-0010-0007008d0008.png",
        "timestamp": 1619596622945,
        "duration": 4446
    }
];

    this.sortSpecs = function () {
        this.results = results.sort(function sortFunction(a, b) {
    if (a.sessionId < b.sessionId) return -1;else if (a.sessionId > b.sessionId) return 1;

    if (a.timestamp < b.timestamp) return -1;else if (a.timestamp > b.timestamp) return 1;

    return 0;
});

    };

    this.setTitle = function () {
        var title = $('.report-title').text();
        titleService.setTitle(title);
    };

    // is run after all test data has been prepared/loaded
    this.afterLoadingJobs = function () {
        this.sortSpecs();
        this.setTitle();
    };

    this.loadResultsViaAjax = function () {

        $http({
            url: './combined.json',
            method: 'GET'
        }).then(function (response) {
                var data = null;
                if (response && response.data) {
                    if (typeof response.data === 'object') {
                        data = response.data;
                    } else if (response.data[0] === '"') { //detect super escaped file (from circular json)
                        data = CircularJSON.parse(response.data); //the file is escaped in a weird way (with circular json)
                    } else {
                        data = JSON.parse(response.data);
                    }
                }
                if (data) {
                    results = data;
                    that.afterLoadingJobs();
                }
            },
            function (error) {
                console.error(error);
            });
    };


    if (clientDefaults.useAjax) {
        this.loadResultsViaAjax();
    } else {
        this.afterLoadingJobs();
    }

}]);

app.filter('bySearchSettings', function () {
    return function (items, searchSettings) {
        var filtered = [];
        if (!items) {
            return filtered; // to avoid crashing in where results might be empty
        }
        var prevItem = null;

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.displaySpecName = false;

            var isHit = false; //is set to true if any of the search criteria matched
            countLogMessages(item); // modifies item contents

            var hasLog = searchSettings.withLog && item.browserLogs && item.browserLogs.length > 0;
            if (searchSettings.description === '' ||
                (item.description && item.description.toLowerCase().indexOf(searchSettings.description.toLowerCase()) > -1)) {

                if (searchSettings.passed && item.passed || hasLog) {
                    isHit = true;
                } else if (searchSettings.failed && !item.passed && !item.pending || hasLog) {
                    isHit = true;
                } else if (searchSettings.pending && item.pending || hasLog) {
                    isHit = true;
                }
            }
            if (isHit) {
                checkIfShouldDisplaySpecName(prevItem, item);

                filtered.push(item);
                prevItem = item;
            }
        }

        return filtered;
    };
});

//formats millseconds to h m s
app.filter('timeFormat', function () {
    return function (tr, fmt) {
        if(tr == null){
            return "NaN";
        }

        switch (fmt) {
            case 'h':
                var h = tr / 1000 / 60 / 60;
                return "".concat(h.toFixed(2)).concat("h");
            case 'm':
                var m = tr / 1000 / 60;
                return "".concat(m.toFixed(2)).concat("min");
            case 's' :
                var s = tr / 1000;
                return "".concat(s.toFixed(2)).concat("s");
            case 'hm':
            case 'h:m':
                var hmMt = tr / 1000 / 60;
                var hmHr = Math.trunc(hmMt / 60);
                var hmMr = hmMt - (hmHr * 60);
                if (fmt === 'h:m') {
                    return "".concat(hmHr).concat(":").concat(hmMr < 10 ? "0" : "").concat(Math.round(hmMr));
                }
                return "".concat(hmHr).concat("h ").concat(hmMr.toFixed(2)).concat("min");
            case 'hms':
            case 'h:m:s':
                var hmsS = tr / 1000;
                var hmsHr = Math.trunc(hmsS / 60 / 60);
                var hmsM = hmsS / 60;
                var hmsMr = Math.trunc(hmsM - hmsHr * 60);
                var hmsSo = hmsS - (hmsHr * 60 * 60) - (hmsMr*60);
                if (fmt === 'h:m:s') {
                    return "".concat(hmsHr).concat(":").concat(hmsMr < 10 ? "0" : "").concat(hmsMr).concat(":").concat(hmsSo < 10 ? "0" : "").concat(Math.round(hmsSo));
                }
                return "".concat(hmsHr).concat("h ").concat(hmsMr).concat("min ").concat(hmsSo.toFixed(2)).concat("s");
            case 'ms':
                var msS = tr / 1000;
                var msMr = Math.trunc(msS / 60);
                var msMs = msS - (msMr * 60);
                return "".concat(msMr).concat("min ").concat(msMs.toFixed(2)).concat("s");
        }

        return tr;
    };
});


function PbrStackModalController($scope, $rootScope) {
    var ctrl = this;
    ctrl.rootScope = $rootScope;
    ctrl.getParent = getParent;
    ctrl.getShortDescription = getShortDescription;
    ctrl.convertTimestamp = convertTimestamp;
    ctrl.isValueAnArray = isValueAnArray;
    ctrl.toggleSmartStackTraceHighlight = function () {
        var inv = !ctrl.rootScope.showSmartStackTraceHighlight;
        ctrl.rootScope.showSmartStackTraceHighlight = inv;
    };
    ctrl.applySmartHighlight = function (line) {
        if ($rootScope.showSmartStackTraceHighlight) {
            if (line.indexOf('node_modules') > -1) {
                return 'greyout';
            }
            if (line.indexOf('  at ') === -1) {
                return '';
            }

            return 'highlight';
        }
        return '';
    };
}


app.component('pbrStackModal', {
    templateUrl: "pbr-stack-modal.html",
    bindings: {
        index: '=',
        data: '='
    },
    controller: PbrStackModalController
});

function PbrScreenshotModalController($scope, $rootScope) {
    var ctrl = this;
    ctrl.rootScope = $rootScope;
    ctrl.getParent = getParent;
    ctrl.getShortDescription = getShortDescription;

    /**
     * Updates which modal is selected.
     */
    this.updateSelectedModal = function (event, index) {
        var key = event.key; //try to use non-deprecated key first https://developer.mozilla.org/de/docs/Web/API/KeyboardEvent/keyCode
        if (key == null) {
            var keyMap = {
                37: 'ArrowLeft',
                39: 'ArrowRight'
            };
            key = keyMap[event.keyCode]; //fallback to keycode
        }
        if (key === "ArrowLeft" && this.hasPrevious) {
            this.showHideModal(index, this.previous);
        } else if (key === "ArrowRight" && this.hasNext) {
            this.showHideModal(index, this.next);
        }
    };

    /**
     * Hides the modal with the #oldIndex and shows the modal with the #newIndex.
     */
    this.showHideModal = function (oldIndex, newIndex) {
        const modalName = '#imageModal';
        $(modalName + oldIndex).modal("hide");
        $(modalName + newIndex).modal("show");
    };

}

app.component('pbrScreenshotModal', {
    templateUrl: "pbr-screenshot-modal.html",
    bindings: {
        index: '=',
        data: '=',
        next: '=',
        previous: '=',
        hasNext: '=',
        hasPrevious: '='
    },
    controller: PbrScreenshotModalController
});

app.factory('TitleService', ['$document', function ($document) {
    return {
        setTitle: function (title) {
            $document[0].title = title;
        }
    };
}]);


app.run(
    function ($rootScope, $templateCache) {
        //make sure this option is on by default
        $rootScope.showSmartStackTraceHighlight = true;
        
  $templateCache.put('pbr-screenshot-modal.html',
    '<div class="modal" id="imageModal{{$ctrl.index}}" tabindex="-1" role="dialog"\n' +
    '     aria-labelledby="imageModalLabel{{$ctrl.index}}" ng-keydown="$ctrl.updateSelectedModal($event,$ctrl.index)">\n' +
    '    <div class="modal-dialog modal-lg m-screenhot-modal" role="document">\n' +
    '        <div class="modal-content">\n' +
    '            <div class="modal-header">\n' +
    '                <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n' +
    '                    <span aria-hidden="true">&times;</span>\n' +
    '                </button>\n' +
    '                <h6 class="modal-title" id="imageModalLabelP{{$ctrl.index}}">\n' +
    '                    {{$ctrl.getParent($ctrl.data.description)}}</h6>\n' +
    '                <h5 class="modal-title" id="imageModalLabel{{$ctrl.index}}">\n' +
    '                    {{$ctrl.getShortDescription($ctrl.data.description)}}</h5>\n' +
    '            </div>\n' +
    '            <div class="modal-body">\n' +
    '                <img class="screenshotImage" ng-src="{{$ctrl.data.screenShotFile}}">\n' +
    '            </div>\n' +
    '            <div class="modal-footer">\n' +
    '                <div class="pull-left">\n' +
    '                    <button ng-disabled="!$ctrl.hasPrevious" class="btn btn-default btn-previous" data-dismiss="modal"\n' +
    '                            data-toggle="modal" data-target="#imageModal{{$ctrl.previous}}">\n' +
    '                        Prev\n' +
    '                    </button>\n' +
    '                    <button ng-disabled="!$ctrl.hasNext" class="btn btn-default btn-next"\n' +
    '                            data-dismiss="modal" data-toggle="modal"\n' +
    '                            data-target="#imageModal{{$ctrl.next}}">\n' +
    '                        Next\n' +
    '                    </button>\n' +
    '                </div>\n' +
    '                <a class="btn btn-primary" href="{{$ctrl.data.screenShotFile}}" target="_blank">\n' +
    '                    Open Image in New Tab\n' +
    '                    <span class="glyphicon glyphicon-new-window" aria-hidden="true"></span>\n' +
    '                </a>\n' +
    '                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
     ''
  );

  $templateCache.put('pbr-stack-modal.html',
    '<div class="modal" id="modal{{$ctrl.index}}" tabindex="-1" role="dialog"\n' +
    '     aria-labelledby="stackModalLabel{{$ctrl.index}}">\n' +
    '    <div class="modal-dialog modal-lg m-stack-modal" role="document">\n' +
    '        <div class="modal-content">\n' +
    '            <div class="modal-header">\n' +
    '                <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n' +
    '                    <span aria-hidden="true">&times;</span>\n' +
    '                </button>\n' +
    '                <h6 class="modal-title" id="stackModalLabelP{{$ctrl.index}}">\n' +
    '                    {{$ctrl.getParent($ctrl.data.description)}}</h6>\n' +
    '                <h5 class="modal-title" id="stackModalLabel{{$ctrl.index}}">\n' +
    '                    {{$ctrl.getShortDescription($ctrl.data.description)}}</h5>\n' +
    '            </div>\n' +
    '            <div class="modal-body">\n' +
    '                <div ng-if="$ctrl.data.trace.length > 0">\n' +
    '                    <div ng-if="$ctrl.isValueAnArray($ctrl.data.trace)">\n' +
    '                        <pre class="logContainer" ng-repeat="trace in $ctrl.data.trace track by $index"><div ng-class="$ctrl.applySmartHighlight(line)" ng-repeat="line in trace.split(\'\\n\') track by $index">{{line}}</div></pre>\n' +
    '                    </div>\n' +
    '                    <div ng-if="!$ctrl.isValueAnArray($ctrl.data.trace)">\n' +
    '                        <pre class="logContainer"><div ng-class="$ctrl.applySmartHighlight(line)" ng-repeat="line in $ctrl.data.trace.split(\'\\n\') track by $index">{{line}}</div></pre>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '                <div ng-if="$ctrl.data.browserLogs.length > 0">\n' +
    '                    <h5 class="modal-title">\n' +
    '                        Browser logs:\n' +
    '                    </h5>\n' +
    '                    <pre class="logContainer"><div class="browserLogItem"\n' +
    '                                                   ng-repeat="logError in $ctrl.data.browserLogs track by $index"><div><span class="label browserLogLabel label-default"\n' +
    '                                                                                                                             ng-class="{\'label-danger\': logError.level===\'SEVERE\', \'label-warning\': logError.level===\'WARNING\'}">{{logError.level}}</span><span class="label label-default">{{$ctrl.convertTimestamp(logError.timestamp)}}</span><div ng-repeat="messageLine in logError.message.split(\'\\\\n\') track by $index">{{ messageLine }}</div></div></div></pre>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="modal-footer">\n' +
    '                <button class="btn btn-default"\n' +
    '                        ng-class="{active: $ctrl.rootScope.showSmartStackTraceHighlight}"\n' +
    '                        ng-click="$ctrl.toggleSmartStackTraceHighlight()">\n' +
    '                    <span class="glyphicon glyphicon-education black"></span> Smart Stack Trace\n' +
    '                </button>\n' +
    '                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
     ''
  );

    });
