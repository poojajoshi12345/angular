<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision$:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html>
	<head>
		<title>ibx runner sample</title>
		<meta http-equiv="X-UA-Compatible" content="IE=EDGE" >
		<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="Expires" content="0" />
		<meta name="google" value="notranslate">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<!--include this script...will boot ibx into the running state-->
		<Script src="<%=request.getContextPath()%>/ibx/resources/ibx.js" type="text/javascript"></script>
		<Script src="tree.pd.js" type="text/javascript"></script>
		
		<script type="text/javascript">
			<jsp:include page="/WEB-INF/jsp/global/wf_globals.jsp" flush="false" />

			ibx(function()
			{	
				var phone=false;
				if ($(window).width() < 480 || $(window).height() < 480) phone=true;  			

				$(".button-bar > .ibx-button").on("click", function(e)
				{
					var btn =  $(e.currentTarget);
					var bar = btn.data("user-data");
					$((bar == ".all") ? ".grid-bar" : bar).ibxCollapsible("toggle");
				});
										
				$(".left-bar").ibxCollapsible({autoClose:false, direction:"left", startCollapsed:false});				
				
				$(".frame-out").droppable().on("drop", function(e, ui)
				{
					var type = ui.helper.data('type');
					var item = JSON.parse(ui.helper.data('item'));				
					runIt(item);					
				});
								
				$( document ).on( "treedoubleclick", function(e, item)
				{	
					runIt(item);											
				});	
				
				function runIt(item)
				{
					var uriExec = sformat("{1}/run.bip?BIP_REQUEST_TYPE=BIP_LAUNCH&BIP_folder={2}&BIP_item={3}", applicationContext,
						encodeURIComponent(item.parentPath), encodeURIComponent(item.name));									
					$(".frame-out").ibxWidget("option", "src", uriExec);
					$(".fex-text").text(item.description);	
					if(phone)$(".left-bar").ibxCollapsible("toggle");				
				};				
				var loaded = Ibfs.load("<%=request.getContextPath()%>", WFGlobals.ses_auth_parm, WFGlobals.ses_auth_val);
					loaded.done(function(ibfs)
					{
						//ibfs.login("admin", "admin").done(function()
						//{
							var rootItem = new IbfsRootItem(ibfs);
							$(".left-bar").append(rootItem.getElement());							
						//});
					});
				
			}, true);
			
			
		</script>
		<link rel="stylesheet" type="text/css" href="tree.pd.css">
		
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
				z-index:1;				
			}
			.tool-bar .ibx-widget
			{
				margin-right:3px;
			}
			.tool-bar-title
			{
				flex:1 1 auto;
			}
			.bottom-bar
			{
				//border:1px solid gray;	
				height: 2px;
				
			}
			.menu-bar
			{
				font-size:.8em;
			}		

			.top-bar 
			{
				height:24px;
			}
			.left-bar
			{
				width:200px;
				overflow:auto;
				//overflow-x:scroll;				 
				-webkit-overflow-scrolling: scroll; 
				border:1px solid gray;
			}
			.button-bar
			{
				width:50%;
			}
			.fex-text
			{				
				align:center;
				text-align:center;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="outer-grid-container-for-ios-bug"> 
			<div class="grid-main" data-ibx-type="ibxGrid" data-ibxp-cols="auto 1fr auto" data-ibxp-rows="auto auto 1fr auto" >
				<div class="tool-bar" data-ibx-type="ibxHBox" data-ibx-align="center" data-ibx-col="1/span 2" data-ibx-row="1/span 1">
					<div class="button-bar" data-ibx-type="ibxHBox" data-ibx-align="center">						
						<div data-user-data=".left-bar" data-ibx-type="ibxButton" data-ibxp-glyph="menu" data-ibxp-glyph-classes="material-icons"></div>																						
					</div>
					<div class="fex-text" data-ibx-type="ibxHBox" ></div>								
				</div> 						
				<div class="left-bar" data-ibx-col="1/span 1" data-ibx-row="2/span 2"></div>
				<div class="frame-out" data-ibx-type="ibxIFrame" data-ibxp-auto-correct="false" data-ibxp-auto-capitalize="false" 
					data-ibxp-src="./iframe_placeholder.jsp" data-ibx-col="2/1fr" data-ibx-row="3/span 1"></div>		
				
		
				<div class="bottom-bar" data-ibx-type="ibxHBox" data-ibx-col="1/span 2" data-ibx-row="4/span 1" data-ibx-align="center" ></div>		
									
			</div>
		</div>

	</body>
</html>

