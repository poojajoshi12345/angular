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
				
				$(".run-preview").on("click", function(e)
				{
					$(".main-box").ibxCollapsible("close");
					if(!($(".main-tool").hasClass('runner-box')))
						$(".main-tool").addClass('runner-box');
						
					$(".runner-box").css('visibility', 'visible');							
					$(".runner-box").css('top', '0');	
					$(".runner-box").css('left', '0');	
					$(".runner-box").ibxCollapsible("open");	
				});
					
				$(".float-run").on("click", function(e)
				{
					if($(".main-tool").hasClass('runner-box'))
						$(".main-tool").removeClass('runner-box');
					$(".main-box").ibxCollapsible("open");	
				});		
				
				$(".main-box").ibxCollapsible({autoClose:false, direction:"left", startCollapsed:false});
				$(".runner-box").ibxCollapsible({autoClose:false, direction:"top", startCollapsed:true});	
				
					
			}, ["/ibi_apps/ibx/testing/txbtests/toolbar/mainToolbar.ides.xml"], true);	
	</script>
</head>

<body class="ibx-root">
<div class="main-tool" data-ibxp-align="stretch" data-ibx-name-root="true">
	<div class="main-toolbar" style="background-color:grey;color:white;border:1px solid black" data-ibx-type="ibxHBox" data-ibxp-align="stretch"></div>
	<div class="main-box" data-ibxp-align="stretch" >Design</div>
	<div class="runner-box" data-ibxp-align="stretch" >Preview</div>	
</div>
</body>
</html>
