        //this function can remove an array element.
            Array.remove = function(array, from, to) {
                var rest = array.slice((to || from) + 1 || array.length);
                array.length = from < 0 ? array.length + from : from;
                return array.push.apply(array, rest);
            };
            var total_popups = 0;
            var popups = [];
            function close_popup(id)
            {
                for(var iii = 0; iii < popups.length; iii++)
                {
                    if(id == popups[iii])
                    {
                        Array.remove(popups, iii);

                        document.getElementById(id).style.display = "none";

                        calculate_popups();

                        return;
                    }
                }
            }

            //displays the popups. Displays based on the maximum number of popups that can be displayed on the current viewport width
            function display_popups()
            {
                var right = 220;

                var iii = 0;
                for(iii; iii < total_popups; iii++)
                {
                    if(popups[iii] != undefined)
                    {
                        var element = document.getElementById(popups[iii]);
                        element.style.right = right + "px";
                        right = right + 320;
                        element.style.display = "block";
                    }
                }

                for(var jjj = iii; jjj < popups.length; jjj++)
                {
                    var element = document.getElementById(popups[jjj]);
                    element.style.display = "none";
                }
            }
             /*
                this script has been added by me for my custome

                */
                $(document).ready(function() {
                    $.ajaxSetup({
                            headers: {
                                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                            }
                    });


                    $("#chat").keypress(function(evt) {
                        if(evt.which == 13) {
                            alert("we are listning to enter event");
                                var iusername = $('#shout_username').val();
                                var imessage = $('#shout_message').val();
                                post_data = {'username':iusername, 'message':imessage};

                                //send data to "shout.php" using jQuery $.post()
                                $.post('shout.php', post_data, function(data) {

                                    //append data into messagebox with jQuery fade effect!
                                    $(data).hide().appendTo('.message_box').fadeIn();

                                    //keep scrolled to bottom of chat!
                                    var scrolltoh = $('.message_box')[0].scrollHeight;
                                    $('.message_box').scrollTop(scrolltoh);

                                    //reset value of message box
                                    $('#shout_message').val('');

                                }).fail(function(err) {

                                //alert HTTP server error
                                alert(err.statusText);
                                });
                            }
                    });

                    //toggle hide/show shout box
                    $(".close_btn").click(function (e) {
                        //get CSS display state of .toggle_chat element
                        var toggleState = $('.toggle_chat').css('display');

                        //toggle show/hide chat box
                        $('.toggle_chat').slideToggle();

                        //use toggleState var to change close/open icon image
                        if(toggleState == 'block')
                        {
                            $(".header div").attr('class', 'open_btn');
                        }else{
                            $(".header div").attr('class', 'close_btn');
                        }


                    });
                });
                /*done adding my custom scripts*/
            //creates markup for a new popup. Adds the id to popups array.
            function register_popup(id, name)
            {

                for(var iii = 0; iii < popups.length; iii++)
                {
                    //already registered. Bring it to front.
                    if(id == popups[iii])
                    {
                        Array.remove(popups, iii);

                        popups.unshift(id);

                        calculate_popups();


                        return;
                    }
                }

                var element='<div class="popup-box chat-popup" id="'+ id +'">';
                    element =element + '<div style="background:#ddd;color:#fff;" class="header">Group<div class="close_btn">&nbsp;</div></div>';
                    element =element + ' <div class="toggle_chat">';
                    element =element + '<div class="message_box"></div>';
                    element =element + '<textarea style="background:white;margin-top:180px;" id="chat" class="form-control" rows="3" required="required"></textarea>';
                    // element =element +
                    // element = element + '<div class="popup-head-right"><a href="javascript:close_popup(\''+ id +'\');">&#10005;</a></div>';
                // var element = '<div class="popup-box chat-popup" id="'+ id +'">';
                // element = element + '<div class="popup-head">';
                // element = element + '<div class="popup-head-left">'+ name +'</div>';
                // element = element + '<div class="popup-head-right"><a href="javascript:close_popup(\''+ id +'\');">&#10005;</a></div>';
                // element = element + '<div style="clear: both;"></div></div><p onclick="t()" id="m"></p><div class="popup-messages"><textarea  class="top"></textarea></div></div>';

                document.getElementsByTagName("body")[0].innerHTML = document.getElementsByTagName("body")[0].innerHTML + element;

                popups.unshift(id);

                calculate_popups();

            }

            //calculate the total number of popups suitable and then populate the toatal_popups variable.
            function calculate_popups()
            {
                var width = window.innerWidth;
                if(width < 540)
                {
                    total_popups = 0;
                }
                else
                {
                    width = width - 200;
                    //320 is width of a single popup box
                    total_popups = parseInt(width/320);
                }

                display_popups();

            }

            //recalculate when window is loaded and also when window is resized.
            window.addEventListener("resize", calculate_popups);
            window.addEventListener("load", calculate_popups);