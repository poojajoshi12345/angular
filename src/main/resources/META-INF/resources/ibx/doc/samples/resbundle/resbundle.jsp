<%-- Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved. 
 $Revision: 1.5 $:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>ibx resource bundle</title>
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

			window.addEventListener("ibx_ibxresmgr", function(e)
			{
				//output log on timer so it doesn't skew the profiler timings.
				window.setTimeout(function(e)
				{
					var info = e.data;
					var tabs = "";
					for(var i = 0; i < info.loadDepth; ++i)tabs+="\t";
					var txt =  $(".txt-out");
					var log = txt.val();
					if(info.src)
						txt.val(log + tabs + info.hint + ": " +  info.src + "\n");
					else
						txt.val(log + tabs + info.hint + "\n");
				}.bind(this, e));
			});

			ibx.profiling = true;
			ibx(function()
			{
				$(".load-btn").on("click", function(e)
				{
					var res = window.resBundle = new ibxResourceManager();
					var strBundle = $(".txt-res-bundle").ibxWidget("option", "text");
					var relTo = $(".sel-relative").ibxWidget("userValue");
					res.addBundle(strBundle, relTo).done(function(bundle, resMgr)
					{
						var box = $(".box-items");
						box.empty();

						var label = resMgr.getResource(".resbundle-label");
						box.append(label);

						var label = resMgr.getResource(".resbundle-strings");
						box.append(label);

						label = resMgr.getResource(".resbundle-markup-label");
						box.append(label);

						label = resMgr.getResource(".resbundle2-label");
						box.append(label);

						label = resMgr.getResource(".resbundle2-markup-label");
						box.append(label);
					});
				});

				$(".clear-btn").on("click", function(e)
				{
					var txt =  $(".txt-out");
					txt.val("");
				});

				/*
				ResizeSensor($(".box-main"), function()
				{
					console.log("resize");
				});
				*/

				$(".box-main").data("ibxWidget")._onResize = function()
				{
					console.log(arguments);
				}
			}, [{"src":"./resources/resbundle.xml", "loadContext":"app"}], true);
		</script>
		<style type="text/css">
			body
			{
				height:100%;
			}
			.box-main
			{
				position:absolute;
				left:0px;
				top:0px;
				right:0px;
				bottom:0px;
				padding:5px;
			}
			.btn-bar, .txt-out
			{
				margin:5px;
			}
			.btn-bar div
			{
				margin:3px;
			}
			.txt-res-bundle
			{
				flex:1 1 auto;
			}

			.txt-out
			{
				flex:1 1 auto;
				border:1px solid black;
				border-radius:3px;
				resize:none;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="box-main" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
			<div class="btn-bar" data-ibx-type="ibxHBox" data-ibxp-align="center" data-ibxp-want-resize="true">
				<div class="clear-btn" data-ibx-type="ibxButton" tabIndex="0">Clear Event Log</div>
				<div class="load-btn" data-ibx-type="ibxButton" tabIndex="0">Load Resource Bundle</div>
				<div data-ibx-type="ibxLabel">Relative To:</div>
				<div id="selRelative" class="sel-relative" data-ibx-type="ibxSelect" data-ibxp-readonly="true" tabIndex="0">
					<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="ibx">ibx</div>
					<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="app" data-ibxp-selected="true">app (resbundle.jsp)</div>
					<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="/">absolute (//srvr:port/path)</div>
				</div>
				<div data-ibx-type="ibxLabel" data-ibxp-for-id="resBundle">Resource Bundle:</div>
				<div id="resBundle" class="txt-res-bundle" data-ibx-type="ibxTextField" tabIndex="0">./resources/resbundle.xml</div>
			</div>
			<textarea class="txt-out" readonly="true"></textarea>
		</div>
	</body>
</html>

