let all = {
    wpm : 0 ,
    time : 0 ,
    level : "easy",
    mode : "Timed (60s)",
    stag:{
        "easy" :0,
        "medium":0,
        "hard" :0
    }
}

// when the page downloaded
window.onload = ()=>{
    importdata();
    hidepages();
    status[0].style.display = "block";
    reverseapperence();
}

let typingTest  = document.querySelector(".testing-page .active-page-test");
let typingFinish  = document.querySelector(".high-score");
let typingFirstFinish  = document.querySelector(".result1");
let typingTestHigh  = document.querySelector(".result2");

let status = [typingTest,typingFinish,typingFirstFinish,typingTestHigh];
let hidepages =()=>{
    status.forEach((e)=>{
        e.style.display = "none";
})}



// taking data from json file and update all => object
let importdata = ()=>{
    let text = document.querySelector(".text");

    return fetch("../data.json").then(req=>req.json())
    .then(diff=>{
        let increment = all.stag[all.level];
        let current = diff[all.level][increment]["text"] ;

        all.stag[all.level]= (increment+1 == 10)? 0 : increment + 1
        characters(text,current);
        
    document.querySelectorAll(".text span")[0].style.backgroundColor = "#414141";
    })
}



// test all characters that user printed
let notused = ["Shift", "Ctrl", "Alt", "Caps Lock", "Tab", "Esc", "Enter", "ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "Meta", "ContextMenu"];
let loadLevelData =()=>{
    let i = 0 ; 
    let truech =0 ,wrongch =0;

    document.onkeydown = function(e){
    if(!notused.includes(e.key)){
        let targetCharacter = document.querySelectorAll(".text span");
        
        if(targetCharacter.length > i+1){    targetCharacter[i+1].style.backgroundColor = "#414141";    }
        let state = targetCharacter[i].textContent == e.key ;

        if(targetCharacter[i].textContent === " " )
            {targetCharacter[i].style.backgroundColor = state ? "" : "#4d1b20" ;
            }
        else{
            targetCharacter[i].style.color = state ? "#4dd77b" :"#d74d5b";
            targetCharacter[i].style.backgroundColor = "";    }

        state ? truech++ : wrongch++ ;
        i++;

        if( i === targetCharacter.length||(counter === 60 && all.mode == "Timed (60s)")){
            clearInterval(timer);
            clear_test();
            return giveakm(truech ,(truech + wrongch));
        } 
    }

}}

// start btns
const clickbutton1 = document.querySelector(".start_test button");
const clickbutton2 = document.querySelector(".restart button");
let clickbutton = document.querySelectorAll(".part3 button");
let btns =[clickbutton2,clickbutton[0],clickbutton[1],clickbutton[2]];

btns.forEach((btn)=>{
    btn.addEventListener("click" , ()=>{
        hidepages();
        status[0].style.display = "block";
        reverseapperence();
        importdata();
        clearInterval(timer)
    })
})


//  first state after loading page
clickbutton1.addEventListener("click",()=>{
    clearInterval(timer);
    timing.textContent = 60;
    counter = 0;
    all.mode === "Timed (60s)" ? settime1() : "";
    apperence();
    loadLevelData();
})

// update akm and use perfect page 

let giveakm = (truevalues,allvalues)=>{

    hidepages();
    reverseapperence();
    let operation = Math.floor(truevalues / 5 );
    updatealldata(truevalues,allvalues,operation);

    if(all.wpm == 0 ){
        status[3].style.display = "block";
    }
    else if(all.wpm > 0 && operation > all.wpm){
        status[1].style.display = "block";
    }
    else{
        status[2].style.display = "block";
    }

    operation > all.wpm && (all.wpm = operation) ;
    document.querySelector(".highakm").textContent =  all.wpm + " ";
}

let wpm_result = document.querySelectorAll(".box .wpm-result span")
let accuracy_result = document.querySelectorAll(".box .accuracy-result span")
let ch_result = document.querySelectorAll(".box .ch-results span")





// clear test function
let clear_test = ()=>{
    let targetCharacter = document.querySelectorAll(".text span");
    targetCharacter.forEach((e)=>{
        e.style.color = "";
        e.style.backgroundColor = "";
    })
    targetCharacter[0].style.backgroundColor = "#414141"
}

// giving color to character
let characters = (text,current)=>{
        let finish = current.split("").map((ch) => `<span>${ch}</span>`);
        text.innerHTML = finish.join("");
}

const part1 = document.querySelector(".main-part .cover");
const part2 = document.querySelector(".restart");
// start apperence
let apperence =  ()=>{
    part1.style.display = "none";
    part2.style.display = "block";
}
// reverse apperence
let reverseapperence =  ()=>{
    part1.style.display = "block";
    part2.style.display = "none";
    document.onkeydown = null;
}


// choose difficulty
let levels = document.querySelectorAll(".info .levels span");
levels.forEach(level=>{
    level.addEventListener("click", ()=>{
        all.level = level.textContent;
        
        levels.forEach(element => {
            element.classList.remove("active-case");
        });
    level.classList.add("active-case");
    all.level = level.textContent.toLocaleLowerCase();
    reverseapperence();
    importdata();
    })
})


// change mode

//  set timed 60s
let timing = document.querySelector(".props .time span");
let counter = 0,timer;
timing.style.color = "hsl(49, 85%, 70%)"
let settime1 = ()=>{
    timer = setInterval(()=>{
        counter ++;
        timing.textContent = 60 - counter;
        if (counter >= 60) {
            clearInterval(timer);
            document.onkeydown = null; 
        }
    },1000);
}


// change mode color 
let modes = document.querySelectorAll(".mode span")
modes.forEach(mode=>{
    mode.addEventListener("click", ()=>{
        modes.forEach(element => {
            element.classList.remove("active-case");
        });
    mode.classList.add("active-case");
    all.mode = mode.textContent
    })
})

let updatealldata = (truevalues,allvalues,operation)=>{

    let ee =document.querySelectorAll(".box .ch-results span").forEach((e,i)=>{
        if(i % 2 == 0){
            e.textContent = truevalues+ "/";
            e.style.color = "#4dd77b";
        }
        else{
            e.textContent = (allvalues-truevalues);
            e.style.color = "#d74d5b";
        }

    })
    document.querySelectorAll(".box .accuracy-result span").forEach(e=>{
        e.textContent = Math.floor((truevalues / allvalues )* 100) + "%";
        e.style.color = "#d74d5b";
    })

    document.querySelectorAll(".box .wpm-result span").forEach(e => {
    let timeInMinutes = counter / 60;
    
    if (counter > 0) {
        let calculatedWPM = Math.floor(operation / timeInMinutes);
        e.textContent = calculatedWPM;
    } else {
        e.textContent = 0;
    }
});
    
}

