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
			ibx.showOnLoad = false;
			ibx(function()
			{
			}, [{"src":"./test_res_bundle.xml", "loadContext":"app"}], true);


			window.addEventListener("ibx_ibxevent", ibxSystemEvent);
			window.addEventListener("ibx_resmgr", ibxSystemEvent);
			function ibxSystemEvent(e)
			{
				var splash = $(".ibx-splash-screen");
				var eType = e.type;
				var data = e.data;
				if(eType == "ibx_ibxevent" && data.hint == "loading")
				{
					$(".ibx-splash-logo-image").prop("src", ibx.getPath() + "css/images/ibx.png");
					splash.addClass("ibx-splash-show");
				}
				else
				if(eType == "ibx_ibxevent" && data.hint == "loaded")
				{
					splash.removeClass("ibx-splash-show");
					ibx.showRootNodes(true);
				}

				window.requestAnimationFrame(splashOut.bind(this, e));
				function splashOut(e)
				{
					var text = sformat("Loading...{1} {2}", data.src ? " - " + data.src : "", data.hint);
					$(".ibx-splash-status").text(text);

				};
			};
		</script>
		<style type="text/css">
			html, body
			{
				margin:0px;
				height:100%;
				width:100%;
				position:relative;
			}
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
				font-size:6em;
			}

			.short-cut-overlay 
			{
				padding:2px;
				border:1px solid black;
				background-color:white;
			}

			.ibx-splash-screen
			{
				display:none;
				position:absolute;
				left:0px;
				top:0px;
				right:0px;
				bottom:0px;
				font-size:1em;
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
			.ibx-splash-logo-image
			{
			}
			.ibx-splash-logo-text
			{
				font-size:36pt;
				font-weight:bold;
			}
			.ibx-splash-status
			{
				position:abolute;
				right:0px;
				color:#aaa;
			}

		</style>
	</head>
	<body class="">
		<div class="ibx-root main-box" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
			<div class="test-label" data-ibx-type="ibxButtonSimple" data-ibxp-glyph-classes="fa fa-cogs"
				data-ibxp-overlays="[{'position':'bl', 'glyphClasses':'short-cut-overlay fa fa-user'}, {'position':'br', 'glyphClasses':'short-cut-overlay fa fa-share-alt'}]">Test Label</div>
		</div>

		<div class="ibx-splash-screen">
			<img class="ibx-splash-logo-image"/>
			<span class="ibx-splash-logo-text">ibx</span>
			<div class="ibx-splash-status"></div>
		</div>
	</body>
</html>





