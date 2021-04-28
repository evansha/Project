'use strict';

let IntermediateComponents = function() 
{
    //SCROLLABLE SECTION

    this.scrollable = element(by.css(".price_column:nth-child(2) > ul > li:nth-child(2) > a"));

    //First row Contents
    this.firstname = element(by.css(' tr:nth-child(1) > th:nth-child(1)'));
    this.lastname = element(by.css(' tr:nth-child(1) > th:nth-child(2)'));
    this.birthdate = element(by.css(' tr:nth-child(1) > th:nth-child(3)'));
    this.balance = element(by.css(' tr:nth-child(1) > th:nth-child(4)'));
    this.email = element(by.css(' tr:nth-child(1) > th:nth-child(5)'));

    //search first name
    this.search_firstname = element(by.css("input[st-search='firstName']"));

    //search globally
    this.global_search = element(by.css("input[placeholder='global search']"));

    this.scroll= element.all(by.css("tr.ng-scope"));
    this.scroll1= element.all(by.css("tr.ng-scope")).get(60);


    //UPLOAD IMAGE SECTION
    this.UploadImage = element(by.css(".price_column:nth-child(2) > ul > li:nth-child(3) > a"));

    //Image upload process
    this.selectImage = element(by.css("input[type='file']"));
    this.assertUpload= element(by.css("[ng-controller='UploadController '] > i"));
    this.progressbar= element(by.css("[ng-controller='UploadController '] > progress"));
    this.chooseImage= element(by.css("[ng-hide='imageSrc']"));

    //REGISTRATION lOGIN  SECTION
    this.RegistrationLogin_btn = element(by.css(".price_column:nth-child(2) > ul > li:nth-child(4) > a"));

    //Login credentials
    this.username = element(by.css("#username"));
    this.password = element(by.css("#password"));
    this.Login = element(by.css('.btn','.btn-primary'));
    this.message = element(by.binding("flash.message"));

    //Register user
    this.register = element(by.css("[class='btn btn-link']"));
    this.first_name = element(by.css("#firstName"));
    this.last_name = element(by.css("#Text1"));
    this.register_user = element(by.css("button[type='submit']"));
    this.LoggedIn = element(by.css(".ng-scope>p:nth-child(2)"));
    this.Logout = element(by.css(".ng-scope:nth-child(6) >a"));


};

module.exports = new IntermediateComponents();