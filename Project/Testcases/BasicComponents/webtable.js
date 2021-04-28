let BasicComponents = require('../../Page Objects/BasicComponents_Page');
let tc = require('../../TestConstants.js');
let util = require('../../Testutils.js');
let row = element.all(by.css(".table tr"));

describe("WebTable Assertion",function()
{
    beforeEach(function()
    {
        browser.waitForAngularEnabled(false);

        //Go to the link
        tc.URL();

        //Maximize browser
        browser.manage().window().maximize();

        //wait for webtable
        util.until(BasicComponents.webtable);
        //click on Multiform button
        BasicComponents.webtable.click();

    })

    it("WebTable Assertion",function()
    {
        //Assert table
        expect((BasicComponents.table).isPresent()).toBe(true);
        //Assert first row
        expect(element(by.css(' tr:nth-child(1) > th:nth-child(1)')).getText()).toEqual("firstName");
        expect(element(by.css(' tr:nth-child(1) > th:nth-child(2)')).getText()).toEqual("lastName");
        expect(element(by.css(' tr:nth-child(1) > th:nth-child(3)')).getText()).toEqual("age");
        expect(element(by.css(' tr:nth-child(1) > th:nth-child(4)')).getText()).toEqual("email");
        expect(element(by.css(' tr:nth-child(1) > th:nth-child(5)')).getText()).toEqual("balance");

        //Assert firstName
        expect((BasicComponents.firstname).isPresent()).toBe(true);
        BasicComponents.firstname.sendKeys("Pol");

        //Asser globally
        expect((BasicComponents.globalsearch).isPresent()).toBe(true);
        BasicComponents.globalsearch.sendKeys("bjip");

        //Print no. of rows
        row.count().then(function(rowCount)
        {
            console.log("Count:"+rowCount) 
        })


    })
})