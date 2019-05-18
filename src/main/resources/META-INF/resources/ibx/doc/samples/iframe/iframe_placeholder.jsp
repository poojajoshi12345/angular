<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision: 1.1 $:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html>
	<head>
		<title>ibx ibfs output placeholder</title>
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
			}, true);
		</script>

		<style type="text/css">
			.outer-box
			{
				position:absolute;
				left:0px;
				top:0px;
				right:0px;
				bottom:0px;
			}

			.message
			{
				font-size:24px;
				font-weight:bold;
				color:gray;
				text-shadow:.1em .1em .1em #bbb;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="outer-box" data-ibx-type="ibxVBox" data-ibxp-justify="center" data-ibxp-align="center">
			<div class="message">Enter a Web Address above</div>
		</div>
	</body>
</html>
