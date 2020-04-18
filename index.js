// emp-track by Kasey Chang // github.com/kschang77/emp-track

var mysql = require("mysql");
var inquirer = require("inquirer")
const figlet = require("figlet")
const chalk = require("chalk")

function getSQLConnection() {
  var params = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employeeDB"
  }
  return mysql.createConnection(params);
}

start();
mainMenu();

// start is just some fancy presentation
function start() {
  console.log(chalk.yellow(figlet.textSync('Emp-Track', {
    font: 'Computer',
    horizontalLayout: 'fitted',
    verticalLayout: 'default'
  })));
  console.log("V0.1 by Kasey K S Chang (c) 2020")
  console.log("")
}

// just a sign-off message
function end() {
  console.log("")
  console.log(chalk.yellow("Thank you for using Emp-track."))
  console.log("")
}

// mainMenu presents the 5 choices
function mainMenu() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'Choose? ',
        choices: [
          "Employee - create / update / read / delete",
          "Department - create / update / read / delete",
          "Role - create / update / read / delete",
          "Special Employee Reports",
          "End Program"]
      }
    ])
    .then(function (answer) {
      switch (answer.choice) {
        case 'Employee - create / update / read / delete':
          CRUDemployee();
          break;
        case 'Department - create / update / read / delete':
          CRUDdepartment();
          break;
        case 'Role - create / update / read / delete':
          CRUDrole();
          break;
        case 'Special Employee Reports':
          specialReports();
          break;
        case 'End Program':
          end();
          process.exit(0);
      }
    });
}

function CRUDemployee() {
  // CRUD = create / read / update / delete

  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "Choose?",
        choices: [
          "Show All Employees",
          "Create New Employee",
          "Update Existing Employee",
          "Delete Existing Employee",
          "Return to Main Menu"]
      }
    ])
    .then(function (answer) {
      switch (answer.choice) {
        case 'Show All Employees':
          readEmployee();
          break;
        case 'Create New Employee':
          createEmployee();
          break;
        case 'Update Existing Employee':
          updateEmployee();
          break;
        case 'Delete Existing Employee':
          deleteEmployee();
          break;
        case 'Return to Main Menu':
          mainMenu();
      }
    });
}

function CRUDdepartment() {
  // CRUD = create / read / update / delete

  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "Choose?",
        choices: [
          "Show All Departments",
          "Create New Department",
          "Update Existing Department",
          "Delete Existing Department",
          "Return to Main Menu"]
      }
    ])
    .then(function (answer) {
      switch (answer.choice) {
        case 'Show All Departments':
          readDepartment();
          break;
        case 'Create New Department':
          createDepartment();
          break;
        case 'Update Existing Department':
          updateDepartment();
          break;
        case 'Delete Existing Department':
          deleteDepartment();
          break;
        case 'Return to Main Menu':
          mainMenu();
      }
    });
}

function CRUDrole() {
  // CRUD = create / read / update / delete

  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "Choose?",
        choices: [
          "Show All Roles",
          "Create New Role",
          "Update Existing Role",
          "Delete Existing Role",
          "Return to Main Menu"]
      }
    ])
    .then(function (answer) {
      switch (answer.choice) {
        case 'Show All Roles':
          readRole();
          break;
        case 'Create New Role':
          createRole();
          break;
        case 'Update Existing Role':
          updateRole();
          break;
        case 'Delete Existing Role':
          deleteRole();
          break;
        case 'Return to Main Menu':
          mainMenu();
      }
    });
}

function specialReports() {
  // two special reports

  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "Choose?",
        choices: [
          "Report Employees by Manager",
          "Report Department Salary Budget",
          "Return to Main Menu"]
      }
    ])
    .then(function (answer) {
      switch (answer.choice) {
        case 'Show All Roles':
          reportEmployeeByManager();
          break;
        case 'Create New Role':
          reportDepartmentSalary();
          break;
        case 'Return to Main Menu':
          mainMenu();
      }
    });
}

//----- main menu complete

// CRUD employee

function readEmployee() {
  console.log("--- readEmployee ---")

  CRUDemployee();
}

function createEmployee() {
  console.log("--- createEmployee ---")

  CRUDemployee();
}

function updateEmployee() {
  console.log("--- updateEmployee ---")

  CRUDemployee();
}

function deleteEmployee() {
  console.log("--- deleteEmployee ---")

  CRUDemployee();
}



// CRUD department

function readDepartment() {
  console.log("--- readDepartment ---")

  CRUDdepartment();
}

function createDepartment() {
  console.log("--- createDepartment ---")

  CRUDdepartment();
}

function updateDepartment() {
  console.log("--- updateDepartment ---")

  CRUDdepartment();
}

function deleteDepartment() {
  console.log("--- deleteDepartment ---")

  CRUDdepartment();
}



// CRUD role

function readRole() {
  console.log("--- readRole ---")

  CRUDrole();
}

function createRole() {
  console.log("--- createRole ---")

  CRUDrole();
}

function updateRole() {
  console.log("--- updateRole ---")

  CRUDrole();
}

function deleteRole() {
  console.log("--- deleteRole ---")

  CRUDrole();
}


// -- reports --
function reportEmployeeByManager() {
  console.log("--- reportEmployeeByManager ---")
  // select manager from list, display list of employees


  specialReports();
}

function reportDepartmentSalary() {
  console.log("--- reportDepartmentSalary ---")
  // select department from list, display total salary of all employees

  specialReports();
}