var keys;

keys = [
          {"Team":"Atlanta Hawks"},
          {"Team":"Boston Celtics"},
          {"Team":"Brooklyn Nets"},
          {"Team":"Charlotte Hornets"},
          {"Team":"Chicago Bulls"},
          {"Team":"Cleveland Cavaliers"},
          {"Team":"Dallas Mavericks"},
          {"Team":"Denver Nuggets"},
          {"Team":"Detroit Pistons"},
          {"Team":"Golden State Warriors"},
          {"Team":"Houston Rockets"},
          {"Team":"Indiana Pacers"},
          {"Team":"Los Angeles Clippers"},
          {"Team":"Los Angeles Lakers"},
          {"Team":"Memphis Grizzlies"},
          {"Team":"Miami Heat"},
          {"Team":"Milwaukee Bucks"},
          {"Team":"Minnesota Timberwolves"},
          {"Team":"New Orleans Pelicans"},
          {"Team":"New York Knicks"},
          {"Team":"Oklahoma City Thunder"},
          {"Team":"Orlando Magic"},
          {"Team":"Philadelphia 76ers"},
          {"Team":"Phoenix Suns"},
          {"Team":"Portland Trailblazers"},
          {"Team":"Sacramento Kings"},
          {"Team":"San Antonio Spurs"},
          {"Team":"Toronto Raptors"},
          {"Team":"Utah Jazz"},
          {"Team":"Washington Wizard"}
        ];
        
start();

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