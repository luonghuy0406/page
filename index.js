// Insert font loader library
(function (document) {
  var webFontScript = document.createElement('script');
  var firstScript = document.getElementsByTagName('script')[0];

  // Load WebFont Loader asynchronously from Google CDN
  webFontScript.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
  webFontScript.async = true;
  firstScript.parentNode.insertBefore(webFontScript, firstScript);

  // Create and append a stylesheet link for your CSS file
  var head = document.head || document.getElementsByTagName('head')[0];
  var cssLink = document.createElement('link');
  cssLink.rel = 'stylesheet';
  cssLink.type = 'text/css';
  cssLink.href = 'https://builder.rtworkspace.com/assets/index.css';
  head.appendChild(cssLink);

  // Callback function to be executed once WebFont is loaded
  function initialize() {
    // Get params
    var query = window.location.search.substring(1);
    var qs = parse_query_string(query);

    // Load config from DB
    if (qs.hasOwnProperty('css_id')) {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer 5H3rdDo0zc3TM_GsZlYMgnHBAVDQJ3h3");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
      //get config from id
      fetch(`https://eventlog.rta.vn/items/landing_page_template_config?filter[id][_eq]=${qs['css_id']}&filter[status][_eq]=active`, requestOptions)
        .then(response => response.text())
        .then(data => {
          data = JSON.parse(data);
          data = data.data[0].settings;
          setConfigToCss(data);
          WebFont.load({
            google: {
              families: [data['font_family']]
            }
          });
        })
        .catch(error => {
          console.error('Error fetching CSS:', error);
        });
    }

    // Load config preview
    window.addEventListener('message', function (event) {
      if (event.data && event?.data?.indexOf('chatwoot-widget')==-1) {
        try {
          let data = JSON.parse(event.data);
          if (data.type == "preview") {
            setConfigToCss(data.value);
            WebFont.load({
              google: {
                families: [data.value['font_family']]
              }
            });
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  // Event listener for WebFont load event
  webFontScript.addEventListener('load', initialize);


})(document);

/**
 * Function
 */

function parse_query_string(query) {
  var vars = query.split("&");
  var query_string = {};
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    var key = decodeURIComponent(pair[0]);
    var value = decodeURIComponent(pair[1]);
    // If first entry with this name
    if (typeof query_string[key] === "undefined") {
      query_string[key] = decodeURIComponent(value);
      // If second entry with this name
    } else if (typeof query_string[key] === "string") {
      var arr = [query_string[key], decodeURIComponent(value)];
      query_string[key] = arr;
      // If third or later entry with this name
    } else {
      query_string[key].push(decodeURIComponent(value));
    }
  }
  return query_string;
}

function setConfigToCss(data) {
  let r = document.querySelector(':root');

  for (const [key, value] of Object.entries(data)) {
    let valueTheme = value;
    if (!valueTheme)
      continue;
    switch (key) {
      case 'font_family':
        r.style.setProperty("--" + key.replace(/\_/g, "-"), `${valueTheme}, sans-serif`);
        break;
      case 'background_image':
        let background =  valueTheme.indexOf("gradient") > -1 ? valueTheme : `url('${valueTheme}')`
        r.style.setProperty("--background-image", background);
        break;
      case 'background_brightness':
        valueTheme = valueTheme ? valueTheme : 0;
        let colorBrightNess = valueTheme >= 0 ? 255 : 0;
        let brightNess = Math.abs(valueTheme / 100);
        r.style.setProperty("--color-brightness", colorBrightNess);
        r.style.setProperty("--background-image-brightness", brightNess);
        break;
      case 'color':
        r.style.setProperty("--color", valueTheme);
        break;
      case 'font_size':
        let fontSize = valueTheme.replace("px", "");
        r.style.setProperty("--font-size", valueTheme);
        r.style.setProperty("--font-size-mobile", (fontSize - (fontSize / 5)) + "px");
        break;
      case 'config_chat':
            if(valueTheme.config_chat_status){
              window.chatwootSettings = {"position":valueTheme.config_chat_position,"rtaBotContextId": valueTheme.config_context_id};
              if (valueTheme.config_chat_position == 'center') {
                    window.chatwootSettings = {"rtaShowCloseButton": false};
              }
              (function(d, t) {
                let BASE_URL = "https://rtchat.rtworkspace.com";
                let g = d.createElement(t),
                  s = d.getElementsByTagName(t)[0];
                g.src = BASE_URL + "/packs/js/sdk.js";
                g.defer = true;
                g.async = true;
                s.parentNode.insertBefore(g, s);
                g.onload = function() {
                  window.chatwootSDK.run({
                    websiteToken: valueTheme.config_chat_token,
                    baseUrl: BASE_URL
                  });
                  if (valueTheme.config_chat_position == 'center') {
                    const styleElement = document.createElement("style");
                    styleElement.innerHTML = `
                      @media only screen and (min-width: 667px) {
                        .woot-widget-holder.woot-elements--right {
                          position: absolute !important;
                          top: 0 !important;
                          right: 0 !important;
                          bottom: 0 !important;
                          left: 0 !important;
                          margin: auto !important;
                          border: none;
                          border-radius:0px !important;
                          width: ${valueTheme.width}% !important;
                          height: ${valueTheme.height}% !important;
                          max-width: unset !important;
                          max-height: unset !important;
                          min-width: unset !important;
                          min-height: unset !important;
                          box-shadow: 0px 0px 5px rgba(0, 0, 0, .16) !important;
                        }
                      }
                    `;
                    // Create a new script element
                    let scriptShowChat = document.createElement('script');

                    // Auto show chat center
                    scriptShowChat.textContent = `
                      window.addEventListener("chatwoot:ready", function () {
                        window.$chatwoot.toggle("open");
                        let iframeEle = document.querySelector('iframe[src*="https://rtchat.rtworkspace.com"]');
                        if (iframeEle) {
                          iframeEle.contentWindow.postMessage("chatwoot-widget:"+JSON.stringify({ event: 'rta-trigger-start-conversation' }),
                            '*'
                          );
                        }
                      })
                    `;
                    
                    // Append the script tag to the document's head or body
                    document.head.appendChild(scriptShowChat);
                    document.head.appendChild(styleElement);
                    observeElements();
                  }
                }
                // Create a new script element
                let script = document.createElement('script');

                // Add your JavaScript code to the script
                script.textContent = `
                  window.addEventListener("chatwoot:ready", function () {
                    let BOT_CONTEXT_ID = "${valueTheme.config_context_id}";
                    let refererURL = new URL(window.location.href);
                    if (BOT_CONTEXT_ID !== null && BOT_CONTEXT_ID.trim() !== '' && !refererURL.searchParams.has('bot_context_id')) {
                      refererURL.searchParams.set('bot_context_id', BOT_CONTEXT_ID);
                    }

                    let iframeEle = document.querySelector('iframe[src*="https://rtchat.rtworkspace.com"]');
                    if (iframeEle) {
                      iframeEle.contentWindow.postMessage(
                        "chatwoot-widget:"+JSON.stringify({ event: 'change-url', ...{ referrerURL: refererURL.toString(), referrerHost: window.location.host } }),
                        '*'
                      );
                    }
                  })

                `;
                
                // Append the script tag to the document's head or body
                document.head.appendChild(script);
              
                function observeElements() {
                  const observer = new MutationObserver(function(mutationsList) {
                    for (let mutation of mutationsList) {
                      if (mutation.type === 'childList') {
                        const chatElement = document.querySelector(".woot-widget-holder");
                        const bubbleElement = document.querySelector(".woot--bubble-holder");
              
                        if (chatElement && bubbleElement) {
                          // Elements are available, manipulate them as needed
                          bubbleElement.style.display = "none";
              
                          // You can now interact with the chatElement and bubbleElement
              
                          // Disconnect the observer since we no longer need it
                          observer.disconnect();
                        }
                      }
                    }
                  });
              
                  observer.observe(document.body, { childList: true, subtree: true });
                }

              })(document, "script");   
            }

            break;
      case 'logo_config':
            if(valueTheme.status){
              (function(d,t){
                const divElement = d.createElement(t);

                // Set any attributes or styles for the div element
                divElement.setAttribute('class', 'rta-logo-config');
                if(valueTheme.logo_url!='##'){
                  divElement.innerHTML = `<img src="${valueTheme.logo_url}" class="btn btn-icon" style="width: auto; height: ${valueTheme.size}px"/>`
                }
               
                const styleElement = d.createElement("style");
                styleElement.innerHTML = `
                    .rta-logo-config {
                      position: absolute;
                      top: ${valueTheme.top}px;
                      left: ${valueTheme.left}px;
                      z-index: 9999999999 !important;
                    }
                    @media only screen and (max-width: 667px){
                      .rta-logo-config {
                          visibility: hidden !important;
                      }
                    }
                    `
                d.head.appendChild(styleElement);
                d.body.appendChild(divElement);
              })(document, "div")
              
            }
      
          break;

          default:
              r.style.setProperty("--"+key.replace(/\_/g,"-"), valueTheme);
              break;
        }
        
    }
  
  }
