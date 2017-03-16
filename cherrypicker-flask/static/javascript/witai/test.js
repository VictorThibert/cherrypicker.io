function askQuery(){

	var query_text = document.getElementById('text').value

	console.log(query_text);

	// http request to 
	$.getJSON('http://localhost:5000/witai/test/ask_query', {
		// paramater arguments to pass
		'query': query_text,
	}, function(data) {
		console.log(data);
	});
}

function isEnter(key){
	if(event.keyCode == 13) {
        askQuery();      
    }

}