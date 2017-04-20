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
				$(".select-field").on("ibx_change", function(e)
				{
					var select = $(e.target);
					select.css("width", "0px");

					var txt = select.find("input");
					var width = txt.prop("scrollWidth");
					select.css("width", "0px").css("width", width + "px");
				});

			}, applicationContext + "/ibx/", true);
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
			}

			.bucket-content
			{
			}

			.add-bucket
			{
				color:#ccc;
				margin:0 3px 0px 3px;
			}

			.field-bucket
			{
				color:#888;
			}

			.sort-field
			{
				color:#aaa;
				margin:3px;
			}
			.sort-field:hover
			{
				color:black;
			}

			.aggregate-field
			{
			}
			
			.clear-field
			{
				color:transparent;
				font-size:1.25em;
				font-weight:bold;
			}
			.clear-field:hover
			{
				color:red;
			}

			.select-field
			{
				padding:0px;
				font-size:1.5em;
				border:none;
				width:150px;
				xmax-width:10em;
			}

		</style>
	</head>
	<body class="ibx-root">
		<div class="query-box" data-ibx-type="ibxHBox" data-ibxp-align="stretch">
			<div class="bucket-container" data-ibx-type="ibxVBox">
				<div class="bucket-label" data-ibx-type="ibxLabel" data-ibxp-text="Measures"></div>
				<div class="bucket-content" data-ibx-type="ibxHBox" data-ibxp-align="center">
					<div class="buckets" data-ibx-type="ibxHBox">
						<div class="field-bucket" data-ibx-type="ibxGrid" data-ibxp-inline="true" data-ibxp-cols="auto 1fr auto" data-ibxp-rows="auto auto">
							<div class="sort-field" data-ibx-type="ibxLabel" data-ibx-col="1" data-ibx-row="1/span 2" data-ibxp-glyph="swap_vert" data-ibxp-glyph-classes="material-icons md-24"></div>
							<div class="aggregate-field" data-ibx-type="ibxLabel" data-ibx-col="2" data-ibx-row="1" data-ibxp-text="Sum of"></div>
							<div class="clear-field" data-ibx-type="ibxLabel" data-ibx-col="3" data-ibx-row="1" data-ibxp-glyph="clear" data-ibxp-glyph-classes="material-icons"></div>
							<div class="select-field" data-ibx-type="ibxListBox" data-ibx-col="2/span 2" data-ibx-row="2" data-ibxp-btn-show="false" data-ibxp-placeholder="Select Field...">
								<div data-ibx-type="ibxSelectItem" data-ibxp-text="COUNTRY"></div>
								<div data-ibx-type="ibxSelectItem" data-ibxp-text="CAR"></div>
								<div data-ibx-type="ibxSelectItem" data-ibxp-text="MODEL"></div>
								<div data-ibx-type="ibxSelectItem" data-ibxp-text="asdasdfasdf"></div>
								<div data-ibx-type="ibxSelectItem" data-ibxp-text="MODsdfaasdfsadfasdfasdfEL"></div>
								<div data-ibx-type="ibxSelectItem" data-ibxp-text="MasdODEL"></div>
								<div data-ibx-type="ibxSelectItem" data-ibxp-text="MOasdfasd asdf asdf asdf asdf as fDEL"></div>
							</div>
						</div>
					</div>
					<div class="add-bucket" data-ibx-type="ibxLabel" data-ibxp-glyph="add_box" data-ibxp-glyph-classes="material-icons md-48"></div>
				</div>
			</div>
		</div>

	</body>
</html>

<!--
		<div class="field-bucket" data-ibx-type="ibxGrid" data-ibxp-inline="true" data-ibxp-cols="auto 1fr auto" data-ibxp-rows="auto auto">
			<div class="sort-field" data-ibx-type="ibxLabel" data-ibx-col="1" data-ibx-row="1/span 2" data-ibxp-glyph="swap_vert" data-ibxp-glyph-classes="material-icons md-24"></div>
			<div class="aggregate-field" data-ibx-type="ibxLabel" data-ibx-col="2" data-ibx-row="1" data-ibxp-text="Sum of"></div>
			<div class="clear-field" data-ibx-type="ibxLabel" data-ibx-col="3" data-ibx-row="1" data-ibxp-glyph="clear" data-ibxp-glyph-classes="material-icons"></div>
			<div class="select-field" data-ibx-type="ibxListBox" data-ibx-col="2/span 2" data-ibx-row="2" data-ibxp-placeholder="Select Field...">
				<div data-ibx-type="ibxSelectItem" data-ibxp-text="COUNTRY"></div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-text="CAR"></div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-text="asdasdfasdf"></div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-text="MODsdfaasdfsadfasdfasdfEL"></div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-text="MasdODEL"></div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-text="MOasdfasd asdf asdf asdf asdf as fDEL"></div>
			</div>
		</div>



		 <div data-ibx-type="ibxComboBox" data-ibxp-inline="true" data-ibxp-placeholder="ibxComboBox"> 
               <div data-ibx-type="ibxSelectItem" data-ibxp-text="Item1"></div> 
               <div data-ibx-type="ibxSelectItem" data-ibxp-text="Item2"></div> 
               <div data-ibx-type="ibxSelectItem" data-ibxp-text="Item3"></div> 
               <div data-ibx-type="ibxSelectItem" data-ibxp-text="Item4"></div> 
          </div> 
          <div data-ibx-type="ibxComboBoxSimple" data-ibxp-inline="true" data-ibxp-placeholder="ibxComboBoxSimple"> 
               <div data-ibx-type="ibxSelectItem" data-ibxp-text="Item1"></div> 
               <div data-ibx-type="ibxSelectItem" data-ibxp-text="Item2"></div> 
               <div data-ibx-type="ibxSelectItem" data-ibxp-text="Item3"></div> 
               <div data-ibx-type="ibxSelectItem" data-ibxp-text="Item4"></div> 
          </div> 
          <div data-ibx-type="ibxListBox" data-ibxp-inline="true" data-ibxp-placeholder="ibxListBox"> 
               <div data-ibx-type="ibxSelectItem" data-ibxp-text="Item1"></div> 
               <div data-ibx-type="ibxSelectItem" data-ibxp-text="Item2"></div> 
               <div data-ibx-type="ibxSelectItem" data-ibxp-text="Item3"></div> 
               <div data-ibx-type="ibxSelectItem" data-ibxp-text="Item4"></div> 
          </div> 
          <div data-ibx-type="ibxListBoxSimple" data-ibxp-inline="true" data-ibxp-placeholder="ibxListBoxSimple"> 
               <div data-ibx-type="ibxSelectItem" data-ibxp-text="Item1"></div> 
               <div data-ibx-type="ibxSelectItem" data-ibxp-text="Item2"></div> 
               <div data-ibx-type="ibxSelectItem" data-ibxp-text="Item3"></div> 
               <div data-ibx-type="ibxSelectItem" data-ibxp-text="Item4"></div> 
          </div> 
          <div data-ibx-type="ibxList" data-ibxp-inline="true"> 
               <div data-ibx-type="ibxSelectItem" data-ibxp-text="Item1"></div> 
               <div data-ibx-type="ibxSelectItem" data-ibxp-text="Item2"></div> 
               <div data-ibx-type="ibxSelectItem" data-ibxp-text="Item3"></div> 
               <div data-ibx-type="ibxSelectItem" data-ibxp-text="Item4"></div> 
          </div> 
-->