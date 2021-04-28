<%-- Copyright 1996-2017 Information Builders, Inc. All rights reserved. --%>
<%-- $Revision: 1.3 $--%>
<%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>ibx library diagram sample</title>
		<meta http-equiv="X-UA-Compatible" content="IE=EDGE" >
		<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="Expires" content="0" />
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<Script src="<%=request.getContextPath()%>/ibx/resources/ibx.js" type="text/javascript"></script>

		<script type="text/javascript">
			<jsp:include page="/WEB-INF/jsp/global/wf_globals.jsp" flush="false" />

			ibx(function()
			{
				var bindingRoots = $(".ibx-root:not(.ibx-bound)");
				ibx.bindElements(bindingRoots);
				bindingRoots.ibxAddClass("ibx-bound");
					
				for (var w in $['ibi'])
				{
					var name = $['ibi'][w].prototype.widgetName;
					var parentname = $['ibi'][w].prototype.__proto__.widgetName;
					wObjects.push(new wObject(name, $['ibi'][parentname]?parentname:""));
				}

				for (var i = 0; i < wObjects.length; i++)
				{
					if (!wObjects[i].parent)
						findChildren(wObjects[i].name, $(".ih-hier-wrapper"));
				}

			}, [{"src":"./resources/ibxhier_res_bundle.xml", "loadContext":"app"}], true);

			function findChildren(name, elem)
			{
				var hbox = $('<div>').ibxHBox({align:"stretch"});
				hbox.css('margin', '5px');

				var label = $("<div>").ibxButton({text: name, glyphClasses: "fa fa-minus", iconPosition: "left"});
				label.data('classinfo', {name:name});
				hbox.append(label);
				label.on("click", function (e)
				{
					var hbox = $(e.currentTarget).parent();
					var box = hbox.next('.ibx-flexbox-vertical');
					if (box.length > 0)
					{
						box.toggle();
						var widget = $(e.currentTarget).data('ibxWidget');
						if (widget.option('glyphClasses') == "fa fa-minus")
							widget.option('glyphClasses', 'fa fa-plus');
						else
							widget.option('glyphClasses', 'fa fa-minus');
					}
				});

				var helplabel = $("<div>").ibxButton({glyphClasses: "fa fa-info"});
				helplabel.data('classinfo', {name:name});
				helplabel.css('margin-left', '5px');
				hbox.append(helplabel);
				helplabel.on("click", function (e)
				{
					var target = $(e.currentTarget);
					var classinfo = target.data('classinfo');

					var ctrls = "";
					for (var option in $['ibi'][classinfo.name].prototype.options)
					{
						ctrls += '<div data-ibx-type="ibxHBox"data-ibxp-align="center" data-ibxp-wrap="false" style="height:50px">' +
							'<div data-ibx-type="ibxLabel" data-ibxp-text="' + option + '" data-ibxp-justify="start"></div>' +
							'<div data-ibx-type="ibxLabel" data-ibxp-text="' + $['ibi'][classinfo.name].prototype.options[option] + '" data-ibxp-justify="start"></div>' +
						'</div>';
					}

					var options = $.ibi.ibxDialog.getStandardDialogOptions({autoClose:true, type:"question", "caption":classinfo.name + " Info"});
					var dlg = $.ibi.ibxDialog.createBaseStandardDialog(options).attr("data-ibx-nameroot", true);
					dlg.find(".ibx-dialog-content").prepend($(ctrls));
					ibx.bindElements(dlg);
					dlg.ibxDialog("open").on("ibx_beforeclose", function(e, closeInfo)
					{
						/*
						if(closeInfo != "cancel")
						{
							var widget = $(e.target).data("ibxWidget");
							var username = widget._userName.ibxTextField("option", "ctrlValue");
							var password = widget._password.ibxTextField("option", "ctrlValue");
							var res = ibfs.login(username, password, true, null, {async:false}).result;
							if(res.code != -1)
							{
								alert("Invalid username or password!");
								e.preventDefault();
							}
							else
								$(".list-items-button").trigger("click");
						}
						*/
					});
					return;
				});

				elem.append(hbox);

				var box = $("<div>").ibxVBox();
				box.css("margin-left", "100px");
				box.css("padding", "3px");
				box.css("border", "1px solid black");
				elem.append(box);
				for (var i = 0; i < wObjects.length; i++)
				{
					if (wObjects[i].parent == name)
						findChildren(wObjects[i].name, box);
				}
				if (box.children().length == 0)
				{
					label.data('ibxWidget').option('glyphClasses', '');
					box.detach();
				}

			}

			function wObject(name, parent)
			{
				this.name = name;
				this.parent = parent;
			}

			var wObjects = [];

		</script>
		<style type="text/css">
			body{margin:0px;}
			.title-cell
			{
			font-size: 1.5em;
			}
		</style>
	</head>
	<body class="ibx-root">

		<div class="ih-main-grid" data-ibx-type="ibxGrid" data-ibxp-cols="5% 1fr 5%" data-ibxp-rows="5% 1fr 5%">
			<div data-ibx-type="ibxLabel" class="title-cell" data-ibx-col="2" data-ibx-row="1" data-ibxp-text="IBX Objects Hierarchy"></div>
			<div data-ibx-col="2" data-ibx-row="2">
				<div class="ih-hier-wrapper" data-ibx-type="ibxVBox"></div>
			</div>
		</div>

	</body>
</html>
