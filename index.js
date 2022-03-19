const express = require('express')
const app = express();
var request= require('request-promise');
const cheerio = require('cheerio');
var path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');
 

 

app.get('/', function (req, res) {
    request("https://en.wikipedia.org/wiki/Road_safety_in_Europe",(error,response,html)=>{
        if(!error && response.statusCode==200 ){
            const $=cheerio.load(html);
            const datarow =$(".wikitable.sortable");
            const Caption = datarow.find('caption').text(); 
            const scrapedData = [];
            $('.wikitable.sortable > tbody > tr ').each((index, element) => {
                
                 
                if (index === 0) return true;
                const tds = $(element).find('td');
                const Country = $(tds[0]).text();
                const Area = $(tds[1]).text();
                const Population = $(tds[2]).text();
                const GDP_per_capita= $(tds[3]).text();
                const Population_density = $(tds[4]).text();
                const Vehicle_ownership = $(tds[5]).text();
                const Total_road_deaths = $(tds[7]).text();
                const Road_deaths_per_Million_Inhabitants = $(tds[8]).text();

                const factsRow ={Country,Year:2018,Area,Population,GDP_per_capita,Population_density,Vehicle_ownership,Total_road_deaths,Road_deaths_per_Million_Inhabitants}
                
                scrapedData.push(factsRow);
            });
            //@start sorting data using Road_deaths_per_Million_Inhabitants
            scrapedData.sort(function (x, y) {
                            return x.Road_deaths_per_Million_Inhabitants-y.Road_deaths_per_Million_Inhabitants
                             });
                         

            //@end sorting data using Road_deaths_per_Million_Inhabitants


            //@start formating scrapedDataa into a csv file 


            const dataToCsv = function (data) {

                const csvRows = [];
                //@start get csv headers
                const headers = Object.keys(data[0]);
                csvRows.push(headers.join(','));
                 //@ens get csv headers
        
                //@start Loop to get value of each objects key
                for (const row of data) {
                    const values = headers.map(header => {
                        const val = row[header]
                        return `"${val}"`;
                    });
                    
                //@end Loop to get value of each objects key

                    //@start To add, sepearater between each value
                    csvRows.push(values.join(','));
                    //@end To add, sepearater between each value
                }
        
               
                return csvRows.join('\n');
            };
        
             
            //@start scrapedData passed as parameter to get the csv format
            const csvData = dataToCsv(scrapedData); 

          //@end scrapedData passed as parameter to get the csv format



        //@end formating scrapedDataa into a csv file


        res.render('index',{
                            myTitle: Caption,
                            figures:scrapedData
                        })
        

        }})
 
});
 
app.listen(8000)
   