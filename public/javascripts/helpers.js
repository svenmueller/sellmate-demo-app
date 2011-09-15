function addClickHandler() {
	$('#collection li.collection-item').each(function(i, item) {
		$(item).click(function() {
			location.href = $(item).find('a').attr('href');
		});
	});
}