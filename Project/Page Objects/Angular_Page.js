"use strict";
let Angular = function(){

//Navigation bar
this.feature = element(by.css("a[title='Features.']"));
this.Docs= element(by.css("a[title='Docs.']"));
this.Resources = element(by.css("a[title='Resources.']"));
this.Events= element(by.css("a[title='Events.']"));
this.Blog = element(by.css("a[title='Blog.']"));
this.Angular = element(by.css('img[alt="Angular"]'));

//search box and logos
this.Searchbox = element(by.css('input[type="search"]'));
this.Twitterlogo = element(by.css('a[title="Twitter"]'));
this.Githublogo = element(by.css('a[title="GitHub"]'));
this.Angularlogo = element(by.css('img[src="assets/images/logos/angular/angular.svg"]'));

//Page body
this.description = element(by.css('div[class="hero-headline no-toc"]'));
this.GetStarted = element(by.css('a[class="button hero-cta"]'));
this.skyBackground = element(by.css(".background-sky"));
this.introTopage =element(by.id('intro'));

//Text Headline
this.developmentAcrossallFields = element.all(by.css('.promo-1-desc' , '.text-headline'));
this.speedAndperformance = element.all(by.css('div:nth-child(4) > div.text-container > div > div'));
this.Incredibletooling = element.all(by.css('.promo-3-desc' , '.text-headline'));
this.LovedbyMillions= element.all(by.css('div:nth-child(8) > div.text-container > div > div'));


//Text Visible in the body
this.developmentAcrossallFields_textbox = element.all(by.css('.promo-1-desc > div +p'));
this.speedAndperformance_textbox = element.all(by.css('div:nth-child(4) > .text-container >div > p:nth-child(2)'));
this.Incredibletooling_textbox = element.all(by.css('.promo-3-desc > div + p'));
this.LovedbyMillions_textbox= element.all(by.css('iv:nth-child(8) > div.text-container >div > div +p'));


//images in body
this.img1 = element(by.css("img[alt='responsive framework']"));
this.img2 = element(by.css("img[alt='speed and performance']"));
this.img3 = element(by.css("img[alt='IDE example']"));
this.img4 = element(by.css("img[alt='angular on the map']"));


//Try it Now block
this.Tryblock = element(by.css('.card'));
this.TryitNow = element.all(by.css('.card-text-container' , '.text-headline'));
this.img = element(by.css('img[alt="Get Started with Angular"]'));
this.TText = element(by.css('.card-text-container' , 'p'));


//Footer parts

//column 1
this.footer_resources = element.all(by.css('.footer-block:nth-child(1) > h3'));
this.footer_About = element.all(by.css('.footer-block:nth-child(1) > ul > li:nth-child(1)'));
this.footer_Resourceslisting = element.all(by.css('.footer-block:nth-child(1) > ul > li:nth-child(2)'));
this.footer_Presskit = element.all(by.css('.footer-block:nth-child(1) > ul > li:nth-child(3)'));
this.footer_Blog = element.all(by.css('.footer-block:nth-child(1) > ul > li:nth-child(4)'));
this.footer_UsageAnalytics = element.all(by.css('.footer-block:nth-child(1) > ul > li:nth-child(5)'));

//column 2
this.footer_help = element.all(by.css('div:nth-child(2) > h3'));
this.footer_StackOverflow = element.all(by.css('div:nth-child(2) > ul > li:nth-child(1)'));
this.footer_joinDiscord = element.all(by.css('div:nth-child(2) > ul > li:nth-child(2)'));
this.footer_Gitter = element.all(by.css('div:nth-child(2) > ul > li:nth-child(3)'));
this.footer_ReportIssues = element.all(by.css('div:nth-child(2) > ul > li:nth-child(4)'));
this.footer_Codeofconduct = element.all(by.css('div:nth-child(2) > ul > li:nth-child(5)'));

//column 3
this.footer_community = element.all(by.css('div:nth-child(3) > h3'));
this.footer_Events = element.all(by.css('div:nth-child(3) > ul > li:nth-child(1)'));
this.footer_Meetups = element.all(by.css('div:nth-child(3) > ul > li:nth-child(2)'));
this.footer_Twitter = element.all(by.css('div:nth-child(3) > ul > li:nth-child(3)'));
this.footer_Github = element.all(by.css('div:nth-child(3) > ul > li:nth-child(4)'));
this.footer_Contribute = element.all(by.css('div:nth-child(3) > ul > li:nth-child(5)'));

//column 4
this.footer_languages = element.all(by.css('div:nth-child(4) > h3'));
this.footer_Espanol = element.all(by.css('div:nth-child(4) > ul > li:nth-child(1)'));
this.footer_简体中文版 = element.all(by.css('div:nth-child(4) > ul > li:nth-child(2)'));
this.footer_正體中文版 = element.all(by.css('div:nth-child(4) > ul > li:nth-child(3)'));
this.footer_chinese3 = element.all(by.css('div:nth-child(4) > ul > li:nth-child(4)'));
this.footer_chinese4 = element.all(by.css('div:nth-child(4) > ul > li:nth-child(5)'));

};


module.exports = new Angular();