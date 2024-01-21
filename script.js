let day = [], time = [], senderList = [], participants = [], message = [];
let colors = ["white", "aqua", "blueviolet", "burlywood", "chartreuse", "chocolate", "gold", "hotpink", "mediumpurple", "aquamarine", "orange", "orchid", "tomato", "violet", "yellow", "yellowgreen", "cornflowerblue"];
let nMessage, nParticipants;

$(document).ready(function () {
    // $("#formInputFile").hide();
    $("#chatFuncCont").hide();
    $("#formChooseMit").hide();

})



function readFile(input) {
    let file = input.files[0];
    let reader = new FileReader();

    reader.readAsText(file);

    reader.onload = function () {
        transformFile(reader.result);
        $("#formInputFile").hide();
    };

    reader.onerror = function () {
        console.log(reader.error);
    };

}

function changeModRead(tipo) {
    console.log(tipo);
}

function transformFile(file) {
    fileTxtList = file.split("[");
    fileTxtList.shift();
    nMessage = fileTxtList.length;
    day = [], time = [], senderList = [], participants = ["Nessuno"], messageTxt = [];
    nParticipants = 1;
    for (i = 0; i < nMessage; i++) {
        message = fileTxtList[i];
        message = message.split("] "); // message[0] sono le informazioni, message[1] è il messaggio 
        // Ottenere le informazioni
        information = message[0].split(", ");
        day.push(information[0]);
        time.push(information[1].slice(0, 5));
        // Ottenere il mittente
        sender = message[1].split(": ");
        senderList.push(sender[0]);
        // Ottenere il messaggio
        messageTxt.push(sender[1]);
        x = 0;
        esci = false;
        while (x < nParticipants && esci == false) {
            if (senderList[i] == participants[x]) {
                esci = true;
            }
            x++;
        }

        if (esci == false) {
            nParticipants += 1;
            participants.push(senderList[i]);
        }
    }

    // Creazione di #formChooseMit
    console.log("Trasformazione avvenuta correttamente");

    cont = document.getElementById("formChooseMit");
    form = document.createElement("form");

    for (i = 0; i < nParticipants; i++) {
        input = document.createElement("input");
        label = document.createElement("label");
        br = document.createElement("br");
        input.setAttribute("type", "radio");
        input.setAttribute("name", "chooseMit");
        nome = participants[i];

        input.setAttribute("id", nome);
        input.setAttribute("onchange", `chooseMitChange("${nome}")`);
        form.appendChild(input);
        label.setAttribute("for", nome);
        label.innerHTML = nome;
        form.appendChild(label);
        form.appendChild(br);

    }
    cont.appendChild(form);

    //Set bottoni end start chat
    document.getElementById("startChatBtn").href = "#0";
    document.getElementById("endChatBtn").href = `#${nMessage - 1}`;

    $("#formChooseMit").show();
}



function printChat() {
    let currentDate = day[0], lastMess = true, mit, nome, color, j, esci = false;
    addDate(currentDate);
    printNum();
    
    for (i = 0; i < nMessage; i++) {
        if (currentDate != day[i]) {
            currentDate = day[i];
            addDate(currentDate);
            lastMess = true;
        }

        if (senderList[i] == participants[0]) { // Int
            nome = "";
            mit = "int";
        } else { // Ext
            if (nParticipants == 2) {
                nome = "";
            } else if (nParticipants > 2) {
                nome = senderList[i];
            }
            mit = "ext";
        }

        if (nParticipants > 2) { // Aggiunta coloresu nome
            j = 0;
            esci = false;
            while (j < nParticipants && esci == false) {
                if (senderList[i] == participants[j]) {
                    color = colors[j];
                    esci = true;
                }
                j++;
            }
        }

        addMessage(time[i], messageTxt[i], mit, i, lastMess, nome, color);

        if (senderList[i] == senderList[i + 1]) { lastMess = false; }
        else { lastMess = true; }
    }

    $("#chatFuncCont").show();
}


function addMessage(ora, messaggio, mit, messN, lastMess, nome, color) {
    let cont, messCont, messageCont, p;
    cont = document.getElementById("bodyChat");
    // Contenitore
    messCont = document.createElement("div");
    messCont.setAttribute("id", messN);
    if (mit == "ext") {
        messCont.setAttribute("class", "messageExtCont");
        if (lastMess == false) {
            messCont.setAttribute("style", "transform: translateX(8px); margin-top: -0.5%;");
        } else {
            messCont.innerHTML = `<svg viewBox="0 0 8 13" height="13" width="8" preserveAspectRatio="xMidYMid meet" version="1.1" x="0px" y="0px" enable-background="new 0 0 8 13"><title>tail-in</title><path opacity="0.13" fill="#0000000" d="M1.533,3.568L8,12.193V1H2.812 C1.042,1,0.474,2.156,1.533,3.568z"></path><path fill="currentColor" d="M1.533,2.568L8,11.193V0L2.812,0C1.042,0,0.474,1.156,1.533,2.568z"></path></svg>`;
        }
    } else if (mit == "int") {
        messCont.setAttribute("class", "messageIntCont");
        if (lastMess == false) {
            messCont.setAttribute("style", "transform: translateX(-8px); margin-top: -0.5%;");
        } else {
            messCont.innerHTML = `<svg viewBox="0 0 8 13" height="13" width="8" preserveAspectRatio="xMidYMid meet" class="" version="1.1" x="0px" y="0px" enable-background="new 0 0 8 13"><title>tail-out</title><path opacity="0.13" d="M5.188,1H0v11.193l6.467-8.625 C7.526,2.156,6.958,1,5.188,1z"></path><path fill="currentColor" d="M5.188,0H0v11.193l6.467-8.625C7.526,1.156,6.958,0,5.188,0z"></path></svg>`;
        }
    }

    cont.appendChild(messCont);

    // aggiunta message Ext
    messageCont = document.createElement("div");
    if (mit == "ext") { messageCont.setAttribute("class", "messageExt message") } else
        if (mit == "int") { messageCont.setAttribute("class", "messageInt message"); }

    if (lastMess == false) { messageCont.setAttribute("style", "border-radius: 10px;"); }

    //Stampo nome persona se serve e messaggio
    if (nome != "" && lastMess == true) {
        p = document.createElement("p");
        p.setAttribute("style", `padding: 2% 0%; color: ${color};`);
        p.innerHTML = nome;
        messageCont.appendChild(p);
        div = document.createElement("div");
        p = document.createElement("p");
        p.innerHTML = messaggio;
        div.appendChild(p)
        p = document.createElement("p");
        if (mit == "ext") { p.setAttribute("class", "oraExt"); } else
            if (mit == "int") { p.setAttribute("class", "oraInt"); }
        p.innerHTML = ora;
        div.appendChild(p);
        messageCont.appendChild(div);
    } else {
        p = document.createElement("p");
        p.innerHTML = messaggio;
        messageCont.appendChild(p);
        p = document.createElement("p");
        if (mit == "ext") { p.setAttribute("class", "oraExt"); } else
            if (mit == "int") { p.setAttribute("class", "oraInt"); }
        p.innerHTML = ora;
        messageCont.appendChild(p);
    }

    messCont.appendChild(messageCont);
    cont.appendChild(messCont);
}

function addDate(giorno) {
    let cont, div1, div2, p;
    cont = document.getElementById("bodyChat");
    div1 = document.createElement("div");
    div1.setAttribute("class", "giornoC");
    div2 = document.createElement("div");
    p = document.createElement("p");
    p.innerHTML = giorno;
    div2.appendChild(p);
    div1.appendChild(div2);
    cont.appendChild(div1);
}

function chooseMitChange(nome) {
    $("#formChooseMit").hide();
    if (nome != "Nessuno") {
        participants[0] = participants[nParticipants - 1];
        participants.pop();
        nParticipants--;
    }

    if (nome != participants[0]) {
        trov = false;
        i = 0;
        while (i < nParticipants && trov == false) {
            if (nome == participants[i]) {
                s = participants[0];
                participants[0] = participants[i];
                participants[i] = s;
                trov = true;
            }
            i++;
        }
    }
    printChat();
}

function printNum() {
    let cont, div, p, nMess = [], n = nParticipants, nome = [];

    for(i=0; i<nParticipants; i++){
        nome.push(participants[i]);
    }

    cont = document.getElementById("mitt");
    p = document.createElement("p");
    p.innerHTML = participants[0];
    cont.appendChild(p);

    cont = document.getElementById("nParticipants");
    p = document.createElement("p");
    p.innerHTML = nParticipants;
    cont.appendChild(p);

    cont = document.getElementById("nMessage");
    p = document.createElement("p");
    p.innerHTML = nMessage;
    cont.appendChild(p);

    cont = document.getElementById("startChat");
    p = document.createElement("p");
    p.innerHTML = day[0];
    cont.appendChild(p);

    cont = document.getElementById("endChat");
    p = document.createElement("p");
    p.innerHTML = day[nMessage - 1];
    cont.appendChild(p);

    if (nome[0] == "Nessuno") {
        nome[0] = nome[nParticipants - 1];
        nome.pop();
        n--;
    }

    for (i = 0; i < n; i++) {
        risultato = senderList.filter(elemento => elemento === nome[i])
        nMess.push(risultato.length);
    }

    for (var i = 0; i < n - 1; i++) {
        for (var j = 0; j < n - i - 1; j++) {
            if (nMess[j] < nMess[j + 1]) {
                var temp = nMess[j];
                nMess[j] = nMess[j + 1];
                nMess[j + 1] = temp;
                temp = nome[j];
                nome[j] = nome[j + 1];
                nome[j + 1] = temp;
            }
        }
    }

    cont = document.getElementById("num");

    for (i = 0; i < n; i++) {
        div = document.createElement("div");
        p = document.createElement("p");
        p.innerHTML = `${i + 1})${nome[i]} (${Math.round((nMess[i] / nMessage) * 100)}%)`;
        div.appendChild(p);
        p = document.createElement("p");
        p.innerHTML = nMess[i];
        div.appendChild(p);
        cont.appendChild(div);
    }

}
