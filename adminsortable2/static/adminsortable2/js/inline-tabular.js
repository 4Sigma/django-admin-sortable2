django.jQuery(function($) {
	$("script.inline-tabular-config").each(function (i, config_element) {
		try {
			var config = JSON.parse(config_element.textContent);
		}
		catch (parse_error) {
			console.error("Configuration for a django-adminsortable2 inline-tabular form is invalid.");
		}
		$("#" + config["prefix"] + "-group .tabular.inline-related tbody tr").tabularFormset($('this').selector, config);
	});
});
