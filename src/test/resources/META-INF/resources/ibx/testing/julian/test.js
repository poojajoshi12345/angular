		if(e.type == "focusin")
		{
			if(!this._widgetFocused)
			{
				this._widgetFocused = true;
				this.element.dispatchEvent("ibx_widgetfocus", e.originalEvent, false, false, e.relatedTarget);
			}

			//do the default focusing.
			if((options.focusDefault !== false))
			{
				//take the element out of the tab order so shift+tab will work and not focus this container.
				if(this.element.data("focusDefaultOrigTabIndex") === undefined)
					this.element.data("focusDefaultOrigTabIndex", this.element.prop("tabindex")).prop("tabindex", -1);

				//now manage focusing the first valid child.
				if(options.navKeyRoot)
					this.element.dispatchEvent("keydown", "NAV_KEY_ACTIVATE");
				else
				if(isTarget)
				{
					//focus default item...otherwise find first focusable item (ARIA needs SOMETHING to be focused on the popup)
					var defItem = this.element.find(options.focusDefault);
					defItem = defItem.length ? defItem : this.element.find(":ibxFocusable").first();
					defItem.focus();
				}
			}

			if(options.navKeyRoot && !isTarget)
			{
				//if we own the target, we are now nav active.
				this.element.addClass("ibx-nav-key-root-active");

				//de-activate all children, and activate the direct child that is/owns the target.
				this.navKeyChildren().each(function(target, idx, el)
				{
					var navKid = $(el);
					navKid.removeClass("ibx-nav-key-item-active ibx-ie-pseudo-focus");
					if(navKid.is(target) || $.contains(navKid[0], target))
					{
						navKid.addClass("ibx-nav-key-item-active").toggleClass("ibx-ie-pseudo-focus", ibxPlatformCheck.isIE);
						options.aria.activedescendant = navKid.prop("id");
					}
				}.bind(this, e.target));

				//config active descendant.
				this.setAccessibility();
			}
		}

function julian()
{
	alert("julian hyman");
}