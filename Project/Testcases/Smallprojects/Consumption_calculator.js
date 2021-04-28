let ConsumptionCalculator = require('../../Page Objects/Smallprojects_Page/ConsumptionCalculator_Page');
let util = require('../../TestUtils');
let tc = require('../../TestConstants');

describe("Assert UploadImage Section", () => 
{

    beforeEach(function () 
    {
       //Disable AngularEnabled
       browser.waitForAngularEnabled(false);
       
       //Access the URL
       tc.URL();
       
       //Maximize the browser window
       browser.manage().window().maximize();
       
       //Click on ConsumptionCalculator
       ConsumptionCalculator.ConsumptionCalculator_button.click();    
    });


    it("Normal intake Consumption Calculations", () => 
    {

        //Assert header
        expect(ConsumptionCalculator.header.getText()).toEqual("Angular Consumption Calculator");

        //Assert Day
        expect(ConsumptionCalculator.day.getText()).toEqual("Today,");

        expect(ConsumptionCalculator.hidden.isDisplayed()).toBe(false);
        expect(ConsumptionCalculator.hidden2.isDisplayed()).toBe(false);
        
        //Enter no. of cup of coffee value
        ConsumptionCalculator.input1.sendKeys("3");

        //Wait for execution
        browser.wait(function () 
        {
            return ConsumptionCalculator.msg1.getAttribute('style').then(function (value) 
            {
                return value == "display: none;";

            });
        }, 5000);

        //Assert normal daily limit of caffeine
        expect(ConsumptionCalculator.msg1.getAttribute('style')).toEqual('display: none;');

        //Enter cigarette smoked value
        ConsumptionCalculator.input2.sendKeys("2");

        //Wait for execution
        browser.wait(function () 
        {
            return ConsumptionCalculator.msg1.getAttribute('style').then(function (value) 
            {
                return value == "display: none;";

            });
        }, 5000);

        //Assert normal daily limit of tar
        expect(ConsumptionCalculator.msg2.getAttribute('style')).toEqual('display: none;');


    })


    it("Excess Intake Consumption Calculations", () => 
    {

        //Enter no. of cup of coffee value
        ConsumptionCalculator.input1.sendKeys("4");

        //Wait for execution
        browser.wait(function () 
        {
            return ConsumptionCalculator.msg1.getAttribute('style').then(function (value) 
            {
                return value != "display: none;";

            });
        }, 5000);

        //Assert invalid daily limit of caffeine
        expect(ConsumptionCalculator.msg1.getAttribute('style')).toEqual('');

        //Assert invalid display message
        expect(ConsumptionCalculator.msg1.getText()).toEqual('You have exceeded the daily maximum intake of 400mg.');

        //Enter no. of cigarette smoked value
        ConsumptionCalculator.input2.sendKeys("3");

        //Wait for execution
        browser.wait(function () 
        {
            return ConsumptionCalculator.msg1.getAttribute('style').then(function (value) 
            {
                return value != "display: none;";

            });
        }, 5000);

        //Assert Excess daily limit of tar
        expect(ConsumptionCalculator.msg2.getAttribute('style')).toEqual('');

        //Assert Excess display message
        expect(ConsumptionCalculator.msg2.getText()).toEqual('You have exceeded the daily maximum intake of 30mg.');

    })
})