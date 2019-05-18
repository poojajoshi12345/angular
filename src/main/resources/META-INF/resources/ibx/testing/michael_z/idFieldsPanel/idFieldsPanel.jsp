<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision: 1.2 $:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>IA Tree Tester</title>
		<meta http-equiv="X-UA-Compatible" content="IE=EDGE" >
		<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="Expires" content="0" />
		<meta name="google" value="notranslate">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<!--include this script...will boot ibx into the running state-->
		<Script src="<%=request.getContextPath()%>/ibx/resources/ibx.js" type="text/javascript"></script>
		<script type="text/javascript">
			<jsp:include page="/WEB-INF/jsp/global/wf_globals.jsp" flush="false" />
			
			ibx(function()
			{
				console.log("in ibx");
					function loadTree(file, asJson)
					{
						var xmlhttp = new XMLHttpRequest();
					  	xmlhttp.onreadystatechange = function() {
					    	if (this.readyState == 4 && this.status == 200) {
					    		  if (asJson)
					    		  	loadJSONTrees(this);
					    		  else					    	
					    		  	loadXMLTrees(this);
					  		}
					  	};
					  	xmlhttp.open("GET", file , true);
					  	xmlhttp.send();					  	
				  	}
				  	
				  	function loadXMLTrees(ajaxObject)
				  	{
				  		var parser = new DOMParser();
						var xmlDoc = parser.parseFromString(ajaxObject.response,"text/xml");
						loadTrees(xmlDoc)
				  		//var str = new XMLSerializer().serializeToString(xmlDoc);
				  		//console.log(str);
				  	}
				  	
					function loadJSONTree(ajaxObject)
				  	{
				  		var metadata = JSON.parse(ajaxObject.response);
				  		//console.log(metadata);
				  		$(".metadata-tree").ibxWidget("load", metadata);
				  	}				  	
				  	
				  	function loadTrees(obj)
				  	{
				  		$(".dimension-tree").ibxWidget("load", obj);
				  		$(".measure-tree").ibxWidget("load", obj);
				  		$(".fields-panel").ibxWidget("sizeAfterLoad");				  						  						 
				  	}
				  	
				  	
				  	var fieldsPanel = $("<div>").idFieldsPanel().addClass("fields-panel");
				  	$(".main-box").append(fieldsPanel);
				  	var maxHeight = $(window).height();
				  	$(".main-box").css("max-height", "maxHeight");
				  	//loadTree("retail_lite.xml");
				  	loadTree("retail_lite.json", true);
				  	
			
			}, ["/ibi_apps/ibx/testing/michael_z/idFieldsPanel/idFieldsPanelRes.xml"], true);
		</script>

		<style type="text/css">
			.main-box { height: 500px;}
		</style>
	</head>
	
	<body class="ibx-root">
		<div data-ibx-type="ibxHBox" class='main-box'>
		</div>
	</body>
</html>

			