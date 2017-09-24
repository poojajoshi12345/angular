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
				var listBox = $(".list-box");
				var itemBox = $(".item-box");
				for(var i = 0; i < 50; ++i)
				{
					var listItem = $("<div class='list-item' tabindex='0'>");
					listItem.text("List Item " + i);
					listBox.ibxWidget("add", listItem);

					var testItem = $("<div class='test-item' tabindex='0'>");
					testItem.text("Test Item " + i);
					itemBox.ibxWidget("add", testItem);

				}

				window.onpopstate = function(e)
				{
					debugger;
				};

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
			h1{display:none;}
		</style>
	</head>
	<body class="ibx-root">
		<h1>Stupid fake heading</h1>
		<div data-ibx-type="ibxRadioGroup" data-ibxp-name="rgTest"></div>
		<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
			<div data-ibx-type="ibxLabel" tabIndex="0">Test Button Label</div>
			<div data-ibx-type="ibxButton" tabIndex="0">Test Button</div>
			<div data-ibx-type="ibxLabel" tabIndex="0">Check Button Label</div>
			<div data-ibx-type="ibxCheckBox" tabIndex="0">CheckBox Button</div>
			<div data-ibx-type="ibxLabel" tabIndex="0">Test Radio Button Label</div>
			<div data-ibx-type="ibxRadioButton" data-ibxp-group="rgTest" tabIndex="0">Radio Button1</div>
			<div data-ibx-type="ibxRadioButton" data-ibxp-group="rgTest" tabIndex="0">Radio Button2</div>
			<div data-ibx-type="ibxRadioButton" data-ibxp-group="rgTest" tabIndex="0">Radio Button3</div>
		</div>
	</body>
</html>





