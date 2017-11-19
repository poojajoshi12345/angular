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
				$("body").on("keydown", function(e)
				{
					if(e.ctrlKey && e.key == 'c')
						console.clear();
				});

				$.each($.ibi.ibxCommand.cmds, function(key, cmd)
				{
					cmd.on("ibx_checkchanged ibx_triggered", function(e)
					{
						console.log(e.type, e);
					});
				});
			}, null, true);
		</script>
		<style type="text/css">
			.main-box
			{
				position:absolute;
				left:0px;
				top:0px;
				right:0px;
				bottom:0px;
				overflow:auto;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div data-ibx-type="ibxCommand" data-ibxp-id="cmdTest" data-ibxp-shortcut="Ctrl+T"></div>
		<div data-ibx-type="ibxRadioGroup" data-ibxp-name="rgTest"></div>

		<div tabIndex="0" id="mainBox" class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center" data-ibx-name-root="true">
				<div tabIndex="0" data-ibx-type="ibxButtonSimple" data-ibxp-command="cmdTest">Test Button</div>
				<div tabIndex="0" data-ibx-type="ibxCheckBoxSimple" data-ibxp-command="cmdTest">Check 1</div>
				<div tabIndex="0" data-ibx-type="ibxRadioButtonSimple" data-ibxp-group="rgTest">Radio 1</div>
				<div tabIndex="0" data-ibx-type="ibxRadioButtonSimple" data-ibxp-group="rgTest">Radio 2</div>
				<div tabIndex="0" class="menu-btn-test" data-ibx-type="ibxMenuButton" data-ibxp-multi-select="true" data-ibxp-text="Test Menu">
					<div data-ibx-type="ibxMenu" data-ibxp-multi-select="true">
						<div data-ibx-type="ibxCheckMenuItem" data-ibxp-command="cmdTest" data-ibxp-label-options="{'glyph':'face', 'glyphClasses':'material-icons'}">Check 1</div>
						<div data-ibx-type="ibxMenuSeparator"></div>
						<div data-ibx-type="ibxRadioMenuItem" data-ibxp-group="rgTest" data-ibxp-checked="true">Radio 1</div>
						<div data-ibx-type="ibxRadioMenuItem" data-ibxp-group="rgTest">Radio 2</div>
						<div data-ibx-type="ibxMenuSeparator"></div>
						<div data-ibx-type="ibxMenuItem" data-ibxp-command="cmdTest">Item 1</div>
						<div data-ibx-type="ibxMenuItem" data-ibxp-command="cmdTest" data-ibxp-label-options="{'glyph':'face', 'glyphClasses':'material-icons'}">Item 2</div>
					</div>
				</div>
		</div>
	</body>
</html>
