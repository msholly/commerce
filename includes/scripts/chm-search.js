jQuery( document ).ready(function( $ ) {
    $('.chm-select2')
        .select2({ width: '100%' })
        .on("select2:select", function(e) { 
            window.location = e.params.data.id;
        });
});