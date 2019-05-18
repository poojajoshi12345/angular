<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. --%>
<%-- $Revision: 1.1 $ --%>
<%
response.addHeader("Pragma", "no-cache");
response.addHeader("Cache-Control", "no-cache");
String applicationContext = request.getContextPath();
%>
<%@ page language="java" %>
<%@ page pageEncoding="UTF-8"%>
<%@ page import="ibi.gen.IBIThisGen" %>
<jsp:useBean id="bindowsBundle" class="com.ibi.resourceutil.BindowsResourceBundleBean" scope="request">
    <jsp:setProperty name="bindowsBundle" property="request" value="<%= request %>"/>
</jsp:useBean>
<%
//Variables used by SLP to determine state
String WFRel = IBIThisGen.getRelease_Number_static();
String contextPath = request.getContextPath();
//Product name strings
String txtInformationBuilders = "Information Builders";
String txtMobileFavorites = "Mobile Favorites";
//UX Strings
String txtLogon = "Login";
String txtLogoff = "Logoff";
String txtMenuClose = "Close the content menu";
String txtMenuOpen = "Open the content menu";
String txtNoContentFound = "No content was found for this folder. Either the folder does not exist, or you need to check to see if you have access to the content in this folder.";
String txtPassword = "Password";
String txtRefresh = "Refresh the content";
String txtUsername = "Username";
//Wrap HEAD components in try/catch to allow earlier WF versions
try {
com.ibi.resourceutil.IbiResourceBundle res =  bindowsBundle.getResourceBundle(application,request,"com.ibi.intl.slp.slp");
txtInformationBuilders = res.getStringHtml("slp_InformationBuilders");
txtMobileFavorites = res.getStringHtml("slp_MobileFavorites");
txtLogon = res.getStringHtml("slp_Logon");
txtLogoff = res.getStringHtml("slp_Logoff");
txtMenuClose = res.getStringHtml("slp_MenuClose");
txtMenuOpen = res.getStringHtml("slp_MenuOpen");
txtNoContentFound = res.getStringHtml("slp_NoContentFound");
txtPassword = res.getStringHtml("slp_Password");
txtRefresh = res.getStringHtml("slp_Refresh");
txtUsername = res.getStringHtml("slp_Username");
} catch(Exception e){}
%>

<!DOCTYPE html>
<html style="overflow: hidden">
<meta name="viewport"
      content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width"/>
<meta name="apple-mobile-web-app-capable" content="yes"/>
<meta name="mobile-web-app-capable" content="yes"/>
<meta name="apple-mobile-web-app-status-bar-style" content="black"/>
<meta charset="UTF-8">

<title>MV</title>
<!--<script src="../bower_components/jquery/dist/jquery.min.js" type="text/javascript"></script>-->
<!--IBX Library-->
<!--<script src="<%=applicationContext%>/ibx/resources/js/util.ibx.js" type="text/javascript"></script>-->
<!--<script src="<%=applicationContext%>/ibxtools/shared_resources/js/ibfs.js" type="text/javascript"></script>-->
<!--WEBFOCUS GLOBALS-->
<script src="<%=applicationContext%>/ibx/resources/ibx.js" type="text/javascript"></script>
<script type="text/javascript">
    <jsp:include page="/WEB-INF/jsp/global/wf_globals.jsp" flush="false"></jsp:include>
    var packages = ['../testing/allen/mv/src/resource_bundle.xml']
    ibx(init, packages, true);
    function init()
    {
       Ibfs.load("<%=applicationContext%>", WFGlobals.ses_auth_parm, WFGlobals.ses_auth_val).done(function (ibfs) {
          /* LOAD CONTENT AND BUILD THE SIDEBAR */
          var content = new WFContent(applicationContext, "8.2.01");
          content.loadContent().then(function (data) {
             var $sidebarWidget = $('.sidebar').ibxSlpSidebar({tabs: data.tabs, pageContent: data});
          });
       });

    }
</script>

</head>
<body class="ibx-root">

<div class="main-box " data-ibx-type="ibxHBox" data-ibxp-align="start">

    <div class="sidebar" data-ibxp-align="start"></div>

    <!--MAIN CONTENT-->
    <div class="main-content" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
        <div class="top-bar" data-ibx-type="ibxHBox" data-ibxp-align="start">
            <div class="title-box" data-ibx-type="ibxVBox">
                <div class="title-text" data-ibx-type="ibxLabel"
                     data-ibxp-align="center"></div>
            </div>
        </div>
        <div class="render-content" data-ibx-type="ibxVBox" data-ibxp-align="start">
            <!--iframe goes here-->
            <iframe class="content-frame" src="" frameborder="0"></iframe>
        </div>
    </div>
</div>

<script>

</script>
</body>
</html>
