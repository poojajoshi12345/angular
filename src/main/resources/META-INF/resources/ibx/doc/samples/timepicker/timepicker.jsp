<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Time Control Test Page</title>
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
			<jsp:include page="/WEB-INF/jsp/ibx/ibxInit.jsp" flush="false" />
			
			var packages = [
            
			];
				
			ibx(function()
			{			


				// $(".change-time-mode-btn").on("click", function(event){
				// 	var value = $(".ibx-time-picker").ibxWidget("option", "militaryTime");
				// 	$(".ibx-time-picker").ibxWidget("option", "militaryTime", !value);
				// });


				// $(".ibx-time-picker").on("ibx_change", function(event){
				// 	console.log(event);
				// });

			}, packages, true);
		</script>

		<style type="text/css">
			.change-time-mode-btn{
				margin-top: 20px;
			}

			body{
				font-size: 20px;
			}
		</style>
	</head>
	
	<body class="ibx-root">
		<div data-ibx-type="ibxVBox">
				<!-- <div class="time-picker-demo" data-ibx-type="ibxTimePicker" ></div> -->
				<div class="time-picker-demo" data-ibx-type="ibxTimePicker" data-ibxp-hour="7" data-ibxp-minute="6" data-ibxp-second="0" data-ibxp-meridian="PM"></div>

				<div data-ibx-type="ibxHbox">
					<!-- <div class="change-time-mode-btn" data-ibx-type="ibxButton">Change Time Mode</div> -->
					
				</div>
		</div>

	</body>	
</html>