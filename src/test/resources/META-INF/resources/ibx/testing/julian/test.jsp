<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision$:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html>
	<head>
		<title>ibx test</title>
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
			}, applicationContext + "/ibx/", true);
			//# sourceURL=test_telu_ibx_sample
		</script>

		<style type="text/css">
			.query-box
			{
				border:1px solid black;
			}

			.bucket-container
			{
				border:1px solid red;
			}

			.bucket-label
			{
				font-weight:bold;
				padding:3px;
				color:#fc6619;
			}

			.bucket-content
			{
			}

			.add-bucket
			{
				color:#ccc;
				align-self:flex-end;
				margin:0 3px 0 3px;
			}

		</style>
	</head>
	<body class="ibx-root">
		<div class="query-box" data-ibx-type="ibxHBox">
			<div class="bucket-container" data-ibx-type="ibxVBox">
				<div class="bucket-label" data-ibx-type="ibxLabel" data-ibxp-text="Measures"></div>
				<div class="bucket-content" data-ibx-type="ibxHBox">
					<div class="buckets" data-ibx-type="ibxHBox">
					</div>
					<div class="add-bucket" data-ibx-type="ibxButton" data-ibxp-glyph="add_box" data-ibxp-glyph-classes="material-icons md-48"></div>
				</div>
			</div>


			<!--

			.measure-grid
			{
				flex:0 1 auto;
				border:1px solid red;
			}

			.measure-box
			{
				border:1px solid blue;
			}

			.measure-field
			{
				width:150px;
				height:75px;
				border:1px solid green;
			}
			<div class="group-grid" data-ibx-type="ibxGrid" data-ibxp-cols="1fr" data-ibxp-rows="auto auto">
				<div class="group-label" data-ibx-type="ibxLabel" data-ibxp-text="Groups"></div>
				<div class="group-box" data-ibx-type="ibxHBox" data-ibxp-align="stretch">
					<div class="group-field">
					</div>
					<div class="new-query-field-marker" data-ibx-type="ibxLabel" data-ibxp-glyph="add_box" data-ibxp-glyph-classes="material-icons md-48"></div>
				</div>
			</div>
			<div class="color-grid" data-ibx-type="ibxGrid" data-ibxp-cols="1fr" data-ibxp-rows="auto auto">
				<div class="color-label" data-ibx-type="ibxLabel" data-ibxp-text="Color"></div>
				<div class="color-box" data-ibx-type="ibxHBox" data-ibxp-align="stretch">
					<div class="color-field">
					</div>
					<div class="new-query-field-marker" data-ibx-type="ibxLabel" data-ibxp-glyph="add_box" data-ibxp-glyph-classes="material-icons md-48"></div>
				</div>
			</div>
			-->
		</div>
	</body>
</html>
