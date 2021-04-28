let Banking_Page = require('../../../Page objects/Smallprojects_Page/Banking_Page.js');
let util = require('../../../TestUtils');
let tc = require('../../../TestConstants');

describe("XYZ_Bank_Customers_Functionalitycheck",() =>
{
    let originalTimeout;
    beforeEach(() =>
    {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;

        browser.waitForAngularEnabled(false);

        tc.URL();

        browser.manage().window().maximize();

        //click on Banking button
        Banking_Page.banking.click();

        util.until(Banking_Page.customer);
        //customer loginButton_Check
        Banking_Page.customer.click();

        util.until(Banking_Page.user);
        //Select customer name
        Banking_Page.user.click().sendKeys("Harry Potter").click();
 
        util.until(Banking_Page.login);
        //Choose customer name
        Banking_Page.login.click();
 
    })
    afterEach(function () 
    {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    })
    it("CustomersTransaction Functionality_check" , () => 
    {
        util.until(Banking_Page.transaction);
        //Go to Transaction section
        Banking_Page.transaction.click();

        util.until(Banking_Page.back);
        //Go Back
        Banking_Page.back.click();

    })

    it("Customers Deposit Functionality_check", () => 
    {
        util.until(Banking_Page.deposit);
        //Go to Deposit Section
        Banking_Page.deposit.click();
 
        util.until(Banking_Page.amount);
        //Enter amount to be deposited
        Banking_Page.amount.sendKeys("1000");

        //Click deposit button
        Banking_Page.de.click();


    })

    it("Customers Withdrawal Functionality_check", () => 
    {
        util.until(Banking_Page.withdraw);
        //Go to withdrawal Section
        Banking_Page.withdraw.click();
    
        util.visible(Banking_Page.amount);
        //Enter amount to be withdrawn
        Banking_Page.amount.sendKeys("10");

        util.until(Banking_Page.Debit_button);
        //Click on withdraw button
        Banking_Page.Debit_button.click();
 
        util.until(Banking_Page.logout);
        //Logout
        Banking_Page.logout.click();
    })
 
})