﻿<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision$:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>ibx drag/drop sample</title>
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
				$(".generic-game-frame").genericGame();
			}, [{src:"./dragdrop_bundle.xml", loadContext:"app"}], true);
		</script>
		<style type="text/css">
			html, body, .box-main
			{
				margin:0px;
				height:100%;
				width:100%;
			}
			.generic-game-frame
			{
				display:flex;
				position:absolute;
				left:0px;top:0px;right:0px;bottom:0px;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="generic-game-frame" data-ibx-name-root="true"></div>
	</body>
</html>
