var modal = $("#myModal");

// Get the button that opens the modal
const btn = $(".myBtn");

// Get the <span> element that closes the modal
var span = $(".close")[0];

// When the user clicks on the button, open the modal
let articleId;

//MODAL JS ==================================
$(".myBtn").on("click", function() {
  modal.show();
  articleId = $(this).attr("data-id");
});

span.onclick = function() {
  modal.hide();
};

window.onclick = function(event) {
  if (event.target == modal) {
    modal.hide();
  }
};

//==============================================

$("#submit").on("click", function() {
  let text = $("#notetext").val();
  let title = $("#notetitle").val();
  let body = { articleId: articleId, text: text, title: title };

  $.post(`/notes/${articleId}`, body, function(response) {});
  setTimeout(function() {
    $("#notetext").val("");
    $("notetitle").val("");
    modal.hide();
    alert("Note added successfully!");
  }, 500);
});

$(".viewNote").on("click", function() {
    $("#notes").empty();
  articleId = $(this).attr("data-id");

  $.get(`/articles/${articleId}`, function(response) {}).then(function(data) {
   
    for (var i = 0; i < data.note.length; i++){
      $("#notes").append(`<div class="artNotes"><h2>${data.note[i].title}</h2><p>${data.note[i].text}</p><button class="edit" data-id="${data.note[i]._id}">Edit</button></div>`)
    }

    if (!data.note[0]) {
    alert("There are no notes at this time")
    }
  });
});
