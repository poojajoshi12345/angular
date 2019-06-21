<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision: 1.1 $:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>ibx iframe sample</title>
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
				$(".txt-address").on("ibx_change", function(e, txt)
				{
					var url = $(this).ibxWidget("option", "text");
					if(url)
					{
						if(!(/^http:\/\//).test(url))
							url = "http://" + url;
						$(".frame-out").ibxWidget("option", "src", url);
					}
				});

				$(".btn-refresh").on("click", function(e)
				{
					var txt = $(".txt-address");
					txt.trigger("ibx_change", [txt]); 
				});
			}, true);
		</script>

		<style type="text/css">
			.grid-outer
			{
				position:absolute;
				left:0px;
				top:0px;
				right:0px;
				bottom:0px;
				padding:15px;
			}

			.address-box
			{
				font-size:2em;
				margin-bottom:15px;
			}

			.btn-refresh
			{
				margin-right:10px;
			}
			.txt-address
			{
				flex:1 1 auto;
			}

			.frame-out
			{
				border:1px solid #ccc;
				xheight:400px;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="grid-outer" data-ibx-type="ibxGrid" data-ibxp-cols="1fr" data-ibxp-rows="4em 1fr">
			<div class="address-box" data-ibx-type="ibxHBox" data-ibxp-align="center" data-ibx-col="1" data-ibx-row="1/span 1">
				<div class="btn-refresh" data-ibx-type="ibxButton" title="Refresh" data-ibxp-glyph="refresh" data-ibxp-glyph-classes="material-icons"></div>
				<div class="txt-address" data-ibx-type="ibxTextField" data-ibxp-placeholder="Enter Address here (most sites won't load due to same origin)"></div>
			</div>
			<div class="frame-out" data-ibx-type="ibxIFrame" data-ibxp-auto-correct="false" data-ibxp-auto-capitalize="false" data-ibxp-src="./iframe_placeholder.jsp" data-ibx-col="1" data-ibx-row="2/span 2"></div>
		</div>
	</body>
</html>
