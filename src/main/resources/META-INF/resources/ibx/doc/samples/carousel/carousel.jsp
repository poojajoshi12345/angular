<%-- Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved. 
 $Revision: 1.10 $:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>ibx carousel sample</title>
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
				function init(options)
				{
					$(".ibx-carousel").ibxWidget("remove");

					var images = [ "renstimpy.png", "ren1.png", "ren2.png", "stimpy1.png", "stimpy2.png"];
					var vCsl = $(".test-csl-v").ibxWidget("remove").prop("scrollTop", 0);
					var hCsl = $(".test-csl-h").ibxWidget("remove").prop("scrollLeft", 0);
					var hBigCsl = $(".test-csl-h-big").ibxWidget("remove").prop("scrollLeft", 0);
					var hCslStf = $(".test-csl-h-stf").ibxWidget("remove").prop("scrollLeft", 0).detach();
					for(var i = 0; i < options.numChildren; ++i)
					{
						//make children of variable size fractional so we can make sure calculations work with weird sizes
						var size = options.varSizeChildren ? (GetRandomInt(10000, 30000)/100) + "px" : "";
						var item = $("<div class='test-csl-item' tabIndex='0'>Item_" + i + "</div>");
						vCsl.ibxWidget("add", item, null, null, false);
						item.css("height", size);

						var item = $("<div class='test-csl-item' tabIndex='0'>Item_" + i + "</div>").ibxAddClass("test-item-"+i);
						hCsl.ibxWidget("add", item, null, null, false);
						item.css("width", size);

						var hBox = $("<div class='test-csl-item test-csl-box-item'>").ibxHBox({"wrap":true});
						hBigCsl.ibxWidget("add", hBox, null, null, false);
						for(var j = 0; j < 4; ++j)
						{
							var item = $("<div class='test-csl-item test-csl-sub-item' tabIndex='0'>Item_" + ((i*4)+j) + "</div>").ibxAddClass("test-item-"+i);
							hBox.ibxWidget("add", item, null, null, false);
						}

						var img = images[i%5];
						var itemStf = $(sformat("<img class='test-csl-item-stf' tabIndex='0' src='{1}'>", img)).ibxAddClass("test-item-stf"+i);
						itemStf.on("dragstart", function(e){e.preventDefault()});
						hCslStf.ibxWidget("add", itemStf, null, null, false);
					}	
					
					//carousel with images my not have loaded images by now...so refresh on timer.
					window.setTimeout(function()
					{
						vCsl.ibxWidget("option", "prevNextButtonPos", options.prevNextButtonPos).ibxWidget("option", options).ibxWidget("page", 0, 0);
						hCsl.ibxWidget("option", "prevNextButtonPos", options.prevNextButtonPos).ibxWidget("option", options).ibxWidget("page", 0, 0);
						hBigCsl.ibxWidget("option", "prevNextButtonPos", options.prevNextButtonPos).ibxWidget("option", options).ibxWidget("page", 0, 0);
						
						$(".csl-v-box").append(hCslStf);
						hCslStf.ibxWidget("option", "prevNextButtonPos", options.prevNextButtonPos).ibxWidget("option", options).ibxWidget("page", 0, 0);
					}, 1);
				}

				$(".ibx-carousel").on("ibx_beforescroll", function(e)
				{
					var scrollInfo = e.originalEvent.data;
				});

				$(".tb-ctrl").on("ibx_change", function(e)
				{
					options.update();
					init(options);
				});

				var options = 
				{
					showPageMarkers:false,
					pageMarkersPos:"",
					prevNextButtonPos:"",
					floatButtons:false,
					hideDisabledButtons:false,
					scrollType:"",
					numChildren:0,
					varSizeChildren:false,
					update:function()
					{
						var rgVal = $(".rg-scroll-type").ibxWidget("userValue");

						options.showPageMarkers =  $(".show-markers").ibxWidget("checked");
						options.pageMarkersPos = $(".rg-marker-pos").ibxWidget("userValue");
						options.prevNextButtonPos = $(".rg-pnbtn-pos").ibxWidget("userValue");
						options.floatButtons = $(".float-pnbtn").ibxWidget("checked");
						options.hideDisabledButtons =  !$(".show-disabled-pnbtn").ibxWidget("checked");
						options.scrollType = rgVal;
						options.numChildren = parseInt($(".num-children").ibxWidget("value"), 10);
						options.varSizeChildren =  $(".var-size-children").ibxWidget("checked");
					}
				}
				$(".rg-scroll-type").trigger("ibx_change");
			}, true);
			//# sourceURL=carousel.jsp
		</script>

		<style type="text/css">
			html, body
			{
				height:100%;
				width:100%;
				margin:0px;
			}

			.main-box
			{
				padding:10px;
				height:100%;
				box-sizing:border-box;
			}
			.tbar-box
			{
				flex:0 0 auto;
				padding-bottom:.5em;
				height:auto;
				border-bottom:1px solid #ccc;
				margin-bottom:5px;
			}
			.csl-box-main
			{
				flex:1 1 auto;
				min-height:200px;
				overflow:hidden;
			}
			.csl-v-box
			{
				flex:1 1 auto;
				width:1px;
			}
			.ibx-carousel
			{
				border:1px solid #aaa;
				box-shadow:5px 5px 5px 0 #aaa;
				margin-right:15px;
				margin-bottom:15px;
			}
			.test-csl-v
			{
				flex:0 1 auto;
				width:225px;
			}
			.test-csl-h-stf
			{
				flex:0 0 auto;
				align-self:center;
				width:30%;
				height:25%;
			}

			.ibx-carousel .ibx-csl-items-box  *
			{
				box-sizing:border-box;
			}
			.test-csl-item-stf
			{
				outline:none;
			}
			.test-csl-item-stf:hover
			{
				xpadding-left:5px;
				xpadding-right:5px;
				xtransform:scale(1.15);
				xtransition:all ease-in-out .1s;
			}
			.test-csl-item
			{
				height:150px;
				width:150px;
				background-color:thistle;
				border:1px solid black;
				xbox-shadow:3px 3px 5px 0 #ccc;
				margin:5px;
			}
			.test-csl-box-item
			{
				height:150px;
				width:150px;
				border:none;
			}
			.test-csl-sub-item
			{
				flex:1 1 auto;
				width:50%;
				height:50%;
				margin:0px;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="stretch" data-ibxp-justify="start" data-ibxp-native-drop-target="true" data-ibxp-file-upload-ajax-options="{url:'../../julian/upload.jsp'}">
			<div class="tbar-box" data-ibx-type="ibxHBox" data-ibxp-align="center" data-ibxp-wrap="true">
				<div data-ibx-type="ibxLabel" style="margin-right:3px">Scroll Type:</div>
				<div data-ibx-type="ibxButtonGroup" style="margin-right:10px;">
					<div class="tb-ctrl rg-scroll-type" data-ibx-type="ibxRadioGroup" data-ibxp-name="rgScrollType"></div>
					<div data-ibx-type="ibxRadioButton" data-ibxp-group="rgScrollType" data-ibxp-user-value="fractional">Fractional</div>
					<div data-ibx-type="ibxRadioButton" data-ibxp-group="rgScrollType" data-ibxp-user-value="integral" data-ibxp-checked="true">Integral</div>
					<div data-ibx-type="ibxRadioButton" data-ibxp-group="rgScrollType" data-ibxp-user-value="page">Page</div>
				</div>
				<div data-ibx-type="ibxLabel" style="margin-right:3px">Number of Children:</div>
				<div class="tb-ctrl num-children" data-ibx-type="ibxTextField" style="width:50px;margin-right:10px;">20</div>
				<div class="tb-ctrl var-size-children" data-ibx-type="ibxCheckBoxSimple" style="margin-right:10px">Variable Size Children</div>

				<div class="tb-ctrl show-markers" data-ibx-type="ibxCheckBoxSimple" data-ibxp-checked="true" style="margin-right:5px">Show Page Markers At</div>
				<div data-ibx-type="ibxButtonGroup" style="margin-right:10px;">
					<div class="tb-ctrl rg-marker-pos" data-ibx-type="ibxRadioGroup" data-ibxp-name="rgMarkerPos"></div>
					<div data-ibx-type="ibxRadioButton" data-ibxp-group="rgMarkerPos" data-ibxp-user-value="start">Start</div>
					<div data-ibx-type="ibxRadioButton" data-ibxp-group="rgMarkerPos" data-ibxp-user-value="end" data-ibxp-checked="true">End</div>
				</div>

				<div class="tb-ctrl show-disabled-pnbtn" data-ibx-type="ibxCheckBoxSimple" data-ibxp-checked="true" style="margin-right:5px">Show Disabled Prev/Next Buttons At</div>
				<div data-ibx-type="ibxButtonGroup" style="margin-right:5px;">
					<div class="tb-ctrl rg-pnbtn-pos" data-ibx-type="ibxRadioGroup" data-ibxp-name="rgPnBtnPos"></div>
					<div data-ibx-type="ibxRadioButton" data-ibxp-group="rgPnBtnPos" data-ibxp-user-value="ends" data-ibxp-checked="true">Ends</div>
					<div data-ibx-type="ibxRadioButton" data-ibxp-group="rgPnBtnPos" data-ibxp-user-value="start">Start</div>
					<div data-ibx-type="ibxRadioButton" data-ibxp-group="rgPnBtnPos" data-ibxp-user-value="end">End</div>
				</div>
				<div class="tb-ctrl float-pnbtn" data-ibx-type="ibxCheckBoxSimple" data-ibxp-checked="false" style="margin-right:10px">Float Buttons (only ends)</div>
			</div>
			
			<div class="csl-box-main" data-ibx-type="ibxHBox" data-ibxp-align="stretch" data-ibxp-justify="start">
				<div class="test-csl-v" tabIndex="0" data-ibx-type="ibxVCarousel"></div>
				<div class="csl-v-box" data-ibx-type="ibxVBox" data-ibxp-align="stretch" data-ibxp-justify="center">
					<div class="xxx test-csl-h" tabIndex="0" data-ibx-type="ibxHCarousel"></div>
					<div class="test-csl-h-big" tabIndex="0" data-ibx-type="ibxHCarousel"></div>
					<div class="test-csl-h-stf" tabIndex="0" data-ibx-type="ibxHCarousel" data-ibxp-size-to-fit="true"></div>
				</div>
			</div>
		</div>
	</body>
</html>
