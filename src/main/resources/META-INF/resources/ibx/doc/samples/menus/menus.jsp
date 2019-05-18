<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision: 1.6 $:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>ibx menus sample</title>
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
			}, true);
			//# sourceURL=menus.jsp
		</script>

		<style type="text/css">
			.grid-cell
			{
				margin-right:50px;
				margin-bottom:25px;
			}

			.menubar-label
			{
				font-style:bold;
			}

			.menubar
			{
				border:1px solid #ccc;
				border-radius:3px;
			}

			.menu-btn
			{
				width:100px;
				margin-right:10px;
				border:1px solid #ccc;
			}
			.split-menu-button
			{
				margin-right:10px;
			}
			.ctxmenu-target
			{
				font-weight:bold;
			}
			.ctxmenu-target:hover
			{
				text-decoration:underline;
			}
		</style>
	</head>
	<body class="ibx-root" aria-label="This is a test application for IBX menus, menu buttons, and context menus">
		<div data-ibx-type="ibxGrid" data-ibxp-align="center" data-ibxp-justify="start" data-ibxp-rows="auto auto auto auto" data-ibxp-cols="auto 1fr">
			<div data-ibx-type="ibxCommand" data-ibxp-id="cmdCut" data-ibxp-shortcut="Ctrl+X"></div>
			<div data-ibx-type="ibxCommand" data-ibxp-id="cmdCopy" data-ibxp-shortcut="Ctrl+C"></div>
			<div data-ibx-type="ibxCommand" data-ibxp-id="cmdPaste" data-ibxp-shortcut="Ctrl+V"></div>
			<div data-ibx-type="ibxCommand" data-ibxp-id="cmdUndo" data-ibxp-shortcut="Ctrl+Z"></div>
			<div data-ibx-type="ibxCommand" data-ibxp-id="cmdRedo" data-ibxp-shortcut="Ctrl+Y"></div>

			<!--HMENU BAR-->
			<div class="menubar-label grid-cell" data-ibx-row="1/span 1" data-ibx-col="1/span 1" data-ibx-type="ibxLabel" data-ibxp-text-wrap="true" data-ibxp-text="This is an ibxHMenuBar (Horizontal)"></div>
			<div class="menubar grid-cell" tabIndex="0" aria-label="Example IBX horizontal menu bar" data-ibx-type="ibxHMenuBar" data-ibx-row="1/span 1" data-ibx-col="2/span 1fr">
				<div class="menu-btn-file" data-ibx-type="ibxMenuButton" data-ibxp-text="File">
					<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyph":"fiber_new", "glyphClasses":"material-icons"}'>New</div>
					<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyph":"open_in_new", "glyphClasses":"material-icons"}'>Open...</div>
					<div data-ibx-type="ibxMenuSeparator"></div>
					<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyph":"save", "glyphClasses":"material-icons"}'>Save</div>
					<div data-ibx-type="ibxMenuItem">Save As...</div>
					<div data-ibx-type="ibxMenuSeparator"></div>
					<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyph":"exit_to_app", "glyphClasses":"material-icons"}'>Exit</div>
				</div>
				<div class="menu-btn-edit" data-ibx-type="ibxMenuButton" data-ibxp-text="Edit" data-ibxp-menu-options.multi-select="true">
					<div data-ibx-type="ibxMenuItem" data-ibxp-command="cmdUndo" data-ibxp-label-options='{"glyph":"undo", "glyphClasses":"material-icons"}'>Undo</div>
					<div data-ibx-type="ibxMenuItem" data-ibxp-command="cmdRedo" data-ibxp-label-options='{"glyph":"redo", "glyphClasses":"material-icons"}'>Redo</div>
					<div data-ibx-type="ibxMenuSeparator"></div>
					<div data-ibx-type="ibxMenuItem" data-ibxp-command="cmdCut" data-ibxp-label-options='{"glyph":"content_cut", "glyphClasses":"material-icons"}'>Cut</div>
					<div data-ibx-type="ibxMenuItem" data-ibxp-command="cmdCopy" data-ibxp-label-options='{"glyph":"content_copy", "glyphClasses":"material-icons"}'>Copy</div>
					<div data-ibx-type="ibxMenuItem" data-ibxp-command="cmdPaste" data-ibxp-label-options='{"glyph":"content_paste", "glyphClasses":"material-icons"}'>Paste</div>
					<div data-ibx-type="ibxMenuSeparator"></div>
					<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyph":"find_in_page", "glyphClasses":"material-icons"}'>Find...</div>
					<div data-ibx-type="ibxMenuSeparator"></div>
					<div data-ibx-type="ibxCheckMenuItem" data-ibxp-label-options='{"glyph":"accessibility", "glyphClasses":"material-icons"}'>Check This</div>
					<div data-ibx-type="ibxCheckMenuItem" data-ibxp-label-options='{"glyph":"android", "glyphClasses":"material-icons"}'>Check That</div>
					<div data-ibx-type="ibxCheckMenuItem" data-ibxp-label-options='{"glyph":"face", "glyphClasses":"material-icons"}'>Check Yo Head</div>
				</div>
				<div class="menu-btn-view" data-ibx-type="ibxMenuButton" data-ibxp-text="View">
					<div data-ibx-type="ibxRadioGroup" data-ibxp-name="rgMenuHViewAs"></div>
					<div data-ibx-type="ibxRadioMenuItem" data-ibxp-group="rgMenuHViewAs" data-ibxp-label-options='{"glyph":"view_list", "glyphClasses":"material-icons"}' data-ibxp-checked="true">as List</div>
					<div data-ibx-type="ibxRadioMenuItem" data-ibxp-group="rgMenuHViewAs" data-ibxp-label-options='{"glyph":"picture_in_picture", "glyphClasses":"material-icons"}'>as Icons</div>
					<div data-ibx-type="ibxRadioMenuItem" data-ibxp-group="rgMenuHViewAs" data-ibxp-label-options='{"glyph":"search", "glyphClasses":"material-icons"}'>as Details</div>
					<div data-ibx-type="ibxMenuSeparator"></div>
					<div data-ibx-type="ibxMenuItem">
						View as Magic
						<div class="magic-menu" data-ibx-type="ibxMenu">
							<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyph":"pets", "glyphClasses":"material-icons"}'>
								Pull a Rabbit!
								<div class="magic-menu" data-ibx-type="ibxMenu">
									<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyphClasses":"fa fa-circle-o-notch fa-spin"}'>Out of Your Hat!</div>
									<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyphClasses":"fa fa-spinner fa-spin"}'>Or Here</div>
									<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyphClasses":"fa fa-cog fa-spin"}'>Not There</div>
									<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyphClasses":"fa fa-refresh fa-spin"}'>Look Behind You!</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div data-ibx-type="ibxMenuButtonSeparator"></div>
				<div class="menu-btn-window" data-ibx-type="ibxMenuButton">
					Window
					<div data-ibx-type="ibxMenuItem">Cascade</div>
					<div data-ibx-type="ibxMenuItem">Tile</div>
					<div data-ibx-type="ibxMenuSeparator"></div>
					<div data-ibx-type="ibxMenuItem">Maximize</div>
					<div data-ibx-type="ibxMenuItem">Minimize</div>
				</div>
				<div class="menu-btn-help" title="Help" data-ibx-type="ibxMenuButton" data-ibxp-glyph="help_outline" data-ibxp-glyph-classes="material-icons md-14"></div>
			</div>
			<!--HMENU BAR-->

			<!--VMENU BAR-->
			<div class="menubar-label grid-cell" data-ibx-row="2/span 1" data-ibx-col="1/span 1" data-ibx-type="ibxLabel" data-ibxp-text-wrap="true" data-ibxp-text="This is an ibxVMenuBar (vertical)"></div>
			<div class="menubar grid-cell" tabIndex="0" aria-label="Example IBX vertical menu bar" data-ibx-type="ibxVMenuBar" data-ibx-row="2/span 1" data-ibx-col="2/span 1fr">
				<div class="menu-btn-file" data-ibx-type="ibxVMenuButton" data-ibxp-text="File">
					<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyph":"fiber_new", "glyphClasses":"material-icons"}'>New</div>
					<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyph":"open_in_new", "glyphClasses":"material-icons"}'>Open...</div>
					<div data-ibx-type="ibxMenuSeparator"></div>
					<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyph":"save", "glyphClasses":"material-icons"}'>Save</div>
					<div data-ibx-type="ibxMenuItem">Save As...</div>
					<div data-ibx-type="ibxMenuSeparator"></div>
					<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyph":"exit_to_app", "glyphClasses":"material-icons"}'>Exit</div>
				</div>
				<div class="menu-btn-edit" data-ibx-type="ibxVMenuButton" data-ibxp-text="Edit">
					<div data-ibx-type="ibxMenuItem" data-ibxp-command="cmdUndo" data-ibxp-label-options='{"glyph":"undo", "glyphClasses":"material-icons"}'>Undo</div>
					<div data-ibx-type="ibxMenuItem" data-ibxp-command="cmdRedo" data-ibxp-label-options='{"glyph":"redo", "glyphClasses":"material-icons"}'>Redo</div>
					<div data-ibx-type="ibxMenuSeparator"></div>
					<div data-ibx-type="ibxMenuItem" data-ibxp-command="cmdCut" data-ibxp-label-options='{"glyph":"content_cut", "glyphClasses":"material-icons"}'>Cut</div>
					<div data-ibx-type="ibxMenuItem" data-ibxp-command="cmdCopy" data-ibxp-label-options='{"glyph":"content_copy", "glyphClasses":"material-icons"}'>Copy</div>
					<div data-ibx-type="ibxMenuItem" data-ibxp-command="cmdPaste" data-ibxp-label-options='{"glyph":"content_paste", "glyphClasses":"material-icons"}'>Paste</div>
					<div data-ibx-type="ibxMenuSeparator"></div>
					<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyph":"find_in_page", "glyphClasses":"material-icons"}'>Find...</div>
					<div data-ibx-type="ibxMenuSeparator"></div>
					<div data-ibx-type="ibxCheckMenuItem" data-ibxp-label-options='{"glyph":"accessibility", "glyphClasses":"material-icons"}'>Check This</div>
					<div data-ibx-type="ibxCheckMenuItem" data-ibxp-label-options='{"glyph":"android", "glyphClasses":"material-icons"}'>Check That</div>
					<div data-ibx-type="ibxCheckMenuItem" data-ibxp-label-options='{"glyph":"face", "glyphClasses":"material-icons"}'>Check Yo Head</div>
				</div>
				<div class="menu-btn-view" data-ibx-type="ibxVMenuButton" data-ibxp-text="View">
					<div data-ibx-type="ibxRadioGroup" data-ibxp-name="rgMenuVViewAs"></div>
					<div data-ibx-type="ibxRadioMenuItem" data-ibxp-group="rgMenuVViewAs" data-ibxp-label-options='{"glyph":"view_list", "glyphClasses":"material-icons"}' data-ibxp-checked="true">as List</div>
					<div data-ibx-type="ibxRadioMenuItem" data-ibxp-group="rgMenuVViewAs" data-ibxp-label-options='{"glyph":"picture_in_picture", "glyphClasses":"material-icons"}'>as Icons</div>
					<div data-ibx-type="ibxRadioMenuItem" data-ibxp-group="rgMenuVViewAs" data-ibxp-label-options='{"glyph":"search", "glyphClasses":"material-icons"}'>as Details</div>
					<div data-ibx-type="ibxMenuSeparator"></div>
					<div data-ibx-type="ibxMenuItem">
						View as Magic
						<div class="magic-menu" data-ibx-type="ibxMenu">
							<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyph":"pets", "glyphClasses":"material-icons"}'>
								Pull a Rabbit!
								<div class="magic-menu" data-ibx-type="ibxMenu">
									<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyphClasses":"fa fa-circle-o-notch fa-spin"}'>Out of Your Hat!</div>
									<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyphClasses":"fa fa-spinner fa-spin"}'>Or Here</div>
									<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyphClasses":"fa fa-cog fa-spin"}'>Not There</div>
									<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyphClasses":"fa fa-refresh fa-spin"}'>Look Behind You!</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div data-ibx-type="ibxMenuButtonSeparator"></div>
				<div class="menu-btn-window" data-ibx-type="ibxVMenuButton">
					Window
					<div data-ibx-type="ibxMenuItem">Cascade</div>
					<div data-ibx-type="ibxMenuItem">Tile</div>
					<div data-ibx-type="ibxMenuSeparator"></div>
					<div data-ibx-type="ibxMenuItem">Maximize</div>
					<div data-ibx-type="ibxMenuItem">Minimize</div>
				</div>
				<div class="menu-btn-help" title="Help" data-ibx-type="ibxMenuButton" data-ibxp-glyph="help_outline" data-ibxp-glyph-classes="material-icons md-14"></div>
			</div>
			<!--VMENU BAR-->

			<!--MENU BUTTONS-->
			<div class="menubutton-label grid-cell" data-ibx-row="3/span 1" data-ibx-col="1/span 1" data-ibx-type="ibxLabel" data-ibxp-text-wrap="true">These are ibxMenuButtons</div>
			<div class="menubutton-box grid-cell" data-ibx-type="ibxHBox" data-ibxp-align="center" data-ibx-row="3/span 1" data-ibx-col="2/span 1fr">
	
				<div class="split-menu-button" tabIndex="0" data-ibx-type="ibxHSplitMenuButton" data-ibxp-default-menu-item=".def-item" data-ibxp-glyph-classes="fa fa-18 fa-gears">
					Horizontal Split Button
					<div data-ibx-type="ibxMenu">
						<div data-ibxp-aria.labelled-by="xx" data-ibx-type="ibxMenuItem">Menu Item</div>
						<div class="def-item" data-ibx-type="ibxMenuItem">Default Menu Item</div>
						<div data-ibx-type="ibxMenuItem">Menu Item</div>
					</div>
				</div>

				<div class="split-menu-button" tabIndex="0" data-ibx-type="ibxVSplitMenuButton" data-ibxp-default-menu-item=".def-item" data-ibxp-glyph-classes="fa fa-18 fa-gears">
					Vertical Split Button
					<div data-ibx-type="ibxMenu">
						<div class="def-item" data-ibx-type="ibxMenuItem">Default Menu Item</div>
						<div data-ibx-type="ibxMenuItem">Menu Item</div>
						<div data-ibx-type="ibxMenuItem">Menu Item</div>
					</div>
				</div>

				<div class="test-menu-btn menu-btn" tabIndex="0" data-ibx-type="ibxMenuButton" data-ibxp-text="Menu 1" data-ibxp-icon-position="top">
					<div data-ibx-type="ibxMenuItem">Menu Item 1</div>
					<div data-ibx-type="ibxMenuItem">Menu Item 2</div>
					<div data-ibx-type="ibxMenuItem">Menu Item 3</div>
				</div>
				<div class="menu-btn" tabIndex="0" title="Cigarette Brand Choice" data-ibx-type="ibxMenuButton" data-ibxp-glyph="smoking_rooms" data-ibxp-glyph-classes="material-icons md-24" data-ibxp-icon-position="top">
					<div data-ibx-type="ibxMenuItem">Marlboro</div>
					<div data-ibx-type="ibxMenuItem">Parliament</div>
					<div data-ibx-type="ibxMenuItem">Lucky Strike</div>
				</div>

				<div class="menu-btn" tabIndex="0" title="Text Formatting" data-ibx-type="ibxMenuButton" data-ibxp-glyph="mode_edit" data-ibxp-glyph-classes="material-icons md-24" data-ibxp-icon-position="top">
					<div data-ibx-type="ibxCheckMenuItem" title="Format Bold" data-ibxp-label-options='{"glyph":"format_bold", "glyphClasses":"material-icons md-18"}'></div>
					<div data-ibx-type="ibxCheckMenuItem" title="Format Italic" data-ibxp-label-options='{"glyph":"format_italic", "glyphClasses":"material-icons md-18"}'></div>
					<div data-ibx-type="ibxCheckMenuItem" title="Format Underline" data-ibxp-label-options='{"glyph":"format_underline", "glyphClasses":"material-icons md-18"}'></div>
					<div data-ibx-type="ibxMenuSeparator"></div>
					<div data-ibx-type="ibxRadioGroup" data-ibxp-name="rgAlign"></div>
					<div data-ibx-type="ibxRadioMenuItem" title="Align Left" data-ibxp-group="rgAlign" data-ibxp-label-options='{"glyph":"format_align_left", "glyphClasses":"material-icons md-18"}' data-ibxp-checked="true"></div>
					<div data-ibx-type="ibxRadioMenuItem" title="Align Center" data-ibxp-group="rgAlign" data-ibxp-label-options='{"glyph":"format_align_center", "glyphClasses":"material-icons md-18"}'></div>
					<div data-ibx-type="ibxRadioMenuItem" title="Align Right" data-ibxp-group="rgAlign" data-ibxp-label-options='{"glyph":"format_align_right", "glyphClasses":"material-icons md-18"}'></div>
					<div data-ibx-type="ibxRadioMenuItem" title="Justify" data-ibxp-group="rgAlign" data-ibxp-label-options='{"glyph":"format_align_justify", "glyphClasses":"material-icons md-18"}'></div>
				</div>
			</div>
			<!--MENU BUTTONS-->

			<!--MENU CONTEXT-->
			<div class="ctxmenu-label grid-cell" data-ibx-row="4/span 1" data-ibx-col="1/span 1" data-ibx-type="ibxLabel" data-ibxp-text-wrap="true" data-ibxp-text="this is an ibxMenu used as a context menu"></div>
			<div class="ctxmenu-target grid-cell" tabIndex="0" data-ibx-type="ibxLabel" data-ibx-row="4/span 1" data-ibx-col="2/span 1fr" data-ibxp-ctx-menu=".ctx-menu" data-ibxp-text="Right click here for a context menu!"></div>
			<div class="ctx-menu" data-ibx-type="ibxMenu">
				<div data-ibx-type="ibxMenuItem">Context Menu Item</div>
				<div data-ibx-type="ibxMenuItem">Context Menu Item</div>
				<div data-ibx-type="ibxMenuItem">Context Menu Item</div>
				<div data-ibx-type="ibxMenuItem">Context Menu Item</div>
			</div>
			<!--MENU CONTEXT-->
		</div>
	</body>
</html>
