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

			function FizzBuzz()
			{
			}
			var _p = FizzBuzz.prototype = new Object();
			FizzBuzz.STR_FIZZ		= "Fizz";
			FizzBuzz.STR_BUZZ		= "Buzz";
			FizzBuzz.STR_FIZZ_BUZZ	= "FizzBuzz";

			_p.m1 = 3;
			_p.m2 = 5;
			_p.nMax = 100;
			_p.play = function()
			{
				for(var i = 0; i < this.nMax; ++i)
				{
					var strOut = "";
					var d1 = !(i % this.m1);
					var d2 = !(i % this.m2);
					if(d1 && d2)
						strOut = FizzBuzz.STR_FIZZ_BUZZ;
					else
					if(d1)
						strOut = FizzBuzz.STR_FIZZ;
					else
					if(d2)
						strOut = FizzBuzz.STR_BUZZ;

					console.log(i + "\t" + strOut);
				}
			};

			ibx(function()
			{
				$(".drop-target").on("ibx_dragover ibx_dragleave ibx_drop", function(e)
				{
					if(e.type == "ibx_drop")
					{
						$(this).ibxWidget("option", "fileUploadAjaxInfo", {"complete":function(xhr, status)
						{
							console.log(xhr.responseText);
						}});
					}
					else
						e.preventDefault();
				});

				$(".test-btn").on("click", function(e)
				{
					$.ibi.ibxWidget.noRefresh = true;
					var widget = $(".test-widget").data("ibxWidget");
					widget.children().detach();
					var date = new Date();
					for(var i = 0; i < 1; ++i)
					{
						var item = $("<div>").prop("id", "item_"+i).ibxMenuItem({"labelOptions":{text:"Item" + i, glyph:"face", "glyphClasses":"material-icons"}});
						widget.add(item);
					}
					$.ibi.ibxWidget.noRefresh = false;
					widget.children().ibxWidget("refresh");
					console.log("TEST WIDGET", new Date() - date);

					/*
					$.ibi.ibxWidget.noRefresh = true;
					var select = $(".test-select-groups").data("ibxWidget");
					var group = select._group1.data("ibxWidget");
					group.remove();
					var date = new Date();
					for(var i = 0; i < 500; ++i)
					{
						var item = $("<div>").prop("id", "selectItem "+i).ibxSelectItem({text:"Item" + i, glyph:"face", "glyphClasses":"material-icons"});
						group.add(item);
					}
					$.ibi.ibxWidget.noRefresh = false;
					group.children().ibxWidget("refresh");
					console.log("GROUPS", new Date() - date);
					*/
				});

				$(".dlg-btn").on("click", function(e)
				{
					var dlg = $(".test-dlg");
					dlg.ibxWidget("open");
				});
			}, [{"src":"./test_res_bundle.xml", "loadContext":"app"}], true);
		</script>
		<style type="text/css">
			html, body
			{
				margin:0px;
				height:100%;
				width:100%;
				position:relative;
			}
			.main-box
			{
				position:absolute;
				left:0px;
				top:0px;
				right:0px;
				bottom:0px;
				border:2px solid red;
				padding:5px;
			}
			.main-box *
			{
				flex:0 0 auto;
			}
			.test-btn, .test-select
			{
				flex:0 0 auto;
			}
			.test-widget
			{
				flex: 1 1 auto;
				border:1px solid lime;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="center">
			<div class="split-button" data-ibx-type="ibxHSplitMenuButton" data-ibxp-btn-options="{glyphClasses:'fa fa-18 fa-cog'}">
				<div data-ibx-type="ibxMenu">
					<div data-ibx-type="ibxMenuItem">Menu Item</div>
					<div data-ibx-type="ibxMenuItem">Menu Item</div>
					<div data-ibx-type="ibxMenuItem">Menu Item</div>
				</div>
			</div>
			<div class="split-button" data-ibx-type="ibxVSplitMenuButton" data-ibxp-btn-options="{glyphClasses:'fa fa-18 fa-cog'}">
				<div data-ibx-type="ibxMenu">
					<div data-ibx-type="ibxMenuItem">Menu Item</div>
					<div data-ibx-type="ibxMenuItem">Menu Item</div>
					<div data-ibx-type="ibxMenuItem">Menu Item</div>
				</div>
			</div>
			<div class="dlg-btn" data-ibx-type="ibxButton">Dialog</div>
			<div class="test-btn" data-ibx-type="ibxButton">Test</div>
			<div class="test-select" data-ibx-type="ibxSelect"></div>
			<div class="test-widget" data-ibx-type="ibxWidget">This is a test</div>		
		</div>

		<div class="test-dlg" data-ibx-type="ibxDialog" data-ibxp-caption-options="{text:'Test Dialog'}">
			<div style="width:300px;height:50px" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
				<div data-ibx-type="ibxMenuButton">
					Menu
					<div data-ibx-type="ibxMenu" data-ibxp-multi-select="true">
						<div data-ibx-type="ibxMenuItem">Menu Item</div>
						<div data-ibx-type="ibxMenuItem">Menu Item</div>
						<div data-ibx-type="ibxMenuItem">Menu Item</div>
						<div data-ibx-type="ibxMenuItem">Menu Item</div>
					</div>
				</div>
			</div>
		</div>

	</body>
</html>

