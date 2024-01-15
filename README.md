# Northcoders News API

In order to connect to the two databases (development & test). Please follow the below instructions:
1. Create a file called .env.test - this file should be created under the BE-NC-NEWS path (and not within any sub-folders)
2. Create a file called .env.development - this file should be created under the BE-NC-NEWS path (and not within any sub-folders)
3. In oder to connect to the test database. Add the following code into the .env.test file: PGDATABASE=nc_news_test
4. In oder to connect to the development database. Add the following code into the .env.development file: PGDATABASE=nc_news
5. Check .env.* is contained within .gitignore file