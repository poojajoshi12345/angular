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
page import="org.owasp.esapi.*, 
			com.ibi.util..StringEscapeUtils,
			com.ibi.webapp.security.util.WFSecurityUtils"
%><%
	browser.setClearCache();
	String applicationContext = ESAPI.encoder().encodeForHTMLAttribute(request.getContextPath() );
	String IBI_HELP = StringEscapeUtils.escapeJavaScript(com.ibi.common.ApplicationValueNames.IBI_HELP_CONTEXT.getIBIInitParameter());
	String SecurityUserName = WFSecurityUtils.getUserId();
	String SecurityUserDescription = WFSecurityUtils.getUserDescription();
	String SecurityUserLabel = StringEscapeUtils.escapeXml(SecurityUserDescription.equals("") ? SecurityUserName : SecurityUserDescription);
	String context = request.getContextPath();
%><html>
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
				
			}, ["<%=context%>/ibx/testing/telu/test_res.xml"], true);
			//# sourceURL=test.jsp
			
		</script>
		<style type="text/css">
		</style>
	</head>
	<body class="ibx-root">

		<div data-ibx-type="ibxSearchComboBox" data-ibxp-search="true" data-ibxp-selection-controls="true" data-ibxp-multi-select="true">
			<div data-ibx-type="ibxSelectItem">One</div>
			<div data-ibx-type="ibxSelectItem">Two</div>
			<div data-ibx-type="ibxSelectItem">Three</div>
			<div data-ibx-type="ibxSelectItem">Four</div>
			<div data-ibx-type="ibxSelectItem">Five</div>
		</div>
		<div data-ibx-type="ibxSearchComboBoxSimple" data-ibxp-search="true" data-ibxp-selection-controls="true" data-ibxp-multi-select="true">
				<div data-ibx-type="ibxSelectItem">One</div>
				<div data-ibx-type="ibxSelectItem">Two</div>
				<div data-ibx-type="ibxSelectItem">Three</div>
				<div data-ibx-type="ibxSelectItem">Four</div>
				<div data-ibx-type="ibxSelectItem">Five</div>
			</div>
			<div data-ibx-type="ibxSearchListBox" data-ibxp-search="true" data-ibxp-selection-controls="true" data-ibxp-multi-select="true">
					<div data-ibx-type="ibxSelectItem">One</div>
					<div data-ibx-type="ibxSelectItem">Two</div>
					<div data-ibx-type="ibxSelectItem">Three</div>
					<div data-ibx-type="ibxSelectItem">Four</div>
					<div data-ibx-type="ibxSelectItem">Five</div>
				</div>
				<div data-ibx-type="ibxSearchListBoxSimple" data-ibxp-search="true" data-ibxp-selection-controls="true" data-ibxp-multi-select="true">
						<div data-ibx-type="ibxSelectItem">One</div>
						<div data-ibx-type="ibxSelectItem">Two</div>
						<div data-ibx-type="ibxSelectItem">Three</div>
						<div data-ibx-type="ibxSelectItem">Four</div>
						<div data-ibx-type="ibxSelectItem">Five</div>
					</div>
		<div data-ibx-type="ibxSearchList" data-ibxp-search="true" data-ibxp-selection-controls="true" data-ibxp-multi-select="true">
				<div data-ibx-type="ibxSelectItem">One</div>
				<div data-ibx-type="ibxSelectItem">Two</div>
				<div data-ibx-type="ibxSelectItem">Three</div>
				<div data-ibx-type="ibxSelectItem">Four</div>
				<div data-ibx-type="ibxSelectItem">Five</div>
			</div>
				</body>
</html>

