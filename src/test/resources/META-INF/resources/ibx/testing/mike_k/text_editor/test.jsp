<%-- Copyright 1996-2017 Information Builders, Inc. All rights reserved. 
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
page import="org.owasp.esapi.*" 
%><%@ page import="org.apache.commons.lang.StringEscapeUtils"
%><%@ page import="com.ibi.webapp.security.util.WFSecurityUtils"
%><%
	browser.setClearCache();
	String applicationContext = ESAPI.encoder().encodeForHTMLAttribute(request.getContextPath() );
	String IBI_HELP = StringEscapeUtils.escapeJavaScript(com.ibi.common.ApplicationValueNames.IBI_HELP_CONTEXT.getIBIInitParameter());
	String SecurityUserName = WFSecurityUtils.getUserId();
	String SecurityUserDescription = WFSecurityUtils.getUserDescription();
	String SecurityUserLabel = StringEscapeUtils.escapeXml(SecurityUserDescription.equals("") ? SecurityUserName : SecurityUserDescription);
	com.ibi.resourceutil.IbiResourceBundle res =  com.ibi.resourceutil.BindowsResourceBundleBean.GetResourceBundle(application,request,"com.ibi.intl.bip_editor.bip_editor");
	String context = request.getContextPath();
%>
<html>
	<head>
		<title>ibx text editor sample</title>
		<meta http-equiv="X-UA-Compatible" content="IE=EDGE" >
		<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="Expires" content="0" />
		<meta name="google" value="notranslate">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<!--include this script...will boot ibx into the running state-->
		<Script src="<%=context%>/ibx/resources/ibx.js" type="text/javascript"></script>
		<script type="text/javascript">
			<jsp:include page="/WEB-INF/jsp/global/wf_globals.jsp" flush="false" />
			<jsp:include page="/WEB-INF/jsp/ibx/ibxInit.jsp" flush="false" />

			ibx(function()
			{				
				$(".btn-show-text-editor").on("click", function()
				{
					var editorDlg = ibx.resourceMgr.getResource('.text-editor-resources', true);						
					editorDlg.ibxWidget("setEditorPath", "IBFS:/WFC/Repository", "IBFS:/WFC/Repository/Public", "");					
					editorDlg.ibxWidget("open");
				});
				
			}, ["<%=context%>/ibx/testing/mike_k/text_editor/resources/texteditor_bundle.xml"], true);
			//# sourceURL=test.jsp
			
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
			.te-blurb
			{
				width:350px;
				margin:20px;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-justify="center" data-ibxp-align="center">
			<div class="btn-show-text-editor" data-ibx-type="ibxButton" ><%=res.getStringXml("bid_menu_edit")%></div>
			<div class="te-blurb">
				The basic front end of this example is exactly copied from the current WebFOCUS text editor.
			</div>
		<div>
		<!-- div data-ibx-type="textEditor" data-ibxp-destroy-on-close="false"></div-->
	</body>
</html>

