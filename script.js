// Two Intervals, one for the timer and related operations and a different one for the wpm section as if it were at the same pace as the timer it would look crazy
let intervalTimer = null;
let wpmIntervalTimer = null;
// let intervalTimerTest = null;

// variables holding various values
let currentWPM = 0;
var timerHS = 0;
var timerS = 0;
var timerM = 0;
// booleans and variables to check for certain events
let hasCompleted = false;
let isStopped = true;
let errorCount = 0;
let oldCharLength = 0;
let hasPlayed = false;

// array of sentences
var sentencesArray = ["The quick brown fox jumped over the lazy dogs, but the dog got scared and ran away with the owner chasing soon after.", 
    "The cat in that hat is a book about a cat in the hat which is a cat with a hat being worn by the cat in the hat whos hat is colored along with the cat, what about that.",
    "This is a longer sentence that some of the other ones because I decided it would be, the characters arent that crazy there isn't a letter z, x, or y, except for the ones I just stated, make sure to capitolize correctly!",
    "This sentence is going to be a shorter one because I don't know what to write or use in these example sentences for the type speed test.",
    "Instead of reusing the sentence at the start I am going to write an entirely new one for the last sentence in this array who knew I wouldn't use the one I knew but rather a new one."]
// localStorage.clear();

// Getting the info for leaderboards
let userCount = (JSON.parse(localStorage.getItem("userTotal"))+1) || 0;
let scoresWPM = JSON.parse(localStorage.getItem("scoresWPM")|| '[]') ;
let scoresTime= JSON.parse(localStorage.getItem("scoresTime")|| '[]') ;

// if(scoresWPM == '[]'){
//     scoresWPM = [];
// }
// console.log(scoresWPM)
// console.log(scoresWPM == '[]')
// if(scoresTime== '[]'){
//     scoresTime = [];
// }

// all the html elements
const testWrapper = document.querySelector(".test-wrapper");
const main = document.querySelector(".main");
const testArea = document.querySelector("#test-area");
// const originText = document.querySelector("#origin-text p").innerHTML;
const originTextBox = document.querySelector("#origin-text p");
const errorCountDisplay = document.querySelector(".error-count");
const resetButton = document.querySelector("#reset");
const stopButton = document.querySelector("#stop");
const wpmDisplay = document.querySelector(".wpm")
const deathmatchBtn = document.querySelector("#deathmatch");
const theTimer = document.querySelector(".timer");
const leaderboardScores = document.querySelector(".leaderboard-scores");
const leaderboardScoresWPM = document.querySelector("#leaderboard-scores-wpm div");
const leaderboardScoresTime = document.querySelector("#leaderboard-scores-time div");
// sound for getting high score
const celebSound = new Audio('assets/celebration_yay.mp3');

// focus on the text area
testArea.focus();
// setting the first sentence for the user to type
originTextBox.innerHTML = "This is the first sentence that pops up when you load the site, it isn't quite long and not that difficult to type.";


// Add leading zero to numbers 9 or below (purely for aesthetics):
function timerToString(){
    // check if less than 10 then add a leading 0
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
    
    // return full string
    return stringTimerM+"."+stringTimerS+"."+stringTimerHS;
}

// Run a standard minute/second/hundredths timer:
function runningTimer(){
    // every 100 hundreths of a second add 1 to second and reset hundreths
    timerHS+=1;
    if(timerHS>= 100){
        timerHS = 0;
        timerS+=1;
    }
    // evrey 60 seconds and 1 to minute and reset seconds
    if(timerS>= 60){
        timerS = 0;
        timerM+=1;
    }
    // console.log("running");
    // alert("yo its running");
    
    // update the timer using the string method 
    theTimer.innerHTML = timerToString();
}
// Match the text entered with the provided text on the page:
// function updateTextArea(e){
//     testArea.innerHTML = e.target.value;
//     // console.log("TESTING",testArea.innerHTML);
//     testMatch(e);
// }

function testMatch(e){
    // call to update outline of test area
    currentlyMatching(e);
    // alert("currently: "+ testArea.innerHTML)
    // console.log("TESTING MATCH",testArea.innerHTML);
    // if exact match 
    if(testArea.value == originTextBox.innerHTML){
        // alert("yo it matched");
        // update values and elements, stop timer, and update leaderboard
        hasCompleted = true;
        testWrapper.style.borderColor = "#80ff80";
        stopTimer(e);
        updateLeaderboard();
        // localStorage.setItem("1st", "Bob");
    }else{
        // if in sudden death mode, reset when errors is greater than 3
        if(errorCount > 3 && deathmatchBtn.checked){
            resetTimer(e);
            testArea.setAttribute("disabled", true);
            // main.style.backgroundColor = "red";
            // make screen red for a half second for visual aid as well as disable test area ad focus at the end.
            main.style.backgroundColor = "#ff0000";
            setTimeout(()=>{
                main.style.backgroundColor = ""
            }, 100)
            setTimeout(()=>{
                if(testArea.hasAttribute("disabled")){
                    testArea.toggleAttribute("disabled");
                }
                
                testArea.focus();
                // console.log("testing");

            }, 300)

        }
    }
}

// another function to check if currently matching, called in the function which checks if its an exact match
function currentlyMatching(e){
    // get length of test area
    let charLength = testArea.value.length;
    // check if currently matching using substring from 0 to length
    if(testArea.value == originTextBox.innerHTML.substring(0, charLength)){
        // console.log("error count testing: "+originTextBox.innerHTML.substring(0, charLength));
        
        // update values
        testWrapper.style.borderColor = "#8080ff";
        oldCharLength = charLength;
    }else{
        // update values
        testWrapper.style.borderColor = "#ff8080";

        // check is the length is longer or shorter than last error to ensure we don't count backspace errors
        if(charLength > oldCharLength){
            // console.log("error count before: "+errorCount);
            errorCount++;
            // console.log("error count after: "+errorCount);
        }
        // update values
        oldCharLength = charLength;
        errorCountDisplay.innerHTML = "Errors: " + errorCount;
        // errorCountDisplay.innerHTML = "Errors: "+errorCount+"OLD:" +oldCharLength+"NEW:"+charLength;
    }
}

// function to update the wpm display
function updateWPM(){
    currentWPM = (testArea.value.length / 5) / (((60*timerM)+timerS+(timerHS/100))/60);
    wpmDisplay.innerHTML = "WPM: "+ Math.floor(currentWPM);
}

// function to update the leaderboard both on page load and when a new high score is reached
function updateLeaderboard(){
    // check if completed a sentence
    if(hasCompleted){
        // if the scores array for wpm has value
        if(scoresWPM.length !=0){
            // if it has 3 then update accordingly by checking each position, starting at the front to check if current wpm is higher than leaderboard ones
            // use unshift to add it to the front or splice to add it to that specific index, play sound, and pop to remove the last one, update hasplayed variable to ensure the sound doesn't play twice (for wpm and once for time)
            if(scoresWPM.length == 3){
                if(currentWPM > parseInt(scoresWPM[0].wpm)){
                    scoresWPM.unshift({username: "User"+userCount,
                        wpm: Math.floor(currentWPM), 
                        chars: testArea.value.length, 
                        time: ((60*timerM)+timerS+(timerHS/100))
                    });
                    celebSound.play();
                    hasPlayed = true;
                    scoresWPM.pop()
                }else if (currentWPM > parseInt(scoresWPM[1].wpm)){
                    scoresWPM.splice(1, 0, {username: "User"+userCount,
                        wpm: Math.floor(currentWPM), 
                        chars: testArea.value.length, 
                        time: ((60*timerM)+timerS+(timerHS/100))
                    });
                    celebSound.play();
                    hasPlayed = true;
                    scoresWPM.pop()
                }else if (currentWPM > parseInt(scoresWPM[2].wpm)){
                    scoresWPM.splice(2, 0, {username: "User"+userCount,
                        wpm: Math.floor(currentWPM), 
                        chars: testArea.value.length, 
                        time: ((60*timerM)+timerS+(timerHS/100))
                    });
                    celebSound.play();
                    hasPlayed = true;
                    scoresWPM.pop()
                }
            // if it has 2 then update accordingly by checking the first 2 positions, starting at the front to check if current wpm is higher than leaderboard ones
            // use unshift to add it to the front or splice to add it to that specific index, play sound, and update hasplayed variable to ensure the sound doesn't play twice
            // if it is not greater than any then just push it to the back
            }else if(scoresWPM.length == 2){
                if(currentWPM > parseInt(scoresWPM[0].wpm)){
                    scoresWPM.unshift({username: "User"+userCount,
                        wpm: Math.floor(currentWPM), 
                        chars: testArea.value.length, 
                        time: ((60*timerM)+timerS+(timerHS/100))
                    });
                    celebSound.play();
                    hasPlayed = true;
                }else if (currentWPM > parseInt(scoresWPM[1].wpm)){
                    scoresWPM.splice(1, 0, {username: "User"+userCount,
                        wpm: Math.floor(currentWPM), 
                        chars: testArea.value.length, 
                        time: ((60*timerM)+timerS+(timerHS/100))
                    });
                    celebSound.play();
                    hasPlayed = true;
                }else{
                    scoresWPM.push({username: "User"+userCount,
                        wpm: Math.floor(currentWPM), 
                        chars: testArea.value.length, 
                        time: ((60*timerM)+timerS+(timerHS/100))
                    });
                    celebSound.play();
                    hasPlayed = true;
                }
            // if it has 1 then update accordingly by checking the first to check if current wpm is higher than leaderboard one
            // use unshift to add it to the front, play sound, and update hasplayed variable to ensure the sound doesn't play twice
            // if it is not greater than that one then just push it to the back
            }else{
                if(currentWPM > parseInt(scoresWPM[0].wpm)){
                    scoresWPM.unshift({username: "User"+userCount,
                        wpm: Math.floor(currentWPM), 
                        chars: testArea.value.length, 
                        time: ((60*timerM)+timerS+(timerHS/100))
                    });
                    celebSound.play();
                    hasPlayed = true;
                }else{
                    scoresWPM.push({username: "User"+userCount,
                        wpm: Math.floor(currentWPM), 
                        chars: testArea.value.length, 
                        time: ((60*timerM)+timerS+(timerHS/100))
                    });
                    celebSound.play();
                    hasPlayed = true;
                }
            }
            // console.log(scoresWPM.length == 0);
            // console.log(scoresWPM);
        // else then it is the first ever score, so just put at at the front, play sound, and update variables
        }else{
            scoresWPM.unshift({username: "User"+userCount,
                wpm: Math.floor(currentWPM), 
                chars: testArea.value.length, 
                time: ((60*timerM)+timerS+(timerHS/100))
            });
            celebSound.play();
            hasPlayed = true;
        }

        
        // if the scores array for time has values
        if(scoresTime.length !=0){
            // if it has 3 then update accordingly by checking each position, starting at the front to check if current time is shorter than leaderboard ones
            // use unshift to add it to the front or splice to add it to that specific index, play sound, and pop to remove the last one, check hasplayed variable to ensure the sound doesn't play twice (for wpm and once for time)
            if(scoresTime.length == 3){
                if(((60*timerM)+timerS+(timerHS/100)) < scoresTime[0].time){
                    scoresTime.unshift({username: "User"+userCount,
                        timeString: timerToString(), 
                        chars: testArea.value.length, 
                        time: ((60*timerM)+timerS+(timerHS/100))
                    });
                    if(!hasPlayed){
                        celebSound.play();
                    }
                    scoresTime.pop()
                }else if (((60*timerM)+timerS+(timerHS/100)) < scoresTime[1].time){
                    scoresTime.splice(1, 0, {username: "User"+userCount,
                        timeString: timerToString(), 
                        chars: testArea.value.length, 
                        time: ((60*timerM)+timerS+(timerHS/100))
                    });
                    if(!hasPlayed){
                        celebSound.play();
                    }
                    scoresTime.pop()
                }else if (((60*timerM)+timerS+(timerHS/100)) < scoresTime[2].time){
                    scoresTime.splice(2, 0, {username: "User"+userCount,
                        timeString: timerToString(), 
                        chars: testArea.value.length, 
                        time: ((60*timerM)+timerS+(timerHS/100))
                    });
                    if(!hasPlayed){
                        celebSound.play();
                    }
                    scoresTime.pop()
                }
            // if it has 2 then update accordingly by checking the first 2 positions, starting at the front to check if current time is shorter than leaderboard ones
            // use unshift to add it to the front or splice to add it to that specific index, play sound, and check hasplayed variable to ensure the sound doesn't play twice
            // if it is not greater than any then just push it to the back
            }else if(scoresTime.length == 2){
                if(((60*timerM)+timerS+(timerHS/100)) < scoresTime[0].time){
                    scoresTime.unshift({username: "User"+userCount,
                        timeString: timerToString(), 
                        chars: testArea.value.length, 
                        time: ((60*timerM)+timerS+(timerHS/100))
                    });
                    if(!hasPlayed){
                        celebSound.play();
                    }
                }else if (((60*timerM)+timerS+(timerHS/100)) < scoresTime[1].time){
                    scoresTime.splice(1, 0, {username: "User"+userCount,
                        timeString: timerToString(), 
                        chars: testArea.value.length, 
                        time: ((60*timerM)+timerS+(timerHS/100))
                    });
                    if(!hasPlayed){
                        celebSound.play();
                    }
                }else{
                    scoresTime.push({username: "User"+userCount,
                        timeString: timerToString(), 
                        chars: testArea.value.length, 
                        time: ((60*timerM)+timerS+(timerHS/100))
                    });
                    if(!hasPlayed){
                        celebSound.play();
                    }
                }
            // if it has 1 then update accordingly by checking the first to check if current time is shorter than leaderboard one
            // use unshift to add it to the front, play sound, and check hasplayed variable to ensure the sound doesn't play twice
            // if it is not shoter than that one then just push it to the back
            }else{
                if(((60*timerM)+timerS+(timerHS/100)) < scoresTime[0].time){
                    scoresTime.unshift({username: "User"+userCount,
                        timeString: timerToString(), 
                        chars: testArea.value.length, 
                        time: ((60*timerM)+timerS+(timerHS/100))
                    });
                    if(!hasPlayed){
                        celebSound.play();
                    }
                }else{
                    scoresTime.push({username: "User"+userCount,
                        timeString: timerToString(), 
                        chars: testArea.value.length, 
                        time: ((60*timerM)+timerS+(timerHS/100))
                    });
                    if(!hasPlayed){
                        celebSound.play();
                    }
                }
            }
            // console.log(scoresWPM.length == 0);
            // console.log(scoresWPM);
        // else then it is the first ever score, so just put at at the front, play sound, and check variables for sound play
        }else{
            scoresTime.unshift({username: "User"+userCount,
                timeString: timerToString(), 
                chars: testArea.value.length, 
                time: ((60*timerM)+timerS+(timerHS/100))
            });
            if(!hasPlayed){
                celebSound.play();
            }
        }
    }
    
    // update sound variable
    hasPlayed = false;
    // Updated Display Statements
    // if the array is not empty then update the aligment of the scores, else just keep it at the center
    if(scoresWPM.length !=0){
        leaderboardScoresWPM.style.textAlign = "left";
        // if the array has 3 scores than display the username, wpm, and amount of characters typed for all 3, using <br> for line breaks
        if(scoresTime.length == 3){
            leaderboardScoresWPM.innerHTML = "1. " + scoresWPM[0].username+": "+ scoresWPM[0].wpm + "WPM ----- ("+scoresWPM[0].chars+"chars)<br>2. "+scoresWPM[1].username+": "+ scoresWPM[1].wpm+ "WPM ----- ("+scoresWPM[1].chars+"chars)<br>3. "+scoresWPM[2].username+": "+ scoresWPM[2].wpm +"WPM ----- ("+scoresWPM[2].chars+"chars)";
        // if the array has 2 scores than display the username, wpm, and amount of characters typed for the 2, using <br> for line breaks
        }else if(scoresWPM.length == 2){
            leaderboardScoresWPM.innerHTML = "1. " + scoresWPM[0].username+": "+ scoresWPM[0].wpm + "WPM ----- ("+scoresWPM[0].chars+"chars)<br>2. "+scoresWPM[1].username+": "+ scoresWPM[1].wpm+ "WPM ----- ("+scoresWPM[1].chars+"chars)";
        // else, the array only has 1 score so just display that one's username, wpm, and character length
        }else{
            // scoresWPM.wpm = Math.floor(scoresWPM.wpm)
            leaderboardScoresWPM.innerHTML = "1. " + scoresWPM[0].username+": "+ scoresWPM[0].wpm + "WPM ----- ("+scoresWPM[0].chars+"chars)";
        }
        // console.log(scoresWPM.length == 0);
        // console.log(scoresWPM);
    }else{
        leaderboardScoresWPM.style.textAlign = "center";
        // leaderboardScoresWPM.innerHTML = "test";
    }
    // if the array is not empty then update the aligment of the scores, else just keep it at the center
    if(scoresTime.length !=0){
        leaderboardScoresTime.style.textAlign = "left";
        // if the array has 3 scores than display the username, and time, using <br> for line breaks
        if(scoresTime.length == 3){
            leaderboardScoresTime.innerHTML = "1. " + scoresTime[0].username+": "+ scoresTime[0].timeString + "<br>2. "+scoresTime[1].username+": "+ scoresTime[1].timeString+"<br>3. "+scoresTime[2].username+": "+ scoresTime[2].timeString;
        // if the array has 2 scores than display the username, and time, using <br> for line breaks
        }else if(scoresTime.length == 2){
            leaderboardScoresTime.innerHTML = "1. " + scoresTime[0].username+": "+ scoresTime[0].timeString + "<br>2. "+scoresTime[1].username+": "+ scoresTime[1].timeString;
            // else the array has only 1 score so just display that one's username and score
        }else{
            leaderboardScoresTime.innerHTML = "1. " + scoresTime[0].username+": "+ scoresTime[0].timeString;
        }
        // console.log(scoresWPM.length == 0);
        // console.log(scoresWPM);
    }else{
        // leaderboardScoresTime.innerHTML = "test";
        leaderboardScoresTime.style.textAlign = "center";
        // leaderboardScoresTime.style.backgroundColor = "red";
    }

    // update local storage with the updated arrays and usercount
    localStorage.setItem("userTotal", JSON.stringify(userCount));
    if(scoresWPM.length > 0){
        localStorage.setItem("scoresWPM", JSON.stringify(scoresWPM));
    }
    if(scoresTime.length > 0){
        localStorage.setItem("scoresTime", JSON.stringify(scoresTime));
    }
}

// start the running timer
function startTimer(e){
    // if a text area has not been completed
    if(!hasCompleted){
        // originTextBox.innerHTML = "A sample sentence used for testing.";
        // check if interval timer is null, used to ensure no overlapping/stacking timers
        if(intervalTimer == null){
            // use setinterval to call runningtimer every 10 miliseconds, with a serpate one to update the wpm display every 50 miliseconds
            intervalTimer = setInterval(()=>runningTimer(), 10);
            wpmIntervalTimer = setInterval(()=>updateWPM(), 50);
            // intervalTimerTest = setInterval(()=>console.log(deathmatchBtn.value), 100);
            // console.log("testing");
        }

        // update stop button style as well as stopped variable
        stopButton.style.backgroundColor = "white";
        stopButton.style.color = "#e9160f";
        stopButton.innerHTML = "Stop";
        isStopped = false;
        // testMatch(e);
    }
}

// stop button to stop timer:
function stopTimer(e){
    e.preventDefault();
    // clear the interval for both timer and wpm dispalay 
    clearInterval(intervalTimer);
    clearInterval(wpmIntervalTimer);
    // clearInterval(intervalTimerTest);
    // set interval to null
    intervalTimer = null;
    // update the timer element
    theTimer.innerHTML = timerToString();
    // if it has been completed disable the test area
    if(hasCompleted){
        testArea.setAttribute("disabled", true);
    }
    // alert(originTextBox.innerHTML);
    // hoveringStopBtn(e);

    // focus on test area
    testArea.focus();
}

// update stop button for when it is pressed
function updateStop(e){
    e.preventDefault();
    // if it has not been completed and the test area is not blank
    if(!hasCompleted && !(testArea.value=="")){
        // update button style and text, as well as stoppped variable
        stopButton.style.backgroundColor = "#e9160f";
        stopButton.style.color = "white";
        stopButton.innerHTML = "Stopped";
        isStopped = true;
    // else for testing
    }else{
        // hoveringStopBtn(e);
        // alert("REST")
    }
}

// manual hovering so that it doesn't change color when hovering when completed or test area is black (disabled)
function hoveringStopBtn(e){
    e.preventDefault();
    if(!hasCompleted && !(testArea.value=="") && !isStopped){
        stopButton.style.backgroundColor = "#e9160f";
        stopButton.style.color = "white";
        // stopButton.style.borderColor = "black";
    }
}

// manual stop hovering to complement the manual hovering function
function stopHoveringStopBtn(e){
    e.preventDefault();
    if(!hasCompleted && !(testArea.value=="") && !isStopped){
        stopButton.style.backgroundColor = "white";
        stopButton.style.color = "#e9160f";
        // stopButton.style.borderColor = "#e9160f";
    }
}
// Reset everything:
function resetTimer(e){
    // reset timer, wpm, booleans, and char legnth variables/displays
    timerHS = 0;
    timerS = 0;
    timerM = 0;
    currentWPM = 0;
    oldCharLength = 0;
    wpmDisplay.innerHTML = "WPM: 0";
    // stop timer
    stopTimer(e);
    testArea.value = "";
    hasCompleted = false;
    // undisable the test area
    if(testArea.hasAttribute("disabled")){
        testArea.toggleAttribute("disabled");
    }
    // update styles for html elements
    testWrapper.style.borderColor = "grey";
    stopButton.style.backgroundColor = "white";
    stopButton.style.color = "#e9160f";
    stopButton.innerHTML = "Stop";
    // Math.random()>.5? originTextBox.innerHTML = "Another sample sentence that can be used for testing.":originTextBox.innerHTML = "A third sentence which is a sample utilized for testing."

    // use math.random to select a random sentence from array
    let randomNum = Math.random()*5;
    originTextBox.innerHTML = sentencesArray[Math.floor(randomNum)];
    // focus on area and reset error count variable and displays (hide because it stays hidden when you have no errors)
    testArea.focus();
    errorCount = 0;
    errorCountDisplay.innerHTML = "";
}

// Event listeners for keyboard input and the reset button:
testArea.addEventListener("paste", (e)=>e.preventDefault());
testArea.addEventListener("input", this.startTimer);
// stop button event listeners, both for function and visuals
stopButton.addEventListener("click", this.stopTimer);
stopButton.addEventListener("mouseover", this.hoveringStopBtn);
stopButton.addEventListener("mouseout", this.stopHoveringStopBtn);
stopButton.addEventListener("click", this.updateStop);
// stopButton.addEventListener("mouse", this.hoveringStopBtn);
resetButton.addEventListener("click", this.resetTimer);
testArea.addEventListener('input', this.testMatch);
// deathmatch event listener for qol
deathmatchBtn.addEventListener('click', (e)=>{testArea.focus();});
// update leaderboard on page load
updateLeaderboard();