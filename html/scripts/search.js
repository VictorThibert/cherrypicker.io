var keys;

keys = [
  {
    "Team":"Atlanta Hawks",
    "ID":37
  },
  {
    "Team":"Boston Celtics",
    "ID":38
  },
  {
    "Team":"Brooklyn Nets",
    "ID":51
  },
  {
    "Team":"Charlotte Hornets",
    "ID":66
  },
  {
    "Team":"Chicago Bulls",
    "ID":41
  },
  {
    "Team":"Cleveland Cavaliers",
    "ID":39
  },
  {
    "Team":"Dallas Mavericks",
    "ID":42
  },
  {
    "Team":"Denver Nuggets",
    "ID":43
  },
  {
    "Team":"Detroit Pistons",
    "ID":65
  },
  {
    "Team":"Golden State Warriors",
    "ID":44
  },
  {
    "Team":"Houston Rockets",
    "ID":45
  },
  {
    "Team":"Indiana Pacers",
    "ID":54
  },
  {
    "Team":"Los Angeles Clippers",
    "ID":46
  },
  {
    "Team":"Los Angeles Lakers",
    "ID":47
  },
  {
    "Team":"Memphis Grizzlies",
    "ID":63
  },
  {
    "Team":"Miami Heat",
    "ID":48
  },
  {
    "Team":"Milwaukee Bucks",
    "ID":49
  },
  {
    "Team":"Minnesota Timberwolves",
    "ID":50
  },
  {
    "Team":"New Orleans Pelicans",
    "ID":40
  },
  {
    "Team":"New York Knicks",
    "ID":52
  },
  {
    "Team":"Oklahoma City Thunder",
    "ID":60
  },
  {
    "Team":"Orlando Magic",
    "ID":53
  },
  {
    "Team":"Philadelphia 76ers",
    "ID":55
  },
  {
    "Team":"Phoenix Suns",
    "ID":56
  },
  {
    "Team":"Portland Trailblazers",
    "ID":57
  },
  {
    "Team":"Sacramento Kings",
    "ID":58
  },
  {
    "Team":"San Antonio Spurs",
    "ID":59
  },
  {
    "Team":"Toronto Raptors",
    "ID":61
  },
  {
    "Team":"Utah Jazz",
    "ID":62
  },
  {
    "Team":"Washington Wizards",
    "ID":64
  }
]

start();


function onSelect(d) {
    sankeyRender(d.ID); 
    renderPara(d.ID); 
    location.hash = d.ID;
}

function start() {
    var mc = autocomplete(document.getElementById('search'))
            .keys(keys)
            .dataField("Team")
            .placeHolder("Search Teams")
            .width(960)
            .height(500)
            .onSelected(onSelect)
            .render();
}