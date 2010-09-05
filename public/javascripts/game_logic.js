$(document).ready(function(){
	$("#turn").click(function(event){
		$("#turn").text = "Flipping cards...";
		$("#result").load('/turn');
	});
});