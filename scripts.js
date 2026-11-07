// Global variables.

var min_image_number = 0;
var max_image_number = 0;

// Constant variables.  These values should be set based on the largest image file number from the respective website subfolders.

const gallery_list = [{name: "featured_work",  title: "Featured Work",  min_image_number: 15, max_image_number: 42, new_list: [15,16,17,18], border_list: [0]},
                      {name: "photo_art",      title: "Photo Art",      min_image_number: 15, max_image_number: 28, new_list: [15,16,17],    border_list: [21,22]},
                      {name: "works_on_paper", title: "Works on Paper", min_image_number: 12, max_image_number: 21, new_list: [12,13,14,15], border_list: ["all"]},
                      {name: "sold",           title: "Sold",           min_image_number:  5, max_image_number: 25, new_list: [0],           border_list: [10,11,19]}]


function check_if_image_exists(gallery_name,image_number,direction)
{
   $.ajax
   (
   {
      url: gallery_name+"/"+gallery_name+"_"+image_number+".jpg",

      type: "HEAD",

      success: function()
      {
         if (direction == "right")
         {
            if (image_number <= max_image_number)
            {
               display_image_with_caption(gallery_name+"/"+gallery_name+"_"+image_number+".jpg",gallery_name,image_number);
            }
            else
            {
               check_if_image_exists(gallery_name,min_image_number,"right");
            }
         }
         else
         {
            if (image_number >= min_image_number)
            {
               display_image_with_caption(gallery_name+"/"+gallery_name+"_"+image_number+".jpg",gallery_name,image_number);
            }
            else
            {
               check_if_image_exists(gallery_name,max_image_number,"left");
            }
         }

         return true;
      },

      error: function()
      {
         if (direction == "right")
         {
            if (image_number+1 <= max_image_number)
            {
               check_if_image_exists(gallery_name,image_number+1,"right");
            }
            else
            {
               check_if_image_exists(gallery_name,min_image_number,"right");
            }
         }
         else
         {
            if (image_number-1 >= min_image_number)
            {
               check_if_image_exists(gallery_name,image_number-1,"left");
            }
            else
            {
               check_if_image_exists(gallery_name,max_image_number,"left");
            }
         }
      },
   }
   );

   return false;
}

function close_menu()
{
   document.getElementById("menu_list").style.width   = "0px";
   document.getElementById("menu_list").style.padding = "50px 0px 15px 0px";

   return true;
}

function display_contact_page(image_caption_file_name,direction,display_error)
{
   $.ajax
   (
   {
      url: image_caption_file_name,

      dataType: "html",

      success: function(data)
      {
         var image_file_name = "";
         var image_title     = "";


         image_file_name = image_caption_file_name.replace("_caption.txt",".jpg");

         // Extract image title from image caption data.

         start_after = '<span class="art_title">';
         end_before  = '</span>';

         start_index = data.indexOf(start_after) + start_after.length;
         end_index   = data.indexOf(end_before);

         image_title = data.substring(start_index, end_index);
         image_title = image_title.trim();

         window.location.href = "contact.html?image_file_name="+image_file_name+"&image_title="+image_title;
      },

      error: function()
      {
         if (image_caption_file_name.includes("contact.txt") == true)
         {
            image_file_name = image_caption_file_name.replace(".txt",".jpg");

            window.location.href = "contact.html?image_file_name="+image_file_name+"&image_title=";
         }
         else
         {
            update_contact_image(image_caption_file_name.replace("_caption.txt",".jgp"),direction);
         }
      },
   }
   );

   return true;
}

function display_gallery_page(gallery_name)
{
   for (i = 0; i < gallery_list.length; i++)
   {
      if (gallery_name == gallery_list[i]["name"])
      {
         window.location.href = "art_gallery.html?gallery_index="+i;

         break;
      }
   }

   return true;
}

function display_image_with_caption(image_file_name,gallery_name,image_number)
{
   var image = new Image();


   image.onload = function()
   {
      var adjusted_image_height             = 0;
      var adjusted_image_width              = 0;
      var art_container_class               = "";
      var art_container_margin              = 35;
      var art_container_style               = "";
      var caption_div_style                 = "";
      var html_string                       = "";
      var image_border                      = false;
      var image_height                      = 0;
      var image_height_percent_threshold    = .75;
      var image_width                       = 0;
      var image_style                       = "";
      var maximum_caption_width             = 500;
      var minimum_caption_width             = 400;
      var maximum_ipad_portrait_image_width = 655;
      var nav_button_vertical_position      = 5;
      var window_inner_height               = window.innerHeight;
      var window_inner_width                = window.innerWidth;


      // Set min_image_number and max_imager_number.

      for (i = 0; i < gallery_list.length; i++)
      {
         if (gallery_name == gallery_list[i]["name"])
         {
            min_image_number = gallery_list[i]["min_image_number"];
            max_image_number = gallery_list[i]["max_image_number"];

            break;
         }
      }

      if (is_portrait() == false)
      {
         if (is_mobile() == true)
         {
            minimum_caption_width = 250;
         }
         else if (is_iPad() == true)
         {
            minimum_caption_width = 300;
         }
      }

      image_width  = this.naturalWidth;
      image_height = this.naturalHeight;

      adjusted_image_width = image_width / (image_height/window_inner_height);

      if (is_portrait() == true)
      {
         art_container_class = "image_container_one_column";
         image_style         = "style=\"display: block; width: "+window_inner_width+"px; height: auto\"";
         caption_div_style   = "style=\"height: auto\"";

         nav_button_vertical_position = image_height * (window_inner_width/image_width) / 2;

         if (is_iPad() == true)
         {
            // Enforce a maximum image width for iPads in portrait orienetation.

            adjusted_image_width = window_inner_width - art_container_margin*2;

            if (adjusted_image_width > maximum_ipad_portrait_image_width)
            {
               adjusted_image_width = maximum_ipad_portrait_image_width;
            }

            // Calculate adjusted image height from adjust image width.

            adjusted_image_height = image_height * (adjusted_image_width/image_width);

            // If adjusted image height is greater than image height percent threshold, reduce image size to meet image height percent threshold.

            if (adjusted_image_height > window_inner_height*image_height_percent_threshold)
            {alert("iPad Portrait");
               adjusted_image_width = image_width * (window_inner_height*image_height_percent_threshold)/image_height;
            }

            art_container_style = "style=\"width: "+adjusted_image_width+"px; margin: 0px auto\"";
            image_style         = "style=\"display: block; width: "+adjusted_image_width+"px; height: auto\"";

            nav_button_vertical_position = window_inner_height / 2;
         }

         if (nav_button_vertical_position > window_inner_height / 2) nav_button_vertical_position = window_inner_height / 2;
      }
      else
      {
         art_container_class = "image_container_two_column";

         if ( (adjusted_image_width + minimum_caption_width + art_container_margin*2) > (window_inner_width) )
         {
            // Reduce the image width to make room for the image caption.

            adjusted_image_width  = adjusted_image_width - ( (adjusted_image_width + minimum_caption_width + art_container_margin*2) - (window_inner_width) );

            art_container_style = "style=\"margin-left: "+art_container_margin+"px; margin-right: "+art_container_margin+"px; place-content: center\"";
            image_style         = "style=\"display: block; width: "+adjusted_image_width+"px\"";
            caption_div_style   = "style=\"max-width: "+maximum_caption_width+"px; padding-top: 5px\"";
         }
         else   
         {
            if (CSS.supports('height', '100dvh'))
            {
               image_style = "style=\"display: block; width: auto; height: 100dvh\"";
            }
            else
            {
               image_style = "style=\"display: block; width: auto; height: 100vh\"";
            }

            art_container_style = "style=\"margin-left: "+art_container_margin+"px; margin-right: "+art_container_margin+"px\"";
            caption_div_style   = "style=\"max-width: "+maximum_caption_width+"px; padding-top: 5px\"";
         }

         nav_button_vertical_position = window_inner_height / 2;
      }

      nav_button_vertical_position += "px";

      if (art_container_class == "image_container_two_column")
      {
         // Add top padding to image caption.
 
         caption_div_style = caption_div_style.slice(0, -1);

         if (is_mobile() == true)
         {
            caption_div_style += "; padding-top: 0px; box-sizing: border-box\"";
         }
         else if (is_iPad() == true)
         {
            caption_div_style += "; padding-top: 20px; box-sizing: border-box\"";
         }
         else
         {
            caption_div_style += "; padding-top: 30px; box-sizing: border-box\"";
         }
      }

      // Determine if this image should have a border.

      for (i = 0; i < gallery_list.length; i++)
      {
         if (gallery_name == gallery_list[i]["name"])
         {
            if (gallery_list[i]["border_list"].includes("all") || gallery_list[i]["border_list"].includes(+image_number))
            {
               image_border = true;

               break;
            }
         }
      }

      if (image_border == true)
      {
         // Add border to image.

         image_style = image_style.slice(0, -1);

         if (is_mobile() == true)
         {
            image_style += "; border: 10px solid var(--background_color); box-sizing: border-box\"";
         }
         else if (is_iPad() == true)
         {
            image_style += "; border: 30px solid var(--background_color); box-sizing: border-box\"";
         }
         else
         {
            image_style += "; border: 40px solid var(--background_color); box-sizing: border-box\"";
         }

         if (art_container_class == "image_container_one_column")
         {
            // Add left border to image caption.

            caption_div_style = caption_div_style.slice(0, -1);

            if (is_mobile() == true)
            {
               caption_div_style += "; border-left: 0px solid var(--background_color); box-sizing: border-box\"";
            }
            else if (is_iPad() == true)
            {
               caption_div_style += "; border-left: 20px solid var(--background_color); box-sizing: border-box\"";
            }
            else
            {
               caption_div_style += "; border-left: 30px solid var(--background_color); box-sizing: border-box\"";
            }
         }
      }

      html_string += '';
      html_string += '';
      html_string += '<div id="art_container" class="'+art_container_class+' fade_in" '+art_container_style+'">';
      html_string += '';
      html_string += '   <div id="image_div">';
      html_string += '      <img src="'+this.src+'" '+image_style+'">';
      html_string += '   </div>';
      html_string += '';
      html_string += '   <div id="caption_div" class="art_caption" '+caption_div_style+'>';
      html_string += '        <!-- Load data from file. -->';
      html_string += '   </div>';
      html_string += '';
      html_string += '</div>';
      html_string += '';
      html_string += '<button id="nav_back"  class="back_button" onclick="display_gallery_page(\''+gallery_name+'\');">&times;</button>';
      html_string += '<button id="nav_left"  class="nav_button nav_left_offset"  style="top: '+nav_button_vertical_position+'"  onclick="navigate_to_next_image(\''+gallery_name+'\',\''+image_number+'\',\'left\');"><div class="nav_left_shape"></div></button>';
      html_string += '<button id="nav_right" class="nav_button nav_right_offset" style="top: '+nav_button_vertical_position+'"  onclick="navigate_to_next_image(\''+gallery_name+'\',\''+image_number+'\',\'right\');"><div class="nav_right_shape"></div></button>';
      html_string += '';
      html_string += '';

      document.body.innerHTML = html_string;

      if (art_container_class == "image_container_two_column")
      {
         // Set height of "caption_div" to height of "image_div".

         document.getElementById("caption_div").style.height = (document.getElementById("image_div").getBoundingClientRect().height) + "px";

         // Adjust vertical position of back button if needed.

         if (document.querySelector("#caption_div").getBoundingClientRect().top > 5)
         {
            document.getElementById("nav_back").style.top = document.querySelector("#caption_div").getBoundingClientRect().top + "px";
         }
      }

      if ( (image_border == true) && (is_mobile() == true) && (art_container_class == "image_container_one_column") )
      {
         // Adjust position of back button.

         document.getElementById("nav_back").style.top   = (parseInt(window.getComputedStyle(document.getElementById("nav_back")).top)   + 10) + "px";
         document.getElementById("nav_back").style.right = (parseInt(window.getComputedStyle(document.getElementById("nav_back")).right) + 10) + "px";

         // Adjust position of navigation buttons.

         document.getElementById("nav_left").style.left   = (parseInt(window.getComputedStyle(document.getElementById("nav_left")).left)   + 10) + "px";
         document.getElementById("nav_right").style.right = (parseInt(window.getComputedStyle(document.getElementById("nav_right")).right) + 10) + "px";
      }

      // Update the browser address field.

      window.history.replaceState({}, document.title, window.location.pathname+"?image_file_name="+image_file_name);

      // Load image caption from file.

      load_image_caption(gallery_name,image_number);

      return true;
   }

   image.src = image_file_name;

   return true;
}

function display_menu()
{
   document.getElementById("menu_list").style.width   = "160px";
   document.getElementById("menu_list").style.height  = 190 + (gallery_list.length * 40) + "px";
   document.getElementById("menu_list").style.padding = "50px 30px 15px 20px";

   return true;
}

function is_iPad()
{
   if ( (navigator.platform.toLowerCase().indexOf("ipad") != -1) || ((navigator.platform.toLowerCase().indexOf("macintel") != -1) && (navigator.maxTouchPoints > 1)) )
   {
      return true;
   }

   return false;
}

function is_mobile()
{
   if ( (navigator.userAgent.toLowerCase().indexOf("mobile") != -1) && (navigator.platform.toLowerCase().indexOf("ipad") == -1) )
   {
      return true;
   }

   return false;
}

function is_older_iPad()
{
   if ( (navigator.userAgent.toLowerCase().indexOf("mobile") != -1) && (navigator.platform.toLowerCase().indexOf("ipad") != -1) )
   {
      return true;
   }

   return false;
}

function is_portrait()
{
   if (window.innerHeight >= window.innerWidth)
   {
      return true;
   }

   return false;
}

function load_data_from_file(gallery_name,file_name,element_id,title_extension,scroll_to_exhibitions,display_error)
{
   $.ajax
   (
   {
      url: file_name,

      dataType: "html",

      success: function(data)
      {
         if (element_id == "caption_div")
         {
            // Extract image title from image caption data.

            start_after = '<span class="art_title">';
            end_before  = '</span>';

            start_index = data.indexOf(start_after) + start_after.length;
            end_index   = data.indexOf(end_before);

            image_title = data.substring(start_index, end_index);
            image_title = image_title.trim();

            // Add title extension to image title in image caption data.

            data = data.replace("</span>",title_extension+"</span>")

            if (gallery_name != "sold")
            {
               var image_file_name = file_name.replace("_caption.txt",".jpg");

               data += '<a class="general_link contact_artist_link" href="contact.html?image_file_name='+image_file_name+'&image_title='+image_title+'">Contact artist to purchase</a>';
            }
         }

         document.getElementById(element_id).textContent = "";
         document.getElementById(element_id).insertAdjacentHTML("beforeend",data);

         if (element_id == "about_text")
         {
            file_name  = file_name.replace("about.txt","exhibitions.txt");
            element_id = element_id.replace("about_text","exhibitions");

            load_data_from_file(gallery_name,file_name,element_id,title_extension,scroll_to_exhibitions,display_error);
         }
         else if (element_id == "exhibitions")
         {
            if (scroll_to_exhibitions == true) document.getElementById(element_id).scrollIntoView({behavior: "smooth"});
         }
      },

      error: function()
      {
         if (display_error == true) alert("Failed to load data from file:  "+file_name);

         document.getElementById(element_id).style.display = "none";
      },
   }
   );

   return true;
}

function load_image(gallery_name,image_number,image_count)
{
   var column_count      = window.getComputedStyle(document.getElementById("art_gallery")).getPropertyValue("grid-template-columns").split(" ").length;
   var file_name_prefix  = gallery_name + "_" + image_number;
   var file_path_prefix  = gallery_name + "/" + file_name_prefix;
   var image_border_size = 10;
   var image_html        = "";
   var image_path        = file_path_prefix + ".jpg";
   var image_style       = "";
   var new_tag_style     = "";


   // Determine if the images in this gallery should have a border.

   for (i = 0; i < gallery_list.length; i++)
   {
      if (gallery_name == gallery_list[i]["name"])
      {
         if (gallery_list[i]["border_list"].includes("all") == true)
         {
            image_style   = ' style="border: '+image_border_size+'px solid var(--background_color); box-sizing: border-box"';
            new_tag_style = ' style="top: '+image_border_size+'px; left: '+image_border_size+'px"';

            break;
         }
      }
   }

   if (column_count == 1)
   {
      document.getElementById("one_column_1").style.display = "block";
   }
   else if (column_count == 2)
   {
      document.getElementById("two_column_1").style.display = "block";
      document.getElementById("two_column_2").style.display = "block";

   }
   else if (column_count == 3)
   {
      document.getElementById("three_column_1").style.display = "block";
      document.getElementById("three_column_2").style.display = "block";
      document.getElementById("three_column_3").style.display = "block";
   }

   image_html += '<div class="art_image_link_container">\n';
   image_html += '   <a class="art_image_link" href="display_image.html?image_file_name='+image_path+'" target="_self"><img src="'+image_path+'" class="art_image border_radius"'+image_style+'></a>\n';

   if (gallery_list[gallery_index]["new_list"].includes(+image_number))
   {
      image_html += '   <div class="new_tag"'+new_tag_style+'>NEW</div>\n';
   }

   if (gallery_name.toLowerCase().includes("sold") == true)
   {
      image_html += '   <div class="sold_tag">SOLD</div>\n';
   }

   image_html += '</div>\n';

   document.getElementById("one_column_1").insertAdjacentHTML("beforeend",image_html);

   if (image_count % 2 != 0)
   {
      // image_count is odd.

      document.getElementById("two_column_1").insertAdjacentHTML("beforeend", image_html);
   }
   else
   {
      // image_count is even.

      document.getElementById("two_column_2").insertAdjacentHTML("beforeend", image_html);
   }

   if (image_count % 3 == 0)
   {
      // image_count is a multiple of 3.

      document.getElementById("three_column_3").insertAdjacentHTML("beforeend", image_html);
   }
   else
   {
      document.getElementById("three_column_"+(image_count % 3)).insertAdjacentHTML("beforeend", image_html);
   }

   if (image_number < max_image_number) load_image_into_gallery(gallery_name,image_number+1,image_count);

   return true;
}

function load_image_caption(gallery_name,image_number)
{
   var image_file_name = gallery_name+"/"+gallery_name+"_"+image_number+"_caption.txt"
   var title_extension = "";


   // Add "new" to end of art title if item is new.

   for (i = 0; i < gallery_list.length; i++)
   {
      if (gallery_name == gallery_list[i]["name"])
      {
         if (gallery_list[i]["new_list"].includes(+image_number))
         {
            title_extension = '<span class="new_text"> new</span>';

            break;
         }
      }
   }

   // Add "sold" to end of art title if item is sold.

   if (gallery_name == "sold")
   {
      title_extension = '<span class="sold_text"> sold</span>';
   }

   load_data_from_file(gallery_name,image_file_name,"caption_div",title_extension,false,true);

   return true;
}

function load_image_into_gallery(gallery_name,image_number,image_count)
{
   $.ajax
   (
   {
      url: gallery_name + "/" + gallery_name + "_" + image_number + ".jpg",

      type: "HEAD",

      success: function()
      {
         load_image(gallery_name,image_number,image_count+1);
      },

      error: function()
      {
         if (image_number < max_image_number) load_image_into_gallery(gallery_name,image_number+1,image_count);
      },
   }
   );

   return true;
}

function load_images_into_gallery(gallery_index)
{
   var image_count  = 0;
   var image_number = gallery_list[gallery_index]["min_image_number"];


   min_image_number = gallery_list[gallery_index]["min_image_number"];
   max_image_number = gallery_list[gallery_index]["max_image_number"];

   load_image_into_gallery(gallery_list[gallery_index]["name"],image_number,image_count);

   return true;
}

function navigate_to_next_image(gallery_name,image_number,direction)
{
   image_number = parseInt(image_number);

   if (direction == "right")
   {
      check_if_image_exists(gallery_name,image_number+1,"right");

   }
   else
   {
      check_if_image_exists(gallery_name,image_number-1,"left");
   }

   return true;
}

function scroll_to_top()
{
   window.scrollTo({top: 0,behavior: "smooth"});
}

function send_contact_email()
{
   var email         = "mailto:";
   var email_address = "dkclaguna@gmail.com";
   var email_subject = "?subject=Darlene Laguna Art";
   var email_text    = "&body=";


   if (image_title != "") email_subject += " - " + image_title;

   email_text += document.getElementById("contact_email_message").value;

   if (document.getElementById("contact_email_checkbox").checked == true) email_text += "\n\nAdd me to your email list.";

   email += email_address + email_subject + email_text;

   window.open(encodeURI(email),"_self");
}

function set_size_and_position_of_contact_page_elements()
{
   var contact_email_container_element_heights = 0;
   var contact_image                           = null;
   var contact_image_width                     = 0;
   var min_contact_image_width_percent         = .60;
   var scale                                   = 0;


   contact_image       = document.querySelector("#contact_image");
   scale               = contact_image.height / contact_image.naturalHeight;
   contact_image_width = scale * contact_image.naturalWidth;

   // Set image_container width equal to contact_image width.

   document.getElementById("image_container").style.width = contact_image_width + "px";

   // Calculate and set contact_email_message text area height.

   contact_email_container_element_heights  = document.getElementById("contact_email_subject").offsetHeight;
   contact_email_container_element_heights += document.getElementById("contact_email_checkbox_label").offsetHeight;
   contact_email_container_element_heights += document.getElementById("contact_email_send_button").offsetHeight;

   if (document.getElementById("contact_text") != null)
   {
      contact_email_container_element_heights += document.getElementById("contact_text").offsetHeight;
   }

   contact_email_container_element_heights += 6;  // Fine tune.

   document.getElementById("contact_email_message").style.height = "calc(100% - " + contact_email_container_element_heights + "px)";

   if (is_portrait() == true)
   {
      if (is_iPad() == true)
      {
         // Ensure contact_image width and email_messasge_container elements are at least 70%.

         if ( (contact_image_width/window.innerWidth) < min_contact_image_width_percent)
         {
            contact_image_width = min_contact_image_width_percent * window.innerWidth;

            document.getElementById("image_container").style.width     = contact_image_width + "px";
            document.getElementById("contact_image"  ).style.width     = contact_image_width + "px";
            document.getElementById("contact_image"  ).style.maxHeight = "none";
         }

         if (document.getElementById("contact_text") != null)
         {
            document.getElementById("contact_text").style.width = contact_image_width + "px";
         }

         document.getElementById("contact_email_subject").style.width = contact_image_width + "px";
         document.getElementById("contact_email_message").style.width = contact_image_width + "px";
         document.getElementById("checkbox_container"   ).style.width = contact_image_width + "px";
      }
      else if (is_mobile() == true)
      {
         // Set vertical position of left and right navigation buttons to center of comtact_image.

         document.getElementById("nav_left").style.top  = ( document.getElementById("contact_image").getBoundingClientRect().top + (contact_image.height/2) ) + "px";
         document.getElementById("nav_right").style.top = ( document.getElementById("contact_image").getBoundingClientRect().top + (contact_image.height/2) ) + "px";
      }
   }
}

function toggle_gallery_menu()
{
   if (document.getElementById("gallery_menu").style.display == "block")
   {
      document.getElementById("gallery_menu").style.display = "none";

      if ( (is_mobile() == true) || (is_iPad() == true) || (is_older_iPad() == true) )
      {
         document.getElementById("gallery_link").style.color = "black";
      }
      else
      {
         document.getElementById("gallery_link").style.color = "";
      }
   }
   else
   {
      document.getElementById("gallery_menu").style.display = "block";
      document.getElementById("gallery_link").style.color   = "var(--link_color)";

      window.scrollTo({top: document.body.scrollHeight, behavior: "smooth"});
   }

   return true;
}

function update_contact_image(image_file_name,direction)
{
   var contact_image_file_name = "about/contact.jpg";
   var gallery_index           = -1;
   var gallery_name            = image_file_name.split("/")[0];
   var image_caption_file_name = "";
   var image_number            = image_file_name.replace(/\D/g, "");
   var min_gallery_index       = 0;
   var max_gallery_index       = gallery_list.length -2;  // Use -2 instead of -1 to exclude "Sold" gallery.


   for (i = 0; i < gallery_list.length; i++)
   {
      if (gallery_name == gallery_list[i]["name"])
      {
         gallery_index = i;

         break;
      }
   }

   if (image_file_name == contact_image_file_name)
   {
      if (direction == "right")
      {
         image_caption_file_name = gallery_list[min_gallery_index]["name"] + "/" + gallery_list[min_gallery_index]["name"] + "_" + gallery_list[min_gallery_index]["min_image_number"] + "_caption.txt";
      }
      else  // direction == "left"
      {
         image_caption_file_name = gallery_list[max_gallery_index]["name"] + "/" + gallery_list[max_gallery_index]["name"] + "_" + gallery_list[max_gallery_index]["max_image_number"] + "_caption.txt";
      }
   }
   else
   {
      if (direction == "right")
      {
         if (image_number < gallery_list[gallery_index]["max_image_number"])
         {
            image_caption_file_name = gallery_name + "/" + gallery_name + "_" + (parseInt(image_number,10)+1) + "_caption.txt";
         }
         else  // image number == gallery_list[gallery_index]["max_image_number"]
         {
            if (gallery_index == max_gallery_index)
            {
               image_caption_file_name = contact_image_file_name.replace(".jpg",".txt");
            }
            else
            {
               image_caption_file_name = gallery_list[gallery_index+1]["name"] + "/" + gallery_list[gallery_index+1]["name"] + "_" + gallery_list[gallery_index+1]["min_image_number"] + "_caption.txt";
            }
         }
      }
      else  // direction == "left"
      {
         if (image_number > gallery_list[gallery_index]["min_image_number"])
         {
            image_caption_file_name = gallery_name + "/" + gallery_name + "_" + (parseInt(image_number,10)-1) + "_caption.txt";
         }
         else  // image number == gallery_list[gallery_index]["min_image_number"]
         {
            if (gallery_index == min_gallery_index)
            {
               image_caption_file_name = contact_image_file_name.replace(".jpg",".txt");
            }
            else
            {
               image_caption_file_name = gallery_list[gallery_index-1]["name"] + "/" + gallery_list[gallery_index-1]["name"] + "_" + gallery_list[gallery_index-1]["max_image_number"] + "_caption.txt";
            }
         }
      }
   }

   display_contact_page(image_caption_file_name,direction,true);
}

function validate_gallery_index(gallery_index)
{
   if (/\D/.test(gallery_index) == true) 
   {
      // gallery_index contains at least one non-digit character.

      return false;
   }

   for (i = 0; i < gallery_list.length; i++)
   {
      if ( (gallery_index+"x") == (i+"x") )
      {
         //  gallery_index is exactly equal to i, including the number of digits.

         return true;
      }
   }

   return false;
}

function validate_gallery_name(gallery_name)
{
   for (i = 0; i < gallery_list.length; i++)
   {
      if (gallery_name == gallery_list[i]["name"])
      {
         return true;
      }
   }

   return false;
}

function validate_image_number(gallery_name,image_number)
{
   if (/^(0|[1-9]\d*)$/.test(image_number) == false)
   {
      // image_number is not a valid integer string, for example leading zeros in image_number make it invalid.

      return false;
   }

   for (i = 0; i < gallery_list.length; i++)
   {
      if (gallery_name == gallery_list[i]["name"])
      {
         if ( (image_number >= gallery_list[i]["min_image_number"]) && (image_number <= gallery_list[i]["max_image_number"]) )
         {
            return true;
         }
      }
   }

   return false;
}

function write_footer()
{
   var year = new Date().getFullYear();


   document.writeln('');
   document.writeln('<div style="text-align: center; padding: 25px 0px 0px 0px">');
   document.writeln('   <a href="mailto:dkclaguna@gmail.com?subject=Darlene Laguna Art" title="Email"    ><img src="email_icon.png"     height="15px" style="padding: 0px 20px 0px 20px; vertical-align: middle"></a>');
   document.writeln('   <a href="https://www.instagram.com/dklaguna_art"                title="Instagram"><img src="instagram_icon.png" height="16px" style="padding: 0px 20px 0px 20px; vertical-align: middle"></a>');
   document.writeln('</div>');
   document.writeln('');
   document.writeln('<div class="copyright">Copyright &copy '+year+' Darlene Laguna Art<br>All Rights Reserved.</div>');
   document.writeln('');
   document.writeln('<button id="scroll_button" class="scroll_button" onclick="scroll_to_top();"><span class="scroll_shape"></span></button>');
   document.writeln('');

   return true;
}

function write_header()
{
   document.open();

   var d = document;

   d.writeln('');
   d.writeln('');
   d.writeln('<button id="menu_button" class="menu_button" onclick="display_menu();" tabindex="-1">&#9776;</button>');
   d.writeln('');
   d.writeln('<div id="menu_list" class="menu" tabindex="-1">');
   d.writeln('   <span class="close_button" onclick="close_menu();" tabindex="-1">&times;</span>');
   for (i = 0; i < gallery_list.length; i++)
   {
      d.writeln('   <a href="art_gallery.html?gallery_index='+i+'" tabindex="-1">'+gallery_list[i]["title"]+'</a>');
   }
   d.writeln('   <a href="about.html"                                                    tabindex="-1">About  </a>');
   d.writeln('   <a href="about.html?mode=exhibitions"                                   tabindex="-1">Exhibitions</a>');
   d.writeln('   <a href="contact.html?image_file_name=about/contact.jpg&image_title=" tabindex="-1">Contact</a>');
   d.writeln('   <div style="border-top: 1px solid var(--text_color); margin: 10px 0px 0px 10px; white-space: nowrap" tabindex="-1">');
   d.writeln('      <a href="mailto:dkclaguna@gmail.com?subject=Darlene Laguna Art" title="Email"     style="display: inline-block" tabindex="-1"><img src="email_icon.png"     height="15px" style="margin: 15px 0px 0px -10px"></a>');
   d.writeln('      <a href="https://www.instagram.com/dklaguna_art"                title="Instagram" style="display: inline-block" tabindex="-1"><img src="instagram_icon.png" height="16px"                                   ></a>');
   d.writeln('   </div>');
   d.writeln('</div>');
   d.writeln('');
   d.writeln('<div class="title"><a class="title_link" href="index.html">DARLENE LAGUNA</a></div>');
   d.writeln('');
   d.writeln('<div class="header_links">');
   for (i = 0; i < gallery_list.length; i++)
   {
      d.writeln('   <a id="'+gallery_list[i]["name"]+'_link"  class="header_link" href="art_gallery.html?gallery_index='+i+'">'+gallery_list[i]["title"]+'</a>');
   }
   d.writeln('   <a id="about_link"   class="header_link" href="about.html"                                                   >About</a>');
   d.writeln('   <a id="contact_link" class="header_link" href="contact.html?image_file_name=about/contact.jpg&image_title=">Contact</a>');
   d.writeln('</div>');
   d.writeln('');
   d.writeln('');

   d.close();

   if (is_older_iPad() == true)
   {
      d.getElementById("menu_button").style.fontSize = "35px";
   }
   else if (is_iPad() == true)
   {
      d.getElementById("menu_button").style.fontSize = "50px";
   }

   return true;
}

window.addEventListener("scroll", () =>
{
   var scroll_button = document.getElementById("scroll_button");


   if (scroll_button != null)
   {
      if (window.scrollY > 400)
      {
         scroll_button.style.visibility = "visible";
      }
      else
      {
         scroll_button.style.visibility = "hidden";
      }
   }
}
);