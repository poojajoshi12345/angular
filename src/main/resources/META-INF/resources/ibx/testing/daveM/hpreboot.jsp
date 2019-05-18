<%-- Copyright 1996-2019 Information Builders, Inc. All rights reserved. --%>
<%-- $Revision: 1.1 $--%><%@ page language="java" contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:useBean id="resourceBean" class="com.ibi.web.res.ResourceBundleBean" scope="request"><jsp:setProperty name="resourceBean" property="request" value="<%= request %>" /></jsp:useBean>
<jsp:useBean id="browser" class="com.ibi.web.bean.WFDetectBrowserBean" scope="request"><jsp:setProperty name="browser" property="request" value="<%= request %>" /><jsp:setProperty name="browser" property="response" value="<%= response %>" /></jsp:useBean>
<jsp:useBean id="WEBFOCUS_SECURITY_SETTING" class="com.ibi.webapp.security.config.WFSecuritySetting" scope="request"></jsp:useBean>
<jsp:useBean id="permissions" class="com.ibi.bip.beans.BIP_PermissionBean" scope="request" />
<%@ page import="com.ibi.util.StringEscapeUtils"
%><%@ page import="com.ibi.resourceutil.IbiResourceBundle"
%><%
	String applicationContext = request.getContextPath();
	IbiResourceBundle res = resourceBean.getResourceBundle( "com.ibi.intl.hpreboot.hpreboot");
	String GenDateTime=ibi.gen.IBIThisGenUtil.getGenDateLocalized(browser.getWfLanguage().getLocale());	
	String ibiHelpContext = StringEscapeUtils.escapeJavaScript(com.ibi.common.ApplicationValueNames.IBI_HELP_CONTEXT.getIBIInitParameter());
	ibiHelpContext += "/advanced/redirect.jsp?topic=/com.ibi.help/help.htm#wfhelp_welcome";
%>
<!DOCTYPE html>
<html lang="${browser.getLanguageTag()}">
	<head>
		<title><%=res.getStringJs("hpreboot_home_page_title")%></title>
		<meta http-equiv="X-UA-Compatible" content="IE=EDGE" >
		<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="Expires" content="0" />
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="icon" type="image/x-icon" href="<%=request.getContextPath()%>/favicon.ico" />

		<!--include this css to load the css loader 1st-->
		<link type="text/css" rel="stylesheet" href="<%= resourceBean.mapSafeUrl("/ibxtools/shared_resources/css/theme/default/waiting.css") %>">


		<script src="<%= resourceBean.mapSafeUrl("/ibx/resources/ibx.js")%>" type="text/javascript"></script>

		<script type="text/javascript">

			<jsp:include page="/WEB-INF/jsp/global/wf_globals.jsp" flush="false" />
			<jsp:include page="/WEB-INF/jsp/ibx/ibxInit.jsp" flush="false" />

			var packages=
			[
				{src: "{context}/ibxtools/hpreboot/resources/homepage_res_bundle.xml"},
			];

			ibx(init, packages, true);

			function init()
			{
				ibx.waitStart();	    			

				Ibfs.load(applicationContext, WFGlobals.ses_auth_parm, WFGlobals.ses_auth_val).done(function(ibfs)
				{
					hprbUtil.ibfs = ibfs;

					var environment = {
						SesAuthParm: WFGlobals.getSesAuthParm(),
						SesAuthParmVal: WFGlobals.getSesAuthVal(),
						rootPath: "IBFS:/WFC/Repository",
						currentPath: "IBFS:/WFC/Repository",
						homepageMode: 0, // content = 0, portals = 1, favorites = 2, mobilefavorites = 3
						currentItem: null,
						outputdiv: null,
						isMobile: false,
						isPhone: false,
						isTiny: false,
						autoOpen: null,
						rootItem: null,
						mobileVoice: "false",
						isMobileFaves: "<%=browser.isMobileFaves()%>",
						userName: "admin",
					};
					hprbUtil.environment = environment;
					hprbUtil.environment.outputdiv = new outputArea();	
					
					var initSetting = {
					    "user":"Administrator",
					    "menus":
					    {
					    	"tools": 
							[
								{"name": "deferred", "show": ${permissions.deferredStatus}, "title":"<%=res.getStringJs("hpreboot_deferred_status")%>"},
								{"name": "stop", "show": ${permissions.stopRequests}, "title":"<%=res.getStringJs("hpreboot_stop_requests")%>"},
								{"name": "session", "show": ${permissions.devTraces}, "title":"<%=res.getStringJs("hpreboot_session_viewer")%>"},
								{"name": "Separator", "show": true, "title":""},
								{"name": "explorer", "show": ${permissions.RCExplorer}, "title":"<%=res.getStringJs("hpreboot_reportcaster_explorer")%>"},
								{"name": "status", "show": ${permissions.casterconsole}, "title":"<%=res.getStringJs("hpreboot_reportcaster_status")%>"},
								{"name": "Separator", "show": true, "title":""},
								{"name": "magnify", "show": ${permissions.magnify}, "title":"<%=res.getStringJs("hpreboot_magnify_search_page")%>"},
								{"name": "infographicks", "show": ${permissions.easelly}, "title":"<%=res.getStringJs("hpreboot_webfocus_infographicks")%>"},
							], 		
					    	"settings": 
							[
								{"name": "security", "show": ${permissions.useradmin}, "title":"<%=res.getStringJs("hpreboot_security_center")%>"},
								{"name": "console", "show": ${permissions.wfconsole}, "title":"<%=res.getStringJs("hpreboot_administration_console")%>"},
								{"name": "magnifyConsole", "show": ${permissions.magnifyConsole}, "title":"<%=res.getStringJs("hpreboot_magnify_console")%>"},
								{"name": "managePrivateTool", "show": ${permissions.managePrivateTool}, "title":"<%=res.getStringJs("hpreboot_manage_private_resources")%>"},
								{"name": "Separator", "show": true, "title":""},
								{"name": "normal", "show": ${permissions.canManage}, "title":"<%=res.getStringJs("hpreboot_normal_view")%>"},
								{"name": "manager", "show": ${permissions.canManage}, "title":"<%=res.getStringJs("hpreboot_administration_view")%>"},
							], 		
					    	"help": 
							[
								{"name": "online", "show": true, "title":"<%=res.getStringJs("hpreboot_online_help")%>"},
								{"name": "technical", "show": true, "title":"<%=res.getStringJs("hpreboot_technical_resources")%>"},
								{"name": "community", "show": true, "title":"<%=res.getStringJs("hpreboot_community")%>"},
								{"name": "Separator", "show": true, "title":""},
								{"name": "about", "show": ${permissions.aboutHelp}, "title":"<%=res.getStringJs("hpreboot_about")%>"},
								{"name": "license", "show": ${permissions.aboutHelp}, "title":"<%=res.getStringJs("hpreboot_license")%>"},
								{"name": "Separator", "show": true, "title":""},
								{"name": "information", "show": true, "title":"<%=res.getStringJs("hpreboot_ibi_home")%>"},						
							], 				
					    	"admin": 
							[
								{"name": "preferences", "show": true, "title":"<%=res.getStringJs("hpreboot_preferences")%>","glyphClasses": "fa fa-sliders"},
								{"name": "password", "show": ${browser.isCanChangePassword()}, "title":"<%=res.getStringJs("hpreboot_change_password")%>","glyphClasses": "fa fa-key"},
								{"name": "signout", "show": true, "title":"<%=res.getStringJs("hpreboot_sign_out")%>","glyphClasses": "fa fa-sign-out"},
								{"name": "legacy", "show": true, "title":"<%=res.getStringJs("hpreboot_legacy_homepage")%>","glyphClasses": "fa fa-home"},
							], 
					    	"aboutWebFocus":
					    	{				    	
					    		"help_about": "<%=res.getStringJs("hpreboot_helpabout")%>",			    
						    	"edition": "<%=com.ibi.ibt.WFLicense.getWFEdition().getLongName()%>",
								"prduct_release": "<%=ibi.gen.IBIThisGen.getProduct_Release_static()%>",
								"service_pack": "<%=ibi.gen.IBIThisGen.getService_Pack_static()%>",
								"package_id": "<%=ibi.gen.IBIThisGen.getPackageName()%>",
								"release_id": "<%=ibi.gen.IBIThisGen.getReleaseId()%>",
								"build_number": "<%=ibi.gen.IBIThisGen.getSeqNumber_static()%>",
								"build_date": "<%=StringEscapeUtils.escapeJavaScript(GenDateTime)%>",
								"application_server": "<%=application.getServerInfo()%>",
					    	},
					    	"userName":"Administrator",
					    	"userID":"admin",
					    	"passwordTitle": "<%=res.getStringJs("hpreboot_change_password")%>",			    	
					    	"ibihelpURL": "<%=res.getStringJs("hpreboot_technicalResources_help")%>",
					    	"ibiHelpContext": "<%=ibiHelpContext%>",
					    	"currentMode": "${permissions.currentMode}",			
						    "isAnonymousUser": "false",
						    "logoutFilterProcessesUrl": "${WEBFOCUS_SECURITY_SETTING.getLogoutFilterProcessesUrl()}",
					    },				    				    
					    "currentLanguage": "en_US",
					    "language":
					    [
					        {
								"name2": "en",
								"name5": "en_US",
								"description": "English",
					        },
					        {
								"name2": "de",
								"name5": "de_US",
								"description": "Deutsch",
					        },
					        {
								"name2": "fr",
								"name5": "fr_FR",
								"description": "Fran\u00E7ais - France",
					        },
					        {
								"name2": "br",
								"name5": "pt_BR",
								"description": "Portugu\u00EAs - Brasil"
					        }
					    ],
					    "preferences":
					    {
					    	"mode"			: "home",
					    	"lastFolder"	: "IBFS:/WFC/Repository/Retail_Samples/Charts",  
					    	"listCols"		: [0,2,3,4,5,6],  
					    	"viewMode"		: "tile",
					    	'treeMode'		: "closed",
					    },
						"homeData": 
						{
							"learns": 
							[
								{"description": "Revenue Region Bar", "fullPath": "/WFC/Repository/Retail_Samples/Portal/Small_Widgets/Revenue_Region_Bar.fex", "thumbPath": "./wfirs/ibfs/WFC/Repository/Retail_Samples/Portal/Small_Widgets/Revenue_Region_Bar.fex?IBFS_action=getAssocImage&IBFS_epoc=1508186453297", "lastModified": "123412341234", "clientInfo": {"properties": {"Category": "Sales"}}, "glyphClasses": "ibx-icons ibx-glyph-fex-chart"},
							],
						},
					};

					var tool = ibx.resourceMgr.getResource('.hpreboot-tool');
					$('body').append(tool);
						
					tool.ibxWidget('option', 'initSetting', initSetting);				
					tool.ibxWidget("loadHomePageReboot");  
				});
			}
			//# sourceURL=hpreboot.jsp
		</script>
		<style type="text/css">
			body{margin:0px;overflow: hidden;}
		</style>
	</head>
	<body class="ibx-root" data-ibx-type="ibxVBox">
	</body>
</html>
