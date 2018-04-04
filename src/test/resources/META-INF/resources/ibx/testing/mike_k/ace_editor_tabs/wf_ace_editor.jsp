<%-- Copyright 1996-2018 Information Builders, Inc. All rights reserved. 
 $Revision$:
--%><!DOCTYPE html>
<jsp:useBean id="WEBFOCUS_SECURITY_SETTING" class="com.ibi.webapp.security.config.WFSecuritySetting" scope="request"></jsp:useBean><jsp:useBean 
id="wflicense" class="com.ibi.web.bean.WFLicenseRedirectBean" scope="request"></jsp:useBean><jsp:useBean 
id="browser" class="com.ibi.web.bean.WFDetectBrowserBean" scope="request"><jsp:setProperty 
name="browser" property="request" value="<%= request %>" /><jsp:setProperty 
name="browser" property="response" value="<%= response %>" /><jsp:setProperty 
name="browser" property="wflicense" value="<%= wflicense %>" /></jsp:useBean><jsp:useBean 
id="resourceBean" class="com.ibi.web.res.ResourceBundleBean" scope="request"><jsp:setProperty 
name="resourceBean" property="request" value="<%= request %>" /></jsp:useBean><jsp:useBean 
id="wfLanguage" class="com.ibi.web.bean.WFLanguageBean" scope="request"><jsp:setProperty 
name="wfLanguage" property="inLang" value="<%=browser.getSelLanguage()%>"/></jsp:useBean><%@ 
page import="org.owasp.esapi.*,  
			com.ibi.util.StringEscapeUtils,
			com.ibi.webapp.security.util.WFSecurityUtils"
%><%
	browser.setClearCache();
	String applicationContext = ESAPI.encoder().encodeForHTMLAttribute(request.getContextPath() );
	String IBI_HELP = StringEscapeUtils.escapeJavaScript(com.ibi.common.ApplicationValueNames.IBI_HELP_CONTEXT.getIBIInitParameter());
	String SecurityUserName = WFSecurityUtils.getUserId();
	String SecurityUserDescription = WFSecurityUtils.getUserDescription();
	String SecurityUserLabel = StringEscapeUtils.escapeXml(SecurityUserDescription.equals("") ? SecurityUserName : SecurityUserDescription);
	com.ibi.resourceutil.IbiResourceBundle res =  com.ibi.resourceutil.BindowsResourceBundleBean.GetResourceBundle(application,request,"com.ibi.intl.bip_editor.bip_editor");
	String context = request.getContextPath();
	
	String rootFolderPath = "";
	String folderPath = "";
	String itemName = "";
	String mode = "";
	
	try
	{
		rootFolderPath = request.getParameter("rootFolderPath") == null ? "" : StringEscapeUtils.escapeJavaScript(request.getParameter("rootFolderPath"));
	}
	catch(Exception e)
	{}
	
	try
	{
		folderPath = request.getParameter("folderPath") == null ? "" : StringEscapeUtils.escapeJavaScript(request.getParameter("folderPath"));
	}
	catch(Exception e)
	{}
	
	try
	{
		itemName = request.getParameter("itemName") == null ? "" : StringEscapeUtils.escapeJavaScript(request.getParameter("itemName"));
	}
	catch(Exception e)
	{}
	
	try
	{
		mode = request.getParameter("mode") == null ? "" : StringEscapeUtils.escapeJavaScript(request.getParameter("mode"));
	}
	catch(Exception e)
	{}
%>
<html lang="<%=browser.getLanguageTag() %>">
	<head>
		<title>ibx text editor sample</title>
		<meta http-equiv="X-UA-Compatible" content="IE=EDGE" >
		<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="Expires" content="0" />
		<meta name="google" value="notranslate">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<!-- link rel="shortcut icon" type="image/x-icon" href="<%=context%>/ibx/testing/mike_k/ace_editor_tabs/resources/img/app-logo-ted.png" / -->

		<!--include this script...will boot ibx into the running state-->
		<Script src="<%=context%>/ibx/resources/ibx.js" type="text/javascript"></script>
		<script src="<%=context%>/3rdparty_resources/ace-1.3.1/src/ace.js" type="text/javascript" charset="utf-8"></script>
		<script type="text/javascript">
			<jsp:include page="/WEB-INF/jsp/global/wf_globals.jsp" flush="false" />
			<jsp:include page="/WEB-INF/jsp/ibx/ibxInit.jsp" flush="false" />

			ibx(function()
			{				
				var tool = ibx.resourceMgr.getResource('.text-editor-resources', true);
				$('body').append(tool);
				
				var rootFolderPath = decodeURIComponent("<%=rootFolderPath%>");
				var folderPath = decodeURIComponent("<%=folderPath%>");			
				var itemName = decodeURIComponent("<%=itemName%>");
				var mode = decodeURIComponent("<%=mode%>");
				
				openDocument(rootFolderPath, folderPath, itemName, mode);
				
			}, ["<%=context%>/ibx/testing/mike_k/ace_editor_tabs/resources/wf_ace_editor_bundle.xml"], true);
				

			function openDocument(rp, fp, fn, m)
			{
				$('.text-editor').ibxWidget("openEditorTab", rp, fp, fn, m);
			};
			
			function _onBeforeUnload()
			{
				if(window.opener)
				{
					window.opener.editorWindow = null;
				}
			}
			//# sourceURL=ace_editor.jsp
		</script>
	</head>
	<body class="ibx-root" onbeforeunload="return _onBeforeUnload()"></body>
</html>

