# Staff_Examiner



Video of app in action:
(https://2u-20.wistia.com/medias/2lnle7xnpk)

## User Story

AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business


## Acceptance Criteria

- [x] GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

- [x] WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids

- [x] WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role

- [x] WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to


- [x] WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
 

- [x] WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database

- [x] WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database


- [x] WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database




## Getting Started:


- [x] MySQL2 package to connect to my MySQL database and perform queries

- [x] Inquirer package to interact with user via command line

- [x] Console.table.package to print the MySQL rows to the console.

- [x] Use dotenv to hide credentials

- [x] Make queries asynchronous.  MySQL2 exposes a .promise() function on Connections to upgrade an existing non-promise connection to use Promises.

- [x] Read this for help with async MySQL2  https://www.npmjs.com/package/mysql2

- [x] Schema

            department
                id: INT PRIMARY KEY
                name: VARCHAR(30) to hold department name

            role
                id:INT PRIMARY KEY
                title: VARCHAR(30) to hold role title
                salary: DECIMAL to hold role salary
                department_id: INT to hold reference to department role belongs to

            employee
                id: INT PRIMARY KEY
                first_name: VARCHAR(30) to hold employee first name
                last_name: VARCHAR(30) to hold employee last name
                role_id: INT to hold reference to employee role
                manager_id: INT to hold reference to another employee that is the manager of the current employee (null if the employee has no manager)

- [ ] Separate file that contains functions for performing specific SQL queries 

- [ ] Constructor function or class could help organize these.

- [x] Include seeds.sql to pre-populate the db

- [x] BONUS: add the following:
            Update employee managers
            View employees by manager
            View employees by department
            Delete departments, roles, employees
            View the total utilized budget of a department --total of all employees salaries.




## Grading Requirements

- [x] This Challenge is graded based on the following criteria:

## Deliverables: 10%
- [x]   Github repo containing code.


## Video Walkthrough: 27%
- [ ] Submitted and link in the readme

- [ ] Must show all technical acceptance being met

- [ ] How the user invokes the application from command line

- [ ] Shows functional menu with options outlined in the acceptance criteria


## Technical Acceptance Criteria: 40%
- [x] Uses inquirer

- [x] Uses MySQL2 package to connect to MySQL database

- [x] Uses the console.table.package to print MySQL rows to the console

- [x] Follows the following Schema 

![](./images/12-sql-homework-demo-01.png)



## Application Quality: 10%
- [x] Application console is free of errors.

- [x] The application user experience is intuitive and easy to navigate.

## Repository Quality: 13%
- [x] Repository has a unique name.

- [x] Repository follows best practices for file structure and naming conventions.

- [x] Repository follows best practices for class/id naming conventions, indentation, quality comments, etc.

- [x] Repository contains multiple descriptive commit messages.

- [x] Repository contains quality README file with description, screenshot, and link to deployed application.

## Bonus: +10 Points
- [x] Fulfilling any of the following can add up to 20 points to your grade. Note that the highest grade you can get is still 100:
- [x] Update employee managers (2pts)
- [x] View employees by managers (2pts)
- [x] View employees by department (2pts)
- [x] Delete departments, roles, employees (2pts each)
- [x] View a departments total salary requirement (8pts)


## How to Submit the Challenge
- [x] You are required to submit BOTH of the following for review:

- [x] A walkthrough video demonstrating the functionality of the application.

- [x] The URL of the GitHub repository. Give the repository a unique name and include a README describing the project.