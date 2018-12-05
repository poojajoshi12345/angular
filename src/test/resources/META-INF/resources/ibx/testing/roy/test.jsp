<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved.
 $Revision$:
--%><%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved.
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
			$(".btn-change3d").on("click", function(e){
				var options = {
					basemap: 'satellite',
					type: "3d",
					zoom: {visible: true, position:"bottom-right"}, //top-left, top-right, bottom-left
					baseMapGallery: {visible: false, position: "top-right"}
				};
				//var map = $(".test-map").ibxWidget("option", "type", "3d");
				var map = $(".test-map").ibxWidget("option", options);
			});
			$(".btn-changeBaseMap").on("click", function(e){
				var options = {
					basemap: 'dark-gray-vector',
				};
				//var map = $(".test-map").ibxWidget("option", "type", "3d");
				var map = $(".test-map").ibxWidget("option", options);
			});



			}, [{"src":"../../ibxtools/mapping/resources/mapping_res.xml", "loadContext":"ibx"}], true);
		</script>
		<style type="text/css">
			html, body, .main-box
			{
				width:100%;
				height:100%;
				margin:0;
				box-sizing:border-box;
			}
			.test-map{
				width: 500px;
				height: 500px;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center" data-ibxp-command="cmdDelete">
			<div class="test-map" data-ibx-type="esriMap"></div>
			<div class="btn-change3d" data-ibx-type="ibxButton">Change to 3D</div>
			<div class="btn-changeBaseMap" data-ibx-type="ibxButton">Change to DarkGray</div>
		</div>
	</body>
</html>