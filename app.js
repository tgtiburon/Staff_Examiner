const db = require("./db/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");

/**
 * Called at start.  Welcome screen.
 */
const init = () => {
  console.log(
    "\x1b[32m\x1b[1m--------------------------------------------------------"
  );
  console.log(
    "|            \x1b[37mWelcome to Staff Examiner!                \x1b[32m|"
  );
  console.log("|                                                      |");
  console.log(
    "|            \x1b[37mPlease follow the prompts. \x1b[32m               |"
  );
  console.log(
    "--------------------------------------------------------\x1b[37m"
  );
  console.log("\n");

  mainMenu();
};

/**
 *  Main menu for choices.
 */
const mainMenu = () => {
  inquirer
    .prompt({
      type: "list",
      name: "menuChoice",
      message: "Please pick from the following menu.",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "Update an employee manager",
        "View employees by manager",
        "View employees by department",
        "Delete department",
        "Delete role",
        "Delete employee",
        "View total budget by department",
        new inquirer.Separator("\x1b[92m-----------------------\x1b[0m"),
        "Quit",
        new inquirer.Separator("\x1b[92m-----------------------\x1b[0m"),
      ],
      default: "View all departments",
    })
    .then((menuAnswer) => {
      // switch to the function the user chose
      switch (menuAnswer.menuChoice) {
        case "View all departments":
          viewAllDepartments();
          break;

        case "View all roles":
          viewAllRoles();
          break;

        case "View all employees":
          viewAllEmployees();
          break;

        case "Add a department":
          addADepartment();
          break;

        case "Add a role":
          addARole();
          break;

        case "Add an employee":
          addAnEmployee();
          break;

        case "Update an employee role":
          updateAnEmployeeRole();
          break;
        //  BONUS FUNCTIONS Below
        case "Update an employee manager":
          updateAnEmployeeManager();
          break;

        case "View employees by manager":
          viewEmployeesByManager();
          break;

        case "View employees by department":
          viewEmployeesByDepartment();
          break;

        case "Delete department":
          deleteDepartment();
          break;

        case "Delete role":
          deleteRole();
          break;

        case "Delete employee":
          deleteEmployee();
          break;

        case "View total budget by department":
          viewTotalBudgetByDepartment();
          break;
        //-----------------------------------------------------------
        case "Quit": // Quit
          console.log("Thank you for using Staff Examiner!");
          db.end();
          break;
      }
    });
};
/**
 * View all departments
 */
const viewAllDepartments = () => {
  const sql = `SELECT * FROM staff.department
                ORDER BY name ASC`;

  db.promise()
    .query(sql)
    .then(([rows]) => {
      console.log("\x1b[92m-----------------------\x1b[0m");
      console.log("All Departments");
      console.log("\x1b[92m-----------------------\x1b[0m");
      console.table(rows);
      console.log("\x1b[92m-----------------------\x1b[0m");
      mainMenu();
    })
    .catch((err) => {
      console.log(err);
    });
};

/**
 * View all possible work roles.
 */

const viewAllRoles = () => {
  const sql = `SELECT role.id,
                       role.title,
                       department.name AS department, 
                       role.salary
                       FROM role
                       LEFT JOIN department ON role.department_id = department.id; 
                        `;

  db.promise()
    .query(sql)
    .then(([rows]) => {
      console.log("\x1b[92m-----------------------\x1b[0m");
      console.log("All Roles");
      console.log("\x1b[92m-----------------------\x1b[0m");
      console.table(rows);
      console.log("\x1b[92m-----------------------\x1b[0m");
      mainMenu();
    })
    .catch((err) => {
      console.log(err);
    });
};

/**
 *  View all employees
 */
const viewAllEmployees = () => {
  // INNER JOIN when both tables have all rows
  // LEFT join employees and managers because not all employees have managers
  const sql = `SELECT employee.id,
                        employee.first_name AS first,
                        employee.last_name AS last,
                        role.title,
                        department.name AS department,
                        role.salary,
                        CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee 
                        LEFT JOIN role ON employee.role_id = role.id
                        LEFT JOIN department ON role.department_id = department.id
                        LEFT JOIN employee manager ON employee.manager_id = manager.id
                        ORDER BY employee.id;`;

  db.promise()
    .query(sql)
    .then(([rows]) => {
      console.log("\x1b[92m-----------------------\x1b[0m");
      console.log("All Employees");
      console.log("\x1b[92m-----------------------\x1b[0m");
      console.table(rows);
      console.log("\x1b[92m-----------------------\x1b[0m");
      mainMenu();
    })
    .catch((err) => {
      console.log(err);
    });
};
/**
 * Add a department
 */
const addADepartment = () => {
  inquirer
    .prompt({
      type: "input",
      name: "deptName",
      message: "What is the name of the department you want to add?",
      validate: (deptName) => {
        if (deptName) {
          
          return true;
        } else {
          console.log("Please enter a department name.");
          return false;
        }
      },
    })
    .then((deptName) => {
      const sql = `INSERT INTO department (name) VALUES (?)`;
      const params = [deptName.deptName];
      db.promise()
        .query(sql, params)
        .then(([rows]) => {
          console.log("\x1b[92m-----------------------\x1b[0m");
          console.log("Added a new department.");
          console.log("\x1b[92m-----------------------\x1b[0m");
     
          mainMenu();
        })
        .catch((err) => {
          console.log(err);
        });
    });
};

/**
 * Add a new role
 */
const addARole = () => {
  const sql = `SELECT * FROM department
                ORDER BY name ASC`;
  db.promise()
    .query(sql)
    .then(([rows]) => {
      const tmpDepartments = rows;
      deptChoices = tmpDepartments.map(({ id, name }) => ({
        name: name,
        value: id,
      }));

      inquirer
        .prompt([
          {
            type: "input",
            name: "roleTitle",
            message: "What is the name of the role you want to add?",
            validate: (roleTitle) => {
              if (roleTitle) {
                return true;
              } else {
                console.log("Please enter a role name.");
                return false;
              }
            },
          },
          {
            type: "input",
            name: "roleSalary",
            message: "What is the salary of the role you want to add?",
            validate: (roleSalary) => {
              if (roleSalary) {
                return true;
              } else {
                console.log("Please enter a salary for the role.");
                return false;
              }
            },
          },
          {
            type: "list",
            name: "roleDeptID",
            message: "Which department does the role belong to?",
            choices: deptChoices,
          },
        ])
        .then((answers) => {
          const sql = `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`;
          const params = [
            answers.roleTitle,
            answers.roleSalary,
            answers.roleDeptID,
          ];
          db.promise()
            .query(sql, params)
            .then(([rows]) => {
              console.log("\x1b[92m-----------------------\x1b[0m");
              console.log("Added a new role.");
              console.log("\x1b[92m-----------------------\x1b[0m");
          
              mainMenu();
            })
            .catch((err) => {
              console.log(err);
            });
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
/**
 * Add a new employee
 */
const addAnEmployee = () => {
  const sql = `SELECT * FROM role`;
  db.promise()
    .query(sql)
    .then(([rows]) => {
      // Array of objects should contain objects with 2 key's name and value
      // Where name is what is displayed and value is what is selected
      let roleChoices = rows.map(({ id, title, salary, department_id }) => ({
        name: title,
        value: id,
      }));
    
      const sql2 = `SELECT * FROM employee WHERE manager_id IS NULL`;

      db.promise()
        .query(sql2)
        .then(([rows2]) => {
          let employeeChoices = rows2.map(
            ({ id, first_name, last_name, role_id, manager_id }) => ({
              name: first_name + " " + last_name,
              value: id,
            })
          );

          // Make None an option for manager, so they can be a manager
          employeeChoices.push("None");
       
          inquirer
            .prompt([
              {
                type: "input",
                name: "employeeFName",
                message: "What is the employee's first name?",
                validate: (employeeFName) => {
                  if (employeeFName) {
                    return true;
                  } else {
                    console.log("Please enter the first name of the employee.");
                    return false;
                  }
                },
              },
              {
                type: "input",
                name: "employeeLName",
                message: "What is the employee's last name?",
                validate: (employeeLName) => {
                  if (employeeLName) {
                    return true;
                  } else {
                    console.log("Please enter the last name of the employee.");
                    return false;
                  }
                },
              },
              {
                type: "list",
                name: "roleDeptID",
                message: "Select the department of the role you want to add.",
                choices: roleChoices,
              },
              {
                type: "list",
                name: "employeeManagerID",
                message: "Select the manager of the employee.",
                choices: employeeChoices,
              },
            ])
            .then((answers) => {
              // If person selected "none" set manager to null...so they become a manager
              if (answers.employeeManagerID === "None") {
                answers.employeeManagerID = null;
              }

              const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
              const params = [
                answers.employeeFName,
                answers.employeeLName,
                answers.roleDeptID,
                answers.employeeManagerID,
              ];
              db.promise()
                .query(sql, params)
                .then(([rows]) => {
                  console.log("\x1b[92m-----------------------\x1b[0m");
                  console.log("Added the new employee");
                  console.log("\x1b[92m-----------------------\x1b[0m");
             
                  mainMenu();
                })
                .catch((err) => {
                  console.log(err);
                });
            }); //end of then
        }) // end of second promise
        .catch((err) => {
          console.log(err);
        });
    }); //end of first promise
};
/**
 * Update an employee role
 */
const updateAnEmployeeRole = () => {
  const sql = `SELECT * FROM employee`;
  db.promise()
    .query(sql)
    .then(([rows]) => {
      let employeeChoices = rows.map(
        ({ id, first_name, last_name, role_id, manager_id }) => ({
          name: first_name + " " + last_name,
          value: id,
        })
      );

      const sql2 = `SELECT * FROM role`;
      db.promise()
        .query(sql2)
        .then(([rows2]) => {
          // Array of objects should contain objects with 2 key's name and value
          // Where name is what is displayed and value is what is selected
          let roleChoices = rows2.map(
            ({ id, title, salary, department_id }) => ({
              name: title,
              value: id,
            })
          );

          inquirer
            .prompt([
              {
                type: "list",
                name: "employeeID",
                message: "Which employee's role do you want to update?",
                choices: employeeChoices,
              },
              {
                type: "list",
                name: "roleDeptID",
                message:
                  "which role do you want to assign the selected employee to?",
                choices: roleChoices,
              },
            ])
            .then((answers) => {
              const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
              const params = [answers.roleDeptID, answers.employeeID];
              db.promise()
                .query(sql, params)
                .then(([rows]) => {
                  console.log("\x1b[92m-----------------------\x1b[0m");
                  console.log("Updated the employee role.");
                  console.log("\x1b[92m-----------------------\x1b[0m");
               
                  mainMenu();
                })
                .catch((err) => {
                  console.log(err);
                });
            }); //end of then
        }) // end of second promise
        .catch((err) => {
          console.log(err);
        });
    }); //end of first promise
};
/**
 * Update an employee's manager
 */
const updateAnEmployeeManager = () => {
  const sql = `SELECT * FROM employee`;
  db.promise()
    .query(sql)
    .then(([rows]) => {
      let employeeChoices = rows.map(
        ({ id, first_name, last_name, role_id, manager_id }) => ({
          name: first_name + " " + last_name,
          value: id,
        })
      );

      const sql2 = `SELECT * FROM employee WHERE manager_id IS NULL`;

      db.promise()
        .query(sql2)
        .then(([rows2]) => {
          // Array of objects should contain objects with 2 key's name and value
          // Where name is what is displayed and value is what is selected
          let managerChoices = rows2.map(
            ({ id, first_name, last_name, role_id }) => ({
              name: first_name + " " + last_name,
              value: id,
            })
          );
          // Make None an option for manager, so they can be a manager
            managerChoices.push("None");

          inquirer
            .prompt([
              {
                type: "list",
                name: "employeeID",
                message: "Which employee do you want to update?",
                choices: employeeChoices,
              },
              {
                type: "list",
                name: "managerID",
                message:
                  "Which manager do you want to assign the selected employee to?",
                choices: managerChoices,
              },
            ])

            .then((answers) => {
                 // If person selected "none" set manager to null...so they become a manager
              if (answers.managerID === "None") {
                answers.managerID = null;
              }
              
              const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;
              const params = [answers.managerID, answers.employeeID];
              db.promise()
                .query(sql, params)
                .then(([rows]) => {
                  console.log("\x1b[92m-----------------------\x1b[0m");
                  console.log("Employee assigned to the new manager.");
                  console.log("\x1b[92m-----------------------\x1b[0m");
              
                  mainMenu();
                })
                .catch((err) => {
                  console.log(err);
                });
            }); //end of then
        }) // end of second promise
        .catch((err) => {
          console.log(err);
        });
    }); //end of first promise
};

/**
 * View employees by their manager
 */
const viewEmployeesByManager = () => {
   

      const sql2 = `SELECT * FROM employee WHERE manager_id IS NULL`;

      db.promise()
        .query(sql2)
        .then(([rows2]) => {
          // Array of objects should contain objects with 2 key's name and value
          // Where name is what is displayed and value is what is selected
          let managerChoices = rows2.map(
            ({ id, first_name, last_name, role_id }) => ({
              name: first_name + " " + last_name,
              value: id,
            })
          );

          inquirer
            .prompt([
              {
                type: "list",
                name: "managerID",
                message: "Which manager's employees do you want to see?",
                choices: managerChoices,
              },
            ])

            .then((answers) => {
              const sql = `SELECT first_name AS First, last_name AS Last FROM employee WHERE manager_id = ?`;

              const params = [answers.managerID];
              db.promise()
                .query(sql, params)
                .then(([rows]) => {
                  if (rows.length === 0) {
                    console.log("\x1b[92m-----------------------\x1b[0m");
                    console.log("View by manager");
                    console.log("\x1b[92m-----------------------\x1b[0m");
                    console.log(
                      "No employees report to this manager right now."
                    );
                    console.log("\x1b[92m-----------------------\x1b[0m");
                    mainMenu();
                  } else {
                    console.log("\x1b[92m-----------------------\x1b[0m");
                    console.log("View by manager");
                    console.log("\x1b[92m-----------------------\x1b[0m");
                    console.table(rows);
                    console.log("\x1b[92m-----------------------\x1b[0m");
                    mainMenu();
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }); //end of then
        }) // end of second promise
        .catch((err) => {
          console.log(err);
        });
};
const viewEmployeesByDepartment = () => {
  const sql = `SELECT * from department`;

  db.promise()
    .query(sql)
    .then(([rows]) => {
      let departmentChoices = rows.map(({ id, name }) => ({
        name: name,
        value: id,
      }));

      inquirer
        .prompt([
          {
            type: "list",
            name: "departmentID",
            message: "which department's employees do you want to see?",
            choices: departmentChoices,
          },
        ])

        .then((answers) => {
          console.log("department choice: ", answers);

          const sql = `SELECT employee.id,
                employee.first_name,
                employee.last_name,
                department.name AS department
                FROM employee 
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id 
                WHERE role.department_id  = ?;`;

          const params = [answers.departmentID];
          console.log(answers);
          db.promise()
            .query(sql, params)
            .then(([rows]) => {
           
              if (rows.length === 0) {
                console.log("\x1b[92m-----------------------\x1b[0m");
                console.log("View by department");
                console.log("\x1b[92m-----------------------\x1b[0m");
                console.log("No employees are in this department right now.");
                console.log("\x1b[92m-----------------------\x1b[0m");
                mainMenu();
              } else {
                console.log("\x1b[92m-----------------------\x1b[0m");
                console.log("View by by department");
                console.log("\x1b[92m-----------------------\x1b[0m");
                console.table(rows);
                console.log("\x1b[92m-----------------------\x1b[0m");
                mainMenu();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }) //end of then
        .catch((err) => {
          console.log(err);
        });
    }); //end of first promise
};
const deleteDepartment = () => {
  const sql = `SELECT * from department`;

  db.promise()
    .query(sql)
    .then(([rows]) => {
      let departmentChoices = rows.map(({ id, name }) => ({
        name: name,
        value: id,
      }));

      inquirer
        .prompt([
          {
            type: "list",
            name: "departmentID",
            message: "which department do you want to delete?",
            choices: departmentChoices,
          },
        ])
        .then((answers) => {
      
          const sql = `DELETE FROM department 
                         WHERE id  = ?;`;

          const params = [answers.departmentID];
        
          db.promise()
            .query(sql, params)
            .then(([rows]) => {
              
                console.log("\x1b[92m-----------------------\x1b[0m");
                console.log("Department deleted successfully.");
                console.log("\x1b[92m-----------------------\x1b[0m");
        
                mainMenu();
            
            })
            .catch((err) => {
              console.log(err);
            });
        }) //end of then
        .catch((err) => {
          console.log(err);
        });
    }); //end of first promise
};
const deleteRole = () => {
  const sql = `SELECT * from role`;

  db.promise()
    .query(sql)
    .then(([rows]) => {
      let roleChoices = rows.map(({ id, title }) => ({
        name: title,
        value: id,
      }));

      inquirer
        .prompt([
          {
            type: "list",
            name: "roleID",
            message: "Which role do you want to delete?",
            choices: roleChoices,
          },
        ])
        .then((answers) => {
         // console.log("role choice: ", answers);

          const sql = `DELETE FROM role 
                         WHERE id  = ?;`;

          const params = [answers.roleID];
         // console.log(answers);
          db.promise()
            .query(sql, params)
            .then(([rows]) => {
        
                console.log("\x1b[92m-----------------------\x1b[0m");
                console.log("Role deleted successfully.");
                console.log("\x1b[92m-----------------------\x1b[0m");
          
                mainMenu();
            })
            .catch((err) => {
              console.log(err);
            });
        }) //end of then
        .catch((err) => {
          console.log(err);
        });
    }); //end of first promise
};
const deleteEmployee = () => {
  const sql = `SELECT * from employee`;
  db.promise()
    .query(sql)
    .then(([rows]) => {
      let employeeChoices = rows.map(
        ({ id, first_name, last_name, role_id, manager_id }) => ({
          name: first_name + " " + last_name,
          value: id,
        })
      );

      inquirer
        .prompt([
          {
            type: "list",
            name: "employeeID",
            message: "Which employee do you want to delete?",
            choices: employeeChoices,
          },
        ])
        .then((answers) => {
       
          const sql = `DELETE FROM employee 
                         WHERE id  = ?;`;

          const params = [answers.employeeID];

          db.promise()
            .query(sql, params)
            .then(([rows]) => {
            
                console.log("\x1b[92m-----------------------\x1b[0m");
                console.log("Employee deleted successfully.");
                console.log("\x1b[92m-----------------------\x1b[0m");
         
                mainMenu();
            })
            .catch((err) => {
              console.log(err);
            });
        }) //end of then
        .catch((err) => {
          console.log(err);
        });
    }); //end of first promise
};
const viewTotalBudgetByDepartment = () => {
  const sql = `SELECT * from department`;

  db.promise()
    .query(sql)
    .then(([rows]) => {
      let departmentChoices = rows.map(({ id, name }) => ({
        name: name,
        value: id,
      }));

      inquirer
        .prompt([
          {
            type: "list",
            name: "departmentID",
            message: "Which department do you want to see the budget of?",
            choices: departmentChoices,
          },
        ])
        .then((answers) => {
   
          const sql = ` SELECT 
                            department.name,
                            SUM(salary) as budget
                            FROM role
                            LEFT JOIN department ON role.department_id = department.id
                            WHERE department_id = ?
                            GROUP BY department_id;
                            `;

          const params = [answers.departmentID];
   
          db.promise()
            .query(sql, params)
            .then(([rows]) => {
        
              if (rows.length === 0) {
                
                console.log("\x1b[92m-----------------------\x1b[0m");
                console.log("No employees are in this department right now so the budget is 0.");
                console.log("\x1b[92m-----------------------\x1b[0m");
                mainMenu();
              } else {
                console.log("\x1b[92m-----------------------\x1b[0m");
                console.log("Department Budget.");
                console.log("\x1b[92m-----------------------\x1b[0m");
                console.table(rows);
                console.log("\x1b[92m-----------------------\x1b[0m");
                mainMenu();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }) //end of then
        .catch((err) => {
          console.log(err);
        });
    }); //end of first promise
};

init();
