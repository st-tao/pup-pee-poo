const todaysDate = document.getElementById('todays-date');
todaysDate.innerHTML = getTodaysDate();

var todaysData = localStorage.getItem('todaysData');
setupLocalStorage();

setupTable(todaysData);

function setupLocalStorage() {
    let today = localStorage.getItem('todaysDate');
    // new user has nothing stored locally
    if (today === null || todaysData === null) {
        localStorage.setItem('todaysDate', getTodaysDate())
        todaysData = getDefaultData();
        localStorage.setItem('todaysData', JSON.stringify(todaysData));
    } else {
        // returning user
        // if data is NOT from today, reset 
        if (today != getTodaysDate()) {
            todaysData = getDefaultData();
            localStorage.setItem('todaysData', JSON.stringify(todaysData));
            localStorage.setItem('todaysDate', getTodaysDate());
        } else {
            // data is from today
            todaysData = JSON.parse(localStorage.getItem('todaysData'))
        }
    }

}


function getDefaultData() {
    let testData = new Object();
    for (let i=6; i<24; i=i+0.5) {
        let currHour = Math.floor(i).toString();
        let currMinute = (Math.floor(i) === i ? '00' : '30');
        let currTimeId = "time-".concat(currHour,"-",currMinute);

        testData[currTimeId] = {
            'pee': false,
            'poo': false,
            'accident': false,
        };
    };
    return testData;
}

// Functions

function getTodaysDate() {
    let date = new Date()
    let monthNum = date.getMonth();
    let month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][monthNum];
    let dayNum = date.getDate();
    let day = dayNum.toString();
    let yearNum = date.getFullYear();
    let year = yearNum.toString();

    return `${month} ${day}, ${year}`;
}

function setupTable(todaysData) {
    const timeTable = document.getElementById('time-table');
    timeTable.appendChild(getTableRows(todaysData));
};

function getTableRows(todaysData) {
    var newTbody = document.createElement("tbody");
    // i is the time in 24hrs
    for (let i=6; i<24; i=i+0.5) {
        // get string for time
        let currHourNum = Math.floor(i);
        if (currHourNum >= 13) {
            var currHour = (currHourNum-12).toString();
            var AMorPM = "pm";
        } else {
            var currHour = currHourNum.toString();
            if (currHourNum >= 12) {
                var AMorPM = "pm";
            } else {
                var AMorPM = "am";
            }
        }
        let currMinute = (Math.floor(i) === i ? '00' : '30');
        let currTime = currHour.concat(":", currMinute,AMorPM);
        let currTimeId = "time-".concat(currHourNum.toString(),"-",currMinute);

        // create table row element
        var newTr = document.createElement("tr");
        newTr.setAttribute("id", currTimeId);

        // create variables for pee/poo/accident
        var pee = todaysData[currTimeId]["pee"]; 
        var poo = todaysData[currTimeId]["poo"];
        var accident = todaysData[currTimeId]["accident"];
        var peeIcon = `<button class="pee-button" onClick=flipButton("${currTimeId}","pee")>` + `<i class="bi bi-droplet${pee ? "-fill" : ""}"></i></button>`;
        var pooIcon = `<button class="poo-button" onClick=flipButton("${currTimeId}","poo")>` + `<i class="bi bi-egg${poo ? "-fill" : ""}"></i></button>`;
        var accidentIcon = `<button class="accident-button" onClick=flipButton("${currTimeId}","accident")>` + `<i class="bi bi-exclamation-circle${accident ? "-fill" : ""}"></i></button>`;

        newTr.innerHTML = `
            <th scope="row">${currTime}</th>
            <td>${peeIcon}</td>
            <td>${pooIcon}</td>
            <td>${accidentIcon}</td>
        `
        newTbody.appendChild(newTr); 
    }
    return newTbody;
};

function flipButton(timeId, type) {
    let icon = document.querySelector("#"+timeId+" > td > button."+type+"-button > i");
    let oldClassName = icon.className;
    // test if the className has "fill" (i.e. only the case for toggle == 'true')
    if (oldClassName.search("fill") !== -1) {
        // found "fill" -> it's set to 'true' -> toggle to false
        let oldClassName = icon.className;
        icon.className = oldClassName.replace("-fill", "");
    } else {
        icon.className = oldClassName + "-fill";
    };
    todaysData[timeId][type] = !todaysData[timeId][type];
    localStorage.setItem('todaysData', JSON.stringify(todaysData));
}

