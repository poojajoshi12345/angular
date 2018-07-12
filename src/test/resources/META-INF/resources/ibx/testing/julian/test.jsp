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
			var packages = 
			[
				{"src":"./test_res_bundle.xml", "loadContext":"app"},
				{"src":"./colorpicker/resources/colorpicker_res_bundle.xml", "loadContext":"app"}
			]
			ibx(function()
			{
				var palFile = $.get(ibx.getAppPath() + "colorpicker/resources/colorpicker_res_bundle.xml").done(function(doc, status, xhr)
				{
					var palPicker = $(".test-pal-picker");
					palPicker.ibxWidget("paletteFile", doc);
				});
			}, packages, true);
		</script>
		<style type="text/css">
			body
			{
				width:100%;
				height:100%;
				margin:0px;
				box-sizing:border-box;
			}
		</style>
	</head>

	<body class="ibx-root">
		<div tabindex="0" class="test-button" data-ibx-type="ibxMenuButton" data-ibxp-glyph="face" data-ibxp-glyph-classes="material-icons">Test Menu Button</div>
		<div tabindex="0" class="test-color-picker" data-ibx-type="ibxColorPicker" data-ibxp-color="#ccc"></div>
		<div tabindex="0" class="test-pal-picker" data-ibx-type="ibxPalettePicker"></div>
	</body>
</html>
