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

					var itemList = $(".item-list");
					var users = ibfs.listItems("IBFS:/SSYS/USERS", 1, 0, {async:false}).result;
					for(var i = 0; i < users.length; ++i)
					{
						var item = new userGroupItem(users[i]);
						itemList.append(item.element.addClass("item-" + i));
					}
				});

				var template = $(".item-template");
				function userGroupItem(ibfsItem)
				{
					this._ibfsItem = ibfsItem;
					this.element = template.clone().removeClass("item-template");
					this.element.find(".item-desc").text(ibfsItem.getAttribute("description"));
					this.element.find(".item-name").text(ibfsItem.getAttribute("name"));
					var type = ibfsItem.getAttribute("type").toLowerCase();
					this._type = type;
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
			.item-list
			{
				height:200px;
				width:400px;
				overflow:auto;
				border:1px solid #ccc;
			}

			.item-template.item-user-group
			{
				display:none !important;
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
			<div class="item-list" data-ibx-type="ibxVBox" data-ibxp-align="stretch"></div>
		</div>
	</body>

	<div class="item-template item-user-group" data-ibx-type="ibxHBox" data-ibxp-align="center">
		<div class="fa item-icon"></div>
		<div class="item-info" data-ibx-type="ibxVBox" data-ibx-align="stretch">
			<div class="item-desc"></div>
			<div class="item-name"></div>
		</div>
	<div>

</html>
