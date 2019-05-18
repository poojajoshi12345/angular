<%-- Copyright 1996-2018 Information Builders, Inc. All rights reserved. 
 $Revision: 1.2 $:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Insight Designer Canvas</title>
		<meta http-equiv="X-UA-Compatible" content="IE=EDGE" >
		<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="Expires" content="0" />
		<meta name="google" value="notranslate">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<!--include this script...will boot ibx into the running state-->
		<Script src="<%=request.getContextPath()%>/ibx/resources/ibx.js" type="text/javascript"></script>
		<Script src="<%=request.getContextPath()%>/tdg/jschart/distribution/tdgchart-min.js" type="text/javascript"></script>
		<script type="text/javascript">
			<jsp:include page="/WEB-INF/jsp/global/wf_globals.jsp" flush="false" />
			
			ibx(function()
			{
				  	var canvasPanel = $("<div>").idCanvas().addClass("canvas-panel");
				  	$(".main-box").append(canvasPanel);
				  	
				  	$(".sample-button").on("click", function(e) {
				  		this.loadScript("samplechart.json")
				  	}.bind(this));
				  	
				  	$(".real-button").on("click", function(e) {
				  		this.loadScript("realchart.json")
				  	}.bind(this));				  	
				  	
				  	$(".real-button2").on("click", function(e) {
				  		this.loadScript("realchart2.json")
				  	}.bind(this));				  	
				  	
					function loadScript(file)
					{
						var xmlhttp = new XMLHttpRequest();
					  	xmlhttp.onreadystatechange = function() {
					    	if (this.readyState == 4 && this.status == 200) {
					    		loadChart(this);
					  		}
					  	};
					  	xmlhttp.open("GET", file , true);
					  	xmlhttp.send();					  	
				  	}
				  	this.loadScript = loadScript;
				  	
				  	function loadChart(ajaxObject)
				  	{
				  		var oReturn = JSON.parse(ajaxObject.response)
				  		$(".canvas-panel").ibxWidget("loadChart", oReturn);
				  	}
				  	
				  	this.loadScript("samplechart.json");
				
			}, ["/ibi_apps/ibx/testing/michael_z/idCanvas/idCanvasRes.xml"], true);
		</script>

		<style type="text/css">
			.sample-button {margin-top:5px;}
		</style>
	</head>
	
	<body class="ibx-root">
		<div data-ibx-type="ibxHBox" class='main-box'></div>
		<div data-ibx-type="ibxButton" class='sample-button'>Sample chart</div>
		<div data-ibx-type="ibxButton" class='real-button'>Real Chart</div>
		<div data-ibx-type="ibxButton" class='real-button2'>Real Chart 2</div>
	</body>
</html>

