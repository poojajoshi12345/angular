<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision: 1.2 $:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>ibx calculator sample</title>
		<meta http-equiv="X-UA-Compatible" content="IE=EDGE" >
		<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="Expires" content="0" />
		<meta name="google" value="notranslate">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<Script src="<%=request.getContextPath()%>/ibx/resources/ibx.js" type="text/javascript"></script>
		
		<script type="text/javascript">
			<jsp:include page="/WEB-INF/jsp/global/wf_globals.jsp" flush="false" />

			ibx(function()
			{
				//hookup the buttons
				$(".show-calc").on("click", function(e)
				{
					var calc = ibx.resourceMgr.getResource(".sample-calculator");
					calc.appendTo("body").position({my:"left top", at:"right+10 top", of:".show-calc"});
				});
			}, [{"src":"./calculator_res.xml", "loadContext":"app"}], true);
		</script>

		<style type="text/css">
			.main-grid
			{
				width:600px;

				display:-ms-grid;
				display:grid;

				-ms-grid-columns:auto 1fr;
				grid-template-columns:auto 1fr;

				-ms-grid-rows:auto auto;
				grid-template-rows:auto auto;
			}
			.grid-cell
			{
				border:1px solid #ccc;
				box-shadow:3px 3px 5px 0 #aaa;
				margin:5px;
				align-self:center;
			}

			.show-calc
			{
				-ms-grid-column:1;
				-ms-grid-column-span:1;
				-ms-grid-column-align:stretch;
				-ms-grid-row:1;
				-ms-grid-row-span:1;
				-ms-grid-row-align:center;
			}
			.explanation-calc
			{
				-ms-grid-column:2;
				-ms-grid-column-span:1;
				-ms-grid-column-align:stretch;
				-ms-grid-row:1;
				-ms-grid-row-span:1;
				-ms-grid-row-align:center;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="main-grid">
			<div class="grid-cell show-calc" data-ibx-type="ibxButton" data-ibxp-glyph="apps" data-ibxp-text="New Calculator" data-ibxp-icon-position="top" data-ibxp-glyph-classes="material-icons"></div>
		</div>
	</body>
</html>
