<%-- Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved. 
 $Revision: 1.6 $:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>ibx drag/drop sample</title>
		<meta http-equiv="X-UA-Compatible" content="IE=11" >
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
				$(".top-banner-icon").on("ibx_dragover ibx_dragleave ibx_drop", function(e)
				{
					e = e.originalEvent;
					var target = $(e.currentTarget);
					var dt = e.dataTransfer;
					if(e.type == "ibx_dragover")
					{
						var dragItem = $("#" + dt.getData("dragItem"));
						var tType = dragItem.data("dragType");
						if(tType)	
						{
							target.ibxAddClass("drag-target");
							dt.dropEffect = "copy";
							e.preventDefault();
						}
					}
					else
					if(e.type == "ibx_dragleave")
					{
						target.ibxRemoveClass("drag-target");
					}
					else
					if(e.type == "ibx_drop")
					{
						target.ibxRemoveClass("drag-target");
						var dragItem = $("#" + dt.getData("dragItem"));
						var dragType = dragItem.data("dragType");
						(dragType == "ren") ? dragItem.insertBefore(target) : dragItem.insertAfter(target);
					}
				});

				$(".drag-tile").on("ibx_dragstart ibx_dragover ibx_dragleave ibx_drop", function(e)
				{
					e = e.originalEvent;
					var target = $(e.currentTarget);
					var dt = e.dataTransfer;
					if(e.type == "ibx_dragstart")
					{
						dt.setData("dragItem", target.prop("id"));
						dt.setDragImage(null, "center", "center");
					}
					else
					if(e.type == "ibx_dragover")
					{
						var dragItem = $("#" + dt.getData("dragItem"));
						var tType = target.data("dragType");
						var dType = dragItem.data("dragType");
						if(dType != tType)	
						{
							target.ibxAddClass("drag-target");
							dt.dropEffect = "copy";
							e.preventDefault();
						}
					}
					else
					if(e.type == "ibx_dragleave")
					{
						target.ibxRemoveClass("drag-target");
					}
					else
					if(e.type == "ibx_drop")
					{
						target.ibxRemoveClass("drag-target");
						var dragItem = $("#" + dt.getData("dragItem"));
						dragItem.insertAfter(target);
					}
				});
			}, true);
		</script>
		<style type="text/css">
			html, body, .box-main
			{
				margin:0px;
				height:100%;
				width:100%;
				box-sizing:border-box;
			}
			.top-banner-icon
			{
				flex:0 0 auto;
				height:200px;
				width:200px;
				transform:scale(1);
				transition:transform .25s;
			}
			.top-banner-label
			{
				font-size:36px;
				font-weight:bold;
			}
			.drag-target.top-banner-icon
			{
				transform:scale(1.25);
				transition:transform .25s;
			}
			.box-content
			{
			}
			.box-ren, .box-stimpy
			{
			}
			.drag-tile
			{
				flex:0 0 auto;
				width:100px;
				height:100px;
				margin:20px;
				transition:transform .5s;
			}
			.drag-target.drag-tile
			{
				transform:rotate(360deg);
				transition:transform .5s;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="box-main" data-ibx-type="ibxVBox" data-ibxp-align="stretch" data-ibxp-justify="center">
			<div class="top-banner-label" data-ibx-type="ibxLabel" data-ibxp-justify="center">Drag Stuff Around!</div>
			<div class="box-banner" data-ibx-type="ibxHBox" data-ibxp-justify="center" data-ibxp-align="center">
				<div class="top-banner-icon" data-ibx-type="ibxLabel" data-ibxp-external-drop-target="true" data-ibxp-icon="./renstimpy.png"></div>
			</div>
			<div class="box-content" data-ibx-type="ibxHBox" data-ibxp-align="stretch" data-ibxp-justify="center">
				<div class="box-ren" data-ibx-type="ibxHBox" data-ibxp-align="center" data-ibxp-justify="center">
					<div tabindex="0" id="r1" class="drag-tile ren" data-drag-type="ren" data-ibx-type="ibxLabel" data-ibxp-icon="ren1.png" data-ibxp-draggable="true"></div>
					<div id="r2" class="drag-tile ren" data-drag-type="ren" data-ibx-type="ibxLabel" data-ibxp-icon="ren2.png" data-ibxp-draggable="true"></div>
				</div>
				<div class="box-ren" data-ibx-type="ibxHBox" data-ibxp-align="center" data-ibxp-justify="center">
					<div tabindex="0" id="s1" class="drag-tile stimpy" data-drag-type="stimpy" data-ibx-type="ibxLabel" data-ibxp-icon="stimpy1.png" data-ibxp-draggable="true"></div>
					<div tabindex="0" id="s2" class="drag-tile stimpy" data-drag-type="stimpy" data-ibx-type="ibxLabel" data-ibxp-icon="stimpy2.png" data-ibxp-draggable="true"></div>
				</div>
			</div>
		</div>
	</body>
</html>

