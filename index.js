// window.addEventListener('message', function(e) {
//     if(e.data){
//     document.getElementsByTagName('html')[0].style.color = e.data.color;
//     document.getElementsByTagName('html')[0].style['font-size'] = e.data.fontSize;
//     document.getElementsByTagName('html')[0].style['background-color'] = e.data.backgroundColor;
//     document.getElementsByTagName('html')[0].style['font-family'] = `${e.data.fontFamily}, sans-serif`;
//     WebFont.load({
//         google: {
//         families: [e.data.fontFamily]
//         }
//     })

//   }
// });
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


window.addEventListener('message', function(event) {
    console.log(event.data)
    // if(event.data){
    //     let data = JSON.parse(event.data)
    //     if(data.type == "preview"){
    //         setConfigToCss(data)
    //         if(preThemeConfig['font_family']['value'] != data.value['font_family']['value']){
    //             WebFont.load({
    //             google: {
    //             families: [data.value['font_family']['value']]
    //             }
    //         });
    //         }
    //     }
    // }
});
// setConfigToCss(preThemeConfigreFormSettings)
// if(preThemeConfig['font_family']){
//         WebFont.load({
//         google: {
//         families: [preThemeConfig['font_family']['value']]
//         }
//     });
// }

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

function setConfigToCss(preThemeConfig){
    

    let r = document.querySelector(':root');
    
    for (const [key, value] of Object.entries(preThemeConfig)) {
        let valueTheme = value['value']
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
