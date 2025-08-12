function check_if_image_exists(gallery_name,image_number,max_number_of_images)
{
   $.ajax
   (
   {
      url: gallery_name + "/" + gallery_name + "_" + image_number + ".jpg",

      type: "HEAD",

      success: function()
      {
         load_image(gallery_name,image_number,max_number_of_images);
      },

      error: function()
      {
         if (image_number < max_number_of_images) check_if_image_exists(gallery_name,image_number+1,max_number_of_images);
      },
   }
   );

   return true;
}

function close_menu()
{
   document.getElementById("menu_list").style.width = "0";

   return true;
}

function display_menu()
{
   document.getElementById("menu_list").style.width = "250px";

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
         $("#"+element_id).html(data);
      },

      error: function()
      {
         if (display_error == true) alert("Failed to load data from file:  "+file_name);

         $("#"+element_id).hide();
      },
   }
   );

   return true;
}

function load_image(gallery_name,image_number,max_number_of_images)
{
   var art_gallery_div  = document.getElementById("art_gallery");
   var file_name_prefix = gallery_name + "_" + image_number;
   var file_path_prefix = gallery_name + "/" + file_name_prefix;
   var image_html       = "";
   var image_path       = file_path_prefix + ".jpg";


   image_html  = '<div class="art_image">';
   image_html += '   <a href="display_image.html?image_file_name='+image_path+'" target="_self"><img src="'+image_path+'" class="border_radius"></a>';
   image_html += '   <p class="art_caption">';
   image_html += '      <span id="'+file_name_prefix+'_title" class="art_title"></span><br>';
   image_html += '      <span id="'+file_name_prefix+'_dimensions" class="art_dimensions"></span><br>';
   image_html += '      <span id="'+file_name_prefix+'_paragraph" class="art_paragraph"></span>';
   image_html += '   </p>';
   image_html += '</div>';

   art_gallery_div.insertAdjacentHTML("beforeend",image_html);

   load_data_from_file(file_path_prefix+"_title.txt",file_name_prefix+"_title",false);
   load_data_from_file(file_path_prefix+"_dimensions.txt",file_name_prefix+"_dimensions",false);
   load_data_from_file(file_path_prefix+"_paragraph.txt",file_name_prefix+"_paragraph",false);

   if (image_number < max_number_of_images) check_if_image_exists(gallery_name,image_number+1,max_number_of_images)

   return true;
}

function load_images_into_gallery(gallery_name)
{
   var image_number         = 1;
   var max_number_of_images = 100;


   check_if_image_exists(gallery_name,image_number,max_number_of_images);

   return true;
}

function scroll_to_top()
{
   $(document).ready(function()
   {
      window.scroll({top: 0});
   }
   );

   return true;
}

function write_copyright()
{
   document.writeln('<div class="copyright">Copyright &copy 2024 Darlene Laguna Art<br>All Rights Reserved.</div>');

   return true;
}

function write_header()
{
   document.open();

   var d = document;

   d.writeln('');
   d.writeln('');
   d.writeln('<span id="menu" style="font-size: 30px; cursor: pointer; visibility: hidden; padding-left: 5px" onclick="display_menu();" onPress="display_menu();">&#9776;</span>');
   d.writeln('');
   d.writeln('<div id="menu_list" class="menu">');
   d.writeln('   <a href="javascript:void(0)" class="close_button" onclick="close_menu();" onPress="close_menu();">&times;</a>');
   d.writeln('   <a href="featured_work.html"  >FEATURED WORK</a>');
   d.writeln('   <a href="photo_art.html"      >PHOTO ART</a>');
   d.writeln('   <a href="works_on_paper.html" >WORKS ON PAPER</a>');
   d.writeln('   <a href="about.html"          >ABOUT</a>');
   d.writeln('   <a href="how_to_purchase.html">HOW TO PURCHASE</a>');
   d.writeln('</div>');
   d.writeln('');
   d.writeln('<table class="white_table">');
   d.writeln('   <tr>');
   d.writeln('      <td id="title" class="title" style="padding-top: 0px; padding-bottom: 25px">DARLENE LAGUNA ART</td>');
   d.writeln('   </tr>');
   d.writeln('');
   d.writeln('</table>');
   d.writeln('');
   d.writeln('<table id="links" class="white_table" style="padding-bottom: 50px; width: 80%; white-space: nowrap">');
   d.writeln('   <tr>');
   d.writeln('      <td style="padding-left: 10px; padding-right: 10px"><a id="featured_work_link"   class="link" href="featured_work.html"  >FEATURED WORK</a></td>');
   d.writeln('      <td style="padding-left: 10px; padding-right: 10px"><a id="photo_art_link"       class="link" href="photo_art.html"      >PHOTO ART</a></td>');
   d.writeln('      <td style="padding-left: 10px; padding-right: 10px"><a id="works_on_paper_link"  class="link" href="works_on_paper.html" >WORKS ON PAPER</a></td>')
   d.writeln('      <td style="padding-left: 10px; padding-right: 10px"><a id="about_link"           class="link" href="about.html"          >ABOUT</a></td>');
   d.writeln('      <td style="padding-left: 10px; padding-right: 10px"><a id="how_to_purchase_link" class="link" href="how_to_purchase.html">HOW TO PURCHASE</a></td>');
   d.writeln('   </tr>');
   d.writeln('</table>');
   d.writeln('');
   d.writeln('');

   d.close();

   return true;
}