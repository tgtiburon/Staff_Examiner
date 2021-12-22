const db = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');
//const mysql = require('mysql2');

//inquirer = new inquirer.ui.BottomBar();







const init = () => {
    // I don't think I need this since we are not running a server

    db.connect(function(err) {
        if (err) {
            console.log(err);
            
        } else {
            console.log('Connected');
        }
    })

   
        // db.query("SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;", 
        // function(err,res) {
        //     if(err) throw err;
        //     console.table(res);
        // })
        console.log('\x1b[32m\x1b[1m--------------------------------------------------------');
        console.log("|            \x1b[37mWelcome to Staff Examiner!                \x1b[32m|");
        console.log("|                                                      |");
        console.log("|            \x1b[37mPlease follow the prompts. \x1b[32m               |"); 
        console.log("--------------------------------------------------------\x1b[37m");
        console.log("\n");
        
        // I don't think I need this

      

        mainMenu();
       
}

const mainMenu = () => {
    inquirer    
        .prompt(
            {
                type:"list",
                name:"menuChoice",
                message: "Please pick from the following menu.",
                choices: ["View all departments", "View all roles", "View all employees", 
                            "Add a department", "Add a role", "Add an employee", 
                        "Update an employee role", new inquirer.Separator('\x1b[92m-----------------------\x1b[0m'), "Quit",
                        new inquirer.Separator('\x1b[92m-----------------------\x1b[0m')],
                default: "View all departments"
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
            
                case "Quit": // Quit
                console.log("Thank you for using Staff Examiner!");
                db.end();
                    break;
            }

        })
}

const viewAllDepartments = () => {
   
    const sql = `SELECT * FROM staff.department`;

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
   // const sql = `SELECT * FROM staff.role`;
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
                        department.name,
                        role.salary,
                        CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee 
                        INNER JOIN role ON employee.role_id = role.id
                        INNER JOIN department ON role.department_id = department.id
                        LEFT JOIN employee manager ON employee.manager_id = manager.id;`;
  

  
    
    let q = db.query(sql, function(err,results) {
        console.log(results);
    });
    console.log(q.sql);

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
          message: "What is the name of the department you want to add?",
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
       console.log("New dept name = ", deptName);
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
 

}// 

const addARole = () => {


    const sql = `SELECT * FROM department`;
    db.promise().query(sql)
        .then(( [ rows ]) => {
          
           const tmpDepartments = rows;
           console.table(tmpDepartments);
           deptChoices = tmpDepartments.map(({id, name})=> ({
              
              name: name,  value: id
           }))

           console.log(deptChoices);
          
           console.log("in db.promise");
        

           inquirer.prompt([
            {
               type: "input",
               name: "roleTitle",
               message: "What is the title of the role you want to add?",
               validate: roleTitle => {
                   if(roleTitle){
                       console.log("Role received.");
                       return true;
                   }else {
                       console.log("Please enter a role  title.");
                       return false;
                   }
               }
            },
            {
                type: "input",
                name: "roleSalary",
                message: "What is the salary of the role you want to add?",
                validate: roleSalary => {
                    if(roleSalary){
                        console.log("Role received.");
                        return true;
                    }else {
                        console.log("Please enter a department name.");
                        return false;
                    }
                }   
            },
            { 
                 type: "list",
                 name: "roleDeptID",
                 message: "What is the department id of the role you want to add?",
                 choices : deptChoices
            }   
            
     
        ])
        .then(answers => {
            console.log("New role: ", answers);
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
    const sql = `SELECT * FROM department`;
    db.promise().query(sql)
        .then(( [ rows ]) => {
         
           const tmpDepartments = rows;
          // console.table(tmpDepartments);
           deptChoices = tmpDepartments.map(({id, name})=> ({
              
              name: name,  value: id
           }))

           console.log(deptChoices);
          
           console.log("in db.promise");
           
            inquirer.prompt([
                {
                type: "input",
                name: "employeeFName",
                message: "What is the first name of the employee?",
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
                    message: "What is the last name of the employee?",
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
                        choices : deptChoices
                      
                },
                {// TODO: ADD view of managers
                    type: "input",
                    name: "employeeManagerID",
                    message: "What is the manager id of the employee?",
                    validate: employeeManagerID => {
                        if(employeeManagerID){
                        
                            return true;
                        }else {
                            console.log("Please enter the manager id of the employee? ");
                            return false;
                        }
                    }   
                }
    
            ])
        })
    .then(answers => {
        console.log("New employee: ", answers);
        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
         const params = [answers.employeeFName, answers.employeeLName, answers.employeeRoleID, answers.employeeManagerID];
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
   

}

const updateAnEmployeeRole = () => {

    
   


}






init();