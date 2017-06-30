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
				function log()
				{
					var str = sformat.apply(this, arguments);
					var txtOut = $(".txt-out");
					var txt = txtOut.ibxTextArea("option", "text");						
					txtOut.ibxWidget("option", "text", txt + "\n" + str);
					txtOut.find("textarea").scrollTop(1000000);
				};

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
						console.log(".drag-jqui: %s", e.type);
					},
					ibx_stop:function(e)
					{
						console.log(".drag-jqui: %s", e.type);
					},
					ibx_drag:function(e)
					{
						console.log(".drag-jqui: %s", e.type);
					},
				});

				var dropItem = $(".drop-jqui");
				dropItem.ibxDroppable({accept:".drag-jqui", hoverClass:"drop-jqui-hover"}).on(
				{
					ibx_activate:function(e)
					{
						console.log(".drop-jqui: %s", e.type);
					},
					ibx_deactivate:function(e)
					{
						console.log(".drop-jqui: %s", e.type);
					},
					ibx_drop:function(e)
					{
						console.log(".drop-jqui: %s", e.type);
					},
					ibx_out:function(e)
					{
						console.log(".drop-jqui: %s", e.type);
					},
					ibx_over:function(e, ui)
					{
						console.log(".drop-jqui: %s", e.type);
					}
				});

				$.widget("ibi.ibxDragSource", $.Widget,
				{
					options:
					{
					},
					_widgetClass:"ibx-drag-source",
					_create:function()
					{
						this._super();
						this.widgetEventPrefix = "ibx_";
						if (!this.element.data("ibxWidget"))
						{
							this.element.data("ibiIbxWidget", this);
							this.element.data('ibxWidget', this);
						}
						this.element.attr("draggable", true).on(
						{
							dragstart:this._onDragEvent.bind(this),
							dragend:this._onDragEvent.bind(this),
						});
					},
					_onDragEvent:function(e)
					{
						var e = e.originalEvent;
						if(e.type == "dragstart")
						{
							var dt = e.dataTransfer;
							dt.setDragImage($(".drag-image")[0], 0, 0);
							dt.effectAllowed = "copy";
							dt.setData("drag-native", ".ibx-is-dragging");
							this.element.addClass("ibx-is-dragging");
						}
						log(e.type);
					},
					_destroy:function()
					{
						this.element.prop("draggable", "");
						this._super();
					},
				});

				$.widget("ibi.ibxDragTarget", $.Widget,
				{
					options:
					{
					},
					_widgetClass:"ibx-drag-target",
					_create:function()
					{
						this._super();
						this.widgetEventPrefix = "ibx_";
						if (!this.element.data("ibxWidget"))
						{
							this.element.data("ibiIbxWidget", this);
							this.element.data('ibxWidget', this);
						}
						this.element.attr("draggable", true).on(
						{
							dragenter:this._onDragEvent.bind(this),
							dragexit:this._onDragEvent.bind(this),
							dragover:this._onDragEvent.bind(this),
							dragleave:this._onDragEvent.bind(this),
							drop:this._onDragEvent.bind(this)
						});
					},
					_onDragEvent:function(e)
					{
						var e = e.originalEvent;
						var dt = e.dataTransfer;
						if(e.type == "dragover")
						{
							dt.dropEffect = "move";
							e.preventDefault();
						}
						else
						if(e.type == "drop")
						{
							var data = dt.getData("drag-native");
							var elDrag = $(data);
							this.element.after(elDrag).removeClass("drag-native");
							e.preventDefault();
						}
						log(e.type);
					},
					_destroy:function()
					{
						this.element.prop("draggable", "");
						this._super();
					},
				});

				$(".drag-native").ibxDragSource();
				$(".drop-native").ibxDragTarget();

			}, true);
		</script>
		<style type="text/css">
			html, body, .box-main
			{
				margin:0px;
				height:100%;
				width:100%;
			}

			.box-jqui, .box-native
			{
				margin:5px;
				padding:5px;
			}
			.txt-out
			{
				margin:5px;
			}

			.drag-jqui, .drop-jqui, .drag-native, .drop-native
			{
				width:125px;
				padding:5px;
				margin:5px;
				border:1px solid #ccc;
			}
			.drop-jqui-hover
			{
				padding:4px;
				border:2px solid black;
				background-color:pink;
			}
			.txt-out
			{
				flex:1 1 auto;
				border:1px solid black;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="box-main" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
			<div class="box-jqui" data-ibx-type="ibxHBox">
				<img class="drag-image" src="./recycle_16.png"/>

				<div class="drag-jqui" data-ibx-type="ibxLabel" data-ibxp-justify="center">JQuery UI Drag</div>
				<div class="drop-jqui" data-ibx-type="ibxLabel" data-ibxp-justify="center">JQuery UI Drop</div>
			</div>

			<div class="box-native" data-ibx-type="ibxHBox">
				<div class="drag-native" data-ibx-type="ibxLabel" data-ibxp-justify="center">Native UI Drag</div>
				<div class="drop-native" data-ibx-type="ibxLabel" data-ibxp-justify="center">Native UI Drop</div>
			</div>

			<div class="txt-out" data-ibx-type="ibxTextArea"></div>
		</div>
	</body>
</html>

