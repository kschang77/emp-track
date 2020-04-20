// emp-track by Kasey Chang // github.com/kschang77/emp-track

const mysql = require("mysql");
const inquirer = require("inquirer")
const util = require('util');
const figlet = require("figlet")
const chalk = require("chalk")
const Table = require("cli-table")

// use this to open a connect as we need it
// EX 
// myConn = getSQLConnection()
//  ... run some query with myConn.query(...)
// myConn.end();

function getSQLConnection() {
  var params = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employeedb"
  }
  return mysql.createConnection(params);
}

// trying alternate syntax to test db code

config = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employeedb"
}

function makeDb(config) {
  const connection = mysql.createConnection(config);
  return {
    query(sql, args) {
      return util.promisify(connection.query)
        .call(connection, sql, args);
    },
    close() {
      return util.promisify(connection.end).call(connection);
    }
  };
}

// some validation functions

function validateInteger(int) {
  if (Number.isInteger(Number(int))) {
    return true
  } else {
    return "That is not an integer!"
  }
}

function validateNonBlank(str) {
  if (str == '') {
    return "This cannot be blank!"
  } else {
    return true
  }
}

function validateNumber(str) {
  var reg = /^\d+$/;
  return reg.test(str) || "This should be a number!";
}

function validateDepartmentNameOk(str) {
  if (str == '') {
    return "This cannot be blank!"
  } else {
    if (str.length > 30) {
      return "Length must be <30!"
    } else {
      return true
    }
  }
}

// function validateDepartmentIDExists(str) {
//   if (str == '') {
//     return "This cannot be blank!"
//   } else {
//     if (!validateNumber(str)) {
//       return "That is not a number!"
//     }
//     queryStr = "select id,name from department where id = ?"
//     var conn = getSQLConnection();
//     // console.log(queryStr + " // " + str)
//     conn.query(queryStr, str, function (err, res) {
//       if (err) throw err;
//       // console.log(err)
//       // console.log(res)
//       if (res.length = 0) return "Department ID not found!";
//       conn.end();
//       return true;
//     })
//   }
// }

// end validation functions


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
          let promise = readDepartment();
          promise.then(script1 => {
            CRUDdepartment();
          })
          break;
        case 'Create New Department':
          let promise2 = createDepartment();
          promise2.then(script2 => {
            CRUDdepartment();
          })
          break;
        case 'Update Existing Department':
          let promise3 = updateDepartment();
          promise3.then(script3 => {
            CRUDdepartment();
          })
          break;
        case 'Delete Existing Department':
          let promise4 = deleteDepartment();
          promise4.then(script1 => {
            CRUDdepartment();
          })
          break;
        case 'Return to Main Menu':
          mainMenu();
      }
    });
  // CRUDdepartment();
}

//--- role---

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
          let promise = readRole();
          promise.then(script1 => {
            CRUDrole();
          })
          break;
        case 'Create New Role':
          readDepartment().then(x =>
            createRole())
          break;
        case 'Update Existing Role':
          readDepartment().then(x =>
            updateRole())
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

async function readEmployee() {
  // display all employees
  console.log("@readEmployee")
  queryStr = "select first,last,role_id,manager_id from employee"
  // var conn = getSQLConnection();
  const db = makeDb(config)
  try {
    res = await db.query(queryStr)
    console.log("---" + res.length + " records found ---")
    var table = new Table({
      head: ['id', 'first_name', 'last_name', 'role_id', 'manager_id'],
      colWidths: [5, 20, 20, 5]
    })
    res.forEach((row) => {
      table.push([row.id, row.first_name, row.last_name, row.manager_id])
    })
    console.log(table.toString());
    console.log("---" + res.length + " records shown ---")
  } catch (err) {
    //what error?
    throw ("error in readEmployee", err)
  } finally {
    await db.close();
  }
}

function createEmployee() {
  console.log("@createEmployee")
  inquirer
    .prompt([
      {
        type: "input",
        name: "fname",
        message: "Enter Employee First Name? ",
        validate: validateNonBlank
      },
      {
        type: "input",
        name: "lname",
        message: "Enter Employee Surname? ",
        validate: validateNonBlank
      },
      {
        type: "input",
        name: "roleID",
        message: "Enter Role ID? ",
        validate: validateInteger
      },
      {
        type: "input",
        name: "managerID",
        message: "Enter Manager ID? ",
        validate: validateNonBlank
      }
    ])
    .then(function (answer) {
      queryStr = "insert into employee (first_name,last_name,role_id,manager_id) value (?,?,?,?)"
      var conn = getSQLConnection();
      conn.query(queryStr, [answer.first_name, answer.last_name, answer.role_id, manager_id], function (err, res) {
        if (err) throw err;
        conn.end()
        readEmployee();
        CRUDemployee();
      })
    }
    )
}

function updateEmployee() {
  console.log("@updateEmployee")
  inquirer
    .prompt([
      {
        type: "input",
        name: "updID",
        message: "Enter employee id to update? ",
        validate: validateNumber
        // validateDepartmentIDExists
      },
      {
        type: "input",
        name: "fname",
        message: "Enter Employee First Name? ",
        validate: validateNonBlank
      },
      {
        type: "input",
        name: "lname",
        message: "Enter Employee Surname? ",
        validate: validateNonBlank
      },
      {
        type: "input",
        name: "roleID",
        message: "Enter Role ID? ",
        validate: validateInteger
      },
      {
        type: "input",
        name: "managerID",
        message: "Enter Manager ID? ",
        validate: validateNonBlank
      }
    ])
    .then(function (answer) {
      queryStr = "update employee set first_name=?,last_name=?,role_id=?,manager_id=? where id=?"
      var conn = getSQLConnection();
      conn.query(queryStr, [answer.fname, answer.lname, answer.roleID, answer.managerID, answer.updID], function (err, res) {
        if (err) throw err;
        conn.end();
        readEmployee();
        CRUDemployee();
      })
    }
    )
}

function deleteEmployee() {
  console.log("@deleteEmployee")
  inquirer
    .prompt([
      {
        type: "input",
        name: "delID",
        message: "Enter employee id to delete? ",
        validate: validateNumber
        // validateDepartmentIDExists
      }
    ])
    .then(function (answer) {
      queryStr = "delete from employee where id = ?"
      // console.log(answer)
      var conn = getSQLConnection();
      // console.log(answer.delDepartment)
      conn.query(queryStr, answer.delID, function (err, res) {
        if (err) throw err;
        conn.end();
        readEmployee();
        CRUDemployee();
      })
    }
    )
}



// CRUD department
async function readDepartment() {
  // display all departments
  // table only has two columsn, id and name
  console.log("@readDepartment")
  queryStr = "select id,name from department"
  // var conn = getSQLConnection();
  const db = makeDb(config)
  try {
    res = await db.query(queryStr)
    console.log("---" + res.length + " records found ---")
    var table = new Table({
      head: ['id', 'name'],
      colWidths: [10, 30]
    })
    res.forEach((row) => {
      table.push([row.id, row.name])
    })
    console.log(table.toString());
    console.log("---" + res.length + " records shown ---")
  } catch (err) {
    //what error?
    throw ("error in readDepartment", err)
  } finally {
    await db.close();
  }
}

async function createDepartment() {
  console.log("@createDepartment")
  try {
    const ans = await inquirer.prompt([
      {
        type: "input",
        name: "newDepartment",
        message: "Enter new department name? ",
        validate: validateDepartmentNameOk
      }
    ])
    queryStr = "insert into department (name) value (?)"
    const db = makeDb(config)
    try {
      res = await db.query(queryStr, ans.newDepartment)
    } catch (err) {
      throw ("error in createDepartment query", err)
    } finally {
      await db.close()
    }
  }
  catch (err) {
    throw ("error in createDepartment Inquirer", err)
  }
}

async function updateDepartment() {
  console.log("@updateDepartment")
  try {
    const ans = await inquirer.prompt([
      {
        type: "input",
        name: "updid",
        message: "Enter department id to update? ",
        validate: validateNumber
      },
      {
        type: "input",
        name: "updDepartment",
        message: "Enter updated department name? ",
        validate: validateDepartmentNameOk
      }
    ])

    queryStr = "update department set name=? where id=?"
    const db = makeDb(config)
    try {
      res = db.query(queryStr, [ans.updDepartment, ans.updid]);
    } catch (err) {
      throw ("error in updateDepartment query", err)
    } finally {
      await db.close()
    }
  }
  catch (err) {
    throw ("error in updateDepartment Inquirer", err)
  }
}

async function deleteDepartment() {
  console.log("@deleteDepartment")
  try {
    const ans = await inquirer.prompt([
      {
        type: "input",
        name: "delDepartment",
        message: "Enter department id to delete? ",
        validate: validateNumber
        // validateDepartmentIDExists
      }
    ])

    queryStr = "delete from department where id = ?"
    const db = makeDb(config);
    try {
      res = db.query(queryStr, ans.delDepartment);
    } catch (err) {
      throw ("error in deleteDepartment query", err)
    } finally {
      await db.close()
    }
  } catch (err) {
    throw ("error in deleteDepartment Inquirer", err)
  }
}



// CRUD role

async function readRole() {
  // display all roles
  // table only has two columsn, id and name
  console.log("@readRole")
  queryStr = "select r.id,title,salary,department_id from role r"
  // var conn = getSQLConnection();
  const db = makeDb(config)
  try {
    res = await db.query(queryStr)
    console.log("---" + res.length + " records found ---")
    var table = new Table({
      head: ['id', 'title', 'salary', 'department_id'],
      colWidths: [6, 25, 10, 6]
    })
    res.forEach((row) => {
      table.push([row.id, row.title, row.salary, row.department_id])
    })
    console.log(table.toString());
    console.log("---" + res.length + " records shown ---")
  } catch (err) {
    throw ("error in readRole ", err)
  } finally {
    await db.close();
  }
}

async function createRole() {
  console.log("@createRole")
  try {
    const ans = await inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "Enter Title? ",
        validate: validateNonBlank
      },
      {
        type: "input",
        name: "salary",
        message: "Enter Salary? ",
        validate: validateInteger
      },
      {
        type: "input",
        name: "departmentID",
        message: "Enter DepartmentID? ",
        validate: validateInteger
      }
    ])

    queryStr = "insert into role (title,salary,department_id) value (?,?,?)"

    const db = makeDb(config)
    try {
      res = await db.query(queryStr, [ans.title, ans.salary, ans.departmentID])
    } catch (err) {
      throw ("error in createRole query", err)
    } finally {
      await db.close()
    }
  } catch (err) {
    throw ("error in createRole inquirer", err)
  }
}

async function updateRole() {
  console.log("@updateRole")
  try {
    const ans = await inquirer.prompt([
      {
        type: "input",
        name: "updid",
        message: "Enter role id to update? ",
        validate: validateNumber
      },
      {
        type: "input",
        name: "title",
        message: "Enter updated title? ",
        validate: validateNonBlank
      },
      {
        type: "input",
        name: "salary",
        message: "Enter Salary? ",
        validate: validateInteger
      },
      {
        type: "input",
        name: "departmentID",
        message: "Enter DepartmentID? ",
        validate: validateInteger
      }
    ])

    queryStr = "update role set title=?,salary=?,department_id=? where id=?"

    const db = makeDb(config)
    try {
      res = db.query(queryStr, [ans.title, ans.salary, ans.departmentID, ans.updid])
    } catch (err) {
      throw ("error in updateRole query", err)
    } finally {
      await db.close()
    }
  } catch (err) {
    throw ("error in updateRole inquirer", err)
  }
}

async function deleteRole() {
  console.log("@deleteRole")
  try {
    const ans = await inquirer.prompt([
      {
        type: "input",
        name: "delRole",
        message: "Enter role id to delete? ",
        validate: validateNumber
        // validateDepartmentIDExists
      }
    ])

    queryStr = "delete from role where id = ?"

    const db = makeDb(config);
    try {
      res = db.query(queryStr, ans.delRole)
    } catch (err) {
      throw ("error in deleteRole query", err)
    } finally {
      await db.close()
    }
  } catch (err) {
    throw ("error in deleteRole inquirer", err)
  }
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