const inquirer = require('inquirer');
const mysql = require('mysql2');
const fs = require('fs');
const sequelize = require('./config/connection');

/*/sequelize.sync({ force: true}).then(() => {

})*/

// main menu prompt options
const mainMenu = [
    {
        type: 'list',
        name: 'menu',
        message: 'what would you like to do?',
        choices: ['view departments', 'view roles', 'view employees',
         'add department', 'add role', 'add employee', 'update employee role', 'exit'],
    },
];

const addDepartmentPrompt = [
    {
        type: 'text',
        name: 'name',
        message: 'enter department name',
    },
];

//functions
function viewDepartments() {
    const query = 'SELECT * FROM departments';

    sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
        .then((results) => {
            console.table(results);
            promptMainMenu();
        })
        .catch((err) => {
            console.error('Error fetching departments', err);
            promptMainMenu();
        });
}

function viewRoles() {
    fs.readFile('sql/viewRoles.sql', 'utf8', (err, query) => {
        if (err) {
            console.error('Error reading viewRoles.sql', err);
            return;
        }

        sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
            .then((results) => {
                console.table(results);
                promptMainMenu();
            })
            .catch((err) => {
                console.error('Error fetching roles', err);
                promptMainMenu();
            });
    });
}

function viewEmployees() {
    fs.readFile('sql/viewEmployees.sql', 'utf8', (err, query) => {
        if (err) {
            console.error('Error reading viewEmployees.sql', err);
            return;
        }

        sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
            .then((results) => {
                console.table(results);
                promptMainMenu();
            })
            .catch((err) => {
                console.error('Error fetching employees', err);
                promptMainMenu();
            });
    });
}

async function addDepartment(departmentName) {
    const query = `INSERT INTO departments (name) VALUES (:departmentName)`;

    try {
        const result = await sequelize.query(query, {
            replacements: { departmentName },
            type: sequelize.QueryTypes.INSERT
        });

        console.log('Department added successfully');
    } catch (err) {
        console.error('Error adding department', err);
    }
}

async function promptAddDepartment() {
    try {
        const answers = await inquirer.prompt(addDepartmentPrompt);
        const departmentName = answers.name;
        await addDepartment(departmentName);
        promptMainMenu();
    } catch (err) {
        console.error('An error occurred', err);
        promptMainMenu();
    }
}

//main menu prompt
function promptMainMenu() {
    inquirer.prompt(mainMenu).then((answers) => {
        switch (answers.menu) {
            case 'view departments':
                viewDepartments();
                break;
            case 'view roles':
                viewRoles();
                break;
            case 'view employees':
                viewEmployees();
                break;
            case 'add department':
                promptAddDepartment();
                break;
            case 'add role':
                addRole();
                break;
            case 'add employee':
                addEmployee();
                break;
            case 'update employee role':
                updateEmployeeRole();
                break;
            case 'exit':
                connection.end();
                console.log('goodbye!');
                break;
            default:
                console.log('invalid choice');
                promptMainMenu();
        }
    });
}




function init() {
    promptMainMenu();
}

init();