'use strict';

let BasicComponents = function() 
{
    //multiform button
    this.multiform = element(by.css('.price_column:nth-child(1) > ul > li:nth-child(2) > a'));

    //Header section
    this.header = element(by.css('.page-header > h2'));
    this.headerBackground = element(by.css(".page-header"));
    this.one = element(by.css('a:nth-child(1) > span'));
    this.two = element(by.css('a:nth-child(2) > span'));
    this.three = element(by.css('a:nth-child(3) > span'));
    this.profile = element(by.css('a[ui-sref=".profile"]'));
    this.interest = element(by.css('a[ui-sref=".interests"]'));
    this.payment = element(by.css('a[ui-sref=".payment"]'));
    

    //Body Section of Profile Section
    this.Name = element(by.css('label[for="name"]'));
    this.email = element(by.css('label[for="email"]'));
    this.input_name = element(by.css('input[name="name"]'));
    this.input_email = element(by.css('input[name="email"]'));
    this.next_section = element(by.css('.btn'));
    this.description = element(by.css('.ng-binding'));
    this.submit = element(by.css('button[type="submit"]'));

    //Bogy Section of Interests section
    this.choice = element(by.css("label[class='ng-scope']"));
    this.xbox = element(by.css("input[value='xbox']"));
    this.ps4 = element(by.css("input[value='ps']"));
    this.text1 = element(by.css(".radio:nth-child(1)"));
    this.text2 = element(by.css(".radio:nth-child(2)"));


    //Payment section
    this.description1 = element(by.css('#form-views > div > h3'));

    //Bottom  Text
    this.bottom = element(by.css('body > div.row > div > div > p'));


    //WebTables Components
    this.webtable = element(by.css('.price_column:nth-child(1) > ul > li:nth-child(3) > a'));
    //search first name
    this.firstname = element(by.css('input[st-search="firstName"]'));
    //search globally
    this.globalsearch = element(by.css('input[placeholder="global search"]'));


    //Searchfilter Components
    this.searchfilter = element(by.css('.price_column:nth-child(1) > ul > li:nth-child(4) > a'));
    
    //Search Payee column
    this.searchPayee = element(by.css('label[for="input1"]'));
    this.searchPayee_Text = element(by.css('#input1'));

    //Search Account column
    this.searchAccount = element(by.css("label[for='input2']"));
    this.searchAccount_Text = element(by.css('#input2'));

    //Search Type column
    this.searchType = element(by.css("label[for='input3']"));
    this.searchType_Text = element(by.css('#input3'));
    
    //expenditure column
    this.expenditure = element(by.css("label[for='input4']"));
    this.expenditure_Text = element(by.css('#input4'));

    //search Results
    this.searchResult = element(by.css("body > div > h3"));

    //table 
    this.table = element(by.css(".table"));
    

}

module.exports = new BasicComponents();