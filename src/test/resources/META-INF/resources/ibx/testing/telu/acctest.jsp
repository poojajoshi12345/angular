<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision$:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>ibx samples</title>
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
                jQuery.event.special['ibx_change'] = { noBubble: true };
                
                //$(".thirdpage").ibxWidget("selected", true);
                //$(".myaccpane").ibxWidget("userValue", "page2");
                //var index = $(".myaccpane").ibxWidget("selectedIndex");
                //$(".myaccpane").ibxWidget("selectedIndex", 0);
                $(".myaccpane").ibxWidget("remove", ".thirdpage, .fourthpage");
                var a = 1;

			}, true);
        </script>
		<style type="text/css">
            .myaccpane
            {
                width: 400px;
            }
		</style>
	</head>
	<body class="ibx-root">

		<div class="myaccpane" data-ibx-type="ibxAccordionPane">
			<div class="firstpage" data-ibx-type="ibxAccordionPage">Page1<div data-ibx-type="ibxLabel">Label1</div></div>
			<div class="secondpage" data-ibx-type="ibxAccordionPage">Page2<div data-ibx-type="ibxLabel">Label2</div></div>
			<div class="thirdpage" data-ibx-type="ibxAccordionPage" data-ibxp-selected="true">Page3<div data-ibx-type="ibxLabel">Label3</div></div>
			<div class="fourthpage" data-ibx-type="ibxAccordionPage">Page4<div data-ibx-type="ibxLabel">Label4</div></div>
		</div>

			
	</body>
</html>

