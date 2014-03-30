/**
 * Created by gongchen on 14-3-29.
 */

$(function(){
    $('#btn-search').click(function() {
        $('#item-user').empty();
        $.ajax({
            type: 'POST',
            url: '/friends/search',
            data: 'name='+ $('#textinput').val(),
            success: function(msg) {
                var html='';
                for(var i=0;i<msg.length; i++){
                    html += '<div id="user" uid="'+ msg[i]._id + '" name="' + msg[i].username + '">'+ msg[i].username + '<button  onclick="addfriend()" id="btn-add">+</button></div><br/>'
                }
                $('#item-user').append(html);
            }
        });
    });
});

/*$('#btn-add').click(function() {
    alert('ok');
    $.ajax({
        type: 'POST',
        url: '/friends/add',
        data: 'user_id='+ $('#user').attr('uid')+ '&name=' + $('#user').attr('name'),
        success: function(msg) {
            alert(msg);
        }
    });
});*/


function addfriend() {
    $.ajax({
        type: 'POST',
        url: '/friends/add',
        data: 'user_id='+ $('#user').attr('uid')+ '&name=' + $('#user').attr('name'),
        success: function(msg) {
            alert(msg);
        }
    });
}