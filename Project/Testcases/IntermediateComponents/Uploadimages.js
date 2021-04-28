let IntermediateComponents = require('../../Page Objects/IntermediateComponents_Page.js');
let util = require('../../Testutils');
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

    });
   
    it("Assert and upload image", () => {

        //Wait for execution
        util.until(IntermediateComponents.UploadImage);

        //Assert UploadImage button
        expect(IntermediateComponents.UploadImage.getText()).toEqual("Upload Image");

        //Click on upload image button
        util.until(IntermediateComponents.UploadImage);
        IntermediateComponents.UploadImage.click();

        //Assert Preview
        expect(IntermediateComponents.chooseImage.getText()).toEqual("No image choosed");

        //Wait for execution
        browser.wait(function () 
        {
            return IntermediateComponents.progressbar.getAttribute('value').then(function (value) 
            {
                return value == 0;
            });
        }, 5000);

        //Assert progressbar before uploading image
        expect(IntermediateComponents.progressbar.getAttribute('value')).toEqual('0');

        //Wait and upload image from local path
        util.until(IntermediateComponents.selectImage);
        IntermediateComponents.selectImage.sendKeys("D://Screenshots//image.jpeg");
        //browser.ignoreSynchronization = true;

        //Assert progressbar visibility
        var EC = protractor.ExpectedConditions;
        browser.wait(EC.visibilityOf(IntermediateComponents.progressbar), 5000, "No progress animation is visible");

        //Wait for execution
        browser.wait(function () 
        {
            return IntermediateComponents.progressbar.getAttribute('value').then(function (value) 
            {
                return value == 1;
            });
        }, 5000);

        //Assert progressbar after uploading image
        expect(IntermediateComponents.progressbar.getAttribute('value')).toEqual('1');

    })
})