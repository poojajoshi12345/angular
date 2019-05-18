<%-- Copyright 1996-2017 Information Builders, Inc. All rights reserved. --%>
<%-- $Revision: 1.1 $--%><%@ page language="java" contentType="text/html" pageEncoding="UTF-8"%>
<jsp:useBean id="resourceBean" class="com.ibi.web.res.ResourceBundleBean" scope="request"><jsp:setProperty name="resourceBean" property="request" value="<%= request %>" /></jsp:useBean>              
<%

    String applicationContext = request.getContextPath();
    com.ibi.resourceutil.IbiResourceBundle res = resourceBean.getResourceBundle( "com.ibi.intl.homepage.home");
%><!DOCTYPE html>
<%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>

<html lang="en">
	<head>
		<title>ibx labels & fonts sample</title>
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
			<jsp:include page="/WEB-INF/jsp/ibx/ibxInit.jsp" flush="false" />
			
			ibx(function()
			{debugger;
				
				$(".btn-show-save-dialog").on("click", function()
				{		
					var saveDlg = ibx.resourceMgr.getResource('.open-dialog-resources', true);
					saveDlg.ibxWidget({fileTypes:[["All Images","all"],["PNG", "png"],["GIF", "gif"]],
	        			dlgType:"save", title: "Save", ctxPath: "IBFS:/WFC/Repository/stupid/dummy/abcd"});
	        			
					saveDlg.ibxWidget('open');
					saveDlg.ibxWidget('fileName','test name');
	        		saveDlg.ibxWidget('fileTitle','test title');						
					saveDlg.on("ibx_beforeclose", function(e, closeData)
					{
						debugger;
						//return false;
					}).on("ibx_close", function (e, closeData)
					{						
						debugger;
						if(closeData == "ok")
						{
							var fileName = saveDlg.ibxWidget('fileName');			
							var description = saveDlg.ibxWidget('fileTitle');
							var ibfsItems = saveDlg.ibxWidget('ibfsItems');
							var itemPath = (ibfsItems.length > 0) ? ibfsItems[0].fullPath : "none";
							alert("fileName = " + fileName + "\ndescription = " + description + "\nIbfsItem = " + itemPath);
							
						}	
					});
				});	
					$(".btn-show-open-dialog").on("click", function()
					{		debugger;
					var saveDlg = ibx.resourceMgr.getResource('.open-dialog-resources', true);
					saveDlg.ibxWidget({dlgType:"open", disableKeyboardInput: true, okbuttonText: "select", title: "Open",  selectFolder: true, foldersOnly: true,  ctxPath: "IBFS:/WFC/Repository"});						
					
					saveDlg.ibxWidget('open');
					saveDlg.on("ibx_beforeclose", function(e, closeData)
					{
						debugger;
						//return false;
					}).on("ibx_close", function (e, closeData)
					{						
						debugger;
						if(closeData == "ok")
						{
							var fileName = saveDlg.ibxWidget('fileName');			
							var description = saveDlg.ibxWidget('fileTitle');
							var ibfsItems = saveDlg.ibxWidget('ibfsItems');
							var itemPath = (ibfsItems.length > 0 )? ibfsItems[0].fullPath : "none";
							alert("fileName = " + fileName + "\ndescription = " + description + "\nIbfsItem = " + itemPath);
							
						}	
					});
					
					
				});
			}, ["../../ibxtools/explore/explore_open_dialog.xml"], true);
		</script>
		
		<style type="text/css">
			.main-box
			{
				position:absolute;
				left:0px;
				top:0px;
				right:0px;
				bottom:0px;
			}
			
		</style>
	</head>
	<body class="ibx-root" oncontextmenu="return false;">
		<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-justify="center" data-ibxp-align="center">
			<div class="btn-show-save-dialog" data-ibx-type="ibxButton" data-ibxp-text="Show the Save Dialog..."></div>
			<div class="btn-show-open-dialog" data-ibx-type="ibxButton" data-ibxp-text="Show the Open Dialog..."></div>				
		</div>	
			
		
		
	</body>
</html>

