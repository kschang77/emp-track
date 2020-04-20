const menu = require('inquirer-menu');
const figlet = require("figlet")
const chalk = require("chalk")

// This is a test wireframe for inquirer-menu


const employeeMenu = {
  message: 'Employee Menu',
  choices: {
    "Show All Employees": function () {
      console.log("calling readEmployee")
      readEmployee()
      return;
    },
    "Create New Employee": function () {
      createEmployee()
      return
    },
    "Update Existing Employees": function () {
      updateEmployee()
      return
    },
    "Delete Employee": function () {
      deleteEmployee()
      return
    }
  }
};

const departmentMenu = {
  message: 'Department Menu',
  choices: {
    callApi: function () {
      console.log('red-api called');
      return;
    }
  }
};

const roleMenu = {
  message: 'Role Menu',
  choices: {
    callApi: function () {
      console.log('green-api called');
      return;
    }
  }
};

const reportMenu = {
  message: 'Report Menu',
  choices: {
    callApi: function () {
      console.log('purple-api called');
      return;
    }
  }
};

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

let level = 0;

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

start()
menu(createMenu)
  .then(function () {
    end();
  })
  .catch(function (err) {
    console.log(err.stack);
  });

// bunch of stub declarations

function readEmployee() {
  console.log("readEmployee called")
  return
}

function createEmployee() {
  console.log("createEmployee called")
  return
}

function updateEmployee() {
  console.log("updateEmployee called")
  return
}

function deleteEmployee() {
  console.log("deleteEmployee called")
  return
}