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
				$("body").on("click", function(e)
				{
					var frame = $(".test-iframe").data("ibxWidget");
					var wnd = frame.contentWindow();
					var doc = frame.contentDocument();
					//wnd.resize(frame.element.width(), frame.element.height());
					doc.body.style.width = frame.element.width()/2 + "px";
					doc.body.style.height = frame.element.height()/2 + "px";
					doc.body.style.border = "2px solid red";
					//doc.documentElement.style.overflow = "hidden";
				});
			}, [{src:"./test_res_bundle.xml", loadContext:"app"}], true);
		</script>
		<style type="text/css">
			.ibx-flexbox.main-box
			{
				position:absolute;
				left:0px;
				top:0px;
				right:0px;
				bottom:0px;
				overflow:auto;
				background-color:white;
			}

			.test-iframe
			{
				width:400px;
				height:300px;
				border:1px solid black;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div tabIndex="0" id="mainBox" class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center" data-ibx-name-root="true">
			<div tabindex="0" data-ibx-type="ibxButton">Outer Button</div>

			<div tabindex="0" class="test-iframe" data-ibx-type="ibxIFrame" data-ibxp-src="../samples/carousel/carousel.jsp"></div>
		</div>
	</body>
</html>
