﻿<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
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
						Ibfs.ibfs.listItems("IBFS:/WFC/Repository/", {asJSON:true});
					});
				});


				window.addEventListener("ibfs_list_items", function(e)
				{
					var csl = $(".test-carousel");
					csl.ibxWidget("children").remove();

					var overlays =
					[
						{"position":"bl", "icon":"./ren1.png"},
						{"position":"tr", "glyph":"face", "glyphClasses":"material-icons", "icon":""}
					];
					var items = e.data.result;
					for(var i = 0; i < items.length; ++i)
					{
						var item = items[i];
						var qItem = $(sformat("<div id='tile{3}' class='test-tile' title='{1}'>{2}</div>", item.fullPath, item.name, i));

						//overlays[0].glyph = (i%2) ? "face" : "accessible";
						var itemOptions =
						{
							"iconPosition":"top",
							"icon":item.thumbPath,
							"align":"center",
							"justify":"center",
							"overlays":overlays,
						};
						qItem.ibxLabel(itemOptions);
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

				$(".test-bucket").ibxWidget("option",
				{
					"align":"center",
					"focusRoot":true,
					"navKeyRoot":false,
					"navKeyAutoFocus":true,
					"navKeyKeys":
					{
						"hprev":"CTRL+LEFT",
						"hnext":"CTRL+RIGHT",
						"vprev":"CTRL+UP",
						"vnext":"CTRL+DOWN",
					}
				});

				$(".test-btn2").on("click", function(e)
				{
					$(".test-popup").ibxWidget("open");
				});

				$(".dlg-button").on("click", function(e)
				{
					var options = 
					{
						type:"std warning",
						buttons:"okcancel",
						messageOptions:{text:"Are you absolutely sure you want to continue down this path?"}
					};
					var dlg = $.ibi.ibxDialog.createMessageDialog(options);
					dlg.ibxDialog("open").on("ibx_close", function(e)
					{
						$(".test-slider").focus();
						console.log(e.type);
					});

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
				overflow:hidden;
			}
			.test-tile:hover
			{
				background-color:#eee;
			}
			.test-tile > .ibx-label-glyph
			{
				flex:1 1 auto;
				align-self:stretch;
			}

			.test-edit
			{
				width:200px;
			}

			.test-button
			{
				margin:5px;
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

			.test-bucket .ibx-widget
			{
				margin:5px;
			}
			.bucket-select
			{
				width:150px;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="sample" data-ibx-type="ibxWidget" data-ibxp-xxx="value" data-ibx-options="{'option1':'one', 'option2':'two'}"></div>

		<div class="cmd-clear" data-ibx-type="ibxCommand" data-ibxp-shortcut="CTRL+C"></div>
		<div class="cmd-files" data-ibx-type="ibxCommand" data-ibxp-shortcut="CTRL+F"></div>
		<div id="mainBox" class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
		
			<div tabindex="0" class="test-bucket" data-ibx-type="ibxHBox">
				<div tabindex="0" class="bucket-button" data-ibx-type="ibxButton">Button1</div>
				<div tabindex="0" class="bucket-select" data-ibx-type="ibxSelect" data-ibxp-list-options.multiSelect="true">
					<div data-ibx-type="ibxSelectItem">Select Item1</div>
					<div data-ibx-type="ibxSelectItem">Select Item2</div>
					<div data-ibx-type="ibxSelectItem">Select Item3</div>
				</div>
				<div tabindex="0" class="bucket-select" data-ibx-type="ibxSelect" data-ibxp-readonly="true">
					<div data-ibx-type="ibxSelectItem">Select Item</div>
					<div data-ibx-type="ibxSelectItem">Select Item</div>
					<div data-ibx-type="ibxSelectItem">Select Item</div>
				</div>
				<div tabindex="0" class="bucket-button" data-ibx-type="ibxButton">Button2</div>
			</div>		
		
			<div id="testBtn1" class="ibx-button test-button" tabindex="0" data-ibx-type="ibxMenuButton">Test Button 1
				<div data-ibx-type="ibxMenu">
					<div data-ibx-type="ibxMenuItem">Menu Item</div>
					<div data-ibx-type="ibxMenuItem">Menu Item</div>
					<div data-ibx-type="ibxMenuItem">Menu Item</div>
				</div>
			</div>
			<div id="testEdit" class="test-edit" tabindex="0" data-ibx-type="ibxTextField">Test Text Field</div>
			<div id="testCarousel" class="test-carousel" tabindex="0" data-ibx-type="ibxHCarousel" data-ibx-options="{navKeyRoot:true, scrollType:'integral', aria:{role:'region', keyshortcuts:'Control+F', label:'I B F S Files List'}}"></div>
			<div id="testBtn2" class="test-button test-btn2" tabindex="0" data-ibx-type="ibxButton">Test Button 2</div>
		</div>

		<div class="test-popup" data-ibx-type="ibxPopup" data-ibxp-auto-close="false" data-ibxp-escape-to-close="true" data-ibxp-destroy-on-close="false" data-ibxp-opaque="false">
			<div class="test-popup-box" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
				<div class="test-slider" tabIndex="0" data-ibx-type="ibxHSlider" data-ibx-options="{value:25, minTextPos:'center', maxTextPos:'center'}"></div>
				<div class="test-slider" tabindex="0" data-ibx-type="ibxHRange" data-ibx-options="{value:25, value2:75, minTextPos:'center', maxTextPos:'center'}"></div>
				<div class="textfield" tabIndex="0" data-ibx-type="ibxTextField">Text field</div>
				<div class="ibx-button dlg-button" tabindex="0" data-ibx-type="ibxButtonSimple" data-ibxp-justify="center">Dialog</div>
				<div class="ibx-button test-button" tabindex="0" data-ibx-type="ibxMenuButton" data-ibxp-justify="center">Menu Button
					<div data-ibx-type="ibxMenu">
						<div data-ibx-type="ibxMenuItem">Menu Item</div>
						<div data-ibx-type="ibxMenuItem">Menu Item</div>
						<div data-ibx-type="ibxMenuItem">Menu Item</div>
					</div>
				</div>
				<div class="textArea" tabIndex="0" data-ibx-type="ibxTextArea">Text area</div>
			</div>
		</div>
	</body>
</html>
