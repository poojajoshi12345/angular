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
				Ibfs.load().done(function(ibfs)
				{
					ibfs.login("admin", "admin").done(function(exInfo)
					{
						console.log("IBFS is logged in.");
					});
				});

				ibxEventManager.noIOSBodyScroll = false;

				$("body").on("keydown", function(e)
				{
					if(e.ctrlKey && e.key == 'c')
						console.clear();
				});

				$(".index-search-select").on("ibx_textchanged", function(e, txtInput, str)
				{
					Ibfs.ibfs.searchDimensionalIndex(str + "*", {asJSON:true}).done(function(exInfo)
					{
						var select = $(".index-search-select").data("ibxWidget");
						var items = exInfo.result.results;
						var selItems = [];
						$.each(items, function(selItems, idx, item)
						{
							if(idx > 10)
								return;

							var selItem = $(sformat("<div{1}</div>", item.Display)).ibxSelectItem();
							selItem.data("idxSearchInfo", item);
							selItems.push(selItem[0]);
						}.bind(this, selItems));
						select.children().remove();
						select.add(selItems, null, null, true);
					});
				}).on("ibx_change", function(e, eData, text)
				{
					var query = text + "*";
					if(!(eData instanceof jQuery))
					{
						idxInfo = eData.item.data;
						var idxInfo = eData.item.data("idxSearchInfo");
						query = idxInfo.DimensionFieldName + ":" + idxInfo.DimensionFieldValue;
					}

					Ibfs.ibfs.searchDimensionalInformation(query, {asJSON:true}).done(function(exInfo)
					{
						var queryResults = $(".query-results");
						var items = exInfo.result;
						for(var i = 0; i < items.length; ++i)
						{
							var item = items[i];
							var tile = $("<div class='res-tile'></div>").text(item.name);
							if(item.thumbPath)
								tile.css("background-image", sformat("url(\"{1}\")", item.thumbPath));

							tile.data("idxResInfo", item).on("click", function(e)
							{
								var item = $(this);
								var info = item.data("idxResInfo");
								console.log(info);
							});
							queryResults.append(tile);
						}
					});
				});
			}, [{src:"./test_res_bundle.xml", loadContext:"app"}], true);
		</script>
		<style type="text/css">
			.ibx-flexbox.main-box
			{
				position:absolute;
				left:0px;
				top:0px;
				right:0px;
				bottom:0px;
				overflow:auto;
				background-color:white;
			}
			.ibx-logo
			{
				font-size:64pt;
				font-weight:bold;
				margin-bottom:10px;
				color:thistle;
				text-shadow:3px 3px 5px #ccc;
			}
			.ibx-logo-i{}
			.ibx-logo-b{}
			.ibx-logo-x{}

			.index-search-select
			{
				flex:0 0 auto;
				width:350px;
				margin-bottom:5px;
			}
			.index-search-select-popup
			{
				max-height:200px;
				overflow:auto;
			}

			.query-results
			{
				flex:1 1 auto;
				align-self:stretch;
				overflow:auto;
				margin:10px;
				border:1px solid #ccc;
				border-radius:.25em;
			}

			.res-tile
			{
				width:150px;
				height:150px;
				margin:5px;
				border:1px solid #aaa;
				word-wrap:break-word;
				font-weight:bold;
				background-repeat:no-repeat;
				background-size:100%;
				background-position:center;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div tabIndex="0" id="mainBox" class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center" data-ibx-name-root="true">
			<div class="ibx-logo" data-ibx-type="ibxLabel"><span class="ibx-logo-i">i</span><span class="ibx-logo-b">b</span><span class="ibx-logo-x">x</span></div>
			<div tabIndex="0" class="index-search-select" data-ibx-type="ibxComboBox"  data-ibxp-text-overflow="ellipsis" data-ibxp-list-classes="index-search-select-popup"></div>
			<div tabIndex="0" class="query-results" data-ibx-type="ibxHBox" data-ibxp-wrap="true">
			</div>
		</div>
	</body>
</html>
