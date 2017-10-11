<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision$:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>IBX test</title>
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
				var menu = $(".test-menu");
				for(var i = 0; i < 10; ++i)
				{
					var item = $("<div>").ibxMenuItem({"labelOptions":{"text": "Menu Item " + i}});
					//var item = $("<div class='ibx-menu-item'>").ibxLabel({"text": "Menu Item " + i});
					menu.ibxWidget("add", item, null, null, false);
				}
				menu.ibxWidget("refresh");

				$(".btn").on("click", function(e)
				{
					$(".dlg").ibxWidget("open");
				});

				$(".parent").on("focusin", function(e)
				{
				});
				$("body").on("ibx_widgetblur", function(e)
				{
				});
			}, null, true);
		</script>
		<style type="text/css">
			.main-box
			{
				position:abso8lute;
				left:0px;
				top:0px;
				right:0px;
				bottom:0px;
			}
			.test-frame
			{
				flex:1 1 auto;
				align-self:stretch;
			}

			.parent-key-root
			{
				height:100px;
				border:1px solid black;
			}

			.child
			{
				border:1px solid red;
			}

			.child-key-root
			{
				height:50px;
				border:1px solid lime;
			}

			.dlg
			{
				width:400px;
				height:300px;
			}
			.dlg-ctl-label
			{
				margin:10px 0px 2px 0px;
			}

			.txt-body
			{
				flex:1 1 auto;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="test" tabIndex="0" data-ibx-type="ibxMenuButton">File
			<div data-ibx-type="ibxMenu">
				<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyph":"fiber_new", "glyphClasses":"material-icons"}'>New</div>
				<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyph":"open_in_new", "glyphClasses":"material-icons"}'>Open...</div>
				<div data-ibx-type="ibxMenuSeparator"></div>
				<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyph":"save", "glyphClasses":"material-icons"}'>Save</div>
				<div data-ibx-type="ibxMenuItem">Save As...</div>
				<div data-ibx-type="ibxMenuSeparator"></div>
				<div data-ibx-type="ibxMenuItem" data-ibxp-label-options='{"glyph":"exit_to_app", "glyphClasses":"material-icons"}'>Exit</div>
			</div>
		</div>

		<div tabIndex="0" data-ibx-type="ibxWidget" data-ibxp-nav-key-root="true" data-ibxp-nav-key-dir="both">
			<div tabIndex="-1" data-ibx-type="ibxCheckBoxSimple">Check 1</div>
			<div tabIndex="-1" data-ibx-type="ibxCheckBoxSimple">Check 2</div>
			<div tabIndex="-1" data-ibx-type="ibxCheckBoxSimple">Check 3</div>
		</div>
		<div tabIndex="0" data-ibx-type="ibxWidget" data-ibxp-nav-key-root="true" data-ibxp-nav-key-dir="both">
			<div data-ibx-type="ibxRadioGroup" data-ibxp-name="rgTest"></div>
			<div tabIndex="-1" data-ibx-type="ibxRadioButtonSimple" data-ibxp-group="rgTest">Radio 1</div>
			<div tabIndex="-1" data-ibx-type="ibxRadioButtonSimple" data-ibxp-group="rgTest">Radio 2</div>
			<div tabIndex="-1" data-ibx-type="ibxRadioButtonSimple" data-ibxp-group="rgTest">Radio 3</div>
		</div>

		<div id="txtFieldLabel" data-ibx-type="ibxLabel">Text Field Label:</div>
		<div tabIndex="0" data-ibxp-disabled="false" data-ibx-type="ibxTextField" data-ibxp-aria.labelled-by="txtFieldLabel"></div>
		
		<div id="txtAreaLabel" data-ibx-type="ibxLabel">Text Area Label:</div>
		<div tabIndex="0" data-ibxp-disabled="false" data-ibx-type="ibxTextArea" data-ibx-type="ibxTextField" data-ibxp-aria.labelled-by="txtAreaLabel"></div>

		<div class="btn" tabIndex="0" data-ibx-type="ibxButton">Dialog</div>
		<div class="dlg" data-ibx-type="ibxDialog" data-ibxp-destroy-on-close="false" data-ibxp-auto-size="false">
			<div id="txtTitleLabel" class="dlg-ctl-label" data-ibx-type="ibxLabel">Enter Title:</div>
			<div tabindex="0" class="txt-title" data-ibx-type="ibxTextField" data-ibxp-placeholder="Enter one line of text" data-ibxp-aria.labelled-By="txtTitleLabel" data-ibxp-default-focused="true"></div>
			<div id="txtBodyLabel" class="dlg-ctl-label" data-ibx-type="ibxLabel">Enter Text Here:</div>
			<div tabindex="0" class="txt-body" data-ibx-type="ibxTextArea"  data-ibxp-placeholder="Enter multiple line of text" data-ibxp-aria.labelled-by="txtBodyLabel" data-ibxp-aria.described-by="txtBodyLabel"></div>
		</div>
	</body>
</html>
