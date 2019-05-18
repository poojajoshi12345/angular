<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision: 1.5 $:
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

					window.onkeydown = function(e) 
					{
						if (e.keyCode == 32) {
							e.preventDefault();
						}
					};						
			
			ibx(function()
			{



				var values = [];
				for (var i = 0; i < 150; i++)
					values.push({'display': 'Item' + i, 'value': 'item' + i});

				$(".autoheight").ibxWidget('values', values);
				$(".autoheight").ibxWidget('userValue', 'item10');

				for (var i = 0; i < 2000; i++)
					$(".autoheight2").ibxWidget('addControlItem', $("<div>").ibxSelectCheckItem({'text': 'Item' + i, 'userValue': 'item' + i}));
				$(".autoheight2").ibxWidget('userValue', 'item10');

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

				$(".cmd-focus").on("ibx_triggered", function (){
					$('.pop-top').focus();
				});

				$(".mygroup").ibxWidget('addControl', $('.rbutton1'));
				$(".mygroup").ibxWidget('addControl', $('.rbutton2'));
				$(".mygroup").ibxWidget('addControl', $('.rbutton3'));

			}, true);
		</script>

		<style type="text/css">
			.select, .list { margin: 10px; border: 1px solid red; padding: 10px;}
			.list2 { height: 300px; width:200px;}
			.list3 { height: 200px;}
			.middle-box{padding-top: 400px;}
		</style>
	</head>
	<body class="ibx-root">

		<div data-ibx-type="ibxButtonGroup" data-ibxp-group-selection="true">
			<div data-ibx-type="ibxRadioButton">One</div>
			<div data-ibx-type="ibxRadioButton">Two</div>
			<div data-ibx-type="ibxRadioButton">Three</div>
		</div>

	<div class="cmd-focus" data-ibx-type="ibxCommand" data-ibxp-id="commandFocus" data-ibxp-shortcut="Ctrl+C"></div>

		<div class="mygroup" data-ibx-type="ibxRadioGroup" data-ibxp-name="mygroup"></div>

		<div data-ibx-type="ibxHBox">
			<div class="rbutton1" data-ibx-type="ibxRadioButton" data-ibxp-user-value="one" data-ibxp-checked="true">One</div>
			<div class="rbutton2" data-ibx-type="ibxRadioButton" data-ibxp-user-value="two" >Two</div>
			<div class="rbutton3" data-ibx-type="ibxRadioButton" data-ibxp-user-value="three" >Three</div>
		</div>

	<div data-ibx-type="ibxHBox">
			<div class="select first-list" tabindex="0" data-ibx-type="ibxSelectPaged" data-ibxp-popup="true" data-ibxp-multi-select="true" data-ibxp-enable-paging="true" data-ibxp-search="false" data-ibxp-selection-controls="false" data-ibxp-enable-paging-trigger="200" data-ibxp-page-size="3">
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
			<div class="select" tabindex="0" data-ibx-type="ibxSelect" data-ibxp-popup="true" data-ibxp-multi-select="false">
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="one">One</div>
				<div data-ibx-type="ibxSelectCheckItem" data-ibxp-user-value="two">Two</div>
				<div data-ibx-type="ibxSelectRadioItem" data-ibxp-user-value="three">Three</div>
			</div>

			<div class="select" tabindex="0" data-ibx-type="ibxSelect" data-ibxp-popup="false" data-ibxp-multi-select="false" data-ibxp-readonly="true">
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="one">One</div>
				<div data-ibx-type="ibxSelectCheckItem" data-ibxp-user-value="two">Two</div>
				<div data-ibx-type="ibxSelectRadioItem" data-ibxp-user-value="three">Three</div>
			</div>
				<div class="select" tabindex="0" data-ibx-type="ibxSelect" data-ibxp-popup="false" data-ibxp-multi-select="true">
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="one">One</div>
				<div data-ibx-type="ibxSelectCheckItem" data-ibxp-user-value="two">Two</div>
				<div data-ibx-type="ibxSelectRadioItem" data-ibxp-user-value="three">Three</div>
			</div>
	
			<select>
				<option>One</option>
				<option>Two</option>
				<option selected>Three</option>
				<option>Four</option>
				<option>Five</option>
			</select>

			<div class="list list3" tabindex="0" data-ibx-type="ibxSelectItemList" data-ibxp-multi-select="true">
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="one">1</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="two">2</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="three">3</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="four">4</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="five">5</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="six">6</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="seven">7</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="eight">8</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="nine">9</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="ten">10</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="one">11</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="two">12</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="three">13</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="four">14</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="five">15</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="six">16</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="seven">17</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="eight">18</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="nine">19</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="ten">20</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="one">21</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="two">22</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="three">23</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="four">24</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="five">25</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="six">26</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="seven">27</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="eight">28</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="nine">29</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="ten">30</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="ten">120</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="one">121</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="two">122</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="three">123</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="four">124</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="five">125</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="six">126</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="seven">127</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="eight">128</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="nine">129</div>
				<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="ten">130</div>
			</div>
			
			<div class="list list2" tabindex="0" data-ibx-type="ibxSelectItemListPaged" data-ibxp-multi-select="true" data-ibxp-search="true" data-ibxp-selection-controls="true" data-ibxp-enable-paging-trigger="1" data-ibxp-page-size="3">
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

		<div class="middle-box" data-ibx-type="ibxHBox">


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

			<div class="select autoheight" data-ibx-type="ibxSelectPaged" data-ibxp-popup="true" data-ibxp-multi-select="true">
			</div>
			<div class="select autoheight2" data-ibx-type="ibxSelect" data-ibxp-popup="true" data-ibxp-multi-select="true">
			</div>



			
		</div>

		<div data-ibx-type="ibxHBox">

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

	</body>
</html>

