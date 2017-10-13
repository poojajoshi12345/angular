<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision$:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>IBX Accessibility sample</title>
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
				var menu = $(".test-menu");
				for(var i = 0; i < 10; ++i)
				{
					var item = $("<div>").ibxMenuItem({"labelOptions":{"text": "Menu Item " + i}});
					//var item = $("<div class='ibx-menu-item'>").ibxLabel({"text": "Menu Item " + i});
					menu.ibxWidget("add", item, null, null, false);
				}
				menu.ibxWidget("refresh");

				$(".btnDialog").on("click", function(e)
				{
					$(".dlg").ibxWidget("open");
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
			.main-box > *
			{
				flex:0 0 auto;
				margin:10px;
			}

			.test-frame
			{
				flex:1 1 auto;
				align-self:stretch;
			}

			.parent-key-root
			{
				height:100px;
				border:1px solid black;
			}

			.child
			{
				border:1px solid red;
			}

			.child-key-root
			{
				height:50px;
				border:1px solid lime;
			}

			.dlg
			{
				width:400px;
				height:300px;
			}
			.dlg-ctl-label
			{
				margin:10px 0px 2px 0px;
			}

			.txt-body
			{
				flex:1 1 auto;
			}

			.r-slider.ibx-slider, .h-slider.ibx-slider
			{
				width:200px;
			}

			.test-tab-pane
			{
				width:300px;
				height:300px;
			}

			.test-tab-content
			{
				position:absolute;
				left:0px;
				top:0px;
				right:0px;
				bottom:0px;
			}

			.test-menubar
			{
				border:1px solid #aaa;
				border-radius:.25em;
			}
		</style>
	</head>
	<body class="ibx-root" aria-label="Controls for 5O8 Wicagg2">
		<div class="main-box" data-ibx-type="ibxVBox">

			<div class="test-tab-pane" tabIndex="0" data-ibx-type="ibxTabPane" data-ibxp-inline="true">
				<div data-ibx-type="ibxTabPage">Page 1
					<div class="test-tab-content" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
						<div data-ibx-type="ibxLabel">Tab Page</div>
					</div>
				</div>
				<div data-ibx-type="ibxTabPage">Page 2
					<div class="test-tab-content" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
						<div data-ibx-type="ibxLabel">Tab Page</div>
					</div>
				</div>
			</div>

			<div tabIndex="" data-ibx-type="ibxWidget" data-ibxp-nav-key-root="true">
				<div class="h-slider" tabIndex="0" data-ibx-type="ibxHSlider" data-ibxp-value-text-pos="end" data-ibxp-min-text-pos="center" data-ibxp-max-text-pos="center"></div>
				<div class="r-slider" tabIndex="0" data-ibx-type="ibxHRange" data-ibx-options="{value:25, value2:75, valueTextPos:'end', minTextPos:'center', maxTextPos:'center'}"></div>
			</div>

			<div tabIndex="" data-ibx-type="ibxWidget" data-ibxp-nav-key-root="true">
				<button tabIndex="0">Native</button>
				<div tabIndex="0" data-ibx-type="ibxButton">IBX</div>
				<div tabIndex="0" class="btnDialog" data-ibx-type="ibxButton">Dialog</div>
				<div class="dlg" data-ibx-type="ibxDialog" data-ibxp-destroy-on-close="false" data-ibxp-auto-size="false">
					<div id="txtTitleLabel" class="dlg-ctl-label" data-ibx-type="ibxLabel">Enter Title:</div>
					<div tabindex="0" class="txt-title" data-ibx-type="ibxTextField" data-ibxp-placeholder="Enter one line of text" data-ibxp-aria.labelled-By="txtTitleLabel" data-ibxp-default-focused="true"></div>
					<div id="txtBodyLabel" class="dlg-ctl-label" data-ibx-type="ibxLabel">Enter Text Here:</div>
					<div tabindex="0" class="txt-body" data-ibx-type="ibxTextArea"  data-ibxp-placeholder="Enter multiple line of text" data-ibxp-aria.labelled-by="txtBodyLabel" data-ibxp-aria.described-by="txtBodyLabel"></div>
				</div>
			</div>

			<div class="test-menubar grid-cell" tabIndex="0" aria-label="Example IBX horizontal menu bar" data-ibx-type="ibxHMenuBar" data-ibx-row="1/span 1" data-ibx-col="2/span 1fr">
				<div class="menu-btn-file" data-ibx-type="ibxMenuButton" data-ibxp-text="File">
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
				<div class="menu-btn-edit" data-ibx-type="ibxMenuButton" data-ibxp-text="Edit">
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
				<div class="menu-btn-view" data-ibx-type="ibxMenuButton" data-ibxp-text="View">
					<div class="view-menu" data-ibx-type="ibxMenu">
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
				</div>
				<div data-ibx-type="ibxMenuButtonSeparator"></div>
				<div class="menu-btn-window" data-ibx-type="ibxMenuButton">
					Window
					<div class="window-menu" data-ibx-type="ibxMenu">
						<div data-ibx-type="ibxMenuItem">Cascade</div>
						<div data-ibx-type="ibxMenuItem">Tile</div>
						<div data-ibx-type="ibxMenuSeparator"></div>
						<div data-ibx-type="ibxMenuItem">Maximize</div>
						<div data-ibx-type="ibxMenuItem">Minimize</div>
					</div>
				</div>
				<div class="menu-btn-help" title="Help" data-ibx-type="ibxMenuButton" data-ibxp-glyph="help_outline" data-ibxp-glyph-classes="material-icons md-14"></div>
			</div>

			<div tabIndex="0" data-ibx-type="ibxSwitch" data-ibxp-aria.label="IBX switch"></div>

			<div tabIndex="0" data-ibx-type="ibxWidget" data-ibxp-nav-key-root="true" data-ibxp-nav-key-dir="both">
				<div tabIndex="-1" data-ibx-type="ibxCheckBoxSimple">Check 1</div>
				<div tabIndex="-1" data-ibx-type="ibxCheckBoxSimple">Check 2</div>
				<div tabIndex="-1" data-ibx-type="ibxCheckBoxSimple">Check 3</div>
			</div>
			<div tabIndex="0" data-ibx-type="ibxWidget" data-ibxp-nav-key-root="true" data-ibxp-nav-key-dir="both">
				<div data-ibx-type="ibxRadioGroup" data-ibxp-name="rgTest"></div>
				<div tabIndex="-1" data-ibx-type="ibxRadioButtonSimple" data-ibxp-group="rgTest">Radio 1</div>
				<div tabIndex="-1" data-ibx-type="ibxRadioButtonSimple" data-ibxp-group="rgTest">Radio 2</div>
				<div tabIndex="-1" data-ibx-type="ibxRadioButtonSimple" data-ibxp-group="rgTest">Radio 3</div>
			</div>

			<div tabIndex="" data-ibx-type="ibxWidget" data-ibxp-nav-key-root="true">
				<div id="txtFieldLabel" data-ibx-type="ibxLabel">Text Field Label:</div>
				<div tabIndex="0" data-ibxp-disabled="false" data-ibx-type="ibxTextField" data-ibxp-aria.labelledby="txtFieldLabel"></div>
		
				<div id="txtAreaLabel" data-ibx-type="ibxLabel">Text Area Label:</div>
				<div tabIndex="0" data-ibxp-disabled="false" data-ibx-type="ibxTextArea" data-ibx-type="ibxTextField" data-ibxp-aria.labelledby="txtAreaLabel"></div>
			</div>

		</div>
	</body>
</html>
