//countItem
var answer1 = 0;
document.querySelector(".add-1").addEventListener("click", function(){
  answer1 = answer1 + 1
  if(answer1 < 0) {
    document.querySelector(".todotasks").innerHTML = answer1 = 0;
  } else{
    document.querySelector(".todotasks").innerHTML = answer1;
  };
});
document.querySelector(".subtract-1").addEventListener("click", function(){
  answer1 = answer1 - 1
  if(answer1 > 0) {
    document.querySelector(".todotasks").innerHTML = answer1;
  } else{
    document.querySelector(".todotasks").innerHTML = answer1 = 0;
  };
});

//confetti
(function($) {
	$.confetti = new function() {

	  var canvas;
	  var ctx;
	  var W;
	  var H;
	  var mp = 500; //max particles
	  var particles = [];
	  var angle = 0;
	  var tiltAngle = 0;
	  var confettiActive = true;
	  var animationComplete = true;
	  var deactivationTimerHandler;
	  var reactivationTimerHandler;
	  var animationHandler;

	  // objects

	  var particleColors = {
		  colorOptions: [
			  '#509790',
			  '#ce735a',
			  '#ce081c',
			  '#b299dd',
			  '#2a832e'],
		  colorIndex: 0,
		  colorIncrementer: 0,
		  colorThreshold: 10,
		  getColor: function () {
			  if (this.colorIncrementer >= 10) {
				  this.colorIncrementer = 0;
				  this.colorIndex++;
				  if (this.colorIndex >= this.colorOptions.length) {
					  this.colorIndex = 0;
				  }
			  }
			  this.colorIncrementer++;
			  return this.colorOptions[this.colorIndex];
		  }
	  }

	  function confettiParticle(color) {
		  this.x = Math.random() * W;
		  this.y = (Math.random() * H) - H;
		  this.r = RandomFromTo(10, 30);
		  this.d = (Math.random() * mp) + 10;
		  this.color = color;
		  this.tilt = Math.floor(Math.random() * 10) - 10;
		  this.tiltAngleIncremental = (Math.random() * 0.07) + .05;
		  this.tiltAngle = 0;

		  this.draw = function () {
			  ctx.beginPath();
			  ctx.lineWidth = this.r / 2;
			  ctx.strokeStyle = this.color;
			  ctx.moveTo(this.x + this.tilt + (this.r / 4), this.y);
			  ctx.lineTo(this.x + this.tilt, this.y + this.tilt + (this.r / 4));
			  return ctx.stroke();
		  }
	  }

	  function init() {
		  SetGlobals();
		  InitializeButton();

		  $(window).resize(function () {
			  W = window.innerWidth;
			  H = window.innerHeight;
			  canvas.width = W;
			  canvas.height = H;
		  });

	  }
	  function InitializeButton() {
		  $('#Confetti').click(RestartConfetti);
	  }

	  function SetGlobals() {
		  $('body').append('<canvas id="confettiCanvas" style="position:absolute;top:0;left:0;display:none;z-index:99;pointer-events:none;"></canvas>');
		  canvas = document.getElementById("confettiCanvas");
		  ctx = canvas.getContext("2d");
		  W = window.innerWidth;
		  H = window.innerHeight;
		  canvas.width = W;
		  canvas.height = H;
	  }

	  function InitializeConfetti() {
		  canvas.style.display = 'block';
		  particles = [];
		  animationComplete = false;
		  for (var i = 0; i < mp; i++) {
			  var particleColor = particleColors.getColor();
			  particles.push(new confettiParticle(particleColor));
		  }
		  StartConfetti();
	  }

	  function Draw() {
		  ctx.clearRect(0, 0, W, H);
		  var results = [];
		  for (var i = 0; i < mp; i++) {
			  (function (j) {
				  results.push(particles[j].draw());
			  })(i);
		  }
		  Update();

		  return results;
	  }

	  function RandomFromTo(from, to) {
		  return Math.floor(Math.random() * (to - from + 1) + from);
	  }


	  function Update() {
		  var remainingFlakes = 0;
		  var particle;
		  angle += 0.01;
		  tiltAngle += 0.1;

		  for (var i = 0; i < mp; i++) {
			  particle = particles[i];
			  if (animationComplete) return;

			  if (!confettiActive && particle.y < -15) {
				  particle.y = H + 100;
				  continue;
			  }

			  stepParticle(particle, i);

			  if (particle.y <= H) {
				  remainingFlakes++;
			  }
			  CheckForReposition(particle, i);
		  }

		  if (remainingFlakes === 0) {
			  StopConfetti();
		  }
	  }

	  function CheckForReposition(particle, index) {
		  if ((particle.x > W + 20 || particle.x < -20 || particle.y > H) && confettiActive) {
			  if (index % 5 > 0 || index % 2 == 0)
			  {
				  repositionParticle(particle, Math.random() * W, -10, Math.floor(Math.random() * 10) - 10);
			  } else {
				  if (Math.sin(angle) > 0) {

					  repositionParticle(particle, -5, Math.random() * H, Math.floor(Math.random() * 10) - 10);
				  } else {

					  repositionParticle(particle, W + 5, Math.random() * H, Math.floor(Math.random() * 10) - 10);
				  }
			  }
		  }
	  }
	  function stepParticle(particle, particleIndex) {
		  particle.tiltAngle += particle.tiltAngleIncremental;
		  particle.y += (Math.cos(angle + particle.d) + 3 + particle.r / 2) / 2;
		  particle.x += Math.sin(angle);
		  particle.tilt = (Math.sin(particle.tiltAngle - (particleIndex / 3))) * 15;
	  }

	  function repositionParticle(particle, xCoordinate, yCoordinate, tilt) {
		  particle.x = xCoordinate;
		  particle.y = yCoordinate;
		  particle.tilt = tilt;
	  }

	  function StartConfetti() {
		  W = window.innerWidth;
		  H = window.innerHeight;
		  canvas.width = W;
		  canvas.height = H;
		  (function animloop() {
			  if (animationComplete) return null;
			  animationHandler = requestAnimFrame(animloop);
			  return Draw();
		  })();
	  }

	  function ClearTimers() {
		  clearTimeout(reactivationTimerHandler);
		  clearTimeout(animationHandler);
	  }

	  function DeactivateConfetti() {
		  confettiActive = false;
		  ClearTimers();
	  }

	  function StopConfetti() {
		  animationComplete = true;
		  if (ctx == undefined) return;
		  ctx.clearRect(0, 0, W, H);
		  canvas.style.display = 'none';
	  }

	  function RestartConfetti() {
		  ClearTimers();
		  StopConfetti();
		  reactivationTimerHandler = setTimeout(function () {
			  confettiActive = true;
			  animationComplete = false;
			  InitializeConfetti();
		  }, 100);

	  }

	  window.requestAnimFrame = (function () {
		  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
			  return window.setTimeout(callback, 1000 / 60);
		  };
	  })();

	  this.init = init;
	  this.start = InitializeConfetti;
	  this.stop = DeactivateConfetti;
	  this.restart = RestartConfetti;
	}
	$.confetti.init();
  }(jQuery));
  

  /*text effect*/
  // function([string1, string2],target id,[color1,color2])
 consoleText(['Hey! Welcome🧡', 'Emilys To-Do List', 'Made with Love.'], 'text',['tomato','rebeccapurple','lightblue']);

function consoleText(words, id, colors) {
  if (colors === undefined) colors = ['#fff'];
  var visible = true;
  var con = document.getElementById('console');
  var letterCount = 1;
  var x = 1;
  var waiting = false;
  var target = document.getElementById(id)
  target.setAttribute('style', 'color:' + colors[0])
  window.setInterval(function() {

    if (letterCount === 0 && waiting === false) {
      waiting = true;
      target.innerHTML = words[0].substring(0, letterCount)
      window.setTimeout(function() {
        var usedColor = colors.shift();
        colors.push(usedColor);
        var usedWord = words.shift();
        words.push(usedWord);
        x = 1;
        target.setAttribute('style', 'color:' + colors[0])
        letterCount += x;
        waiting = false;
      }, 1000)
    } else if (letterCount === words[0].length + 1 && waiting === false) {
      waiting = true;
      window.setTimeout(function() {
        x = -1;
        letterCount += x;
        waiting = false;
      }, 1000)
    } else if (waiting === false) {
      target.innerHTML = words[0].substring(0, letterCount)
      letterCount += x;
    }
  }, 120)
  window.setInterval(function() {
    if (visible === true) {
      con.className = 'console-underscore hidden'
      visible = false;

    } else {
      con.className = 'console-underscore'

      visible = true;
    }
  }, 400)
}


//urgent tasks list
var contador = 0
,   select_opt = 0;

function add_to_list(){
var action = document.querySelector('#action_select').value,
description = document.querySelector('.input_description').value,
title = document.querySelector('.input_title_desc').value,
date = document.getElementById('date_select').value;


switch (action) {
  case "SHOPPING":
 select_opt  = 0;
    break;
case "WORK":
select_opt = 1;
    break;
case "SPORT":
 select_opt = 2;
    break;
case "MUSIC":
select_opt = 3;
    break;
}

var class_li  =['list_shopping list_dsp_none','list_work list_dsp_none','list_sport list_dsp_none','list_music list_dsp_none'];

var cont = '<div class="col_md_1_list">    <p>'+action+'</p>    </div> <div class="col_md_2_list"> <h4>'+title+'</h4> <p>'+description+'</p> </div>    <div class="col_md_3_list"> <div class="cont_text_date"> <p>'+date+'</p>  </div>  <div class="cont_btns_options">    <ul>  <li><a href="#finish" onclick="finish_action('+select_opt+','+contador+');" ><i class="material-icons">&#xE5CA;</i></a></li>   </ul>  </div>    </div>';

var li = document.createElement('li')
li.className = class_li[select_opt]+" li_num_"+contador;

li.innerHTML = cont;
document.querySelectorAll('.listing-container > ul')[0].appendChild(li);

setTimeout(function(){  document.querySelector('.li_num_'+contador).style.display = "block";
},100);

setTimeout(function(){
  document.querySelector('.li_num_'+contador).className = "list_dsp_true "+class_li[select_opt]+" li_num_"+contador;
contador++;
},200);

}

function finish_action(num,num2) {

var class_li  =['list_shopping list_dsp_true','list_work  list_dsp_true','list_sport list_dsp_true','list_music list_dsp_true'];
console.log('.li_num_'+num2);
 document.querySelector('.li_num_'+num2).className = class_li[num]+" list_finish_state";
setTimeout(function(){
           del_finish();
           },500);
}

function del_finish(){
var li = document.querySelectorAll('.list_finish_state');
    for(var e = 0; e < li.length; e++){
/* li[e].style.left = "-100px"; */
li[e].style.opacity = "0";
li[e].style.height = "0px";
li[e].style.margin = "0px";
    }

  setTimeout(function(){
var li = document.querySelectorAll('.list_finish_state');
    for(var e = 0; e < li.length; e++){
  li[e].parentNode.removeChild(li[e]);
    }
  },500);


}
var t = 0;
function add_new(){
if(t % 2 == 0){
 document.querySelector('.new-container').className = "new-container new-container_active";

  document.querySelector('.add-list').className = "add-list add-list_active";
  t++;
}else {  document.querySelector('.new-container').className = "new-container";
document.querySelector('.add-list').className = "add-list";
  t++;
  }
}


//Event handling, uder interaction is what starts the code execution.

var taskInput = document.getElementById("new-task");//Add a new task.
var addButton = document.getElementsByTagName("button")[0];//first button
var incompleteTaskHolder = document.getElementById("incomplete-tasks");//ul of #incomplete-tasks
var completedTasksHolder = document.getElementById("completed-tasks");//completed-tasks


//New task list item
var createNewTaskElement = function(taskString){
    var listItem = document.createElement("li");
      //input (checkbox)
	  var checkBox = document.createElement("input");//checkbx
	   //label
	  var label = document.createElement("label");//label
	   //input (text)
	  var editInput = document.createElement("input");//text
	   //button.edit
	  var editButton = document.createElement("button");//edit button
    //button.delete
	   var deleteButton = document.createElement("button");//delete button
	    label.innerText = taskString;

	//Each elements, needs appending
	checkBox.type = "checkbox";
	editInput.type = "text";
	editButton.innerText = "Edit";//innerText encodes special characters, HTML does not.
	editButton.className = "edit";
	deleteButton.innerText = "Delete";
	deleteButton.className = "delete";

	//and appending.
	listItem.appendChild(checkBox);
	listItem.appendChild(label);
	listItem.appendChild(editInput);
	listItem.appendChild(editButton);
	listItem.appendChild(deleteButton);
	return listItem;
}



var addTask = function(){
	console.log("Add Task...");
	//Create a new list item with the text from the #new-task:
	var listItem = createNewTaskElement(taskInput.value);

	//Append listItem to incompleteTaskHolder
	incompleteTaskHolder.appendChild(listItem);
	bindTaskEvents(listItem, taskCompleted);

	taskInput.value="";

}

//Edit an existing task.

var editTask = function(){
console.log("Edit Task...");
console.log("Change 'edit' to 'save'");


var listItem = this.parentNode;

var editInput = listItem.querySelector('input[type=text]');
var label = listItem.querySelector("label");
var containsClass = listItem.classList.contains("editMode");
		//If class of the parent is .editmode
		if(containsClass){

		//switch to .editmode
		//label becomes the inputs value.
			label.innerText = editInput.value;
		}else{
			editInput.value = label.innerText;
		}

		//toggle .editmode on the parent.
		listItem.classList.toggle("editMode");
}



//Delete task.
var deleteTask = function(){
		console.log("Delete Task...");

		var listItem = this.parentNode;
		var ul = listItem.parentNode;
		//Remove the parent list item from the ul.
		ul.removeChild(listItem);

}


//Mark task completed
var taskCompleted = function(){
		console.log("Complete Task...");

	//Append the task list item to the #completed-tasks
	var listItem = this.parentNode;
	completedTasksHolder.appendChild(listItem);
				bindTaskEvents(listItem, taskIncomplete);

}


var taskIncomplete = function(){
		console.log("Incomplete Task...");
//Mark task as incomplete.
	//When the checkbox is unchecked
		//Append the task list item to the #incomplete-tasks.
		var listItem = this.parentNode;
	incompleteTaskHolder.appendChild(listItem);
			bindTaskEvents(listItem,taskCompleted);
}



var ajaxRequest = function(){
	console.log("AJAX Request");
}

//The glue to hold it all together.


//Set the click handler to the addTask function.
addButton.onclick = addTask;
addButton.addEventListener("click",addTask);
addButton.addEventListener("click",ajaxRequest);


var bindTaskEvents = function(taskListItem,checkBoxEventHandler){
	console.log("bind list item events");
//select ListItems children
	var checkBox = taskListItem.querySelector("input[type=checkbox]");
	var editButton = taskListItem.querySelector("button.edit");
	var deleteButton = taskListItem.querySelector("button.delete");


			//Bind editTask to edit button.
			editButton.onclick = editTask;
			//Bind deleteTask to delete button.
			deleteButton.onclick = deleteTask;
			//Bind taskCompleted to checkBoxEventHandler.
			checkBox.onchange = checkBoxEventHandler;
}

//cycle over incompleteTaskHolder ul list items
	//for each list item
	for (var i = 0; i < incompleteTaskHolder.children.length;i++){

		//bind events to list items chldren(tasksCompleted)
		bindTaskEvents(incompleteTaskHolder.children[i],taskCompleted);
	}




//cycle over completedTasksHolder ul list items
	for (var i = 0; i < completedTasksHolder.children.length;i++){
	//bind events to list items chldren(tasksIncompleted)
		bindTaskEvents(completedTasksHolder.children[i],taskIncomplete);
	}
