const mysql = require('mysql2');

const inquirer = require('inquirer');

const cTable = require('console.table');
// const ExpandPrompt = require('inquirer/lib/prompts/expand');
// const { QueryInterface } = require('sequelize/types');
// const Connection = require('./db/connection');
require('dotenv').config();


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'aSfp31.QQi',
    database: 'employee'
},
    console.log('Connected to employee database')
);

connection.connect(function(err) {
    if (err) throw err;
    console.log('connected');
});

const promptUser = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'choices',
            message: 'What would you like to do?',
            choices: [
                'View all employees',
                'Add employee',
                'Update employee role',
                'View all roles',
                'Add role',
                'View all departments',
                'Add department',
                'Quit',
            ],
        },
    ])
    .then((answers) => {
        const { choices } = answers;

        if (choices === 'View all employees' ) {
            showEmployees();
        }

        if (choices === 'View all roles' ) {
            showRoles();
        }

        if (choices === 'View all departments' ) {
            showDepartments();
        }

        if (choices === 'Add an employee' ) {
            addEmployee();
        }

        if (choices === 'Add a role' ) {
            addRole();
        }

        if (choices === 'Add a department' ) {
            addDepartment();
        }

        if (choices === 'Update employee role') {
            updateEmployeeRole();
        }

        if (choices === 'Quit') {
            endPrompt();
        }
    });
};

//VIEW ALL EMPLOYEES
showEmployees = () => {
    console.log('Showing all employees \n');
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT (manager.first_name, "", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id`;

    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

//ADD AN EMPLOYEE
addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'What is the first name of the employee?',
            validate: addFirstName => {
                if (addFirstName) {
                    return true;
                } else {
                    console.log('Please enter a first name');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is the last name of the employee?',
            validate: addLastName => {
                if (addLastName) {
                    return true;
                } else {
                    console.log('Please enter a last name');
                    return false;
                }
            }
        }
    ])
    .then(answer => {
        const params = [answer.firstName, answer.lastName]

        const roleSql = `SELECT role.id, role.title FROM role`;

        connection.query(roleSql, (err, data) => {
            if (err) throw err;

            const roles = data.map(({ id, title }) => ({ name: title, value: id }));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: 'What is the role of the employee?',
                    choices: roles
                }
            ])
            .then(roleChoice => {
                const role = roleChoice.role;
                params.push(role);

                const managerSql = `SELECT * FROM employee`;

                connection.query(managerSql, (err, data) => {
                    if (err) throw err;

                    const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + "" + last_name, value: id }));

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: 'Who is the manager of the employee?',
                            choices: 'managers'
                        }
                    ])
                    .then(managerChoice => {
                        const manager = managerChoice.manager;
                        params.push(manager);

                        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;

                        connection.query(sql, params, (err, result) => {
                            if (err) throw err;
                            console.log('Employee has been added')

                            showEmployees();
                        });
                    });
                });
            });
        });
    });
};

//VIEW ALL ROLES
showRoles = () => {
    console.log('Showing all roles \n');
    const sql = `SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;`

    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

//ADD A ROLE
addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: 'What role would you like to add?',
            validate: addRole => {
                if (addRole) {
                    return true;
                } else {
                    console.log('Please enter a role');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of this role?',
            validate: addSalary => {
                if (isNaN(addSalary)) {
                    return true;
                } else {
                    console.log('Please enter a salary');
                    return false;
                }
            }
        }
    ])
    .then(answer => {
        const params = [answer.role, answer.salary];

        const roleSql = `SELECT name, id FROM department`;

        connection.query(roleSql, (err, data) => {
            if (err) throw err;

            const department = data.map(({ name, id }) => ({ name: name, value: id }));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'department',
                    message: 'What department does this role belong to?',
                    choices: department
                }
            ])
            .then(departmentChoice => {
                const department = departmentChoice.department;
                params.push(dept);

                const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
                connection.query(sql, params, (err, result) => {
                    if(err) throw err;
                    console.log('Role added:)');

                    showRoles();
                });
            });
        });
    });
};

//UPDATE EMPLOYEE ROLE
updateEmployeeRole = () => {
    const employeeSql = `SELECT * FROM employee`;

    connection.query(employeeSql, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: 'Which employee role do you want to update?',
                choices: employees
            }
        ])
        .then(employeeChoice => {
            const employee = employeeChoice.name;
            const params = [];
            params.push(employee);

            const roleSql = `SELECT * FROM role`;
            connection.query(roleSql, (err, data) => {
                if (err) throw err;

                const roles = data.map(({ id, title }) => ({ name: title, value: id }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What is the new role the employee will be taking?',
                        choices: roles
                    }
                ])
                .then(roleChoice => {
                    const role = roleChoice.role;
                    params.push(role);

                    let employee = params[0]
                    params[0] = role
                    params[1] = employee

                    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                    connection.query(sql, params, (err, result) => {
                        if (err) throw err;
                        console.log('Employee has been updated;)');

                        showEmployees();
                    });
                });
            });
        });
    });
};

//VIEW ALL DEPARTMENTS
showDepartments = () => {
    console.log('Showing all departments \n');
    const sql = `SELECT department.id, department.name AS department FROM department`;

    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

//ADD A DEPARTMENT
addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'newDepartment',
            message: 'What is the name of the department?',
            validate: newDepartment => {
                if (newDepartment) {
                    return true;
                } else {
                    console.log('Please enter a department');
                    return false;
                }
            }
        }
    ])
    .then(answer => {
        const sql = `INSERT INTO department (name) VALUES (?)`;
        connection.query(sql, answer.newDepartment, (err, result) => {
            if (err) throw err;
            console.log('Department added:p');

            showDepartments();
        });
    });
};

//QUIT
const endPrompt = () => {
    console.log('Peace out!');
};

promptUser();