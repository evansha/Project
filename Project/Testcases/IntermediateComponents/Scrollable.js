let IntermediateComponents = require('../../Page Objects/IntermediateComponents_Page.js');
let util = require('../../Testutils');
let tc = require('../../TestConstants');

describe("Assert Scrollable Section", () => 
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
    
    it("Assert various search boxes and search result", () => {

    //Wait for execution
    util.until(IntermediateComponents.scrollable);

    //Assert scrollable button
    expect(IntermediateComponents.scrollable.getText()).toEqual("Scrollable");

    //Click on scrollable
    util.until(IntermediateComponents.scrollable);
    IntermediateComponents.scrollable.click();

     //Assert first row
     expect(IntermediateComponents.firstname.getText()).toEqual("first name");
     expect(IntermediateComponents.lastname.getText()).toEqual("last name");
     expect(IntermediateComponents.birthdate.getText()).toEqual("birth date");
     expect(IntermediateComponents.balance.getText()).toEqual("balance");
     expect(IntermediateComponents.email.getText()).toEqual("email");
 
    //Assert firstName search
    expect((IntermediateComponents.search_firstname).isPresent()).toBe(true);
    //Search firstname as POL
    IntermediateComponents.search_firstname.sendKeys("POL");

    //Asser global search
    expect((IntermediateComponents.global_search).isPresent()).toBe(true);
    //Searcg globally as bjip
    IntermediateComponents.global_search.sendKeys("bjip");
    
   
    })
})