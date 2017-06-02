<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision$:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html>
	<head>
		<title>ibx test</title>
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
				$(".start-waiting").on("click", function(e)
				{
					$("body").append(ibx.waiting);
				});
				$(".stop-waiting").on("click", function(e)
				{
					ibx.waiting.detach();
				});
				$(".wait-spot").on("click", function(e)
				{
					$(this).append(ibx.waiting)
				});

				$(".child").on("click", function(e)
				{
					debugger;
				});

			}, ["../testing/julian/test_res_bundle.xml"], true);
		</script>
		<style type="text/css">
			.wait-spot
			{
				position:relative;
				display:inline-block;
				border:1px solid red;
				width:50px;
				height:50px;
			}

		</style>
	</head>
	<body class="ibx-root">
		<div class="start-waiting" data-ibx-type="ibxButton" data-ibxp-text="Start Waiting..."></div>
		<div class="stop-waiting" data-ibx-type="ibxButton" data-ibxp-text="Stop Waiting..."></div>
		<div class="wait-spot">
			<div data-ibx-type="ibxHBox" data-ibxp-align="center" data-ibxp-justify="center">
				<div class="child">CHILD</div>
			</div>
		</div>
	</body>
</html>

