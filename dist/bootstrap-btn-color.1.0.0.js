$(function() {
    var searchingClass = "btn-color-";
    var btnCss = 
    '/* inject:btn */ .btn-color-hex{color:#000;background-color:#333;border-color:#444}.btn-color-hex:hover{color:#000;background-color:#222;border-color:#555}.btn-color-hex.focus,.btn-color-hex:focus{color:#000;background-color:#111;border-color:#666}.btn-color-hex.active,.btn-color-hex:active,.open>.btn-color-hex.dropdown-toggle{color:#000;background-color:#222;border-color:#555;background-image:none}.btn-color-hex.active.focus,.btn-color-hex.active:focus,.btn-color-hex.active:hover,.btn-color-hex:active.focus,.btn-color-hex:active:focus,.btn-color-hex:active:hover,.open>.btn-color-hex.dropdown-toggle.focus,.open>.btn-color-hex.dropdown-toggle:focus,.open>.btn-color-hex.dropdown-toggle:hover{color:#000;background-color:#111;border-color:#666;background-image:none}.btn-color-hex.disabled.focus,.btn-color-hex.disabled:focus,.btn-color-hex:disabled.focus,.btn-color-hex:disabled:focus{background-color:#333;border-color:#444}.btn-color-hex.disabled:hover,.btn-color-hex:disabled:hover{background-color:#333;border-color:#444} /* endinject */';
//================
//================
// HELPERS
//================
//================
//http://stackoverflow.com/questions/15604140/replace-multiple-strings-with-multiple-other-strings
    function replaceAll(str,mapObj){
        var re = new RegExp(Object.keys(mapObj).join("|"),"gi");
        return str.replace(re, function(matched){
            return mapObj[matched];
        });
    }

//http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
    function lightenDarkenColor(col, amt) {
        var num = parseInt(col,16);
        var r = (num >> 16) + amt;
        if (r > 255) r = 255;
        else if  (r < 0) r = 0;
        var b = ((num >> 8) & 0x00FF) + amt;
        if (b > 255) b = 255;
        else if  (b < 0) b = 0;
        var g = (num & 0x0000FF) + amt;
        if (g > 255) g = 255;
        else if (g < 0) g = 0;
        return (g | (b << 8) | (r << 16)).toString(16);
    }

//http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb

    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(("#" + hex).replace("##","#"));
        return result ? {
            R: parseInt(result[1], 16),
            G: parseInt(result[2], 16),
            B: parseInt(result[3], 16)
        } : null;
    }

//http://stackoverflow.com/questions/1855884/determine-font-color-based-on-background-color
    function getContrastColor(hex)
    {
        var color = hexToRgb(hex);
        // Counting the perceptive luminance - human eye favors green color... 
        var a = 1 - ( 0.299 * color.R + 0.587 * color.G + 0.114 * color.B)/255;

        var res = (a < 0.5) ? "000" : "fff";
        return res;
    }

//================
// END OF HELPERS
//================

//================
//STYLE INJECTOR
//================
    function injectBtnStyle(btnColor) {

        var hex = btnColor;//.replace(searchingClass, "");
        //remove # prefix if its present
        if (hex[0] == "#") hex = hex.slice(1);
        if(hex.length == 3) {
            //convert to 6 digit hex
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        } 
        /* calling body append will add your new styles to the bottom of the page and override any existing ones */
        var bg = hex; 
        var border = lightenDarkenColor(hex, -5);

        var color = getContrastColor(hex);
        var mapObj = {
            "btn-color-hex":"btn-color-" + btnColor,  
            "333":bg,
            "222":lightenDarkenColor(hex, -10),
            "111":lightenDarkenColor(hex, -17),
            "444":lightenDarkenColor(border, -12),
            "555":lightenDarkenColor(border, -25),
            "666":border, 
            "000":color
        };

        var style = replaceAll('<style type="text/css">' + btnCss + '</style>', mapObj);
        $('head').append(style);
    }

//================
// ON LOAD
//================
    $.btncolor = [];

    $('[data-btn-color]').each(function() {
        var ele = $(this);
        var btnColor = ele.data("btn-color");
        if($.inArray(btnColor, $.btncolor) == -1) {                    
            injectBtnStyle(btnColor);
            $.btncolor.push(btnColor);
        }

        ele.addClass("btn-color-" + btnColor);
    });
    //}
    //FIND ALL BUTTONS THAT NEED STYLE ADDED
    //$('[class*="' + searchingClass + '"]').each(function(i,ele) {
        // var classes = ele.className.split(' ');
        // $.each(classes, function( index, c ) {
        //     if(c.indexOf(searchingClass) > -1) {

        //         if($.inArray(c, $.btncolor) == -1) {                    
        //             injectBtnStyle(c);
        //             $.btncolor.push(c);
        //         }
        //     }
        // });
    //});
});