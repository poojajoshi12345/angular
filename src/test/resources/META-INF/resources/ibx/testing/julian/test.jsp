<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision$:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>ibx test</title>
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
				var csl = $(".test-carousel");
				for(i = 0; i < 20; ++i)
				{
					var label = $("<div>").ibxLabel({text:"Label " + i, justify:"center"}).addClass("test-label test-label-"+i);
					csl.ibxWidget("add", label);
				}

				csl.on("ibx_beforescroll ibx_scroll", function(e)
				{
					var info = $(e.currentTarget).data("ibxWidget").getPageMetrics();
					console.log(info);
				});
			}, [], true);
		</script>
		<style type="text/css">
			html, body
			{
				margin:0px;
				height:100%;
				width:100%;
				position:fixed;
			}

			.main-box
			{
				position:absolute;
				left:0px;
				top:0px;
				right:0px;
				bottom:0px;
			}

			.test-carousel
			{
				flex:1 1 auto;
				margin:50px;
				overflow:hidden;
				border:1px solid #ccc;
			}

			.test-label
			{
				width:100px;
				height:50px;
				margin:5px;
				padding:5px;
				border:1px solid black;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="main-box" data-ibx-type="ibxHBox" data-ibxp-align="center">
			<div class="test-carousel" data-ibx-type="ibxHCarousel" data-ibxp-allow-drag-scrolling="true" data-ibxp-show-page-markers="false">
			</div>
		</div>
	</body>
</html>

