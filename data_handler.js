var xmlhttp;
var xmlhttp2;
var xmlhttp3;
var xmlhttp4;
var status = "STOPPED";

function loadRawData()
{
	var url = "cgi-bin/request_img_spe.cgi";
	var url2 = "cgi-bin/request_img_his.cgi";
	var element_fft = "fft-div";
	var element_histo = "histo-div";
	var parser;
	xmlhttp=null;
	if (window.XMLHttpRequest)
	{// code for all new browsers
		xmlhttp=new XMLHttpRequest();
		xmlhttp2=new XMLHttpRequest();
	}
	else if (window.ActiveXObject)
	{// code for IE5 and IE6
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		xmlhttp2=new ActiveXObject("Microsoft.XMLHTTP");
	}
	if (xmlhttp!=null)
	{
		xmlhttp.onreadystatechange = state_Change;
		xmlhttp.open("GET",url,true);
		xmlhttp.responseType = 'blob';
		//"realtime-display.cgi?request=rdata"
		xmlhttp.send(null);
		xmlhttp2.onreadystatechange = state_Change2;
		xmlhttp2.open("GET",url2,true);
		xmlhttp2.responseType = 'blob';
		//"realtime-display.cgi?request=rdata"
		xmlhttp2.send(null);
		setTimeout('loadRawData()', 1000);
	}
	else
	{
		alert("Your browser does not support XMLHTTP.");
	}
}

function loadInfo()
{
	var url = "cgi-bin/realtime_info.cgi";
	var parser;
	xmlhttp3=null;
	if (window.XMLHttpRequest)
	{// code for all new browsers
		xmlhttp3=new XMLHttpRequest();
	}
	else if (window.ActiveXObject)
	{// code for IE5 and IE6
		xmlhttp3=new ActiveXObject("Microsoft.XMLHTTP");
	}
	if (xmlhttp!=null)
	{
		xmlhttp3.onreadystatechange = state_Change3;
		xmlhttp3.open("GET",url,true);
		//"realtime-display.cgi?request=rdata"
		xmlhttp3.send(null);
		setTimeout('loadInfo()', 1000);
	}
	else
	{
		alert("Your browser does not support XMLHTTP.");
	}
}


function state_Change()
{
	if (xmlhttp.readyState==4)
	{// 4 = "loaded"
		if (xmlhttp.status==200)
		{// 200 = OK
			
			var blob = xmlhttp.response;
    			var img = document.createElement('img');
    			if ((status!="STOPPED") && (status!="SHUTDOWN") )
    			{
    				img.onload = function(e) {
      				window.URL.revokeObjectURL(img.src); // Clean up after yourself.
    				};
    		img.src = window.URL.createObjectURL(blob);
    		}
    			document.getElementById("fft-div").replaceChild(img,document.getElementById("fft-div").firstChild);
			
		}
	}
}

function state_Change2()
{
	if (xmlhttp2.readyState==4)
	{// 4 = "loaded"
		if (xmlhttp2.status==200)
		{// 200 = OK
			
			var blob = xmlhttp2.response;
    			var img = document.createElement('img');
    			if ((status!="STOPPED") && (status!="SHUTDOWN") )
    			{
    				img.onload = function(e) {
      				window.URL.revokeObjectURL(img.src); // Clean up after yourself.
    				};
    		img.src = window.URL.createObjectURL(blob);
    		}
    			document.getElementById("histo-div").replaceChild(img,document.getElementById("histo-div").firstChild);
		}
	}
}

function state_Change3()
{
	if (xmlhttp3.readyState==4)
	{// 4 = "loaded"
		if (xmlhttp3.status==200)
		{// 200 = OK
			
			var xhr = xmlhttp3.responseText;
		var parser =  new DOMParser();
		var xmlDoc = parser.parseFromString(xhr,"text/xml");
		status = xmlDoc.getElementsByTagName("status")[0].childNodes[0].nodeValue;
		var bw = xmlDoc.getElementsByTagName("bandwidth")[0].childNodes[0].nodeValue;
		var freq = xmlDoc.getElementsByTagName("freq")[0].childNodes[0].nodeValue;
		var signal = xmlDoc.getElementsByTagName("signal")[0].childNodes[0].nodeValue;
		var bitd = xmlDoc.getElementsByTagName("bitdepth")[0].childNodes[0].nodeValue;
		var time = xmlDoc.getElementsByTagName("time")[0].childNodes[0].nodeValue;
		if ((status==="STOPPED") ||(status==="SHUTDOWN"))
    			document.getElementById("info").innerHTML="Status: STOPPED";
    		else
    			document.getElementById("info").innerHTML="Status: <b>"+status+"</b><br/>"
    			+"Time: <b>"+time+" s</b><br/>"
    			+"Signal: "+signal+"<br/>"
    			+"Bandwidth: "+bw+" MHz<br/>"
    			+"Bitdepth: "+bitd+" bits<br/>"
    			+"Centre Freqency: "+freq+" MHz<br/>"
    			;
		}
	}
}

function submitCtrl(object)
{
	var type,value;
	var xmlhttp;
	
	if (object.id==="comboSpec")
	{
		type = "-s";
		switch (object.selectedIndex)
		{
			case 0:
			value = "1";break;
			case 1:
			value = "8";break;
			case 2:
			value = "16";break;
			case 3:
			value = "32";break;
		}
	}
	else if (object.id==="comboHisto")
	{
		type = "-h";
		switch (object.selectedIndex)
		{
			case 0:
			value = "1";break;
			case 1:
			value = "8";break;
			case 2:
			value = "16";break;
			case 3:
			value = "32";break;
		}
	}
	else if (object.name==="chanSel")
	{
		type = "-c";
		value = object.value -1;
	}
	if (window.XMLHttpRequest)
	{// code for all new browsers
		xmlhttp=new XMLHttpRequest();
	}
	else if (window.ActiveXObject)
	{// code for IE5 and IE6
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");

	}
	if (xmlhttp!=null)
	{
		xmlhttp.open("GET","cgi-bin/realtime_ctrl.cgi?"+"key="+type+"&value="+value,true);
		xmlhttp.send(null);
	}
}
function setCtrls(object)
{
	if (window.XMLHttpRequest)
	{// code for all new browsers
		xmlhttp4=new XMLHttpRequest();
	}
	else if (window.ActiveXObject)
	{// code for IE5 and IE6
		xmlhttp4=new ActiveXObject("Microsoft.XMLHTTP");

	}
	if (xmlhttp!=null)
	{
		xmlhttp4.onreadystatechange = state_Change_ctrl;
		xmlhttp4.open("GET","cgi-bin/realtime_ctrl.cgi?key=-q");
		xmlhttp4.send(null);
	}
}
function state_Change_ctrl()
{
	if (xmlhttp4.readyState==4)
	{// 4 = "loaded"
		if (xmlhttp4.status==200)
		{// 200 = OK
			var xhr = xmlhttp4.responseText;
		var parser =  new DOMParser();
		var xmlDoc = parser.parseFromString(xhr,"text/xml");
		var c = parseInt(xmlDoc.getElementsByTagName("c")[0].childNodes[0].nodeValue);
		var s = parseInt(xmlDoc.getElementsByTagName("s")[0].childNodes[0].nodeValue);
		var h = parseInt(xmlDoc.getElementsByTagName("h")[0].childNodes[0].nodeValue);
		var p = parseInt(xmlDoc.getElementsByTagName("p")[0].childNodes[0].nodeValue);
		document.getElementById("chanSel").getElementsByClassName("radio")[c].checked = true;
		document.getElementById("comboSpec").selectedIndex = s;
		document.getElementById("comboHisto").selectedIndex = h;
		document.getElementById("comboFFTPoints").selectedIndex = p;
		
		}
	}
}

