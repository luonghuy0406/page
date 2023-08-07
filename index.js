import { WebFont } from 'https://unpkg.com/webfont@1.6.26/dist/webfont.js';

// fetch('https://demo1704728.mockable.io/css')
// .then(response => response.text())
// .then(data => {
//   data = JSON.parse(data)
//   const styleElement = document.createElement('style');
//   styleElement.innerHTML = `
//       html{
//           background:${data.html['backgroundColor']};
//           color:${data.html['color']};
//           font-family:${data.html['font-family']}, sans-serif;
//           font-size:${data.html['fontSize']};
//       }
//   `;
//   document.head.appendChild(styleElement);
// })
// .catch(error => {
//   console.error('Error fetching CSS:', error);
// });
// setConfigToCss(preThemeConfigreFormSettings)
// if(preThemeConfig['font_family']){
//         WebFont.load({
//         google: {
//         families: [preThemeConfig['font_family']['value']]
//         }
//     });
// }

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
