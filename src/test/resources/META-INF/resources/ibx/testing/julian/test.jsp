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
				$.widget("ibi.ibxDroppable", $.ui.droppable,
				{
					options:
					{
					},
					_widgetClass:"ibx-droppable",
					_create:function()
					{
						this._super();
						this.widgetEventPrefix = "ibx_";
						if (!this.element.data("ibxWidget"))
						{
							this.element.data("ibiIbxWidget", this);
							this.element.data('ibxWidget', this);
						}
					},
					_destroy:function()
					{
						this._super();
					},
				});

				var dragItem = $(".drag-jqui");
				dragItem.ibxDraggable().on(
				{
					ibx_start:function(e)
					{
						console.log(e.type);
					},
					ibx_stop:function(e)
					{
						console.log(e.type);
					},
					ibx_drag:function(e)
					{
						console.log(e.type, e);
					},
				});

				var dropItem = $(".drop-jqui");
				dropItem.ibxDroppable({accept:".drag-jqui", hoverClass:"drop-jqui-hover"}).on(
				{
					ibx_activate:function(e)
					{
						console.log(e.type);
					},
					ibx_deactivate:function(e)
					{
						console.log(e.type);
					},
					ibx_drop:function(e)
					{
						console.log(e.type);
					},
					ibx_out:function(e)
					{
						console.log(e.type);
					},
					ibx_over:function(e, ui)
					{
						ui.draggable.ibxWidget("option", "cursor", "no-drop").ibxWidget("refresh");
						console.log(e.type);
					},
					mousemove:function(e)
					{
						console.log(e.type);
					}
				});


				function TextSearch(txtField)
				{
					this._txtField = $(txtField).data("txt-search", this).on("ibx_textchanged", this._onTextChanged.bind(this));
					this._searchTimer = window.setInterval(this._onSearchTimer.bind(this), 1000);
				}
				_p = TextSearch.prototype = new Object();
				_p._searchText = "";
				_p._onTextChanged = function(e, txtField, curVal)
				{
					this._searchText = curVal;
				};
				_p._lastSearchText = "";
				_p._onSearchTimer = function()
				{
					if(this._searchText != this._lastSearchText)
					{
						this._lastSearchText = this._searchText;
						console.log("Search %s for: %s", this._txtField.data("name"), this._searchText);
					}
				}
				
				new TextSearch(".txt-field1");
				new TextSearch(".txt-field2");

			}, true);
		</script>
		<style type="text/css">
			.drag-jqui
			{
				display:none;
				position:absolute;
				left:10px;
				top:10px;
				padding:5px;
				border:1px solid blue;
			}
			.drop-jqui
			{
				display:none;
				position:absolute;
				left:125px;
				top:10px;
				padding:5px;
				border:1px solid red;
			}
			.drop-jqui-hover
			{
				border:2px solid black;
				background-color:pink;
				padding:4px;
			}
		</style>
	</head>
	<body class="ibx-root">
		<!--
		<div class="drag-jqui" data-ibx-type="ibxLabel">JQuery UI Drag</div>
		<div class="drop-jqui" data-ibx-type="ibxLabel" data-ibxp-justify="center">JQuery UI Drop</div>
		-->
		<div class="txt-field1" data-name="TextField1" data-ibx-type="ibxTextField"></div>
		<div class="txt-field2" data-name="TextField2" data-ibx-type="ibxTextField"></div>
	</body>
</html>

