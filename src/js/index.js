// including jquery
const $ = require("jquery");

$("input[type=button]").on( "click", ( e ) => {
    e.preventDefault();
    let username = $( "#username" ).val();
    let password = $( "#password" ).val();
    
    // console.log( e.target );

    let type = $(e.target).attr("name");
    // console.log( type );
    // console.log( username + " : " + password );

    if ( "login" === type )
    {
        
    }

});