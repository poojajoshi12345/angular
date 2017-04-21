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
				$(".add-bucket").on("click", function(e)
				{
					var fieldBucket = $("<div>").mzFieldBucket();
					$(".field-buckets").append(fieldBucket);
				});

				$.widget("ibi.mzFieldBucket", $.ibi.ibxGrid, 
				{
					options:
					{
						nameRoot:true,
						inline:true,
						cols:"auto 1fr auto",
						rows:"auto auto"
					},
					_widgetClass:"mz-field-bucket",
					_create:function()
					{
						this._super();
						var markup = $(".field-bucket-res").children().clone(true);
						this.element.append(markup);
						this.element.find("[data-ibx-no-bind]").removeAttr("data-ibx-no-bind");
						ibx.bindElements(this.element);
						this._deleteBucket.on("click", this.deleteBucket.bind(this));
					},
					_destroy:function()
					{
						this._super();
					},
					deleteBucket:function(e)
					{
						this.element.remove();
					},
					refresh:function()
					{
						this._super();
					}
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
			.add-bucket:hover
			{
				color:#888;
			}

			.field-bucket, .field-bucket input
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
				color:#555;
			}

			.aggregate-field
			{
				padding:0px;
				border:none;
			}
			
			.clear-field
			{
				color:transparent;
				font-size:1.5em;
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
				xwidth:auto;
			}

			.select
			{
				xwidth:auto;
			}
			.select > input
			{
				flex:0 0 auto;
				border:1px solid black;
			}

		</style>
	</head>
	<body class="ibx-root">
		<div class="query-box" data-ibx-type="ibxHBox" data-ibxp-align="stretch">
			<div class="bucket-container" data-ibx-no-bind="true" data-ibx-type="ibxVBox">
				<div class="bucket-label" data-ibx-type="ibxLabel" data-ibxp-text="Measures"></div>
				<div class="bucket-content" data-ibx-type="ibxHBox" data-ibxp-align="center">
					<div class="field-buckets" data-ibx-type="ibxHBox">
					</div>
					<div class="add-bucket" data-ibx-type="ibxLabel" data-ibxp-glyph="add_box" data-ibxp-glyph-classes="material-icons md-48"></div>
				</div>
			</div>
		</div>

		<div data-ibx-no-bind="true" class="field-bucket-res" style="display:none">
			<div data-ibx-no-bind="true" class="sort-field" data-ibx-name="_howSort" data-ibx-type="ibxLabel" data-ibx-col="1" data-ibx-row="1/span 2" data-ibxp-glyph="swap_vert" data-ibxp-glyph-classes="material-icons md-24"></div>
			<div data-ibx-no-bind="true" class="aggregate-field" data-ibx-name="_howAggregate" data-ibx-type="ibxListBox" data-ibx-col="2" data-ibx-row="1" data-ibxp-btn-show="false">
				<div data-ibx-no-bind="true" data-ibx-type="ibxSelectItem" data-ibxp-text="Summary" data-ibxp-selected="true"></div>
				<div data-ibx-no-bind="true" data-ibx-type="ibxSelectItem" data-ibxp-text="Average"></div>
				<div data-ibx-no-bind="true" data-ibx-type="ibxSelectItem" data-ibxp-text="Maximum"></div>
				<div data-ibx-no-bind="true" data-ibx-type="ibxSelectItem" data-ibxp-text="Minimum"></div>
			</div>
			<div data-ibx-no-bind="true" class="clear-field" data-ibx-name="_deleteBucket" data-ibx-type="ibxLabel" data-ibx-col="3" data-ibx-row="1" data-ibxp-glyph="highlight_off" data-ibxp-glyph-classes="material-icons"></div>
			<div data-ibx-no-bind="true" class="select-field" data-ibx-name="_fieldSelectord" data-ibx-type="ibxListBox" data-ibx-col="2/span 2" data-ibx-row="2" data-ibxp-btn-show="false" data-ibxp-placeholder="Select Field...">
				<div data-ibx-no-bind="true" data-ibx-type="ibxSelectItem" data-ibxp-text="COUNTRY"></div>
				<div data-ibx-no-bind="true" data-ibx-type="ibxSelectItem" data-ibxp-text="CAR"></div>
				<div data-ibx-no-bind="true" data-ibx-type="ibxSelectItem" data-ibxp-text="MODEL"></div>
				<div data-ibx-no-bind="true" data-ibx-type="ibxSelectItem" data-ibxp-text="asdasdfasdf"></div>
				<div data-ibx-no-bind="true" data-ibx-type="ibxSelectItem" data-ibxp-text="MODsdfaasdfsadfasdfasdfEL"></div>
				<div data-ibx-no-bind="true" data-ibx-type="ibxSelectItem" data-ibxp-text="MasdODEL"></div>
				<div data-ibx-no-bind="true" data-ibx-type="ibxSelectItem" data-ibxp-text="MOasdfasd asdf asdf asdf asdf as fDEL"></div>
			</div>
		</div>
	</body>
</html>

