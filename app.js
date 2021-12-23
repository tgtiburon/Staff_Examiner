const db = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');


const init = () => {
    // I don't think I need this since we are not running a server

    db.connect(function(err) {
        if (err) {
            console.log(err);
            
        } else {
            console.log('Connected');
        }
    })

        console.log('\x1b[32m\x1b[1m--------------------------------------------------------');
        console.log("|            \x1b[37mWelcome to Staff Examiner!                \x1b[32m|");
        console.log("|                                                      |");
        console.log("|            \x1b[37mPlease follow the prompts. \x1b[32m               |"); 
        console.log("--------------------------------------------------------\x1b[37m");
        console.log("\n");
        
        mainMenu();
       
}
// TODO:   FILL OUT MORE MENU OPTIONS FOR BONUS POINTS
const mainMenu = () => {
    inquirer    
        .prompt(
            {
                type:"list",
                name:"menuChoice",
                message: "Please pick from the following menu.",
                choices: ["View all departments", "View all roles", "View all employees", 
                            "Add a department", "Add a role", "Add an employee", 
                        "Update an employee role","Update an employee manager", "View employees by manager",
                        "View employees by department", "Delete department", "Delete role", "Delete employee", 
                        "View total budget by department", 
                        new inquirer.Separator('\x1b[92m-----------------------\x1b[0m'), "Quit",
                        new inquirer.Separator('\x1b[92m-----------------------\x1b[0m')],
                default: "Update an employee manager"
            }
           
        )
        .then(menuAnswer => {
           
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
            // TODO: BONUS FUNCTIONS
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
                
            
                case "Quit": // Quit
                console.log("Thank you for using Staff Examiner!");
                db.end();
                    break;
            }

        })
}

const viewAllDepartments = () => {
   
    const sql = `SELECT * FROM staff.department
                ORDER BY name ASC`;

    db.promise().query(sql)
        .then(([ rows ])=> {
            console.log('\x1b[92m-----------------------\x1b[0m');
            console.log('All Departments')
            console.log('\n');
            console.table(rows);
            console.log('\x1b[92m-----------------------\x1b[0m');
            mainMenu();
        })
        .catch(err => {
            console.log(err);
        });

};

const viewAllRoles = () => {

   const sql = `SELECT role.id,
                       role.title,
                       department.name AS department, 
                       role.salary
                       FROM role
                       LEFT JOIN department ON role.department_id = department.id; 
                        `

    db.promise().query(sql)
        .then(([ rows ])=> {
            console.log('\x1b[92m-----------------------\x1b[0m');
            console.log('All Roles')
            console.log('\n');
            console.table(rows);
            console.log('\x1b[92m-----------------------\x1b[0m');
            mainMenu();
        })
        .catch(err => {
            console.log(err);
        });

}

const viewAllEmployees = () => {

    // INNER JOIN when both tables have all rows
    // LEFT join employees and managers because not all employees have managers
    const sql = `SELECT employee.id,
                        employee.first_name,
                        employee.last_name,
                        role.title,
                        department.name AS department,
                        role.salary,
                        CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee 
                        INNER JOIN role ON employee.role_id = role.id
                        INNER JOIN department ON role.department_id = department.id
                        LEFT JOIN employee manager ON employee.manager_id = manager.id
                        ORDER BY employee.id;`;

  
    
    // let q = db.query(sql, function(err,results) {
    //    // console.log(results);
    // });
    db.promise().query(sql)
        .then(([ rows ])=> {
            console.log('\x1b[92m-----------------------\x1b[0m');
            console.log('All Employees')
            console.log('\n');
            console.table(rows);
            console.log('\x1b[92m-----------------------\x1b[0m');
            mainMenu();
        })
        .catch(err => {
            console.log(err);
        });

}

const addADepartment = () => {

   inquirer.prompt(
       {
          type: "input",
          name: "deptName",
          message: "What is the name of the department?",
          validate: deptName => {
              if(deptName){
                  console.log("Name received.");
                  return true;
              }else {
                  console.log("Please enter a department name.");
                  return false;
              }
          }
       }

   )
   .then(deptName => {
     
       const sql = `INSERT INTO department (name) VALUES (?)`;
        const params = [deptName.deptName];
        db.promise().query(sql,params)
        .then(([ rows ])=> {
            console.log('\x1b[92m-----------------------\x1b[0m');
            console.log('Add a Department')
            console.log('\n');
            console.table(rows);
            console.log('\x1b[92m-----------------------\x1b[0m');
            mainMenu();
        })
        .catch(err => {
            console.log(err);
        });
   });

}

const addARole = () => {


    const sql = `SELECT * FROM department
                ORDER BY name ASC`;
    db.promise().query(sql)
        .then(( [ rows ]) => {
          
           const tmpDepartments = rows;
        
           deptChoices = tmpDepartments.map(({id, name})=> ({
              
              name: name,  value: id
           }))

           inquirer.prompt([
            {
               type: "input",
               name: "roleTitle",
               message: "What is the name of the role?",
               validate: roleTitle => {
                   if(roleTitle){
            
                       return true;
                   }else {
                       console.log("Please enter a role name.");
                       return false;
                   }
               }
            },
            {
                type: "input",
                name: "roleSalary",
                message: "What is the salary of the role?",
                validate: roleSalary => {
                    if(roleSalary){
                       // console.log("Role received.");
                        return true;
                    }else {
                        console.log("Please enter a salary for the role.");
                        return false;
                    }
                }   
            },
            { 
                 type: "list",
                 name: "roleDeptID",
                 message: "Which department does the role belong to?",
                 choices : deptChoices
            }   
            
     
        ])
        .then(answers => {
           // console.log("New role: ", answers);
            const sql = `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`;
             const params = [answers.roleTitle, answers.roleSalary, answers.roleDeptID];
             db.promise().query(sql,params)
             .then(([ rows ])=> {
                 console.log('\x1b[92m-----------------------\x1b[0m');
                 console.log('Add a Role')
                 console.log('\n');
                 console.table(rows);
                 console.log('\x1b[92m-----------------------\x1b[0m');
                 mainMenu();
             })
             .catch(err => {
                 console.log(err);
             });
    
        });


    })
    .catch(err=> {
            console.log(err);
    }); 
}

const addAnEmployee = () => {


        const sql = `SELECT * FROM role`;
        db.promise().query(sql)
            .then(( [ rows ]) => {
               
            // Array of objects should contain objects with 2 key's name and value
            // Where name is what is displayed and value is what is selected
            let roleChoices = rows.map(({id, title, salary, department_id })=> ({
                name: title ,
                value: id
            }));
            console.log(roleChoices);

            const sql2 = `SELECT * FROM employee`
            db.promise().query(sql2)
                .then(([ rows2]) => {

                    let employeeChoices = rows2.map(({id, first_name, last_name, role_id, manager_id })=> ({
                        name: first_name + " " + last_name,
                        value: id
                    }));

                inquirer.prompt([
                    {
                        type: "input",
                        name: "employeeFName",
                        message: "What is the employee's first name?",
                        validate: employeeFName => {
                            if(employeeFName){
                                
                                return true;
                            }else {
                                console.log("Please enter the first name of the employee.");
                                return false;
                            }
                        }
                    },
                    {
                        type: "input",
                        name: "employeeLName",
                        message: "What is the employee's last name?",
                        validate: employeeLName => {
                            if(employeeLName){
                            
                                return true;
                            }else {
                                console.log("Please enter the last name of the employee.");
                                return false;
                            }
                        }   
                    },
                    {
                        
                            type: "list",
                            name: "roleDeptID",
                            message: "What is the department id of the role you want to add?",
                            choices : roleChoices
                        
                    },
                    {
                        type: "list",
                        name: "employeeManagerID",
                        message: "What is the manager id of the employee?",
                        choices: employeeChoices
                    }
        
                ])

            .then(answers => {
               // console.log("New employee: ", answers);
                const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
                const params = [answers.employeeFName, answers.employeeLName, answers.roleDeptID, answers.employeeManagerID];
                db.promise().query(sql,params)
                .then(([ rows ])=> {
                    console.log('\x1b[92m-----------------------\x1b[0m');
                    console.log('Add a Role')
                    console.log('\n');
                    console.table(rows);
                    console.log('\x1b[92m-----------------------\x1b[0m');
                    mainMenu();
                })
                .catch(err => {
                    console.log(err);
                });

            })//end of then
        })// end of second promise
            .catch(err => {
                console.log(err);
            });
            
        })//end of first promise
}

const updateAnEmployeeRole = () => {
  
    const sql = `SELECT * FROM employee`;
    db.promise().query(sql)
        .then(( [ rows ]) => {
            let employeeChoices = rows.map(({id, first_name, last_name, role_id, manager_id })=> ({
                name: first_name + " " + last_name,
                value: id
            }));

            console.log("Below is employeeChoices:");
            console.log(employeeChoices);
            

        const sql2 = `SELECT * FROM role`
        db.promise().query(sql2)
            .then(([ rows2]) => {

          
        // Array of objects should contain objects with 2 key's name and value
        // Where name is what is displayed and value is what is selected
        let roleChoices = rows2.map(({id, title, salary, department_id })=> ({
            name: title ,
            value: id
        }));
        console.log("Below is roleChoices:");
        console.log(roleChoices);
      
            inquirer.prompt([
                {
                    type: "list",
                    name: "employeeID",
                    message: "Which employee's role do you want to update?",
                    choices: employeeChoices
                    
                },
                {
                    type: "list",
                    name: "roleDeptID",
                    message: "which role do you want to assign the selected employee to?",
                    choices : roleChoices
                   
                },
             
            ])

        .then(answers => {
        
            console.log("answers below:")
            console.log(answers);
       
            const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
            const params = [answers.roleDeptID, answers.employeeID];
            db.promise().query(sql,params)
            .then(([ rows ])=> {
                console.log('\x1b[92m-----------------------\x1b[0m');
                console.log('Add a Role')
                console.log('\n');
                console.table(rows);
                console.log('\x1b[92m-----------------------\x1b[0m');
                mainMenu();
            })
            .catch(err => {
                console.log(err);
            });

        })//end of then
    })// end of second promise
        .catch(err => {
            console.log(err);
        });
        
    })//end of first promise
}

const updateAnEmployeeManager = () => {
  
    const sql = `SELECT * FROM employee`;
    db.promise().query(sql)
        .then(( [ rows ]) => {
            let employeeChoices = rows.map(({id, first_name, last_name, role_id, manager_id })=> ({
                name: first_name + " " + last_name,
                value: id
            }));

          //  console.log("Below is employeeChoices:");
         //   console.log(employeeChoices);
            

        const sql2 = `SELECT * FROM employee WHERE manager_id IS NULL`;
        //params = [''];
    
        db.promise().query(sql2)
            .then(([ rows2]) => {

          
        // Array of objects should contain objects with 2 key's name and value
        // Where name is what is displayed and value is what is selected
        let managerChoices = rows2.map(({id, first_name, last_name, role_id })=> ({
            name: first_name + " " + last_name ,
            value: id
        }));
       // console.log("Below is managerChoices:");
       // console.log(managerChoices);
      
            inquirer.prompt([
                {
                    type: "list",
                    name: "employeeID",
                    message: "Which employee's manager do you want to update?",
                    choices: employeeChoices
                    
                },
                {
                    type: "list",
                    name: "managerID",
                    message: "which manager do you want to assign the selected employee to?",
                    choices : managerChoices
                   
                },
             
            ])

        .then(answers => {
        
            console.log("answers below:")
            console.log(answers);
       
            const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;
            const params = [answers.managerID, answers.employeeID];
            db.promise().query(sql,params)
            .then(([ rows ])=> {
                console.log('\x1b[92m-----------------------\x1b[0m');
                console.log('Add a Role')
                console.log('\n');
                console.table(rows);
                console.log('\x1b[92m-----------------------\x1b[0m');
                mainMenu();
            })
            .catch(err => {
                console.log(err);
            });

        })//end of then
    })// end of second promise
        .catch(err => {
            console.log(err);
        });
        
    })//end of first promise
}


const viewEmployeesByManager = () => {
    
}
const viewEmployeesByDepartment = () => {
    
}
const deleteDepartment = () => {
    
}
const deleteRole = () => {
    
}
const deleteEmployee = () => {
    
}
const viewTotalBudgetByDepartment = () => {
    
}






init();