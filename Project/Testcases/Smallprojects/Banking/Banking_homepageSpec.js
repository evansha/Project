let Banking_Page = require('../../../Page objects/Smallprojects_Page/Banking_Page.js');
let util = require('../../../TestUtils');
let tc = require('../../../TestConstants');

describe("XYZ Bank Homepage Assert",() =>
{
   beforeEach(() =>
   {
       browser.waitForAngularEnabled(false);

       tc.URL();
       
       browser.manage().window().maximize();
       
       util.until(Banking_Page.banking);
       //click on Banking button
       Banking_Page.banking.click();
       
       Banking_Page.home.click();
    });
    it("Home page Assert",() =>
    {
        //Assert XYZ Bank Header 
        expect(Banking_Page.header.getText()).toEqual("XYZ Bank");

        //customer loginButton_Assert
        expect(Banking_Page.customer.getText()).toEqual("Customer Login");
    
        //Bank_manager LoginButton Assert
        expect(Banking_Page.manager.getText()).toEqual("Bank Manager Login");
    })
})


