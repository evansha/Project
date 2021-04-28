"use strict";
let Protocommerce = function(){

  //Navigation Bars
this.protoCommerce = element(by.cssContainingText('.navbar-brand','ProtoCommerce'));
this.home = element(by.cssContainingText('.nav-link','Home'));
this.shop = element(by.cssContainingText('.nav-link','Shop'));

//Credentials Field
this.namefield = element(by.css("input[name ='name']"));
this.emailfield = element(by.css("input[name ='email']"));
this.gender = element(by.css('select[id="exampleFormControlSelect1"]'));
this.Password = element(by.css("input[id ='exampleInputPassword1']"));
this.checkbox = element(by.css("input[id = 'exampleCheck1']"));
this.checkbox_name = element(by.linkText('Check me out if you Love Icecreams!'));
this.parseIntgender = element(by.id("exampleFormControlSelect1"));
this.student = element(by.id("inlineRadio1"));
this.employed = element(by.id("inlineRadio2"));
this.entrepreneur = element(by.id("inlineRadio3"));
this.date = element(by.css("input[type ='date']"));
this.submit = element(by.css("input[type ='submit']"));
this.databinding_text = element(by.css("input[type ='text']"));

//products in shop page
this.product1 = element(by.linkText('iphone X'));
this.product2 = element(by.linkText('Samsung Note 8'));
this.product3 = element(by.linkText('Nokia Edge'));
this.product4 = element(by.linkText('Blackberry'));

//Price of products
this.product1price = element(by.css('app-card:nth-child(1) > div > div.card-body > h5'));
this.product2price = element(by.css('app-card:nth-child(2) > div > div.card-body > h5'));
this.product3price = element(by.css('app-card:nth-child(3) > div > div.card-body > h5'));
this.product4price = element(by.css('app-card:nth-child(4) > div > div.card-body > h5'));

//Add to cart
this.add1 = element.all(by.css('.card-footer' ,'.btn')).get(0);
this.add2 = element.all(by.css('.card-footer' ,'.btn')).get(1);
this.add3 = element.all(by.css('.card-footer' ,'.btn')).get(2);

//Checkout and purchase
this.checkout= element(by.css("a[class='nav-link btn btn-primary']"));
this.finalcheckOut = element(by.css("button[class='btn btn-success']"));
this.country = element(by.css("input[id='country']"));
this.purchase =  element(by.css("input[value='Purchase']"));



 
};



module.exports = new Protocommerce();
   