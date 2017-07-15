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
				var csl = $(".test-csl");
				for(i = 0; i < 20; ++i)
				{
					var label = $("<div tabIndex='0'>").ibxLabel({text:"Label " + i, justify:"center"}).addClass("test-label test-label-"+i);
					csl.ibxWidget("add", label);
				}

				curChildren = [];
				csl.on("ibx_beforescroll ibx_scroll ibx_endscroll", function(csl, curChildren, e, scrollInfo)
				{
					if(e.type == "ibx_beforescroll" && scrollInfo)
					{
						var curChildren = [];
						var children = csl.ibxWidget("children");
						children.each(function(curChildren, idx, el)
						{
							var elInfo = isVisible(el);
							if(elInfo.visFlags == VIS_ALL)
								curChildren.push(elInfo)
						}.bind(this, curChildren));

						var scrollChild = $(scrollInfo.toStart ? curChildren[0].el.prev() : curChildren[curChildren.length - 1].el.next());
						var childInfo = getElementMetrics(scrollChild);
						var itemsBox = $(e.target);
						if(scrollInfo.forward)
							scroll = childInfo.right - Math.round(itemsBox.width()) + itemsBox.prop("scrollLeft");
						else
							scroll = childInfo.left + itemsBox.prop("scrollLeft");

						itemsBox.prop("scrollLeft", scroll);
						e.preventDefault();
					}
				}.bind(this, csl, curChildren));

				var VIS_NONE	= 0x00000000;
				var VIS_LEFT	= 0x00000001;
				var VIS_TOP		= 0x00000002;
				var VIS_RIGHT	= 0x00000004;
				var VIS_BOTTOM	= 0x00000008;
				var VIS_ALL		= VIS_LEFT | VIS_TOP | VIS_RIGHT | VIS_BOTTOM;

				function getElementMetrics(el)
				{
					el = $(el);
					var elInfo = el.position() || {};
					elInfo.width = el.outerWidth(true);
					elInfo.height = el.outerHeight(true);
					elInfo.right = elInfo.left + elInfo.width;
					elInfo.bottom = elInfo.top + elInfo.height;
					elInfo.el = el;
					return elInfo;
				}

				function isVisible(el)
				{
					var elInfo = getElementMetrics(el);

					var p = $(el.offsetParent);
					var pWidth = p.width();
					var pHeight = p.height();

					var visFlags = 0;
					visFlags |= (elInfo.left >= 0 && elInfo.left <= pWidth) ? VIS_LEFT : 0;
					visFlags |= (elInfo.top >= 0 && elInfo.top <= pHeight) ? VIS_TOP : 0;
					visFlags |= (elInfo.right >= 0 && elInfo.right <= pWidth) ? VIS_RIGHT : 0;
					visFlags |= (elInfo.bottom >= 0 && elInfo.bottom <= pHeight) ? VIS_BOTTOM: 0;
					visFlags = (!(visFlags & (VIS_LEFT | VIS_RIGHT)) || !(visFlags & (VIS_TOP | VIS_BOTTOM))) ? VIS_NONE : visFlags;
					elInfo.visFlags = visFlags;
					return elInfo;
				}

				$(".test-button").on("click", function(e)
				{
					var select = $(".test-select");
					select.ibxWidget("remove", ".ibx-select-item");
					var date = new Date();
					
					var items = $();
					for(var i = 0; i < 250; ++i)
					{
						var selItem = $("<div>").ibxSelectItem({"text":"Item" + i, glyph:"face", glyphClasses:"material-icons"});
						select.ibxWidget("add", selItem, null, null, false);
						items.add(selItem);
					}
					select.ibxWidget("refresh");
					//select.ibxWidget("add", items, null, null, false).ibxWidget("refresh");
					console.log(new Date() - date);
				});

			}, [], true);
		</script>
		<style type="text/css">
			html, body
			{
				margin:0px;
				height:100%;
				width:100%;
				position:fixed;
			}

			.main-box
			{
				position:absolute;
				left:0px;
				top:0px;
				right:0px;
				bottom:0px;
			}

			.test-csl
			{
				flex:1 1 auto;
				margin:200px;
				overflow:hidden;
				border:1px solid #ccc;
			}

			.test-csl .ibx-csl-items-box
			{
				height:140px;
				background-color:pink;
			}

			.test-label
			{
				width:150px;
				height:100px;
				margin:5px;
				padding:5px;
				background-color:tomato;
				xborder:1px solid black;
			}

			.test-select
			{
				flex:1 1 auto;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="main-box" data-ibx-type="ibxHBox" data-ibxp-align="center" data-ibxp-justify="center">
			<div class="test-csl" data-ibx-type="ibxHCarousel" data-ibxp-allow-drag-scrolling="true" data-ibxp-show-page-markers="false">
			</div>
		</div>
	</body>
</html>

