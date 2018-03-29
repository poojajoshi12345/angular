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
				Ibfs.load().done(function(ibfs)
				{
					ibfs.login("admin", "admin");
				});

				$(".item-load").on("click", function(e)
				{
					ibx.waitStart($(".item-list"));
					$.get("./test.xml").done(function(doc, status, xhr)
					{
						var loadCount = parseInt($(".item-load-count").ibxWidget("value"), 10);
						loadCount = isNaN(loadCount) ? users.length : loadCount;

						var date = new Date();
						var itemList = $(".item-list");
						var users = doc.documentElement.querySelectorAll("rootObject > item[name][description]");
						for(var i = 0; i < loadCount; ++i)
						{
							var item = new userGroupItem(users[i]);
							itemList.append(item.element.addClass("item-" + i));
						}
						$(".item-template").remove();
						$(".item-count").text(sformat("Item Count: {1}, Load Time: {2}ms", $(".item-user-group").length, (new Date()) - date)); 
						ibx.waitStop($(".item-list"));
					});
				});

				$(".item-search").on("ibx_action ibx_textchanged", function(e, info)
				{
					var searchOnKey = $(".item-search-on-key").ibxWidget("checked");
					if(e.type == "ibx_textchanged" && !searchOnKey)
						return;

					var date = new Date();
					var nItems = 0;
					var regx = new RegExp(info.text, "gi");
					var items = $(".item-user-group");
					items.each(function(text, regx, idx, el)
					{
						var item = el._userGroupItem;
						if(!item)
							return;
						var passed = regx.test(item.description);
						passed = passed || regx.test(item.name); 
						el.style.display = passed ? "" : "none";
						passed ? ++nItems : null;
					}.bind(this, info.text, regx));
					$(".item-hits").text(sformat("Found {1} items in {2}ms", nItems, (new Date())-date));
				});

				var template = $(".item-template");
				function userGroupItem(ibfsItem)
				{
					this.ibfsItem = ibfsItem;
					var name = this.name = ibfsItem.getAttribute("name");
					var description = this.description = ibfsItem.getAttribute("description");
					var type = this.type = ibfsItem.getAttribute("type").toLowerCase();

					this.element = template.clone().removeClass("item-template");
					this.element[0]._userGroupItem = this;
					this.element.find(".item-desc").text(description);
					this.element.find(".item-name").text(name);
					this.element.find(".item-icon").addClass((type == "user") ? "item-user" : "item-group");
				};

			}, [{src:"./test_res_bundle.xml", loadContext:"app"}], true);
		</script>
		<style type="text/css">
			html, body
			{
				width:100%;
				height:100%;
				margin:0px;
				box-sizing:border-box;
			}
			.main-box
			{
				width:100%;
				height:100%;
				padding:5px;
				box-sizing:border-box;
			}
			.main-box
			{
				padding:3px;
				width:100%;
				height:100%;
				box-sizing:border-box;
			}
			.item-search-box, .item-load-box
			{
				margin-bottom:10px;
			}

			.item-load
			{
				margin-right:5px;
			}
			.item-load-count
			{
				width:50px;
			}
			.item-search
			{
				width:300px;
				margin-right:5px;
			}
			.item-search-on-key
			{
				margin-right:5px;
			}
			.item-list
			{
				height:200px;
				width:400px;
				margin-bottom:5px;
				overflow:auto;
				border:1px solid #ccc;
			}
			.item-count, .item-hits
			{
				color:#aaa;
				margin-bottom:3px;
			}
			.item-user-group
			{
				font-size:14px;
				flex:0 0 auto;
				padding:7px;
				border-bottom:1px solid #ccc;
			}
			.item-icon
			{
				margin-right:10px;
			}
			.item-user::after
			{
				font-size:1.25em;
				content:"\f007";
			}
			.item-group::after
			{
				content:"\f0c0";
			}
			.item-user-group .item-desc,.item-template .item-name
			{
				flex:0 0 auto;
			}
			.item-user-group .item-desc
			{
				margin-bottom:3px;
				font-weight:bold;
			}
		</style>
	</head>
	<body class="ibx-root">
		<div class="main-box" data-ibx-type="ibxVBox" data-ibxp-align="center" data-ibxp-justify="center">
			<div class="item-load-box" data-ibx-type="ibxHBox" data-ibxp-align="center">
				<div class="item-load" data-ibx-type="ibxButton">Load</div>
				<div class="item-load-count" data-ibx-type="ibxTextField" data-ibxp-placeholder="all"></div>
			</div>
			<div class="item-search-box" data-ibx-type="ibxHBox" data-ibxp-align="center">
				<div class="item-search" data-ibx-type="ibxTextField" data-ibxp-placeholder="Search for User/Group..."></div>
				<div class="item-search-on-key" data-ibx-type="ibxCheckBoxSimple" data-ibxp-checked="true">Every Key</div>
			</div>
			<div class="item-list" data-ibx-type="ibxVBox" data-ibxp-align="stretch"></div>
			<div class="item-hits" data-ibx-type="ibxLabel"></div>
			<div class="item-count" data-ibx-type="ibxLabel"></div>
		</div>
	</body>

	<div class="item-template item-user-group ibx-flexbox fbx-block fbx-row fbx-align-items-center fbx-align-content-center">
		<div class="fa item-icon"></div>
		<div class="item-info ibx-flexbox fbx-block fbx-column fbx-align-items-stretch fbx-align-content-stretch">
			<div class="item-desc"></div>
			<div class="item-name"></div>
		</div>
	<div>

</html>
