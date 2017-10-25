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
			<jsp:include page="/WEB-INF/jsp/global/wf_globals.jsp" flush="false" />
			ibx(function()
			{
				$("body").on("keydown", function(e)
				{
					if(e.ctrlKey && e.key == 'c')
						console.clear();
				});

				$(".parent, .child, .ibx-menu-bar, .ibx-menu-button").on("focus blur", function(e)
				{
					//if(e.target.id == "parent")
					//	debugger;
					console.log(e.type, e.target.id);
				});

				$(".parent, .ibx-menu-bar").on("ibx_widgetfocus ibx_widgetblur", function(e)
				{
					//if(e.type == "ibx_widgetfocus" && e.target.id == "child")
					//	debugger;
					console.log(e.type, e.target.id);
				});

			}, null, true);
		</script>
		<style type="text/css">
			.main-box
			{
				position:absolute;
				left:0px;
				top:0px;
				right:0px;
				bottom:0px;
				overflow:auto;
			}

			.parent
			{
				border:2px solid red;
			}

			.child
			{
				border:inherit;
				border-color:lime;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">

			<div id="parent" class="parent" tabIndex="0" data-ibx-type="ibxWidget" data-ibxp-nav-key-root="true" data-ibxp-nav-key-auto-focus="true">Parent
				<div id="child" class="child" tabIndex="-1" data-ibx-type="ibxWidget">Child</div>
			</div>

			<div id="menubar" class="test-menubar" tabIndex="0" aria-label="Example IBX horizontal menu bar" data-ibx-type="ibxHMenuBar" data-ibxp-aria.label="Menus">
				<div id="filemenu" class="menu-btn-file" data-ibx-type="ibxMenuButton" data-ibxp-text="File">
					<div data-ibx-type="ibxMenu">
						<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyph":"fiber_new", "glyphClasses":"material-icons"}'>New</div>
						<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyph":"open_in_new", "glyphClasses":"material-icons"}'>Open...</div>
						<div data-ibx-type="ibxMenuSeparator"></div>
						<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyph":"save", "glyphClasses":"material-icons"}'>Save</div>
						<div data-ibx-type="ibxMenuItem">Save As...</div>
						<div data-ibx-type="ibxMenuSeparator"></div>
						<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyph":"exit_to_app", "glyphClasses":"material-icons"}'>Exit</div>
					</div>
				</div>
				<div id="editmenu" class="menu-btn-edit" data-ibx-type="ibxMenuButton" data-ibxp-text="Edit">
					<div data-ibx-type="ibxMenu" data-ibxp-multi-select="true">
						<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyph":"content_cut", "glyphClasses":"material-icons"}'>Cut</div>
						<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyph":"content_copy", "glyphClasses":"material-icons"}'>Copy</div>
						<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyph":"content_paste", "glyphClasses":"material-icons"}'>Paste</div>
						<div data-ibx-type="ibxMenuSeparator"></div>
						<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyph":"find_in_page", "glyphClasses":"material-icons"}'>Find...</div>
						<div data-ibx-type="ibxMenuSeparator"></div>
						<div data-ibx-type="ibxCheckMenuItem" data-ibxp-label-options='{"glyph":"accessibility", "glyphClasses":"material-icons"}'>Check This</div>
						<div data-ibx-type="ibxCheckMenuItem" data-ibxp-label-options='{"glyph":"android", "glyphClasses":"material-icons"}'>Check That</div>
						<div data-ibx-type="ibxCheckMenuItem" data-ibxp-label-options='{"glyph":"face", "glyphClasses":"material-icons"}'>Check Yo Head</div>
					</div>
				</div>
				<div id="viewmenu" class="menu-btn-view" data-ibx-type="ibxMenuButton" data-ibxp-text="View">
					<div class="view-menu" data-ibx-type="ibxMenu">
						<div data-ibx-type="ibxRadioGroup" data-ibxp-name="rgMenuHViewAs"></div>
						<div data-ibx-type="ibxRadioMenuItem" data-ibxp-checked="true" data-ibxp-group="rgMenuHViewAs" data-ibxp-label-options='{"glyph":"view_list", "glyphClasses":"material-icons"}' data-ibxp-checked="true">as List</div>
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
				</div>
				<div data-ibx-type="ibxMenuButtonSeparator"></div>
				<div id="windowmenu" class="menu-btn-window" data-ibx-type="ibxMenuButton">
					Window
					<div class="window-menu" data-ibx-type="ibxMenu">
						<div data-ibx-type="ibxMenuItem">Cascade</div>
						<div data-ibx-type="ibxMenuItem">Tile</div>
						<div data-ibx-type="ibxMenuSeparator"></div>
						<div data-ibx-type="ibxMenuItem">Maximize</div>
						<div data-ibx-type="ibxMenuItem">Minimize</div>
					</div>
				</div>
				<div id="helpmenu" class="menu-btn-help" title="Help" data-ibx-type="ibxMenuButton" data-ibxp-glyph="help_outline" data-ibxp-glyph-classes="material-icons md-14"></div>
			</div>

		</div>
	</body>
</html>
