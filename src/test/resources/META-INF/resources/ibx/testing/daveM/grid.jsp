<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision$:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html>
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
				$(".right-bar").ibxCollapsible({autoClose:false, direction:"right", startCollapsed:false});
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
			}
			.grid-bar
			{
				background-color:#eee;
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
			<div class="grid-main" data-ibx-type="ibxGrid" data-ibxp-cols="auto auto 1fr" data-ibxp-rows="auto auto auto 1fr" data-ibxp-align="stretch">


				<div class="top-bar grid-bar" data-ibx-col="1/span 3" data-ibx-row="1">
					menu
				</div>

				<div class="left-bar grid-bar" data-ibx-col="1" data-ibx-row="2/span 3">
					Left Bar
				</div>

				<div class="top-bar grid-bar" data-ibx-col="2/span 2" data-ibx-row="2">
					Top Bar
				</div>
			
				
				<div class="top-bar grid-bar" data-ibx-col="2/span 2" data-ibx-row="3">
					bread crumb
				</div>

				<div class="grid-bar" data-ibx-col="2" data-ibx-row="4">
					Tree control fhfhhfhf
				</div>

				<div class="content" data-ibx-type="ibxLabel" data-ibxp-justify="center" data-ibxp-align="center" data-ibx-col="3" data-ibx-row="4">
					Content
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

