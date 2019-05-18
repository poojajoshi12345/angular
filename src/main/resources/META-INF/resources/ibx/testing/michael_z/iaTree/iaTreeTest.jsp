<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision: 1.6 $:
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
					function loadTree(file, asJson)
					{
						var xmlhttp = new XMLHttpRequest();
					  	xmlhttp.onreadystatechange = function() {
					    	if (this.readyState == 4 && this.status == 200) {
					    		  if (asJson)
					    		  	loadJSONTree(this);
					    		  else
					    		  	loadXMLTree(this);
					  		}
					  	};
					  	xmlhttp.open("GET", file , true);
					  	xmlhttp.send();					  	
				  	}
				  	
				  	function loadXMLTree(ajaxObject)
				  	{
				  		var parser = new DOMParser();
						var xmlDoc = parser.parseFromString(ajaxObject.response,"text/xml");
				  		//var str = new XMLSerializer().serializeToString(xmlDoc);
				  		//console.log(str);
				  		$(".metadata-tree").ibxWidget("load", xmlDoc);
				  	}
				  	
				  	function loadJSONTree(ajaxObject)
				  	{
				  		var metadata = JSON.parse(ajaxObject.response);
				  		//console.log(metadata);
				  		$(".metadata-tree").ibxWidget("load", metadata);
				  	}				  	
				  	
				 	//loadTree("retail_lite.xml");
				  	loadTree("retail_lite.json", true);
				  	
				  	//$(".drop-box").on("ibx_drop", function(e)
				  	$(".drop-box").on("ibx_dragstart ibx_dragover ibx_dragleave ibx_drop", function(e)
				  	{
				  		console.log(e.type);
						var target = $(e.currentTarget);
						var dt = e.dataTransfer;
						if(e.type == "ibx_dragover")
						{
							e.preventDefault();
						}
						else if(e.type == "ibx_drop")
						{
							//debugger;
							var name = dt.getData("dragItem").qualifiedName;
							var label = $("<div>").ibxLabel({"text": name});
							target.append(label);
							
						}
				  	});

			}, ["/ibi_apps/ibx/testing/michael_z/iaTree/mdTree-res.xml"], true);
		</script>

		<style type="text/css">
			.drop-box { margin: 100px; border: 1px solid red; padding: 10px; width: 500px; height: 100px}
		</style>
	</head>
	
	<body class="ibx-root">
		<div data-ibx-type="ibxHBox">
			<div data-ibx-type="idMdTree" data-ibxp-dimensions-only="true" class="metadata-tree"></div>
			<div data-ibx-type="ibxVBox" class="drop-box" data-ibxp-draggable="true"></div>
		</div>
	</body>
</html>

