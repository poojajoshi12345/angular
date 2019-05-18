<%-- Copyright 1996-2018 Information Builders, Inc. All rights reserved. 
 $Revision: 1.3 $:
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

		<!--include this script...will boot ibx into the running state-->
		<Script src="<%=context%>/ibx/resources/ibx.js" type="text/javascript"></script>
		<script type="text/javascript">
			<jsp:include page="/WEB-INF/jsp/global/wf_globals.jsp" flush="false" />
			<jsp:include page="/WEB-INF/jsp/ibx/ibxInit.jsp" flush="false" />

			var editorWindow = null;
			
			function _onBeforeUnload()
			{
				if(editorWindow)
				{
					editorWindow.close();
					editorWindow = null;
				}
			}
			
			ibx(function()
			{				
				$(".btn-show-text-editor0").on("click", function()
				{
					if(editorWindow)
					{
						editorWindow.openDocument("IBFS:/WFC/Repository", "IBFS:/WFC/Repository/HOME-958");
						editorWindow.focus();
					}
					else
					{
						//var uriExec = sformat("{1}/ibx/testing/mike_k/ace_editor_tabs/wf_ace_editor.jsp?rootFolderPath={2}&folderPath={3}",			
						var uriExec = sformat("{1}/TED?rootFolderPath={2}&folderPath={3}",
							applicationContext,	encodeURIComponent(encodeURIComponent("IBFS:/WFC/Repository")), encodeURIComponent(encodeURIComponent("IBFS:/WFC/Repository/HOME-958")));	
						editorWindow = window.open(uriExec, "_blank", "location=no,status=no,toolbar=no,titlebar=no,width=1200,height=800");
					}
				});
				
				$(".btn-show-text-editor1").on("click", function()
				{
					if(editorWindow)
					{
						editorWindow.openDocument("IBFS:/WFC/Repository", "IBFS:/WFC/Repository/HOME-958", "1.js");
						editorWindow.focus();
					}
					else
					{
						//var uriExec = sformat("{1}/ibx/testing/mike_k/ace_editor_tabs/wf_ace_editor.jsp?rootFolderPath={2}&folderPath={3}&itemName={4}",
						var uriExec = sformat("{1}/TED?rootFolderPath={2}&folderPath={3}&itemName={4}",								
							applicationContext,	encodeURIComponent(encodeURIComponent("IBFS:/WFC/Repository")), encodeURIComponent(encodeURIComponent("IBFS:/WFC/Repository/HOME-958")), encodeURIComponent(encodeURIComponent("1.js")));	
						editorWindow = window.open(uriExec, "_blank", "location=no,status=no,toolbar=no,titlebar=no,width=1200,height=800");
					}
				});
				
				$(".btn-show-text-editor2").on("click", function()
				{					
					if(editorWindow)
					{
						editorWindow.openDocument("IBFS:/WFC/Repository", "IBFS:/WFC/Repository/HOME-958", "ace_editor_style.css");
						editorWindow.focus();						
					}
					else
					{
						//var uriExec = sformat("{1}/ibx/testing/mike_k/ace_editor_tabs/wf_ace_editor.jsp?rootFolderPath={2}&folderPath={3}&itemName={4}",
						var uriExec = sformat("{1}/TED?rootFolderPath={2}&folderPath={3}&itemName={4}",								
							applicationContext,	encodeURIComponent(encodeURIComponent("IBFS:/WFC/Repository")), encodeURIComponent(encodeURIComponent("IBFS:/WFC/Repository/HOME-958")), encodeURIComponent(encodeURIComponent("ace_editor_style.css")));	
						editorWindow = window.open(uriExec, "_blank", "location=no,status=no,toolbar=no,titlebar=no,width=1200,height=800");
					}
				});
				
				$(".btn-show-text-editor3").on("click", function()
				{					
					if(editorWindow)
					{
						editorWindow.openDocument("IBFS:/WFC/Repository", "IBFS:/WFC/Repository/HOME-958", "ace_python_test.py");
						editorWindow.focus();						
					}
					else
					{
						//var uriExec = sformat("{1}/ibx/testing/mike_k/ace_editor_tabs/wf_ace_editor.jsp?rootFolderPath={2}&folderPath={3}&itemName={4}",
						var uriExec = sformat("{1}/TED?rootFolderPath={2}&folderPath={3}&itemName={4}",								
							applicationContext,	encodeURIComponent(encodeURIComponent("IBFS:/WFC/Repository")), encodeURIComponent(encodeURIComponent("IBFS:/WFC/Repository/HOME-958")), encodeURIComponent(encodeURIComponent("ace_python_test.py")));	
						editorWindow = window.open(uriExec, "_blank", "location=no,status=no,toolbar=no,titlebar=no,width=1200,height=800");
					}
				});
				
				$(".btn-show-text-editor4").on("click", function()
				{					
					if(editorWindow)
					{
						editorWindow.openDocument("IBFS:/WFC/Repository", "IBFS:/WFC/Repository/HOME-958", "ace_r_test.r");
						editorWindow.focus();						
					}
					else
					{
						//var uriExec = sformat("{1}/ibx/testing/mike_k/ace_editor_tabs/wf_ace_editor.jsp?rootFolderPath={2}&folderPath={3}&itemName={4}",
						var uriExec = sformat("{1}/TED?rootFolderPath={2}&folderPath={3}&itemName={4}",								
							applicationContext,	encodeURIComponent(encodeURIComponent("IBFS:/WFC/Repository")), encodeURIComponent(encodeURIComponent("IBFS:/WFC/Repository/HOME-958")), encodeURIComponent(encodeURIComponent("ace_r_test.r")));	
						editorWindow = window.open(uriExec, "_blank", "location=no,status=no,toolbar=no,titlebar=no,width=1200,height=800");
					}
				});	
				
				$(".btn-show-text-editor5").on("click", function()
				{					
					if(editorWindow)
					{
						editorWindow.openDocument("IBFS:/WFC/Repository", "IBFS:/WFC/Repository/HOME-958", "ace_sql_test.sql");
						editorWindow.focus();						
					}
					else
					{
						//var uriExec = sformat("{1}/ibx/testing/mike_k/ace_editor_tabs/wf_ace_editor.jsp?rootFolderPath={2}&folderPath={3}&itemName={4}",
						var uriExec = sformat("{1}/TED?rootFolderPath={2}&folderPath={3}&itemName={4}",								
							applicationContext,	encodeURIComponent(encodeURIComponent("IBFS:/WFC/Repository")), encodeURIComponent(encodeURIComponent("IBFS:/WFC/Repository/HOME-958")), encodeURIComponent(encodeURIComponent("ace_sql_test.sql")));	
						editorWindow = window.open(uriExec, "_blank", "location=no,status=no,toolbar=no,titlebar=no,width=1200,height=800");
					}
				});			
				
				$(".btn-show-text-editor6").on("click", function()
				{					
					if(editorWindow)
					{
						editorWindow.openDocument("IBFS:/WFC/Repository", "IBFS:/WFC/Repository/HOME-958", "ace_fex_test.fex");
						editorWindow.focus();						
					}
					else
					{
						//var uriExec = sformat("{1}/ibx/testing/mike_k/ace_editor_tabs/wf_ace_editor.jsp?rootFolderPath={2}&folderPath={3}&itemName={4}",
						var uriExec = sformat("{1}/TED?rootFolderPath={2}&folderPath={3}&itemName={4}",								
							applicationContext,	encodeURIComponent(encodeURIComponent("IBFS:/WFC/Repository")), encodeURIComponent(encodeURIComponent("IBFS:/WFC/Repository/HOME-958")), encodeURIComponent(encodeURIComponent("ace_fex_test.fex")));	
						editorWindow = window.open(uriExec, "_blank", "location=no,status=no,toolbar=no,titlebar=no,width=1200,height=800");
					}
				});	
				
				$(".btn-show-text-editor7").on("click", function()
				{					
					if(editorWindow)
					{
						editorWindow.openDocument("IBFS:/WFC/Repository", "IBFS:/WFC/Repository/HOME-958", "ace1.htm");
						editorWindow.focus();						
					}
					else
					{
						//var uriExec = sformat("{1}/ibx/testing/mike_k/ace_editor_tabs/wf_ace_editor.jsp?rootFolderPath={2}&folderPath={3}&itemName={4}",
						var uriExec = sformat("{1}/TED?rootFolderPath={2}&folderPath={3}&itemName={4}",								
							applicationContext,	encodeURIComponent(encodeURIComponent("IBFS:/WFC/Repository")), encodeURIComponent(encodeURIComponent("IBFS:/WFC/Repository/HOME-958")), encodeURIComponent(encodeURIComponent("ace1.htm")));	
						editorWindow = window.open(uriExec, "_blank", "location=no,status=no,toolbar=no,titlebar=no,width=1200,height=800");
					}
				});			
				
				$(".btn-show-text-editor8").on("click", function()
				{					
					if(editorWindow)
					{
						editorWindow.openDocument("IBFS:/WFC/Repository", "IBFS:/WFC/Repository/HOME-958", "ace_masterfile_test.mas");
						editorWindow.focus();						
					}
					else
					{
						//var uriExec = sformat("{1}/ibx/testing/mike_k/ace_editor_tabs/wf_ace_editor.jsp?rootFolderPath={2}&folderPath={3}&itemName={4}",
						var uriExec = sformat("{1}/TED?rootFolderPath={2}&folderPath={3}&itemName={4}",								
							applicationContext,	encodeURIComponent(encodeURIComponent("IBFS:/WFC/Repository")), encodeURIComponent(encodeURIComponent("IBFS:/WFC/Repository/HOME-958")), encodeURIComponent(encodeURIComponent("ace_masterfile_test.mas")));	
						editorWindow = window.open(uriExec, "_blank", "location=no,status=no,toolbar=no,titlebar=no,width=1200,height=800");
					}
				});		
				
				$(".btn-show-text-editor9").on("click", function()
				{					
					if(editorWindow)
					{
						editorWindow.openDocument("IBFS:/WFC/Repository", "IBFS:/WFC/Repository/HOME-958", "text_1.txt");
						editorWindow.focus();						
					}
					else
					{
						//var uriExec = sformat("{1}/ibx/testing/mike_k/ace_editor_tabs/wf_ace_editor.jsp?rootFolderPath={2}&folderPath={3}&itemName={4}",
						var uriExec = sformat("{1}/TED?rootFolderPath={2}&folderPath={3}&itemName={4}",								
							applicationContext,	encodeURIComponent(encodeURIComponent("IBFS:/WFC/Repository")), encodeURIComponent(encodeURIComponent("IBFS:/WFC/Repository/HOME-958")), encodeURIComponent(encodeURIComponent("text_1.txt")));	
						editorWindow = window.open(uriExec, "_blank", "location=no,status=no,toolbar=no,titlebar=no,width=1200,height=800");
					}
				});					
				
				
			}, ["<%=context%>/ibx/testing/mike_k/ace_editor_tabs/resources/wf_ace_editor_bundle.xml"], true);
			//# sourceURL=test.jsp
			
		</script>
		<style type="text/css">
			body, html
			{
				background-color:white;
			}
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
	<body class="ibx-root" onbeforeunload="return _onBeforeUnload()">		
		<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-justify="center" data-ibxp-align="center">
			<div class="btn-show-text-editor0" data-ibx-type="ibxButton" >New File (*.*)</div>
			<br>
			<div class="btn-show-text-editor1" data-ibx-type="ibxButton" >Open JS File (1.js)</div>
			<br>
			<div class="btn-show-text-editor2" data-ibx-type="ibxButton" >Open CSS File (ace_editor_style.css)</div>
			<br>
			<div class="btn-show-text-editor3" data-ibx-type="ibxButton" >Open Python File (ace_python_test.py)</div>
			<br>
			<div class="btn-show-text-editor4" data-ibx-type="ibxButton" >Open R File (ace_r_test.r)</div>
			<br>
			<div class="btn-show-text-editor5" data-ibx-type="ibxButton" >Open SQL File (ace_sql_test.sql)</div>
			<br>
			<div class="btn-show-text-editor6" data-ibx-type="ibxButton" >Open FEX File (ace_fex_test.fex)</div>	
			<br>
			<div class="btn-show-text-editor7" data-ibx-type="ibxButton" >Open HTML File (ace1.htm)</div>				
			<br>
			<div class="btn-show-text-editor8" data-ibx-type="ibxButton" >Open MAS File (ace_masterfile_test.mas)</div>		
			<br>
			<div class="btn-show-text-editor9" data-ibx-type="ibxButton" >Open Text File (text_1.txt)</div>	
			<div class="te-blurb">
				Test page to launch multitab Editor based on ACE IDE.
			</div>
		<div>
	</body>
</html>

