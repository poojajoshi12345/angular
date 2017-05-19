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

			var bundles = ["../testing/julian/test_res_bundle.xml", "../testing/samples/res_bundle/resources/res_bundle.xml"];
			ibx(function()
			{
				var calc = ibxResourceMgr.getResource(".sample-calculator");
				$("body").append(calc);

				var carousel = $(".test-csl");
				for(var i = 0; i < 20; ++i)
				{
					carousel.ibxWidget("add", $("<div class='test-csl-item'>Item_" + i + "</div>"));
				}
			}, bundles, true);
		</script>
		<style type="text/css">
			.test-csl
			{
				position:absolute;
				left:50px;
				top:50px;
				width:500px;
				border:1px solid black;
			}

			.test-csl-item
			{
				width:100px;
				height:100px;
				border:1px solid #ccc;
				margin:3px;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="test-csl" data-ibx-type="ibxHCarousel" data-ibxp-show-page-markers="true">
		</div>
	</body>
</html>



