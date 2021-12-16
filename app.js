const db = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');
//const mysql = require('mysql2');

//inquirer = new inquirer.ui.BottomBar();







const init = () => {

   
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
            
                default: // Quit
                console.log("Thank you for using Staff Examiner!");
                db.end();
                    break;
            }

        })
}

const viewAllDepartments = () => {
    console.log("Inside viewAllDepartments");


    const sql = `SELECT * FROM staff.departments`;

    db.query(sql, (err, rows) => {
        if(err) {
            console.log(err);
        }
        console.log("\n");
        console.table(rows);
    });
    mainMenu();

}

const viewAllRoles = () => {
    console.log("Inside viewAllRoles");
    mainMenu();

}

const viewAllEmployees = () => {
    console.log("Inside viewAllEmployees");
    mainMenu();

}

const addADepartment = () => {
    console.log("Inside addADepartment");
    mainMenu();

}

const addARole = () => {
    console.log("Inside addARole");
    mainMenu();

}

const addAnEmployee = () => {
    console.log("Inside addAnEmployee");

    mainMenu();

}

const updateAnEmployeeRole = () => {
    console.log("Inside updateAnEmployeeRole");

    mainMenu();

}






init();