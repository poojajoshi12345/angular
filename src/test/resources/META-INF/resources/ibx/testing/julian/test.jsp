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
		<Script src="./ace/ace-builds-master/src/ace.js" type="text/javascript"></script>
		<script type="text/javascript">
			<jsp:include page="/WEB-INF/jsp/global/wf_globals.jsp" flush="false" />

			ibx(function()
			{
				$("#cmdClear").on("ibx_triggered", function(e)
				{
					console.clear();
				});

				$.widget("ibi.ibiAceWidget", $.ibi.ibxWidget, 
				{
					options:
					{
						"mode":"",
					},
					_widgetClass:"ibx-flexbox",
					_create:function()
					{
						this._super();
						this._editor = ace.edit(this.element[0]);
						this._editor.on("change", this._onEditorChange.bind(this));

						this._selection = this._editor.getSelection();
						this._selection.on("changeSelection", this._onSelectionChange.bind(this));
						this._selection.on("changeCursor", this._onSelectionChange.bind(this));
					},
					_destroy:function()
					{
						this._super();
					},
					editor:function()
					{
						return this._editor;
					},
					env:function()
					{
						return this.element.prop("env");
					},
					_onEditorChange:function(e)
					{
						this.element.dispatchEvent("ibi_edit_change", e);
					},
					_onSelectionChange:function(e)
					{
						this.element.dispatchEvent("ibi_select_change", this._selection);
					},
					_refresh:function()
					{
						var options = this.options;
						this._super();

						this._editor.session.setMode("ace/mode/" + options.mode);
						this._editor.resize();
					}
				});
				var aceWidget = $(".ibi-ace-widget").ibiAceWidget({mode:"javascript", "ctxMenu":".ibi-ace-ctx-menu"});


				/*HERES WHERE THE SHELL CODE WOULD GO*/
				aceWidget.on("ibi_edit_change ibi_select_change", function(e)
				{
					var caretPos = $(".caret-pos-pane");
					var editor = $(".ibi-ace-widget").ibxWidget("editor");
					var selection = editor.getSelection();
					caretPos.text(sformat("Ln {1}, Col {2}", selection.cursor.row, selection.cursor.column));
				});


				/*THIS JUST LOADS SOME SAMPLE TEXT*/
				var script = $.get(ibx.getPath() + "js/widget.ibx.js").then(function(src, status, xhr)
				{
					var editor = $(".ibi-ace-widget").ibxWidget("editor");
					editor.setValue(src);
					editor.selection.clearSelection();
				});


			}, [{src:"./test_res_bundle.xml", loadContext:"app"}], true);
		</script>
		<style type="text/css">
			html, body
			{
				width:100%;
				height:100%;
				margin:0px;
				box-sizing:border-box;
			}
			.main-box
			{
				width:100%;
				height:100%;
				padding:5px;
				box-sizing:border-box;
			}
			.ibx-menu, .ibx-menu-bar
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
			.ibi-ace-widget
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
		</style>
	</head>
	<body class="ibx-root">
		<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
			<div class="menu-bar" data-ibx-type="ibxMenuBar" data-ibxp-wrap="true" data-ibxp-align="center">
				<div class="menu-btn-file" data-ibx-type="ibxMenuButton" data-ibxp-text="File">
					<div class="file-menu" data-ibx-type="ibxMenu">
						<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyph":"fiber_new", "glyphClasses":"material-icons"}'>New</div>
						<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyph":"open_in_new", "glyphClasses":"material-icons"}'>Open...</div>
						<div data-ibx-type="ibxMenuSeparator"></div>
						<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyph":"save", "glyphClasses":"material-icons"}'>Save</div>
						<div data-ibx-type="ibxMenuItem">Save As...</div>
						<div data-ibx-type="ibxMenuSeparator"></div>
						<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyph":"exit_to_app", "glyphClasses":"material-icons"}'>Exit</div>
					</div>
				</div>
				<div class="menu-btn-edit" data-ibx-type="ibxMenuButton" data-ibxp-text="Edit">
					<div data-ibx-type="ibxMenu" data-ibxp-multi-select="true">
						<div data-ibx-type="ibxMenuItem" data-ibxp-command="cmdUndo" data-ibxp-label-options='{"glyph":"undo", "glyphClasses":"material-icons"}'>Undo</div>
						<div data-ibx-type="ibxMenuItem" data-ibxp-command="cmdRedo" data-ibxp-label-options='{"glyph":"redo", "glyphClasses":"material-icons"}'>Redo</div>
						<div data-ibx-type="ibxMenuSeparator"></div>
						<div data-ibx-type="ibxMenuItem" data-ibxp-command="cmdCut" data-ibxp-label-options='{"glyph":"content_cut", "glyphClasses":"material-icons"}'>Cut</div>
						<div data-ibx-type="ibxMenuItem" data-ibxp-command="cmdCopy" data-ibxp-label-options='{"glyph":"content_copy", "glyphClasses":"material-icons"}'>Copy</div>
						<div data-ibx-type="ibxMenuItem" data-ibxp-command="cmdPaste" data-ibxp-label-options='{"glyph":"content_paste", "glyphClasses":"material-icons"}'>Paste</div>
						<div data-ibx-type="ibxMenuSeparator"></div>
						<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyph":"find_in_page", "glyphClasses":"material-icons"}'>Find...</div>
						<div data-ibx-type="ibxMenuSeparator"></div>
						<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyph":"delete", "glyphClasses":"material-icons"}'>Delete Selection</div>
					</div>
				</div>
				<div class="menu-btn-view" data-ibx-type="ibxMenuButton" data-ibxp-text="View">
					<div class="view-menu" data-ibx-type="ibxMenu">
						<div data-ibx-type="ibxMenuItem">New Tab</div>
						<div data-ibx-type="ibxMenuItem">Delete Tab</div>
					</div>
				</div>
			</div>
			<div class="tb-main" data-ibx-type="ibxHBox" data-ibxp-wrap="true" data-ibxp-align="center">
				<div tabindex="0" class="tb-button" title="Undo" data-ibx-type="ibxButtonSimple" data-ibxp-command="cmdUndo" data-ibxp-glyph="undo" data-ibxp-glyph-classes="material-icons"></div>
				<div tabindex="0" class="tb-button" title="Redo" data-ibx-type="ibxButtonSimple" data-ibxp-command="cmdRedo" data-ibxp-glyph="redo" data-ibxp-glyph-classes="material-icons"></div>
				<div tabindex="0" class="tb-separator"></div>
				<div tabindex="0" class="tb-button" title="Select All" data-ibx-type="ibxButtonSimple" data-ibxp-command="cmdSelectAll" data-ibxp-glyph="select_all" data-ibxp-glyph-classes="material-icons"></div>
				<div class="tb-separator"></div>
				<div tabindex="0" class="tb-button" title="Cut" data-ibx-type="ibxButtonSimple" data-ibxp-command="cmdCut" data-ibxp-glyph="content_cut" data-ibxp-glyph-classes="material-icons"></div>
				<div tabindex="0" class="tb-button" title="Copy" data-ibx-type="ibxButtonSimple" data-ibxp-command="cmdCopy" data-ibxp-glyph="content_copy" data-ibxp-glyph-classes="material-icons"></div>
				<div tabindex="0" class="tb-button" title="Paste" data-ibx-type="ibxButtonSimple" data-ibxp-command="cmdPaste" data-ibxp-glyph="content_paste" data-ibxp-glyph-classes="material-icons"></div>
				<div tabindex="0" class="tb-button" title="Clear" data-ibx-type="ibxButtonSimple" data-ibxp-command="cmdDelete" data-ibxp-glyph="clear" data-ibxp-glyph-classes="material-icons"></div>
			</div>
			<div tabindex="0" class="ibi-ace-widget"></div>
			<div class="status-bar" data-ibx-type="ibxHBox" data-ibxp-align="center" data-ibxp-justify="end">
				<div class="caret-pos-pane"></div>
			</div>
		</div>

		<div class="ibi-ace-ctx-menu" data-ibx-type="ibxMenu" data-ibxp-refocus-last-active-on-close="true">
			<div data-ibx-type="ibxMenuItem" data-ibxp-command="cmdUndo" data-ibxp-label-options='{"glyph":"undo", "glyphClasses":"material-icons"}'>Undo</div>
			<div data-ibx-type="ibxMenuItem" data-ibxp-command="cmdRedo" data-ibxp-label-options='{"glyph":"redo", "glyphClasses":"material-icons"}'>Redo</div>
			<div data-ibx-type="ibxMenuSeparator"></div>
			<div data-ibx-type="ibxMenuItem" data-ibxp-command="cmdSelectAll" data-ibxp-label-options='{"glyph":"select_all", "glyphClasses":"material-icons"}'>Select All</div>
			<div data-ibx-type="ibxMenuSeparator"></div>
			<div data-ibx-type="ibxMenuItem" data-ibxp-command="cmdCut" data-ibxp-label-options='{"glyph":"content_cut", "glyphClasses":"material-icons"}'>Cut</div>
			<div data-ibx-type="ibxMenuItem" data-ibxp-command="cmdCopy" data-ibxp-label-options='{"glyph":"content_copy", "glyphClasses":"material-icons"}'>Copy</div>
			<div data-ibx-type="ibxMenuItem" data-ibxp-command="cmdPaste" data-ibxp-label-options='{"glyph":"content_paste", "glyphClasses":"material-icons"}'>Paste</div>
			<div data-ibx-type="ibxMenuItem" data-ibxp-command="cmdDelete" data-ibxp-label-options='{"glyph":"delete", "glyphClasses":"material-icons"}'>Clear</div>
		</div>

		<div class="re-cmd cmd-remove-format" data-ibx-type="ibxCommand" data-ibxp-id="cmdRemoveFormat" data-ibxp-user-value="removeFormat"></div>
		<div class="re-cmd cmd-undo" data-ibx-type="ibxCommand" data-ibxp-id="cmdUndo" data-ibxp-user-value="undo"></div>
		<div class="re-cmd cmd-redo" data-ibx-type="ibxCommand" data-ibxp-id="cmdRedo" data-ibxp-user-value="redo"></div>
		<div class="re-cmd cmd-select-all" data-ibx-type="ibxCommand" data-ibxp-id="cmdSelectAll" data-ibxp-user-value="selectAll"></div>

		<div class="re-cmd cmd-cut" data-ibx-type="ibxCommand" data-ibxp-id="cmdCut" data-ibxp-user-value="cut"></div>
		<div class="re-cmd cmd-copy" data-ibx-type="ibxCommand" data-ibxp-id="cmdCopy" data-ibxp-user-value="copy"></div>
		<div class="re-cmd cmd-paste" data-ibx-type="ibxCommand" data-ibxp-id="cmdPaste" data-ibxp-user-value="paste"></div>
		<div class="re-cmd cmd-del" data-ibx-type="ibxCommand" data-ibxp-id="cmdDelete" data-ibxp-user-value="del"></div>
		
		<div class="re-cmd cmd-bold" data-ibx-type="ibxCommand" data-ibxp-id="cmdBold" data-ibxp-user-value="bold"></div>
		<div class="re-cmd cmd-italic" data-ibx-type="ibxCommand" data-ibxp-id="cmdItalic" data-ibxp-user-value="italic"></div>
		<div class="re-cmd cmd-underline" data-ibx-type="ibxCommand" data-ibxp-id="cmdUnderline" data-ibxp-user-value="underline"></div>
		<div class="re-cmd cmd-strikethrough" data-ibx-type="ibxCommand" data-ibxp-id="cmdStrikeThrough" data-ibxp-user-value="strikeThrough"></div>
		<div class="re-cmd cmd-subscript" data-ibx-type="ibxCommand" data-ibxp-id="cmdSubscript" data-ibxp-user-value="subscript"></div>
		<div class="re-cmd cmd-superscript" data-ibx-type="ibxCommand" data-ibxp-id="cmdSuperscript" data-ibxp-user-value="superscript"></div>
		<div class="re-cmd cmd-indent" data-ibx-type="ibxCommand" data-ibxp-id="cmdIndent" data-ibxp-user-value="indent"></div>
		<div class="re-cmd cmd-outdent" data-ibx-type="ibxCommand" data-ibxp-id="cmdOutdent" data-ibxp-user-value="outdent"></div>
		<div class="re-cmd cmd-insert-ordered-list" data-ibx-type="ibxCommand" data-ibxp-id="cmdOrderedList" data-ibxp-user-value="insertList"></div>
		<div class="re-cmd cmd-insert-unordered-list" data-ibx-type="ibxCommand" data-ibxp-id="cmdUnorderedList" data-ibxp-user-value="insertList"></div>

		<div class="rg-justify" data-ibx-type="ibxRadioGroup" data-ibxp-name="rgAlign" data-ibxp-command="cmdAlign"></div>
		<div class="re-cmd cmd-justify" data-ibx-type="ibxCommand" data-ibxp-id="cmdAlign" data-ibxp-user-value="justify"></div>

		<div class="rg-font-size" data-ibx-type="ibxRadioGroup" data-ibxp-name="rgFontSize" data-ibxp-command="cmdFontSize"></div>
		<div class="re-cmd cmd-font-size" data-ibx-type="ibxCommand" data-ibxp-id="cmdFontSize" data-ibxp-user-value="fontSize"></div>

		<div class="rg-font-name" data-ibx-type="ibxRadioGroup" data-ibxp-name="rgFontName" data-ibxp-command="cmdFontName"></div>
		<div class="re-cmd cmd-font-name" data-ibx-type="ibxCommand" data-ibxp-id="cmdFontName" data-ibxp-user-value="fontName"></div>

		<div class="re-cmd cmd-fore-color" data-ibx-type="ibxCommand" data-ibxp-id="cmdForeColor" data-ibxp-user-value="foreColor"></div>
		<div class="re-cmd cmd-back-color" data-ibx-type="ibxCommand" data-ibxp-id="cmdBackColor" data-ibxp-user-value="backColor"></div>
	</body>
</html>
