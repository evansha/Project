let Protocommerce = require('../../Page Objects/ProtoCommerce_Page');
describe("ProtoCommerce Homepage Functionality",() =>
{
   beforeEach(() =>{
     browser.get('https://rahulshettyacademy.com/angularpractice/#');
     browser.manage().window().maximize();
     browser.sleep(3000);
    })
      it("Home page functionalities",() =>{

        //Asserting navigation bar
        Protocommerce.home.click();
       expect((Protocommerce.shop).getText()).toEqual('Shop');
       expect((Protocommerce.home).getText()).toEqual('Home');
       expect((Protocommerce.protoCommerce).getText()).toEqual('ProtoCommerce');
      
        

        //Entering all the required Credentials
        Protocommerce.namefield.click().sendKeys("Priyanka");
        Protocommerce.emailfield.click().sendKeys("Priyanka123@gmail.com");
        Protocommerce.Password.click().sendKeys("Priyanka");
        Protocommerce.checkbox.click();
        Protocommerce.gender.click().sendKeys("Female");
        Protocommerce.student.click();
        Protocommerce.date.click().sendKeys("02/23/2021");
        Protocommerce.submit.click();
     

      })

});
    