<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision$:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>test</title>
		<meta http-equiv="X-UA-Compatible" content="IE=11" >
		<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="Expires" content="0" />
		<meta name="google" value="notranslate">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<!--include this script...will boot ibx into the running state-->
		<Script src="<%=request.getContextPath()%>/ibx/resources/ibx.js" type="text/javascript"></script>
		<script type="text/javascript">
			var packages = 
			[
				{"src":"./test_res_bundle.xml", "loadContext":"app"},
			]
			ibx(function()
			{
				var res = ibx.resourceMgr.getResource(".test-markup", false);
				var x = $("<div>").ibxPopup();
				x.ibxWidget("add", res);
				ibx.bindElements(x);
				x.ibxWidget("open")

			}, packages, true);
		</script>
		<style type="text/css">
			html, body
			{
				width:100%;
				height:100%;
				margin:0px;
				box-sizing:border-box;
			}
			.test-color-picker, .test-pal-picker
			{
				background-color:white;
				border:1px solid black;
				padding:10px;
				margin:10px;
			}
		</style>
	</head>

	<body class="ibx-root">
		<div data-ibx-type="ibxWidget" data-ibx-name-root="true">
			
		</div>
	</body>
</html>
