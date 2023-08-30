const inquirer = require('inquirer');
const mysql = require('mysql2');

// connection to mysql - will probably create an .env file later
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'tu3Z@LJlpQ',
    database: 'companyDB',
});

connection.connect((err) => {
    if (err) {
        console.error('error connectiong to MYSQL', err);
    } else {
        console.log('connected to MYSQL');
    }
});

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

//functions
function viewDepartments() {
    connection.query('SELECT * FROM departments', (err, results) => {
        if (err) {
            console.error('Error fetching departments', err);
        } else {
            console.table(results);
            promptMainMenu();
        }
    });
}

function viewRoles() {
    connection.query('SELECT * FROM roles', (err, results) => {
        if (err) {
            console.error('Error fetching roles', err);
        } else {
            console.table(results);
            promptMainMenu();
        }
    });
}

function viewEmployees() {
    connection.query('SELECT * FROM employees', (err, results) => {
        if (err) {
            console.error('Error fetching employees', err);
        } else {
            console.table(results);
            promptMainMenu();
        }
    });
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
                addDepartment();
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