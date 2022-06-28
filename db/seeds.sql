/*data for department*/
INSERT INTO 
department (name)
VALUES
    ('Finance'),
    ('HR'),
    ('Marketing'),
    ('Sales'),
    ('General Management');

/*data for role*/
INSERT INTO 
role (title, salary, department_id)
VALUES
    ('Executive', 120000, 1),
    ('HR Manager', 90000, 4),
    ('Chief Marketing Officer', 100000, 7),
    ('Sales Rep', 80000, 3),
    ('Finance Manager', 110000, 9);

/*data for employee*/
INSERT INTO 
employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Lennie', 'Fitz', 1, NULL),
    ('Emma', 'Woodhouse', 2, 3),
    ('Buzz', 'Lightyear', 3, NULL),
    ('Eduardo', 'Elrich', 4, NULL),
    ('Levi', 'Ackermann', 5, NULL);