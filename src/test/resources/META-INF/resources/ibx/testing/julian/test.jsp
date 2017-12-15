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
				$(".test-overlay").text(ibx.resourceMgr.getString("IBX_STR_SAMPLE"));

				var csl = $(".test-carousel");
				for(var i = 0; i < 25; ++i)
				{
					var tile = $("<div class='test-tile'>").text("Test Tile " + i);
					csl.ibxWidget("add", tile);
				}
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

			.main-box
			{
				width:100%;
				height:100%;
				overflow:auto;
				background-color:white;
				box-sizing:border-box;
			}

			.test-overlay
			{
				position:relative;
				top:175px;
				width:50%;
				height:150px;
				z-index:100;
				overflow:hidden;
				white-space:nowrap;
				border:1px solid black;
				background-color:thistle;
				box-sizing:border-box;
			}
	
			.test-carousel
			{
				max-width:75%;
				border:1px solid #aaa;
				border-radius:.5em;
				box-shadow:5px 5px 5px 0px #aaa;
			}

			.test-tile
			{
				width:200px;
				height:200px;
				border:1px solid black;
				margin:5px;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div id="mainBox" class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center" data-ibx-name-root="true">
			<div tabindex="0" class="test-overlay"></div>
			<div tabindex="0" class="test-carousel" data-ibx-type="ibxCarousel"></div>
		</div>
	</body>
</html>
