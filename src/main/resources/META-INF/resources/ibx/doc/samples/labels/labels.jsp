<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision$:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>ibx labels & fonts sample</title>
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
			var patterns = 
			{
				"ibxglyphs": "^.ibx-glyph-",
				"faglyphs": "^.fa-",
			};
			var fontClasses = 
			{
				"ibxglyphs": "ibx-icons",
				"faglyphs": "fa",
			}
			ibx(function()
			{
				$(".font-select").on("ibx_change", function(e)
				{
					var userValue = $(this).ibxWidget("userValue");
					var rules = FindStyleRules(patterns[userValue]);
					var fontList = $(".font-list").empty();
					for(var i = 0; i < rules.length; ++i)
					{
						var rule = rules[i];
						if(!rule.style.content)
							continue;
							
						var selector = rule.selectorText.replace(/\./g, "").replace(/:.*/, "");
						var options = 
						{
							textAlign:"center",
							textWrap:true,
							text:selector,
							glyphClasses:sformat("{1} {2}", fontClasses[userValue], selector),
							iconPosition:"top",
						};
						var tile = $("<div class='font-tile'>").ibxLabel(options);
						fontList.append(tile);
					}
				}).ibxWidget("userValue", "ibxglyphs");
				
			}, true);
			//# sourceURL=labels_ibx_sample
		</script>

		<style type="text/css">
			.grid-cell
			{
				margin-bottom:25px;
				margin-right:10px;
			}

			.label-image .ibx-label-icon
			{
				width:48px;
				height:48px;
			}

			.font-listing
			{
				margin-top:25px;
			}

			.font-select
			{
				width:auto;
			}

			.font-list
			{
				xbackground-color:#f5f5f5;
				border:1px solid #ccc;
				border-radius:3px;
			}

			.font-tile
			{
				flex:1 1 100px;
				font-size:12px;
				margin:10px;
			}

			.font-tile .ibx-label-glyph
			{
				font-size:24px;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div data-ibx-type="ibxGrid" data-ibxp-rows="auto auto auto auto auto" data-ibxp-cols="175px 1fr">
			<!--MATERIAL ICONS-->
			<div class="grid-cell" data-ibx-row="1/span 1" data-ibx-col="1/span 1" data-ibx-type="ibxLabel" data-ibxp-text="Material Icons Glyphs"></div>
			<div class="grid-cell" data-ibx-row="1/span 1" data-ibx-col="2/span 1" data-ibx-type="ibxHBox" data-ibxp-align="center" data-ibxp-justify="spaceAround">
				<div data-ibx-type="ibxLabel" data-ibxp-text="Icon Left" data-ibxp-glyph="insert_emoticon" data-ibxp-glyph-classes="material-icons md-36" data-ibxp-icon-position="left"></div>
				<div data-ibx-type="ibxLabel" data-ibxp-text="Icon Top" data-ibxp-glyph="insert_emoticon" data-ibxp-glyph-classes="material-icons md-36" data-ibxp-icon-position="top"></div>
				<div data-ibx-type="ibxLabel" data-ibxp-text="Icon Right" data-ibxp-glyph="insert_emoticon" data-ibxp-glyph-classes="material-icons md-36" data-ibxp-icon-position="right"></div>
				<div data-ibx-type="ibxLabel" data-ibxp-text="Icon Bottom" data-ibxp-glyph="insert_emoticon" data-ibxp-glyph-classes="material-icons md-36" data-ibxp-icon-position="bottom"></div>
			</div>
			<!--MATERIAL ICONS-->

			<!--FONT-AWESOME ICONS-->
			<div class="grid-cell" data-ibx-row="2/span 1" data-ibx-col="1/span 1" data-ibx-type="ibxLabel" data-ibxp-text="Font Awesome Glyphs"></div>
			<div class="grid-cell" data-ibx-row="2/span 1" data-ibx-col="2/span 1" data-ibx-type="ibxHBox" data-ibxp-align="center" data-ibxp-justify="spaceAround">
				<div data-ibx-type="ibxLabel" data-ibxp-text="Icon Left" data-ibxp-glyph-classes="fa fa-36 fa-anchor" data-ibxp-icon-position="left"></div>
				<div data-ibx-type="ibxLabel" data-ibxp-text="Icon Top" data-ibxp-glyph-classes="fa fa-36 fa-anchor" data-ibxp-icon-position="top"></div>
				<div data-ibx-type="ibxLabel" data-ibxp-text="Icon Right" data-ibxp-glyph-classes="fa fa-36 fa-anchor" data-ibxp-icon-position="right"></div>
				<div data-ibx-type="ibxLabel" data-ibxp-text="Icon Bottom" data-ibxp-glyph-classes="fa fa-36 fa-anchor" data-ibxp-icon-position="bottom"></div>
			</div>
			<!--FONT-AWESOME ICONS-->

			<!--IBX ICONS-->
			<div class="grid-cell" data-ibx-row="3/span 1" data-ibx-col="1/span 1" data-ibx-type="ibxLabel" data-ibxp-text="Ibx Icons Glyphs"></div>
			<div class="grid-cell" data-ibx-row="3/span 1" data-ibx-col="2/span 1" data-ibx-type="ibxHBox" data-ibxp-align="center" data-ibxp-justify="spaceAround">
				<div data-ibx-type="ibxLabel" data-ibxp-text="Icon Left" data-ibxp-glyph-classes="ibx-icons ibx-36 ibx-glyph-fex" data-ibxp-icon-position="left"></div>
				<div data-ibx-type="ibxLabel" data-ibxp-text="Icon Top" data-ibxp-glyph-classes="ibx-icons ibx-36 ibx-glyph-fex" data-ibxp-icon-position="top"></div>
				<div data-ibx-type="ibxLabel" data-ibxp-text="Icon Right" data-ibxp-glyph-classes="ibx-icons ibx-36 ibx-glyph-fex" data-ibxp-icon-position="right"></div>
				<div data-ibx-type="ibxLabel" data-ibxp-text="Icon Bottom" data-ibxp-glyph-classes="ibx-icons ibx-36 ibx-glyph-fex" data-ibxp-icon-position="bottom"></div>
			</div>
			<!--IBX ICONS-->

			<!--IMAGE ICONS-->
			<div class="grid-cell" data-ibx-row="4/span 1" data-ibx-col="1/span 1" data-ibx-type="ibxLabel" data-ibxp-text="Image Icons (png/jpg/etc)"></div>
			<div class="grid-cell" data-ibx-row="4/span 1" data-ibx-col="2/span 1" data-ibx-type="ibxHBox" data-ibxp-align="center" data-ibxp-justify="spaceAround">
				<div class="label-image" data-ibx-type="ibxLabel" data-ibxp-text="Icon Left" data-ibxp-icon="./portal_16.png" data-ibxp-icon-position="left"></div>
				<div class="label-image" data-ibx-type="ibxLabel" data-ibxp-text="Icon Top" data-ibxp-icon="./portal_16.png" data-ibxp-icon-position="top"></div>
				<div class="label-image" data-ibx-type="ibxLabel" data-ibxp-text="Icon Right" data-ibxp-icon="./portal_16.png" data-ibxp-icon-position="right"></div>
				<div class="label-image" data-ibx-type="ibxLabel" data-ibxp-text="Icon Bottom" data-ibxp-icon="./portal_16.png" data-ibxp-icon-position="bottom"></div>
			</div>
			<!--IMAGE ICONS-->

			<!--FONT LISTING-->
			<div class="font-listing font-select grid-cell" data-ibx-type="ibxSelect" data-ibx-row="5/span 1" data-ibx-col="1/span 1" data-ibx-align="start">
				<div data-ibx-type="ibxSelectItem" data-ibxp-text="Ibx Glyphs" data-ibxp-user-value="ibxglyphs" data-ibxp-selected="true"></div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-text="Font Awesome Glyphs" data-ibxp-user-value="faglyphs"></div>
			</div>
			<div class="font-listing font-list grid-cell" data-ibx-row="5/span 1" data-ibx-col="2/span 1" data-ibx-align="start" data-ibx-type="ibxHBox" data-ibxp-wrap="true" data-ibxp-align="start" data-ibxp-justify="spaceAround">
			</div>
		</div>
	</body>
</html>
