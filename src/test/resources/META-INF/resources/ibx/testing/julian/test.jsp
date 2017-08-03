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

				$(".btn-test").on("click", function(e)
				{
					$.ibi.ibxWidget.noRefresh = true;
					var select = $(".test-select").data("ibxWidget");
					select.children().detach();
					var date = new Date();
					for(var i = 0; i < 500; ++i)
					{
						var item = $("<div>").prop("id", "selectItem "+i).ibxSelectItem({text:"Item" + i, glyph:"face", "glyphClasses":"material-icons"});
						select.add(item);
					}
					$.ibi.ibxWidget.noRefresh = false;
					select.children().ibxWidget("refresh");
					console.log(new Date() - date);
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

			.drop-target
			{
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
			<div class="menu-item" data-ibx-type="ibxMenuItem">I"m a menu Item</div>
			<div class="btn-test" data-ibx-type="ibxButton">Test</div>
			<div class="test-select" data-ibx-type="ibxSelect">
				<div class="test-select-item" data-ibx-type="ibxSelectItem" data-ibxp-text="FOOBAR"></div>
			</div>
			<div class="drag-source" data-ibx-type="ibxLabel" data-ibxp-draggable="true">Drag Here!</div>
			<div class="drop-target" data-ibx-type="ibxLabel" data-ibxp-droppable="true" data-ibxp-file-upload-ajax-info.async="false" data-ibxp-file-upload-ajax-info.url="xxx.jsp">Drop Here!</div>
			<!--
			-->
		</div>
	</body>
</html>

