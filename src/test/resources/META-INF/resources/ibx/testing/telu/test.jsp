<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision$:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>ibx samples</title>
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
				$('.select').on('ibx_change', function(e){
					var select = e.target;
					console.log($(e.target).ibxWidget('userValue'));
				});
				$('.list').on('ibx_change', function(e){
					var select = e.target;
					console.log($(e.target).ibxWidget('userValue'));
				});

			}, true);
		</script>

		<style type="text/css">
		</style>
	</head>
	<body class="ibx-root">

		<div data-ibx-type="ibxHBox">

			<div class="select" data-ibx-type="ibxSelect" data-ibxp-multi-select="true">
				<div data-ibx-type="ibxSelectCheckItem" data-ibxp-text="AA" data-ibxp-user-value="aa"></div>
				<div data-ibx-type="ibxSelectCheckItem" data-ibxp-text="BB" data-ibxp-user-value="bb"></div>
				<div data-ibx-type="ibxSelectCheckItem" data-ibxp-text="BB1" data-ibxp-user-value="bb1"></div>
				<div data-ibx-type="ibxSelectCheckItem" data-ibxp-text="BC" data-ibxp-user-value="bc"></div>
				<div data-ibx-type="ibxSelectCheckItem" data-ibxp-text="BC" data-ibxp-user-value="bc"></div>
				<div data-ibx-type="ibxSelectCheckItem" data-ibxp-text="BC1" data-ibxp-user-value="bc1"></div>
				<div data-ibx-type="ibxSelectRadioItem" data-ibxp-text="R1" data-ibxp-user-value="r1"></div>
				<div data-ibx-type="ibxSelectRadioItem" data-ibxp-text="R2" data-ibxp-user-value="r2"></div>
				<div data-ibx-type="ibxSelectRadioItem" data-ibxp-text="R3" data-ibxp-user-value="r3"></div>
			</div>
			<div class="select" data-ibx-type="ibxSelect" data-ibxp-multi-select="false">
				<div data-ibx-type="ibxSelectItem" data-ibxp-text="XX" data-ibxp-user-value="xx"></div>
				<div data-ibx-type="ibxSelectCheckItem" data-ibxp-text="AA" data-ibxp-user-value="aa"></div>
				<div data-ibx-type="ibxSelectCheckItem" data-ibxp-text="BB" data-ibxp-user-value="bb"></div>
				<div data-ibx-type="ibxSelectCheckItem" data-ibxp-text="BB1" data-ibxp-user-value="bb1"></div>
				<div data-ibx-type="ibxSelectCheckItem" data-ibxp-text="BC" data-ibxp-user-value="bc"></div>
				<div data-ibx-type="ibxSelectCheckItem" data-ibxp-text="BC" data-ibxp-user-value="bc"></div>
				<div data-ibx-type="ibxSelectCheckItem" data-ibxp-text="BC1" data-ibxp-user-value="bc1"></div>
			</div>

			<div class="list" data-ibx-type="ibxSelect" data-ibxp-multi-select="true" data-ibxp-readonly="true">
				<div data-ibx-type="ibxSelectCheckItem" data-ibxp-text="AA" data-ibxp-user-value="aa"></div>
				<div data-ibx-type="ibxSelectCheckItem" data-ibxp-text="BB" data-ibxp-user-value="bb"></div>
				<div data-ibx-type="ibxSelectCheckItem" data-ibxp-text="BB1" data-ibxp-user-value="bb1"></div>
				<div data-ibx-type="ibxSelectCheckItem" data-ibxp-text="BC" data-ibxp-user-value="bc"></div>
				<div data-ibx-type="ibxSelectCheckItem" data-ibxp-text="BC" data-ibxp-user-value="bc"></div>
				<div data-ibx-type="ibxSelectCheckItem" data-ibxp-text="BC1" data-ibxp-user-value="bc1"></div>
			</div>

		</div>

	</body>
</html>

