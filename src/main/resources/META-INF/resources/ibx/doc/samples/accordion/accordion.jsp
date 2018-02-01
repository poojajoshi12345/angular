<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision$:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>ibx accordion sample</title>
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
				$(".prop-select").on("ibx_change", function(e)
				{
					var select = $(e.target);
					var value = ibx.coercePropVal(select.ibxWidget("userValue"));
					var page = $(select.data("accPage"));
					var option = "";
					if(select.data("btnAutoClose"))
						option = "autoClose";
					else
					if(select.data("btnVis"))
						option = "btnShow";
					else
					if(select.data("btnPos"))
						option = "btnPosition";
					page.ibxWidget("option", option, value);
				});

			}, true);

			function foo()
			{
				return "bar";
			};
		</script>

		<style type="text/css">
			.acc-pane
			{
			}

			.prop-box
			{
				padding:10px;
			}
			.prop-box > div:not(:last-child)
			{
				margin-right:5px;
			}

			.prop-label
			{
			}

			.prop-select
			{
				width:8em;
			}

			.page-content
			{
				height:100px;
				margin:10px;
				border:1px solid #ccc;
				background-color:#f8f8f8;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="test-acc-pane" data-ibx-type="ibxVAccordionPane" data-ibxp-inline="true">
			<div class="acc-page1" data-ibx-type="ibxAccordionPage" data-ibxp-selected="false">
				Page 1
				<div class="prop-box" data-ibx-type="ibxHBox" data-ibxp-align="center">
					<div class="prop-label" data-ibx-type="ibxLabel">Auto Close:</div>
					<div class="prop-select" data-ibx-type="ibxSelect" data-ibxp-readonly="true" data-btn-auto-close="true" data-acc-page=".acc-page1">
						<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="true" data-ibxp-selected="true">On</div>
						<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="false">Off</div>
					</div>
					<div class="prop-label" data-ibx-type="ibxLabel" data-ibxp-text="Button Visible:"></div>
					<div class="prop-select" data-ibx-type="ibxSelect" data-ibxp-readonly="true" data-btn-vis="true" data-acc-page=".acc-page1">
						<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="true" data-ibxp-selected="true">Visible</div>
						<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="false">Hidden</div>
					</div>
					<div class="prop-label" data-ibx-type="ibxLabel" data-ibxp-text="Button Position:"></div>
					<div class="prop-select" data-ibx-type="ibxSelect" data-ibxp-readonly="true" data-btn-pos="true" data-acc-page=".acc-page1">
						<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="start" data-ibxp-selected="true">Top</div>
						<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="end">Bottom</div>
					</div>
				</div>
				<div class="page-content" data-ibx-type="ibxLabel" data-ibxp-inline="false" data-ibxp-justify="center" data-ibxp-align="center">
					Accordion Page Content
				</div>
			</div>
			<div class="acc-page2" data-ibx-type="ibxAccordionPage" data-ibxp-selected="true">
				Page 2
				<div class="prop-box" data-ibx-type="ibxHBox" data-ibxp-align="center">
					<div class="prop-label" data-ibx-type="ibxLabel">Auto Close:</div>
					<div class="prop-select" data-ibx-type="ibxSelect" data-ibxp-readonly="true" data-btn-auto-close="true" data-acc-page=".acc-page2">
						<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="true" data-ibxp-selected="true">On</div>
						<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="false">Off</div>
					</div>
					<div class="prop-label" data-ibx-type="ibxLabel" data-ibxp-text="Button Visible:"></div>
					<div class="prop-select" data-ibx-type="ibxSelect" data-ibxp-readonly="true" data-btn-vis="true" data-acc-page=".acc-page2">
						<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="true" data-ibxp-selected="true">Visible</div>
						<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="false">Hidden</div>
					</div>
					<div class="prop-label" data-ibx-type="ibxLabel" data-ibxp-text="Button Position:"></div>
					<div class="prop-select" data-ibx-type="ibxSelect" data-ibxp-readonly="true" data-btn-pos="true" data-acc-page=".acc-page2">
						<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="start" data-ibxp-selected="true">Top</div>
						<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="end">Bottom</div>
					</div>
				</div>
				<div class="page-content" data-ibx-type="ibxLabel" data-ibxp-inline="false" data-ibxp-justify="center" data-ibxp-align="center">
					Accordion Page Content
				</div>
			</div>
			<div class="acc-page3" data-ibx-type="ibxAccordionPage">
				Page 3
				<div class="prop-box" data-ibx-type="ibxHBox" data-ibxp-align="center">
					<div class="prop-label" data-ibx-type="ibxLabel">Auto Close:</div>
					<div class="prop-select" data-ibx-type="ibxSelect" data-ibxp-readonly="true" data-btn-auto-close="true" data-acc-page=".acc-page3">
						<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="true" data-ibxp-selected="true">On</div>
						<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="false">Off</div>
					</div>
					<div class="prop-label" data-ibx-type="ibxLabel" data-ibxp-text="Button Visible:"></div>
					<div class="prop-select" data-ibx-type="ibxSelect" data-ibxp-readonly="true" data-btn-vis="true" data-acc-page=".acc-page3">
						<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="true" data-ibxp-selected="true">Visible</div>
						<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="false">Hidden</div>
					</div>
					<div class="prop-label" data-ibx-type="ibxLabel" data-ibxp-text="Button Position:"></div>
					<div class="prop-select" data-ibx-type="ibxSelect" data-ibxp-readonly="true" data-btn-pos="true" data-acc-page=".acc-page3">
						<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="start" data-ibxp-selected="true">Top</div>
						<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="end">Bottom</div>
					</div>
				</div>
				<div class="page-content" data-ibx-type="ibxLabel" data-ibxp-inline="false" data-ibxp-justify="center" data-ibxp-align="center">
					Accordion Page Content
				</div>
			</div>
			<div class="acc-page4" data-ibx-type="ibxAccordionPage">
				Page 4
				<div class="prop-box" data-ibx-type="ibxHBox" data-ibxp-align="center">
					<div class="prop-label" data-ibx-type="ibxLabel">Auto Close:</div>
					<div class="prop-select" data-ibx-type="ibxSelect" data-ibxp-readonly="true" data-btn-auto-close="true" data-acc-page=".acc-page4">
						<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="true" data-ibxp-selected="true">On</div>
						<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="false">Off</div>
					</div>
					<div class="prop-label" data-ibx-type="ibxLabel" data-ibxp-text="Button Visible:"></div>
					<div class="prop-select" data-ibx-type="ibxSelect" data-ibxp-readonly="true" data-btn-vis="true" data-acc-page=".acc-page4">
						<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="true" data-ibxp-selected="true">Visible</div>
						<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="false">Hidden</div>
					</div>
					<div class="prop-label" data-ibx-type="ibxLabel" data-ibxp-text="Button Position:"></div>
					<div class="prop-select" data-ibx-type="ibxSelect" data-ibxp-readonly="true" data-btn-pos="true" data-acc-page=".acc-page4">
						<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="start" data-ibxp-selected="true">Top</div>
						<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="end">Bottom</div>
					</div>
				</div>
				<div class="page-content" data-ibx-type="ibxLabel" data-ibxp-inline="false" data-ibxp-justify="center" data-ibxp-align="center">
					Accordion Page Content
				</div>
			</div>
		</div>
	</body>
</html>