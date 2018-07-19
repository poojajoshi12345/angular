<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision$:
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
				var palPicker = $(".test-pal-picker");
				palPicker.on("ibx_change", function(e)
				{
					var info = e.originalEvent.data;
					$("body").css({"backgroundColor":info.color, "opacity": info.opacity});
				});

				var colorPicker = $(".test-color-picker");
				colorPicker.on("ibx_colorchange", function(e)
				{
					var color = e.originalEvent.data;
					$("body").css("backgroundColor", color);
				});

			}, true);
		</script>

		<style type="text/css">
			html, body, .main-box
			{
				width:100%;
				height:100%;
				margin:0px;
				box-sizing:border-box;
			}
			.test-color-picker.stand-alone
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
		</style>
	</head>
	<body class="ibx-root">
		<div class="main-box" data-ibx-type="ibxHBox" data-ibxp-justify="center" data-ibxp-align="center" data-ibxp-wrap="true">
			<div tabindex="0" class="test-color-picker stand-alone" data-ibx-type="ibxColorPicker"></div>
			<div tabindex="0" class="test-pal-picker stand-alone" data-ibx-type="ibxPalettePicker"></div>
			<div tabindex="0" class="test-combined-picker" data-ibx-type="ibxTabPane">
				<div data-ibx-type="ibxTabPage" data-ibxp-selected="true">Presets
					<div tabindex="0" class="test-pal-picker" data-ibx-type="ibxPalettePicker"></div>
				</div>
				<div data-ibx-type="ibxTabPage">Palette
					<div tabindex="0" class="test-color-picker" data-ibx-type="ibxColorPicker" data-ibxp-color="#ccc"></div>
				</div>
			</div>
		</div>
	</body>
</html>