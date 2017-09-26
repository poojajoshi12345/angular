<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision$:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>ibx test</title>
		<meta http-equiv="X-UA-Compatible" content="IE=11" >
		<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="Expires" content="0" />
		<meta name="google" value="notranslate">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<!--include this script...will boot ibx into the running state-->
		<Script src="<%=request.getContextPath()%>/ibx/resources/ibx.js" type="text/javascript"></script>
		<script type="text/javascript">
			<jsp:include page="/WEB-INF/jsp/global/wf_globals.jsp" flush="false" />
			ibx(function()
			{
				ibx.accessible(true);
			}, null, true);
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
			.test-frame
			{
				flex:1 1 auto;
				align-self:stretch;
				
			}
			h1{display:none;}
		</style>
	</head>
	<body class="ibx-root">
		<h1>Stupid fake heading</h1>
		<div data-ibx-type="ibxRadioGroup" data-ibxp-name="rgTest"></div>
		<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
			
			<div class="menu-bar-test" tabindex="0" data-ibx-type="ibxHMenuBar">
				<div role="menubutton" tabindex="0" class="menu-btn-file" data-ibx-type="ibxHMenuButton">Menu 1
					<div role="menu" class="menu-file" data-ibx-type="ibxMenu">
						<div role="menuitem" data-ibx-type="ibxMenuItem">Item1</div>
						<div role="menuitem" data-ibx-type="ibxMenuItem">Item2</div>
						<div role="menuitem" data-ibx-type="ibxMenuItem">Item3</div>
					</div>
				</div>
			</div>

			<div class="test-a" data-ibx-type="ibxButton" tabIndex="0">a</div>
			<div class="test-b" data-ibx-type="ibxButton" tabIndex="0">b</div>
			<div data-ibx-type="ibxCheckBox" tabIndex="0">Two</div>
			<div data-ibx-type="ibxRadioButton" data-ibxp-group="rgTest" tabIndex="0">Three.1</div>
			<div data-ibx-type="ibxRadioButton" data-ibxp-group="rgTest" tabIndex="0">Three.2</div>
			<div data-ibx-type="ibxRadioButton" data-ibxp-group="rgTest" tabIndex="0">Three.3</div>
		</div>
	</body>
</html>





