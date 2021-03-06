
var vid_id;
var user_name;
var yt_api_url;
var cat_const;
var lfm_track,lfm_artist;
var parts;
var scrobble_api_sig;
var movie_player;
var elapsed;
var statetimer;
var session_key;
var status;
var scrobble_enabled;
function utf8_encode (argString) {
    // http://kevin.vanzonneveld.net
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: sowberry
    // +    tweaked by: Jack
    // +   bugfixed by: Onno Marsman
    // +   improved by: Yves Sucaet
    // +   bugfixed by: Onno Marsman
    // +   bugfixed by: Ulrich
    // +   bugfixed by: Rafal Kukawski
    // *     example 1: utf8_encode('Kevin van Zonneveld');
    // *     returns 1: 'Kevin van Zonneveld'

    if (argString === null || typeof argString === "undefined") {
        return "";
    }

    var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    var utftext = "",
        start, end, stringl = 0;

    start = end = 0;
    stringl = string.length;
    for (var n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;

        if (c1 < 128) {
            end++;
        } else if (c1 > 127 && c1 < 2048) {
            enc = String.fromCharCode((c1 >> 6) | 192) + String.fromCharCode((c1 & 63) | 128);
        } else {
            enc = String.fromCharCode((c1 >> 12) | 224) + String.fromCharCode(((c1 >> 6) & 63) | 128) + String.fromCharCode((c1 & 63) | 128);
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.slice(start, end);
            }
            utftext += enc;
            start = end = n + 1;
        }
    }

    if (end > start) {
        utftext += string.slice(start, stringl);
    }

    return utftext;
}
function md5 (str) {
    // http://kevin.vanzonneveld.net
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // + namespaced by: Michael White (http://getsprink.com)
    // +    tweaked by: Jack
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // -    depends on: utf8_encode
    // *     example 1: md5('Kevin van Zonneveld');
    // *     returns 1: '6e658d4bfcb59cc13f96c14450ac40b9'
    var xl;

    var rotateLeft = function (lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    };

    var addUnsigned = function (lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    };

    var _F = function (x, y, z) {
        return (x & y) | ((~x) & z);
    };
    var _G = function (x, y, z) {
        return (x & z) | (y & (~z));
    };
    var _H = function (x, y, z) {
        return (x ^ y ^ z);
    };
    var _I = function (x, y, z) {
        return (y ^ (x | (~z)));
    };

    var _FF = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var _GG = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var _HH = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var _II = function (a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var convertToWordArray = function (str) {
        var lWordCount;
        var lMessageLength = str.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = new Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };

    var wordToHex = function (lValue) {
        var wordToHexValue = "",
            wordToHexValue_temp = "",
            lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            wordToHexValue_temp = "0" + lByte.toString(16);
            wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
        }
        return wordToHexValue;
    };

    var x = [],
        k, AA, BB, CC, DD, a, b, c, d, S11 = 7,
        S12 = 12,
        S13 = 17,
        S14 = 22,
        S21 = 5,
        S22 = 9,
        S23 = 14,
        S24 = 20,
        S31 = 4,
        S32 = 11,
        S33 = 16,
        S34 = 23,
        S41 = 6,
        S42 = 10,
        S43 = 15,
        S44 = 21;

    str = this.utf8_encode(str);
    x = convertToWordArray(str);
    a = 0x67452301;
    b = 0xEFCDAB89;
    c = 0x98BADCFE;
    d = 0x10325476;

    xl = x.length;
    for (k = 0; k < xl; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = addUnsigned(a, AA);
        b = addUnsigned(b, BB);
        c = addUnsigned(c, CC);
        d = addUnsigned(d, DD);
    }

    var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);

    return temp.toLowerCase();
}
		
function checkState()
{
	player_state=movie_player.getPlayerState();
	switch(player_state)
	{
		case 1: 	//state playing
			elapsed++;
			break;
		case 2:		//paused state
			break;
		case 3:		//buffering
			break;
		default:
			break;
	}
}
function openAuth()
{
	window.open("http://www.last.fm/api/auth/?api_key=977a73b8d997832303ec0a4bbd516ca7&cb=http://ytfm.ashishdubey.info/authenticate.php");
}
function scrobble_track()
{
statuslabel=document.getElementById("ytfm-status");
remaining_time=20-elapsed;
statuslabel.setAttribute("value","Srobbling in " + remaining_time+ " second(s)");
if(elapsed==0)
{
	movie_player=window.content.document.getElementById("movie_player");
	movie_player =XPCNativeWrapper.unwrap(movie_player);	// unwraps the wrapper object for chrome security		
	elapsed++;
	scrobble_track();

}
else if(elapsed<20)
{
	checkState();
	statetimer=setTimeout(scrobble_track,1000);
}
else{
	time=new Date();
	timestamp=Date.parse(time)/1000;
	api_key="977a73b8d997832303ec0a4bbd516ca7";
	api_sig=md5(utf8_encode("api_key977a73b8d997832303ec0a4bbd516ca7artist[0]"+lfm_artist+"methodtrack.scrobblesk"+session_key+"timestamp[0]"+timestamp+"track[0]"+lfm_track+"8fbe482d4ff9934adde892d53284ea28"));
	post_data="method=track.scrobble&track[0]="+encodeURI(lfm_track)+"&artist[0]="+encodeURI(lfm_artist)+"&sk="+session_key+"&timestamp[0]="+timestamp+"&api_key=977a73b8d997832303ec0a4bbd516ca7&api_sig="+api_sig;
	http=new XMLHttpRequest();
	http.open("POST","http://ws.audioscrobbler.com/2.0/",true);
	http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	http.setRequestHeader('User-Agent','ytfm-app');
	http.send(post_data);
	response=http.responseXML;
	statuslabel.setAttribute("value","");
	
}	

}


//Saves current user's information in global client storage
//The info stored includes the username and session key for the authenticated user
function SaveUserInfo()
{
	doc=window.content.document;
	doc=XPCNativeWrapper.unwrap(doc);
	user_name=doc.getElementById("user-name").getAttribute("value");
	session_key=doc.getElementById("session-key").getAttribute("value");
	globalStorage['ytfm.ashishdubey.info'].setItem("user",user_name);	
	globalStorage['ytfm.ashishdubey.info'].setItem("key",session_key);
	LoadUserInfo();
}
//Loads saved user information from global client storage
//The info stored includes the username and session key for the authenticated user
function LoadUserInfo()
{
	user_name=globalStorage['ytfm.ashishdubey.info'].getItem("user");	
	session_key=globalStorage['ytfm.ashishdubey.info'].getItem("key");
	if(user_name=='') disp_text="[None]";
	else disp_text=user_name;
	document.getElementById("ytfm-userlabel").setAttribute("value",disp_text);
}

//Extracts video id from the currently active url
//url is the global variable which is fed the browser's url address everytime a new url is set or tab is changed
function get_videoID()
{
	v_id_patch=url.split("v=");
	id_offset=v_id_patch[1].indexOf("&");
	if(id_offset==-1) id_offset=v_id_patch[1].length;
	vid_id=v_id_patch[1].substring(0,id_offset);
}

//Entry point invoked as the extension is loaded
//Implements ProgressListener as a urlbarlistener which is invoked every time a url is changed or tab is changed
function init()
{
	LoadUserInfo();
	var myExt_urlBarListener = {
  QueryInterface: function(aIID)
  {
   if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
       aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
       aIID.equals(Components.interfaces.nsISupports))
     return this;
   throw Components.results.NS_NOINTERFACE;
  },
  onLocationChange: function(aProgress, aRequest, aURI)
  {
	if(user_name!='') {
	url=aURI.spec;
	set_URL();	
	}
  },
  onStateChange: function(a, b, c, d) {},
  onProgressChange: function(a, b, c, d, e, f) {},
  onStatusChange: function(a, b, c, d) {},
  onSecurityChange: function(a, b, c) {}
};
 gBrowser.addProgressListener(myExt_urlBarListener,
        Components.interfaces.nsIWebProgress.NOTIFY_LOCATION);

window.addEventListener("OnUserInfoArrival",SaveUserInfo,false,true);

}
//Initializes AJAX YouTube API request if a video id is defined
function set_URL()
{	
	get_videoID();
	if(vid_id)
	{
		elapsed=0;
		yt_api_url="http://gdata.youtube.com/feeds/api/videos/"+vid_id+"?v=2";
		cat_const='http://gdata.youtube.com/schemas/2007/categories.cat';
		http=new XMLHttpRequest();
		http.open("GET",yt_api_url,true);
		http.onreadystatechange=getyoutubedata;
		http.send();
	}
}
//Fetches response to the request created to YouTube API
//Extracts the category name from the video feed
//If category name matches Music then music title and artist identification is done
//The video title is split around a hyphen(-) or a colon(-), if no parts are found the video title is set as the music track title and artist is set unknown
//If parts are found, then it calls checkParts()

function getyoutubedata()
{

	if(http.readyState==4)
	{
		if(http.status==200)
		{
			response_xml=http.responseXML;
			http.abort();
			category_nodes=response_xml.getElementsByTagName("category");
			cat_index=0;
			while(category_nodes[cat_index])
			{
				cat_scheme=category_nodes[cat_index].getAttribute("scheme");
				if(cat_scheme==cat_const)
				{
					cat=category_nodes[cat_index].getAttribute("label");
					break;
				}
				cat_index++;
			}
			if(cat=='Music')
			{
				title=response_xml.getElementsByTagName("title")[0].childNodes[0].nodeValue;
				parts=title.split('-');
				if(parts.length<2)
				{
					lfm_track=parts[0];
					lfm_artist='Unknown';
					parts=title.split(':');
					if(parts.length<2)
					{
						lfm_track=parts[0];
						lfm_artist='Unknown';
						scrobble_track();
					}
					else{check_parts();}
				}
				else{check_parts();}
				
			}
		} // (status==200)
	}//(readystate==4)
}
//Initializes Last.fm API for track search
function check_parts(){

		track_url="http://ws.audioscrobbler.com/2.0/?method=track.search&track="+encodeURI(parts[0])+"&api_key=977a73b8d997832303ec0a4bbd516ca7";
		http2=new XMLHttpRequest();
		http2.open("GET",track_url,true);
		http2.onreadystatechange=getlastfmdata;
		http2.send();
	
}

//Fetches response to Last.fm api request
//Used for music track title and artist identification
//If the first part of video title separated along a hypen(-) or a colon(:) matches with any of the track names in the search results then the first part is set as
//track title and other as artist otherwise the first part is set as artist and the other as track title 
function getlastfmdata()
{
	if(http2.readyState==4)
	{
		if(http2.status==200)
		{
			response_xml=http2.responseXML;
			http2.abort();
			track_matches=response_xml.getElementsByTagName("track");
			track_index=0;
			while(track_matches[track_index])
			{
				track_name=track_matches[track_index].getElementsByTagName("name")[0].childNodes[0].nodeValue;
				if(track_name==parts[0])
				{
					break;
				}
				track_index++;
			}		
			if(track_name==parts[0]) 
			{
				lfm_track=parts[0];
				lfm_artist=parts[1];
			}
			else
			{
				lfm_track=parts[1];
				lfm_artist=parts[0];
			}
			scrobble_track();
			
		}
	}
}	

