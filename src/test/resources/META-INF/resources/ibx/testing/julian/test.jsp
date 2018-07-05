﻿<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
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

			window.addEventListener("load", function()
			{
				function outer()
				{
					var c = 0
					function eventHandler(e)
					{
						debugger;
						c = c + 1
						if(c == requestNumber)
						{
							//someshit
						}
					}
					$("body").on("click", eventHandler);
				}
				outer();
			});

		</script>
		<style type="text/css">
			body
			{
				width:100%;
				height:100%;
				margin:0px;
				box-sizing:border-box;
				background-color:red;
			}
		</style>
	</head>
	<body class="ibx-root">
	</body>
</html>
