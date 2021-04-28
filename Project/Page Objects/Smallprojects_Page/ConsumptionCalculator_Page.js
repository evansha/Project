"use strict";
let ConsumptionCalculator = function () {

    //ConsumptionCalculator button
    this.ConsumptionCalculator_button = element(by.css('.price_column:nth-child(3) > ul > li:nth-child(4) > a'));
    //header part
    this.header = element(by.css("header> h1"));
    this.day = element(by.css("header> p"));

    this.hidden = element(by.css("form:nth-child(2) > div"));
    this.hidden2 = element(by.css("form:nth-child(4) > div"));
    //Input for coffee
    this.input1 = element.all(by.css("form:nth-child(2) > p > input"));
    //input for cigarette
    this.input2 = element.all(by.css("form:nth-child(4) > p > input"));
    //Messages shown
    this.msg1 = element.all(by.css("[class='warn ng-binding']")).get(0);
    this.msg2 = element.all(by.css("[class='warn ng-binding']")).get(1);

};


module.exports = new ConsumptionCalculator();