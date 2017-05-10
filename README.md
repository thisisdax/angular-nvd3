# angular-nvd3

#### Installation
1. You may choose to fork and git clone this repo.
2. Open up your terminal and type `npm install` on the directory you have cloned this repo to.
3. Type `npm install --save nodemon`
4. Ensure that you have MongoDB installed.
  - Proceed to https://www.mongodb.com/ to download and install if you don't have it.
5. Included in this repo is a MOCK_DATA.json file you may use to populate your mongoDB.
6. To import the mock data, navigate to the folder containing MOCK_DATA.json on your bash and type the following command into    bash - 

      `mongoimport --db alpha --collection invoice --drop --jsonArray --file ~/MOCK_DATA.json`
  
7. Open up a new terminal, type `mongod` to run your MongoDB.
8. You may now run the application by opening up a seperate terminal, and type `npm start`.
9. Once you have done the above, you may access the app via your browser by typeing `localhost:3000`.

#### Generating more Test Data
1. I used `https://mockaroo.com/` to generate the mock data.
2. Head over and generate your own test data if you wish to.
3. I chose the following data (date type),
  - customer (Company Name)
  - amount (Money in $)
  - date (Date)
  
#### How to use
1. Choose 'All' Or 'Today' to generate the chart for the given month.
2. Type into the 'Search Filter' to filter the table according to date or customer if you wish to.

#### Dependencies
* [express]
* [body-parser]
* [mongoose]
* [morgan]
* [angular]
* [d3]
* [nvd3]
* [angular-nvd3]
* [path]
