<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision$:
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
					var xmlhttp = new XMLHttpRequest();
				  	xmlhttp.onreadystatechange = function() {
				    	if (this.readyState == 4 && this.status == 200) {
				    		  myFunction(this);
				  		}
				  	};
				  	xmlhttp.open("GET", "car.xml" , true);
				  	xmlhttp.send();
				  	
				  	function myFunction(xmlObject)
				  	{
				  		var parser = new DOMParser();
						var xmlDoc = parser.parseFromString(xmlObject.response,"text/xml");
				  		var str = new XMLSerializer().serializeToString(xmlDoc);
				  		console.log(str);
				  		$(".metadata-tree").ibxWidget("load", xmlDoc);
				  	}

			}, ["/ibi_apps/ibx/testing/michael_z/iaTree/mdTree-res.xml"], true);
		</script>

		<style type="text/css">
			.select, .list { margin: 10px; border: 1px solid red; padding: 10px;}
		</style>
	</head>
	
	<body class="ibx-root">
		<div data-ibx-type="mdTree" class="metadata-tree"></div>
	</body>
</html>

