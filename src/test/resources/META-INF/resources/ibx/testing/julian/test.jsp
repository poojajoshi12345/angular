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
				ibxResourceMgr.addBundle("./test_res_bundle.xml").done(function(e)
				{
					$(".add-measure-bucket").on("click", function(e)
					{
						var fieldBucket = $("<div>").mzFieldBucket();
						$(".measure-buckets").append(fieldBucket);
						fieldBucket.ibxWidget("refresh");
					});
					$(".add-group-bucket").on("click", function(e)
					{
						var fieldBucket = $("<div>").mzFieldBucket();
						$(".group-buckets").append(fieldBucket);
						fieldBucket.ibxWidget("refresh");
					});
					$(".add-color-bucket").on("click", function(e)
					{
						var fieldBucket = $("<div>").mzFieldBucket();
						$(".color-buckets").append(fieldBucket);
						fieldBucket.ibxWidget("refresh");
					});
				});
			}, applicationContext + "/ibx/", ".ibx-root");
		</script>

		<style type="text/css">
			.query-box
			{
				padding:3px;
				border:1px solid #ccc;
			}

			.bucket-container
			{
				border-right:1px solid #ccc;
			}

			.bucket-label
			{
				font-weight:bold;
				color:#fc6619;
				margin:0 3px 0 3px;
			}

			.bucket-content
			{
			}

			.add-bucket
			{
				color:#ccc;
				margin:0 3px 0px 3px;
			}
			.add-bucket:hover
			{
				color:#888;
			}

			.field-buckets > .mz-field-bucket
			{
				margin-right:1em;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="query-box" data-ibx-type="ibxHBox" data-ibxp-align="stretch">
			<div class="bucket-container" data-ibx-type="ibxVBox">
				<div class="bucket-label" data-ibx-type="ibxLabel" data-ibxp-text="Measures"></div>
				<div class="bucket-content" data-ibx-type="ibxHBox" data-ibxp-align="center">
					<div class="measure-buckets" data-ibx-type="ibxHBox">
					</div>
					<div class="add-measure-bucket add-bucket" data-ibx-type="ibxLabel" data-ibxp-glyph="add_box" data-ibxp-glyph-classes="material-icons md-48"></div>
				</div>
			</div>
			<div class="bucket-container" data-ibx-type="ibxVBox">
				<div class="bucket-label" data-ibx-type="ibxLabel" data-ibxp-text="Groups"></div>
				<div class="bucket-content" data-ibx-type="ibxHBox" data-ibxp-align="center">
					<div class="group-buckets" data-ibx-type="ibxHBox">
					</div>
					<div class="add-group-bucket add-bucket" data-ibx-type="ibxLabel" data-ibxp-glyph="add_box" data-ibxp-glyph-classes="material-icons md-48"></div>
				</div>
			</div>
			<div class="bucket-container" data-ibx-type="ibxVBox">
				<div class="bucket-label" data-ibx-type="ibxLabel" data-ibxp-text="Colors"></div>
				<div class="bucket-content" data-ibx-type="ibxHBox" data-ibxp-align="center">
					<div class="color-buckets" data-ibx-type="ibxHBox">
					</div>
					<div class="add-color-bucket add-bucket" data-ibx-type="ibxLabel" data-ibxp-glyph="add_box" data-ibxp-glyph-classes="material-icons md-48"></div>
				</div>
			<!--
			</div>
			-->
		</div>
	</body>
</html>

