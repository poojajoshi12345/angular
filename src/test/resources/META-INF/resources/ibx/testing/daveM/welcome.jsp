<%-- Copyright 1996-2017 Information Builders, Inc. All rights reserved. --%>
<%-- $Revision$--%>
<%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
	String applicationContext = request.getContextPath();
%>
<!DOCTYPE html>
<html>
	<head>
		<title>Welcome Page</title>
		<meta http-equiv="X-UA-Compatible" content="IE=EDGE" >
		<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="Expires" content="0" />
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<Script src="<%=applicationContext%>/ibx/resources/ibx.js" type="text/javascript"></script>

		<script type="text/javascript">
			<jsp:include page="/WEB-INF/jsp/global/wf_globals.jsp" flush="false" />

			var packages=
			[
				"<%=applicationContext%>/tools/welcome/resources/welcome_res_bundle.xml",
			];

			ibx(init, packages, true);

			function init()
			{
				var loaded = Ibfs.load("<%=applicationContext%>", WFGlobals.ses_auth_parm, WFGlobals.ses_auth_val);
				loaded.done(function(ibfs)
				{
					ibfs.login("admin", "admin").done(function()
					{
						var rootItem = new IbfsRootItem(ibfs);
						$(".pd-resource-tree").ibxWidget('add', rootItem.getElement());
						$(".pd-resource-tree").ibxWidget('member', '_content').css('max-height', '');

						pageUtil.ibfs = ibfs;

					});
				});

				var tool = ibxResourceMgr.getResource('.pd-tool');
				$('body').append(tool);
			}

		</script>
		<style type="text/css">
			body{margin:0px;}
		</style>
	</head>
	<body class="ibx-root">
	</body>
</html>
