<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. --%>
<%-- $Revision$ --%>
<%-- Copyright 1996-2017 Information Builders, Inc. All rights reserved. --%>
<%-- $Revision$--%>
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