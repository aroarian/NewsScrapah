$(document).ready(function() {
  const modal = $("#myModal");
  const btn = $(".myBtn");
  const span = $(".close")[0];
  const editModal = $("#editModal");
  
  let articleId;

  //MODAL JS ==================================
  $(".myBtn").on("click", function() {
    modal.show();
    articleId = $(this).attr("data-id");
  });

  span.onclick = function() {
    modal.hide();
  };

  $("#editspan").on("click", function() {
    editModal.hide();
  });

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.hide();
    } else if (event.target === editModal) {
      editModal.hide();
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
      $("#notetitle").val("");
      modal.hide();
      alert("Note added successfully!");
      window.location.reload();
    }, 500);
  });

  $(".viewNote").on("click", function() {
    $("#notes").empty();
    articleId = $(this).attr("data-id");

    $.get(`/articles/${articleId}`, function(response) {}).then(function(data) {
      for (let i = 0; i < data.note.length; i++) {
        $("#notes").append(
          `<div class="artNotes article" id="${data.note[i]._id}"><h2>${
            data.note[i].title
          }</h2><p>${data.note[i].text}</p><button class="btn edit" data-id="${
            data.note[i]._id
          }">Edit</button><span class="close remove" data-id="${
            data.note[i]._id
          }">X</span></div>`
        );
      }

      if (!data.note[0]) {
        alert("There are no notes at this time");
      }
    });
  });

  $(document).on("click", ".edit", function() {
    let noteId = $(this).attr("data-id");
    editModal.show();
    $.get(`/notes/${noteId}`, function(response) {}).then(function(data) {
      //console.log(data);
      $("#edittitle")
        .val(data.title)
        .attr("data-id", data._id);
      $("#edittext").val(data.text);
    });
  });

  $("#save").on("click", function() {
    let text = $("#edittext").val();
    let title = $("#edittitle").val();
    let noteId = $("#edittitle").attr("data-id");
    let body = { noteId: noteId, text: text, title: title };
    $.post(`/update/${noteId}`, body, function(response) {
      
    }).then(function() {
      setTimeout(function() {
        $("#edittext").val("");
        $("edittitle").val("");
        alert("Note Saved!");
        editModal.hide();
        window.location.reload();
      }, 500);
    });
  });

  $(document).on("click", ".remove", function() {
    alert("Note Removed");
    $("#notes").empty();
    let removeId = $(this).attr("data-id");
    $.post(`/remove/${removeId}`, function() {});
  });
});
