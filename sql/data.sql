INSERT INTO departments (name)
VALUES ('Sales'),
       ('Marketing'),
       ('Finance');

INSERT INTO roles (title, salary, department_id)
VALUES ('Sales Lead', 75000, 1),
       ('Salesperson', 35000, 1),
       ('Social Media Manager', 30000, 2),
       ('Account Manager', 50000, 3),
       ('Accountant', 40000, 3);

-- Managers (employees without managers)  
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('Elba', 'Calao', 1, NULL),
       ('Gabriela', 'Quinonez', 3, NULL),
       ('Diego', 'Garcia', 5, NULL);

-- Entry Level Employees (employees with managers)
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('Elsa', 'Pato', 2, 1),
       ('John', 'James', 2, 1),
       ('Elmer', 'Acosta', 4, 5),
       ('Pedro', 'Lopez', 2, 1);

