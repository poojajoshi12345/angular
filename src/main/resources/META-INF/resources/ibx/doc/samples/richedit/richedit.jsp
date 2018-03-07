﻿<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision$:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html class="top" lang="en">
	<head>
		<title>ibx richedit sample</title>
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
				$(".rich-edit").ibxWidget("ready", function(richEdit)
				{
					var strSample = ibx.resourceMgr.getString("IBX_STR_SAMPLE");
					richEdit.ibxWidget("html",  sformat("Start Text<p/>{1}<p/>{1}<p/>{1}<p/>End Text<p/>", strSample));
				}).on("contextmenu", function(e)
				{
					e.preventDefault();
				});

				$(".re-cmd").on("ibx_triggered ibx_uservaluechanged", function(e)
				{
					var re = $(".rich-edit");
					var cmd = $(e.currentTarget);
					var reCmd = cmd.ibxWidget("userValue");
					var val = "";
					var relTarget = $(e.relatedTarget);
					if(relTarget.is(".rg-justify"))
					{
						val = reCmd;
						reCmd = "justify";
					}
					else
					if(relTarget.is(".rg-font-size"))
					{
						val = reCmd.toString();
						reCmd = "fontSize";
					}
					else
					if(cmd.is(".cmd-fore-color, .cmd-back-color"))
					{
						val = cmd.ibxWidget("userValue");
						reCmd = cmd.is(".cmd-fore-color") ? "foreColor" : "backColor";
					}
					
					re.ibxWidget(reCmd, val);
				})

				$(".tb-fore-color").ibxWidget("option", "menu", makeColorSelect($(".cmd-fore-color")));
				$(".tb-back-color").ibxWidget("option", "menu", makeColorSelect($(".cmd-back-color")));

				function makeColorSelect(cmd)
				{
					var menu = $("<div>").ibxPopup({"destroyOnClose":false});
					var ctrl = $("<div tabindex='0'>").ibxVBox({"navKeyRoot":true, "navKeyDir":"vertical", "focusDefault":true, "align":"stretch"});
					var colors = 
					{
						"black":"black",
						"white":"white",
						"maroon":"maroon",
						"red":"red",
						"orange":"orange",
						"yellow":"yellow",
						"green":"green",
						"cyan":"cyan",
						"lightblue":"lightblue",
						"blue":"blue",
						"purple":"purple",
						"magenta":"magenta"
					}

					for(var key in colors)
					{
						var color = colors[key];
						var selItem = $(sformat("<div tabindex='-1' class='color-select-item' style='background-color:{1}' data-color='{1}'></div>", color)).data("cmd", cmd);
						selItem.on("click keydown", function(e)
						{
							if(e.type == "keydown" && (e.keyCode != $.ui.keyCode.ENTER && e.keyCode != $.ui.keyCode.SPACE))
								return;

							var selItem = $(e.currentTarget);
							var cmd = selItem.data("cmd");
							cmd.ibxWidget("userValue", selItem.data("color"));
							selItem.closest(".ibx-popup").ibxWidget("close");
						});
						ctrl.append(selItem);
					}
					menu.append(ctrl);
					return menu;
				}
			}, true);
		</script>
		<style type="text/css">
			html.top, .top > body
			{
				width:100%;
				height:100%;
				margin:0px;
			}
			.ibx-menu
			{
				font-size:10pt;
			}
			.main-box
			{
				padding:3px;
				width:100%;
				height:100%;
				box-sizing:border-box;
			}
			.rich-edit
			{	
				margin-top:1px;
				flex:1 1 auto;
				border:1px solid #ccc;
			}
			.tb-button
			{
				flex:0 0 auto;
				font-size:18px;
				margin:2px;
				padding:2px;
			}
			.tb-separator
			{
				align-self:stretch;
				border-left:1px solid #ccc;
				margin:2px 8px 2px 8px;
			}
			.color-select-item
			{
				flex:0 0 auto;
				width:100px;
				height:15px;
				margin:3px;
				border:1px solid #ddd;
			}
			.color-select-item:hover
			{
				outline:2px solid black;
			}
			.tb-select-font-size
			{
				width:50px;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
			<div class="tb-main" data-ibx-type="ibxHBox" data-ibxp-wrap="true">
				<div tabindex="0" class="tb-button" title="Undo" data-ibx-type="ibxButtonSimple" data-ibxp-command="cmdUndo" data-ibxp-glyph="undo" data-ibxp-glyph-classes="material-icons"></div>
				<div tabindex="0" class="tb-button" title="Redo" data-ibx-type="ibxButtonSimple" data-ibxp-command="cmdRedo" data-ibxp-glyph="redo" data-ibxp-glyph-classes="material-icons"></div>
				<div tabindex="0" class="tb-separator"></div>
				<div tabindex="0" class="tb-button" title="Select All" data-ibx-type="ibxButtonSimple" data-ibxp-command="cmdSelectAll" data-ibxp-glyph="select_all" data-ibxp-glyph-classes="material-icons"></div>
				<div class="tb-separator"></div>
				<div tabindex="0" class="tb-button" title="Cut" data-ibx-type="ibxButtonSimple" data-ibxp-command="cmdCut" data-ibxp-glyph="content_cut" data-ibxp-glyph-classes="material-icons"></div>
				<div tabindex="0" class="tb-button" title="Copy" data-ibx-type="ibxButtonSimple" data-ibxp-command="cmdCopy" data-ibxp-glyph="content_copy" data-ibxp-glyph-classes="material-icons"></div>
				<div tabindex="0" class="tb-button" title="Paste" data-ibx-type="ibxButtonSimple" data-ibxp-command="cmdPaste" data-ibxp-glyph="content_paste" data-ibxp-glyph-classes="material-icons"></div>
				<div tabindex="0" class="tb-button" title="Clear" data-ibx-type="ibxButtonSimple" data-ibxp-command="cmdDelete" data-ibxp-glyph="delete" data-ibxp-glyph-classes="material-icons"></div>
				<div class="tb-separator"></div>
				<div tabindex="0" class="tb-button" title="Bold" data-ibx-type="ibxCheckBox" data-ibxp-command="cmdBold" data-ibxp-glyph="format_bold" data-ibxp-glyph-classes="material-icons"></div>
				<div tabindex="0" class="tb-button" title="Italic" data-ibx-type="ibxCheckBox" data-ibxp-command="cmdItalic" data-ibxp-glyph="format_italic" data-ibxp-glyph-classes="material-icons"></div>
				<div tabindex="0" class="tb-button" title="Underline" data-ibx-type="ibxCheckBox" data-ibxp-command="cmdUnderline" data-ibxp-glyph="format_underlined" data-ibxp-glyph-classes="material-icons"></div>
				<div tabindex="0" class="tb-button" title="Strikethrough" data-ibx-type="ibxCheckBox" data-ibxp-command="cmdStrikeThrough" data-ibxp-glyph="format_strikethrough" data-ibxp-glyph-classes="material-icons"></div>
				<div class="tb-separator"></div>
				<div tabindex="0" class="tb-button" title="Left Justify" data-ibx-type="ibxRadioButton" data-ibxp-group="rgAlign" data-ibxp-user-value="left" data-ibxp-glyph="format_align_left" data-ibxp-glyph-classes="material-icons"></div>
				<div tabindex="0" class="tb-button" title="Center Justify" data-ibx-type="ibxRadioButton" data-ibxp-group="rgAlign" data-ibxp-user-value="center" data-ibxp-glyph="format_align_center" data-ibxp-glyph-classes="material-icons"></div>
				<div tabindex="0" class="tb-button" title="Right Justify" data-ibx-type="ibxRadioButton" data-ibxp-group="rgAlign" data-ibxp-user-value="right" data-ibxp-glyph="format_align_right" data-ibxp-glyph-classes="material-icons"></div>
				<div tabindex="0" class="tb-button" title="Justify" data-ibx-type="ibxRadioButton" data-ibxp-group="rgAlign" data-ibxp-user-value="full" data-ibxp-glyph="format_align_justify" data-ibxp-glyph-classes="material-icons"></div>
				<div class="tb-separator"></div>
				<div tabindex="0" class="tb-button tb-fore-color" title="Color" data-ibx-type="ibxMenuButton" data-ibxp-glyph="format_color_text" data-ibxp-glyph-classes="material-icons"></div>
				<div tabindex="0" class="tb-button tb-back-color" title="Background Color" data-ibx-type="ibxMenuButton" data-ibxp-glyph="format_color_fill" data-ibxp-glyph-classes="material-icons"></div>
				<div class="tb-separator"></div>
				<div tabindex="0" class="tb-select-font-size" title="Font Size" data-ibx-type="ibxSelect" data-ibxp-group="rgFontSize" data-ibxp-readonly="true">
					<div class="select-size" class="size-select-item" data-ibx-type="ibxSelectRadioItem" data-ibxp-group="rgFontSize" data-ibxp-user-value="8">8</div>
					<div class="select-size" class="size-select-item" data-ibx-type="ibxSelectRadioItem" data-ibxp-group="rgFontSize" data-ibxp-user-value="10">10</div>
					<div class="select-size" class="size-select-item" data-ibx-type="ibxSelectRadioItem" data-ibxp-group="rgFontSize" data-ibxp-user-value="12">12</div>
					<div class="select-size" class="size-select-item" data-ibx-type="ibxSelectRadioItem" data-ibxp-group="rgFontSize" data-ibxp-user-value="14">14</div>
					<div class="select-size" class="size-select-item" data-ibx-type="ibxSelectRadioItem" data-ibxp-group="rgFontSize" data-ibxp-user-value="18">18</div>
					<div class="select-size" class="size-select-item" data-ibx-type="ibxSelectRadioItem" data-ibxp-group="rgFontSize" data-ibxp-user-value="24">24</div>
					<div class="select-size" class="size-select-item" data-ibx-type="ibxSelectRadioItem" data-ibxp-group="rgFontSize" data-ibxp-user-value="36">36</div>
				</div>
			</div>
			<div tabindex="0" class="rich-edit" data-ibx-type="ibxRichEdit" data-ibxp-ctx-menu=".re-ctx-menu"></div>
		</div>

		<div class="re-ctx-menu" data-ibx-type="ibxMenu" data-ibxp-refocus-last-active-on-close="true">
			<div data-ibx-type="ibxMenuItem" data-ibxp-command="cmdUndo" data-ibxp-label-options='{"glyph":"undo", "glyphClasses":"material-icons"}'>Undo</div>
			<div data-ibx-type="ibxMenuItem" data-ibxp-command="cmdRedo" data-ibxp-label-options='{"glyph":"redo", "glyphClasses":"material-icons"}'>Redo</div>
			<div data-ibx-type="ibxMenuSeparator"></div>
			<div data-ibx-type="ibxMenuItem" data-ibxp-command="cmdSelectAll" data-ibxp-label-options='{"glyph":"select_all", "glyphClasses":"material-icons"}'>Select All</div>
			<div data-ibx-type="ibxMenuSeparator"></div>
			<div data-ibx-type="ibxMenuItem" data-ibxp-command="cmdCut" data-ibxp-label-options='{"glyph":"content_cut", "glyphClasses":"material-icons"}'>Cut</div>
			<div data-ibx-type="ibxMenuItem" data-ibxp-command="cmdCopy" data-ibxp-label-options='{"glyph":"content_copy", "glyphClasses":"material-icons"}'>Copy</div>
			<div data-ibx-type="ibxMenuItem" data-ibxp-command="cmdPaste" data-ibxp-label-options='{"glyph":"content_paste", "glyphClasses":"material-icons"}'>Paste</div>
			<div data-ibx-type="ibxMenuItem" data-ibxp-command="cmdDelete" data-ibxp-label-options='{"glyph":"delete", "glyphClasses":"material-icons"}'>Clear</div>
			<div data-ibx-type="ibxMenuSeparator"></div>
			<div data-ibx-type="ibxMenuItem">Format
				<div data-ibx-type="ibxMenu">

					<div data-ibx-type="ibxCheckMenuItem" data-ibxp-command="cmdBold" data-ibxp-label-options='{"glyph":"format_bold", "glyphClasses":"material-icons"}'>Bold</div>
					<div data-ibx-type="ibxCheckMenuItem" data-ibxp-command="cmdItalic" data-ibxp-label-options='{"glyph":"format_italic", "glyphClasses":"material-icons"}'>Italic</div>
					<div data-ibx-type="ibxCheckMenuItem" data-ibxp-command="cmdUnderline" data-ibxp-label-options='{"glyph":"format_underlined", "glyphClasses":"material-icons"}'>Underline</div>
					<div data-ibx-type="ibxCheckMenuItem" data-ibxp-command="cmdStrikeThrough" data-ibxp-label-options='{"glyph":"format_strikethrough", "glyphClasses":"material-icons"}'>Strikethrough</div>
				</div>
			</div>
			<div data-ibx-type="ibxMenuSeparator"></div>
			<div data-ibx-type="ibxMenuItem">Justify
				<div data-ibx-type="ibxMenu">
					<div data-ibx-type="ibxRadioMenuItem" data-ibxp-group="rgAlign" data-ibxp-user-value="left" data-ibxp-label-options='{"glyph":"format_align_left", "glyphClasses":"material-icons"}' data-ibxp-checked="true">Left</div>
					<div data-ibx-type="ibxRadioMenuItem" data-ibxp-group="rgAlign" data-ibxp-user-value="center" data-ibxp-label-options='{"glyph":"format_align_center", "glyphClasses":"material-icons"}'>Center</div>
					<div data-ibx-type="ibxRadioMenuItem" data-ibxp-group="rgAlign" data-ibxp-user-value="right" data-ibxp-label-options='{"glyph":"format_align_right", "glyphClasses":"material-icons"}'>Right</div>
					<div data-ibx-type="ibxRadioMenuItem" data-ibxp-group="rgAlign" data-ibxp-user-value="full" data-ibxp-label-options='{"glyph":"format_align_justify", "glyphClasses":"material-icons"}'>Full</div>
				</div>
			</div>
			<div data-ibx-type="ibxMenuSeparator"></div>
			<div data-ibx-type="ibxMenuItem">Size
				<div data-ibx-type="ibxMenu">
					<div class="menu-size" data-ibx-type="ibxRadioMenuItem" data-ibxp-group="rgFontSize" data-ibxp-user-value="8">8</div>
					<div class="menu-size" data-ibx-type="ibxRadioMenuItem" data-ibxp-group="rgFontSize" data-ibxp-user-value="10">10</div>
					<div class="menu-size" data-ibx-type="ibxRadioMenuItem" data-ibxp-group="rgFontSize" data-ibxp-user-value="12">12</div>
					<div class="menu-size" data-ibx-type="ibxRadioMenuItem" data-ibxp-group="rgFontSize" data-ibxp-user-value="14">14</div>
					<div class="menu-size" data-ibx-type="ibxRadioMenuItem" data-ibxp-group="rgFontSize" data-ibxp-user-value="18">18</div>
					<div class="menu-size" data-ibx-type="ibxRadioMenuItem" data-ibxp-group="rgFontSize" data-ibxp-user-value="24">24</div>
					<div class="menu-size" data-ibx-type="ibxRadioMenuItem" data-ibxp-group="rgFontSize" data-ibxp-user-value="36">36</div>
				</div>
			</div>
		</div>

		<div class="re-cmd" data-ibx-type="ibxCommand" data-ibxp-id="cmdUndo" data-ibxp-user-value="undo"></div>
		<div class="re-cmd" data-ibx-type="ibxCommand" data-ibxp-id="cmdRedo" data-ibxp-user-value="redo"></div>
		<div class="re-cmd" data-ibx-type="ibxCommand" data-ibxp-id="cmdSelectAll" data-ibxp-user-value="selectAll"></div>

		<div class="re-cmd" data-ibx-type="ibxCommand" data-ibxp-id="cmdCut" data-ibxp-user-value="cut"></div>
		<div class="re-cmd" data-ibx-type="ibxCommand" data-ibxp-id="cmdCopy" data-ibxp-user-value="copy"></div>
		<div class="re-cmd" data-ibx-type="ibxCommand" data-ibxp-id="cmdPaste" data-ibxp-user-value="paste"></div>
		<div class="re-cmd" data-ibx-type="ibxCommand" data-ibxp-id="cmdDelete" data-ibxp-user-value="del"></div>
		
		<div class="re-cmd" data-ibx-type="ibxCommand" data-ibxp-id="cmdBold" data-ibxp-user-value="bold"></div>
		<div class="re-cmd" data-ibx-type="ibxCommand" data-ibxp-id="cmdItalic" data-ibxp-user-value="italic"></div>
		<div class="re-cmd" data-ibx-type="ibxCommand" data-ibxp-id="cmdUnderline" data-ibxp-user-value="underline"></div>
		<div class="re-cmd" data-ibx-type="ibxCommand" data-ibxp-id="cmdStrikeThrough" data-ibxp-user-value="strikeThrough"></div>

		<div class="rg-justify" data-ibx-type="ibxRadioGroup" data-ibxp-name="rgAlign" data-ibxp-command="cmdAlign"></div>
		<div class="re-cmd" data-ibx-type="ibxCommand" data-ibxp-id="cmdAlign" data-ibxp-user-value="justify"></div>

		<div class="rg-font-size" data-ibx-type="ibxRadioGroup" data-ibxp-name="rgFontSize" data-ibxp-command="cmdFontSize"></div>
		<div class="re-cmd" data-ibx-type="ibxCommand" data-ibxp-id="cmdFontSize" data-ibxp-user-value="fontSize"></div>

		<div class="re-cmd cmd-fore-color" data-ibx-type="ibxCommand" data-ibxp-id="cmdForeColor" data-ibxp-user-value="foreColor"></div>
		<div class="re-cmd cmd-back-color" data-ibx-type="ibxCommand" data-ibxp-id="cmdBackColor" data-ibxp-user-value="backColor"></div>
	</body>
</html>
