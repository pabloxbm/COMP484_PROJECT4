let intervalTimer = null;
var timerHS = 0;
var timerS = 0;
var timerM = 0;
let hasCompleted = false;
let isStopped = true;

const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
// const originText = document.querySelector("#origin-text p").innerHTML;
const originTextBox = document.querySelector("#origin-text p");
const resetButton = document.querySelector("#reset");
const stopButton = document.querySelector("#stop");
const theTimer = document.querySelector(".timer");


originTextBox.innerHTML = "A sample sentence used for testing.";
// Add leading zero to numbers 9 or below (purely for aesthetics):
function timerToString(){
    let stringTimerHS = timerHS;
    if(stringTimerHS<10){
        stringTimerHS = "0"+stringTimerHS;
    }
    let stringTimerS = timerS;
    if(stringTimerS<10){
        stringTimerS = "0"+stringTimerS;
    }
    let stringTimerM = timerM;
    if(stringTimerM<10){
        stringTimerM = "0"+stringTimerM;
    }
    return stringTimerM+"."+stringTimerS+"."+stringTimerHS;
}

// Run a standard minute/second/hundredths timer:

function runningTimer(){
    timerHS+=1;
    if(timerHS>= 100){
        timerHS = 0;
        timerS+=1;
    }
    if(timerS>= 60){
        timerS = 0;
        timerM+=1;
    }
    // console.log("running");
    // alert("yo its running");
    theTimer.innerHTML = timerToString();
}
// Match the text entered with the provided text on the page:
// function updateTextArea(e){
//     testArea.innerHTML = e.target.value;
//     // console.log("TESTING",testArea.innerHTML);
//     testMatch(e);
// }

function testMatch(e){
    currentlyMatching(e);
    // alert("currently: "+ testArea.innerHTML)
    // console.log("TESTING MATCH",testArea.innerHTML);
    if(testArea.value == originTextBox.innerHTML){
        // alert("yo it matched");
        hasCompleted = true;
        testWrapper.style.borderColor = "#80ff80";
        stopTimer(e)
    }
}

// Start the timer:
function currentlyMatching(e){
    let charLength = testArea.value.length;
    if(testArea.value == originTextBox.innerHTML.substring(0, charLength)){
        testWrapper.style.borderColor = "#8080ff";
    }else{
        testWrapper.style.borderColor = "#ff8080";
    }
}

function startTimer(e){
    if(!hasCompleted){
        // originTextBox.innerHTML = "A sample sentence used for testing.";
        if(intervalTimer == null){
            intervalTimer = setInterval(()=>runningTimer(), 10);
            // console.log("testing");
        }
        stopButton.style.backgroundColor = "white";
        stopButton.style.color = "#e9160f";
        stopButton.innerHTML = "Stop";
        isStopped = false;
    }
}

// Reset everything:
function stopTimer(e){
    clearInterval(intervalTimer);
    intervalTimer = null;
    theTimer.innerHTML = timerToString();
    if(hasCompleted){
        testArea.setAttribute("disabled", true);
    }
    // alert(originTextBox.innerHTML);
}

function updateStop(e){
    if(!hasCompleted && !(testArea.value=="")){
        stopButton.style.backgroundColor = "#e9160f";
        stopButton.style.color = "white";
        stopButton.innerHTML = "Stopped";
        isStopped = true;
    }
}

function hoveringStopBtn(e){
    if(!hasCompleted && !(testArea.value=="") && !isStopped){
        stopButton.style.backgroundColor = "#e9160f";
        stopButton.style.color = "white";
    }
}
function stopHoveringStopBtn(e){
    if(!hasCompleted && !(testArea.value=="") && !isStopped){
        stopButton.style.backgroundColor = "white";
        stopButton.style.color = "#e9160f";
    }
}
function resetTimer(e){
    timerHS = 0;
    timerS = 0;
    timerM = 0;
    stopTimer(e);
    testArea.value = "";
    hasCompleted = false;
    if(testArea.hasAttribute("disabled")){
        testArea.toggleAttribute("disabled");
    }
    testWrapper.style.borderColor = "grey";
    stopButton.style.backgroundColor = "white";
    stopButton.style.color = "#e9160f";
    stopButton.innerHTML = "Stop";
    Math.random()>.5? originTextBox.innerHTML = "Another sample sentence that can be used for testing.":originTextBox.innerHTML = "A third sentence which is a sample utilized for testing."
}

// Event listeners for keyboard input and the reset button:
testArea.addEventListener("input", this.startTimer);
stopButton.addEventListener("click", this.stopTimer);
stopButton.addEventListener("click", this.updateStop);
stopButton.addEventListener("mouseenter", this.hoveringStopBtn);
stopButton.addEventListener("mouseleave", this.stopHoveringStopBtn);
stopButton.addEventListener("mouse", this.hoveringStopBtn);
resetButton.addEventListener("click", this.resetTimer);
testArea.addEventListener('input', this.testMatch);