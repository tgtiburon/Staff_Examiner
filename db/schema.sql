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