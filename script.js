$("#text_input").keyup(function(e){
    if(e.keyCode == 13){
        submit();
    }
});

var w2023_l = w2023.length;
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
    console.log(w2023[0])
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
    $("#toggle1").hide();
    $("#text_input").val("");

    /* had to change the way 'toggle2' was toggled (shown below) bcz the new CSS messed it up somehow
    original was just $("#toggle2").show(); and toggle2 used to be an id rather than a class */
    var elem = document.getElementsByClassName("toggle2")
    for (var i = 0; i < elem.length; i++) {
        elem[i].style.display = "block";
    }

    do{
        word_idx = Math.floor(Math.random() * w2023_l);
    }while(!chk_word());
    used_idx.push(word_idx);
    word = w2023[word_idx][0];
    word_url = w2023[word_idx][1];
    audio();
}

function submit(){
    let typed = $("#text_input").val();
    if(typed === word){
        correct++;
        $("#correct").append("<br><b>" + word + "</b>");
    }else{
        $("#incorrect").append("<br><b>" + word + "</b> (You entered: " + typed + ")");
    }
    total++;
    let percent = Math.round(correct / total * 100);
    $("#stats").text(correct.toString() + " out of " + total.toString() + " correct (" + percent.toString() + "%)");
    start();
}