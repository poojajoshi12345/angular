<%-- Copyright 1996-2016 Information Builders, Inc. All rights reserved. 
 $Revision$:
--%><%
	response.addHeader("Pragma", "no-cache");
	response.addHeader("Cache-Control", "no-cache");
%>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>ibx form sample</title>
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

				$(".open-menu-bar").on("click", function(e){$(".menu-bar").ibxCollapsible("toggle");});
				$(".menu-bar").ibxCollapsible({autoClose:true, direction:"right", startCollapsed:true}).on("ibx_beforeopen ibx_beforeclose", function(e)
				{
					if(e.type == "ibx_beforeopen")
						$(".open-menu-bar").css({opacity:0, transition:"opacity .3s"});
					else
						$(".open-menu-bar").css({opacity:1, transition:"opacity .3s"});
				});

				// Set today data to subtitle
				$('.form-subtitle').ibxWidget('option', 'text', new Date(Date.now()).toLocaleString());

				// Sort states
				$('.form-state-list').ibxWidget('sort', function (a, b)
				{
					var texta = $(a).ibxWidget('option', 'userValue').toLowerCase();
					var textb = $(b).ibxWidget('option', 'userValue').toLowerCase();
					if (texta < textb)
						return -1;
					else if (texta > textb)
						return 1;
					else
						return 0;
				});


				// Validate phone number

				function isDigit(key, code)
				{
					if (code == 37 || code == 39 || code == 8 || code == 46 || code == 9) // left/right/backspace/delete/tab
						return true;
					if (key && key.length > 1)
						return false;
					var reg = /^[0-9]+$/; // digits
					if (!reg.test(key))
						return false;
					else
						return true;
				}

				$('.form-phone-1').on('ibx_textchanging', function (e) 
				{
					if (!isDigit(e.key, e.keyCode))
						e.preventDefault();
				});
				$('.form-phone-2').on('ibx_textchanging', function (e) 
				{
					if (!isDigit(e.key, e.keyCode))
						e.preventDefault();
				});
				$('.form-phone-3').on('ibx_textchanging', function (e) 
				{
					if (!isDigit(e.key, e.keyCode))
						e.preventDefault();
				});

				$('.form-phone-1').on('ibx_textchanged', function (e) 
				{
					if ($(e.currentTarget).ibxWidget('option', 'text').length == 3)
						$('.form-phone-2 > input').focus(); // jump to next field
				});
				$('.form-phone-2').on('ibx_textchanged', function (e) 
				{
					if ($(e.currentTarget).ibxWidget('option', 'text').length == 3)
						$('.form-phone-3 > input').focus(); // jump to next field
				});

				// Update text for length of stay:
				$('.form-days-slider').on('ibx_change', function (e, data) 
				{
					$('.form-days-title').ibxWidget('option', 'text', 'Length of stay: ' + data.value + ' days');
				});

				// Add calendar widget
				$('.form-start-date').datepicker();
				$('.form-start-date').datepicker('setDate', new Date());
				$('.form-start-date').on('blur', function (e) { $(e.currentTarget).ibxRemoveClass('control-invalid');});

				// Disable notify text when not checked
				$('.form-notify-switch').on('ibx_change', function (e) 
				{
				  if ($(e.target).ibxWidget('checked'))
						$('.form-notify-title').ibxRemoveClass('form-notify-title-unchecked');
				  else
						$('.form-notify-title').ibxAddClass('form-notify-title-unchecked');
				});


				// Submit the form with error checking
				$('.form-submit-button').on('click', function (e) 
				{
					var message = "";
					var foundInvalid = false;

					// check first name
					if (!$(".form-first-name").ibxFormControl('getValue'))
					{
						$(".form-first-name").ibxFormControl('setInvalid', true);
						foundInvalid = true;
						message += "First name required.\n";
					}

					// check last name
					if (!$(".form-last-name").ibxFormControl('getValue'))
					{
						$(".form-last-name").ibxFormControl('setInvalid', true);
						foundInvalid = true;
						message += "Last name required.\n";
					}

					// check address line one
					if (!$(".form-address-street").ibxFormControl('getValue'))
					{
						$(".form-address-street").ibxFormControl('setInvalid', true);
						foundInvalid = true;
						message += "Stree Address required.\n";
					}

					// check city
					if (!$(".form-address-city").ibxFormControl('getValue'))
					{
						$(".form-address-city").ibxFormControl('setInvalid', true);
						foundInvalid = true;
						message += "City required.\n";
					}

					// check state
					if (!$(".form-state").ibxFormControl('getValue'))
					{
						$(".form-state").ibxFormControl('setInvalid', true);
						foundInvalid = true;
						message += "State required.\n";
					}

					// set phone number
					var phone1 = $('.form-phone-1').ibxWidget('option', 'text'); 
					var phone2 = $('.form-phone-2').ibxWidget('option', 'text'); 
					var phone3 = $('.form-phone-3').ibxWidget('option', 'text'); 
					if (phone1 || phone2 || phone3)
						$('.form-phone').ibxFormControl('setValue', '(' + phone1 + ') ' + phone2 + '-' + phone3);
					else
						$('.form-phone').ibxFormControl('setValue', '');

					// check email
					if (!$(".form-email").ibxFormControl('getValue'))
					{
						$(".form-email").ibxFormControl('setInvalid', true);
						foundInvalid = true;
						message += "Email required.\n";
					}

					// check start date
					if (!$('.form-start-date').val())
					{
						$(".form-start-date").ibxAddClass('control-invalid');
						foundInvalid = true;
						message += "Start date required.\n";
					}

					if (!foundInvalid)
						$('.form-wrapper')[0].submit();
					else
						alert(message);
				});

			}, true);
		</script>

		<style type="text/css">

		html, body
		{
			margin: 0px;
		}

		.form-wrapper
		{
			font-family: "Lucida Grande","Lucida Sans Unicode", Tahoma, sans-serif;
			text-align: center;
			margin: 10px;
			flex: 1 1 auto;
			width: 45%;
		}

		.info-wrapper
		{
			min-height: 500px;
			margin: 30px;
			flex: 1 1 auto;
			width: 45%;
		}

		@media (max-width: 1300px) {
			.form-wrapper {
				width: 95%;
			}
			.info-wrapper {
				width: 95%;
			}
		}


		.form-grid
		{
			width: 600px;
			margin-left: auto;
			margin-right: auto;
			box-shadow: 0 2px 4px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12);
			padding: 10px;
		}

		.form-title
		{
			letter-spacing: .01em;
			font-size: 2em;
			font-weight: bold;
		}

		.form-heading
		{
			overflow: hidden;
		}

		.form-subtitle
		{
			padding-bottom: 5px;
			border-bottom: 1px solid #ccc;
		}

		.form-field-title
		{
			font-weight: bold;
			margin-top: 10px;
		}

		.form-field-label
		{
			font-weight: bold;
		}

		.form-field-subtitle
		{
			font-size: 0.8em;
			margin-top: 5px;
		}

		.form-col1
		{
			margin-right: 20px;
			margin-top: 5px;
			margin-bottom: 10px;
		}

		.form-col2
		{
			margin-top: 5px;
			margin-bottom: 10px;
		}

		.form-col12
		{
			margin-top: 5px;
			margin-bottom: 10px;
		}

		.form-star.ibx-label-glyph.ibx-glyph-spacer
		{
			margin-left:.5em;
		}

		.form-star
		{
		  color: red;
		}

		.form-phone-1
		{
			width: 2em;
			margin-right: 10px;
		}

		.form-phone-2
		{
			width: 2em;
			margin-right: 10px;
		}

		.form-phone-3
		{
			width: 3em;
		}

		.form-state-list
		{
			width: auto;
		}

		.form-days-slider
		{
		}

		.form-days-slider .ibx-slider-wrapper-horizontal
		{
			margin-left: 0px;
			margin-right: 0px;
		}

		.form-start-date
		{
			margin-right: 10px;
			margin-top: 5px;
			margin-bottom: 10px;
		}

		.form-state-list-class
		{
			max-height: 400px;
			overflow: auto;
		}

		.form-accommodation-list
		{
			width: auto;
			height: 100px;
			overflow: auto;
		}

		.form-room-list
		{
			width: auto;
		}

		.form-notify-title
		{
			font-weight: bold;
			margin-right: 10px;
		}

		.form-notify-title-unchecked
		{
			color: #ccc;
		}

		.form-submit-button
		{
			font-weight: bold;
			padding-left: 2em;
			padding-right: 2em;
		}

		.form-ticket-page
		{
			padding: 10px;
		}

		.form-ticket-spinner
		{
			margin-left: 10px;
			margin-right: 10px;
		    min-width: 3.5em;
		}


		.info-list
		{
			width: auto;
			margin: 10px;
			border: 0px;
		}

		.info-bullet
		{
			margin-bottom: 5px;
		}

		.menu-bar
		{
			font-size:.8em;
		}


		</style>

	</head>
	<body class="ibx-root">

		<div class="outer" data-ibx-type="ibxHBox" data-ibxp-justify="stretch" data-ibxp-align="stretch" data-ibxp-wrap="true">

			<form class="form-wrapper" data-ibx-type="ibxForm" action="formsubmit.jsp" acceptCharset="ISO-8859-1" target="outframe" method="get">
				<div class="form-grid" data-ibx-type="ibxGrid" data-ibxp-cols="1fr 1fr">

					<!-- Title -->
					<div class="form-heading" data-ibx-type="ibxHBox" data-ibxp-align="center" data-ibx-row="1" data-ibx-col="1/span 2">
						<div class="form-title" data-ibx-type="ibxLabel">Registration Form</div>
						<div style="flex: 1 1 auto;"></div>
						<div class="open-menu-bar" title="Show AutoClose Menu Bar" data-ibx-type="ibxButton" data-ibxp-glyph="menu" data-ibxp-glyph-classes="material-icons"></div>
						<div class="menu-bar" data-ibx-type="ibxHBox" data-ibxp-align="center">
							<div class="menu-btn-admin menu-button" data-menu=".menu-home" data-ibx-type="ibxButton">Home</div>
							<div class="menu-btn-admintion menu-button" data-menu=".menu-contact" data-ibx-type="ibxButton">Contact</div>
							<div class="menu-btn-help menu-button" data-menu=".menu-help" data-ibx-type="ibxButton">Help</div>
							<div class="btn-signout" data-ibx-type="ibxButton">Login</div>
						</div>
					</div>

					<!-- Subtitle - current date and time -->
					<div class="form-subtitle" data-ibx-type="ibxLabel" data-ibx-row="2" data-ibx-col="1/span 2"></div>

					<!-- Name -->
					<div class="form-field-title" data-ibx-type="ibxLabel" data-ibx-row="3" data-ibx-col="1/span 2" data-ibxp-glyph="*" data-ibxp-glyph-classes="form-star" data-ibxp-icon-position="right">Name</div>

					<!-- First name -->
					<div class="form-col1" data-ibx-type="ibxTextField" data-ibxp-placeholder="First" data-ibx-row="4" data-ibx-col="1">
						<div class="form-first-name" data-ibx-type="ibxFormControl" data-ibxp-name="first_name"></div>
					</div>

					<!-- Last name -->
					<div class="form-col2" data-ibx-type="ibxTextField" data-ibxp-placeholder="Last" data-ibx-row="4" data-ibx-col="2">
						<div class="form-last-name" data-ibx-type="ibxFormControl" data-ibxp-name="last_name"></div>
					</div>

					<!-- Address -->
					<div class="form-field-title" data-ibx-type="ibxLabel" data-ibxp-glyph="*" data-ibxp-glyph-classes="form-star" data-ibxp-icon-position="right" data-ibx-row="5" data-ibx-col="1/span 2">Address</div>

					<!-- Address one -->
					<div class="form-col1" data-ibx-type="ibxTextField" data-ibxp-placeholder="Street Address" data-ibx-row="6" data-ibx-col="1">
						<div class="form-address-street" data-ibx-type="ibxFormControl" data-ibxp-name="address_street_one"></div>
					</div>

					<!-- Address two -->
					<div class="form-col2" data-ibx-type="ibxTextField" data-ibxp-placeholder="Address Line2" data-ibx-row="6" data-ibx-col="2">
						<div class="form-address-street-two" data-ibx-type="ibxFormControl" data-ibxp-name="address_street_two"></div>
					</div>

					<!-- City -->
					<div class="form-col1" data-ibx-type="ibxTextField" data-ibxp-placeholder="City" data-ibx-align="end" data-ibx-row="7" data-ibx-col="1">
						<div class="form-address-city" data-ibx-type="ibxFormControl" data-ibxp-name="address_city"></div>
					</div>

					<!-- States -->
					<div class="form-col2 form-state-list" data-ibx-type="ibxListBox" data-ibxp-placeholder="State" data-ibxp-list-classes="form-state-list-class" data-ibx-row="7" data-ibx-col="2">
						<div class="form-state" data-ibx-type="ibxFormControl" data-ibxp-name="address_state"></div>
						<div data-ibx-type="ibxSelectGroup" data-ibxp-glyph="" data-ibxp-glyph-classes="fa fa-globe">West
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="AZ">Arizona</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="CO">Colorado</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="ID">Idaho</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="MT">Montana</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="NV">Nevada</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="NM">New Mexico</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="UT">Utah</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="WY">Wyoming</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="AK">Alaska</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="CA">California</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="HI">Hawaii</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="OR">Oregon</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="WA">Washington</div>
						</div>
						<div data-ibx-type="ibxSelectGroup" data-ibxp-glyph="" data-ibxp-glyph-classes="fa fa-globe">Northeast
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="CT">Connecticut</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="ME">Maine</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="MA">Massachusetts</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="NH">New Hampshire</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="RI">Rhode Island</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="VT">Vermont</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="NJ">New Jersey</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="NY">New York</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="DE">Delaware</div>
						</div>
						<div data-ibx-type="ibxSelectGroup" data-ibxp-glyph="" data-ibxp-glyph-classes="fa fa-globe">Midwest
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="IL">Illinois</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="IN">Indiana</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="MI">Michigan</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="OH">Ohio</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="WI">Wisconsin</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="IA">Iowa</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="KS">Kansas</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="MN">Minnesota</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="MO">Missouri</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="NE">Nebraska</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="ND">North Dakota</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="SD">South Dakota</div>
						</div>
						<div data-ibx-type="ibxSelectGroup" data-ibxp-glyph="" data-ibxp-glyph-classes="fa fa-globe">South
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="FL">Florida</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="GA">Georgia</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="MD">Maryland</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="NC">North Carolina</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="SC">South Carolina</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="VA">Virginia</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="DC">District of Columbia</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="WV">West Virginia</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="AL">Alabama</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="KY">Kentucky</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="MS">Mississippi</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="TN">Tennessee</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="AR">Arkansas</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="LA">Louisiana</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="OK">Oklahoma</div>
							<div data-ibx-type="ibxSelectItem" data-ibxp-user-value="TX">Texas</div>
						</div>
					</div>

					<!-- Phone -->
					<div data-ibx-type="ibxVBox" data-ibx-row="8" data-ibx-col="1">
						<div class="form-field-title" data-ibx-type="ibxLabel">Phone</div>
						<div data-ibx-type="ibxHBox">
							<div class="form-phone" data-ibx-type="ibxFormControl" data-ibxp-name="phone"></div>
							<div class="form-phone-1" data-ibx-type="ibxTextField" data-ibxp-max-length="3" data-ibxp-placeholder="xxx"></div>
							<div class="form-phone-2" data-ibx-type="ibxTextField" data-ibxp-max-length="3" data-ibxp-placeholder="xxx"></div>
							<div class="form-phone-3" data-ibx-type="ibxTextField" data-ibxp-max-length="4" data-ibxp-placeholder="xxxx"></div>
						</div>
					</div>

					<!-- Email -->
					<div data-ibx-type="ibxVBox" data-ibx-row="8" data-ibx-col="2" data-ibxp-align="stretch">
						<div class="form-field-title" data-ibx-type="ibxLabel" data-ibxp-glyph="*" data-ibxp-glyph-classes="form-star" data-ibxp-icon-position="right">Email</div>
						<div class="form-col2" data-ibx-type="ibxTextField" data-ibxp-placeholder="one@email.com">
							<div class="form-email" data-ibx-type="ibxFormControl" data-ibxp-name="email"></div>
						</div>
					</div>

					<!-- Starting Date -->
					<div class="form-col1 form-field-title" data-ibx-type="ibxLabel" data-ibx-row="9" data-ibx-col="1" data-ibxp-glyph="*" data-ibxp-glyph-classes="form-star" data-ibxp-icon-position="right">Starting Date</div>
					<input type="text" class="form-col1 form-start-date" data-ibx-row="10" data-ibx-col="1" name="start_date" data-ibx-justify="start"/>

					<!-- Length of Stay -->
					<div class="form-col2 form-field-title form-days-title" data-ibx-type="ibxLabel" data-ibx-row="9" data-ibx-col="2">Length of stay: 5 days</div>
					<div class="form-col2 form-days-slider" data-ibx-type="ibxHSlider" data-ibxp-min="2" data-ibxp-max="10" data-ibxp-value="5" data-ibx-row="10" data-ibx-col="2">
						<div class="form-length" data-ibx-type="ibxFormControl" data-ibxp-name="length"></div>
					</div>

					<!-- Accommodation Options -->
					<div class="form-field-title" data-ibx-type="ibxLabel" data-ibx-row="11" data-ibx-col="1">Accommodation Options</div>
					<div class="form-field-subtitle" data-ibx-type="ibxLabel" data-ibx-row="12" data-ibx-col="1">"(Check all that applies)"</div>
					<div class="form-col1 form-accommodation-list" data-ibx-type="ibxList" data-ibxp-multi-select="true" data-ibx-row="13" data-ibx-col="1">
						<div class="form-accommodation" data-ibx-type="ibxFormControl" data-ibxp-name="accommodation"></div>
						<div data-ibx-type="ibxSelectCheckItem" data-ibxp-user-value="roommate">Need Roommate</div>
						<div data-ibx-type="ibxSelectCheckItem" data-ibxp-user-value="late" data-ibxp-selected="true">Late Arrival</div>
						<div data-ibx-type="ibxSelectCheckItem" data-ibxp-user-value="smoking">Smoking</div>
						<div data-ibx-type="ibxSelectCheckItem" data-ibxp-user-value="bar">Full bar</div>
						<div data-ibx-type="ibxSelectCheckItem" data-ibxp-user-value="big_tv">Big screen tv</div>
						<div data-ibx-type="ibxSelectCheckItem" data-ibxp-user-value="spa">In-room spa</div>
						<div data-ibx-type="ibxSelectCheckItem" data-ibxp-user-value="fireplace">Fireplace</div>
						<div data-ibx-type="ibxSelectCheckItem" data-ibxp-user-value="safe">Safe</div>
					</div>

					<!-- Room Type -->
					<div class="form-field-title" data-ibx-type="ibxLabel" data-ibx-row="11" data-ibx-col="2">Room Type</div>
					<div class="form-field-subtitle" data-ibx-type="ibxLabel" data-ibx-row="12" data-ibx-col="2"></div>
					<div class="form-col2 form-room-list" data-ibx-type="ibxList" data-ibx-row="13" data-ibx-col="2">
						<div class="form-room" data-ibx-type="ibxFormControl" data-ibxp-name="room"></div>
						<div data-ibx-type="ibxSelectRadioItem" data-ibxp-user-value="single">Single</div>
						<div data-ibx-type="ibxSelectRadioItem" data-ibxp-user-value="double">Double</div>
						<div data-ibx-type="ibxSelectRadioItem" data-ibxp-user-value="deluxe" data-ibxp-selected="true">Deluxe</div>
						<div data-ibx-type="ibxSelectRadioItem" data-ibxp-user-value="extra">Extra Deluxe</div>
					</div>

					<!-- Cabin -->
					<div class="form-field-title" data-ibx-type="ibxLabel" data-ibx-row="14" data-ibx-col="1/span 2">Cabin</div>
					<div class="form-col12 form-cabin" data-ibx-type="ibxHSelectionButtonGroup" data-ibxp-name="cabin" data-ibx-row="15" data-ibx-col="1/span 2">
						<div class="form-cabin" data-ibx-type="ibxFormControl" data-ibxp-name="cabin"></div>
						<div tabindex="1" data-ibx-type="ibxRadioButton" data-ibxp-user-value="inside" data-ibxp-justify="center">Inside</div>
						<div tabindex="1" data-ibx-type="ibxRadioButton" data-ibxp-user-value="outside" data-ibxp-justify="center">Outside</div>
						<div tabindex="1" data-ibx-type="ibxRadioButton" data-ibxp-user-value="balcony" data-ibxp-justify="center" data-ibxp-checked="true">Balcony</div>
						<div tabindex="1" data-ibx-type="ibxRadioButton" data-ibxp-user-value="suite" data-ibxp-justify="center">Suite</div>
					</div>

					<!-- Tickets -->
					<div class="form-field-title" data-ibx-type="ibxLabel" data-ibx-row="16" data-ibx-col="1/span 2">Show Tickets</div>
					<div data-ibx-type="ibxTabPane" data-ibx-row="17" data-ibx-col="1/span 2">
						<div class="form-ticket-page" data-ibx-type="ibxTabPage" data-ibxp-text="Hamilton" data-ibxp-selected="true">
							<div data-ibx-type="ibxHBox" data-ibxp-align="center">
								<div class="form-field-label" data-ibx-type="ibxLabel">Select number of tickets:</div>
								<div class="form-ticket-spinner" data-ibx-type="ibxSpinner" data-ibxp-min="0" data-ibxp-max="4" data-ibxp-value="2">
									<div class="form-ticket" data-ibx-type="ibxFormControl" data-ibxp-name="tickets_hamilton"></div>
								</div>
								<div class="form-field-label" data-ibx-type="ibxLabel">Limit 4 per customer.</div>
							</div>
						</div>
						<div class="form-ticket-page" data-ibx-type="ibxTabPage" data-ibxp-text="Wicked">
							<div data-ibx-type="ibxHBox">
								<div class="form-field-label" data-ibx-type="ibxLabel">Select number of tickets:</div>
								<div class="form-ticket-spinner" data-ibx-type="ibxSpinner" data-ibxp-min="0" data-ibxp-max="4" data-ibxp-value="2">
									<div class="form-ticket" data-ibx-type="ibxFormControl" data-ibxp-name="tickets_wicked"></div>
								</div>
								<div class="form-field-label" data-ibx-type="ibxLabel">Limit 4 per customer.</div>
							</div>
						</div>
						<div class="form-ticket-page" data-ibx-type="ibxTabPage" data-ibxp-text="Chicago">
							<div data-ibx-type="ibxHBox">
								<div class="form-field-label" data-ibx-type="ibxLabel">Select number of tickets:</div>
								<div class="form-ticket-spinner" data-ibx-type="ibxSpinner" data-ibxp-min="0" data-ibxp-max="4" data-ibxp-value="2">
									<div class="form-ticket" data-ibx-type="ibxFormControl" data-ibxp-name="tickets_chicago"></div>
								</div>
								<div class="form-field-label" data-ibx-type="ibxLabel">Limit 4 per customer.</div>
							</div>
						</div>
					</div>

					<!-- Comments -->
					<div class="form-field-title" data-ibx-type="ibxLabel" data-ibx-row="18" data-ibx-col="1/span 2">Comments</div>
					<div class="form-col12" data-ibx-type="ibxTextArea" data-ibxp-rows="3" data-ibx-row="19" data-ibx-col="1/span 2">
						<div class="form-comments" data-ibx-type="ibxFormControl" data-ibxp-name="comments"></div>
					</div>

					<!-- Notify -->
					<div class="form-col12" data-ibx-type="ibxHBox" data-ibxp-align="center" data-ibx-row="20" data-ibx-col="1/span 2">
						<div class="form-notify-title" data-ibx-type="ibxLabel">Notify me when booking complete</div>
						<div tabindex="1" class="form-notify-switch" data-ibx-type="ibxSwitch" data-ibxp-checked="true" data-ibxp-user-value="true">
							<div class="form-notify" data-ibx-type="ibxFormControl" data-ibxp-name="notify"></div>
						</div>
					</div>

					<!-- Submit -->
					<div tabindex="1" class="form-submit-button" data-ibx-type="ibxButton"data-ibx-row="21" data-ibx-col="1" data-ibx-justify="start">Submit</div>
				</div>
			</form>

			<div class="info-wrapper" data-ibx-type="ibxVBox" data-ibxp-align="stretch">
				<div class="form-field-title" data-ibx-type="ibxLabel">This sample form illustrates the usage of some ibx objects and concepts:</div>
				<div class="info-list" data-ibx-type="ibxList">
					<div class="info-bullet" data-ibx-type="ibxSelectItem" data-ibxp-glyph="done" data-ibxp-glyph-classes="material-icons">The use of ibxGrid to create a two-column form, with some rows spanning 2 columns.</div>
					<div class="info-bullet" data-ibx-type="ibxSelectItem" data-ibxp-glyph="done" data-ibxp-glyph-classes="material-icons">Using basic ibx controls like ibxLabel, ibxTextField, ibxTextArea, ibxSelect, ibxSlider, ibxSpinner, ibxButton, ibxSwitch.</div>
					<div class="info-bullet" data-ibx-type="ibxSelectItem" data-ibxp-glyph="done" data-ibxp-glyph-classes="material-icons">The use of the ibxFormControl widget to attach form fields to any widget.</div>
					<div class="info-bullet" data-ibx-type="ibxSelectItem" data-ibxp-glyph="done" data-ibxp-glyph-classes="material-icons">Using various ibxSelect control types, like ibxListBox and ibxList.</div>
					<div class="info-bullet" data-ibx-type="ibxSelectItem" data-ibxp-glyph="done" data-ibxp-glyph-classes="material-icons">Using groups in an ibxSelect control.</div>
					<div class="info-bullet" data-ibx-type="ibxSelectItem" data-ibxp-glyph="done" data-ibxp-glyph-classes="material-icons">Sorting groups/items in an ibxSelect control.</div>
					<div class="info-bullet" data-ibx-type="ibxSelectItem" data-ibxp-glyph="done" data-ibxp-glyph-classes="material-icons">Grouping radio buttons with ibxHSelectionButtonGroup.</div>
					<div class="info-bullet" data-ibx-type="ibxSelectItem" data-ibxp-glyph="done" data-ibxp-glyph-classes="material-icons">Using jQuery UI calendar widget.</div>
					<div class="info-bullet" data-ibx-type="ibxSelectItem" data-ibxp-glyph="done" data-ibxp-glyph-classes="material-icons">Filtering out characters for the phone field.</div>
					<div class="info-bullet" data-ibx-type="ibxSelectItem" data-ibxp-glyph="done" data-ibxp-glyph-classes="material-icons">Responding to change events from different widgets.</div>
					<div class="info-bullet" data-ibx-type="ibxSelectItem" data-ibxp-glyph="done" data-ibxp-glyph-classes="material-icons">Validating form fields before submitting.</div>
				</div>
				<div class="form-field-title" data-ibx-type="ibxLabel">Submitted information:</div>
				<iframe style="flex: 1 1 auto;" name="outframe"></iframe>
			</div>

		</div>
	</body>
</html>
