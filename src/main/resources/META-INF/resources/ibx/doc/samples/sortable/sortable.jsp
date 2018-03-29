﻿<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision$:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>ibx sortable sample</title>
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
				var sortContainerH = $(".sort-parent-h").css("overflow", "auto").ibxHSortable({"lockDragAxis":true, "placeholderClasses":"sort-placeholder"});
				var sortContainerV = $(".sort-parent-v").css("overflow", "auto").ibxVSortable({"lockDragAxis":true, "placeholderClasses":"sort-placeholder"});
				for(var i = 0; i < 100; i++)
				{
					var options = 
					{
						"text": "SortItem " + i,
						"glyph":"face",
						"glyphClasses":"material-icons",
					};
					var item = $(sformat("<div class='sort-item-h item-{1}'>", i)).ibxLabel(options);
					sortContainerH.ibxWidget("add", item);

					var item = $(sformat("<div class='sort-item-v item-{1}'>", i)).ibxLabel(options);
					sortContainerV.ibxWidget("add", item);
				}
			}, true);
		</script>
		<style type="text/css">
			html, body
			{
				width: 100%;
				height: 100%;
				margin: 0px;
			}
			.main-box
			{
				width:100%;
				height:100%;
			}
			.sort-parent-h
			{
				width:75%;
				padding:3px;
				margin:10px;
				overflow:auto;
				border:1px solid #ccc;
				box-sizing:border-box;
				user-select:none;
				-moz-user-select:none;
				-ms-user-select:none;
			}
			.sort-item-h
			{
				flex:0 0 auto;
				width:100px;
				height:25px;
				margin:3px;
				padding:5px;
				border:1px solid black;
			}
			.sort-parent-v
			{
				height:75%;
				padding:3px;
				overflow:auto;
				border:1px solid #ccc;
				box-sizing:border-box;
				user-select:none;
				-moz-user-select:none;
				-ms-user-select:none;
			}
			.sort-item-v
			{
				flex:0 0 auto;
				width:300px;
				height:25px;
				margin:3px;
				padding:5px;
				border:1px solid black;
			}
			.sort-placeholder
			{
				border:2px solid red;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
			<div class="sort-parent-h" data-ibx-type="ibxHBox" data-ibxp-align="stretch" data-ibxp-wrap="false"></div>
			<div class="sort-parent-v" data-ibx-type="ibxVBox" data-ibxp-align="stretch" data-ibxp-wrap="false"></div>
		</div>
	</body>
</html>
