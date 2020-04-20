// emp-track by Kasey Chang // github.com/kschang77/emp-track

const mysql = require("mysql");
const inquirer = require("inquirer")
const menu = require("inquirer-menu")
const util = require('util');
const figlet = require("figlet")
const chalk = require("chalk")
const Table = require("cli-table")
const clear = require('clear')


// progress so far: all functions work except final report. 
// HOWEVER, menus are glitch-y, and I can't find the problems. 
// All code were rewritten using async/wait, didn't help
// trying alternate mainmenu with inquirer-menu, using branch


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

async function validateDepartmentID(str) {
  if (str == '') {
    return "This cannot be blank!"
  }
  if (!validateNumber(str)) {
    return "That is not a number!"
  }
  // console.log("validateDepartmentID " + str)
  queryStr = "select id,name from department where id = ?"
  const db = makeDb(config)
  try {
    res = await db.query(queryStr, str);
    // console.log("res ", res)
    if (res.length === 0) {
      return "Department ID not found!";
    }
    return true;
  } catch (err) {
    throw ("error in validateDepartmentID " + str + " ", err)
  } finally {
    await db.close()
  }
}

async function validateEmployeeID(str) {
  if (str === '') {
    return "This cannot be blank!"
  }
  if (!validateNumber(str)) {
    return "That is not a number!"
  }
  // if (str === "0") {
  //   return true;  // 0 = self, do NOT check DB
  // }
  queryStr = "select * from employee where id = ?"
  const db = makeDb(config)
  try {
    res = await db.query(queryStr, str);
    // console.log("res ", res)
    if (res.length === 0) {
      return "Employee ID not found!";
    }
    return true;
  } catch (err) {
    throw ("error in validateEmployeeID " + str + " ", err)
  } finally {
    await db.close()
  }
}

async function validateRoleID(str) {
  if (str == '') {
    return "This cannot be blank!"
  }
  if (!validateNumber(str)) {
    return "That is not a number!"
  }
  queryStr = "select * from role where id = ?"
  const db = makeDb(config)
  try {
    res = await db.query(queryStr, str);
    // console.log("res ", res)
    if (res.length === 0) {
      return "Role ID not found!";
    }
    return true;
  } catch (err) {
    throw ("error in validateRoleID " + str + " ", err)
  } finally {
    await db.close()
  }
}
// end validation functions

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


// new employee menu

const employeeMenu = {
  message: 'Employee Menu',
  choices: {
    "Show All Employees": function () {
      // console.log("calling readEmployee")
      readEmployee()
      // clear({ fullClear: false })
      return;
    },
    "Create New Employee": function () {
      createEmployee()
      // clear({ fullClear: false })
      return
    },
    "Update Existing Employees": function () {
      updateEmployee()
      // clear({ fullClear: false })
      return
    },
    "Delete Employee": function () {
      deleteEmployee()
      // clear({ fullClear: false })
      return
    }
  }
};

const departmentMenu = {
  message: 'Department Menu',
  choices: {
    "Show All Departments": function () {
      // console.log("calling readEmployee")
      readDepartment()
      // clear({ fullClear: false })
      return;
    },
    "Create New Department": function () {
      createDepartment()
      // clear({ fullClear: false })
      return
    },
    "Update Existing Department": function () {
      updateDepartment()
      // clear({ fullClear: false })
      return
    },
    "Delete Department": function () {
      deleteDepartment()
      // clear({ fullClear: false })
      return
    }
  }
};

const roleMenu = {
  message: 'Role Menu',
  choices: {
    "Show All Roles": function () {
      // console.log("calling readEmployee")
      readRole()
      return;
    },
    "Create New Role": function () {
      createRole()
      return
    },
    "Update Existing Role": function () {
      updateRole()
      return
    },
    "Delete Role": function () {
      deleteRole()
      return
    }
  }
};

const reportMenu = {
  message: "Report Menu",
  choices: {
    "Report Employees by Manager": function () {
      reportEmployeeByManager()
      return
    },
    "Report Department Salary Budget": function () {
      reportDepartmentSalary()
      return
    }
  }
}

function createMenu() {
  return {
    message: 'Main Menu',
    choices: {
      "Employee Create/Read/Update/Delete": employeeMenu,
      "Department Create/Read/Update/Delete": departmentMenu,
      "Role Create/Read/Update/Delete": roleMenu,
      "Special Reports": reportMenu
    }
  };
};


// main program loop is here
clear();
start()
menu(createMenu)
  .then(function () {
    end();
  })
  .catch(function (err) {
    console.log(err.stack);
  });

//----- main menu complete

// CRUD employee

async function readEmployee() {
  // display all employees
  console.log("@readEmployee")
  queryStr = "select * from employee"
  // var conn = getSQLConnection();
  const db = makeDb(config)
  try {
    // clear();
    res = await db.query(queryStr)
    console.log("---" + res.length + " records found ---")
    var table = new Table({
      head: ['id', 'first_name', 'last_name', 'role_id', 'manager_id'],
      colWidths: [5, 20, 20, 5, 5]
    })
    res.forEach((row) => {
      table.push([row.id, row.first_name, row.last_name, row.role_id, row.manager_id])
    })
    console.log(table.toString());
    // console.log("---" + res.length + " records shown ---")
    console.log("")
    console.log("")
    console.log("")
    console.log("")
    console.log("")
    console.log("")
    console.log("")
  } catch (err) {
    //what error?
    throw ("error in readEmployee", err)
  } finally {
    await db.close();
  }
}

async function createEmployee() {
  // console.log("@createEmployee")
  try {
    clear();

    const ans = await inquirer.prompt([
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
        validate: validateRoleID
      },
      {
        type: "input",
        name: "managerID",
        message: "Enter Manager ID?",
        validate: validateEmployeeID
      }
    ])

    queryStr = "insert into employee (first_name,last_name,role_id,manager_id) value (?,?,?,?)"
    const db = makeDb(config)
    try {
      // if (ans.managerID === 0) {
      //   ans.managerID = 1
      // }
      res = await db.query(queryStr, [ans.fname, ans.lname, ans.roleID, ans.managerID])
      console.log("")
      console.log("")
      console.log("")
      console.log("")
      console.log("")
      console.log("")
      console.log("")
    } catch (err) {
      throw ("error in createEmployee query ", err)
    } finally {
      await db.close()
    }
  } catch (err) {
    throw ("Error in createEmployee inquirer ", err)
  }
}

async function updateEmployee() {
  // console.log("@updateEmployee")
  try {
    const ans = await inquirer.prompt([
      {
        type: "input",
        name: "updID",
        message: "Enter employee id to update? ",
        validate: validateEmployeeID
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
        validate: validateRoleID
      },
      {
        type: "input",
        name: "managerID",
        message: "Enter Manager ID? ",
        validate: validateEmployeeID
      }
    ])

    queryStr = "update employee set first_name=?,last_name=?,role_id=?,manager_id=? where id=?"

    const db = makeDb(config)
    try {
      res = await db.query(queryStr, [ans.fname, ans.lname, ans.roleID, ans.managerID, ans.updID]);
      console.log("")
      console.log("")
      console.log("")
      console.log("")
      console.log("")
      console.log("")
      console.log("")
    } catch (err) {
      throw ("error in updateEmployee query ", err)
    } finally {
      await db.close()
    }
  } catch (err) {
    throw ("error in updateEmployee inquirer ", err)
  }
}

async function deleteEmployee() {
  // console.log("@deleteEmployee")
  try {
    clear();

    const ans = await inquirer.prompt([
      {
        type: "input",
        name: "delID",
        message: "Enter employee id to delete? ",
        validate: validateEmployeeID
      }
    ])

    queryStr = "delete from employee where id = ?"

    const db = makeDb(config);

    try {
      res = await db.query(queryStr, ans.delID);
      console.log("")
      console.log("")
      console.log("")
      console.log("")
      console.log("")
      console.log("")
      console.log("")
    } catch (err) {
      throw ("error in deleteEmployee query ", err)
    } finally {
      await db.close()
    }
  } catch (err) {
    throw ("error in deleteEmployee inquirer ", err)
  }
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
    // clear();
    console.log("");
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
    // console.log("---" + res.length + " records shown ---")
    console.log("")
    console.log("")
    console.log("")
    console.log("")
    console.log("")
    console.log("")
    console.log("")
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
    // clear();
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
      console.log("")
      console.log("")
      console.log("")
      console.log("")
      console.log("")
      console.log("")
      console.log("")
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
  // console.log("@updateDepartment")
  try {
    // clear();
    const ans = await inquirer.prompt([
      {
        type: "input",
        name: "updid",
        message: "Enter department id to update? ",
        validate: validateDepartmentID
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
      res = await db.query(queryStr, [ans.updDepartment, ans.updid]);
      console.log("")
      console.log("")
      console.log("")
      console.log("")
      console.log("")
      console.log("")
      console.log("")
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
  // console.log("@deleteDepartment")
  try {
    // clear();
    const ans = await inquirer.prompt([
      {
        type: "input",
        name: "delDepartment",
        message: "Enter department id to delete? ",
        validate: validateDepartmentID
      }
    ])

    queryStr = "delete from department where id = ?"
    const db = makeDb(config);
    try {
      res = await db.query(queryStr, ans.delDepartment);
      console.log("")
      console.log("")
      console.log("")
      console.log("")
      console.log("")
      console.log("")
      console.log("")
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
    // console.log("---" + res.length + " records shown ---")
    console.log("")
    console.log("")
    console.log("")
    console.log("")
    console.log("")
    console.log("")
    console.log("")
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
        validate: validateDepartmentID
      }
    ])

    queryStr = "insert into role (title,salary,department_id) value (?,?,?)"

    const db = makeDb(config)
    try {
      res = await db.query(queryStr, [ans.title, ans.salary, ans.departmentID])
      console.log("")
      console.log("")
      console.log("")
      console.log("")
      console.log("")
      console.log("")
      console.log("")
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
        validate: validateRoleID
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
        validate: validateDepartmentID
      }
    ])

    queryStr = "update role set title=?,salary=?,department_id=? where id=?"

    const db = makeDb(config)
    try {
      res = await db.query(queryStr, [ans.title, ans.salary, ans.departmentID, ans.updid])
      console.log("")
      console.log("")
      console.log("")
      console.log("")
      console.log("")
      console.log("")
      console.log("")
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
        validate: validateRoleID
      }
    ])

    queryStr = "delete from role where id = ?"

    const db = makeDb(config);
    try {
      res = await db.query(queryStr, ans.delRole)
      console.log("")
      console.log("")
      console.log("")
      console.log("")
      console.log("")
      console.log("")
      console.log("")
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
async function reportEmployeeByManager() {
  // enter Manager, display list of employees

  console.log("@reportEmployeeByManager")
  try {
    const ans = await inquirer.prompt([
      {
        type: "input",
        name: "empID",
        message: "Enter Manager id to report? ",
        validate: validateEmployeeID
      }
    ])

    queryStr = "select * from employee where manager_id = ?"

    const db = makeDb(config);

    try {
      res = await db.query(queryStr, ans.empID);
      console.log("---" + res.length + " records found ---")
      var table = new Table({
        head: ['id', 'first_name', 'last_name', 'role_id', 'manager_id'],
        colWidths: [5, 20, 20, 5, 5]
      })
      res.forEach((row) => {
        table.push([row.id, row.first_name, row.last_name, row.role_id, row.manager_id])
      })
      console.log(table.toString());
      console.log("---" + res.length + " records shown ---")
      console.log("")
      console.log("")
      console.log("")
      console.log("")
      console.log("")
      console.log("")
      console.log("")
    } catch (err) {
      throw ("error in reportEmployeeByManager query ", err)
    } finally {
      await db.close()
    }
  } catch (err) {
    throw ("error in reportEmployeeByManager inquirer ", err)
  }
}

function reportDepartmentSalary() {
  console.log("--- reportDepartmentSalary ---")
  // select department from list, display total salary of all employees

  specialReports();
}