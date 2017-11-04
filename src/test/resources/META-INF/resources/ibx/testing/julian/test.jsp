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

				$(".parent-div").on("ibx_dragover", function(e)
				{
					e.dataTransfer.dropEffect = "pointer";
				});

				$(".parent-div").on("click", function(e)
				{
					$.ibi.ibxWidget.noRefresh = true;

					var date = new Date();
					var parent = $(".parent-div");
					for(var i = 0; i < 1000; ++i)
					{
						var item = $("<div>").ibxLabel({"text":"Item " + i});
						parent.append(item);
					}
					console.log("CREATED: " +  (new Date() - date).toString());

					$.ibi.ibxWidget.noRefresh = false;
					date = new Date();
					$(".ibx-widget").ibxWidget("refresh");
					console.log("REFRESHED: " + (new Date() - date).toString());
				});

				$(".parent, .child").on("ibx_widgetfocus ibx_widgetblur", function(e)
				{
					//console.log(e.type, e.target.id, e.relatedTarget ? e.relatedTarget.id : "");
				});
				$(".parent, .child").on("focus blur", function(e)
				{
					//console.log(e.type, e.target.id, e.relatedTarget ? e.relatedTarget.id : "");
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
				overflow:auto;
				border:1px solid black;
				margin-bottom:10px;
				padding:5px;
			}
			.parent1a
			{
				margin:5px;
			}

			.child
			{
				xborder:inherit;
				xborder-color:lime;
				margin:5px;
			}

			.test-menubar
			{
				border:1px solid black;
				border-radius:.25em;
				padding:5px;
			}

			.ibx-nav-item-active
			{
				background-color:thistle;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div id="mainBox" class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center" data-ibx-name-root="true">
			<div class="cmd-test" data-ibx-type="ibxCommand" data-ibx-name="cmdTest" data-ibxp-cmd-id="cmdTest" data-ibxp-shortcut="ctrl+x"></div>

			
			<div id="parent1" tabIndex="0" class="parent parent1 source" data-ibx-type="ibxHBox" data-ibxp-align="center" data-ibxp-nav-key-root="true" data-ibxp-nav-key-auto-focus="true">
				Parent Widget 1:
				<div id="p1_child1" tabIndex="-1" class="child child1" data-ibx-type="ibxWidget">Child Widget</div>
				<div id="p1_child2" tabIndex="-1" class="child child2" data-ibx-type="ibxWidget">Child Widget</div>

				<div id="parent1a" tabIndex="-1" class="parent parent1a source" data-ibx-type="ibxHBox" data-ibxp-align="center" data-ibxp-nav-key-root="true" data-ibxp-nav-key-auto-focus="true">
					Parent Widget 1A:
					<div id="p1a_child1" tabIndex="-1" class="child child1" data-ibx-type="ibxWidget">Child Widget</div>
					<div id="p1a_child2" tabIndex="-1" class="child child2" data-ibx-type="ibxWidget">Child Widget</div>
					<div id="p1a_child3" tabIndex="-1" class="child child3" data-ibx-type="ibxWidget">Child Widget</div>
				</div>

				<div id="p1_child3" tabIndex="-1" class="child child3" data-ibx-type="ibxWidget">Child Widget</div>
				<div id="p1_child4" tabIndex="-1" class="child child4" data-ibx-type="ibxWidget">Child Widget</div>
			</div>
			
			<div id="parent2" tabIndex="0" class="parent parent2 source" data-ibx-type="ibxHBox" data-ibxp-align="center" data-ibxp-nav-key-root="true" data-ibxp-nav-key-auto-focus="true">
				Parent Widget 2:
				<div id="p2_child1" tabIndex="-1" class="child child1" data-ibx-type="ibxWidget">Child Widget</div>
				<div id="p2_child2" tabIndex="-1" class="child child2" data-ibx-type="ibxWidget">Child Widget</div>
				<div id="p2_child3" tabIndex="-1" class="child child3" data-ibx-type="ibxWidget">Child Widget</div>
			</div>

			<!--
			<div id="parentDiv" class="parent parent-div">Parent Div</div>
			<div id="parentWidget" class="parent parent-widget source" data-ibx-type="ibxWidget" data-ibxp-draggable="true">Source Widget</div>
			<div id="parentWidget" class="parent parent-widget target" data-ibx-type="ibxWidget">Target Widget</div>
			-->

			<div data-ibxp-draggable="true" id="menubar" class="test-menubar" tabIndex="0" aria-label="Example IBX horizontal menu bar" data-ibx-type="ibxHMenuBar" data-ibxp-aria.label="Menus" data-ibxp-nav-key-reset-focus-on-blur="false">
				<div id="filemenu" class="menu-btn-file" data-ibx-type="ibxMenuButton" data-ibxp-text="File">
					<div data-ibx-type="ibxMenu">
						<div data-ibxp-command="cmdTest" data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyph":"fiber_new", "glyphClasses":"material-icons"}'>New</div>
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
						<div data-ibxp-command="cmdTest" data-ibx-type="ibxCheckMenuItem" data-ibxp-label-options='{"glyph":"accessibility", "glyphClasses":"material-icons"}'>Check This</div>
						<div data-ibxp-command="cmdTest" data-ibx-type="ibxCheckMenuItem" data-ibxp-label-options='{"glyph":"android", "glyphClasses":"material-icons"}'>Check That</div>
						<div data-ibxp-command="cmdTest" data-ibx-type="ibxCheckMenuItem" data-ibxp-label-options='{"glyph":"face", "glyphClasses":"material-icons"}'>Check Yo Head</div>
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
