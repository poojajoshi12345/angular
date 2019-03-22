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
			ibx(function(e)
			{
				$(".test-select").on("ibx_selchange", function(e)
				{
					var btn = $(e.target);
					var userValue = btn.ibxWidget("userValue");
					console.log(e.type, userValue)
				});

				$(".test-slider").on("ibx_change", function(e, data)
				{
					console.log(e.type, data);
				});

				var grid = $(".test-grid");
				grid.ibxWidget("initGrid", 5, 5).ibxWidget("showColumn", 1, true).on("click", function(e)
				{
					
				});
				grid.ibxWidget("getHeaders").on("click", function(e)
				{
					var colInfo = $(e.currentTarget).data("ibxDataGridCol");
				})
				
			//	$(".dgrid-cell").ibxLabel({text:"Julian", glyph:"accessible", glyphClasses:"material-icons"});

				// grid.find(".dgrid-cell").attr("tabindex", "");
				// grid.find(".dgrid-row").attr("tabindex", -1);
				// var sm = $(".test-grid").ibxWidget("getSelectionManager");
				// sm.option( 
				// {
				// 	"selectableChildren":".dgrid-row"
				// });

				var vBox = $("<div>").ibxVBox({align:"stretch"})
			},true);
		</script>
		<style type="text/css">
			body
			{
				position:absolute;
				width: 100%;
				height: 100%;
				margin:0px;
				box-sizing: outline-box;
			}
			body > div
			{
				margin:10px;
			}
			.test-tree
			{
				margin:50px;
				width:150px;
				height:200px;
				border:1px solid #ccc;
			}
			.test-select
			{
				padding:2px;
				width:100px;
				border:1px solid #ccc;
				border-radius:.25em;
			}
			.test-slider
			{
				width:300px;
				height:100px;
			}
			.test-spinner
			{
				width:75px
			}
			.test-grid
			{
				width:400px;
				height:500px;
				border:1px solid #ccc;
			}
			.test-grid .ibx-sm-selected
			{
				outline:1px solid black;
				background-color:#aaa;
				color:white;
			}

			.acx-exp-main-frame
			{
				width:35em;
				height:20em;
			}
			.acx-exp-tbar
			{
				flex:0 0 auto;
			}
			.acx-content-box
			{
				flex:1 1 auto;
			}
			.acx-exp-tree
			{
				flex:0 0 atuo;
				width:10em;			}
			.acx-exp-files-box
			{
				flex:1 1 auto;
			}
			.acx-exp-folder-list
			{
				flex:1 1 auto;
			}
			.acx-exp-file-list
			{
				flex:1 1 auto;
			}
			.acx-exp-ctrl
			{
				padding:2px;
				margin:2px;
				border:1px solid #ccc;
			}
			.acx-exp-file
			{
				height:20px;
				margin:2px;
				padding:1px;
				border:1px solid #ccc;
			}

		</style>
	</head>
	<body class="ibx-root" data-ibx-type="ibxVBox" data-ibxp-align="start">

		<div tabindex="0" class="acx-exp-ctrl acx-exp-main-frame" data-ibx-type="ibxVBox" data-ibxp-align="stretch" data-ibxp-focus-root="true" data-ibxp-focus-default="true">
			<div class="acx-exp-ctrl acx-exp-tbar" data-ibx-type="ibxHBox" data-ibxp-align="center">
				<div tabindex="0" title="Test button 1" class="acx-exp-ctrl" data-ibx-type="ibxButton" data-ibxp-glyph-classes="fa fa-question"></div>
				<div tabindex="0" title="Test button 2" class="acx-exp-ctrl" data-ibx-type="ibxButton" data-ibxp-glyph-classes="fa fa-question"></div>
				<div tabindex="0" title="Test button 3" class="acx-exp-ctrl" data-ibx-type="ibxButton" data-ibxp-glyph-classes="fa fa-question"></div>
			</div>
			<div class="acx-exp-ctrl acx-content-box" data-ibx-type="ibxHBox" data-ibxp-align="stretch">
				<div tabindex="0" title="File System Tree" class="acx-exp-ctrl acx-exp-tree" data-ibx-type="ibxTree">
					<div data-ibx-type="ibxTreeNode" data-ibxp-expanded="true">File System Root
						<div data-ibx-type="ibxTreeNode" data-ibxp-expanded="true">Folder 1
							<div data-ibx-type="ibxTreeNode">Folder A</div>
							<div data-ibx-type="ibxTreeNode">Folder B</div>
							<div data-ibx-type="ibxTreeNode">Folder C</div>
						</div>
					</div>
				</div>
				<div class="acx-exp-ctrl acx-exp-files-box" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
					<div>Child Folders</div>
					<div tabindex="0" title="File System Folder List" class="acx-exp-ctrl acx-exp-folder-list" data-ibxp-aria.role="list" data-ibx-type="ibxHBox" data-ibxp-wrap="true" data-ibxp-nav-key-root="true" data-ibxp-focus-default="true">
						<div tabindex="-1" title="Folder" class="acx-exp-file" role="listitem">Item</div>
						<div tabindex="-1" title="Folder" class="acx-exp-file" role="listitem">Item</div>
						<div tabindex="-1" title="Folder" class="acx-exp-file" role="listitem">Item</div>
						<div tabindex="-1" title="Folder" class="acx-exp-file" role="listitem">Item</div>
						<div tabindex="-1" title="Folder" class="acx-exp-file" role="listitem">Item</div>
					</div>
					<div>Child Files</div>
					<div tabindex="0" title="File System File List" class="acx-exp-ctrl acx-exp-file-list" data-ibxp-aria.role="list" data-ibx-type="ibxHBox" data-ibxp-wrap="true" data-ibxp-nav-key-root="true" data-ibxp-focus-default="true">
						<div tabindex="-1" title="File 1" class="acx-exp-file" role="listitem">Item</div>
						<div tabindex="-1" title="File 2" class="acx-exp-file" role="listitem">Item</div>
						<div tabindex="-1" title="File 3" class="acx-exp-file" role="listitem">Item</div>
						<div tabindex="-1" title="File 4" class="acx-exp-file" role="listitem">Item</div>
						<div tabindex="-1" title="File 5" class="acx-exp-file" role="listitem">Item</div>
					</div>
				</div>
			</div>
		</div>
		<div tabindex="0">Julian</div>
		<!-- <div tabindex="0" class="test-ctrl test-tree" data-ibx-type="ibxTree" data-ibxp-sel-type="multi">
			<div data-ibx-type="ibxTreeNode" data-ibxp-expanded="true">Root Item
				<div data-ibx-type="ibxTreeNode" data-ibxp-expanded="true">Folder 1
					<div data-ibx-type="ibxTreeNode" data-ibxp-draggable="true">Item 1</div>
					<div data-ibx-type="ibxTreeNode" data-ibxp-draggable="true">Item 2</div>
					<div data-ibx-type="ibxTreeNode" data-ibxp-draggable="true">Item 3</div>
				</div>
				<div data-ibx-type="ibxTreeNode" data-ibxp-expanded="true">Folder 2
					<div data-ibx-type="ibxTreeNode">Item 1</div>
					<div data-ibx-type="ibxTreeNode">Item 2</div>
					<div data-ibx-type="ibxTreeNode">Item 3</div>
				</div>
			</div>
		</div> -->


		<!-- <div tabindex="0" class="test-grid" data-ibx-type="ibxDataGrid" data-ibxp-row-select="false" data-ibxp-sel-type="multi"></div> -->

		<!-- <div tabindex="0" class="test-menuButton" data-ibx-type="ibxSplitMenuButton">SplitMenuButton
			<div data-ibx-type="ibxMenu">
				<div data-ibx-type="ibxMenuItem">Menu Item</div>
			</div>
		</div> -->

		<!-- <div tabindex="0" class="test-grid" data-ibx-type="ibxDataGrid"></div> -->


		<!-- <div tabindex="0" class="test-select" data-ibx-type="ibxSelectMenuButton" data-ibxp-multi-select="true" data-ibxp-user-value='["i2", "i4", "i6"]' data-ibxp-use-value-as-text="true"  data-ibxp-editable="false">Select an Item
			<div class="test-item" data-ibx-type="ibxSelectMenuItem" data-ibxp-user-value="i1" xdata-ibxp-selected="true">Julian</div>
			<div class="test-item" data-ibx-type="ibxSelectMenuItem" data-ibxp-user-value="i2">Julian Alexander</div>
			<div class="test-item" data-ibx-type="ibxSelectMenuItem" data-ibxp-user-value="i3" xdata-ibxp-selected="true">Julian Alexander Hyman</div>
			<div class="test-item" data-ibx-type="ibxSelectMenuItem" data-ibxp-user-value="i4">James Hyman</div>
			<div class="test-item" data-ibx-type="ibxSelectMenuItem" data-ibxp-user-value="i5" xdata-ibxp-selected="true">Basil Hyman</div>
			<div class="test-item" data-ibx-type="ibxSelectMenuItem" data-ibxp-user-value="i6">Anne Hyman</div>
		</div> -->

		<!-- <div tabindex="0" class="test-grid" data-ibx-type="ibxDataGrid" data-ibxp-sortable-columns="true" data-ibxp-sortable-rows="true"></div>

		<div tabindex="0" class="test-slider" data-ibx-type="ibxSlider"></div>
		<div tabindex="0" class="test-slider" data-ibx-type="ibxSlider" data-ibxp-min="10.5" data-ibxp-max="15.5" data-ibxp-step=".1" data-ibxp-value="12.75"></div>
		<div tabindex="0" class="test-slider" data-ibx-type="ibxRange" data-ibxp-min="0" data-ibxp-max="1" data-ibxp-step=".01" data-ibxp-value=".25" data-ibxp-value2=".75"></div>

		<div tabindex="0" class="test-spinner" data-ibx-type="ibxSpinner" data-ibxp-min="0" data-ibxp-max="1" data-ibxp-step=".1" data-ibxp-value=".5"></div>
		<div tabindex="0" class="test-spinner" data-ibx-type="ibxSpinner" data-ibxp-value="50"></div>
 -->

		<!--<div tabindex="0" class="test-spinner" data-ibx-type="ibxSpinner"></div>
		<div tabindex="0" class="test-spinner" data-ibx-type="ibxSpinner" data-ibxp-precision="3" data-ibxp-min="0" data-ibxp-max="1" data-ibxp-step=".01" data-ibxp-value=".5"></div>

		<div tabindex="0" class="test-slider" data-ibx-type="ibxSlider"></div>
		<div tabindex="0" class="test-slider" data-ibx-type="ibxSlider" data-ibxp-precision="3" data-ibxp-min="10.5" data-ibxp-max="15.5" data-ibxp-step="1" data-ibxp-value="11"></div>
		<div tabindex="0" class="test-slider" data-ibx-type="ibxVRange" data-ibxp-precision="3" data-ibxp-min="0" data-ibxp-max="1" data-ibxp-step=".01" data-ibxp-value=".25" data-ibxp-value2=".75"></div>
 -->
		<!-- <div tabindex="0" class="test-mbutton" data-ibx-type="ibxMenuButton" data-ibxp-icon-position="top">Menu Button
			<div class="test-item" data-ibx-type="ibxSelectMenuItem">Julian</div>
			<div class="test-item" data-ibx-type="ibxSelectMenuItem">Julian Alexander</div>
			<div class="test-item" data-ibx-type="ibxSelectMenuItem">Julian Alexander Hyman</div>
			<div class="test-item" data-ibx-type="ibxSelectMenuItem">James Hyman</div>
		</div> -->
	</body>
</html>


