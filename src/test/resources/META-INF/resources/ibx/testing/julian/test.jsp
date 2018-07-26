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
				//var frame = ibx.resourceMgr.getResource(".test-frame", true).addClass("test-widget");
				//$("body").append(frame);

				var container = $(".test-container");
				for(var i = 0; i < 50; ++i)
				{
					var item = $("<div tabindex='0'>").ibxLabel({"text":"Item" + i, "draggable":true, "align":"center", "justify":"center"});
					item.addClass("test-item item"+i);
					container.append(item);
				};

			}, packages, true);
		</script>
		<style type="text/css">
			html, body, .test-container
			{
				width:100%;
				height:100%;
				margin:0px;
				box-sizing:border-box;
			}
			.test-container
			{
				padding:10px;
			}
			.test-item
			{
				width:50px;
				height:50px;
				margin:10px;
				border:1px solid black;
				background-color:thistle;
			}
			.ibx-sm-selected
			{
				outline:2px solid red;
			}
			.ibx-sm-anchor
			{
				background-color:lime;
			}
		</style>
	</head>

	<body class="ibx-root">
		<div class="test-container" data-ibx-type="ibxHBox" data-ibxp-wrap="true" data-ibxp-nav-key-root="true" data-ibxp-sel-type="multi"></div>
		<!--
		<div class="test-widget" data-ibx-type="testFrame"></div>
		-->
	</body>
</html>
