let IntermediateComponents = require('../../Page Objects/IntermediateComponents_Page.js');
let util = require('../../Testutils');
let tc = require('../../TestConstants');

describe("Assert RegistrationLogin Section", () => 
{
    beforeEach(function () 
    {
        //Disable AngularEnabled
        browser.waitForAngularEnabled(false);

        //Access the URL
        tc.URL();

        //Maximize the browser window
        browser.manage().window().maximize();

        //Wait for execution
        util.until(IntermediateComponents.RegistrationLogin_btn);

        //Assert RegistrationLogin button
        expect(IntermediateComponents.RegistrationLogin_btn.getText()).toEqual("RegistrationLogin");

        //Click on RegistrationLogin
        util.until(IntermediateComponents.RegistrationLogin_btn);
        IntermediateComponents.RegistrationLogin_btn.click();

    });
   
    it("Signin with invalid username and password and assert the error labels", () => {


        //Wait for execution
        util.until(IntermediateComponents.username);

        //Provide login credentials
        IntermediateComponents.username.sendKeys(tc.Email);
        IntermediateComponents.password.sendKeys(tc.Password);


        //Submit login credentials
        util.until(IntermediateComponents.Login);
        IntermediateComponents.Login.click();

        browser.sleep(5000);

        //Assert invalid login credentials message
        expect(IntermediateComponents.message.getText()).toEqual("Username or password is incorrect");
    })


    it("Assert login is successful, and assert the labels shown ", () => 
    {

        //Wait for execution
        browser.sleep(5000);

        //Click on register
        IntermediateComponents.register.click();

        //Wait for execution
        util.until(IntermediateComponents.first_name);

        //Register User
        IntermediateComponents.first_name.sendKeys(tc.fname);
        IntermediateComponents.last_name.sendKeys(tc.lname);
        IntermediateComponents.username.sendKeys(tc.Email);
        IntermediateComponents.password.sendKeys(tc.Password);
        IntermediateComponents.register_user.click();

        //Wait for execution
        util.until(IntermediateComponents.message);

        //Assert invalid login credentials message
        expect(IntermediateComponents.message.getText()).toEqual("Registration successful");

        //Wait for execution
        util.until(IntermediateComponents.username);

        //Provide login credentials
        IntermediateComponents.username.sendKeys(tc.Email);
        IntermediateComponents.password.sendKeys(tc.Password);


        //Submit login credentials
        util.until(IntermediateComponents.Login);
        IntermediateComponents.Login.click();

        //Wait for execution
        util.until(IntermediateComponents.LoggedIn);

        //Assert invalid login credentials message
        expect(IntermediateComponents.LoggedIn.getText()).toEqual("You're logged in!!");

        //Logout
        util.until(IntermediateComponents.Logout);
        IntermediateComponents.Logout.click();


    })

})