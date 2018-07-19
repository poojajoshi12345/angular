<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision$:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>ibx samples</title>
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
			
			ibx(function()
			{
				/*LIST OF AVAILABLE SAMPLES*/
				var samples = 
				[
					{name:"Hello World", url:"./helloworld/helloworld.jsp", class:"hello-world-sample", glyph:"face"},
					{name:"IBFS (Simple Navigator)", url:"./ibfs/ibfs.jsp", class:"ibfs-sample", glyph:"search"},
					{name:"calculator", url:"./calculator/calculator.jsp", class:"calculator-sample", glyph:"apps"},
					{name:"Menus", url:"./menus/menus.jsp", class:"menus-sample", glyph:"menu"},
					{name:"Popups and Dialogs", url:"./popups/popups.jsp", class:"popups-sample", glyph:"desktop_windows"},
					{name:"Grids", url:"./grid/grid.jsp", class:"grid-sample", glyph:"grid_on"},
					{name:"Splitters", url:"./splitters/splitters.jsp", class:"splitter-sample", glyph:"vertical_align_center"},
					{name:"Collapsible", url:"./collapsible/collapsible.jsp", class:"collapsible-sample", glyph:"swap_vert"},
					{name:"ibx Library Diagram", url:"./ibxhier/ibxhier.jsp", class:"ibxhier-sample", glyph:"filter_list"},
					{name:"Accordion", url:"./accordion/accordion.jsp", class:"accordion-sample", glyph:"view_day"},
					{name:"Form (standard controls)", url:"./forms/forms.jsp", class:"forms-sample", glyph:"directions_boat"},
					{name:"iFrame", url:"./iframe/iframe.jsp", class:"iframe-sample", glyph:"public"},
					{name:"Carousel", url:"./carousel/carousel.jsp", class:"carousel-sample", glyph:"view_carousel"},
					{name:"Text Editor (Super Basic)", url:"./texteditor/texteditor.jsp", class:"texteditor-sample", glyph:"border_color", hidden:true},
					{name:"Labels & Fonts", url:"./labels/labels.jsp", class:"labels-sample", glyph:"label"},
					{name:"Sliders & Ranges", url:"./slider/slider.jsp", class:"slider-sample", glyph:"straighten"},
					{name:"Progress", url:"./progress/progress.jsp", class:"progress-sample", glyphClasses:"fa fa-spin fa-spinner"},
					{name:"Date Picker", url:"./datepicker/datepicker.jsp", class:"datepicker-sample", glyphClasses:"fa fa-calendar"},
					{name:"Resource Bundle", url:"./resbundle/resbundle.jsp", class:"resbundle-sample", glyphClasses:"fa fa-gift"},
					{name:"Drag/Drop", url:"./dragdrop/dragdrop2.jsp", class:"drag-drop-sample", glyphClasses:"fa fa-arrows-alt"},
					{name:"Splash Screen", url:"./splashscreen/splashscreen.jsp", class:"splash-screen-sample", glyphClasses:"fa fa-hand-spock-o"},
					{name:"Accessibility", url:"./accessibility/accessibility.jsp", class:"accessibility-sample", glyphClasses:"material-icons", glyph:"accessibility"},
					{name:"Rich Edit", url:"./richedit/richedit.jsp", class:"rich-edit-sample", glyphClasses:"material-icons", glyph:"mode_edit"},
					{name:"Sortable", url:"./sortable/sortable.jsp", class:"sortable-sample", glyphClasses:"material-icons", glyph:"sort_by_alpha"},
					{name:"Tree Control", url:"./tree/tree.jsp", class:"tree-sample", glyphClasses:"material-icons", glyph:"layers"},
				];

				/*SORT SAMPLES ALPHABETICALLY*/
				samples = samples.sort(function(s1, s2)
				{
					n1 = s1.name.toLowerCase();
					n2 = s2.name.toLowerCase();
					if(n1 > n2)
						return 1;
					else
					if(n1 < n2)
						return -1
					return 0;
				});

				/*MAKE SAMPLES BOX COLLAPSIBLE, AND ATTACH HAMBURGER TO HIDE/SHOW*/
				var samplesBox = $(".samples-box");
				$(".samples-box").ibxCollapsible();
				$(".title-hamburger").on("click", function(e)
				{
					$(".samples-box").ibxCollapsible("toggle");
				});

				/*ADD SAMPLES*/
				$.each(samples, function(idx, s)
				{
					if(s.hidden)
						return;

 					var sample = $("<div class='ibx-sample' tabIndex='0'>").addClass(s.class).data("url", s.url).ibxButton(
					{
						justify:"start",
						text:s.name,
						glyph:s.glyph || "",
						glyphClasses: s.glyphClasses || "material-icons"
					});
					sample.appendTo(samplesBox);
				});

				/*HANDLE CLICK ON SAMPLE*/
				$(".ibx-sample").on("click", function(e)
				{
					var sample = $(e.currentTarget);
					var url = sample.data("url");
					$(".title-label").ibxWidget("option", "text", sample.ibxWidget("option", "text"));
					$(".content-frame iframe").prop("src", url);
				});

				//preselect hello world.
				$(".hello-world-sample").trigger("click");
			}, true);
		</script>

		<style type="text/css">
			.main-box
			{
				position:absolute;
				top:0px;
				left:0px;
				right:0px;
				bottom:0px;
			}

			.samples-box
			{
				margin:5px 0 5px 0;
				padding:.25em;
				background-color:#eee;
				border-radius:.3em;
				overflow:auto;
			}
			.samples-box-button
			{
				flex:0 0 auto;
				font-size:1.5em;
				font-weight:bold;
				color:white;
				background-color:#888;
				margin-bottom:5px;
				border-radius:.2em;
			}

			.samples-box-title
			{
				flex:0 0 auto;
				font-size:1.5em;
				font-weight:bold;
				color:white;
				background-color:#888;
				margin-bottom:5px;
				border-radius:.2em;
			}

			.ibx-sample.ibx-button
			{
				flex:0 0 auto;
				font-size:1em;
				color:#555;
				background-color:white;
				border:1px solid #CCC;
				border-radius:.2em;
				padding:2px;
				margin:1px 0 1px 0;
			}

			.ibx-sample.ibx-button:hover, .ibx-sample.ibx-button *:hover
			{
				background-color:#888;
				color:white;
				cursor:pointer;
			}

			.content-box
			{
				flex:1 1 auto;
				margin:5px;
			}

			.content-title
			{
				flex:0 0 auto;
				font-weight:bold;
				border:1px solid #ccc;
				border-radius:.3em;
				margin-bottom:5px;
			}

			.title-label
			{
				flex:1 1 auto;
				font-size:2em;
			}

			.content-title
			{
				padding:2px;
			}

			.content-title > .title-hamburger
			{
				padding:5px;
				font-size:1.5em;
				border-color:transparent;
			}

			.content-frame
			{
				position:relative;
				flex:1 1 auto;
				overflow:auto;
				border:1px solid #ccc;
				border-radius:.3em;
			}

			.content-frame > iframe
			{
				position:absolute;
				left:0px;
				top:0px;
				width:100%;
				height:100%;
				border:none;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="main-box" data-ibx-type="ibxHBox" data-ibxp-align="stretch" >
			
			<div class="samples-box" data-ibx-type="ibxVBox" data-ibxp-align="stretch"></div>
			
			<div class="content-box" data-ibx-type="ibxVBox" data-ibxp-wrap="false" data-ibxp-align="stretch">
				<div class="content-title" data-ibx-type="ibxHBox" data-ibxp-align="center">
					<div class="title-hamburger" tabIndex="0" data-ibx-type="ibxButton" title="Hide/Show Samples" data-ibxp-glyph="menu" data-ibxp-glyph-classes="material-icons"></div>
					<div class="title-label" data-ibx-type="ibxLabel" data-ibxp-justify="center" data-ibxp-text="ibx Samples"></div>
				</div>
				<div class="content-frame">
					<iframe tabIndex="0" src=""></iframe>
				</div>
			</div>
		</div>
	</body>
</html>