var deck = [];
var pos = 0;
var flipped = false;

var setSelect = document.getElementById("set");
var card = document.getElementById("card");

// sets follow the spelling trainer: set n is every 20th word starting at word n
function inSet(c, n) {
    return (c.n - 1) % 20 == n - 1;
}

function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

function fillSets() {
    let opts = '<option value="0">All ' + vocab2027.length + ' words</option>';
    for (let n = 1; n <= 20; n++) {
        let k = vocab2027.filter(c => inSet(c, n)).length;
        opts += '<option value="' + n + '">Set ' + n + ' (' + k + ' words)</option>';
    }
    setSelect.innerHTML = opts;
}

function loadDeck() {
    let n = parseInt(setSelect.value);
    deck = n ? vocab2027.filter(c => inSet(c, n)) : vocab2027.slice();
    pos = 0;
    show(false);
}

function shuffle() {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    pos = 0;
    show(false);
}

function show(back) {
    flipped = back;
    let c = deck[pos];
    let qual = c.qual.length ? '<div class="qual">(' + c.qual.join(", ") + ')</div>' : "";
    let html;
    if (!back) {
        html = '<div class="front"><div class="word">' + esc(c.front) + '</div>' + qual;
        c.notes.forEach(n => html += '<p class="note">' + esc(n) + '</p>');
        html += '</div>';
    } else {
        html = '<div class="back">';
        c.blocks.forEach(function (b) {
            if (b.head) html += '<h3>' + esc(b.head) + '</h3>';
            b.defs.forEach(function (d) {
                if (d.label) html += '<div class="pos">' + esc(d.label) + '</div>';
                html += '<ol' + (d.senses.length == 1 ? ' class="single"' : '') + '>';
                d.senses.forEach(s => html += '<li>' + esc(s) + '</li>');
                html += '</ol>';
            });
        });
        html += '</div>';
    }
    card.innerHTML = html;
    document.getElementById("count").textContent = (pos + 1) + " of " + deck.length;
    document.getElementById("flip").textContent = back ? "Show word" : "Flip";
}

function move(d) {
    pos = (pos + d + deck.length) % deck.length;
    show(false);
}

card.addEventListener("click", () => show(!flipped));
document.getElementById("flip").addEventListener("click", () => show(!flipped));
document.getElementById("prev").addEventListener("click", () => move(-1));
document.getElementById("next").addEventListener("click", () => move(1));
document.getElementById("shuffle").addEventListener("click", shuffle);
setSelect.addEventListener("change", loadDeck);

document.addEventListener("keydown", function (e) {
    if (e.target == setSelect) return;
    if (e.target.tagName == "BUTTON" && (e.key == " " || e.key == "Enter")) return;
    if (e.key == "ArrowRight") move(1);
    else if (e.key == "ArrowLeft") move(-1);
    else if (e.key == " " || e.key == "Enter") {
        e.preventDefault();
        show(!flipped);
    }
});

fillSets();
loadDeck();
