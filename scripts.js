// Global variables.

var max_image_number = 0;

// Constant variables.  These values should be set based on the largest image file number from the respective website subfolders.

const galleries = [{name: "featured_work",  title: "Featured Work",  max_image_number: 32},
                   {name: "photo_art",      title: "Photo Art",      max_image_number: 28},
                   {name: "works_on_paper", title: "Works on Paper", max_image_number:  9}];


function check_if_image_exists(gallery_name,image_number,max_image_number,direction)
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
               check_if_image_exists(gallery_name,1,max_image_number,"right");
            }
         }
         else
         {
            display_image_with_caption(gallery_name+"/"+gallery_name+"_"+image_number+".jpg",gallery_name,image_number);
         }

         return true;
      },

      error: function()
      {
         if (direction == "right")
         {
            if (image_number+1 <= max_image_number)
            {
               check_if_image_exists(gallery_name,image_number+1,max_image_number,"right");
            }
            else
            {
               check_if_image_exists(gallery_name,1,max_image_number,"right");
            }
         }
         else
         {
            if (image_number-1 >= 1)
            {
               check_if_image_exists(gallery_name,image_number-1,max_image_number,"left");
            }
            else
            {
               check_if_image_exists(gallery_name,max_image_number,max_image_number,"left");
            }
         }
      },
   }
   );

   return false;
}

function check_if_image_sold(gallery_name,image_number,max_image_number,image_count)
{
   $.ajax
   (
   {
      url: gallery_name+"/"+gallery_name+"_"+image_number+"_caption.txt",

      dataType: "html",

      success: function(data)
      {
         image_sold = false;

         if (data.includes("sold_text") == true) image_sold = true;

         load_image(gallery_name,image_number,image_count+1,image_sold);
      },

      error: function()
      {
         load_image(gallery_name,image_number,image_count+1,false);
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

function display_gallery_page(gallery_name)
{
   for (i = 0; i < galleries.length; i++)
   {
      if (gallery_name == galleries[i]["name"])
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

            art_container_style = "style=\"width: "+adjusted_image_width+"px; margin-left: "+art_container_margin+"px; margin-right: "+art_container_margin+"px\"";
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

            if ( (navigator.userAgent.toLowerCase().indexOf("mobile") != -1) && (navigator.platform.toLowerCase().indexOf("ipad") != -1) )
            {
               // Make vertical button position adjustments for older iPads.

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
      html_string += '<center><div id="art_container" class="'+art_container_class+' fade_in" '+art_container_style+'">';  // Not sure why I can't find another why to center besides <center>.
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
      html_string += '</div></center>';
      html_string += '';
      html_string += '<button id="nav_back"  class="back_button"                 style="top: '+back_button_vertical_position+'" onclick="display_gallery_page(\''+gallery_name+'\');">&times;</button>';
      html_string += '<button id="nav_left"  class="nav_button nav_left_offset"  style="top: '+nav_button_vertical_position+'"  onclick="navigate_to_next_image(\''+gallery_name+'\',\''+image_number+'\',\'left\');"><div class="nav_left_shape"></div></button>';
      html_string += '<button id="nav_right" class="nav_button nav_right_offset" style="top: '+nav_button_vertical_position+'"  onclick="navigate_to_next_image(\''+gallery_name+'\',\''+image_number+'\',\'right\');"><div class="nav_right_shape"></div></button>';
      html_string += '';
      html_string += '';

      document.body.innerHTML = html_string;

      load_image_caption(image_file_name);

      // Update the browser address field

      window.history.replaceState({}, document.title, window.location.pathname+"?image_file_name="+image_file_name+"&max_image_number="+max_image_number);

      return true;
   }

   image.src = image_file_name;

   return true;
}

function display_menu()
{
   document.getElementById("menu_list").style.width   = "160px";
   document.getElementById("menu_list").style.height  = 110 + (galleries.length * 40) + "px";
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

   if ( (gallery_index < 0) || (gallery_index > galleries.length-1) )
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
   max_image_number = URL_parameters.get("max_image_number");  // Assign global variable;

   if ( (image_file_name == null) || (image_file_name == "") )
   {
      alert("Error:\n\nInvalid Image File Name passed to " + html_file_name);

      history.back();
   }

   if ( (max_image_number == null) || (max_image_number == "") )
   {
      alert("Error:\n\nInvalid Max Image Number passed to " + html_file_name);

      history.back();
   }

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

function load_data_from_file(file_name,element_id,display_error,scroll_to_exhibitions)
{
   $.ajax
   (
   {
      url: file_name,

      dataType: "html",

      success: function(data)
      {
         document.getElementById(element_id).textContent = "";
         document.getElementById(element_id).insertAdjacentHTML("beforeend",data);

         if (element_id == "about_text")
         {
            file_name  = file_name.replace("about.txt","exhibitions.txt");
            element_id = element_id.replace("about_text","exhibitions_text");

            load_data_from_file(file_name,element_id,display_error,scroll_to_exhibitions);
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

function load_image(gallery_name,image_number,image_count,image_sold)
{
   var column_count     = window.getComputedStyle(document.getElementById("art_gallery")).columnCount;
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

   if (true)               image_html += '<div class="art_image_link_container">\n';
   if (true)               image_html += '   <a class="art_image_link" href="display_image.html?image_file_name='+image_path+'&max_image_number='+max_image_number+'" target="_self"><img src="'+image_path+'" class="art_image border_radius"></a>\n';
   if (image_sold == true) image_html += '   <div id="solld_tag" class="sold_tag">SOLD</div>\n';
   if (true)               image_html += '</div>\n';

   document.getElementById("one_column_1").insertAdjacentHTML("beforeend",image_html);

   if (image_count % 2 != 0)
   {
      // image_count is odd

      document.getElementById("two_column_1").insertAdjacentHTML("beforeend", image_html);
   }
   else
   {
      // image_count is even

      document.getElementById("two_column_2").insertAdjacentHTML("beforeend", image_html);
   }

   if (image_count % 3 == 0)
   {
      // image_count is a multiple of 3

      document.getElementById("three_column_3").insertAdjacentHTML("beforeend", image_html);
   }
   else
   {
      document.getElementById("three_column_"+(image_count % 3)).insertAdjacentHTML("beforeend", image_html);
   }

   if (image_number < max_image_number) load_image_into_gallery(gallery_name,image_number+1,max_image_number,image_count);

   return true;
}

function load_image_caption(image_file_name)
{
   load_data_from_file(image_file_name.split('.')[0]+"_caption.txt","image_caption",true);

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
         check_if_image_sold(gallery_name,image_number,max_image_number,image_count);
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
   var image_number = 1;


   max_image_number = galleries[gallery_index]["max_image_number"];

   document.getElementById("art_gallery").insertAdjacentHTML("beforebegin","<div id='gallery_header' class='header_link' style='text-align: center; margin-bottom: 25px; display: none'>"+galleries[gallery_index]["title"]+"</div>");

   load_image_into_gallery(galleries[gallery_index]["name"],image_number,max_image_number,image_count);

   return true;
}

function navigate_to_next_image(gallery_name,image_number,direction)
{
   image_number = parseInt(image_number);

   if (direction == "right")
   {
      check_if_image_exists(gallery_name,image_number+1,max_image_number,"right");

   }
   else
   {
      check_if_image_exists(gallery_name,image_number-1,max_image_number,"left");
   }

   return true;
}

function write_footer()
{
   var year = new Date().getFullYear();


   document.writeln('<div style="text-align: center; padding: 25px 0px 0px 0px">');
   document.writeln('   <a href="mailto:dkclaguna@gmail.com?subject=Darlene Laguna Art" title="Email"    ><img src="email_icon.png"     height="15px" style="padding: 0px 20px 0px 20px; vertical-align: middle"></a>');
   document.writeln('   <a href="https://www.instagram.com/dklaguna_art"                title="Instagram"><img src="instagram_icon.png" height="16px" style="padding: 0px 20px 0px 20px; vertical-align: middle"></a>');
   document.writeln('</div>');
   document.writeln('');
   document.writeln('<div class="copyright">Copyright &copy '+year+' Darlene Laguna Art<br>All Rights Reserved.</div>');

   return true;
}

function write_header()
{
   document.open();

   var d = document;

   d.writeln('');
   d.writeln('');
   d.writeln('<span class="menu_button" onclick="display_menu();">&#9776;</span>');
   d.writeln('');
   d.writeln('<div id="menu_list" class="menu">');
   d.writeln('   <span class="close_button" onclick="close_menu();">&times;</span>');
   for (i = 0; i < galleries.length; i++)
   {
      d.writeln('   <a href="art_gallery.html?gallery_index='+i+'">'+galleries[i]["title"]+'</a>');
   }
   d.writeln('   <a href="about.html"          >About</a>');
   d.writeln('   <div style="border-top: 1px solid darkslategray; margin: 10px 0px 0px 10px; white-space: nowrap">');
   d.writeln('      <a href="mailto:dkclaguna@gmail.com?subject=Darlene Laguna Art" title="Email"     style="display: inline-block"><img src="email_icon.png"     height="15px" style="margin: 15px 0px 0px -10px"></a>');
   d.writeln('      <a href="https://www.instagram.com/dklaguna_art"                title="Instagram" style="display: inline-block"><img src="instagram_icon.png" height="16px"                                   ></a>');
   d.writeln('   </div>');
   d.writeln('</div>');
   d.writeln('');
   d.writeln('<div class="title">DARLENE LAGUNA</div>');
   d.writeln('');
   d.writeln('<div class="header_links">');
   for (i = 0; i < galleries.length; i++)
   {
      d.writeln('   <a id="'+galleries[i]["name"]+'_link"  class="header_link" href="art_gallery.html?gallery_index='+i+'">'+galleries[i]["title"]+'</a>');
   }
   d.writeln('   <a id="about_link"          class="header_link" href="about.html"         >About</a>');
   d.writeln('</div>');
   d.writeln('');
   d.writeln('');

   d.close();

   return true;
}