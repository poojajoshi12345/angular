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
				Ibfs.load();
				Ibfs.ibfs.setExOptions({async:false, asJSON:true, asJSONShallow:true});

				ibxEventManager.noIOSBodyScroll = false;

				$("body").on("keydown", function(e)
				{
					if(e.ctrlKey && e.key == 'c')
						console.clear();
				});

				$(".test-ibx-select").on("ibx_textchanged", function(e, txtInput, str)
				{
					var regx = new RegExp(sformat("^{1}", str), "i");
					var select = $(this).data("ibxWidget");
					var dir = "IBFS:/WFC/Repository/Public/repros/";
					var selItems = [];
					var items = Ibfs.ibfs.listItems(dir, {async:false, asJSON:true}).result;
					for(var i = 0; i < items.length; ++i)
					{
						var item = items[i];
						if(regx.test(item.name))
						{
							var selItem = $("<div>").ibxSelectItem({labelOptions:{text:item.name}});
							selItems.push(selItem[0]);
						}
					}

					select.children().remove();
					select.add(selItems, null, null, true);
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
				background-color:thistle;
			}

			.test-ibx-test-select-popup
			{
				max-height:200px;
				overflow:auto;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div tabIndex="0" id="mainBox" class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center" data-ibx-name-root="true">
			<div class="test-label" data-ibx-type="ibxLabel" data-ibxp-text="123456789012345678901234567890123456789012345678"></div>
            <div tabIndex="1" data-ibx-type="ibxComboBox" class="test-ibx-select" data-ibxp-text-overflow="ellipsis" data-ibxp-list-classes="ibx-test-select-popup"></div>
		</div>
	</body>
</html>
