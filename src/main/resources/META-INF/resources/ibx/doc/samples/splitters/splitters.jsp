<%-- Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved. 
 $Revision: 1.1 $:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>ibx splitter sample</title>
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
			}, true);
			//# sourceURL=splitter_ibx_sample
		</script>

		<style type="text/css">
			body
			{
				user-select:none;
			}

			.v-splitter
			{
				width:4px;
			}
			.h-splitter
			{
				height:4px;
			}

			.box-main
			{
				position:absolute;
				left:0px;
				top:0px;
				right:0px;
				bottom:0px;
			}
			.box-child
			{
				border-radius:3px;
				white-space:nowrap;
				overflow:auto;
			}

			.top-box, .bottom-box
			{
				flex:0 1 auto;
				min-height:100px;
			}
			.middle-box
			{
				flex:1 1 auto;
			}

			.top-left, .middle-left, .bottom-left
			{
				flex:0 1 auto;
				min-width:100px;
			}
			.top-middle, .middle-middle, .bottom-middle
			{
				flex:1 1 auto;
				min-width:100px;
			}
			.top-right, .middle-right, .bottom-right
			{
				flex:0 1 auto;
				min-width:100px;
			}

			.center-top, .center-bottom
			{
				flex:0 1 auto;
				min-height:50px;
			}
			.center-middle
			{
				flex:1 1 auto;
			}
			.center-left, .center-right
			{
				flex:0 1 auto;
				min-width:100px;
			}
			.center-center
			{
				flex:1 1 auto;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="box-main" data-ibx-type="ibxVBox" data-ibxp-align="stretch" data-ibxp-inline="false">
			<div class="top-box box-child" data-ibx-type="ibxHBox" data-ibxp-align="stretch">
				<div class="top-left box-child">Top Left</div>
				<div class="v-splitter" data-ibx-type="ibxVSplitter"></div>
				<div class="top-middle box-child">Top Middle</div>
				<div class="v-splitter" data-ibx-type="ibxVSplitter"></div>
				<div class="top-right box-child">Top Right</div>
			</div>
			<div class="h-splitter" data-ibx-type="ibxHSplitter"></div>
			<div class="middle-box box-child" data-ibx-type="ibxHBox" data-ibxp-align="stretch">
				<div class="middle-left box-child">Middle Left</div>
				<div class="v-splitter" data-ibx-type="ibxVSplitter"></div>
				
				<div class="middle-middle box-child" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
					<div class="center-top box-child">Center Top</div>
					<div class="h-splitter" data-ibx-type="ibxHSplitter"></div>
					<div class="center-middle box-child" data-ibx-type="ibxHBox" data-ibxp-align="stretch">
						<div class="center-left box-child">Center Left</div>
						<div class="v-splitter" data-ibx-type="ibxVSplitter"></div>
						<div class="center-center box-child">Center Middle</div>
						<div class="v-splitter" data-ibx-type="ibxVSplitter"></div>
						<div class="center-right box-child">Center Right</div>
					</div>
					<div class="h-splitter" data-ibx-type="ibxHSplitter"></div>
					<div class="center-bottom box-child">Center Bottom</div>
				</div>
				
				<div class="v-splitter" data-ibx-type="ibxVSplitter"></div>
				<div class="middle-right box-child">Middle Right</div>
			</div>
			<div class="h-splitter" data-ibx-type="ibxHSplitter"></div>
			<div class="bottom-box box-child" data-ibx-type="ibxHBox" data-ibxp-align="stretch">
				<div class="bottom-left box-child">Bottom Left</div>
				<div class="v-splitter" data-ibx-type="ibxVSplitter"></div>
				<div class="bottom-middle box-child">Bottom Middle</div>
				<div class="v-splitter" data-ibx-type="ibxVSplitter"></div>
				<div class="bottom-right box-child">Bottom Right</div>
			</div>

		</div>
	</body>
</html>

