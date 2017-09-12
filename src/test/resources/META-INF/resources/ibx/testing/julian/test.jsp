<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision$:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>ibx test</title>
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
				$.widget("ibi.ibxIconOverlay", $.ibi.ibxWidget, 
				{
					options:
					{
					},
					_widgetClass:"ibx-icon-overlay",
					_create:function()
					{
						this._super();
						var label = this._label = $("<label>");
					},
					_destroy:function()
					{
						this._super();
					},
					_refresh:function()
					{
						this._super();
					}
				});
				ibx.bindElements();
			}, [{"src":"./test_res_bundle.xml", "loadContext":"app"}], false);
		</script>
		<style type="text/css">
			html, body
			{
				margin:0px;
				height:100%;
				width:100%;
				position:relative;
			}
			.main-box
			{
				position:absolute;
				left:0px;
				top:0px;
				right:0px;
				bottom:0px;
				border:2px solid red;
				padding:5px;
			}

			.test-label
			{
				font-size:6em;
			}

			.x
			{
				width:300px;
				height:300px;
				border:1px solid lime;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
			<div class="test-label" data-ibx-type="ibxLabel"
				data-ibxp-overlays=
				'[
					{"position":"bl", "glyph":"" ,"glyphClasses":"fa fa-share"},
				]'
				data-ibxp-icon="./xren1.png" data-ibxp-glyph="" data-ibxp-glyph-classes="fa fa-gear">Julian
			</div>
		</div>
	</body>
</html>



			<div style="display:none;" class="test-label" data-ibx-type="ibxLabel"
				data-ibxp-overlays=
				'[
					{"position":"tc", "glyph":"face" ,"glyphClasses":"material-icons"},
					{"position":"tr", "glyph":"face" ,"glyphClasses":"material-icons"},
					{"position":"rc", "glyph":"face" ,"glyphClasses":"material-icons"},
					{"position":"lb", "glyph":"" ,"glyphClasses":"fa fa-share"},
					{"position":"bc", "glyph":"face" ,"glyphClasses":"material-icons"},
					{"position":"bl", "glyph":"face" ,"glyphClasses":"material-icons"},
					{"position":"lc", "glyph":"face" ,"glyphClasses":"material-icons"},
					{"position":"lt", "glyph":"face" ,"glyphClasses":"material-icons"},
					{"position":"cc", "glyph":"face" ,"glyphClasses":"material-icons"},
				]'
				data-ibxp-icon="./ren1.png" data-ibxp-glyph="face" data-ibxp-glyph-classes="material-icons">Julian
			</div>
