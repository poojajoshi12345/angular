<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision$:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>test</title>
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
				$(".cmd-test").on("ibx_triggered", function(e)
				{
					console.clear();

					var el = $(".nav-list")[0];
					el.style.boxSizing = "";
					console.log("list", GetElementInfo(el));
					console.log(sformat("list ContentBox => cl:{1}, ct:{2}, cw:{3}, ch:{4}...ol:{5}, ot:{6}, ow:{7}, oh:{8}",
						el.clientLeft, el.clientTop, el.clientWidth, el.clientHeight,
						el.offsetLeft, el.offsetTop, el.offsetWidth, el.offsetHeight));
					el.style.boxSizing = "";

					var el = $(".item-15")[0];
					el.style.boxSizing = "";
					console.log("item", GetElementInfo(el));
					console.log(sformat("item ContentBox => cl:{1}, ct:{2}, cw:{3}, ch:{4}...ol:{5}, ot:{6}, ow:{7}, oh:{8}",
						el.clientLeft, el.clientTop, el.clientWidth, el.clientHeight,
						el.offsetLeft, el.offsetTop, el.offsetWidth, el.offsetHeight));
					el.style.boxSizing = "";
				});

				var selItem = 15;
				var navList = $(".nav-list").on("click keydown", function(e)
				{
					if(e.target == this || (e.type == "keydown" && e.keyCode != $.ui.keyCode.ENTER))
						return;

					$(".nav-list-item").each(function(idx, el)
					{
						$(el).removeClass("selected");
					});
					
					$(e.target).addClass("selected");
				});

				navList.on("scroll", function(e)
				{
					var item = $(".selected");
					var vpInfo = GetVisibilty(item[0]);
					console.log(vpInfo);		
				});

				for(var i = 0; i < 25; ++i)
				{
					var item = $(sformat("<div tabindex='-1' class='nav-list-item item-{1}'>Nav List Item {1}</div>", i));
					navList.append(item);
					if(i == selItem)
						item.addClass("selected ibx-nav-key-item-active");
				}
			}, [{src:"./test_res_bundle.xml", loadContext:"app"}], true);
		</script>
		<style type="text/css">
			html, body
			{
				width:100%;
				height:100%;
				margin:0px;
				box-sizing:border-box;
			}
			.main-box
			{
				width:100%;
				height:100%;
				box-sizing:border-box;
			}
			.nav-list
			{
				font-size: 16px;
				margin:10px;
				padding:10px;
				width:300px;
				border:1px solid black;
				overflow:auto;
			}
			.nav-list-item
			{
				flex:0 0 auto;
				xwidth:500px;
				margin:0px;
				border:1px solid #ccc;
			}
			.selected
			{
				background-color:thistle;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="start" data-ibxp-justify="start">
			<div tabindex="0" class="nav-list" data-ibx-type="ibxVBox" data-ibxp-inline="true" data-ibxp-align="stretch" data-ibxp-nav-key-root="true" data-ibxp-focus-default="false" data-ibxp-nav-key-reset-focus-on-blur="false" data-ibxp-nav-key-dir="vertical">
			</div>
		</div>
		<div class="cmd-test" data-ibx-type="ibxCommand" data-ibxp-shortcut="CTRL+C"></div>

<!--
			<div data-ibx-type="ibxMenuButton">My Menu Button
				<div data-ibx-type="ibxMenu">
					<div data-ibx-type="ibxMenuItem">Menu Item 1</div>
					<div data-ibx-type="ibxMenuItem">Menu Item 2</div>
					<div data-ibx-type="ibxMenuItem">Menu Item 3</div>
				</div>
			</div>
-->
	</body>
</html>
