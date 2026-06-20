// Global variables.

var min_image_number = 0;
var max_image_number = 0;

// Constant variables.  These values should be set based on the largest image file number from the respective website subfolders.

const gallery_list = [{name: "featured_work",  title: "Gallery",        min_image_number: 2, max_image_number: 22, new_list: [2,3,4,5]},
                      {name: "photo_art",      title: "Photo Art",      min_image_number: 6, max_image_number: 16, new_list: [0]},
                      {name: "works_on_paper", title: "Works on Paper", min_image_number: 6, max_image_number: 11, new_list: [0]},
                      {name: "sold",           title: "Sold",           min_image_number: 1, max_image_number: 19, new_list: [0]}]


function check_if_image_exists(gallery_name,image_number,min_image_number,max_image_number,direction)
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
               check_if_image_exists(gallery_name,min_image_number,min_image_number,max_image_number,"right");
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
               check_if_image_exists(gallery_name,max_image_number,min_image_number,max_image_number,"left");
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
               check_if_image_exists(gallery_name,image_number+1,min_image_number,max_image_number,"right");
            }
            else
            {
               check_if_image_exists(gallery_name,min_image_number,min_image_number,max_image_number,"right");
            }
         }
         else
         {
            if (image_number-1 >= min_image_number)
            {
               check_if_image_exists(gallery_name,image_number-1,min_image_number,max_image_number,"left");
            }
            else
            {
               check_if_image_exists(gallery_name,max_image_number,min_image_number,max_image_number,"left");
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
      var adjusted_image_height         = 0;
      var adjusted_image_width          = 0;
      var art_container_class           = "";
      var art_container_margin          = 35;
      var art_container_style           = "";
      var back_button_vertical_position = 5;
      var caption_div_style             = "";
      var height_ratio                  = 1;
      var html_string                   = "";
      var image_height                  = 0;
      var image_width                   = 0;
      var image_style                   = "";
      var minimum_caption_width         = 285;
      var nav_button_vertical_position  = 5;
      var width_ratio                   = 1;
      var window_inner_height           = window.innerHeight;
      var window_inner_width            = window.innerWidth;


      image_width  = this.naturalWidth;
      image_height = this.naturalHeight;

      width_ratio  = image_width/window_inner_width;
      height_ratio = image_height/window_inner_height;

      adjusted_image_width  = image_width/height_ratio;
      adjusted_image_height = image_height/width_ratio;

      // If running in portrait orientation, set up a one column container instead of two.

      if (window_inner_height >= window_inner_width)
      {
         art_container_class = "image_container_one_column";
         caption_div_style   = "style=\"height: auto\"";

         if (image_width < window_inner_width)
         {
            image_style = "style=\"width: "+window_inner_width+"px; height: auto\"";
         }
         else
         {
            image_style = "style=\"width: 100%; height: auto\""; 
         }

         nav_button_vertical_position = image_height * window_inner_width/image_width / 2;

         if (window_inner_width > 655)  // 655 is consistent with "@media only screen and (max-width: 655px) and (orientation: portrait)" in styles.css.
         {
            adjusted_image_width = window_inner_width - art_container_margin*2;

            if (adjusted_image_width > 655) adjusted_image_width = 655;

            art_container_style = "style=\"width: "+adjusted_image_width+"px; margin: 0px auto\"";
            image_style         = "style=\"width: "+adjusted_image_width+"px; height: auto\"";

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
            adjusted_image_height = image_height * (adjusted_image_width/image_width) - 15;  // Not exactly sure why -15.  Maybe to account for caption_div top and/or bottom margins.

            art_container_style = "style=\"margin-left: "+art_container_margin+"px; margin-right: "+art_container_margin+"px; place-content: center\"";
            image_style         = "style=\"width: "+adjusted_image_width+"px\"";
            caption_div_style   = "style=\"max-width: 500px; height: "+adjusted_image_height+"px; padding-top: 5px\"";

            back_button_vertical_position = ( (window_inner_height-adjusted_image_height) / 2 ) - 10;  // Not exactly sure why -10.

            if (back_button_vertical_position < 5) back_button_vertical_position = 5;

            if (is_older_iPad() == true)
            {
               // Make vertical button position adjustments.

               if (back_button_vertical_position > 5) back_button_vertical_position += 13;

               nav_button_vertical_position += 13;
            }
         }
         else   
         {
            if (CSS.supports('height', '100dvh'))
            {
               image_style = "style=\"width: auto; height: 100dvh\"";
            }
            else
            {
               image_style = "style=\"width: auto; height: 100vh\"";
            }

            art_container_style = "style=\"margin-left: "+art_container_margin+"px; margin-right: "+art_container_margin+"px\"";
            caption_div_style   = "style=\"max-width: 500px; padding-top: 5px\"";
         }

         nav_button_vertical_position = window_inner_height / 2;
      }

      back_button_vertical_position += "px";
      nav_button_vertical_position  += "px";

      html_string += '';
      html_string += '';
      html_string += '<div id="art_container" class="'+art_container_class+' fade_in" '+art_container_style+'">';
      html_string += '';
      html_string += '   <div id="image_div" class="fade_in" style="display: inline-block; position: relative">';
      html_string += '      <img src="'+this.src+'" '+image_style+'">';
      html_string += '   </div>';
      html_string += '';
      html_string += '   <div id="caption_div" class="art_caption fade_in" '+caption_div_style+'>';
      html_string += '      <div id="image_caption">';
      html_string += '        <!-- Load data from file. -->';   
      html_string += '      </div>';
      html_string += '   </div>';
      html_string += '';
      html_string += '</div>';
      html_string += '';
      html_string += '<button id="nav_back"  class="back_button"                 style="top: '+back_button_vertical_position+'" onclick="display_gallery_page(\''+gallery_name+'\');">&times;</button>';
      html_string += '<button id="nav_left"  class="nav_button nav_left_offset"  style="top: '+nav_button_vertical_position+'"  onclick="navigate_to_next_image(\''+gallery_name+'\',\''+image_number+'\',\'left\');"><div class="nav_left_shape"></div></button>';
      html_string += '<button id="nav_right" class="nav_button nav_right_offset" style="top: '+nav_button_vertical_position+'"  onclick="navigate_to_next_image(\''+gallery_name+'\',\''+image_number+'\',\'right\');"><div class="nav_right_shape"></div></button>';
      html_string += '';
      html_string += '';

      document.body.innerHTML = html_string;

      load_image_caption(gallery_name,image_number);

      // Update the browser address field.

      window.history.replaceState({}, document.title, window.location.pathname+"?image_file_name="+image_file_name+"&min_image_number="+min_image_number+"&max_image_number="+max_image_number);

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

function get_gallery_index_url_parameter()
{
   var error_flag         = false;
   var gallery_index      = null;
   var html_file_name     = "";
   var html_path_segments = "";
   var URL_parameters     = new URLSearchParams(window.location.search);


   gallery_index      = URL_parameters.get("gallery_index");
   html_path_segments = window.location.pathname.split('/');
   html_file_name     = html_path_segments[html_path_segments.length - 1];

   if (gallery_index == null)
   {
      alert("Error:\n\nGallery Index not passed to " + html_file_name);

      if (history.length > 1)
      {
         history.back();
      }
      else
      {
         window.close();
      }
   }

   if ( gallery_index != gallery_index.replace(/\D/g, "") )
   {
      alert("Error:\n\nInvalid Gallery Index passed to " + html_file_name);

      if (history.length > 1)
      {
         history.back();
      }
      else
      {
         window.close();
      }
   }

   if ( (gallery_index < 0) || (gallery_index > gallery_list.length-1) )
   {
      alert("Error:\n\nGallery Index out-of-range passed to " + html_file_name);

      if (history.length > 1)
      {
         history.back();
      }
      else
      {
         window.close();
      }
   }

   return gallery_index;
}

function get_image_url_parameters()
{
   var gallery_name       = "";
   var html_file_name     = "";
   var html_path_segments = "";
   var image_file_name    = "";
   var image_number       = "";
   var index              = -1;
   var URL_parameters     = new URLSearchParams(window.location.search);


   html_path_segments = window.location.pathname.split('/');
   html_file_name = html_path_segments[html_path_segments.length - 1];

   image_file_name = URL_parameters.get("image_file_name");
   min_image_number = URL_parameters.get("min_image_number");  // Assign global variable.
   max_image_number = URL_parameters.get("max_image_number");  // Assign global variable.

   if ( (image_file_name == null) || (image_file_name == "") )
   {
      alert("Error:\n\nInvalid Image File Name passed to " + html_file_name);

      history.back();
   }

   if ( (min_image_number == null) || (min_image_number == "") )
   {
      alert("Error:\n\nInvalid Min Image Number passed to " + html_file_name);

      history.back();
   }

   min_image_number = parseInt(min_image_number);

   if ( (max_image_number == null) || (max_image_number == "") )
   {
      alert("Error:\n\nInvalid Max Image Number passed to " + html_file_name);

      history.back();
   }

   max_image_number = parseInt(max_image_number);

   index = image_file_name.indexOf("/");

   if (index != -1)
   {
      gallery_name = image_file_name.slice(0, index);
   }

   if (gallery_name == "")
   {
      alert("Error:\n\nInvalid Gallery Name passed to " + html_file_name);

      history.back();
   }

   image_number = parseInt(image_file_name.replace(/\D/g, ''));

   if (Number.isInteger(image_number) == false)
   {
      alert("Error:\n\nInvalid Image Number passed to " + html_file_name);

      history.back();
   }

   return {image_file_name,gallery_name,image_number}; 
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

function load_data_from_file(gallery_name,file_name,element_id,title_extension,scroll_to_exhibitions,display_error)
{
   $.ajax
   (
   {
      url: file_name,

      dataType: "html",

      success: function(data)
      {
         if (element_id == "image_caption")
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

               data += '<a class="general_link inquire_link" href="contact.html?image_file_name='+image_file_name+'&image_title='+image_title+'">Contact for price</a>';
            }
         }

         document.getElementById(element_id).textContent = "";
         document.getElementById(element_id).insertAdjacentHTML("beforeend",data);

         if (element_id == "about_text")
         {
            file_name  = file_name.replace("about.txt","exhibitions.txt");
            element_id = element_id.replace("about_text","exhibitions_text");

            load_data_from_file(gallery_name,file_name,element_id,title_extension,scroll_to_exhibitions,display_error);
         }
         else if (element_id == "exhibitions_text")
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
   var column_count     = window.getComputedStyle(document.getElementById("art_gallery")).getPropertyValue("grid-template-columns").split(" ").length;
   var file_name_prefix = gallery_name + "_" + image_number;
   var file_path_prefix = gallery_name + "/" + file_name_prefix;
   var image_html       = "";
   var image_path       = file_path_prefix + ".jpg";


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
   image_html += '   <a class="art_image_link" href="display_image.html?image_file_name='+image_path+'&min_image_number='+min_image_number+'&max_image_number='+max_image_number+'" target="_self"><img src="'+image_path+'" class="art_image border_radius"></a>\n';

   for (i = 0; i < gallery_list[gallery_index]["new_list"].length; i++)
   {
      if (image_number == gallery_list[gallery_index]["new_list"][i])
      {
         image_html += '   <div id="solld_tag" class="new_tag">NEW</div>\n';
      }
   }

   if (gallery_name.toLowerCase().includes("sold") == true)
   {
      image_html += '   <div id="solld_tag" class="sold_tag">SOLD</div>\n';
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

   if (image_number < max_image_number) load_image_into_gallery(gallery_name,image_number+1,max_image_number,image_count);

   return true;
}

function load_image_caption(gallery_name,image_number)
{
   var image_file_name = "./"+gallery_name+"/"+gallery_name+"_"+image_number+"_caption.txt"
   var title_extension = "";


   // Add "new" to end of art title if item is new.

   for (i = 0; i < gallery_list.length; i++)
   {
      if (gallery_name == gallery_list[i]["name"])
      {
         for (j = 0; j < gallery_list[i]["new_list"].length; j++)
         {
            if (image_number == gallery_list[i]["new_list"][j])
            {
               title_extension = '<span class="new_text"> new</span>';

               break;
            }
         }
      }
   }

   // Add "sold" to end of art title if item is sold.

   if (gallery_name == "sold")
   {
      title_extension = '<span class="sold_text"> sold</span>';
   }

   load_data_from_file(gallery_name,image_file_name,"image_caption",title_extension,false,true);

   return true;
}

function load_image_into_gallery(gallery_name,image_number,max_image_number,image_count)
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
         if (image_number < max_image_number) load_image_into_gallery(gallery_name,image_number+1,max_image_number,image_count);
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

   load_image_into_gallery(gallery_list[gallery_index]["name"],image_number,max_image_number,image_count);

   return true;
}

function navigate_to_next_image(gallery_name,image_number,direction)
{
   image_number = parseInt(image_number);

   if (direction == "right")
   {
      check_if_image_exists(gallery_name,image_number+1,min_image_number,max_image_number,"right");

   }
   else
   {
      check_if_image_exists(gallery_name,image_number-1,min_image_number,max_image_number,"left");
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

   if (window.innerHeight >= window.innerWidth)
   {
      // We're in portrait orientation.

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

function update_contact_image(image_file_name,direction)
{
   var contact_image_file_name = "./about/contact.jpg";
   var gallery_index           = -1;
   var gallery_name            = image_file_name.split("/")[1];
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
         image_caption_file_name = "./" + gallery_list[min_gallery_index]["name"] + "/" + gallery_list[min_gallery_index]["name"] + "_" + gallery_list[min_gallery_index]["min_image_number"] + "_caption.txt";
      }
      else  // direction == "left"
      {
         image_caption_file_name = "./" + gallery_list[max_gallery_index]["name"] + "/" + gallery_list[max_gallery_index]["name"] + "_" + gallery_list[max_gallery_index]["max_image_number"] + "_caption.txt";
      }
   }
   else
   {
      if (direction == "right")
      {
         if (image_number < gallery_list[gallery_index]["max_image_number"])
         {
            image_caption_file_name = "./" + gallery_name + "/" + gallery_name + "_" + (parseInt(image_number,10)+1) + "_caption.txt";
         }
         else  // image number == gallery_list[gallery_index]["max_image_number"]
         {
            if (gallery_index == max_gallery_index)
            {
               image_caption_file_name = contact_image_file_name.replace(".jpg",".txt");
            }
            else
            {
               image_caption_file_name = "./" + gallery_list[gallery_index+1]["name"] + "/" + gallery_list[gallery_index+1]["name"] + "_" + gallery_list[gallery_index+1]["min_image_number"] + "_caption.txt";
            }
         }
      }
      else  // direction == "left"
      {
         if (image_number > gallery_list[gallery_index]["min_image_number"])
         {
            image_caption_file_name = "./" + gallery_name + "/" + gallery_name + "_" + (parseInt(image_number,10)-1) + "_caption.txt";
         }
         else  // image number == gallery_list[gallery_index]["min_image_number"]
         {
            if (gallery_index == min_gallery_index)
            {
               image_caption_file_name = contact_image_file_name.replace(".jpg",".txt");
            }
            else
            {
               image_caption_file_name = "./" + gallery_list[gallery_index-1]["name"] + "/" + gallery_list[gallery_index-1]["name"] + "_" + gallery_list[gallery_index-1]["max_image_number"] + "_caption.txt";
            }
         }
      }
   }

   display_contact_page(image_caption_file_name,direction,true);
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
   d.writeln('   <a href="contact.html?image_file_name=./about/contact.jpg&image_title=" tabindex="-1">Contact</a>');
   d.writeln('   <div style="border-top: 1px solid #444444; margin: 10px 0px 0px 10px; white-space: nowrap" tabindex="-1">');
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
   d.writeln('   <a id="contact_link" class="header_link" href="contact.html?image_file_name=./about/contact.jpg&image_title=">Contact</a>');
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
      if (window.scrollY > 500)
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