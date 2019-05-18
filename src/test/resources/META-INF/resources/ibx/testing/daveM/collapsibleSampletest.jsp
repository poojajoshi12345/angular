<!DOCTYPE html>
<html lang="en">
	<head>
		<title>HTML Test File</title>
		<meta http-equiv="X-UA-Compatible" content="IE=11">
		<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="Expires" content="0" />
		<meta name="google" value="notranslate">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<script type="text/javascript" src="../../resources/ibx.js"></script>
		<script type="text/javascript">
			//ibx.profiling = true;
			ibx(function(e)
			{
					var sidebar = $(".sidebar");
					sidebar.ibxCollapsible();
					
					$(".hamburger").on("click", function(e)
					{
						var sidebar = $(".sidebar");
						sidebar.ibxCollapsible("toggle");
					})

			},true);
		</script>
		<style type="text/css">
			.container
			{
				position:absolute;
				left:100px;
				top:100px;
				width:400px;
				height:400px;
				overflow:hidden;
				border:1px solid black;
				z-index: 0;
			}
			.sidebar
			{
				flex:0 0 auto;
				align-self:stretch;
				width:33%;
				border:1px solid #ccc;
				box-sizing:border-box;
				background-color: white;
				z-index: 1000;
			}
			.sidebar-tbar
			{
				flex:0 0 auto;
				border-bottom:1px solid #ccc;
				padding:2px;
			}
			.sidebar-file-list
			{
				flex:1 1 auto;
				overflow:auto;
				padding:2px;
			}
			.sidebar-file
			{
				flex:0 0 auto;
				line-height:3em;
				border:1px solid #ccc;
				margin-bottom:1px;
			}
			.topbar
			{
				flex:1 1 auto;
				box-sizing: border-box;
			}
			.hamburger
			{
				font-size:2em;
			}
			.content
			{
				position:absolute;
				left:0px;
				top:2em;
				right:0px;
				bottom:0px;
				box-sizing:border-box;
				border-top:1px solid black;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="container" data-ibx-type="ibxHBox" data-ibxp-align="start">
			<div class="sidebar" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
				<div class="sidebar-tbar" data-ibx-type="ibxHBox">
					<div class="sidebar-btn" data-ibx-type="ibxButton">Button</div>
				</div>
				<div class="sidebar-file-list" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
					<div class="sidebar-file" data-ibx-type="ibxLabel">File Item</div>
					<div class="sidebar-file" data-ibx-type="ibxLabel">File Item</div>
					<div class="sidebar-file" data-ibx-type="ibxLabel">File Item</div>
					<div class="sidebar-file" data-ibx-type="ibxLabel">File Item</div>
					<div class="sidebar-file" data-ibx-type="ibxLabel">File Item</div>
					<div class="sidebar-file" data-ibx-type="ibxLabel">File Item</div>
					<div class="sidebar-file" data-ibx-type="ibxLabel">File Item</div>
					<div class="sidebar-file" data-ibx-type="ibxLabel">File Item</div>
					<div class="sidebar-file" data-ibx-type="ibxLabel">File Item</div>
					<div class="sidebar-file" data-ibx-type="ibxLabel">File Item</div>
					<div class="sidebar-file" data-ibx-type="ibxLabel">File Item</div>
					<div class="sidebar-file" data-ibx-type="ibxLabel">File Item</div>
					<div class="sidebar-file" data-ibx-type="ibxLabel">File Item</div>
					<div class="sidebar-file" data-ibx-type="ibxLabel">File Item</div>
					<div class="sidebar-file" data-ibx-type="ibxLabel">File Item</div>
					<div class="sidebar-file" data-ibx-type="ibxLabel">File Item</div>
					<div class="sidebar-file" data-ibx-type="ibxLabel">File Item</div>
					<div class="sidebar-file" data-ibx-type="ibxLabel">File Item</div>
					<div class="sidebar-file" data-ibx-type="ibxLabel">File Item</div>
					<div class="sidebar-file" data-ibx-type="ibxLabel">File Item</div>
				</div>
			</div>
			<div class="topbar" data-ibx-type="ibxHBox" data-ibxp-align="center">
				<div class="hamburger" data-ibx-type="ibxLabel" data-ibxp-glyph="reorder" data-ibxp-glyph-classes="material-icons"></div>
			</div>
			<div class="content" data-ibx-type="ibxWidget">
				THIS IS A SAMPLE REPORT THAT IS UNDERNEATH THE SIDEBAR.
			</div>
		</div>
	</body>
</html>