WEB SCRAPING USING NODE JS 

Step 1 :Node.js->Download and install node.js if you haven’t already.

Step 2: Setting up the project
Create a new directory named  web_scraping and run npm init , fill out the required information to initialize the project. You can just do the default settings, for now, it doesn’t matter. But here’s what my package.json file looks like:

step 3: Create a file named index.js — this is the file that will house all the code for our application.

step 4 : let’s make our API call and to do this we need a npm module called request — It is a module that simplifies HTTP request in the node. Install request by running:
npm install request --save
npm install --save request-promise
npm install cheerio 
 And then import the request-promise and cheerio package in the top of our index.js file:
const request = require(“request-promise”);
const cheerio = require(“cheerio”);

step 5: Using the request-promise package we make an HTTP request to get the actual HTML page. We then feed this HTML page into cheerio. Cheerio returns an object that can be used just like the jQuery library on an actual webpage. We assign this to a dollar sign variable ($).

 request("link",(error,response,html)=>{
        if(!error && response.statusCode==200 ){
            const $=cheerio.load(html);
            const datarow =$("table name");
            }})
step 6: create a selector. To create:
1. goto to the website page you want to scrap
2. left click on the table and select inspect
3. on your tr right click then select copy and further select copy selector.
4. if that doesn't work , you can start navigationg from the datarow. for example   "$('.wikitable.sortable > tbody > tr ').text()" works just fine for me , it selects all the 'tr' in 'tbody'.

check the table structure below for better understanding 
<table>
    <tr>
       <th>Country</th>       
         <th>Area</th>
                <th>Population</th>
                <th>GDP per capita</th>
                <th>Population density</th>
                <th>Vehicle ownership</th>
                <th>Road Network Length</th>
                <th>Total road deaths</th>
                <th> Road deaths per Million Inhabitants</th>
                <th>Number of people killed per billion</th>
                <th>Number of seriously injured in 2017/2018</th>
    </tr>
      <tr>
        <td>United kingdom</td>
        <td>248.5</td>
        <td>66,273,576</td>
        <td>32,400</td>
        <td>273</td>
        <td>544</td>
        <td>421,127</td>
        <td>1,825</td>
        <td> 28 </td>
        <td>3.4 (2016–2018) GB Data Only</td>
        <td>25,609 (2017)</td>
      </tr>
  </table>


We have the HTML <table> element, then we have table row (<thead>) elements inside it. 
 to select the headers the query will be "$('.wikitable.sortable > thead > tr >td').text()". this will list out all the headers . 
    
step 7: Then we use .find(“td”) to find all child elements of td inside this element. This is basically the same as the arrow > CSS child selector we use in our “body > table > tbody > tr” selector. This is going to return an array of three td elements for every table row. But now we can easily see that element number 0 (the first element), is the country name. 
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
  
 Now we can scrap the website and get the table. Note this info is stored as an object array. first of all i need to sort using the Road_deaths_per_Million_Inhabitants values 
  scrapedData.sort(function (x, y) {
                            return x.Road_deaths_per_Million_Inhabitants-y.Road_deaths_per_Million_Inhabitants
                             });
    the code above will help to sort .
    
 Next step is converting to csv format

Approach:

Create an empty array first to store all data of an object in form of rows.
Using Object.keys() method fetch  all keys of an object which are going to be first row of CSV table.
map() method iterate over all objects and append all values to “csvRow[]” array along with comma(,) separator using join() method.
push() method will push all data into “csvRow[]” array fetched by map() and Objects.keys().
after mapping each row new line will be added by the join(“\n”) method.

Below is the sample  implementation of the above approach:

index.js
<script>
    const objectToCsv = function (data) {

        const csvRows = [];

        /* Get headers as every csv data format 
        has header (head means column name)
        so objects key is nothing but column name 
        for csv data using Object.key() function.
        We fetch key of object as column name for 
        csv */
        const headers = Object.keys(data[0]);

        /* Using push() method we push fetched 
           data into csvRows[] array */
        csvRows.push(headers.join(','));

        // Loop to get value of each objects key
        for (const row of data) {
            const values = headers.map(header => {
                const val = row[header]
                return `"${val}"`;
            });

            // To add, sepearater between each value
            csvRows.push(values.join(','));
        }

        /* To add new line for each objects values
           and this return statement array csvRows
           to this function.*/
        return csvRows.join('\n');
    };

    const data = [{
        "firstname": "geeks",
        "lastname": "org",
        "age": 12
    },
    {
        "firstname": "devendra",
        "lastname": "salunke",
        "age": 31
    },
    {
        "firstname": "virat",
        "lastname": "kohli",
        "age": 34
    },
    ];

    // Data passed as parameter 
    const csvData = objectToCsv(data);
    console.log(csvData); 
</script>
Output: 

"firstname,lastname,age
\"geeks\",\"org\",\"12\"
\"devendra\",\"salunke\",\"31\"

References:
1.Write a program to convert an array of objects to a CSV string that contains only the columns specified using JavaScript: https://www.geeksforgeeks.org/write-a-program-to-convert-an-array-of-objects-to-a-csv-string-that-contains-only-the-columns-specified-using-javascript/
2.Scraping HTML Tables with Nodejs Request and Cheerio: https://medium.com/@stefanhyltoft/scraping-html-tables-with-nodejs-request-and-cheerio-e3c6334f661b.
3.Node.js: Build a simple Wikipedia Viewer: https://medium.com/@atingenkay/node-js-build-a-simple-wikipedia-viewer-a5030322f5bb
