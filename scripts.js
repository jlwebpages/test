function check_if_image_exists(gallery_name,image_number,max_number_of_images,direction)
{
   $.ajax
   (
   {
      url: gallery_name+"/"+gallery_name+"_"+image_number+".jpg",

      type: "HEAD",

      success: function()
      {
         display_image_with_caption(gallery_name+"/"+gallery_name+"_"+image_number+".jpg",gallery_name,image_number);

         return true;
      },

      error: function()
      {
         if (direction == "left")
         {
            if (image_number-1 >= 1)
            {
               check_if_image_exists(gallery_name,image_number-1,max_number_of_images,"left");
            }
            else
            {
               check_if_image_exists(gallery_name,max_number_of_images,max_number_of_images,"left");
            }
         }
         else
         {
            if (image_number+1 <= max_number_of_images)
            {
               check_if_image_exists(gallery_name,image_number+1,max_number_of_images,"right");
            }
            else
            {
               check_if_image_exists(gallery_name,1,max_number_of_images,"right");
            }
         }
      },
   }
   );

   return false;
}

function close_menu()
{
   document.getElementById("menu_list").style.width = "0px";
   document.getElementById("menu_list").style.padding = "50px 0px 15px 0px";

   return true;
}

function display_gallery_page(gallery_name)
{
   window.location.href = gallery_name+".html";

   return true;
}

function display_image_with_caption(image_file_name,gallery_name,image_number)
{
   var image = new Image();


   image.onload = function()
   {
      var adjusted_image_height        = 0;
      var adjusted_image_width         = 0;
      var art_caption_style            = "";
      var container_class              = "image_container_two_column";
      var container_style              = 2;
      var height_ratio                 = 1;
      var html_string                  = "";
      var image_height                 = 0;
      var image_width                  = 0;
      var image_style                  = "";
      var max_number_of_images         = 40;
      var minimum_caption_width        = 285;
      var nav_button_vertical_position = 0;
      var one_column_container         = 1;
      var two_column_container         = 2;
      var width_ratio                  = 1;


      image_width  = this.naturalWidth;
      image_height = this.naturalHeight;

      width_ratio  = image_width/window.innerWidth;
      height_ratio = image_height/window.innerHeight;

      adjusted_image_width  = image_width/height_ratio;
      adjusted_image_height = image_height/width_ratio;

      if (window.innerWidth >= window.innerHeight)
      {
         if (image_height >= image_width)
         {
            container_style = two_column_container;
         }
         else
         {
            if (adjusted_image_height > window.innerHeight)
            {
               container_style = two_column_container;
            }
            else
            {
               container_style = one_column_container;
            }
         }
      }
      else
      {
         if (image_width >= image_height)
         {
            container_style = one_column_container;
         }
         else
         {
            if (adjusted_image_width > window.innerWidth)
            {
               container_style = one_column_container;
            }
            else
            {
               container_style = two_column_container;
            }
         }
      }

      if (container_style == two_column_container)
      {
         // Image height equals viewport height

         container_class = "image_container_two_column";

         nav_button_vertical_position = window.innerHeight / 2;

         art_caption_style = "style=\"max-width: 500px; padding-top: 5px\"";

         if (CSS.supports('height', '100dvh'))
         {
            image_style = "width: auto; height: 100dvh";
         }
         else
         {
            image_style = "width: auto; height: 100vh";
         }

         if ( (adjusted_image_width + minimum_caption_width) > (window.innerWidth) )
         {
            container_style = one_column_container;

            container_class = "image_container_one_column";

            nav_button_vertical_position = image_height * window.innerWidth/image_width / 2;

            art_caption_style = "style=\"height: auto; padding-left: 10px\"";

            image_style = "width: 100%; height: auto";
         }
      }
      else
      {
         // Image width equals viewport width

         container_class = "image_container_one_column";

         nav_button_vertical_position = image_height * window.innerWidth/image_width / 2;

         art_caption_style = "style=\"height: auto\"";

         image_style = "width: 100%; height: auto";
      }

      if (nav_button_vertical_position > window.innerHeight / 2)
      {
         nav_button_vertical_position = window.innerHeight / 2;
      }

      nav_button_vertical_position += "px";

      html_string += '';
      html_string += '';
      html_string += '<div id="art_container" class='+container_class+'>';
      html_string += '';
      html_string += '   <div id="image_div" style="display: inline-block; position: relative">';
      html_string += '      <img src="'+this.src+'" style="'+image_style+'">';
      html_string += '      <button class="nav_button nav_left_offset" style="top: '+nav_button_vertical_position+'" onclick="navigate_to_next_image(\''+gallery_name+'\',\''+image_number+'\',\''+max_number_of_images+'\',\'left\');"><div class="nav_left_shape"></div></button>';

      if (container_style == one_column_container)
      {
         html_string += '      <button id="nav_right_button" class="nav_button nav_right_offset" style="top: '+nav_button_vertical_position+'" onclick="navigate_to_next_image(\''+gallery_name+'\',\''+image_number+'\',\''+max_number_of_images+'\',\'right\');"><div class="nav_right_shape"></div></button>';
         html_string += '      <button id="back_button" class="back_button" onclick="display_gallery_page(\''+gallery_name+'\');">&times;</button>';
      }

      html_string += '   </div>';
      html_string += '';
      html_string += '   <div id="caption_div" class="art_caption" '+art_caption_style+'>';

      if (container_style == two_column_container)
      {
         html_string += '      <button id="nav_right_button" class="nav_button nav_right_offset" style="position: fixed; top: '+nav_button_vertical_position+'" onclick="navigate_to_next_image(\''+gallery_name+'\',\''+image_number+'\',\''+max_number_of_images+'\',\'right\');"><div class="nav_right_shape"></div></button>';
         html_string += '      <button id="back_button" class="back_button" onclick="display_gallery_page(\''+gallery_name+'\');">&times;</button>';
      }

      html_string += '      <span id="image_title" class="art_title"></span>';
      html_string += '      <span id="image_dimensions" class="art_dimensions"></span>';
      html_string += '      <span id="image_paragraph" class="art_paragraph"></span>';
      html_string += '   </div>';
      html_string += '';
      html_string += '</div>';
      html_string += '';
      html_string += '';

      document.body.innerHTML = html_string;

      load_image_caption(image_file_name);

      // Update the browser address field

      window.history.replaceState({}, document.title, window.location.pathname+"?image_file_name="+image_file_name);

      return true;
   }

   image.src = image_file_name;

   return true;
}

function display_menu()
{
   document.getElementById("menu_list").style.width = "150px";
   document.getElementById("menu_list").style.padding = "50px 30px 15px 20px";

   return true;
}

function load_data_from_file(file_name,element_id,display_error)
{
   $.ajax
   (
   {
      url: file_name,

      dataType: "html",

      success: function(data)
      {
         document.getElementById(element_id).insertAdjacentHTML("beforeend",data);

         if (element_id == "image_title")
         {
            file_name  = file_name.replace("title","dimensions");
            element_id = element_id.replace("title","dimensions");

            load_data_from_file(file_name,element_id,false);
         }
         else if (element_id == "image_dimensions")
         {
            file_name  = file_name.replace("dimensions","paragraph");
            element_id = element_id.replace("dimensions","paragraph");

            load_data_from_file(file_name,element_id,false);
         }
         else if (element_id == "image_paragraph")
         {
            update_button_positions();

            document.getElementById("art_container").style.visibility = "visible";
         }
      },

      error: function()
      {
         if (display_error == true) alert("Failed to load data from file:  "+file_name);

         document.getElementById(element_id).style.display = "none";

         if (element_id == "image_title")
         {
            file_name  = file_name.replace("title","dimensions");
            element_id = element_id.replace("title","dimensions");

            load_data_from_file(file_name,element_id,false);
         }
         else if (element_id == "image_dimensions")
         {
            file_name  = file_name.replace("dimensions","paragraph");
            element_id = element_id.replace("dimensions","paragraph");

            load_data_from_file(file_name,element_id,false);
         }
         else if (element_id == "image_paragraph")
         {
            update_button_positions();

            document.getElementById("art_container").style.visibility = "visible";
         }
      },
   }
   );

   return true;
}

function load_image(gallery_name,image_number,max_number_of_images,image_count)
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

   image_html = '<a href="display_image.html?image_file_name='+image_path+'" target="_self"><img src="'+image_path+'" class="art_image border_radius"></a>';

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

   if (image_number < max_number_of_images) load_image_into_gallery(gallery_name,image_number+1,max_number_of_images,image_count);

   return true;
}

function load_image_caption(image_file_name)
{
   load_data_from_file(image_file_name.split('.')[0]+"_title.txt","image_title",false);

   return true;
}

function load_image_into_gallery(gallery_name,image_number,max_number_of_images,image_count)
{
   $.ajax
   (
   {
      url: gallery_name + "/" + gallery_name + "_" + image_number + ".jpg",

      type: "HEAD",

      success: function()
      {
         load_image(gallery_name,image_number,max_number_of_images,image_count+1);
      },

      error: function()
      {
         if (image_number < max_number_of_images) load_image_into_gallery(gallery_name,image_number+1,max_number_of_images,image_count);
      },
   }
   );

   return true;
}

function load_images_into_gallery(gallery_name)
{
   var image_count          = 0;
   var image_number         = 1;
   var max_number_of_images = 40;


   load_image_into_gallery(gallery_name,image_number,max_number_of_images,image_count);

   return true;
}

function navigate_to_next_image(gallery_name,image_number,max_number_of_images,direction)
{
   image_number = parseInt(image_number);

   if (direction == "left")
   {
      check_if_image_exists(gallery_name,image_number-1,max_number_of_images,"left");
   }
   else
   {
      check_if_image_exists(gallery_name,image_number+1,max_number_of_images,"right");
   }

   return true;
}

function update_button_positions()
{
   var div_width    = 0;
   var extra_width  = 0;
   var right_offset = 5;


   if (document.getElementById("image_div")        == null) return false;
   if (document.getElementById("caption_div")      == null) return false;
   if (document.getElementById("back_button")      == null) return false;
   if (document.getElementById("nav_right_button") == null) return false;

   if (document.getElementById("art_container").classList[0] == "image_container_one_column")
   {
      right_offset = right_offset + (document.getElementById("art_container").offsetWidth - document.getElementById("art_container").clientWidth);
      right_offset += "px";

      document.getElementById("back_button").style.right = right_offset;
   }
   else if (document.getElementById("art_container").classList[0] == "image_container_two_column")
   {
      div_width   = document.getElementById("image_div").offsetWidth + document.getElementById("caption_div").offsetWidth;
      extra_width = window.innerWidth - div_width;

      if (extra_width > 0)
      {
         right_offset  = (extra_width / 2) + right_offset;
         right_offset += "px";

         document.getElementById("back_button").style.right      = right_offset;
         document.getElementById("nav_right_button").style.right = right_offset;      
      }
   }

   return true;
}

function validate_received_image_name()
{
   var gallery_name       = "";
   var html_name          = "";
   var html_path_segments = "";
   var image_file_name    = "";
   var image_number       = "";
   var index              = -1;
   var URL_string         = window.location.search;
   var URL_parameters     = new URLSearchParams(URL_string);


   html_path_segments = window.location.pathname.split('/');
   html_name = html_path_segments[html_path_segments.length - 1];

   image_file_name = URL_parameters.get("image_file_name");

   if ( (image_file_name == null) || (image_file_name == "") )
   {
      alert("Error:\n\nInvalid Image File Name passed to " + html_name);

      history.back();
   }

   index = image_file_name.indexOf("/");

   if (index != -1)
   {
      gallery_name = image_file_name.slice(0, index);
   }

   if (gallery_name == "")
   {
      alert("Error:\n\nInvalid Gallery Name passed to " + html_name);

      history.back();
   }

   image_number = parseInt(image_file_name.replace(/\D/g, ''));

   if (Number.isInteger(image_number) == false)
   {
      alert("Error:\n\nInvalid Image Number passed to " + html_name);

      history.back();
   }

   display_image_with_caption(image_file_name,gallery_name,image_number);

   return true;
}

function write_footer()
{
   var year = new Date().getFullYear();


   document.writeln('<div style="text-align: center; padding: 25px 0px 0px 0px">');
   document.writeln('   <a href="mailto:dkclaguna@gmail.com?subject=Darlene Laguna Art"><img src="email_icon.png"     height="15px" style="padding: 0px 20px 0px 20px; vertical-align: middle"></a>');
   document.writeln('   <a href="https://www.instagram.com/dklaguna_art">               <img src="instagram_icon.png" height="16px" style="padding: 0px 20px 0px 20px; vertical-align: middle"></a>');
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
   d.writeln('   <a href="javascript:void(0)" class="close_button" onclick="close_menu();">&times;</a>');
   d.writeln('   <a href="featured_work.html"  >Featured Work</a>');
   d.writeln('   <a href="photo_art.html"      >Photo Art</a>');
   d.writeln('   <a href="works_on_paper.html" >Paper</a>');
   d.writeln('   <a href="about.html"          >About</a>');
   d.writeln('   <div style="border-top: 1px solid darkslategray; margin: 10px 0px 0px 10px">');
   d.writeln('      <a href="mailto:dkclaguna@gmail.com?subject=Darlene Laguna Art" style="display: inline-block"><img src="email_icon.png"     height="15px" style="margin: 15px 0px 0px -10px"></a>');
   d.writeln('      <a href="https://www.instagram.com/dklaguna_art"                style="display: inline-block"><img src="instagram_icon.png" height="16px" ></a>');
   d.writeln('   </div>');
   d.writeln('</div>');
   d.writeln('');
   d.writeln('<div class="title">DARLENE LAGUNA</div>');
   d.writeln('');
   d.writeln('<div class="header_links">');
   d.writeln('   <a id="featured_work_link"  class="header_link" href="featured_work.html" >Featured Work</a>');
   d.writeln('   <a id="photo_art_link"      class="header_link" href="photo_art.html"     >Photo Art</a>');
   d.writeln('   <a id="works_on_paper_link" class="header_link" href="works_on_paper.html">Paper</a>')
   d.writeln('   <a id="about_link"          class="header_link" href="about.html"         >About</a>');
   d.writeln('</div>');
   d.writeln('');
   d.writeln('');

   d.close();

   return true;
}