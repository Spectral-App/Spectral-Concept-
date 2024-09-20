let enabledPlugins = [];

function loadPlugin(file,type) {
    if (type.toLowerCase() === 'theme') {
        const css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = file;
        css.id = encodeText(file);
        document.head.appendChild(css);
    } else if (type.toLowerCase() === 'script') {
        const script = document.createElement('script');
        script.src = file;
        script.id = encodeText(file);
        script.type = 'text/javascript';
  
        document.body.appendChild(script);
    }
}