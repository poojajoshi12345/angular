<%-- Copyright 1996-2017 Information Builders, Inc. All rights reserved. --%>
<%-- $Revision$--%><%@ page language="java" contentType="text/html" pageEncoding="UTF-8"%>
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
		<title>explore widget test</title>
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
				var explore = ibx.resourceMgr.getResource('.explore_widget_resources', true);					
				explore.ibxWidget({ctxPath: "IBFS:/WFC/Repository"});
				$(".main-box").append(explore);	
				
				explore.on("ibx_explore_widget_doubleclick", function(e, item)
				{
						debugger;					
				});	
				explore.on("ibx_explore_widget_filemenu", function(e, item)
				{
						debugger;					
				});	
				explore.on("ibx_explore_widget_foldermenu", function(e, item)
				{
						debugger;					
				});
				explore.on("ibx_explore_widget_click", function(e, item)
				{
						debugger;					
				});
				
				var explore2 = ibx.resourceMgr.getResource('.explore_widget_resources', true);					
				explore2.ibxWidget({ctxPath: "IBFS:/WFC/Repository/Retail_Samples"});
				$(".main-box2").append(explore2);	
				
				explore2.on("ibx_explore_widget_doubleclick", function(e, item)
				{
						debugger;					
				});	
				explore2.on("ibx_explore_widget_filemenu", function(e, item)
				{
						debugger;					
				});	
				explore2.on("ibx_explore_widget_foldermenu", function(e, item)
				{
						debugger;					
				});
				explore2.on("ibx_explore_widget_click", function(e, item)
				{
						debugger;					
				});
				
				
			}, ["../../ibxtools/explore/explore_widget.xml"], true);
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
	<div data-ibx-type="IbxVBox" data-ibxp-align="stretch">	
	<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="stretch" style="width:800px; height:500px; overflow-y:auto; overflow-x: hidden;">
	</div>	
	<div class="main-box2" data-ibx-type="ibxVBox" data-ibxp-align="stretch" style="position:relative; top: 520px; width:800px; height:500px; overflow-y:auto; overflow-x: hidden;">
	</div>
	</div>	
	</body>
</html>

