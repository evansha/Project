let BasicComponents = require('../../Page Objects/BasicComponents_Page');
let tc = require('../../TestConstants.js');
let util = require('../../Testutils.js');
let black = tc.hexToRgbA('#080808');

describe("Multiform Assertion",function()
{
  let originalTimeout;
  beforeEach(function () 
  {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;

    browser.waitForAngularEnabled(false);
    
    //Go to the link
    tc.URL();

    //Maximize browser
    browser.manage().window().maximize();

    //click on Multiform button
    BasicComponents.multiform.click();
  })
  afterEach(function () 
  {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  })
  it("Multiform Assertion",function()
  {
    //PROFILE
    //Assert the header components
    //wait for header element
    util.until(BasicComponents.header);
    expect(BasicComponents.header.getText()).toEqual("Let's Be Friends");
  
    //Assert color parts
    expect(BasicComponents.one.getCssValue('background-color')).toEqual('rgba(0, 188, 140, 1)');
    expect(BasicComponents.two.getCssValue('background-color')).toEqual('rgba(8, 8, 8, 1)');
    expect(BasicComponents.three.getCssValue('background-color')).toEqual('rgba(8, 8, 8, 1)');
     
    //Assert pagename
    expect(BasicComponents.profile.getText()).toEqual("1\nPROFILE");
    expect(BasicComponents.interest.getText()).toEqual("2\nINTERESTS");
    expect(BasicComponents.payment.getText()).toEqual("3\nPAYMENT");
     
    //Assert names of fields
    expect(BasicComponents.Name.getText()).toEqual("Name");
    expect(BasicComponents.email.getText()).toEqual("Email");
     
    //Assert the fields in the body
    expect((BasicComponents.input_name).isPresent()).toBe(true);
    expect((BasicComponents.input_email).isPresent()).toBe(true);

    //Pass values to the fields
    BasicComponents.input_name.click().sendKeys(tc.fname);
    BasicComponents.input_email.click().sendKeys(tc.Email);
     
    //Assert Next Section button
    expect((BasicComponents.next_section).isPresent()).toBe(true);
    expect(BasicComponents.next_section.getText()).toEqual("Next Section");

    expect(BasicComponents.bottom.getText()).toEqual("AngularJS Practice Form By GlobalSQA");
    //click on next section
    BasicComponents.next_section.click();
     
    //INTERESTS
    browser.wait(function ()
    {
      return BasicComponents.one.getCssValue('background-color').then(function (bgColor) 
      {
        return bgColor == black;
      });
    }, 5000);

    //Assert the color compponent
    expect(BasicComponents.one.getCssValue('background-color')).toEqual('rgba(8, 8, 8, 1)');
    expect(BasicComponents.two.getCssValue('background-color')).toEqual('rgba(0, 188, 140, 1)');
    expect(BasicComponents.three.getCssValue('background-color')).toEqual('rgba(8, 8, 8, 1)');

    //Assert radio button
    expect((BasicComponents.xbox).isPresent()).toBe(true);
    expect((BasicComponents.ps4).isPresent()).toBe(true); 
    browser.sleep(3000);

    // Assert Text After radio button
    util.until(BasicComponents.text1);
    expect(BasicComponents.text1.getText()).toEqual("I like XBOX");
    expect(BasicComponents.text2.getText()).toEqual("I like PS4");
    // choose ps4 
    BasicComponents.ps4.click();
 
    //Assert next section button 
    expect((BasicComponents.next_section).isPresent()).toBe(true);
    expect(BasicComponents.next_section.getText()).toEqual("Next Section");

    //click on next section button
    BasicComponents.next_section.click();
        
    //PAYMENT 
    browser.wait(function () 
    {
      return BasicComponents.two.getCssValue('background-color').then(function (bgColor)
      {
        return bgColor == black;
      });
    }, 5000);

    //Assert the colors
    expect(BasicComponents.one.getCssValue('background-color')).toEqual('rgba(8, 8, 8, 1)');
    expect(BasicComponents.two.getCssValue('background-color')).toEqual('rgba(8, 8, 8, 1)');
    expect(BasicComponents.three.getCssValue('background-color')).toEqual('rgba(0, 188, 140, 1)');

    //Assert the body
    browser.sleep(3000);
    expect((BasicComponents.next_section).isPresent()).toBe(true);

    //Assert submit button
    util.until(BasicComponents.next_section);
    expect(BasicComponents.next_section.getText()).toEqual("Submit");
    BasicComponents.next_section.click();

    //Accept alert
    browser.driver.switchTo().alert().accept();
  });
});
