<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision: 1.1 $:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>ibx collapsible sample</title>
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
				$(".button-bar > .ibx-button").on("click", function(e)
				{
					var btn =  $(e.currentTarget);
					var bar = btn.data("user-data");
					$((bar == ".all") ? ".grid-bar" : bar).ibxCollapsible("toggle");
				});

				//buttons to toggle collapsible bars.
				$(".button-bar").ibxCollapsible({direction:"left"});
				$(".toggle-button-bar").on("click", function(e){$(".button-bar").ibxCollapsible("toggle");});
				$(".top-bar").ibxCollapsible({autoClose:false, direction:"top", startCollapsed:false});
				$(".left-bar").ibxCollapsible({autoClose:false, direction:"left", startCollapsed:false});
				$(".right-bar").ibxCollapsible({autoClose:false, direction:"right", startCollapsed:true});
				$(".bottom-bar").ibxCollapsible({autoClose:false, direction:"bottom", startCollapsed:false});
				
				//fake menu bar support.
				$(".open-menu-bar").on("click", function(e){$(".menu-bar").ibxCollapsible("toggle");});
				$(".menu-bar").ibxCollapsible({autoClose:true, direction:"right", startCollapsed:true}).on("ibx_beforeopen ibx_beforeclose", function(e)
				{
					if(e.type == "ibx_beforeopen")
						$(".open-menu-bar").css({opacity:0, transition:"opacity .3s"});
					else
						$(".open-menu-bar").css({opacity:1, transition:"opacity .3s"});
				});

				$(".menu-button").on("click", function(e)
				{
					var btn = $(e.currentTarget);
					var menu = $(btn.data("menu"));
					menu.ibxMenu("option", {posMy:"left top", posAt:"left bottom", posOf:e.currentTarget});
					menu.ibxMenu("open");
				});
			}, true);
			//# sourceURL=splitter_ibx_sample
		</script>

		<style type="text/css">
			/****
				iOS bug where grid with 'bottom' will mess up 'auto' row sizes...treats them as 1fr values...wrap grid in div and use
				100% for grid height;
			****/
			.outer-grid-container-for-ios-bug
			{
				position:absolute;
				left:15px;
				top:15px;
				right:15px;
				bottom:15px;
			}
			.grid-main
			{
				height:100%;
				overflow:hidden;
				border:1px solid gray;
				border-radius:3px;
			}
			.tool-bar
			{
				padding:3px;
				background-color:white;
				border-bottom: 1px solid #aaa;
				z-index:100;
			}
			.tool-bar .ibx-widget
			{
				margin-right:3px;
			}
			.tool-bar-title
			{
				flex:1 1 auto;
			}
			.menu-bar
			{
				font-size:.8em;
			}

			.content
			{
				box-shadow:0 0 10px 0px gray;
				border-radius:3px;
				margin:4px;
			}
			.grid-bar
			{
				background-color:#eee;
				border:1px solid #ccc;
				border-radius:3px;
				margin:4px;
				padding:4px;
				z-index:0;
			}

			.top-bar, .bottom-bar
			{
				height:48px;
			}
			.left-bar, .right-bar
			{
				width:200px;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="outer-grid-container-for-ios-bug">
			<div class="grid-main" data-ibx-type="ibxGrid" data-ibxp-cols="auto 1fr auto" data-ibxp-rows="auto auto 1fr auto" data-ibxp-align="stretch">

				<div class="tool-bar" data-ibx-type="ibxHBox" data-ibxp-align="center" data-ibx-col="1/span 3" data-ibx-row="1/span 1">
					<div class="button-bar" data-ibx-type="ibxHBox" data-ibxp-align="center">
						<div data-ibx-type="ibxLabel" data-ibxp-text="Toggle Bars:"></div>
						<div data-user-data=".left-bar" data-ibx-type="ibxButton" data-ibxp-text="Left Bar"></div>
						<div data-user-data=".right-bar" data-ibx-type="ibxButton" data-ibxp-text="Right Bar"></div>
						<div data-user-data=".top-bar" data-ibx-type="ibxButton" data-ibxp-text="Top Bar"></div>
						<div data-user-data=".bottom-bar" data-ibx-type="ibxButton" data-ibxp-text="Bottom Bar"></div>
						<div data-user-data=".all" data-ibx-type="ibxButton" data-ibxp-text="All"></div>
					</div>
					<div class="toggle-button-bar" title="Hide/Show Button Bar" data-ibx-type="ibxButton" data-ibxp-glyph="swap_horiz" data-ibxp-glyph-classes="material-icons"></div>

					<div class="tool-bar-title"></div>

					<div class="open-menu-bar" title="Show AutoClose Menu Bar" data-ibx-type="ibxButton" data-ibxp-glyph="menu" data-ibxp-glyph-classes="material-icons"></div>
					<div class="menu-bar" data-ibx-type="ibxHBox" data-ibxp-align="center">
						<div class="menu-btn-admin menu-button" data-menu=".menu-administrator" data-ibx-type="ibxButton" data-ibxp-text="Administrator"></div>
						<div class="menu-btn-admintion menu-button" data-menu=".menu-administration" data-ibx-type="ibxButton" data-ibxp-text="Administration"></div>
						<div class="menu-btn-tools menu-button" data-menu=".menu-tools" data-ibx-type="ibxButton" data-ibxp-text="Tools"></div>
						<div class="menu-btn-help menu-button" data-menu=".menu-help" data-ibx-type="ibxButton" data-ibxp-text="Help"></div>
						<div class="btn-signout" data-ibx-type="ibxButton" data-ibxp-text="Signout"></div>
					</div>
				</div>

				<div class="top-bar grid-bar" data-ibx-col="1/span 3" data-ibx-row="2/span 1">
					Top Bar
				</div>
			
				<div class="left-bar grid-bar" data-ibx-col="1/span 1" data-ibx-row="3/span 1">
					Left Bar
				</div>

				<div class="content" data-ibx-type="ibxLabel" data-ibxp-justify="center" data-ibxp-align="center" data-ibx-col="2/1fr" data-ibx-row="3/span 1">
					Content
				</div>
			
				<div class="right-bar grid-bar" data-ibx-col="3/span 1" data-ibx-row="3/span 1">
					<div tabindex="0">TEST DIV</div>
					Right Bar
				</div>

				<div class="bottom-bar grid-bar" data-ibx-col="1/span 3" data-ibx-row="4/span 1">
					Bottom Bar
				</div>
			</div>
		</div>

		<div class="menu-administrator" data-ibx-type="ibxMenu">
			<div data-ibx-type="ibxMenuItem" data-ibxp-text="Change Password..."></div>
		</div>
		<div class="menu-administration" data-ibx-type="ibxMenu">
			<div data-ibx-type="ibxMenuItem" data-ibxp-text="Security Center..."></div>
			<div data-ibx-type="ibxMenuItem" data-ibxp-text="Administration Console..."></div>
			<div data-ibx-type="ibxMenuItem" data-ibxp-text="Magnify Contole..."></div>
			<div data-ibx-type="ibxMenuItem" data-ibxp-text="Manage Private Resources..."></div>
			<div data-ibx-type="ibxMenuSeparator"></div>
			<div data-ibx-type="ibxRadioGroup" data-ibxp-name="rgMode"></div>
			<div data-ibx-type="ibxRadioMenuItem" data-ibxp-group="rgMode" data-ibxp-checked="true" data-ibxp-text="Mode Normal"></div>
			<div data-ibx-type="ibxRadioMenuItem" data-ibxp-group="rgMode" data-ibxp-text="Mode Manager"></div>
		</div>
		<div class="menu-tools" data-ibx-type="ibxMenu">
			<div data-ibx-type="ibxMenuItem" data-ibxp-text="ESRI Configuration Utility..."></div>
			<div data-ibx-type="ibxMenuSeparator"></div>
			<div data-ibx-type="ibxMenuItem" data-ibxp-text="Deferred Status"></div>
			<div data-ibx-type="ibxMenuItem" data-ibxp-text="Stop Requests"></div>
			<div data-ibx-type="ibxMenuItem" data-ibxp-text="Session Viewer"></div>
			<div data-ibx-type="ibxMenuSeparator"></div>
			<div data-ibx-type="ibxMenuItem" data-ibxp-text="Report Caster Explorer..."></div>
			<div data-ibx-type="ibxMenuItem" data-ibxp-text="Report Caster Status"></div>
			<div data-ibx-type="ibxMenuSeparator"></div>
			<div data-ibx-type="ibxMenuItem" data-ibxp-text="Magnify Search Page..."></div>
		</div>
		<div class="menu-help" data-ibx-type="ibxMenu">
			<div data-ibx-type="ibxMenuItem" data-ibxp-text="WebFOCUS Online Help..."></div>
			<div data-ibx-type="ibxMenuSeparator"></div>
			<div data-ibx-type="ibxMenuItem" data-ibxp-text="Information Center"></div>
			<div data-ibx-type="ibxMenuItem" data-ibxp-text="VideoAssist"></div>
			<div data-ibx-type="ibxMenuItem" data-ibxp-text="Technical Library"></div>
			<div data-ibx-type="ibxMenuItem" data-ibxp-text="Community"></div>
			<div data-ibx-type="ibxMenuSeparator"></div>
			<div data-ibx-type="ibxMenuItem" data-ibxp-text="Information Builders Home"></div>
			<div data-ibx-type="ibxMenuSeparator"></div>
			<div data-ibx-type="ibxMenuItem" data-ibxp-text="About WebFOCUS"></div>
			<div data-ibx-type="ibxMenuItem" data-ibxp-text="Licenses"></div>
		</div>
	</body>
</html>

