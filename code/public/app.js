var modal = document.getElementById('myModal');

// Get the button that opens the modal
const btn = $(".myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal 
let buttonId

$(".myBtn").on("click", function(){
    modal.style.display = "block";
    buttonId = $(this).attr("data-id");
    
})

$("#submit").on("click", function(){
    let text = $("#notetext").val();
    console.log(text);
    console.log(buttonId);

    let body = {buttonId: buttonId, text:text}
    $.post("/add-note", body, function(response){
        console.log("response" + response);
        
    })
})
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
