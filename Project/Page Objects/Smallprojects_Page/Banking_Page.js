"use strict";
let Banking_Page= function(){

    this.banking=element(by.css('.col_3 > div:nth-child(3) > ul > li:nth-child(2) > a'));
    this.home=element(by.css('.btn'));
    this.header=element(by.css('.mainHeading'));

    //Customer and manager button in home page
    this.customer=element(by.css("button[ng-click='customer()']"));
    this.manager=element(by.css("button[ng-click='manager()']"));

    //Customer login
    this.user=element(by.css("#userSelect"));
    this.login=element(by.css("button[type='submit']"));

    //Transaction section 
    this.transaction = element(by.css(".center > button:nth-child(1)"));
    this.back = element(by.css("button[ng-click='back()']"));
    //Deposit Section
    this.deposit = element(by.css("button[ng-click='deposit()']"));
    this.amount = element(by.css("input[ng-model='amount']"));
    this.de = element(by.css("div > form > button"));
    this.deposit_msg=element(by.css("span[ng-show='message']"));
    //Withdraw section
    this.withdraw = element(by.css("button[ng-click='withdrawl()']"));
    this.Debit_button = element(by.css(".btn-default"));
    this.withdraw_msg = element(by.css(".error"));
    //logout button
    this.logout = element(by.css(".logout"));

    //Manager login    
    //Add Customer
    this.add = element(by.css("button[ng-click='addCust()']"));
    this.fname = element(by.css("input[ng-model = 'fName']"));
    this.lname = element(by.css("input[ng-model = 'lName']"));
    this.post = element(by.css("input[ng-model='postCd']"));
    this.add_customer=element(by.css(".btn-default"));
    //Open Account 
    this.open = element(by.css("button[ng-click='openAccount()']"));
    this.currency = element(by.css("#currency"));
    this.process=element(by.css("button[type='submit']"));
    //customers
    this.Search=element(by.css("input[placeholder='Search Customer']"));
    this.Delete=element(by.css("button[ng-click='deleteCust(cust)']"));
    this.show = element(by.css("button[ng-click='showCust()']"));


};

module.exports = new Banking_Page();