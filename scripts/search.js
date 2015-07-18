var keys;

d3.csv("../data/teams.csv",function (csv) {
    keys = csv;
    start();
});

function onSelect(d) {
    alert(d.Team);
}

function start() {
    var mc = autocomplete(document.getElementById('test'))
            .keys(keys)
            .dataField("Team")
            .placeHolder("Search Teams- Start typing here")
            .width(960)
            .height(500)
            .onSelected(onSelect)
            .render();
}