let tc = function()
{
    //Get url
    this.URL = function()
    {
        browser.get("https://www.globalsqa.com/angularjs-protractor-practice-site/");
    }

    this.Name = "Priyanka Bhakta";
    this.fname = "Priyanka";
    this.lname = "Bhakta";
    this.Email = "xyz@whatever.com";
    this.Password = "anu#123";

    this.hexToRgbA = function(hex)
    {
        var c;
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex))
        {
            c= hex.substring(1).split('');
            if(c.length== 3)
            {
                c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c= '0x'+c.join('');
            return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(', ')+', 1)';
        }
        throw new Error('Bad Hex');
    }


    
}
module.exports = new tc();