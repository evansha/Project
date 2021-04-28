'use strict';

let simple_calculator = function() 
{
    //Simple_Calculator button
    this.calculator = element(by.css(".price_table_holder >div:nth-child(3) > ul > li:nth-child(3) > a"));
    //Header part
    this.header = element(by.css("body > h1"));
    //Input a field
    this.a_field = element(by.css("input[ng-model='a']"));
    //Input b field
    this.b_field = element(by.css("input[ng-model='b']"));
    //operations
    this.operations = element(by.css("select[ng-model='operation']"));
    //increment button for a
    this.increase_a = element(by.css("button[ng-click = 'inca()']"));
    //Decrement button for a
    this.decrease_a = element(by.css("button[ng-click = 'deca()']"));
    //increment button for b
    this.increase_b = element(by.css("button[ng-click = 'incb()']"));
    //decrement button for b
    this.decrease_b = element(by.css("button[ng-click = 'decb()']"));
    //Result
    this.result = element(by.css(".result"));

};

module.exports = new simple_calculator();