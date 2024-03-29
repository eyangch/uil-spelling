$("#text_input").keyup(function(e){
    if(e.keyCode == 13){
        submit();
    }
});

var missed = [];

var clicked = 1;
function select(cell) {
    let cells = document.querySelectorAll("td");
    for (let i = 0; i < cells.length; ++i) {
        cells[i].style.backgroundColor = "#f9f9f9";
    }
    cell.style.backgroundColor = "#008aff";

    clicked = cell.innerHTML;

    // now add pronunciations
    txt = "<ul>\n";
    for (var i = parseInt(clicked)-1; i < 1500; i += 20) {
        txt += "\t<li>" + w2024[i][0].split("|")[0];
        txt += "<a onclick=\"word_url=w2024[" + i + "][1];audio();\">▶️</button></li>\n";
    }
    txt += "</ul>\n";

    document.getElementById("pron").innerHTML = txt;
    missed = [];
}


var w2024_l = w2024.length;
var word_url = "";
var word = "";
var word_idx;

var used_idx = [];

var correct = 0;
var total = 0;

function audio(){
    let a = new Audio(word_url);
    a.play();
}

function test(){
    audio("https://www.ahdictionary.com/application/resources/wavs/T0070900.wav");
    console.log(w2024[0])
}

function chk_word(){
    for(let i = 0; i < used_idx.length; i++){
        if(word_idx == used_idx[i]){
            return false;
        }
    }
    return true;
}

function start(){
    //test();
    var rem = document.getElementsByClassName("toggle1");
    for (var i = 0; i < rem.length; i++) {
        rem[i].style.display = "none";
    }
    $("#text_input").val("");

    /* had to change the way 'toggle2' was toggled (shown below) bcz the new CSS messed it up somehow
    original was just $("#toggle2").show(); and toggle2 used to be an id rather than a class */
    var elem = document.getElementsByClassName("toggle2");
    for (var i = 0; i < elem.length; i++) {
        elem[i].style.display = "block";
    }

    if (used_idx.length == 75) {
        var hide = document.getElementsByClassName("toggle2");
        var show = document.getElementsByClassName("toggle3");

        for (var i = 0; i < hide.length; i++) {
            hide[i].style.display = "none";
        }
        for (var i = 0; i < show.length; i++) {
            show[i].style.display = "block";
        }

        document.getElementById("msg-set").innerHTML += clicked.toString() + "!";
        document.getElementById("msg-right").innerHTML += correct.toString() + " of them right!"

        // ok now add list of wrong words
        var miss_txt = "";
        missed.sort((a,b) => a.localeCompare(b, undefined, {sensitivity: 'base'}));
        missed.forEach(
            function app(s) {
                miss_txt += "<li>" + s + "</li>\n";
            }
        );
        document.getElementById("end_wrong").innerHTML = miss_txt;

        return;
    }
    do {
        word_idx = Math.floor(Math.random() * 75) * 20 + parseInt(clicked) - 1;
    } while (!chk_word());
    used_idx.push(word_idx);
    word = w2024[word_idx][0];
    word_url = w2024[word_idx][1];
    audio();
}

function submit(){
    let typed = $("#text_input").val();
    const arr = word.split("|");
    var b = false;
    arr.forEach(function check(s) {
        if (typed === s) {
            b = true;
        }
    });

    if(b == true){
        correct++;
        $("#correct").append("<br><b>" + word + "</b>");
    }else{
        $("#incorrect").append("<br><b>" + word + "</b> (You entered: " + typed + ")");
        missed.push(word);
    }
    total++;
    let percent = Math.round(correct / total * 100);
    $("#stats").text(correct.toString() + " out of " + total.toString() + " correct (" + percent.toString() + "%)");
    start();
}

var buttons = document.querySelectorAll(".insert");
var field = document.getElementById("text_input");
buttons.forEach( function(button) {
    button.addEventListener('click', function() {
        field.value = field.value + button.value;
    })
});