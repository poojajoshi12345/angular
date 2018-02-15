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
			<jsp:include page="/WEB-INF/jsp/global/wf_globals.jsp" flush="false" />

			ibx(function()
			{
				$("#cmdClear").on("ibx_triggered", function(e)
				{
					console.clear();
					//$(".ibx-menu-button").css("visibility", "hidden");
					//$(".temp").focus();
					//$(".ibx-menu").ibxWidget("close");
					//$(".ibx-menu").css("visibility", "hidden");
					//$(".ibx-menu-button").focus();
					$(".ibx-menu").addClass("pop-closed");
					//console.log(document.activeElement);
				});
				/*
				Ibfs.load().done(function()
				{
					Ibfs.ibfs.login("admin", "admin").done(function(e)
					{
						console.log("ibfs logged in.");
					});
				});
				*/
			}, [{src:"./test_res_bundle.xml", loadContext:"app"}], true);
		</script>
		<style type="text/css">
			html, body
			{
				width:100%;
				height:100%;
				margin:0px;
				box-sizing:border-box;
			}

			.test-menu-button
			{
				position:absolute;
				left:200px;
				top:50px;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div id="cmdClear" data-ibx-type="ibxCommand" data-ibxp-shortcut="CTRL+C"></div>
		<div id="menuButton" class="test-menu-button" tabindex="0" data-ibx-type="ibxMenuButton">
			Menu
			<div id="menu" data-ibx-type="ibxMenu">
				<div id="menuItem1" data-ibx-type="ibxMenuItem">Item</div>
			</div>
		</div>
	</body>
</html>
