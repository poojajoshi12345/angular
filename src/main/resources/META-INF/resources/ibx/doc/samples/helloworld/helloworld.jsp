﻿<!DOCTYPE html>
<html lang="en-us">
	<head>
		<title>ibx hello world sample</title>
		<meta http-equiv="X-UA-Compatible" content="IE=EDGE" >
		<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="Expires" content="0" />
		<meta name="google" value="notranslate">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<!--include this script...will boot ibx into the running state-->
		<Script src="<%=request.getContextPath()%>/ibx/resources/ibx.js" type="text/javascript"></script>
		<script type="text/javascript">

			/****
				ibx applications use resource bundles (simple xml files) to load needed resources and dependencies.  When you
				initilialze ibx you can pass an array of bundles which will load in the order specified. A resource bundle specifies all
				of the assets your application needs to run (css/strings/javascript/markup/other resource bundles).

				You do not have to use resource bundles.  Everything can be inline, or managed by you via link/script tags.  However, resource 
				bunldes allow you to create simple reusable/modularized hierarchies of ibx components.
			****/
			var resBundles = 
			[
				{"src":"./resources/helloworld.res.xml", "loadContext":"app"}
			];			
			
			/****
				ibx can be called with the following parameters and signatures...
	
				parms:
					function:	to call upon load
					array:		resource packages to load after ibx boots
					bool:		when loaded autobind all markup

				signatures (overloads):
					ibx(function, array, bool)
					ibx(function, array)
					ibx(function, bool)
					ibx(array, bool)
					ibx(array)
					ibx(bool)
			****/
			ibx(function()
			{
				/****
					This is the ibx 'main' function.  When this is called
					the system, and all resource bundles are guaranteed to be loaded and running.
				****/
			}, resBundles, true);
			//# sourceURL=hello_world_ibx_sample
		</script>

		<!--inline styles will be guaranteed to be last in DOM so they will continue to take precedence.-->
		<style type="text/css">
			.hello-world-jsp
			{
				color:red;
			}
		</style>
	</head>

	<!--the ibx-root class tells ibx where to start automatically binding markup on load.-->
	<body class="ibx-root">
		<!--
			You can put ibx markup directly inline (as well a in resource bundles)

			Most ibxWidgets use '<div>' elements as their base.  As they have no actual symantic meaning to HTML renderers,
			and a web app is not a document, so we don't actually want the browser interpreting the markup as anything specific.

			All ibxWidgets have a custom attribute: data-ibx-type="ibxWidgetType"
			1) When ibx binds the markup it will find elements with this attribute.
			2) ibx will attempt to create the javascript object that defines the widget type (and bind it to the element).
			3) ibx will read all 'data-ibxp-' attributes and attempt to set their values as options on the widget.
		-->
		<div class="hello-world-jsp" data-ibx-type="ibxLabel" data-ibxp-text="Hello World"></div>
	</body>
</html>