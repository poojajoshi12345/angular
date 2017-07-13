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
				var csl = $(".test-carousel");
				for(i = 0; i < 20; ++i)
				{
					var label = $("<div tabIndex='0'>").ibxLabel({text:"Label " + i, justify:"center"}).addClass("test-label test-label-"+i);
					csl.ibxWidget("add", label);
				}

				csl.on("ibx_beforescroll ibx_scroll ibx_endscroll", function(csl, e)
				{
					if(e.type == "ibx_endscroll")
					{
						var info = csl.data("ibxWidget").getPageMetrics();
						var children = csl.ibxWidget("children");
						children.each(function(idx, el)
						{
							var vis = isVisible(el);
							if(!(vis & (VIS_LEFT | VIS_RIGHT)))
								console.log("NONE", el);
							if(!(vis & VIS_LEFT) && (vis & VIS_RIGHT))
								console.log("PREVIOUS", el);
							if((vis & VIS_LEFT) && !(vis & VIS_RIGHT))
								console.log("NEXT", el);
							if(vis == VIS_ALL)
								console.log("ALL", el);
						});
					}
				}.bind(null, csl));

				var VIS_NONE	= 0x00000000;
				var VIS_LEFT	= 0x00000001;
				var VIS_TOP		= 0x00000002;
				var VIS_RIGHT	= 0x00000004;
				var VIS_BOTTOM	= 0x00000008;
				var VIS_ALL		= VIS_LEFT | VIS_TOP | VIS_RIGHT | VIS_BOTTOM;

				function isVisible(el)
				{
					el = $(el);
					var elBounds = el.position();
					elBounds.right = elBounds.left + el.outerWidth(true);
					elBounds.bottom = elBounds.top + el.outerHeight(true);

					var p = $(el.prop("offsetParent"));
					var pWidth = p.width();
					var pHeight = p.height();

					var visFlags = 0;
					visFlags |= (elBounds.left >= 0 && elBounds.left <= pWidth) ? VIS_LEFT : 0;
					visFlags |= (elBounds.top >= 0 && elBounds.top <= pHeight) ? VIS_TOP : 0;
					visFlags |= (elBounds.right >= 0 && elBounds.right <= pWidth) ? VIS_RIGHT : 0;
					visFlags |= (elBounds.bottom >= 0 && elBounds.bottom <= pHeight) ? VIS_BOTTOM: 0;
					visFlags = (!(visFlags & (VIS_LEFT | VIS_RIGHT)) || !(visFlags & (VIS_TOP | VIS_BOTTOM))) ? VIS_NONE : visFlags;
					return visFlags;
				}

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

			.test-carousel
			{
				flex:1 1 auto;
				margin:200px;
				overflow:hidden;
				border:1px solid #ccc;
			}

			.test-label
			{
				width:150px;
				height:100px;
				margin:5px;
				padding:5px;
				border:1px solid black;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="main-box" data-ibx-type="ibxHBox" data-ibxp-align="center">
			<div class="test-carousel" data-ibx-type="ibxHCarousel" data-ibxp-allow-drag-scrolling="true" data-ibxp-show-page-markers="false">
			</div>
		</div>
	</body>
</html>

