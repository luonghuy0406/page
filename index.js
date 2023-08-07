var query = window.location.search.substring(1);
function parse_query_string(query) {
  var vars = query.split("&");
  var query_string = {};
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    var key = decodeURIComponent(pair.shift());
    var value = decodeURIComponent(pair.join("="));
    // If first entry with this name
    if (typeof query_string[key] === "undefined") {
      query_string[key] = value;
      // If second entry with this name
    } else if (typeof query_string[key] === "string") {
      var arr = [query_string[key], value];
      query_string[key] = arr;
      // If third or later entry with this name
    } else {
      query_string[key].push(value);
    }
  }
  return query_string;
}

var qs = parse_query_string(query);
if(qs.hasOwnProperty('id_css')){
    fetch('https://demo1704728.mockable.io/'+qs['id_css'])
    .then(response => response.text())
    .then(data => {
      data = JSON.parse(data)
      setConfigToCss(data)
        WebFont.load({
            google: {
            families: [data['font_family']]
            }
        })
    })
    .catch(error => {
      console.error('Error fetching CSS:', error);
    });
}


window.addEventListener('message', function(event) {
    if(event.data){
        let data = JSON.parse(event.data)
        if(data.type == "preview"){
            setConfigToCss(data.value)
            WebFont.load({
                google: {
                families: [data.value['font_family']]
                }
            })
        }
    }
});


function hexToRgbA(hex, opacity){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+opacity+')';
    }
    throw new Error('Bad Hex');
}

function setConfigToCss(data){
    

    let r = document.querySelector(':root');
    
    for (const [key, value] of Object.entries(data)) {
        let valueTheme = value
        if(!valueTheme)
            continue
        switch (key) {
            case 'font_family':
                r.style.setProperty("--"+key.replace(/\_/g,"-"),`${valueTheme}, sans-serif`);
                break;
            case 'background_brightness':
                valueTheme = valueTheme ? valueTheme : 0
                let colorBrightNess =valueTheme >= 0 ? 255 : 0;
                let brightNess = Math.abs(valueTheme/100);
                r.style.setProperty("--color-brightness",colorBrightNess);
                r.style.setProperty("--background-image-brightness",brightNess);
                break;
            case 'color':
                r.style.setProperty("--color",valueTheme);
                break
            case 'font_size':
                let fontSize = valueTheme.replace("px","")
                r.style.setProperty("--font-size",valueTheme);
                r.style.setProperty("--font-size-mobile",(fontSize - (fontSize/5))+"px");
                break
            default:
                r.style.setProperty("--"+key.replace(/\_/g,"-"), valueTheme);
                break;
        }
        
    }

}
