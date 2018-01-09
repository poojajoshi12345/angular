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
				ibxEventManager.noIOSBodyScroll = true;
				Ibfs.load().done(function()
				{
					Ibfs.ibfs.login("admin", "admin").done(function(e)
					{
						console.log("ibfs logged in.");
						Ibfs.ibfs.listItems("IBFS:/WFC/Repository/Public", {asJSON:true});
					});
				});


				window.addEventListener("ibfs_list_items", function(e)
				{
					var csl = $(".test-carousel");
					csl.ibxWidget("children").remove();

					var items = e.data.result;
					for(var i = 0; i < items.length; ++i)
					{
						if(i > 15)
							continue;
						var item = items[i];
						var qItem = $(sformat("<div id='tile{3}' class='test-tile' title='{1}'>{2}</div>", item.fullPath, item.name, i));
						qItem.css("background-image", sformat('url("{1}")', item.thumbPath));
						csl.ibxWidget("add", qItem);
					}

					$(".cmd-clear").on("ibx_triggered", function(e)
					{
						console.clear();
					});
					$(".cmd-files").on("ibx_triggered", function(e)
					{
						$(".test-carousel").focus();
					});
				});


				$(".test-popup-inner-text").text(ibx.resourceMgr.getString("IBX_STR_SAMPLE"));
				//$(".test-popup").ibxWidget("open");

				$(".ibx-carousel").on("ibx_beforenavkey", function(e)
				{
					//console.dir(e);
				});

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
				overflow:auto;
				background-color:white;
				box-sizing:border-box;
			}

			.test-carousel
			{
				max-width:75%;
				border:1px solid #aaa;
				border-radius:.5em;
				box-shadow:0px 0px 15px 0px #999;
			}

			.test-tile
			{
				width:100px;
				height:100px;
				display:flex;
				align-items:flex-end;
				justify-content:center;
				margin:10px;
				padding:5px;
				background-repeat:no-repeat;
				background-position:top;
				background-size:80%;
				overflow:hidden;
			}
			.test-tile:hover
			{
				background-color:#eee;
			}

			.test-button
			{
				margin:10px;
			}

			.test-popup
			{
				border:1px solid #aaa;
				box-shadow:0px 0px 15px 0px #999;
			}
			.test-popup-box
			{
				width:400px;
				padding:10px;
			}
			.ibx-slider.test-slider
			{
				flex:1 1 auto;
			}

			.test-iframe1
			{
				width:400px;
				height:400px;
			}
			.test-iframe2
			{
				border:1px solid black;
				height:200px;
				display:none;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="cmd-clear" data-ibx-type="ibxCommand" data-ibxp-shortcut="CTRL+C"></div>
		<div class="cmd-files" data-ibx-type="ibxCommand" data-ibxp-shortcut="CTRL+F"></div>
		<div id="mainBox" class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
			<div id="testBtn1" class="ibx-button test-button" tabindex="0" data-ibx-type="ibxMenuButton">Test Button 1
				<div data-ibx-type="ibxMenu">
					<div data-ibx-type="ibxMenuItem">Menu Item</div>
					<div data-ibx-type="ibxMenuItem">Menu Item</div>
					<div data-ibx-type="ibxMenuItem">Menu Item</div>
				</div>
			</div>
			<div id="testCarousel" class="test-carousel" tabindex="0" data-ibx-type="ibxHCarousel" data-ibx-options="{navKeyRoot:true, scrollType:'integral', aria:{role:'region', keyshortcuts:'Control+F', label:'I B F S Files List'}}"></div>
			<div id="testBtn2" class="test-button" tabindex="0" data-ibx-type="ibxButton">Test Button 2</div>
		</div>

		<div class="test-popup" data-ibx-type="ibxPopup" data-ibxp-auto-close="false" data-ibxp-escape-to-close="false" data-ibxp-destroy-on-close="false" data-ibxp-opaque="true">
			<div class="test-popup-box" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
				<div class="test-slider" tabIndex="0" data-ibx-type="ibxHSlider" data-ibx-options="{value:25, minTextPos:'center', maxTextPos:'center'}"></div>
				<div class="test-slider" tabindex="0" data-ibx-type="ibxHRange" data-ibx-options="{value:25, value2:75, minTextPos:'center', maxTextPos:'center'}"></div>
				<div class="test-iframe2" tabIndex="0" data-ibx-type="ibxIFrame" data-ibxp-src="./test.html"></div>
			</div>
		</div>
	</body>
</html>
