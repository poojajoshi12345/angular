<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision$:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>ibx text editor sample</title>
		<meta http-equiv="X-UA-Compatible" content="IE=EDGE" >
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
				$(".btn-show-text-editor").on("click", function()
				{
					$(".test-text-editor").ibxWidget("open");
				});
			}, [{"src":"./texteditor_bundle.xml", "loadContext":"app"}], true);
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
			<div class="btn-show-text-editor" data-ibx-type="ibxButton" data-ibxp-text="Show the Text Editor..."></div>
			<div class="te-blurb">
				This is not an example of an ibxTextEditor, but it is an example of how you can use ibx to easily create one.
				<p>
				The basic front end of this example is exactly copied from the current WebFOCUS text editor.  I would probably
				not use that as a template for a future general purpose text editor.
			</div>
		<div>
		<div class="test-text-editor" data-ibx-type="textEditor" data-ibxp-destroy-on-close="false"></div>
	</body>
</html>

