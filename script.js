let intervalTimer = null;
let wpmIntervalTimer = null;
// let intervalTimerTest = null;
let currentWPM = 0;
var timerHS = 0;
var timerS = 0;
var timerM = 0;
let hasCompleted = false;
let isStopped = true;
let errorCount = 0;
let oldCharLength = 0;
let hasPlayed = false;
var sentencesArray = ["The quick brown fox jumped over the lazy dogs, but the dog got scared and ran away with the owner chasing soon after.", 
    "The cat in that hat is a book about a cat in the hat which is a cat with a hat being worn by the cat in the hat whos hat is colored along with the cat, what about that.",
    "This is a longer sentence that some of the other ones because I decided it would be, the characters arent that crazy there isn't a letter z, x, or y, except for the ones I just stated, make sure to capitolize correctly!",
    "This sentence is going to be a shorter one because I don't know what to write or use in these example sentences for the type speed test.",
    "Instead of reusing the sentence at the start I am going to write an entirely new one for the last sentence in this array who knew I wouldn't use the one I knew but rather a new one."]
localStorage.clear();

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
const celebSound = new Audio('assets/celebration_yay.mp3');

// if(scoresWPM.length !=0){
//     if(scoresTime.length == 3){
//         leaderboardScoresWPM.innerHTML = "1. " + scoresWPM[0] + "<br>2. "+scoresWPM[1]+"<br>3. "+scoresWPM[2];
//     }else if(scoresWPM.length == 2){
//         leaderboardScoresWPM.innerHTML = "1. " + scoresWPM[0] + "<br>2. "+scoresWPM[1];
//     }else{
//         leaderboardScoresWPM.innerHTML = "1. " + scoresWPM[0];
//     }
//     // console.log(scoresWPM.length == 0);
//     // console.log(scoresWPM);
// }else{
//     leaderboardScoresWPM.innerHTML = "test";
// }
// console.log(leaderboardScoresWPM);
// console.log(main);
testArea.focus();
originTextBox.innerHTML = "This is the first sentence that pops up when you load the site, it isn't quite long and not that difficult to type.";
// Add leading zero to numbers 9 or below (purely for aesthetics):

// function leaderboardTimerToString(timedM, timedS, timedHS){

// }

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
        stopTimer(e);
        updateLeaderboard();
        // localStorage.setItem("1st", "Bob");
    }else{
        if(errorCount > 3 && deathmatchBtn.checked){
            resetTimer(e);
            testArea.setAttribute("disabled", true);
            // main.style.backgroundColor = "red";
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

// Start the timer:
function currentlyMatching(e){
    let charLength = testArea.value.length;
    if(testArea.value == originTextBox.innerHTML.substring(0, charLength)){
            // console.log("error count testing: "+originTextBox.innerHTML.substring(0, charLength));
        testWrapper.style.borderColor = "#8080ff";
        oldCharLength = charLength;
    }else{
        testWrapper.style.borderColor = "#ff8080";
        if(charLength > oldCharLength){
            // console.log("error count before: "+errorCount);
            errorCount++;
            // console.log("error count after: "+errorCount);
        }
        oldCharLength = charLength;
        errorCountDisplay.innerHTML = "Errors: " + errorCount;
        // errorCountDisplay.innerHTML = "Errors: "+errorCount+"OLD:" +oldCharLength+"NEW:"+charLength;
    }
}

function updateWPM(){
    currentWPM = (testArea.value.length / 5) / (((60*timerM)+timerS+(timerHS/100))/60);
    wpmDisplay.innerHTML = "WPM: "+ Math.floor(currentWPM);
}

function updateLeaderboard(){
    //eee
    if(hasCompleted){
        if(scoresWPM.length !=0){
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
        }else{
            scoresWPM.unshift({username: "User"+userCount,
                wpm: Math.floor(currentWPM), 
                chars: testArea.value.length, 
                time: ((60*timerM)+timerS+(timerHS/100))
            });
            celebSound.play();
            hasPlayed = true;
        }

        
        if(scoresTime.length !=0){
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
    
    hasPlayed = false;
    // Updated Display
    if(scoresWPM.length !=0){
        leaderboardScoresWPM.style.textAlign = "left";
        if(scoresTime.length == 3){
            leaderboardScoresWPM.innerHTML = "1. " + scoresWPM[0].username+": "+ scoresWPM[0].wpm + "WPM ----- ("+scoresWPM[0].chars+"chars)<br>2. "+scoresWPM[1].username+": "+ scoresWPM[1].wpm+ "WPM ----- ("+scoresWPM[1].chars+"chars)<br>3. "+scoresWPM[2].username+": "+ scoresWPM[2].wpm +"WPM ----- ("+scoresWPM[2].chars+"chars)";
        }else if(scoresWPM.length == 2){
            leaderboardScoresWPM.innerHTML = "1. " + scoresWPM[0].username+": "+ scoresWPM[0].wpm + "WPM ----- ("+scoresWPM[0].chars+"chars)<br>2. "+scoresWPM[1].username+": "+ scoresWPM[1].wpm+ "WPM ----- ("+scoresWPM[1].chars+"chars)";
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
    if(scoresTime.length !=0){
        leaderboardScoresTime.style.textAlign = "left";
        if(scoresTime.length == 3){
            leaderboardScoresTime.innerHTML = "1. " + scoresTime[0].username+": "+ scoresTime[0].timeString + "<br>2. "+scoresTime[1].username+": "+ scoresTime[1].timeString+"<br>3. "+scoresTime[2].username+": "+ scoresTime[2].timeString;
        }else if(scoresTime.length == 2){
            leaderboardScoresTime.innerHTML = "1. " + scoresTime[0].username+": "+ scoresTime[0].timeString + "<br>2. "+scoresTime[1].username+": "+ scoresTime[1].timeString;
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
    localStorage.setItem("userTotal", JSON.stringify(userCount));
    if(scoresWPM.length > 0){
        localStorage.setItem("scoresWPM", JSON.stringify(scoresWPM));
    }
    if(scoresTime.length > 0){
        localStorage.setItem("scoresTime", JSON.stringify(scoresTime));
    }
}
function startTimer(e){
    if(!hasCompleted){
        // originTextBox.innerHTML = "A sample sentence used for testing.";
        if(intervalTimer == null){
            intervalTimer = setInterval(()=>runningTimer(), 10);
            wpmIntervalTimer = setInterval(()=>updateWPM(), 50);
            // intervalTimerTest = setInterval(()=>console.log(deathmatchBtn.value), 100);
            // console.log("testing");
        }
        stopButton.style.backgroundColor = "white";
        stopButton.style.color = "#e9160f";
        stopButton.innerHTML = "Stop";
        isStopped = false;
        // testMatch(e);
    }
}

// Reset everything:
function stopTimer(e){
    e.preventDefault();
    clearInterval(intervalTimer);
    clearInterval(wpmIntervalTimer);
    // clearInterval(intervalTimerTest);
    intervalTimer = null;
    theTimer.innerHTML = timerToString();
    if(hasCompleted){
        testArea.setAttribute("disabled", true);
    }
    // alert(originTextBox.innerHTML);
    // hoveringStopBtn(e);
    testArea.focus();
}

function updateStop(e){
    e.preventDefault();
    if(!hasCompleted && !(testArea.value=="")){
        stopButton.style.backgroundColor = "#e9160f";
        stopButton.style.color = "white";
        stopButton.innerHTML = "Stopped";
        isStopped = true;
    }else{
        // hoveringStopBtn(e);
        // alert("REST")
    }
}

function hoveringStopBtn(e){
    e.preventDefault();
    if(!hasCompleted && !(testArea.value=="") && !isStopped){
        stopButton.style.backgroundColor = "#e9160f";
        stopButton.style.color = "white";
        // stopButton.style.borderColor = "black";
    }
}
function stopHoveringStopBtn(e){
    e.preventDefault();
    if(!hasCompleted && !(testArea.value=="") && !isStopped){
        stopButton.style.backgroundColor = "white";
        stopButton.style.color = "#e9160f";
        // stopButton.style.borderColor = "#e9160f";
    }
}
function resetTimer(e){
    timerHS = 0;
    timerS = 0;
    timerM = 0;
    currentWPM = 0;
    oldCharLength = 0;
    wpmDisplay.innerHTML = "WPM: 0"
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
    // Math.random()>.5? originTextBox.innerHTML = "Another sample sentence that can be used for testing.":originTextBox.innerHTML = "A third sentence which is a sample utilized for testing."
    let randomNum = Math.random()*5;
    originTextBox.innerHTML = sentencesArray[Math.floor(randomNum)];
    testArea.focus();
    errorCount = 0;
    errorCountDisplay.innerHTML = "";
}

// Event listeners for keyboard input and the reset button:
testArea.addEventListener("paste", (e)=>e.preventDefault());
testArea.addEventListener("input", this.startTimer);
stopButton.addEventListener("click", this.stopTimer);
stopButton.addEventListener("mouseover", this.hoveringStopBtn);
stopButton.addEventListener("mouseout", this.stopHoveringStopBtn);
stopButton.addEventListener("click", this.updateStop);
// stopButton.addEventListener("mouse", this.hoveringStopBtn);
resetButton.addEventListener("click", this.resetTimer);
testArea.addEventListener('input', this.testMatch);
deathmatchBtn.addEventListener('click', (e)=>{testArea.focus();});

updateLeaderboard();