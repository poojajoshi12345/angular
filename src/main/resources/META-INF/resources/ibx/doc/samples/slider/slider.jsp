<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision: 1.1 $:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>ibx slider sample</title>
		<meta http-equiv="X-UA-Compatible" content="IE=EDGE" >
		<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="Expires" content="0" />
		<meta name="google" value="notranslate">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<!--include this script...will boot ibx into the running state-->
		<Script src="<%=request.getContextPath()%>/ibx/resources/ibx.js" type="text/javascript"></script>
		
		<script type="text/javascript">
			<jsp:include page="/WEB-INF/jsp/global/wf_globals.jsp" flush="false" />

			ibx(init, true);

			function init()
			{

				$("#slider1").ibxWidget('format', function (val, info) {
					switch(val)
					{
					case 'min': return 'Show value popup';
					case 'max': 'Show value popup';
					case 'value': return 'Show value popup';
					}
				});

				$("#vslider1").ibxWidget('format', function (val, info) {
					switch(val)
					{
					case 'min': return 'Show value popup';
					case 'max': 'Show value popup';
					case 'value': return 'Show value popup';
					}
				});

				$("#slider3").ibxWidget('format', function (val, info) {
					switch(val)
					{
					case 'min': return 'Min: ' + info.min;
					case 'max': return 'Max: ' + info.max;
					case 'value': return 'Val: ' + info.value;
					}
				});

				$("#range3").ibxWidget('format', function (val, info) {
					switch(val)
					{
					case 'min': return 'Min: ' + info.min;
					case 'max': return 'Max: ' + info.max;
					case 'value': return 'Val: ' + info.value + ',' + info.value2;
					}
				});

				var info = $("#slider15").ibxWidget('info');
				$("#label15").ibxWidget('option', 'text', 'Value ' + info.value + ' in range ' + info.min + ' to ' + info.max);

				$("#slider15").on("ibx_change", function (event, info)
				{
					$("#label15").ibxWidget('option', 'text', 'Value ' + info.value + ' in range ' + info.min + ' to ' + info.max);
				});

				$("#button15").on("click", function ()
				{
					$("#slider15").ibxWidget('option', 'value', 15);
					var info = $("#slider15").ibxWidget('info');
					$("#label15").ibxWidget('option', 'text', 'Value ' + info.value + ' in range ' + info.min + ' to ' + info.max);
				});

				$("#flip").on('click', function ()
				{
					$('.ibx-slider').ibxWidget('option', 'flipLayout', $("#flip").ibxWidget('option', 'checked'));
				});
					

			};
			//# sourceURL=slider_ibx_sample
		</script>

		<style type="text/css">

		.hslider
		{
			margin-top: 5px;
			margin-bottom: 5px;
			min-width:300px;
			border: 1px solid #ccc;
			border-radius: 5px;
			padding: 5px;
		}

		.vslider
		{
			border: 1px solid #ccc;
			border-radius: 5px;
			margin-left: 5px;
			margin-right: 5px;
			min-height:300px;
			padding: 5px;
		}

		.box
		{
			padding: 20px;
		}

		.labels
		{
			width:100%;
			padding-bottom:20px;
 		}

		#slider16 .ibx-slider-wrapper.ibx-slider-horizontal
		{
			min-height: 6em;
		}

		#slider16 .ibx-slider-marker-one
		{
			font-size: 3em;
			background-color: #85C1E9;
			border: none;

		}

		#slider16 .ibx-slider-marker-one:hover,
		#slider16 .ibx-slider-marker-one:focus
		{
			background-color: #2E86C1;
		}

		#slider16 .ibx-slider-marker-two
		{
			font-size: 4em;
			background-color: #F1948A;
			border: none;
		}

		#slider16 .ibx-slider-marker-two:hover,
		#slider16 .ibx-slider-marker-two:focus
		{
			background-color: #E74C3C;
		}

		#slider16 .ibx-slider-body-horizontal
		{
			background-color: #FAD7A0;
			border-radius: 0.2em;
			height:0.75em;
		}

		#slider16 .ibx-slider-range-body-horizontal
		{
			height:0.75em;
			background-color: #D68910;
		}

		.flip
		{
			font-size: 1.5em;
			padding: 10px;
		}

		</style>
	</head>
	<body class="ibx-root">

		<div class="flip" id="flip" data-ibx-type="ibxCheckBoxSimple" data-ibxp-text="Flip Layout"></div>

		<div data-ibx-type="ibxHBox">

		<div class="box" data-ibx-type="ibxVBox">

		<div class="labels" data-ibx-type="ibxLabel" data-ibxp-text="Horizontal Sliders and Ranges"></div>

		<div id="slider1" class="hslider"
			data-ibx-type="ibxSlider"
			data-ibxp-orientation="horizontal"
			data-ibxp-min="10"
			data-ibxp-max="20"
			data-ibxp-value="15" 
			data-ibxp-min-text-pos="none"
			data-ibxp-max-text-pos="none"
			data-ibxp-value-text-pos="end"
			data-ibxp-popup-value="true"
		></div>

		<div class="hslider"
			data-ibx-type="ibxSlider"
			data-ibxp-orientation="horizontal"
			data-ibxp-min="10"
			data-ibxp-max="20"
			data-ibxp-value="15" 
			data-ibxp-min-text-pos="none"
			data-ibxp-max-text-pos="none"
			data-ibxp-value-text-pos="start"
		></div>

		<div id="slider3" class="hslider"
			data-ibx-type="ibxSlider"
			data-ibxp-orientation="horizontal"
			data-ibxp-min="10"
			data-ibxp-max="200"
			data-ibxp-step="5"
			data-ibxp-value="15" 
			data-ibxp-min-text-pos="center"
			data-ibxp-max-text-pos="center"
			data-ibxp-value-text-pos="start"
		></div>

		<div class="hslider"
			data-ibx-type="ibxSlider"
			data-ibxp-orientation="horizontal"
			data-ibxp-min="10"
			data-ibxp-max="20"
			data-ibxp-value="15" 
			data-ibxp-min-text-pos="start"
			data-ibxp-max-text-pos="start"
			data-ibxp-value-text-pos="start"
		></div>

		<div class="hslider"
			data-ibx-type="ibxSlider"
			data-ibxp-orientation="horizontal"
			data-ibxp-min="10"
			data-ibxp-max="20"
			data-ibxp-value="15" 
			data-ibxp-min-text-pos="start"
			data-ibxp-max-text-pos="end"
			data-ibxp-value-text-pos="end"
		></div>


		<div class="hslider"
			data-ibx-type="ibxRange"
			data-ibxp-orientation="horizontal"
			data-ibxp-min="10"
			data-ibxp-max="20"
			data-ibxp-value="15"
			data-ibxp-value2="17" 
			data-ibxp-min-text-pos="none"
			data-ibxp-max-text-pos="none"
			data-ibxp-value-text-pos="none"
		></div>

		<div class="hslider"
			data-ibx-type="ibxRange"
			data-ibxp-orientation="horizontal"
			data-ibxp-min="10"
			data-ibxp-max="20"
			data-ibxp-value="15"
			data-ibxp-value2="17" 
			data-ibxp-min-text-pos="none"
			data-ibxp-max-text-pos="none"
			data-ibxp-value-text-pos="start"
		></div>

		<div id="range3" class="hslider"
			data-ibx-type="ibxRange"
			data-ibxp-orientation="horizontal"
			data-ibxp-min="10"
			data-ibxp-max="200"
			data-ibxp-step="5"
			data-ibxp-value="15"
			data-ibxp-value2="17" 
			data-ibxp-min-text-pos="center"
			data-ibxp-max-text-pos="center"
			data-ibxp-value-text-pos="start"
		></div>

		<div class="hslider"
			data-ibx-type="ibxRange"
			data-ibxp-orientation="horizontal"
			data-ibxp-min="10"
			data-ibxp-max="20"
			data-ibxp-value="15"
			data-ibxp-value2="17" 
			data-ibxp-min-text-pos="start"
			data-ibxp-max-text-pos="start"
			data-ibxp-value-text-pos="start"
		></div>

		<div class="hslider"
			data-ibx-type="ibxRange"
			data-ibxp-orientation="horizontal"
			data-ibxp-min="10"
			data-ibxp-max="20"
			data-ibxp-value="15"
			data-ibxp-value2="17" 
			data-ibxp-min-text-pos="start"
			data-ibxp-max-text-pos="end"
			data-ibxp-value-text-pos="end"
		></div>


		</div>

		<div class="box" data-ibx-type="ibxHBox" data-ibxp-wrap="true">

		<div class="labels" data-ibx-type="ibxLabel" data-ibxp-text="Vertical Sliders and Ranges"></div>

		<div id="vslider1" class="vslider"
			data-ibx-type="ibxSlider"
			data-ibxp-orientation="vertical"
			data-ibxp-min="10"
			data-ibxp-max="20"
			data-ibxp-value="15" 
			data-ibxp-min-text-pos="none"
			data-ibxp-max-text-pos="center"
			data-ibxp-value-text-pos="none"
			data-ibxp-popup-value="true"
		></div>

		<div class="vslider"
			data-ibx-type="ibxSlider"
			data-ibxp-orientation="vertical"
			data-ibxp-min="10"
			data-ibxp-max="20"
			data-ibxp-value="15" 
			data-ibxp-min-text-pos="none"
			data-ibxp-max-text-pos="none"
			data-ibxp-value-text-pos="start"
		></div>

		<div id="vslider3" class="vslider"
			data-ibx-type="ibxSlider"
			data-ibxp-cols="3em auto auto"
			data-ibxp-orientation="vertical"
			data-ibxp-min="10"
			data-ibxp-max="200"
			data-ibxp-step="5"
			data-ibxp-value="15" 
			data-ibxp-min-text-pos="center"
			data-ibxp-max-text-pos="center"
			data-ibxp-value-text-pos="start"
		></div>

		<div class="vslider"
			data-ibx-type="ibxSlider"
			data-ibxp-orientation="vertical"
			data-ibxp-min="10"
			data-ibxp-max="20"
			data-ibxp-value="15" 
			data-ibxp-min-text-pos="start"
			data-ibxp-max-text-pos="start"
			data-ibxp-value-text-pos="start"
		></div>

		<div class="vslider"
			data-ibx-type="ibxSlider"
			data-ibxp-orientation="vertical"
			data-ibxp-min="10"
			data-ibxp-max="20"
			data-ibxp-value="15" 
			data-ibxp-min-text-pos="start"
			data-ibxp-max-text-pos="end"
			data-ibxp-value-text-pos="end"
		></div>


		<div class="vslider"
			data-ibx-type="ibxRange"
			data-ibxp-orientation="vertical"
			data-ibxp-min="10"
			data-ibxp-max="20"
			data-ibxp-value="15"
			data-ibxp-value2="17" 
			data-ibxp-min-text-pos="none"
			data-ibxp-max-text-pos="none"
			data-ibxp-value-text-pos="none"
		></div>

		<div class="vslider"
			data-ibx-type="ibxRange"
			data-ibxp-orientation="vertical"
			data-ibxp-min="10"
			data-ibxp-max="20"
			data-ibxp-value="15"
			data-ibxp-value2="17" 
			data-ibxp-min-text-pos="none"
			data-ibxp-max-text-pos="none"
			data-ibxp-value-text-pos="start"
		></div>

		<div id="vrange3" class="vslider"
			data-ibx-type="ibxRange"
			data-ibxp-orientation="vertical"
			data-ibxp-min="10"
			data-ibxp-max="200"
			data-ibxp-step="5"
			data-ibxp-value="15"
			data-ibxp-value2="17" 
			data-ibxp-min-text-pos="center"
			data-ibxp-max-text-pos="center"
			data-ibxp-value-text-pos="start"
		></div>

		<div class="vslider"
			data-ibx-type="ibxRange"
			data-ibxp-orientation="vertical"
			data-ibxp-min="10"
			data-ibxp-max="20"
			data-ibxp-value="15"
			data-ibxp-value2="17" 
			data-ibxp-min-text-pos="start"
			data-ibxp-max-text-pos="start"
			data-ibxp-value-text-pos="start"
		></div>

		<div class="vslider"
			data-ibx-type="ibxRange"
			data-ibxp-orientation="vertical"
			data-ibxp-min="10"
			data-ibxp-max="20"
			data-ibxp-value="15"
			data-ibxp-value2="17" 
			data-ibxp-min-text-pos="start"
			data-ibxp-max-text-pos="end"
			data-ibxp-value-text-pos="end"
		></div>


		</div>


		</div>

		<div data-ibx-type="ibxVBox" data-ibxp-align="center" style="width:300px; padding:20px;">
			<div class="labels" data-ibx-type="ibxLabel" data-ibxp-text="Using a separate label to show slider information"></div>
			<div id="label15" data-ibx-type="ibxLabel"></div>
			<div id="slider15" class="hslider"
				data-ibx-type="ibxSlider"
				data-ibxp-orientation="horizontal"
				data-ibxp-min="10"
				data-ibxp-max="20"
				data-ibxp-value="11" 
				data-ibxp-min-text-pos="none"
				data-ibxp-max-text-pos="none"
				data-ibxp-value-text-pos="none"
			></div>
			<div id="button15" data-ibx-type="ibxButton" data-ibxp-text="Set value to 15"></div>
		</div>

		<div data-ibx-type="ibxVBox" data-ibxp-align="center" style="width:300px; padding:20px;">
			<div class="labels" data-ibx-type="ibxLabel" data-ibxp-text="Setting different shape and formatting for sliders"></div>
			<div id="slider16" class="hslider"
				data-ibx-type="ibxHRange"
				data-ibxp-min="10"
				data-ibxp-max="20"
				data-ibxp-value="11" 
				data-ibxp-value2="19" 
				data-ibxp-min-text-pos="center"
				data-ibxp-max-text-pos="center"
				data-ibxp-value-text-pos="end"
				data-ibxp-marker-shape="circle"
				data-ibxp-marker-shape2="rectangle"
			></div>
		</div>

	</body>
</html>
