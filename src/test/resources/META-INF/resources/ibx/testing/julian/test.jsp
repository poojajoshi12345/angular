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
						var item = items[i];
						//if(item.container)
						//	continue;

						var qItem = $(sformat("<div class='test-tile' title='{1}'>{2}</div>", item.fullPath, item.name));
						qItem.css("background-image", sformat('url("{1}")', item.thumbPath));
						csl.ibxWidget("add", qItem);
					}
				});


				$(".test-popup-inner-text").text(ibx.resourceMgr.getString("IBX_STR_SAMPLE"));
				//$(".test-popup").ibxWidget("open");
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

			.test-popup
			{
				border:1px solid #aaa;
				background-color:transparent;
				box-shadow:0px 0px 15px 0px #999;
			}

			.test-popup-inner-box
			{
				width:400px;
				height:175px;
				border-radius:.5em;
			}

			.test-popup-inner-text
			{
				box-sizing:border-box;
				white-space:nowrap;
				border:2px solid #ccc;
				margin:10px;
				padding:5px;
				overflow:auto;
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
		</style>
	</head>
	<body class="ibx-root">
		<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
			<div tabindex="0" class="test-carousel" data-ibx-type="ibxHCarousel" data-ibxp-scroll-type="page" data-ibxp-hide-disabled-buttons="true"></div>
		</div>

		<div class="test-popup" data-ibx-type="ibxPopup" data-ibxp-auto-close="false" data-ibxp-destroy-on-close="false" data-ibxp-opaque="true">
			<div class="test-popup-inner-box" data-ibx-type="ibxVBox" data-ibxp-align="stretch" data-ibxp-justify="center">
				<div tabindex="0" class="test-popup-inner-text" data-ibx-type="ibxLabel"></div>
			</div>
		</div>
	</body>
</html>
