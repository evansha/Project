let EC = protractor.ExpectedConditions;
let util = function()
{
    //wait until presence of element
    this.until = function(ele)
    {
        browser.wait(EC.presenceOf(ele),5000);
    }
    this.visible = function(ele)
    {
        browser.wait(EC.visibilityOf(ele),5000);
    }
     
}
module.exports = new util();