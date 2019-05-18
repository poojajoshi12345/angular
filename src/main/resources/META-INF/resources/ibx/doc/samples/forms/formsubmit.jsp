<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. $Revision: 1.1 $:--%>
<%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html>
	<head>
		<title>Form Result</title>
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


			ibx(function()
			{


			}, applicationContext + "/ibx/", '.ibx-root');
		</script>

		<style type="text/css">

		html, body
		{
			margin: 0px;
			font-family: "Lucida Grande","Lucida Sans Unicode", Tahoma, sans-serif;
		}

		.param-name-title
		{
			font-weight: bold;
			font-size: 1.2em;
			padding: 5px;
		}

		.param-value-title
		{
			font-weight: bold;
			font-size: 1.2em;
			padding: 5px;
		}

		.param-name
		{
			padding: 5px;
		}

		.param-value
		{
			padding: 5px;
		}


		</style>

	</head>
	<body class="ibx-root">

		<div class="form-grid" data-ibx-type="ibxGrid" data-ibxp-cols="150px 1fr">

			<div class="param-name-title" data-ibx-type="ibxLabel" data-ibxp-text="Parameter" data-ibx-row="1" data-ibx-col="1"></div>
			<div class="param-value-title" data-ibx-type="ibxLabel" data-ibxp-text="Value" data-ibx-row="1" data-ibx-col="2"></div>
			<div class="param-name" data-ibx-type="ibxLabel" data-ibxp-text="first_name" data-ibx-row="2" data-ibx-col="1"></div>
			<div class="param-value" data-ibx-type="ibxLabel" data-ibxp-text="<%= request.getParameter("first_name") %>" data-ibx-row="2" data-ibx-col="2"></div>
			<div class="param-name" data-ibx-type="ibxLabel" data-ibxp-text="last_name" data-ibx-row="3" data-ibx-col="1"></div>
			<div class="param-value" data-ibx-type="ibxLabel" data-ibxp-text="<%= request.getParameter("last_name") %>" data-ibx-row="3" data-ibx-col="2"></div>
			<div class="param-name" data-ibx-type="ibxLabel" data-ibxp-text="address_street_one" data-ibx-row="4" data-ibx-col="1"></div>
			<div class="param-value" data-ibx-type="ibxLabel" data-ibxp-text="<%= request.getParameter("address_street_one") %>" data-ibx-row="4" data-ibx-col="2"></div>
			<div class="param-name" data-ibx-type="ibxLabel" data-ibxp-text="address_street_two" data-ibx-row="5" data-ibx-col="1"></div>
			<div class="param-value" data-ibx-type="ibxLabel" data-ibxp-text="<%= request.getParameter("address_street_two") %>" data-ibx-row="5" data-ibx-col="2"></div>
			<div class="param-name" data-ibx-type="ibxLabel" data-ibxp-text="address_city" data-ibx-row="6" data-ibx-col="1"></div>
			<div class="param-value" data-ibx-type="ibxLabel" data-ibxp-text="<%= request.getParameter("address_city") %>" data-ibx-row="6" data-ibx-col="2"></div>
			<div class="param-name" data-ibx-type="ibxLabel" data-ibxp-text="address_state" data-ibx-row="7" data-ibx-col="1"></div>
			<div class="param-value" data-ibx-type="ibxLabel" data-ibxp-text="<%= request.getParameter("address_state") %>" data-ibx-row="7" data-ibx-col="2"></div>
			<div class="param-name" data-ibx-type="ibxLabel" data-ibxp-text="phone" data-ibx-row="8" data-ibx-col="1"></div>
			<div class="param-value" data-ibx-type="ibxLabel" data-ibxp-text="<%= request.getParameter("phone") %>" data-ibx-row="8" data-ibx-col="2"></div>
			<div class="param-name" data-ibx-type="ibxLabel" data-ibxp-text="email" data-ibx-row="9" data-ibx-col="1"></div>
			<div class="param-value" data-ibx-type="ibxLabel" data-ibxp-text="<%= request.getParameter("email") %>" data-ibx-row="9" data-ibx-col="2"></div>
			<div class="param-name" data-ibx-type="ibxLabel" data-ibxp-text="start_date" data-ibx-row="10" data-ibx-col="1"></div>
			<div class="param-value" data-ibx-type="ibxLabel" data-ibxp-text="<%= request.getParameter("start_date") %>" data-ibx-row="10" data-ibx-col="2"></div>
			<div class="param-name" data-ibx-type="ibxLabel" data-ibxp-text="length" data-ibx-row="11" data-ibx-col="1"></div>
			<div class="param-value" data-ibx-type="ibxLabel" data-ibxp-text="<%= request.getParameter("length") %>" data-ibx-row="11" data-ibx-col="2"></div>
			<div class="param-name" data-ibx-type="ibxLabel" data-ibxp-text="accommodation" data-ibx-row="12" data-ibx-col="1"></div>
			<div class="param-value" data-ibx-type="ibxLabel" data-ibxp-text="<%= request.getParameter("accommodation") %>" data-ibx-row="12" data-ibx-col="2"></div>
			<div class="param-name" data-ibx-type="ibxLabel" data-ibxp-text="room" data-ibx-row="13" data-ibx-col="1"></div>
			<div class="param-value" data-ibx-type="ibxLabel" data-ibxp-text="<%= request.getParameter("room") %>" data-ibx-row="13" data-ibx-col="2"></div>
			<div class="param-name" data-ibx-type="ibxLabel" data-ibxp-text="cabin" data-ibx-row="14" data-ibx-col="1"></div>
			<div class="param-value" data-ibx-type="ibxLabel" data-ibxp-text="<%= request.getParameter("cabin") %>" data-ibx-row="14" data-ibx-col="2"></div>
			<div class="param-name" data-ibx-type="ibxLabel" data-ibxp-text="tickets_hamilton" data-ibx-row="15" data-ibx-col="1"></div>
			<div class="param-value" data-ibx-type="ibxLabel" data-ibxp-text="<%= request.getParameter("tickets_hamilton") %>" data-ibx-row="15" data-ibx-col="2"></div>
			<div class="param-name" data-ibx-type="ibxLabel" data-ibxp-text="tickets_wicked" data-ibx-row="16" data-ibx-col="1"></div>
			<div class="param-value" data-ibx-type="ibxLabel" data-ibxp-text="<%= request.getParameter("tickets_wicked") %>" data-ibx-row="16" data-ibx-col="2"></div>
			<div class="param-name" data-ibx-type="ibxLabel" data-ibxp-text="tickets_chicago" data-ibx-row="17" data-ibx-col="1"></div>
			<div class="param-value" data-ibx-type="ibxLabel" data-ibxp-text="<%= request.getParameter("tickets_chicago") %>" data-ibx-row="17" data-ibx-col="2"></div>
			<div class="param-name" data-ibx-type="ibxLabel" data-ibxp-text="comments" data-ibx-row="18" data-ibx-col="1"></div>
			<div class="param-value" data-ibx-type="ibxLabel" data-ibxp-text="<%= request.getParameter("comments") %>" data-ibx-row="18" data-ibx-col="2"></div>
			<div class="param-name" data-ibx-type="ibxLabel" data-ibxp-text="notify" data-ibx-row="19" data-ibx-col="1"></div>
			<div class="param-value" data-ibx-type="ibxLabel" data-ibxp-text="<%= request.getParameter("notify") %>" data-ibx-row="19" data-ibx-col="2"></div>

		</div>
	</body>
</html>


