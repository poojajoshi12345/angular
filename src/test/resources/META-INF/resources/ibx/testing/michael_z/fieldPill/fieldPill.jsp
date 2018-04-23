<!DOCTYPE html>
<html lang="en">
	<head>
		<!--include this script...will boot ibx into the running state-->
		<Script src="<%=request.getContextPath()%>/ibx/resources/ibx.js" type="text/javascript"></script>
		<script type="text/javascript">
			<jsp:include page="/WEB-INF/jsp/global/wf_globals.jsp" flush="false" />
			
			ibx(function()
			{
			
				  	var fieldPill = $("<div>").fieldPill();
				  	$(".main-box").append(fieldPill);	
				  			
				  	fieldPill.ibxWidget("option", "fieldName", "CAR");
			
			}, ["/ibi_apps/ibx/testing/michael_z/fieldPill/fieldPillRes.xml"], true);
		</script>

	</head>
	
	<body class="ibx-root">
		<div data-ibx-type="ibxHBox" class='main-box'></div>
	</body>
</html>
