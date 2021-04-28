let simple_calculator = require('../../Page Objects/Smallprojects_Page/SimpleCalculator_Page.js');
let util = require('../../Testutils');
let tc = require('../../TestConstants');
const { browser } = require('protractor');

describe("Simple Calculator Assertion",function()
{
    beforeEach(function ()
     {
               
        browser.waitForAngularEnabled(false);

        //Go to the link
        tc.URL();

        //Maximize browser
        browser.manage().window().maximize();

        //Click on Simple calculator button
        simple_calculator.calculator.click();
     });
     it("Assert for valid calculation in Angular js Calculator",function()
     {
         //Assert header
         expect(simple_calculator.header.getText()).toEqual("AngularJS calculator");
         //Assert increment and decrement buttons
         expect((simple_calculator.increase_a).isPresent()).toBe(true);
         expect((simple_calculator.decrease_a).isPresent()).toBe(true);
         expect((simple_calculator.increase_b).isPresent()).toBe(true);
         expect((simple_calculator.decrease_b).isPresent()).toBe(true);

         //Print operations
         simple_calculator.operations.getText().then(function(text) 
         {
             console.log(text);
          });

          util.until(simple_calculator.a_field);
          //enter as a=10 
          simple_calculator.a_field.sendKeys("10");
          
          util.until(simple_calculator.b_field);
          //enter as b=5
          simple_calculator.b_field.sendKeys("5");
          //increment a
          simple_calculator.increase_a.click();
          //decrement a
          simple_calculator.decrease_a.click();
          //increment b
          simple_calculator.increase_b.click();
          //Operation as subtraction
          browser.sleep(3000);
          simple_calculator.operations.sendKeys('-');
          expect(simple_calculator.result.getText()).toEqual("10 - 6 = 4");
          util.until(simple_calculator.increase_a);
          simple_calculator.increase_a.click();
          util.until(simple_calculator.operations);
          browser.sleep(3000);
          simple_calculator.operations.sendKeys('+');
          browser.wait(function ()
          {
              return simple_calculator.operations.getAttribute('value').then(function (value)
              {
                  return value = '+';
                });
            }, 5000);
            simple_calculator.operations.sendKeys('+');
            expect(simple_calculator.result.getText()).toEqual("11 + 6 = 17");
                
     });

    it("Assert for Invalid calculation in Angular js Calculator",function()
    {
        util.until(simple_calculator.a_field);
        //sending alphabet in a field
        simple_calculator.a_field.sendKeys("a");
        //sending alphabet in b field
        simple_calculator.b_field.sendKeys("b");
        //comparing the result
        expect(simple_calculator.result.getText()).toEqual("null + null = null");
        //incrementing b
        simple_calculator.increase_b.click();
        //decrementing a
        simple_calculator.decrease_a.click();
        //Comparing text in a and b field
        expect(simple_calculator.a_field.getText()).toEqual("");
        expect(simple_calculator.b_field.getText()).toEqual("");
        //comparing result text
        expect(simple_calculator.result.getText()).toEqual("null + null = null");           

    })

});