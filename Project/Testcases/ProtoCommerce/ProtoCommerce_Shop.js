let Protocommerce = require('../../Page Objects/ProtoCommerce_Page');
let until = protractor.ExpectedConditions;
describe("ProtoCommerce Shop_page Functionality",() =>
{
   beforeEach(() =>{
       browser.get('https://rahulshettyacademy.com/angularpractice/#');
      browser.manage().window().maximize();
      Protocommerce.shop.click();
      });
      it("print product details" ,() =>{

        //Print phone details
    
        Protocommerce.shop.click();

    let text = Protocommerce.product1.getText();
      text.then(elementText =>{
       console.log(elementText);
     });

     let text2 = Protocommerce.product1price.getText();
       text2.then(elementText =>{
         console.log(elementText);
       });

       let text3 = Protocommerce.product2.getText();
       text3.then(elementText =>{
         console.log(elementText);
       });

       let text4 = Protocommerce.product2price.getText();
       text4.then(elementText =>{
         console.log(elementText);
       });

       let text5 = Protocommerce.product3.getText();
       text5.then(elementText =>{
         console.log(elementText);
       });

       let text6 = Protocommerce.product3price.getText();
       text6.then(elementText =>{
         console.log(elementText);
       });

       let text7 = Protocommerce.product4.getText();
       text7.then(elementText =>{
         console.log(elementText);
       });

       let text8 = Protocommerce.product4price.getText();
       text8.then(elementText =>{
         console.log(elementText);
       });

      })

      it("add to Cart" , () => {
        
        //add phones to the cart
         Protocommerce.add1.click();
         browser.wait(until.presenceOf(Protocommerce.add1), 5000);
         Protocommerce.add2.click();
         Protocommerce.add3.click();
        
         //first checkout
         browser.wait(until.presenceOf(Protocommerce.checkout), 5000);
         Protocommerce.checkout.click();


         //do final checkout
         Protocommerce.finalcheckOut.click();

         //enter the country name
         Protocommerce.country.click().sendKeys("India");
         browser.sleep(3000);
         
        /* let condition = element(by.css('label > a'));
         browser.actions().click(condition).perform();

         browser.switchTo().alert().dismiss();
         let close1 = element(by.css(".btn",".btn-info"));
         close1.click();*/
        
         
        //click on Purchase
         Protocommerce.purchase.click();
         

         //close alert
         let close = element(by.css("a[class='close']"));
         close.click();

      


      })

});