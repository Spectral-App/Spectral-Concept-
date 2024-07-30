let enabledPlugins = [];

function loadPlugin(file,type) {
    if (type === 'theme') {
        const css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = file;
        document.head.appendChild(css);
    } else if (type === 'script') {
        const script = document.createElement('script');
        script.src = file;
        script.type = 'text/javascript';
  
        document.body.appendChild(script);
    }
}