<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved.
 $Revision$:
--%><%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved.
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
				$(".btn-change3d").on("click", function(e){
					var options = {
						basemap: 'satellite',
						type: "3d",
						zoom: {visible: true, position:"bottom-right"}, //top-left, top-right, bottom-left
						baseMapGallery: {visible: false, position: "top-right"}
					};
					//var map = $(".test-map").ibxWidget("option", "type", "3d");
					var map = $(".test-map").ibxWidget("option", options);
				});
				$(".btn-changeBaseMap").on("click", function(e){
					var options = {
						basemap: 'dark-gray-vector',
					};
					//var map = $(".test-map").ibxWidget("option", "type", "3d");
					var map = $(".test-map").ibxWidget("option", options);
				});
				$(".button-bar > .ibx-button").on("click", function(e)
				{
				var btn =  $(e.currentTarget);
				var bar = btn.data("user-data");
				$((bar == ".all") ? ".grid-bar" : bar).ibxCollapsible("toggle");
				});

				//buttons to toggle collapsible bars.
				$(".right-bar").ibxCollapsible({autoClose:false, direction:"right", startCollapsed:true});



			}, [{"src":"../../ibxtools/mapping/resources/mapping_res.xml", "loadContext":"ibx"}], true);
		</script>
		<style type="text/css">
			html, body, .main-box
			{
				width:100%;
				height:100%;
				margin:0;
				box-sizing:border-box;
			}
			.test-map{
				width: 100%;
				height: 100%;
			}
			.outer-grid-container-for-ios-bug
			{
				position:absolute;
				left:15px;
				top:15px;
				right:15px;
				bottom:15px;
			}
			.grid-main
			{
				height:100%;
				overflow:hidden;
				border:1px solid gray;
				border-radius:3px;
			}
			.tool-bar
			{
				padding:3px;
				background-color:white;
				border-bottom: 1px solid #aaa;
				z-index:100;
			}
			.tool-bar .ibx-widget
			{
				margin-right:3px;
			}
			.tool-bar-title
			{
				flex:1 1 auto;
			}
			.menu-bar
			{
				font-size:.8em;
			}

			.content
			{
				box-shadow:0 0 10px 0px gray;
				border-radius:3px;
				margin:4px;
			}
			.grid-bar
			{
				background-color:#eee;
				border:1px solid #ccc;
				border-radius:3px;
				margin:4px;
				padding:4px;
				z-index:0;
			}

			.top-bar, .bottom-bar
			{
				height:48px;
			}
			.left-bar, .right-bar
			{
				width:400px;
			}
			.form-col12
			{
				margin-top: 5px;
				margin-bottom: 10px;
			}
			.form-notify-title
			{
				margin-right: 10px;
				font-size:2em;
			}
			.form-notify-switch{
				font-size:2em;
			}
			.form-notify-title-unchecked
			{
				color: #ccc;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="outer-grid-container-for-ios-bug">
			<div class="grid-main" data-ibx-type="ibxGrid" data-ibxp-cols="auto 1fr auto" data-ibxp-rows="auto auto 1fr auto" data-ibxp-align="stretch">
				<div class="tool-bar" data-ibx-type="ibxHBox" data-ibxp-align="center" data-ibx-col="1/span 3" data-ibx-row="1/span 1">
					<div class="button-bar" data-ibx-type="ibxHBox" data-ibxp-align="center">
						<div data-user-data=".right-bar" data-ibx-type="ibxButton" data-ibxp-text="Toggle Properties"></div>
					</div>
					<div class="toggle-button-bar" title="Hide/Show Button Bar" data-ibx-type="ibxButton" data-ibxp-glyph="swap_horiz" data-ibxp-glyph-classes="material-icons"></div>
					<div class="tool-bar-title"></div>
				</div>
				<div class="content" data-ibx-type="ibxLabel" data-ibxp-justify="center" data-ibxp-align="center" data-ibx-col="2/1fr" data-ibx-row="3/span 1">
					<div class="test-map" data-ibx-type="esriMap"></div>
				</div>

				<div class="right-bar grid-bar" data-ibx-col="3/span 1" data-ibx-row="3/span 1">
					<div class="form-col12" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibx-row="20" data-ibx-col="1/span 2">
						<div class="form-col12" data-ibx-type="ibxHBox" data-ibxp-align="center" data-ibx-row="20" data-ibx-col="1/span 2">
							<div class="form-notify-title" data-ibx-type="ibxLabel">3D</div>
							<div tabindex="1" class="form-notify-switch" data-ibx-type="ibxSwitch" data-ibxp-checked="true" data-ibxp-user-value="true">
								<div class="form-notify" data-ibx-type="ibxFormControl" data-ibxp-name="notify"></div>
							</div>
							<div class="form-notify-title" data-ibx-type="ibxLabel">2D</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!--<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center" data-ibxp-command="cmdDelete">
			<div class="test-map" data-ibx-type="esriMap"></div>
			<div class="btn-change3d" data-ibx-type="ibxButton">Change to 3D</div>
			<div class="btn-changeBaseMap" data-ibx-type="ibxButton">Change to DarkGray</div>
		</div>-->
	</body>
</html>