<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision$:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>ibx splash screen sample</title>
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
			
			ibx.showOnLoad = false;
			ibx(function()
			{
				$(".btn-show-splash").on("click", function(e)
				{
					$(".ibx-splash-screen").ibxAddClass("ibx-splash-show");
					ibx.showRootNodes(false);
				});

				$(".ibx-splash-screen").on("click", function(e)
				{
					$(this).ibxRemoveClass("ibx-splash-show");
					ibx.showRootNodes(true);
				});
			}, true);


			window.addEventListener("ibx_ibxevent", ibxSystemEvent);
			window.addEventListener("ibx_resmgr", ibxSystemEvent);
			function ibxSystemEvent(e)
			{
				var splash = $(".ibx-splash-screen");
				var eType = e.type;
				var data = e.data;
				if(eType == "ibx_ibxevent" && data.hint == "jqueryloaded")
				{
					$(".ibx-splash-logo-image").prop("src", ibx.getPath() + "css/images/ibx.png");
					splash.ibxAddClass("ibx-splash-show");
				}
				else
				if(eType == "ibx_ibxevent" && data.hint == "markupbound")
				{
					splash.ibxRemoveClass("ibx-splash-show");
					ibx.showRootNodes(true);
				}

				window.requestAnimationFrame(splashOut.bind(this, e));
				function splashOut(e)
				{
					var text  = $(sformat("<div>Loading...{1}: {2} {3}</div>", eType, data.hint, data.src ? " - " + data.src : ""));
					var status = $(".ibx-splash-status");
					status.append(text).prop("scrollTop", 1000000);
				};
			};
		</script>
		<style type="text/css">
			.main-box
			{
				position:absolute;
				left:0px;
				top:0px;
				right:0px;
				bottom:0px;
				padding:5px;
			}
			.test-label
			{
				font-size:14pt;
				font-weight:700;
			}
			.ibx-splash-screen
			{
				display:none;
				position:absolute;
				left:0px;
				top:0px;
				right:0px;
				bottom:0px;
				flex-direction:column;
				align-items:center;
				justify-content:center;
			}
			.ibx-splash-show
			{
				display:flex;
			}
			.ibx-splash-frame
			{
				border:5px solid black;
				padding:5px;
				background-color:white;
			}
			.ibx-splash-status
			{
				position:abolute;
				right:0px;
				height:300px;
				overflow:auto;
				color:#aaa;
				border:none;
				wrap:off;
			}
		</style>
	</head>
	<body class="">
		<div class="ibx-root main-box" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
			<div class="btn-show-splash" data-ibx-type="ibxButton">If you want to see it again...click on me.</div>
		</div>

		<div class="ibx-splash-screen">
			<img class="ibx-splash-logo-image"/>
			<span class="ibx-splash-text">ibx</span>
			<div class="ibx-splash-status"></div>
		</div>
	</body>
</html>





