﻿<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision$:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>ibx property grid</title>
		<meta http-equiv="X-UA-Compatible" content="IE=11" >
		<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="Expires" content="0" />
		<meta name="google" value="notranslate">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<!--include this script...will boot ibx into the running state-->
		<Script src="<%=request.getContextPath()%>/ibx/resources/ibx.js" type="text/javascript"></script>
		<script type="text/javascript">
			ibx(function()
			{
				$(".btn-load-props").on("click", function(e)
				{
					$(".test-grid").ibxWidget("option", "props", sampleProps);
				});
				$(".btn-expand-all").on("click", function(e)
				{
					$(".test-grid").ibxWidget("expandRow", null, true);
				});
				$(".btn-collapse-all").on("click", function(e)
				{
					$(".test-grid").ibxWidget("expandRow", null, false);
				});
				$(".btn-clear-log").on("click", function(e)
				{
					$(".event-log").ibxWidget("value", "");
				});
				$(".test-grid").on("ibx_prop_updated", function(e)
				{
					var eType = e.type;
					var data = e.originalEvent.data;
					if(eType == "ibx_prop_updated")
					{
						var prop = data.prop;
						if(prop.dataType == "custom_dlg")
							alert("I show some extended ui");
							
						var log = $(".event-log");
						var txt = log.ibxWidget("value");
						txt += sformat("{1}: {2}\n", data.prop.displayName, data.prop.value);
						log.ibxWidget("value", txt).ibxWidget("scrollTop", 100000);
					}
				}).ibxWidget("option", "props", sampleProps);

			}, [{"src":"./propgrid_res.xml", "loadContext":"app"}], true);
		</script>
		<style type="text/css">
			body
			{
				position:absolute;
				margin:0px;
				width:100%;
				height:100%;
				box-sizing:border-box;
			}
			.tbar
			{
				flex:0 0 auto;
				padding:5px;
				border:1px solid #ccc;
			}
			.tbar-btn
			{
				margin-right:5px;
			}
			.tbar-separator
			{
				border-left:1px solid #ccc;
				margin-right:5px
			}
			.test-grid
			{
				flex:0 0 auto;
			}
			.pgrid-row:not(.dgrid-row-hidden):nth-of-type(odd)
			{
				background-color:#f5f5f5;
			}
			.logbox
			{
				flex:1 1 auto;
			}
			.event-log
			{
				flex:1 1 1px;
				font-family:monospace;
			}
		</style>
	</head>
	<body class="ibx-root" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
		<div class="tbar" data-ibx-type="ibxHBox" data-ibxp-align="stretch">
			<div tabindex="0" class="tbar-btn btn-load-props" data-ibx-type="ibxButton">Load Sample Properties</div>
			<div class="tbar-separator"></div>
			<div tabindex="0" class="tbar-btn btn-expand-all" data-ibx-type="ibxButton">Expand All</div>
			<div tabindex="0" class="tbar-btn btn-collapse-all" data-ibx-type="ibxButton">Collapse All</div>
			<div class="tbar-separator"></div>
			<div tabindex="0" class="tbar-btn btn-clear-log" data-ibx-type="ibxButton">Clear Event Log</div>
		</div>

		<div class="logbox" data-ibx-type="ibxHBox" data-ibxp-align="stretch">
			<div tabindex="0" class="test-grid" data-ibx-type="ibxPropertyGrid"></div>
			<div class="" data-ibx-type="ibxVSplitter"></div>
			<div tabindex="0" class="event-log" data-ibx-type="ibxTextArea"></div>
		</div>
	</body>
</html>