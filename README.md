# Welcome to emp-track 👋
![Version](https://img.shields.io/badge/version-0.1.0-blue.svg?cacheSeconds=2592000)
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://github.com/kschang77/emp-track#readme)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/kschang77/emp-track/graphs/commit-activity)
[![License: MMIT](https://img.shields.io/github/license/kschang77/emp-track)](https://github.com/kschang77/emp-track/blob/master/LICENSE)

> Emp-Track is an employee tracking system with using MySQL to interface with 3 tables: employee, department, and role. Full CRUD functionality (Create, Read, Update, Delete) is available with all three tables, plus two special reports. 


### 🏠 [Homepage](https://github.com/kschang77/emp-track#readme)

### Schema
```
USE employeeDB;

CREATE TABLE IF NOT EXISTS department
(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30)
);

CREATE TABLE IF NOT EXISTS role
(
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(30),
salary DECIMAL,
department_id INT,
FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE IF NOT EXISTS employee (
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id int,
manager_id int,
FOREIGN KEY (role_id) REFERENCES role(id),
FOREIGN KEY (manager_id) REFERENCES employee(id)
)
```
### Uses

Node.js  -- core functionality
MySQL community edition -- server backend
mysql npm -- node interface to MySQL
inquirer npm -- main user interface
util npm -- needed for a promise implementation
inquirer-menu npm -- nested menu module for inquirer
figlet npm -- pretty program start
chalk npm -- pretty program start and end
cli-table npm -- terminal table presentation


### Technical Challenges

While core functionality was actually completed Sunday (with me taking most of Saturday off to finish a different class) despite being due on Tuesday evening. Many problems revealed during testing prevented additional features to be developed.

Specifically, the menus, whether implemented with basic inquirer or with inquirer-menu, seems to lose track of the input vs. the onscreen output. And this is sporadic, with no particular pattern, that it took until Monday evening to track down. The main menu was rewritten three times: first with .then(), then with async/await, then with inquirer-menu. One more attempt was done with the "on" error handler in attempt to isolate the issue. So you will find evidence of a bit of messy code. Pardon the mess. 

Turns out it may be a [bug with inquirer](https://github.com/SBoudrias/Inquirer.js/issues/912), as it does not work well with async validation functions. It works sometimes if the async function was able to return the data before I hit input again. But if I was inputting really fast, what's on screen would no longer match what's being typed in. When I took out the validation or replace them with non-async validation, the functions work just fine. 

This has a couple side effects. 

#### Reduced error-checking

If we want to be sure the entered "employee ID" is valid, it is best to query it from the table. However, querying a database is an async function. This is the same for all three tables. 

It was decided to decrease validation of the various ID fields to type-check only (i.e. integer). 

It may be possible to cache the various tables in memory, but de-synchronization becomes a potential problem, and the program would not be multi-user capable. Furthermore, with 24 hours before due time, there really isn't time for a full rewrite. 

#### User-Unfriendliness of UI

In many cases, instead of presenting a list, the program simply asks for an ID number of the record you want to edit/delete. It is possible to fix this with the "table caching" idea above and present a list instead, but again, this adds a possible de-sychronization problem, and would definitely make this not multi-user. 

With 24 hours to due time, there really is no time for a full rewrite of the program to implement full in-memory table caching. 


## Author

👤 **Kasey Chang**

* Website: https://www.linkedin.com/in/kasey-chang-0932b332/
* Github: [@kschang77](https://github.com/kschang77)

## Show your support

Give a ⭐️ if this project helped you!


## 📝 License

Copyright © 2020 [Kasey Chang](https://github.com/kschang77).

This project is [MIT](https://github.com/kschang77/emp-track/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_