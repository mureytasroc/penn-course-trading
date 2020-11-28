var Admin = require(__dirname + '/models/Admin');
var request = require('request');

function getCrossListings(c, callback){
	Admin.getCreds(function(creds){
		const requestOptions = {
				url: 'https://esb.isc-seo.upenn.edu/8091/open_data/course_section_search?course_id='+c.replace(/-/g, "")+'',
				method: 'GET',
				headers: creds
		};
		request(requestOptions, function(err, response, body) {
			var parsedBody=JSON.parse(body)
			var result_data = parsedBody["result_data"]
			callback(result_data.map(m=>{return m.crosslistings.map(e=>{return e.subject+'-'+e.course_id+'-'+e.section_id})})[0] )
		});
	})
}

function getNumPages(qparams, callback) {
	Admin.getCreds(function(creds){
		const requestOptions = {
				url: 'https://esb.isc-seo.upenn.edu/8091/open_data/course_section_search?'+qparams,
				method: 'GET',
				headers: creds
		};
		request(requestOptions, function(err, response, body) {
			var parsedBody=JSON.parse(body)
			callback(parsedBody["service_meta"]["number_of_pages"])
		});
	})
}

function getSections(qparams, callback) {
	num_pages = getNumPages(qparams+'&page_number=1&number_of_results_per_page=200', function(num_pages){
		console.log("num_pages: " + num_pages.toString())

		Admin.getCreds(function(creds){
			function loop_fun(i, result) {
				const requestOptions = {
						url: 'https://esb.isc-seo.upenn.edu/8091/open_data/course_section_search?'+qparams+'&page_number='+i.toString()+'&number_of_results_per_page=200',
						method: 'GET',
						headers: creds
				};
				request(requestOptions, function(err, response, body) {
					var parsedBody=JSON.parse(body)
					var result_data = parsedBody["result_data"]
					result = result.concat(result_data.map(m=>{return [m.section_id_normalized].concat(m.crosslistings.map(e=>{return e.subject+'-'+e.course_id+'-'+e.section_id}))}))
					if (i < num_pages) {
						console.log("Done with "+i.toString())
						loop_fun(i+1, result)
					} else{
						callback(result)
					}
				});
			}
			loop_fun(1, [])
		})

	})
}

function hasEng(x) {
	return x.reduce((acc, cur) => {return acc || cur.includes("MEAM") ||
	cur.includes("EAS") || cur.includes("ESE") || cur.includes("CIS") || cur.includes("IPD")
  || cur.includes("CBE") || cur.includes("CBE")}, initialValue=false)
}

function hasWharton(x) {
	return x.reduce((acc, cur) => {return acc || cur.includes("MGMT") ||
	cur.includes("STAT") || cur.includes("OPIM") ||
	cur.includes("MKTG")|| cur.includes("FNCE")}, initialValue=false)
}

getSections("course_id=", function(res) {
	console.log(res.filter(x => {return hasEng(x) && hasWharton(x)}))
})
