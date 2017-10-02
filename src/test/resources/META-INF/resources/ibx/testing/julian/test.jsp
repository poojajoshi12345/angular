<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision$:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>IBX test</title>
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
			<div role="menu" aria-label="Test Menu" tabIndex="0">
				<div role="menuitem" tabIndex="0">Menu Item 1</div>
				<div role="menuitem" tabIndex="0">Menu Item 2</div>
				<div role="menuitem" tabIndex="0">Menu Item 3</div>
				<div role="menuitem" tabIndex="0">Menu Item 4</div>
			</div>
		</div>
	</body>
</html>





