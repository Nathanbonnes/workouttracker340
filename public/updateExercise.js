function updateExercise(id){
    $.ajax({
        url: '/exercises/' + id,
        type: 'PUT',
        data: $('#update-exercise').serialize(),
        success: function(result){
            window.location.href = "/exercises";
        }
    })
};