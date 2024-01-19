# Northcoders News API

Project: 
The project focuses on building a server for a news company, where news articles can be accessed as well as their associated comments, authors details and topics. There is the functionality to post comments to specific articles, filter articles by topic, update the number of votes for each comment and delete comments.

Link to project: 
https://alex-nc-news.onrender.com


How to create the .env files:
In order to connect to the two databases (development & test). Please follow the below instructions:
1. Create a file called .env.test - this file should be created under the BE-NC-NEWS path (and not within any sub-folders)
2. Create a file called .env.development - this file should be created under the BE-NC-NEWS path (and not within any sub-folders)
3. In oder to connect to the test database. Add the following code into the .env.test file: PGDATABASE=nc_news_test
4. In oder to connect to the development database. Add the following code into the .env.development file: PGDATABASE=nc_news
5. Check .env.* is contained within .gitignore file

Instruction on how to setup project to run code:
1. Clone repo - run command 'git clone https://github.com/adunners/nc_news.git' in your terminal
2. Install dependencies - run command 'npm install'
3. Seed local database - run command 'npm run setup-dbs' and then run 'npm run seed' to seed with development data or run 'npm test' to seed with test data.
4. Run test - run command 'npm test' or 'npm t app' just to run test app.test.js test file.

Other information:
1. minimum version of Node.js required v21.1.0
2. minimum version of Postgres required ^8.7.3

