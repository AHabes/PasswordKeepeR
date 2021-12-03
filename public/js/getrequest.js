$( document ).ready(function() {
	const MINIMUM_PASSWORD_LENGTH = 8;
	console.log('  const MINIMUM_PASSWORD_LENGTH = 8;', MINIMUM_PASSWORD_LENGTH)
	// GET REQUEST
	$("#allCustomers").click(function(event){
		event.preventDefault();
		ajaxGet();
	});
	
	// DO GET
	function ajaxGet(){
		console.log('ajaxGet ====')
		$.ajax({
			type : "GET",
			url : window.location + "api/customers/all",
			success: function(result){
				$('#getResultDiv ul').empty();
				var custList = "";
				$.each(result, function(i, customer){
					$('#getResultDiv .list-group').append(customer.firstname + " " + customer.lastname + "<br>")
				});
				console.log("Success: ", result);
			},
			error : function(e) {
				$("#getResultDiv").html("<strong>Error</strong>");
				console.log("ERROR: ", e);
			}
		});	
	}
})