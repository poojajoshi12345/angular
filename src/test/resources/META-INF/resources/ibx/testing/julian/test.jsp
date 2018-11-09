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
				$(".del-command").on("ibx_triggered", function(e)
				{
					console.log(e.type);
					e.preventDefault();
					e.stopPropagation();
				});

				var options = 
				{
					"type":"inline",
					"changeYear":true,
					"changeMonth":true,

				}

				$(".date-1-btn").on("click", function(e)
				{
					var cal = $("<div>").ibxDatePicker(options).on("ibx_change", function(e, data)
					{
						$(".date-1-val").ibxWidget("option", "text", data.date);
					});
					var pop = $("<div>").ibxPopup({position:{my:"left top", at:"left bottom", of:e.currentTarget}});
					pop.append(cal).ibxWidget("open");
				});

				$(".date-2-btn").on("click", function(e)
				{
					var cal = $("<div>").ibxDatePicker(options).on("ibx_change", function(e, data)
					{
						$(".date-2-val").ibxWidget("option", "text", data.date);
					});
					var pop = $("<div>").ibxPopup({position:{my:"left top", at:"left bottom", of:e.currentTarget}});
					pop.append(cal).ibxWidget("open");
				});




			}, [{"src":"./test_res_bundle.xml", "loadContext":"app"}], true);
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
			.date-box
			{
				margin:2px;
			}
			.date-value
			{
				border:1px solid #ccc;
				margin:2px;
				padding:2px;
				width:100px;
			}
			.date-btn
			{
				font-size:1.5em;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="del-command" data-ibx-type="ibxCommand" data-ibxp-id="cmdDelete" data-ibxp-shortcut="CTRL+SHIFT+DEL"></div>
		<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center" data-ibxp-command="cmdDelete">
			<div class="test" data-ibx-type="ibxButton">Test</div>
			<div class="date-range" data-ibx-type="ibxDateRange"></div>
		</div>
	</body>
</html>
