DROP DATABASE IF EXISTS staff;

CREATE DATABASE staff;
USE staff;


DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS department;

CREATE TABLE department(
id INTEGER AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(30) NOT NULL

);

CREATE TABLE role(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    CONSTRAINT fk_dept_id FOREIGN KEY (department_id)
    REFERENCES department(id) ON DELETE SET NULL

);

CREATE TABLE employee(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    CONSTRAINT fk_role_id FOREIGN KEY (role_id)
    REFERENCES role(id) ON DELETE SET NULL,
    CONSTRAINT fk_manager_id FOREIGN KEY (manager_id)
    REFERENCES employee(id) ON DELETE SET NULL
);



INSERT INTO department(name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');
    


INSERT INTO role(title, department_id, salary)
VALUES
    ('Sales Lead', 1, 100000),
    ('Salesperson', 1, 80000),
    ('Lead Engineer', 2, 150000),
    ('Software Engineer', 2, 120000),
    ('Account Mananger',3, 160000 ),
    ('Acountant', 3, 125000),
    ('Legal Team Lead', 4, 250000),
    ('Lawyer', 4, 190000);



INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Doe', 1, NULL),
    ('Mike', 'Chan', 2, 1), 
    ('Ashley', 'Rodriquez', 3, NULL),
    ('Kevin', 'Tupik', 4, 3), 
    ('Kunal', 'Singh', 5, NULL),
    ('Malia', 'Brown', 6, 5),
    ('Sarah', 'Lourd', 7, NULL), 
    ('Tom', 'Allen', 8, 7);
    
