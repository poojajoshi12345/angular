<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision: 1.13 $:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>ibx colorpicker sample</title>
		<meta http-equiv="X-UA-Compatible" content="IE=EDGE" >
		<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="Expires" content="0" />
		<meta name="google" value="notranslate">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<!--include this script...will boot ibx into the running state-->
		<Script src="<%=request.getContextPath()%>/ibx/resources/ibx.js" type="text/javascript"></script>
		<script type="text/javascript">
			ibx(function()
			{
				var colorPicker = $(".test-color-picker");
				var palPicker = $(".test-pal-picker");
				palPicker.on("ibx_change", function(e)
				{
					var info = e.originalEvent.data;
					colorPicker.ibxWidget("option", {"color":info.color, "opacity":info.opacity});					
					$("body").css("backgroundColor", info.rgba.rgba);
					$(".rgb-red").text(info.rgba.r);
					$(".rgb-green").text(info.rgba.g);
					$(".rgb-blue").text(info.rgba.b);
					$(".rgb-alpha").text(info.rgba.a);
					$(".rgb-rgba").text(info.rgba.rgba);
					$(".rgb-hex").text(info.color);
				});

				colorPicker.on("ibx_colorchange", function(e)
				{
					var data = e.originalEvent.data;
					palPicker.ibxWidget("option", {"color": data.color, "opacity": data.opacity});
					$("body").css("backgroundColor", hexToRgba(data.color, data.opacity).rgba);
				});
				
				
				palPicker.ibxWidget("option", "color", "#ffffff");
			}, true);
		</script>

		<style type="text/css">
			html, body, .main-box
			{
				width:100%;
				height:100%;
				margin:0px;
				font-family:monospace;
				box-sizing:border-box;
			}
			.color-info-box
			{
				width:100%;
				margin:20px;
				padding:5px;
				background-color:white;
				border:1px solid black;
			}
			.rgb-title
			{
				font-size:18px;
				font-weight:bold;
				margin-right:20px;
			}
			.rgb-label
			{
				margin-right:3px;
			}
			.rgb-value
			{
				width:30px;
				padding:3px;
				margin-right:10px;
				text-align:center;
				border:1px solid black;
			}
			.rgb-rgba, .rgb-hex
			{
				width:auto;
			}
			.test-color-picker.stand-alone, .test-pal-picker.stand-alone
			{
				border:1px solid #ccc;
			}
			.test-color-picker, .test-pal-picker
			{
				background-color:white;
				padding:10px;
				margin:5px;
			}
			.test-combined-picker
			{
				margin:5px;
				background-color:white;
			}
			.color-picker-button
			{
				background-color:white;
				border:1px solid #ccc;
				border-radius:5px;
				padding:5px;
				margin:5px;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="main-box" data-ibx-type="ibxHBox" data-ibxp-justify="center" data-ibxp-wrap="true">
			<div class="color-info-box" data-ibx-type="ibxHBox" data-ibxp-justify="start" data-ibxp-align="center">
				<div class="rgb-title" data-ibx-type="ibxLabel">Color Values</div>
				<div class="rgb-label" data-ibx-type="ibxLabel">Red:</div><div class="rgb-value rgb-red"></div>
				<div class="rgb-label" data-ibx-type="ibxLabel">Green:</div><div class="rgb-value rgb-green"></div>
				<div class="rgb-label" data-ibx-type="ibxLabel">Blue:</div><div class="rgb-value rgb-blue"></div>
				<div class="rgb-label" data-ibx-type="ibxLabel">Alpha:</div><div class="rgb-value rgb-alpha"></div>
				<div class="rgb-label" data-ibx-type="ibxLabel">rgba:</div><div class="rgb-value rgb-rgba"></div>
				<div class="rgb-label" data-ibx-type="ibxLabel">Hex:</div><div class="rgb-value rgb-hex"></div>
			</div>

			<div class="color-picker-button" data-ibx-type="ibxMenuButton">Color...
				<div data-ibx-type="ibxPopup" data-ibxp-destroy-on-close="false">
					<div tabindex="0" class="test-combined-picker" data-ibx-type="ibxTabPane">
						<div data-ibx-type="ibxTabPage" data-ibxp-selected="true">Presets
							<div tabindex="0" class="test-pal-picker" data-ibx-type="ibxPalettePicker"></div>
						</div>
						<div data-ibx-type="ibxTabPage">Palette
							<div tabindex="0" class="test-color-picker pop-up" data-ibx-type="ibxColorPicker" data-ibxp-color="#ccc"></div>
						</div>
					</div>
				</div>
			</div>
			<div tabindex="0" class="test-color-picker stand-alone" data-ibx-type="ibxColorPicker"></div>
			<div tabindex="0" class="test-pal-picker stand-alone" data-ibx-type="ibxPalettePicker"></div>
			<!--
			-->
		</div>
	</body>
</html>