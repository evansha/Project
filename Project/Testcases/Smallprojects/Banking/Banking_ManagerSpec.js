let Banking_Page = require('../../../Page objects/Smallprojects_Page/Banking_Page.js');
let util = require('../../../TestUtils');
let tc = require('../../../TestConstants');
const { browser } = require('protractor');

describe("XYZ_Bank_Managerlogin_Functionalitycheck",() =>
{
   beforeEach(() =>
   {
       browser.waitForAngularEnabled(false);

       tc.URL();
    
       browser.manage().window().maximize();

       //click on Banking button
       Banking_Page.banking.click();

       util.until(Banking_Page.manager);
       //Bank_manager LoginButton Check
        Banking_Page.manager.click();
        browser.sleep(3000);
    })
    it("Managers_addCustomers_functionality_Check", () => 
    {
        util.until(Banking_Page.add);
        //Add Customer 
        Banking_Page.add.click();

        //Enter firstname
        util.until(Banking_Page.fname);
        Banking_Page.fname.click().sendKeys("john");

        //Enter lastname
        Banking_Page.lname.click().sendKeys("cena");

        //Enter postcode
        Banking_Page.post.click().sendKeys("12356");

        util.until(Banking_Page.add_customer);
        //Add Customer
        Banking_Page.add_customer.click();

        //alert message
        browser.driver.switchTo().alert().accept();
    })

    it("manager_Accountfunctionality_check", () => 
    {
        util.until(Banking_Page.open);
        //Open Account Facility
        Banking_Page.open.click();
        
        util.until(Banking_Page.user);
        //Customer name
        Banking_Page.user.click().sendKeys("Harry Potter");

        //currency
        Banking_Page.currency.click().sendKeys("Dollar");

        util.until(Banking_Page.process);
        //Process the currency
        Banking_Page.process.click();

        browser.driver.switchTo().alert().accept();

    })

    it("manager_Customerfunctionality_check", () => 
    {
        util.until(Banking_Page.show);
        //Customer section
        Banking_Page.show.click();
        util.until(Banking_Page.Search);
        //Search for Customer
        Banking_Page.Search.sendKeys("Harry");
    })
})