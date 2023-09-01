const inquirer = require('inquirer');
const mysql = require('mysql2');
const fs = require('fs');
const sequelize = require('./config/connection');


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

async function addDepartment() {
    const departmentData = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the department name:'
        }
    ]);

    const query = `INSERT INTO departments (name) VALUES (:name)`;

    try {
        await sequelize.query(query, {
            replacements: departmentData,
            type: sequelize.QueryTypes.INSERT
        });
        console.log('Department added successfully');
        promptMainMenu();
    } catch (err) {
        console.error('Error adding department', err);
    }
}

async function addRole() {
    const roleData = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the role title:'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the role salary:'
        },
        {
            type: 'input',
            name: 'department_id',
            message: 'Enter the department ID for the role:'
        }
    ]);

    const query = `INSERT INTO roles (title, salary, department_id) VALUES (:title, :salary, :department_id)`;

    try {
        await sequelize.query(query, {
            replacements: roleData,
            type: sequelize.QueryTypes.INSERT
        });
        console.log('Role added successfully');
        promptMainMenu();
    } catch (err) {
        console.error('Error adding role', err);
    }
}

async function addEmployee() {
    const employeeData = await inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: "Enter the employee's first name:"
        },
        {
            type: 'input',
            name: 'last_name',
            message: "Enter the employee's last name:"
        },
        {
            type: 'input',
            name: 'role_id',
            message: "Enter the role ID for the employee:"
        },
        {
            type: 'input',
            name: 'manager_id',
            message: "Enter the manager ID for the employee (optional):"
        }
    ]);

    const query = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (:first_name, :last_name, :role_id, :manager_id)`;

    try {
        await sequelize.query(query, {
            replacements: employeeData,
            type: sequelize.QueryTypes.INSERT
        });
        console.log('Employee added successfully');
        promptMainMenu();
    } catch (err) {
        console.error('Error adding employee', err);
    }
}

async function updateEmployeeRole() {
    try {
        const employees = await sequelize.query('SELECT id, first_name, last_name FROM employees', {
            type: sequelize.QueryTypes.SELECT
        });

        const employeeChoices = employees.map(employee => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id
        }));

        const roles = await sequelize.query('SELECT id, title FROM roles', {
            type: sequelize.QueryTypes.SELECT
        });

        const roleChoices = roles.map(role => ({
            name: role.title,
            value: role.id
        }));

        const employeeUpdateData = await inquirer.prompt([
            {
                type: 'list',
                name: 'employee_id',
                message: 'Select an employee to update their role:',
                choices: employeeChoices
            },
            {
                type: 'list',
                name: 'new_role_id',
                message: 'Select the new role for the employee:',
                choices: roleChoices
            }
        ]);

        const query = `UPDATE employees SET role_id = :new_role_id WHERE id = :employee_id`;

        await sequelize.query(query, {
            replacements: employeeUpdateData,
            type: sequelize.QueryTypes.UPDATE
        });

        console.log('Employee role updated successfully');
        promptMainMenu();
    } catch (err) {
        console.error('Error updating employee role', err);
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
                sequelize.end();
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