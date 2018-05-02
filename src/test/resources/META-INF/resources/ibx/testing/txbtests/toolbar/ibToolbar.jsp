<!DOCTYPE html>
<html lang="en">
<head>
	<!--include this script...will boot ibx into the running state-->
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
				var ibToolbar = $("<div>").ibToolbar();
				$(".main-toolbar").append(ibToolbar); 	
			}, ["/ibi_apps/ibx/testing/txbtests/toolbar/ibToolbar.xml"], true);	
	</script>
</head>

<body class="ibx-root">
<div class="main-tool" data-ibx-type="ibxVBox" class="main-box" data-ibxp-align="stretch">
	<div class="main-toolbar" data-ibx-type="ibxHBox" data-ibxp-align="stretch"></div>
	<div class="main-box" data-ibx-type="ibxHBox" data-ibxp-align="stretch">Content Area</div>
</div>
</body>
</html>
