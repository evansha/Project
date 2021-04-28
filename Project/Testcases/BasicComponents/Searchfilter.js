let BasicComponents = require('../../Page Objects/BasicComponents_Page');
let tc = require('../../TestConstants.js');
let util = require('../../Testutils.js');

describe("Searchfilter Assertion",function()
{
    beforeEach(function()
    {
        browser.waitForAngularEnabled(false);

        //Go to the link
        tc.URL();

        //Maximize browser
        browser.manage().window().maximize();

        //wait for searchfilter
        util.until( BasicComponents.searchfilter);
        //click on Multiform button
        BasicComponents.searchfilter.click();

    })

    it("Searchfilter Assertion",function()
    {
        //Assert the page Text
        expect(BasicComponents.searchPayee.getText()).toEqual("Search by Payee");
        expect(BasicComponents.searchAccount.getText()).toEqual("Search By Account");
        expect(BasicComponents.searchType.getText()).toEqual("Search By Type");
        expect(BasicComponents.expenditure.getText()).toEqual("Search by Expenditure Payees");

        
        //Assert Table
        expect((BasicComponents.table).isPresent()).toBe(true);
        expect(BasicComponents.searchResult.getText()).toEqual("Search Results");
        //Assert 1st row
        expect(element(by.css('th:nth-child(1)')).getText()).toEqual("#");
        expect(element(by.css('th:nth-child(2)')).getText()).toEqual("Account");
        expect(element(by.css('th:nth-child(3)')).getText()).toEqual("Type");
        expect(element(by.css('th:nth-child(4)')).getText()).toEqual("Payee");
        expect(element(by.css('th:nth-child(5)')).getText()).toEqual("Amount");
        

        //Assert Search Payee column
        expect((BasicComponents.searchPayee_Text).isPresent()).toBe(true);
        BasicComponents.searchPayee_Text.sendKeys("HouseRent");

        //Assert Search Account column
        expect((BasicComponents.searchAccount_Text).isPresent()).toBe(true);
        BasicComponents.searchAccount_Text.sendKeys("cash");

        //Assert Search Type column
        expect((BasicComponents.searchType_Text).isPresent()).toBe(true);
        BasicComponents.searchType_Text.sendKeys("expenditure");

        //Assert Search by Expenditure Payee column
        expect((BasicComponents.expenditure_Text).isPresent()).toBe(true);
        BasicComponents.expenditure_Text.sendKeys("HouseRent");

    


    })
})