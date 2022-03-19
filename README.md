Scraping HTML Tables with Nodejs Request and Cheerio
Node.js: Download and install node.js if you haven’t already.

Wikipedia API: This is a free API, no key required. Just read through the documentation and get the required link needed for the API call. This is the link I’ll be using — https://en.wikipedia.org/w/api.php? with some parameters that will enable us to perform a search query.


Step 2: Setting up the project
Create a new directory named node-wiki and run npm init , fill out the required information to initialize the project. You can just do the default settings, for now, it doesn’t matter. But here’s what my package.json file looks like:
3. Create a file named index.js — this is the file that will house all the code for our application.

4. Now, let’s make our API call and to do this we need a npm module called request — It is a module that simplifies HTTP request in the node. Install request by running:
npm install request --save
npm install --save request-promise
Next, we pass in our target URL, and request returns a callback function. Our code should look like this:


Now let’s start by importing the request-promise and cheerio package in the top of our index.js file:

const request = require(“request-promise”);
const cheerio = require(“cheerio”);









Understand HTML Table Structure
In the table above we can see table headers, saying Company, Contact and Country.
Then in the following rows we have the data of the table itself.
Now let’s take a look at the HTML code of the table.
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


We have the HTML <table> element, then we have table row (<tr>) elements inside it. In the first table row element, we have 3 <th> elements, known as table headers. Company, Contact, Country. These are the green/white row we see at the top of the table, the table header, or <th> element’s.
Now on to the remaining <tr> or table rows, we can see some <td> elements, or table data elements. These contain the table’s data itself.
So for each table row we have a <tr> element with a corresponding closing element, </tr>.



Using the request-promise package we make an HTTP request to get the actual HTML page. We then feed this HTML page into cheerio. Cheerio returns an object that can be used just like the jQuery library on an actual webpage. We assign this to a dollar sign variable ($). This way, we can take the loop and the selector we created and tested in Chrome Tools, and use it inside Nodejs.
Now we can scrape the page without having a browser open, we could even build an API that returns the scraped data. We could also build an automatic periodic scraper that scrapes the table once every hour or day, or any other interval.
Okay, now let’s move on to the next section, because we still don’t have the scraped data into any data structure!


Then we use .find(“td”) to find all child elements of td inside this element. This is basically the same as the arrow > CSS child selector we use in our “body > table > tbody > tr” selector. This is going to return an array of three td elements for every table row. But now we can easily see that element number 0 (the first element), is the company name. The second td element is the contact name, and so on.


CREATING CSV FILE
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