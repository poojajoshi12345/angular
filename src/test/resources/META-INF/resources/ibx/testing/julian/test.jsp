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
						rows:"auto auto",
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
			}, applicationContext + "/ibx/", ".ibx-root");
		</script>
		<style type="text/css">
			.mz-field-bucket
			{
				color:#888;
			}
			.mz-fb-how-sort:hover
			{
				color:black;
			}
			.mz-fb-how-aggregate
			{
			}
			.mz-fb-delete-bucket
			{
				font-size:1.5em;
				color:transparent;
			}
			.mz-fb-delete-bucket:hover
			{
				color:red;
			}
			
			.mz-fb-select
			{
				padding:0px;
				border:none;
				width:150px;
			}
			.mz-fb-select-field
			{
				color:black;
				font-size:1.5em;
			}
		</style>

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
				margin-right:3px;
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
		</style>
	</head>
	<body class="ibx-root">
		<div class="query-box" data-ibx-type="ibxHBox" data-ibxp-align="stretch">
			<div class="bucket-container" data-ibx-type="ibxVBox">
				<div class="bucket-label" data-ibx-type="ibxLabel" data-ibxp-text="Measures"></div>
				<div class="bucket-content" data-ibx-type="ibxHBox" data-ibxp-align="center">
					<div class="field-buckets" data-ibx-type="ibxHBox">
					</div>
					<div class="add-bucket" data-ibx-type="ibxLabel" data-ibxp-glyph="add_box" data-ibxp-glyph-classes="material-icons md-48"></div>
				</div>
			</div>
		</div>

		<div data-ibx-no-bind="true" class="field-bucket-res" style="display:none">
			<div class="mz-fb-how-sort" data-ibx-name="_howSort" data-ibx-type="ibxLabel" data-ibx-col="1" data-ibx-row="1/span 2" data-ibxp-glyph="swap_vert" data-ibxp-glyph-classes="material-icons md-24"></div>
			<div class="mz-fb-how-aggregate mz-fb-select" data-ibx-name="_howAggregate" data-ibx-type="ibxListBox" data-ibx-col="2" data-ibx-row="1" data-ibxp-btn-show="false">
				<div data-ibx-type="ibxSelectItem" data-ibxp-text="Summary" data-ibxp-selected="true"></div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-text="Average"></div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-text="Maximum"></div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-text="Minimum"></div>
			</div>
			<div class="mz-fb-delete-bucket" data-ibx-name="_deleteBucket" data-ibx-type="ibxLabel" data-ibx-col="3" data-ibx-row="1" data-ibxp-glyph="highlight_off" data-ibxp-glyph-classes="material-icons"></div>
			<div class="mz-fb-select-field mz-fb-select" data-ibx-name="_fieldSelector" data-ibx-type="ibxListBox" data-ibx-col="2/span 2" data-ibx-row="2" data-ibxp-btn-show="false" data-ibxp-placeholder="Select Field...">
				<div data-ibx-type="ibxSelectGroup" data-ibxp-text="Group 1">
					<div data-ibx-type="ibxSelectItem" data-ibxp-text="a b c"></div>
					<div data-ibx-type="ibxSelectItem" data-ibxp-text="aa bb cc"></div>
					<div data-ibx-type="ibxSelectItem" data-ibxp-text="aaa bbb ccc"></div>
					<div data-ibx-type="ibxSelectItem" data-ibxp-text="aaaa bbbb cccc"></div>
					<div data-ibx-type="ibxSelectItem" data-ibxp-text="aaaaa bbbbb ccccc"></div>
				</div>
				<div data-ibx-type="ibxSelectGroup" data-ibxp-text="Group 2">
					<div data-ibx-type="ibxSelectItem" data-ibxp-text="a b c"></div>
					<div data-ibx-type="ibxSelectItem" data-ibxp-text="aa bb cc"></div>
					<div data-ibx-type="ibxSelectItem" data-ibxp-text="aaa bbb ccc"></div>
					<div data-ibx-type="ibxSelectItem" data-ibxp-text="aaaa bbbb cccc"></div>
					<div data-ibx-type="ibxSelectItem" data-ibxp-text="aaaaa bbbbb ccccc"></div>
				</div>
				<div data-ibx-type="ibxSelectGroup" data-ibxp-text="Group 3">
					<div data-ibx-type="ibxSelectItem" data-ibxp-text="a b c"></div>
					<div data-ibx-type="ibxSelectItem" data-ibxp-text="aa bb cc"></div>
					<div data-ibx-type="ibxSelectItem" data-ibxp-text="aaa bbb ccc"></div>
					<div data-ibx-type="ibxSelectItem" data-ibxp-text="aaaa bbbb cccc"></div>
					<div data-ibx-type="ibxSelectItem" data-ibxp-text="aaaaa bbbbb ccccc"></div>
				</div>
			</div>
		</div>
	</body>
</html>

