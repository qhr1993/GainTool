function loadRawData(url,element_fft,element_histo)
{
	var xmlhttp;
	var parser;
	xmlhttp=null;
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
		xmlhttp.onreadystatechange = function(element_fft,element_histo){state_Change(element_fft,element_histo)};
		xmlhttp.open("GET",url,true);
		//"realtime-display.cgi?request=rdata"
		xmlhttp.send(null);
		setTimeout('loadRawData(url,element_fft,element_histo)', 2000);
	}
	else
	{
		alert("Your browser does not support XMLHTTP.");
	}
}

function state_Change(element_fft,element_histo)
{
	if (xmlhttp.readyState==4)
	{// 4 = "loaded"
		if (xmlhttp.status==200)
		{// 200 = OK
			var param = xhr.responseText;
			var xmlDoc;
			var chan,time,bitwidth,tmpBuf;
			var rawDataI = new Array(32768);
			var rawDataQ = new Array(32768);
			var histo = new Array(256);
			var b = 0;
			for (b=0;b<256;b++)	histo[b] = 0;
			if (window.DOMParser)
			{
				parser=new DOMParser();
				xmlDoc=parser.parseFromString(param,"text/xml");
			}
			else // Internet Explorer
			{
				xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
				xmlDoc.async="false";
				xmlDoc.loadXML(param);
			}
			chan = xmlDoc.getElementsByTagName("chan")[0].childNodes[0].nodeValue;
			time = xmlDoc.getElementsByTagName("time")[0].childNodes[0].nodeValue;
			bitwidth = xmlDoc.getElementsByTagName("bitwidth")[0].childNodes[0].nodeValue;
			tmpBuf = xmlDoc.getElementsByTagName("data")[0].childNodes[0].nodeValue;
			for (b=0;b<32768;b++)
			{
				rawDataI.push(tmpBuf.charCodeAt(2*b) - 32768);
				rawDataQ.push(tmpBuf.charCodeAt(2*b+1) - 32768);
				if (parseInt(bitwidth)>8)
				{
					histo[rawDataI[b]/Math.pow(2,(parseInt(bitwidth)-8))] = histo[rawDataI[b]/Math.pow(2,(parseInt(bitwidth)-8))] + 1;
				}
				else
					histo[rawDataI[b]] = histo[rawDataI[b]] + 1;
			}
			if (parseInt(bitwidth)<8)	histo = histo.splice(0,Math.pow(2,(parseInt(bitwidth))));
			var data = new complex_array.ComplexArray(32768);
			data.map(function(value, i, n) {
						value.real = rawDataI[i];
						value.img = rawdataQ[i];
					});
			data.FFT();
			drawToCanvas(element_fft,data);
			drawToCanvas(element_histo,histo);
		}
		else
		{
			alert("Problem retrieving XML data");
		}
	}
}


function drawToCanvas(element_id, data) {
        var
          element = document.getElementById(element_id)
          canvas = document.createElement('canvas'),
          context = canvas.getContext('2d'),
          width = element.clientWidth,
          height = element.clientHeight,
          n = data.length;

        canvas.width = width;
        canvas.height = height;
        element.appendChild(canvas);

        context.strokeStyle = 'blue';
        context.beginPath();
        data.forEach(function(c_value, i) {
          context.lineTo(
            i * width / n,
            height/2 * (1.5 - c_value.real)
          )
        });
        context.stroke();
      }
//<chan><time><data><bitwidth>
//to shm: chan,time,bitwidth