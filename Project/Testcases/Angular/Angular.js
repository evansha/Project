const { browser } = require('protractor');
let Angular = require('../../Page Objects/Angular_Page');
let util = require('../../TestUtils');
describe("AngularPage_assertion",() =>
{
   beforeEach(() =>{
       browser.get('https://angular.io/');
      browser.manage().window().maximize();
      })

      it("Get Titles" , () =>{
        let text = Angular.developmentAcrossallFields.getText();
        text.then(elementText =>{
          console.log(elementText);
        });
        let text2 = Angular.speedAndperformance.getText();
        text2.then(elementText =>{
          console.log(elementText);
        });
        let text3 = Angular.Incredibletooling.getText();
        text3.then(elementText =>{
          console.log(elementText);
        });
        let text4 = Angular.LovedbyMillions.getText();
        text4.then(elementText =>{
          console.log(elementText);
        });
      })

        it("Get Bodytext" , () => {

          
          let text5 = Angular.developmentAcrossallFields_textbox.getText();
        text5.then(elementText =>{
          console.log(elementText);
        });
        let text6 = Angular.speedAndperformance_textbox.getText();
        text6.then(elementText =>{
          console.log(elementText);
        });
        let text7 = Angular.Incredibletooling_textbox.getText();
        text7.then(elementText =>{
          console.log(elementText);
        });
        let text8 = Angular.LovedbyMillions_textbox.getText();
        text8.then(elementText =>{
          console.log(elementText);
        });
      })

      it("Assert Images ", () => {

          expect((Angular.img1).isPresent()).toBe(true);

          expect((Angular.img2).isPresent()).toBe(true);

          expect((Angular.img3).isPresent()).toBe(true);

          expect((Angular.img4).isPresent()).toBe(true);
        });

      it("Assert LogoBox" , () => {

          expect((Angular.Searchbox).isPresent()).toBe(true);
          expect((Angular.Twitterlogo).isPresent()).toBe(true);
          expect((Angular.Githublogo).isPresent()).toBe(true);
          expect((Angular.Angularlogo).isPresent()).toBe(true);


        })


      

}); 