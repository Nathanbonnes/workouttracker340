function deleteMembership(personID, gymID){
    $.ajax({
        url: '/memberships/personID/' + personID + '/gymID/' + gymID,
        type: 'DELETE',
        success: function(result){
            if(result.responseText != undefined){
              alert(result.responseText)
            }
            else {
              window.location.reload(true)
            } 
        }
    })
  };

