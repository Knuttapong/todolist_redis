const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var redis = require("redis"),
    client = redis.createClient();
client.on("error", function (err) {
    console.log("Error " + err);
});

const sha256 = require('js-sha256');

function mainMenu(){
  console.log('\033[2J'); 
  console.log('===== Todo List Main Menu =====\n');
  console.log('1: View your list');
  console.log('2: Add task to your list');
  console.log('3: Remove done task from your list');
  console.log('4: Exit\n');

  rl.question('Enter your mode: ', (answer) => {

    var mode = `${answer}`;

    if(mode == 4){
      rl.close();
      client.quit();
      process.exit();
    }
    else if(mode != 1 && mode != 2 && mode != 3){
      mainMenu();
    }

    todoActivitise(mode);
  });

}

function viewTask(){
    var task;
    var index = 0;
    var todoList = [];
    client.hgetall( "todo",  function(err, result){
      console.log('\033[2J');
      console.log('===== Your Todo List =====\n');
      for(var hash in result) {
          todoList[index] = [hash, result[hash]];
          console.log((index+1) + ": " + todoList[index][1]);
          index++;
      }
    rl.question('\nPress Enter to continue...', (input) => {
        if(`${input}` == ''){
          mainMenu();
        }
        else{
          viewTask();
        }
              
      });
  })
  
}

function addTask(){
  var task;
  var index = 0;
  var todoList = [];
  client.hgetall( "todo",  function(err, result){
    console.log('\033[2J');
    console.log('===== Your Todo List =====\n');
    for(var hash in result) {
        todoList[index] = [hash, result[hash]];
        console.log((index+1) + ": " + todoList[index][1]);
        index++;
    }
    rl.question('\nEnter your task (blank if you done): ', (task) => {
        task = `${task}`;    
        if(task != ''){
          task_hashed = sha256(task+Date.now());
          client.hset("todo", task_hashed, task);
          addTask();
        }
        else{
          mainMenu();
        }          
      });
  })

  
}

function deleteTask(){
  var task;
  var index = 0;
  var todoList = [];
  client.hgetall( "todo",  function(err, result){
    console.log('\033[2J');
    console.log('===== Your Todo List =====\n');
    for(var hash in result) {
        todoList[index] = [hash, result[hash]];
        console.log((index+1) + ": " + todoList[index][1]);
        index++;
    }
    rl.question('\nEnter index of the task that you completed (blank if you done): ', (index) => {
        if(index != ''){
          index = `${index}` - 1;  
          if(index >= 0 && index < todoList.length){
            client.hdel('todo', todoList[index][0], function(err, response) {
                
             })
          }
          deleteTask();
        }
        else{
          mainMenu();
        }          
      });
  })
  
} 

function todoActivitise(mode){
  if(mode == 1){
    viewTask();    
  }
  else if(mode == 2){  
    addTask();
    
  }
  else if(mode == 3){
    deleteTask();
  }
}

//start main menu
mainMenu();




