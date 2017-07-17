<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved.
--%><%-- $Revision$
--%><%@ page pageEncoding="UTF-8"
%><%@ page import="org.apache.commons.lang.StringEscapeUtils"
%><%@ page import="com.ibi.ibt.WFLicense"
%><%@ page import="com.ibi.ibfs.languages.IBFSLanguageObject"
%><%@ page import="com.ibi.web.bean.WFDetectBrowserBean"
%><%@ taglib uri="localizedstring" prefix="localizedstring"
%><%@ taglib prefix="spring" uri="http://www.springframework.org/tags"
%><jsp:useBean id="browser" class="com.ibi.web.bean.WFDetectBrowserBean" scope="request"
></jsp:useBean><%=browser.getDocType()%>
<jsp:useBean id="WEBFOCUS_SECURITY_SETTING" class="com.ibi.webapp.security.config.WFSecuritySetting" scope="request"></jsp:useBean>
<jsp:useBean id="wfLanguage" class="com.ibi.common.WfLanguageBean" scope="request">
 <jsp:setProperty name="wfLanguage" property="inLang" value="<%= StringEscapeUtils.escapeJavaScript(browser.getSelLanguage())%>"/>
</jsp:useBean>
<jsp:useBean id="wflicense" class="com.ibi.common.WfLicenseRedirectBean" scope="request"></jsp:useBean>
<jsp:useBean id="bindowsBundle" class="com.ibi.resourceutil.BindowsResourceBundleBean" scope="request">
 <jsp:setProperty name="bindowsBundle" property="request" value="<%= request %>"/>
</jsp:useBean>
<%
final boolean isValidWebQueryLicense = wflicense.isValidWebQueryLicense();
final boolean	isValidBUELicense = wflicense.isValidBUELicense();
final boolean	isValidWebFocusLicense = wflicense.isValidWebFocusLicense();
if(isValidWebQueryLicense)
{ %>
 <jsp:forward page="<%= (String)request.getAttribute(\"altLoginPage\") %>" />  
<% }
if(!WEBFOCUS_SECURITY_SETTING.isFormAuthEnabled())
	response.sendError(HttpServletResponse.SC_FORBIDDEN);
String context_path = request.getContextPath();
com.ibi.resourceutil.IbiResourceBundle res =  com.ibi.resourceutil.BindowsResourceBundleBean.GetResourceBundle(application,request,"com.ibi.intl.logon.logon_Resources");


String onInformationCenter = (isValidBUELicense) ? "https://webfocusinfocenter.informationbuilders.com/wfbue/" : "https://webfocusinfocenter.informationbuilders.com/wfappent/";
String logonCSS = (isValidBUELicense) ? "/logon/resources/buelogon.css" : "/logon/resources/wfelogon.css";

java.util.ArrayList<IBFSLanguageObject> langlist = wfLanguage.getLanglist();
String langOverflow = "scroll";
int langHeight = 300;
int items=langlist.size();
int langHeightSize=items*22;
if (langHeightSize < langHeight)
{
	langHeight = langHeightSize;
	langOverflow = "hidden";
}
%>

<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="<%=browser.getIeEmulate()%>" >
	<meta http-equiv="MsThemeCompatible" content="yes">
	<meta http-equiv="ImageToolBar" content="no">
	 
     <link href="<%=bindowsBundle.mapSafeUrl(logonCSS)%>" rel="stylesheet" type="text/css"/>
	     <link href="<%=bindowsBundle.mapSafeUrl("/logon/resources/menuJQ.css")%>" rel="stylesheet" type="text/css"/>

     <script type='text/javascript' src='<%=bindowsBundle.mapSafeUrl("/logon/resources/logon.js")%>'></script>
     <script type='text/javascript' src='<%=bindowsBundle.mapSafeUrl("/logon/resources/logon_util.js")%>'></script>
	<script type="text/javascript" src="<%=request.getContextPath()%>/jquery/js/jquery.min.js"></script>

<Script type="text/javascript">

	if (top !== self)
	{
		top.location = self.location
	}
	var showaccessibility = "<%= StringEscapeUtils.escapeJavaScript(browser.getAccessibility())%>";
	var ibiOptions = new Array("logon");
	var isDynamicLanguagesEnabled = <%=wfLanguage.isDynamicLanguagesEnabled()%>;
 	var ContextPath = "<%=context_path%>";
 	var loginProcessUrl = "<%=WEBFOCUS_SECURITY_SETTING.getLoginFilterProcessesUrl()%>";
	var logoutProcessUrl = "<%=WEBFOCUS_SECURITY_SETTING.getLogoutFilterProcessesUrl()%>";	
	var currentLanguage = "<%= StringEscapeUtils.escapeJavaScript(browser.getSelLanguage())%>";	 
	var helpWidthSize = "<%=res.getStringJs("logon_help_menu_width")%>";
	var isValidBUELicense = "<%=isValidBUELicense%>";
	var isNewLogonPage = true;
</Script>

  
	
	<title><%=res.getStringHtml("logon_page_signin")%></title>
	<meta name="description" content="">
	<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body onkeydown="javascript:onBodyKeyPress(event);" onclick="javascript:onBodyclick();" onresize="javascript:onBodyclick();">
	 <!-- Navigation -->
<nav class="menu" id="a11y-menu" role="navigation" aria-label="Main menu">

  <ul class="nav level-1 list-reset" role="menubar" aria-hidden="false">
    <li class="has-subnav" role="menuitem" aria-haspopup="true">
      <a href="#about">About</a>
      <ul class="level-2 list-reset" data-test="true" aria-hidden="true" role="menu">
        <li role="menuitem"><a href="#news" tabindex="-1">News</a></li>
        <li role="menuitem"><a href="#governance" tabindex="-1">Governance</a></li>
        <li role="menuitem"><a href="#diversity" tabindex="-1">Diversity</a></li>
        <li role="menuitem"><a href="#contact" tabindex="-1">ContactUs</a></li>
      </ul>
    </li>

    <li role="menuitem" aria-haspopup="true">
      <a href="#academics">Academics</a>
      <ul class="level-2 list-reset" data-test="true" aria-hidden="true" role="menu" class="list-reset">
        <li role="menuitem"><a href="#programs" tabindex="-1">Degree Programs</a></li>
        <li role="menuitem"><a href="#faculty" tabindex="-1">Faculty</a></li>
        <li role="menuitem"><a href="#distance" tabindex="-1">Distance Learning</a></li>
        <li role="menuitem"><a href="#libs" tabindex="-1">Libraries</a></li>
      </ul>
    </li>

    <li role="menuitem" aria-haspopup="true">
      <a href="#admissions">Admissions</a>
      <ul class="level-2 list-reset" data-test="true" aria-hidden="true" role="menu" class="list-reset">
        <li role="menuitem"><a href="#undergraduate" tabindex="-1">Undergraduate</a></li>
        <li role="menuitem"><a href="#tuition" tabindex="-1">Tuition</a></li>
        <li role="menuitem"><a href="#financial-aid" tabindex="-1">Financial Aid</a></li>
      </ul>
    </li>

    <li role="menuitem" aria-haspopup="true">
      <a href="#visitors">Visitors</a>
      <ul class="level-2 list-reset" data-test="true" aria-hidden="true" role="menu" class="list-reset">
        <li role="menuitem"><a href="#events" tabindex="-1">Events</a></li>
        <li role="menuitem"><a href="#campus-map" tabindex="-1">Campus Map</a></li>
        <li role="menuitem"><a href="#parking" tabindex="-1">Parking</a></li>
      </ul>
    </li>
  </ul>	
</nav>
	<script type='text/javascript' src='<%=bindowsBundle.mapSafeUrl("/logon/resources/menuJQ.js")%>'></script>
	<div class="center-div">	
		<div class="parent">
			<div class="rightarrowdiv">		
				<div class="welcomeToWebfocus-div"><div class="welcomeToWebfocus"><%=res.getStringHtml("logon_welcome_to_webfocus")%></div></div>
				<div class="productEdition-div"><div class="productEdition"><%=res.getStringHtml("logon_product_edition")%></div></div>
				<div class="discoveryAnalysisReporting-div"><div class="discoveryAnalysisReporting"><%=res.getStringHtml("logon_discovery_analysis")%></div></div>				
				<div class="AllInOne-div"><div class="AllInOne"><%=res.getStringHtml("logon_all_in_one")%></div></div>				
				<div class="rightarrowbuttonExploreWebfocus" onkeyup="keyHandler(event,'ExploreWebfocus','')" onclick="javascript:onExploreWebfocus();"><div class="rightarrowExploreWebfocusImage"></div></div>					
				<div tabIndex="8" class="rightarrowbuttonExploreWebfocuslabel" onkeyup="keyHandler(event,'ExploreWebfocus','')" onclick="javascript:onExploreWebfocus();"><div class="rightarrowExploreWebfocuslabel" alt="<%=res.getStringHtml("logon_explore_the_webfocus")%>" ><%=res.getStringHtml("logon_explore_the_webfocus")%></div></div>
				<div class="rightarrowbuttonInformationCenter" onkeyup="keyHandler(event,'InformationCenter','<%=onInformationCenter%>')" onclick="javascript:onInformationCenter('<%=onInformationCenter%>');"> <div class="rightarrowInformationCentertImage"></div></div>
				<div tabIndex="9" class="rightarrowbuttonInformationCenterLabel" onkeyup="keyHandler(event,'InformationCenter','<%=onInformationCenter%>')" onclick="javascript:onInformationCenter('<%=onInformationCenter%>');"><div class="rightarrowInformationCentertlabel" alt="<%=res.getStringHtml("logon_visit_information_center")%>"><%=res.getStringHtml("logon_visit_information_center")%></div></div> 				
			</div>
		    <div class="login-wrap">	    	
				<form class="login-form">			
					<div class="logon-menu-div">
<% if (wfLanguage.isDynamicLanguagesEnabled()) { %>
						<div class="language-div"><label tabIndex="6" id='LanguageID' class="language-drop-down" alt="<%=res.getStringHtml("logon_choose_language")%>"  onClick="setTimeout('javascript:showLangDropDown()',50);"><%=res.getStringHtml("logon_choose_language")%></label></div>
<%}%>
<% if (browser.isIe()) { %>
						<div class="Accessibility-div">
	<% if (!browser.is508User()) { %>
							<label id='EnableAccessibilityID' tabIndex="7" class="Accessibility" alt="<%=res.getStringHtml("logon_click_f9_to_enable_accessibility")%>" onkeyup="keyHandler(event,'Accessibility',true)" onClick="setTimeout('javascript:onAccessibility(true)',50);"><%=res.getStringHtml("logon_enable_accessibility")%></label>
		<% } else {%>
							<label id='EnableAccessibilityID' tabIndex="7" class="Accessibility" alt="<%=res.getStringHtml("logon_click_f9_to_disable_accessibility")%>" onkeyup="keyHandler(event,'Accessibility',false)" onClick="setTimeout('javascript:onAccessibility(false)',50);"><%=res.getStringHtml("logon_disable_accessibility")%></label>
	
	<% } %>
						</div>
<% } %>
					</div>
					<div class="login-title-component"><div class="login-title"><%=res.getStringHtml("logon_page_signin")%></div></div>
					<div class="login-userNameError-div" id="signInServerErrorID" style="visibility: hidden"><div tabIndex="10" class="Login-invalid-signon" name="_SignInError"></div></div>												
					<div class="login-userName-div" id="signInUserNameID"><label for="SignonUserName" class="login-userName" alt="<%=res.getStringHtml("logon_user_name")%>"><%=res.getStringHtml("logon_user_name")%></label></div>	
					<div><div class="user-id" alt="<%=res.getStringHtml("logon_username")%>"><input name="SignonUserName" id='SignonUserName' tabIndex="1" type="text" autofocus autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" onkeypress="javascript:onLogonKeyPress(event);" id="SignonUserName"/></div></div>						 					
					<div class="login-password-div"><label for="SignonPassName"  class="login-password" alt="<%=res.getStringHtml("logon_password")%>"><%=res.getStringHtml("logon_password")%></label></div>
					<div><div class="password" alt="<%=res.getStringHtml("logon_username_password")%>" ><input tabIndex="2" name="SignonPassName" id="SignonPassName" type="password" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" onkeypress="javascript:onLogonKeyPress(event);" id="SignonPassName"/></div></div>					
					<div class="button-div"><input tabIndex="3" type="button" class="button" id="SignonbtnLogin" onkeypress="javascript:onLogonKeyPress(event);" onClick="javascript:Signin();" alt="<%=res.getStringHtml("logon_sign_in")%>" value="<%=res.getStringHtml("logon_sign_in")%>"></div>
<% if (WEBFOCUS_SECURITY_SETTING.isRememberMeEnabled()) { %>
					<div class="checkbox-div"><label class='checkbox' alt="<%=res.getStringHtml("logon_remember_me")%>" ><input tabIndex="4" id="RememberMeID" type='checkbox'/>  <%=res.getStringHtml("logon_remember_me")%></label></div>
<% } %>
<% if (WEBFOCUS_SECURITY_SETTING.isPublicAccessEnabled()) { %>
					<div class="public-access-div"><label tabIndex="5" id='PublicAccessID' class="public-access" alt="<%=res.getStringHtml("logon_public_access")%>" onkeyup="keyHandler(event,'PublicAccess','')" onClick="setTimeout('javascript:onPublicAccess()',50);"><%=res.getStringHtml("logon_public_access")%></label></div>
<%}%>
				</form>
			</div>  
		</div>  
		<div style="visibility: hidden;">
			<label id="Invalid_EnableAccessibility"><%=res.getStringHtml("logon_welcome_to_webfocus")%></label>
			<label id="Invalid_EnableAccessibility1"><%=res.getStringHtml("logon_EnableAccessibility1")%></label>
			<label id="Invalid_EnableAccessibility2"><%=res.getStringHtml("logon_EnableAccessibility2")%></label>
			<label id="Invalid_EnableAccessibility3"><%=res.getStringHtml("logon_EnableAccessibility3")%></label>
			<label id="Invalid_EnableAccessibility4"><%=res.getStringHtml("logon_EnableAccessibility4")%></label>			
		</div>
	</div>
	
<%-- Change Password --%>
	<div tabIndex="0" id="dlgChangePassword" style="Z-INDEX: 1000010; visibility: hidden; cursor: default;" hideFocus="hidefocus">
		<iframe tabIndex="1" class="webfocus-iframe iframe" src="<%=context_path%>/logon/resources/markup/blank.html" frameBorder="0" style="BACKGROUND-COLOR: window; width: 264px; height: 264px; top: -2px; left: -2px;"></iframe>
		<div class="change-password-frame active window change-password-frame-active">			
			<div class="change-password-title change-password-caption"><label class="change-password-label-title" id="ChangePasswordLabelID"><%=res.getStringHtml("logon_webfocus_product_name")%></label></div>
				<div class="change-password-logon-frame">	
					<div class="change-password-error-component" id="ServerErrorID" style="visibility: hidden"><label class="Login-invalid-signon" name="_ChangePasswordError" value=""></label></div>	
					<div class="change-password-error-component" id="MatchingPasswordID" style="visibility: hidden"><label class="Login-invalid-signon"><%=res.getStringHtml("logon_no_match")%></label></div>
										
					<div class="change-password-user-name-component"><label><%=res.getStringHtml("logon_user_name")%></label></div>
					<div class="change-password-component"><label tabIndex="29" alt="<%=res.getStringHtml("logon_change_password")%>" class="change-password-user-name-input" alt="<%=res.getStringHtml("logon_username")%>"><input id="ChangePassUserName" tabIndex="30" disabled="disabled" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" value=""/></label></div>
					
					<div class="change-password-old-password-component"><label class="change-password-old-password"><%=res.getStringHtml("logon_oldpass")%></label></div>
					<div class="change-password-component"><label class="change-password-old-password-input" alt="<%=res.getStringHtml("logon_old_password")%>"><input id="ChangePassOldPassword" tabIndex="31" type="password" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" /></label></div>

					<div class="change-password-new-password-component"><label class="change-password-new-password"><%=res.getStringHtml("logon_newpass")%></label></div>
					<div class="change-password-component"><label class="change-password-new-password-input" alt="<%=res.getStringHtml("logon_new_password")%>"><input id="ChangePassNewPassword" tabIndex="32" type="password" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" /></label></div>

					<div class="change-password-confirm-component"><label class="change-password-confirm-password"><%=res.getStringHtml("logon_confirm")%></label></div>
					<div class="change-password-component"><label class="change-password-Confirm-password-input" alt="<%=res.getStringHtml("logon_confirm_new_password")%>"><input id="ChangePassConfirmNewPassword" onkeyup="javascript:ChangePasswordKeyup(event);" tabIndex="33" class="webfocus-text-field text-field" type="password" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"/></label></div>
					
					<div class="change-password-button-div"><a tabIndex="34" class="change-password-button" id="ChangePassSigninBtn" onkeypress="javascript:onChangePasswordOKKeyPress(event);" onClick="javascript:onChangePasswordBtnclick();"><label alt="<%=res.getStringHtml("logon_change_password")%>"><%=res.getStringHtml("logon_change_password")%></label></a></div>
					<div class="change-password-button-cancel-div"><a tabIndex="35" class="change-password-cancel-button" id="CancelPassSigninBtn" onkeypress="javascript:onChangePasswordCancelKeyPress(event);" onClick="javascript:onChangePasswordCancelbtn();"><label alt="<%=res.getStringHtml("logon_cancel")%>"><%=res.getStringHtml("logon_cancel")%></label></a></div>							
				</div>
			</div>
		</div>

<%-- User Already signed in --%>
	<div tabIndex="0" id="dlgAlreadySignon" style="Z-INDEX: 1000010; visibility: hidden; cursor: default;" hideFocus="hidefocus">
		<iframe tabIndex="1" class="webfocus-iframe iframe" src="<%=context_path%>/logon/resources/markup/blank.html" frameBorder="0" style="BACKGROUND-COLOR: window; width: 264px; height: 264px; top: -2px; left: -2px;"></iframe>
		<div class="already-Signon-frame active window already-Signon-frame-active">			
			<div class="already-Signon-title already-Signon-caption"><label class="already-Signon-label-title"><%=res.getStringHtml("logon_webfocus_product_name")%></label></div>
				<div class="already-Signon-logon-frame">								

					<div class="already-Signon-logon-error-component"><label tabIndex="29" class="Login-invalid-signon" alt="<%=res.getStringHtml("logon_use_name_already_signed")%>"><%=res.getStringHtml("logon_use_name_already_signed")%></label></div>
					
					<div class="already-Signon-logon-user-name-component"><label><%=res.getStringHtml("logon_user_name")%></label></div>
					<div class="already-Signon-logon-component"><label class="change-password-user-name-input"><input id="AlreadySignonUserName" tabIndex="30" disabled="disabled" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" value=""/></label></div>

					<div class="already-Signon-logon-continue-component"><label><%=res.getStringHtml("logon_close_other_session")%></label></div>
					
					<div class="already-Signon-logon-button-div"><a tabIndex="34" class="already-Signon-logon-button" id="ContinueSigninBtn" onkeypress="javascript:onAlreadySignedOKbtn(event);" onClick="javascript:onAlreadySignedOKbtn();"><label alt="<%=res.getStringHtml("logon_continue")%>"><%=res.getStringHtml("logon_continue")%></label></a></div>
					<div class="already-Signon-logon-button-cancel-div"><a tabIndex="35" class="already-Signon-logon-cancel-button" onClick="javascript:onAlreadySignedCancelbtn();"><label alt="<%=res.getStringHtml("logon_cancel")%>"><%=res.getStringHtml("logon_cancel")%></label ></a></div>							
				</div>
			</div>
		</div>

		
<%-- create the language dropdown --%>	
	<label id='LanguagePopupID' style='Z-INDEX: 1000005; WIDTH: <%=res.getStringJs("logon_language_width")%>px; WHITE-SPACE: nowrap; HEIGHT: <%=langHeight%>px; inherit; TOP: 0px; LEFT: 0px' class='webfocus-menu'>
	  <div style='overflow-x:auto; overflow-y:<%=langOverflow%>; WIDTH: 178px; HEIGHT: <%=langHeight%>px; TOP: 0px; LEFT: 0px' class='change-password-component'>
		<table class="webfocus-menu-table" tabIndex="0" style="border-collapse:collapse"><tbody>
	<%
		for(int i = 0; i < items; i++) {
	%> 			
		<TR id="LangID-<%=i%>" class='webfocus-menu-item menu-item' name="<%=langlist.get(i).getName2()%>" tabIndex="0" onclick="javascript:onChangeLanguage('<%=langlist.get(i).getName2()%>');" onmouseover="javascript:langMouseover('LangID-<%=i%>');" onmouseout="javascript:langMouseout('LangID-<%=i%>');">
		<%
			if (browser.getSelLanguage().equals(langlist.get(i).getName2())){
		%>
			<TD class='icon-column radiobutton-checked nowrap'></TD>
		<%
			}
			else {
		%>
			<TD class='icon-column radiobutton nowrap' ></TD>
		<%
			}
		%>			
		<TD class="text nowrap" colSpan="2" ><%=langlist.get(i).getDescription()%></TD></TR>
	<%
		}
	%>
		</tbody></table>
	  </div>
	</label>
	<script type='text/javascript' src='<%=bindowsBundle.mapSafeUrl("/logon/resources/menuJQ.js")%>'></script>
</body>
</html>