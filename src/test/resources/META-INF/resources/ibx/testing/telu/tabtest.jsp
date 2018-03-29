<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision$:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>ibx samples</title>
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
				jQuery.event.special['ibx_change'] = { noBubble: true };
				//jQuery.event.special['ibx_beforechange'] = { noBubble: true };

				/*
				$('.select').on('ibx_beforechange', function(e, data){
					if ($(e.target).hasClass('select'))
					{
						if (data.item)
							console.log('select beforechange: ' + data.item.ibxWidget('option', 'text'));
					}
				});
				$('.list').on('ibx_beforechange', function(e, data){
					if ($(e.target).hasClass('list'))
					{
						if (data.item)
							console.log('list beforechange: ' + data.item.ibxWidget('option', 'text'));
					}
				});

				$('.select').on('ibx_change', function(e, data){
					if ($(e.target).hasClass('select'))
					{
						if (data.item)
							console.log('select change: ' + data.item.ibxWidget('option', 'text'));
					}
				});
				$('.list').on('ibx_change', function(e, data){
					if ($(e.target).hasClass('list'))
					{
						if (data.item)
							console.log('list change: ' + data.item.ibxWidget('option', 'text'));
					}
				});

				$(".mytabpane").on("ibx_change", function (e, page){

					$(page).find('.ibx-label').ibxWidget('option', 'text', "New Label");
				});

				$(".add-page").on("click", function (){
					var newPage = $("<div>").ibxTabPage({"selected": true, "tabOptions": {"text": "New Page"}});
					var newLabel = $("<div>").ibxLabel({"text": "New Label"});
					newPage.ibxWidget('add', newLabel);
					$(".mytabpane").ibxWidget("add", newPage);
				});
				*/

				$(".mytabpane").ibxWidget("remove", ".thirdpage, .fourthpage");


				//$(".mytabpane").ibxWidget('selected', '.aaa');
				//var pages = $(".mytabpane").ibxWidget('children', '.ibx-tab-page.bbb');
				//pages.ibxWidget('option', 'selected', false);
				//$(".mytabpane").ibxWidget('selectedIndex', 1);
				//var pages = $(".mytabpane").ibxWidget('children', '.ibx-tab-page.aaa');
				//$(".mytabpane").ibxWidget('remove', pages);
				//$(".mytabpane").ibxWidget('userValue', 'p3');
				//alert($(".mytabpane").ibxWidget('selectedIndex'));
				//$(".mytabpane").ibxWidget('selectedIndex', 0);
				//alert($(".mytabpane").ibxWidget('selectedIndex'));
				//$(".mytabpane").ibxWidget('selectedIndex', 1);
				//alert($(".mytabpane").ibxWidget('selected').ibxWidget('button').ibxWidget('option', 'text'));
			}, true);
		</script>

		<style type="text/css">
			.select, .list { margin: 10px; border: 1px solid red; padding: 10px;}
			.pd-control-size-grid-icon.ibx-label-glyph:before
			{
				transform: rotate(45deg);
			}

		</style>
	</head>
	<body class="ibx-root">

		<div class="mytabpane" data-ibx-type="ibxTabPane">
			<div class="firstpage" data-ibx-type="ibxTabPage">Page1<div data-ibx-type="ibxLabel">Label1</div></div>
			<div class="secondpage" data-ibx-type="ibxTabPage">Page2<div data-ibx-type="ibxLabel">Label2</div></div>
			<div class="thirdpage" data-ibx-type="ibxTabPage" data-ibxp-selected="true">Page3<div data-ibx-type="ibxLabel">Label3</div></div>
			<div class="fourthpage" data-ibx-type="ibxTabPage">Page4<div data-ibx-type="ibxLabel">Label4</div></div>
		</div>

		<!--
		<div class="add-page" data-ibx-type="ibxButton">Add Page</div>



		<div data-ibx-type="ibxHBox">

			<div class="select" data-ibx-type="ibxSelect" data-ibxp-popup="true" data-ibxp-multi-select="false">
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="one">One</div>
				<div data-ibx-type="ibxSelectCheckItem" data-ibxp-user-value="two">Two</div>
				<div data-ibx-type="ibxSelectRadioItem" data-ibxp-user-value="three">Three</div>
			</div>

			<div class="select" data-ibx-type="ibxSelect" data-ibxp-popup="true" data-ibxp-multi-select="false" data-ibxp-readonly="true">
					<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="one">One</div>
					<div data-ibx-type="ibxSelectCheckItem" data-ibxp-user-value="two">Two</div>
					<div data-ibx-type="ibxSelectRadioItem" data-ibxp-user-value="three">Three</div>
			</div>

			<div class="select" data-ibx-type="ibxSelect" data-ibxp-popup="true" data-ibxp-multi-select="true">
					<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="one">One</div>
					<div data-ibx-type="ibxSelectCheckItem" data-ibxp-user-value="two">Two</div>
					<div data-ibx-type="ibxSelectRadioItem" data-ibxp-user-value="three">Three</div>
			</div>

			<div class="select" data-ibx-type="ibxSelect" data-ibxp-popup="false" data-ibxp-multi-select="false">
					<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="one">One</div>
					<div data-ibx-type="ibxSelectCheckItem" data-ibxp-user-value="two">Two</div>
					<div data-ibx-type="ibxSelectRadioItem" data-ibxp-user-value="three">Three</div>
			</div>

			<div class="select" data-ibx-type="ibxSelect" data-ibxp-popup="false" data-ibxp-multi-select="false" data-ibxp-readonly="true">
					<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="one">One</div>
					<div data-ibx-type="ibxSelectCheckItem" data-ibxp-user-value="two">Two</div>
					<div data-ibx-type="ibxSelectRadioItem" data-ibxp-user-value="three">Three</div>
			</div>

			<div class="select" data-ibx-type="ibxSelect" data-ibxp-popup="false" data-ibxp-multi-select="true">
					<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="one">One</div>
					<div data-ibx-type="ibxSelectCheckItem" data-ibxp-user-value="two">Two</div>
					<div data-ibx-type="ibxSelectRadioItem" data-ibxp-user-value="three">Three</div>
			</div>

			
		</div>

		<div data-ibx-type="ibxHBox">
			<div class="select" data-ibx-type="ibxSelectPaged" data-ibxp-popup="true" data-ibxp-multi-select="true" data-ibxp-enable-paging="true" data-ibxp-search="true" data-ibxp-selection-controls="true" data-ibxp-enable-paging-trigger="1" data-ibxp-page-size="3">
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="one">One</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="two">Two</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="three">Three</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="four">Four</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="five">Five</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="six">Six</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="seven">Seven</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="eight">Eight</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="nine">Nine</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="ten">Ten</div>
			</div>

			<div class="select" data-ibx-type="ibxSelectPaged" data-ibxp-popup="false" data-ibxp-multi-select="true" data-ibxp-search="true" data-ibxp-selection-controls="true" data-ibxp-enable-paging-trigger="1" data-ibxp-page-size="3">
					<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="one">One</div>
					<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="two">Two</div>
					<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="three">Three</div>
					<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="four">Four</div>
					<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="five">Five</div>
					<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="six">Six</div>
					<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="seven">Seven</div>
					<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="eight">Eight</div>
					<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="nine">Nine</div>
					<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="ten">Ten</div>
				</div>
		</div>

		<div data-ibx-type="ibxHBox">
				<div class="list" data-ibx-type="ibxSelectItemList" data-ibxp-multi-select="true">
					<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="one">One</div>
					<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="two">Two</div>
					<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="three">Three</div>
					<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="four">Four</div>
					<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="five">Five</div>
					<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="six">Six</div>
					<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="seven">Seven</div>
					<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="eight">Eight</div>
					<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="nine">Nine</div>
					<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="ten">Ten</div>
				</div>
	
				<div class="list" data-ibx-type="ibxSelectItemListPaged" data-ibxp-multi-select="true" data-ibxp-search="true" data-ibxp-selection-controls="true" data-ibxp-enable-paging-trigger="1" data-ibxp-page-size="3">
						<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="one">One</div>
						<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="two">Two</div>
						<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="three">Three</div>
						<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="four">Four</div>
						<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="five">Five</div>
						<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="six">Six</div>
						<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="seven">Seven</div>
						<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="eight">Eight</div>
						<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="nine">Nine</div>
						<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="ten">Ten</div>
					</div>
			</div>

		-->
			
	</body>
</html>
