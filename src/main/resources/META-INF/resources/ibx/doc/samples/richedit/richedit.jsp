<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision: 1.55 $:
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
				$(".drag-source, .ibx-rich-edit").on("dblclick dragstart dragover drop ibx_dragstart ibx_dragover ibx_drop", function(e)
				{
					var dt = e.originalEvent.dataTransfer;
					if(e.type == "dblclick")
					{
						data = "Double Click Data!!";
						var re = $(".rich-edit");
						re.ibxWidget("insertHTML", sformat("<span style='border:2px solid lime;'>{1}</span>", data), true, true, true);
					}
					if(e.type == "dragstart" || e.type == "ibx_dragstart")
					{
						var data = "External Dragged Data!!";
						dt.setData("text/html", sformat("<span style='border:2px solid red;'>{1}</span>", data));
					}
					if(e.type == "dragover" || e.type == "ibx_dragover")
					{
						dt.dropEffect = "copy";
						e.preventDefault();
					}
					else
					if(e.type == "drop" || e.type == "ibx_drop")
					{
						var data = dt.getData("text/plain", this);
						$(".rich-edit").focus();
						console.log(data);
					}
				});
				
				function updateUI()
				{
					window._updatingUI = true;
					var re = $(".rich-edit").ibxWidget("instance");
					var state = re.cmdState();

					$(".cmd-undo").ibxWidget("option", "disabled", !state.undo);
					$(".cmd-redo").ibxWidget("option", "disabled", !state.redo);
					$(".cmd-select-all").ibxWidget("option", "disabled", !state.selectAll);
					$(".cmd-cut").ibxWidget("option", "disabled", !state.cut);
					$(".cmd-copy").ibxWidget("option", "disabled", !state.copy);
					$(".cmd-paste").ibxWidget("option", "disabled", !state.paste);
					$(".cmd-bold").ibxWidget("option", "checked", state.bold);
					$(".cmd-italic").ibxWidget("option", "checked", state.italic);
					$(".cmd-underline").ibxWidget("option", "checked", state.underline);
					$(".cmd-strikethrough").ibxWidget("option", "checked", state.strikethrough);
					$(".cmd-subscript").ibxWidget("option", "checked", state.subscript);
					$(".cmd-superscript").ibxWidget("option", "checked", state.superscript);
					$(".cmd-font-name").ibxWidget("userValue", state.fontName.toLowerCase().replace(/\"/g, ""));
					$(".cmd-font-size").ibxWidget("userValue", state.fontSize);
					$(".rg-justify").ibxWidget("userValue", state.justify);
					$(".tb-fore-color").css("borderColor", state.foreColor);
					$(".tb-back-color").css("borderColor", state.backColor);
					window._updatingUI = false;
					return state;
				}
				updateUI();

				$(".rich-edit-iframe").ibxWidget("ready", function(richEdit)
				{
					richEdit = $(richEdit);

					var select = $(".tb-select-font-name");
					var fonts = ["arial", "arial black", "bookman", "comic sans ms", "courier", "courier new", "georgia", "garamond", "helvetica", "monospace", "palatino", "times", "times new roman", "trebuchet ms", "verdana"];
					for(var i = 0; i < fonts.length; ++i)
					{
						var selected = (i == 1);
						var selectItem = $("<div class='select-font-name'>").ibxSelectMenuItem({"text":fonts[i], "group":"rgFontName", "userValue":fonts[i]});
						select.ibxWidget("add", selectItem);
					}

					var fontName = $(".cmd-font-name").ibxWidget("userValue");
					var strSample = ibx.resourceMgr.getString("IBX_STR_SAMPLE");
					var strFmt = sformat("Start Text<p/>{1}<p/>{1}<p/>{1}<p/>End Text</p>", strSample);
					richEdit.ibxWidget("html",  strFmt);
				});
				
				$(".rich-edit").on("selectionchange", function(e)
				{
					var state = updateUI();
				});
				
				$(".re-cmd").on("ibx_triggered ibx_uservaluechanged", function(e)
				{
					if(window._updatingUI)
						return;

					var isUserValue = e.type == "ibx_uservaluechanged";
					var re = $(".rich-edit-iframe");
					var cmd = $(e.currentTarget);
					var	reCmd = cmd.ibxWidget("option", "reCmd");
					var val = cmd.ibxWidget("userValue");

					if(e.type == "ibx_uservaluechanged")
					{
						if(cmd.is(".cmd-font-name") || cmd.is("cmd-font-size"))
							val = val[0];
						else
						if(cmd.is(".cmd-fore-color, .cmd-back-color") && isUserValue)
						{
							val = cmd.ibxWidget("userValue");
							if(val.search(/^rgb\(/i) == 0)
								val = rgbToHex(val);
							reCmd = cmd.is(".cmd-fore-color") ? "foreColor" : "backColor";
						}
					}
					
					if(cmd.is(".cmd-insert-ordered-list"))
						val = "true";
					
					if(reCmd)
						re.ibxWidget(reCmd, val);
					updateUI();
				})

				$(".tb-fore-color").ibxWidget("option", "menu", makeColorSelect($(".cmd-fore-color"), "foreColor"));
				$(".tb-back-color").ibxWidget("option", "menu", makeColorSelect($(".cmd-back-color"), "backColor"));
				function makeColorSelect(cmd, reCommand)
				{
					var menu = $("<div>").ibxMenu({"destroyOnClose":false});
					var colors = 
					{
						"black":"rgb(0 ,0, 0)",
						"white":"rgb(255, 255, 255)",
						"maroon":"rgb(128, 0, 0)",
						"red":"rgb(255, 0, 0)",
						"orange":"rgb(255, 165, 0)",
						"yellow":"rgb(255, 255, 0)",
						"green":"rgb(0, 255, 0)",
						"cyan":"rgb(0, 255, 255)",
						"lightblue":"rgb(173, 216, 230)",
						"blue":"rgb(0, 0, 255)",
						"purple":"rgb(128, 0, 128)",
						"magenta":"rgb(255, 0, 255)"
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
						menu.ibxWidget("add", selItem);
					}
					menu.ibxWidget("add", $("<div>").ibxMenuSeparator());

					var customMenuItem = $(".cp-menu-template").clone(true).removeAttr("data-ibx-no-bind").ibxRemoveClass("cp-menu-template");
					customMenuItem = ibx.bindElements(customMenuItem);
					customMenuItem.find(".ibx-menu").on("ibx_open", function(reCommand, e)
					{
						var state = $(".ibx-rich-edit").ibxWidget("cmdState");
						var cp = $(e.target).find(".ibx-color-picker");
						this.data("init", true);
						cp.ibxWidget("option", "color", state[reCommand]);
						this.removeData("init");
					}.bind(customMenuItem, reCommand));
					customMenuItem.find(".ibx-color-picker").ibxWidget("option", "command", cmd.ibxWidget("option", "id")).on("ibx_colorchange", function(e)
					{
						var target = $(e.target);
						target.ibxWidget("getCommand").ibxWidget("userValue",  e.originalEvent.data.color);
					});
					menu.ibxWidget("add", customMenuItem);

					customMenuItem = $(".cp-menu-template2").clone(true).removeAttr("data-ibx-no-bind").ibxRemoveClass("cp-menu-template2");
					customMenuItem = ibx.bindElements(customMenuItem);
					customMenuItem.find(".ibx-menu").on("ibx_open", function(reCommand, e)
					{
						var state = $(".ibx-rich-edit").ibxWidget("cmdState");
						var cp = $(e.target).find(".ibx-palette-picker");
						this.data("init", true);
						cp.ibxWidget("option", "color", state[reCommand]);
						this.removeData("init");
					}.bind(customMenuItem, reCommand));
					var cp = customMenuItem.find(".ibx-palette-picker").ibxWidget("option", "command", cmd.ibxWidget("option", "id")).on("ibx_change", function(e)
					{
						if(this.data("init"))
							return;
						var target = $(e.target);
						var info = e.originalEvent.data;
						target.ibxWidget("getCommand").ibxWidget("userValue", e.originalEvent.data.color);
						target.closest(".ibx-popup").ibxWidget("close");
					}.bind(customMenuItem));
					menu.ibxWidget("add", customMenuItem);
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
			.edit-box
			{
				flex:1 1 auto;
				margin-top:5px;
				border:1px solid red;
			}
			.rich-edit
			{	
				flex:1 1 auto;
				height:1px;
				margin:5px;
				border:1px solid black;
				box-sizing:border-box;
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
			.tb-fore-color, .tb-back-color
			{
				border:2px solid transparent;
				border-radius:5px;
			}
			.color-select-item
			{
				flex:0 0 auto;
				min-width:100px;
				height:15px;
				margin:3px;
				border:1px solid #ddd;
			}
			.color-select-item:hover
			{
				outline:2px solid black;
			}
			.tb-select
			{
				margin:2px;
			}
			.tb-select-font-size, .tb-select-font-name
			{
				margin:2px;
				width:125px;
			}

			.cp-menu-template, .cp-menu-template2
			{
				display:none;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
			<div class="tb-main" data-ibx-type="ibxHBox" data-ibxp-wrap="true" data-ibxp-align="center">
				<div tabindex="0" class="drag-source" data-ibx-type="ibxLabel" data-ibxp-draggable="true" data-ibxp-external-drop-target="false" style="padding:3px;border:2px solid black;">Test Data Source (drag/dblclick)</div>
				<div tabindex="0" class="tb-button" title="Undo" data-ibx-type="ibxButtonSimple" data-ibxp-command="cmdUndo" data-ibxp-glyph="undo" data-ibxp-glyph-classes="material-icons"></div>
				<div tabindex="0" class="tb-button" title="Redo" data-ibx-type="ibxButtonSimple" data-ibxp-command="cmdRedo" data-ibxp-glyph="redo" data-ibxp-glyph-classes="material-icons"></div>
				<div tabindex="0" class="tb-separator"></div>
				<div tabindex="0" class="tb-button" title="Select All" data-ibx-type="ibxButtonSimple" data-ibxp-command="cmdSelectAll" data-ibxp-glyph="select_all" data-ibxp-glyph-classes="material-icons"></div>
				<div class="tb-separator"></div>
				<div tabindex="0" class="tb-button" title="Cut" data-ibx-type="ibxButtonSimple" data-ibxp-command="cmdCut" data-ibxp-glyph="content_cut" data-ibxp-glyph-classes="material-icons"></div>
				<div tabindex="0" class="tb-button" title="Copy" data-ibx-type="ibxButtonSimple" data-ibxp-command="cmdCopy" data-ibxp-glyph="content_copy" data-ibxp-glyph-classes="material-icons"></div>
				<div tabindex="0" class="tb-button" title="Paste" data-ibx-type="ibxButtonSimple" data-ibxp-command="cmdPaste" data-ibxp-glyph="content_paste" data-ibxp-glyph-classes="material-icons"></div>
				<div tabindex="0" class="tb-button" title="Clear" data-ibx-type="ibxButtonSimple" data-ibxp-command="cmdDelete" data-ibxp-glyph="clear" data-ibxp-glyph-classes="material-icons"></div>
				<div class="tb-separator"></div>
				<div tabindex="0" class="xxx tb-select tb-select-font-name" title="Font Name" data-ibx-type="ibxSelectMenuButton" data-ibxp-command="cmdFontName" data-ibxp-default-text="Font Name"></div>
				<div tabindex="0" class="tb-select tb-select-font-size" title="Font Size" data-ibx-type="ibxSelectMenuButton" data-ibxp-command="cmdFontSize" data-ibxp-default-text="Font Size">
					<div class="size-select-item" data-ibx-type="ibxSelectMenuItem" data-ibxp-group="rgFontSize" data-ibxp-user-value="1">xx-small</div>
					<div class="size-select-item" data-ibx-type="ibxSelectMenuItem" data-ibxp-group="rgFontSize" data-ibxp-user-value="2">x-small</div>
					<div class="size-select-item" data-ibx-type="ibxSelectMenuItem" data-ibxp-group="rgFontSize" data-ibxp-user-value="3">small</div>
					<div class="size-select-item" data-ibx-type="ibxSelectMenuItem" data-ibxp-group="rgFontSize" data-ibxp-user-value="4">medium</div>
					<div class="size-select-item" data-ibx-type="ibxSelectMenuItem" data-ibxp-group="rgFontSize" data-ibxp-user-value="5">large</div>
					<div class="size-select-item" data-ibx-type="ibxSelectMenuItem" data-ibxp-group="rgFontSize" data-ibxp-user-value="6">x-large</div>
					<div class="size-select-item" data-ibx-type="ibxSelectMenuItem" data-ibxp-group="rgFontSize" data-ibxp-user-value="7">xx-large</div>
				</div>
				<div class="tb-separator"></div>
				<div tabindex="0" class="tb-button" title="Bold" data-ibx-type="ibxCheckBox" data-ibxp-command="cmdBold" data-ibxp-glyph="format_bold" data-ibxp-glyph-classes="material-icons"></div>
				<div tabindex="0" class="tb-button" title="Italic" data-ibx-type="ibxCheckBox" data-ibxp-command="cmdItalic" data-ibxp-glyph="format_italic" data-ibxp-glyph-classes="material-icons"></div>
				<div tabindex="0" class="tb-button" title="Underline" data-ibx-type="ibxCheckBox" data-ibxp-command="cmdUnderline" data-ibxp-glyph="format_underlined" data-ibxp-glyph-classes="material-icons"></div>
				<div tabindex="0" class="tb-button" title="Strikethrough" data-ibx-type="ibxCheckBox" data-ibxp-command="cmdStrikeThrough" data-ibxp-glyph="format_strikethrough" data-ibxp-glyph-classes="material-icons"></div>
				<div tabindex="0" class="tb-button" title="Subscript" data-ibx-type="ibxCheckBox" data-ibxp-command="cmdSubscript" data-ibxp-glyph-classes="fa fa-subscript"></div>
				<div tabindex="0" class="tb-button" title="Superscript" data-ibx-type="ibxCheckBox" data-ibxp-command="cmdSuperscript" data-ibxp-glyph-classes="fa fa-superscript"></div>
				<div class="tb-separator"></div>
				<div tabindex="0" class="tb-button tb-fore-color" title="Color" data-ibx-type="ibxMenuButton" data-ibxp-glyph="format_color_text" data-ibxp-glyph-classes="material-icons"></div>
				<div tabindex="0" class="tb-button tb-back-color" title="Background Color" data-ibx-type="ibxMenuButton" data-ibxp-glyph="format_color_fill" data-ibxp-glyph-classes="material-icons"></div>
				<div class="tb-separator"></div>
				<div tabindex="0" class="tb-button" title="Left Justify" data-ibx-type="ibxRadioButton" data-ibxp-group="rgAlign" data-ibxp-user-value="left" data-ibxp-glyph="format_align_left" data-ibxp-glyph-classes="material-icons"></div>
				<div tabindex="0" class="tb-button" title="Center Justify" data-ibx-type="ibxRadioButton" data-ibxp-group="rgAlign" data-ibxp-user-value="center" data-ibxp-glyph="format_align_center" data-ibxp-glyph-classes="material-icons"></div>
				<div tabindex="0" class="tb-button" title="Right Justify" data-ibx-type="ibxRadioButton" data-ibxp-group="rgAlign" data-ibxp-user-value="right" data-ibxp-glyph="format_align_right" data-ibxp-glyph-classes="material-icons"></div>
				<div tabindex="0" class="tb-button" title="Justify" data-ibx-type="ibxRadioButton" data-ibxp-group="rgAlign" data-ibxp-user-value="full" data-ibxp-glyph="format_align_justify" data-ibxp-glyph-classes="material-icons"></div>
				<div class="tb-separator"></div>
				<div tabindex="0" class="tb-button" title="Outdent" data-ibx-type="ibxButton" data-ibxp-command="cmdOutdent" data-ibxp-glyph="format_indent_decrease" data-ibxp-glyph-classes="material-icons"></div>
				<div tabindex="0" class="tb-button" title="Indent" data-ibx-type="ibxButton" data-ibxp-command="cmdIndent" data-ibxp-glyph="format_indent_increase" data-ibxp-glyph-classes="material-icons"></div>
				<div class="tb-separator"></div>
				<div tabindex="0" class="tb-button" title="Insert Ordered List" data-ibx-type="ibxButton" data-ibxp-command="cmdOrderedList" data-ibxp-glyph="format_list_numbered" data-ibxp-glyph-classes="material-icons"></div>
				<div tabindex="0" class="tb-button" title="Insert Unordered List" data-ibx-type="ibxButton" data-ibxp-command="cmdUnorderedList" data-ibxp-glyph="format_list_bulleted" data-ibxp-glyph-classes="material-icons"></div>
				<div class="tb-separator"></div>
				<div tabindex="0" class="tb-button" title="Remove All Formatting" data-ibx-type="ibxButton" data-ibxp-command="cmdRemoveFormat" data-ibxp-glyph="format_clear" data-ibxp-glyph-classes="material-icons"></div>
			</div>

			<div class="edit-box" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
				<!--
				<div tabindex="0" class="rich-edit rich-edit-div" data-ibx-type="ibxRichEdit2" data-ibxp-ctx-menu=".re-ctx-menu"></div>
				<div data-ibx-type="ibxHSplitter"></div>
				-->
				<div tabindex="0" class="rich-edit rich-edit-iframe" data-ibx-type="ibxRichEdit" data-ibxp-default-font="monospace" data-ibxp-ctx-menu=".re-ctx-menu"></div>
			</div>
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
			<div data-ibx-type="ibxMenuItem" data-ibxp-command="cmdDelete" data-ibxp-label-options='{"glyph":"clear", "glyphClasses":"material-icons"}'>Clear</div>
			<div data-ibx-type="ibxMenuSeparator"></div>
			<div data-ibx-type="ibxMenuItem">Size
				<div data-ibx-type="ibxMenu">
					<div class="menu-size" data-ibx-type="ibxRadioMenuItem" data-ibxp-group="rgFontSize" data-ibxp-user-value="1">xx-small</div>
					<div class="menu-size" data-ibx-type="ibxRadioMenuItem" data-ibxp-group="rgFontSize" data-ibxp-user-value="2">x-small</div>
					<div class="menu-size" data-ibx-type="ibxRadioMenuItem" data-ibxp-group="rgFontSize" data-ibxp-user-value="3">small</div>
					<div class="menu-size" data-ibx-type="ibxRadioMenuItem" data-ibxp-group="rgFontSize" data-ibxp-user-value="4">medium</div>
					<div class="menu-size" data-ibx-type="ibxRadioMenuItem" data-ibxp-group="rgFontSize" data-ibxp-user-value="5">large</div>
					<div class="menu-size" data-ibx-type="ibxRadioMenuItem" data-ibxp-group="rgFontSize" data-ibxp-user-value="6">x-large</div>
					<div class="menu-size" data-ibx-type="ibxRadioMenuItem" data-ibxp-group="rgFontSize" data-ibxp-user-value="7">xx-large</div>
				</div>
			</div>
			<div data-ibx-type="ibxMenuSeparator"></div>
			<div data-ibx-type="ibxMenuItem">Format
				<div data-ibx-type="ibxMenu">
					<div data-ibx-type="ibxCheckMenuItem" data-ibxp-command="cmdBold" data-ibxp-label-options='{"glyph":"format_bold", "glyphClasses":"material-icons"}'>Bold</div>
					<div data-ibx-type="ibxCheckMenuItem" data-ibxp-command="cmdItalic" data-ibxp-label-options='{"glyph":"format_italic", "glyphClasses":"material-icons"}'>Italic</div>
					<div data-ibx-type="ibxCheckMenuItem" data-ibxp-command="cmdUnderline" data-ibxp-label-options='{"glyph":"format_underlined", "glyphClasses":"material-icons"}'>Underline</div>
					<div data-ibx-type="ibxCheckMenuItem" data-ibxp-command="cmdStrikeThrough" data-ibxp-label-options='{"glyph":"format_strikethrough", "glyphClasses":"material-icons"}'>Strikethrough</div>
					<div data-ibx-type="ibxMenuSeparator"></div>
					<div data-ibx-type="ibxMenuItem" data-ibxp-command="cmdIndent" data-ibxp-label-options='{"glyph":"format_indent_decrease", "glyphClasses":"material-icons"}'>Increase Indentation</div>
					<div data-ibx-type="ibxMenuItem" data-ibxp-command="cmdOutdent" data-ibxp-label-options='{"glyph":"format_indent_increase", "glyphClasses":"material-icons"}'>Decrease Indentation</div>
					<div data-ibx-type="ibxMenuSeparator"></div>
					<div data-ibx-type="ibxMenuItem" data-ibxp-command="cmdOrderedList" data-ibxp-label-options='{"glyph":"format_list_numbered", "glyphClasses":"material-icons"}'>Make Ordered List</div>
					<div data-ibx-type="ibxMenuItem" data-ibxp-command="cmdUnorderedList" data-ibxp-label-options='{"glyph":"format_list_bulleted", "glyphClasses":"material-icons"}'>Make Bulleted List</div>
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
			<div data-ibx-type="ibxMenuItem" data-ibxp-command="cmdRemoveFormat" data-ibxp-label-options='{"glyph":"format_clear", "glyphClasses":"material-icons"}'>Remove All Formatting</div>
		</div>

		<div class="cp-menu-template" data-ibx-type="ibxMenuItem" data-ibx-no-bind="true">Example Color Picker
			<div data-ibx-type="ibxMenu">
				<div data-ibx-type="ibxColorPicker" data-ibxp-set-opacity="false" data-ibxp-show-color-info="false"></div>
			</div>
		</div>
		<div class="cp-menu-template2" data-ibx-type="ibxMenuItem" data-ibx-no-bind="true">Example Palette Picker
			<div data-ibx-type="ibxMenu">
				<div data-ibx-type="ibxPalettePicker" data-ibxp-show-palettes="false" data-ibxp-show-custom="false" data-ibxp-show-transparency="false"></div>
			</div>
		</div>

		<div class="re-cmd cmd-remove-format" data-ibx-type="ibxCommand" data-ibxp-id="cmdRemoveFormat" data-ibxp-re-cmd="removeFormat"></div>
		<div class="re-cmd cmd-undo" data-ibx-type="ibxCommand" data-ibxp-id="cmdUndo" data-ibxp-re-cmd="undo"></div>
		<div class="re-cmd cmd-redo" data-ibx-type="ibxCommand" data-ibxp-id="cmdRedo" data-ibxp-re-cmd="redo"></div>
		<div class="re-cmd cmd-select-all" data-ibx-type="ibxCommand" data-ibxp-id="cmdSelectAll" data-ibxp-re-cmd="selectAll"></div>

		<div class="re-cmd cmd-cut" data-ibx-type="ibxCommand" data-ibxp-id="cmdCut" data-ibxp-re-cmd="cut"></div>
		<div class="re-cmd cmd-copy" data-ibx-type="ibxCommand" data-ibxp-id="cmdCopy" data-ibxp-re-cmd="copy"></div>
		<div class="re-cmd cmd-paste" data-ibx-type="ibxCommand" data-ibxp-id="cmdPaste" data-ibxp-re-cmd="paste"></div>
		<div class="re-cmd cmd-del" data-ibx-type="ibxCommand" data-ibxp-id="cmdDelete" data-ibxp-re-cmd="del"></div>
		
		<div class="re-cmd cmd-bold" data-ibx-type="ibxCommand" data-ibxp-id="cmdBold" data-ibxp-re-cmd="bold"></div>
		<div class="re-cmd cmd-italic" data-ibx-type="ibxCommand" data-ibxp-id="cmdItalic" data-ibxp-re-cmd="italic"></div>
		<div class="re-cmd cmd-underline" data-ibx-type="ibxCommand" data-ibxp-id="cmdUnderline" data-ibxp-re-cmd="underline"></div>
		<div class="re-cmd cmd-strikethrough" data-ibx-type="ibxCommand" data-ibxp-id="cmdStrikeThrough" data-ibxp-re-cmd="strikeThrough"></div>
		<div class="re-cmd cmd-subscript" data-ibx-type="ibxCommand" data-ibxp-id="cmdSubscript" data-ibxp-re-cmd="subscript"></div>
		<div class="re-cmd cmd-superscript" data-ibx-type="ibxCommand" data-ibxp-id="cmdSuperscript" data-ibxp-re-cmd="superscript"></div>
		<div class="re-cmd cmd-indent" data-ibx-type="ibxCommand" data-ibxp-id="cmdIndent" data-ibxp-re-cmd="indent"></div>
		<div class="re-cmd cmd-outdent" data-ibx-type="ibxCommand" data-ibxp-id="cmdOutdent" data-ibxp-re-cmd="outdent"></div>
		<div class="re-cmd cmd-insert-ordered-list" data-ibx-type="ibxCommand" data-ibxp-id="cmdOrderedList" data-ibxp-re-cmd="insertList"></div>
		<div class="re-cmd cmd-insert-unordered-list" data-ibx-type="ibxCommand" data-ibxp-id="cmdUnorderedList" data-ibxp-re-cmd="insertList"></div>

		<div class="rg-justify" data-ibx-type="ibxRadioGroup" data-ibxp-name="rgAlign" data-ibxp-command="cmdAlign"></div>
		<div class="re-cmd cmd-justify" data-ibx-type="ibxCommand" data-ibxp-id="cmdAlign" data-ibxp-re-cmd="justify" data-ibxp-user-value="left"></div>

		<div class="rg-font-size" data-ibx-type="ibxRadioGroup" data-ibxp-name="rgFontSize" data-ibxp-command="cmdFontSize"></div>
		<div class="re-cmd cmd-font-size" data-ibx-type="ibxCommand" data-ibxp-id="cmdFontSize" data-ibxp-re-cmd="fontSize" data-ibxp-user-value="3"></div>
		<div class="re-cmd cmd-font-name" data-ibx-type="ibxCommand" data-ibxp-id="cmdFontName" data-ibxp-re-cmd="fontName" data-ibxp-user-value="monospace"></div>
		<div class="re-cmd cmd-fore-color" data-ibx-type="ibxCommand" data-ibxp-id="cmdForeColor" data-ibxp-user-value="foreColor"></div>
		<div class="re-cmd cmd-back-color" data-ibx-type="ibxCommand" data-ibxp-id="cmdBackColor" data-ibxp-user-value="backColor"></div>

	</body>
</html>
