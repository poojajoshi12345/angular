<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision: 1.6 $:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%><!DOCTYPE html>
<html>
	<head>
		<title>ibx save dialog</title>
		<meta http-equiv="X-UA-Compatible" content="IE=EDGE" />
		<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="Expires" content="0" />
		<meta name="google" value="notranslate"/>
		<meta name="viewport" content="width=device-width, initial-scale=1"/>

		<!--include this script...will boot ibx into the running state-->
		<script src="<%=request.getContextPath()%>/ibx/resources/ibx.js" type="text/javascript"></script>
		
		<script type="text/javascript">
			<jsp:include page="/WEB-INF/jsp/global/wf_globals.jsp" flush="false" />
			ibx(function()
			{debugger;
				
				$(".btn-show-save-dialog").on("click", function()
				{		
					var saveDlg = ibx.resourceMgr.getResource('.save-dialog-resources', true);
					saveDlg.ibxWidget({fileTypes:"fex;pgx", dlgType:"save", title: "Save", ctxPath: "IBFS:/WFC/Repository/Public"});
					saveDlg.ibxWidget('open');
					saveDlg.on("ibx_beforeclose", function(e, closeData)
					{
						debugger;
						//return false;
					}).on("ibx_close", function (e, closeData)
					{						
						debugger;
						if(closeData != "cancel")
						{
							var fileName = saveDlg.ibxWidget('fileName');			
							var description = saveDlg.ibxWidget('fileTitle');
							var ibfsItems = saveDlg.ibxWidget('ibfsItems');
						}	
					});
				});	
					$(".btn-show-open-dialog").on("click", function()
					{		debugger;
					var saveDlg = ibx.resourceMgr.getResource('.save-dialog-resources', true);
					saveDlg.ibxWidget({fileTypes:"fex;pgx", dlgType:"open", title: "Open", ctxPath: "IBFS:/WFC/Repository/Public"});										
					//saveDlg.ibxWidget('option', 'dlgType', "open");
					//saveDlg.ibxWidget('option', 'title', "Open");
					//saveDlg.ibxWidget('option', 'ctxPath', "IBFS:/WFC/Repository/Public");
					saveDlg.ibxWidget('open');
					saveDlg.on("ibx_beforeclose", function(e, closeData)
					{
						debugger;
						//return false;
					}).on("ibx_close", function (e, closeData)
					{						
						debugger;
						if(closeData != "cancel")
						{
							var fileName = saveDlg.ibxWidget('fileName');			
							var description = saveDlg.ibxWidget('fileTitle');
							var ibfsItems = saveDlg.ibxWidget('ibfsItems');
						}	
					});
					
					
				});
			}, ["../testing/jonathan/opensavedialog/opensavedialog_bundle.xml"], true);
		</script>
		
		<style type="text/css">
			.main-box
			{
				position:absolute;
				left:0px;
				top:0px;
				right:0px;
				bottom:0px;
			}
			
		</style>
	</head>
	<body class="ibx-root">
		<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-justify="center" data-ibxp-align="center">
			<div class="btn-show-save-dialog" data-ibx-type="ibxButton" data-ibxp-text="Show the Save Dialog..."></div>
			<div class="btn-show-open-dialog" data-ibx-type="ibxButton" data-ibxp-text="Show the Open Dialog..."></div>				
		</div>	
			
		
		
	</body>
</html>

