// create our web view
var win = Ti.UI.createWindow({ backgroundColor: "#fff",navBarHidden:true });
var web = Ti.UI.createWebView({ 
	url: "https://news.layervault.com/new",
	enableZoomControls:false
});

		var cssFileName = 'style.css';
	    var cssFromFile = Ti.Filesystem.getFile(cssFileName);
	    var cssContent = Titanium.Filesystem.getFile('style.css');
		

win.addEventListener('android:back', function(e){     
    if (web.canGoBack()) {
            web.setUrl("https://news.layervault.com/new");
            injectCSS();
        } else {
            win.close();
        }
});
// inject our css when the web view finishes loading (because we need to inject into the head element)
web.addEventListener('load', function () {
		// read the css content from styles.css    
		injectCSS();
});

function injectCSS()
{
	if(Ti.Platform.osname=='android') {

	    // clean the contents so we can put them in a JS string
	    var contents = String(cssFromFile.read())
	        .split('\r').join('')
	        .split('\n').join(' ')
	        .split('"').join('\\"');
	    // and run the JavaScript to inject the CSS by setting the URL of the web view
	    // (hint: try running "javascript:alert('Hello, world!');" in your own browser to see what happens
	    web.url = 'javascript:(function evilGenius(){' 
	            + 'var vp=document.createElement("meta");'
	            + 'vp.setAttribute("name","viewport");'
	            + 'vp.setAttribute("content","initial-scale=1.0; maximum-scale=1.0; width=device-width;");'
	            + 'var s=document.createElement("style");'
	            + 's.setAttribute("type","text/css");'
	            + 's.innerHTML="' + contents + '";'
	            + 'document.getElementsByTagName("head")[0].appendChild(s);'
	            + 'document.getElementsByTagName("head")[0].appendChild(vp);'
	        + '})();';
        
	} else {

		// make it available as a variable in the webview    
		web.evalJS("var myCssContent = " + JSON.stringify(String(cssContent.read())) + ";");
		
		// create the style element with the css content
		//<meta name="viewport" content="width=device-width, maximum-scale=1.5" />
		web.evalJS("var vp = document.createElement('meta'); vp.setAttribute('name', 'viewport'); vp.setAttribute('content', 'initial-scale=1.0; maximum-scale=1.0; width=device-width;'); document.getElementsByTagName('head')[0].appendChild(vp);");    
		web.evalJS("var s = document.createElement('style'); s.setAttribute('type', 'text/css'); s.innerHTML = myCssContent; document.getElementsByTagName('head')[0].appendChild(s);");
	}
}
 
// show the web view
win.add(web);
win.open({fullscreen:true});