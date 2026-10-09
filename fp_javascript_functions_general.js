
function close_mobile_menu()
{
  document.getElementById("mobile_menu").style.width = "0px";
  document.getElementById("fp_main").style.pointerEvents = "auto";
}


function open_mobile_menu()
{
  document.getElementById("mobile_menu").style.width = "220px";
  document.getElementById("fp_main").style.pointerEvents = "none";
}


function display_last_modified (last_modified_document, display_document)
{
   if (last_modified_document.lastModified == 0)
   {
      display_document.write("Unknown");
      return false;
   }

   Last_Modified = new Date(last_modified_document.lastModified);

   Hour   = Last_Modified.getHours();
   Minute = Last_Modified.getMinutes();
   Month  = Last_Modified.getMonth();

   if (Hour > 12)
   {
      Hour = Hour-12;
      AM_PM = "PM";
   }
   else
   {
      AM_PM = "AM";
   }

   if (Minute < 10) Minute = "0" + Minute;

   switch (Month)
   {
      case 0:
         Month = "Jan";
         break;
      case 1:
         Month = "Feb";
         break;
      case 2:
         Month = "Mar";
         break;
      case 3:
         Month = "Apr";
         break;
      case 4:
         Month = "May";
         break;
      case 5:
         Month = "Jun";
         break;
      case 6:
         Month = "Jul";
         break;
      case 7:
         Month = "Aug";
         break;
      case 8:
         Month = "Sep";
         break;
      case 9:
         Month = "Oct";
         break;
      case 10:
         Month = "Nov";
         break;
      case 11:
         Month = "Dec";
         break;
      default:
         break;
   }

   display_document.write(Month," ",Last_Modified.getDate(),", ",Last_Modified.getFullYear()," at ",Hour,":",Minute," ",AM_PM);

   return true;
}


function get_nfl_playoff_teams(year,mode)
{
   var nfl_connection        = null;
   var nfl_playoff_teams     = "";
   var nfl_playoff_teams_url = "";


   // Don't get this year's playoff teams if Week 1 games have not been completed yet because the HttpRequest call might return last year's playoff teams.

   if ( (year == top.fp_year) && (top.current_input_week <= 2) && (top.games_over == false) )
   {
      if (mode == "main")
      {
         // Redisplay main home page without displaying NFL playoff teams.

         top.display_frame("fp_main",0);
      }
      else
      {
         alert(year+" NFL Playoff Teams are not known yet.");

         // Return to main home page.

         history.back();
      }

      return;
   }

   // Set nfl_playoff_teams_url

   if ( (year == top.fp_year) && (top.season_over == false) )
   {
      nfl_playoff_teams_url = "www.espn.com/nfl/standings/_/view/playoff";
   }
   else
   {
      nfl_playoff_teams_url = "www.espn.com/nfl/standings/_/season/"+year+"/view/playoff";
   }

   // Display loading indicator while call to XMLHttpRequest is working.

   top.display_frame("fp_loading_indicator",0);

   // Get the NFL playoff teams from the internet.

   nfl_connection = new XMLHttpRequest();

   nfl_connection.open("GET","https://www.scrappintwins.com/cors/"+nfl_playoff_teams_url,true); // scrappintwins.com provided by Dan M.

   nfl_connection.setRequestHeader("Cache-Control","no-cache, no-store, must-revalidate");

   nfl_connection.onload = function(e)
   {
      if (nfl_connection.readyState === 4) // Is XMLHttpRequest complete?
      {
         if (nfl_connection.status === 200) // Was the XMLHttpRequest successful?
         {
            nfl_playoff_teams = nfl_connection.responseText;

            if (process_nfl_playoff_teams(nfl_playoff_teams,year) == false)
            {
               if (mode != "main")
               {
                  if (year == top.fp_year)
                  {
                     alert(year+" NFL Playoff Teams are not known yet.");
                  }
                  else
                  {
                     alert("Unable to retrieve "+year+" NFL Playoff Teams.");
                  }

                  history.back();
               }
            }
         }
         else // XMLHttpRequest was unsuccessful.
         {
            //JL alert("\"get_nfl_playoff_teams\" failed.");

            if (mode != "main")
            {
               alert("Unable to retrieve "+year+" NFL Playoff Teams.");

               history.back();
            }
         }

         // Remove loading indicator.

         top.display_frame("fp_main",0);
      }

      return;
   }

   nfl_connection.onerror = function(e)
   {
      //JL alert("\"get_nfl_playoff_teams\" failed.");

      if (mode != "main")
      {
         alert("Unable to retrieve "+year+" NFL Playoff Teams.");

         history.back();
      }

      // Remove loading indicator.

      top.display_frame("fp_main",0);

      return;
   }

   nfl_connection.send(null);

   return;
}


function process_nfl_playoff_teams(nfl_playoff_teams,year)
{
   var AFC_teams                    = null;
   var index_end                    = -1;
   var index_start                  = -1;
   var NFC_teams                    = null;
   var number_of_playoff_teams      = 0;
   var number_of_rs_weeks_completed = 0;
   var possible_team_record_indexes = [17,18,36,37,38,44,45,46,47,48,49,50];
   var team_logo                    = "";
   var team_losses                  = 0;
   var team_record                  = "";
   var team_record_index            = null;
   var team_ties                    = 0;
   var team_wins                    = 0;
   var tooltip                      = "";
   var tooltip_index_high           = 100;
   var tooltip_index_low            = 0;
   var total_team_record_games      = 0;


   // Special handling of playoff years that are inaccurate on the ESPN website.

   if ( (year >= 1997) && (year <= 2002) )
   {
      var _1997_AFC_team_names   = ["Kansas City Chiefs","Pittsburgh Steelers","New England Patriots","Denver Broncos","Jacksonville Jaguars","Miami Dolphins"];
      var _1997_AFC_team_records = ["13-3",              "11-5",               "10-6",                "12-4",          "11-5",                "9-7"           ];
      var _1997_NFC_team_names   = ["San Francisco 49ers","Green Bay Packers","New York Giants","Tampa Bay Buccaneers","Detroit Lions","Minnesota Vikings"];
      var _1997_NFC_team_records = ["13-3",               "13-3",             "10-5-1",         "10-6",                "9-7",          "9-7"              ];

      var _1998_AFC_team_names   = ["Denver Broncos","New York Jets","Jacksonville Jaguars","Miami Dolphins","Buffalo Bills","New England Patriots"];      
      var _1998_AFC_team_records = ["14-2",          "12-4",         "11-5",                "10-6",          "10-6",         "9-7"                 ];
      var _1998_NFC_team_names   = ["Minnesota Vikings","Atlanta Falcons","Dallas Cowboys","San Francisco 49ers","Green Bay Packers","Arizona Cardinals"];
      var _1998_NFC_team_records = ["15-1",             "14-2",           "10-6",          "12-4",               "11-5",             "9-7"              ];

      var _1999_AFC_team_names   = ["Jacksonville Jaguars","Indianapolis Colts","Seattle Seahawks","Tennessee Titans","Buffalo Bills","Miami Dolphins"];
      var _1999_AFC_team_records = ["14-2",                "13-3",              "9-7",             "13-3",            "11-5",         "9-7"           ];
      var _1999_NFC_team_names   = ["St. Louis Rams","Tampa Bay Buccaneers","Washington Redskins","Minnesota Vikings","Dallas Cowboys","Detroit Lions"];
      var _1999_NFC_team_records = ["13-3",          "11-5",                "10-6",               "10-6",             "8-8",           "8-8"          ];

      var _2000_AFC_team_names   = ["Tennessee Titans","Oakland Raiders","Miami Dolphins","Baltimore Ravens","Denver Broncos","Indianapolis Colts"];
      var _2000_AFC_team_records = ["13-3",            "12-4",           "11-5",          "12-4",            "11-5",          "10-6"              ];
      var _2000_NFC_team_names   = ["New York Giants","Minnesota Vikings","New Orleans Saints","Philadelphia Eagles","Tampa Bay Buccaneers","St. Louis Rams"];
      var _2000_NFC_team_records = ["12-4",           "11-5",             "10-6",              "11-5",               "10-6",                "10-6"          ];

      var _2001_AFC_team_names   = ["Pittsburgh Steelers","New England Patriots","Oakland Raiders","Miami Dolphins","Baltimore Ravens","New York Jets"];
      var _2001_AFC_team_records = ["13-3",               "11-5",                "10-6",           "11-5",          "10-6",            "10-6"         ];
      var _2001_NFC_team_names   = ["St. Louis Rams","Chicago Bears","Philadelphia Eagles","Green Bay Packers","San Francisco 49ers","Tampa Bay Buccaneers"];
      var _2001_NFC_team_records = ["14-2",          "13-3",         "11-5",               "12-4",             "12-4",               "9-7"                 ];

      var AFC_team_names         = "";
      var AFC_team_records       = "";
      var NFC_team_names         = "";
      var NFC_team_records       = "";
      var short_team_name        = "";


      if (year == 1997)
      {
         AFC_team_names   = _1997_AFC_team_names;
         AFC_team_records = _1997_AFC_team_records;
         NFC_team_names   = _1997_NFC_team_names;
         NFC_team_records = _1997_NFC_team_records;
      }
      else if (year == 1998)
      {
         AFC_team_names   = _1998_AFC_team_names;
         AFC_team_records = _1998_AFC_team_records;
         NFC_team_names   = _1998_NFC_team_names;
         NFC_team_records = _1998_NFC_team_records;
      }
      else if (year == 1999)
      {
         AFC_team_names   = _1999_AFC_team_names;
         AFC_team_records = _1999_AFC_team_records;
         NFC_team_names   = _1999_NFC_team_names;
         NFC_team_records = _1999_NFC_team_records;
      }
      else if (year == 2000)
      {
         AFC_team_names   = _2000_AFC_team_names;
         AFC_team_records = _2000_AFC_team_records;
         NFC_team_names   = _2000_NFC_team_names;
         NFC_team_records = _2000_NFC_team_records;
      }
      else if (year == 2001)
      {
         AFC_team_names   = _2001_AFC_team_names;
         AFC_team_records = _2001_AFC_team_records;
         NFC_team_names   = _2001_NFC_team_names;
         NFC_team_records = _2001_NFC_team_records;
      }

      for (var i = 0; i < AFC_team_names.length; i++)
      {
         // Update AFC and NFC HTML table cells with team logos and team records.

         short_team_name = AFC_team_names[i].split(" ").pop();
         team_logo       = short_team_name+".png"
         tooltip         = AFC_team_names[i]

         if (short_team_name == "Jets")
         {
            // Randomly pick 1 of 2 Jets logos.

            if (Math.floor(Math.random()*2)+1 == 2) team_logo = short_team_name+"2.png"
         }

         document.getElementById("AFC_"+(i+1)).innerHTML = "<img src=\"team_logos/"+team_logo+"\" title=\""+tooltip+"\"><p style=\"margin-top: -3px; margin-bottom: 0px\">"+AFC_team_records[i]+"</p>";

         short_team_name = NFC_team_names[i].split(" ").pop();
         team_logo       = short_team_name+".png"
         tooltip         = NFC_team_names[i];

         if ( (short_team_name == "Giants") || (short_team_name == "Rams") )
         {
            // Randomly pick 1 of 2 Giants or 1 of 2 Rams logos.

            if (Math.floor(Math.random()*2)+1 == 2) team_logo = short_team_name+"2.png"
         }

         document.getElementById("NFC_"+(i+1)).innerHTML = "<img src=\"team_logos/"+team_logo+"\" title=\""+tooltip+"\"><p style=\"margin-top: -3px; margin-bottom: 0px\">"+NFC_team_records[i]+"</p>";
      }

      // Make AFC Playoff Teams and NFC Playoff Teams visible.

      document.getElementById("afc_playoff_teams").style.visibility="visible";
      document.getElementById("nfc_playoff_teams").style.visibility="visible";

      return true;
   }

   // Assign number of regular season weeks completed.

   if (year == top.fp_year)
   {
      number_of_rs_weeks_completed = top.current_input_week - 1;

      if (top.games_over == false) number_of_rs_weeks_completed--;

      if (number_of_rs_weeks_completed > top.all_home_teams.length) number_of_rs_weeks_completed = top.all_home_teams.length;
   }
   else
   {
      number_of_rs_weeks_completed = 18

      if (year <= 2020) number_of_rs_weeks_completed = 17;
   }

   // Assign number of playoff teams.

   number_of_playoff_teams = 7;

   if (year <= 2019) number_of_playoff_teams = 6;

   // Parse the nfl_playoff_teams string.

   index_start = nfl_playoff_teams.indexOf("\"groups\":[");
   index_end   = nfl_playoff_teams.indexOf(",\"notes\":[]}]}");

   if ( (index_start == -1) || (index_end == -1) || (index_start > index_end) )
   {
      //JL alert("Error getting NFL playoff teams from nfl_playoff_teams string.");

      return false;
   }

   nfl_playoff_teams = nfl_playoff_teams.substring(index_start,index_end);
   nfl_playoff_teams = "{" + nfl_playoff_teams + "}]}";

   // Convert the nfl_playoff_teams string to a JavaScript object.

   try
   {
      nfl_playoff_teams = JSON.parse(nfl_playoff_teams);
   }
   catch(e)
   {
      //JL alert("Error converting nfl_playoff_teams string to a JavaScript object.");

      return false;
   }

   if (nfl_playoff_teams.groups == undefined)
   {
      //JL alert("nfl_playoff_teams object (groups) is undefined.");

      return false;
   }
   else
   {
      AFC_teams = nfl_playoff_teams.groups[0];
      NFC_teams = nfl_playoff_teams.groups[1];
   }

   // Populate the src attribute of the webpage HTML img tags based on the top seven seeds from nfl_playoff_teams.

   for (var i = 0; i < number_of_playoff_teams; i++)
   {
      if ( (AFC_teams.standings == undefined) || (NFC_teams.standings == undefined) )
      {
         //JL alert("nfl_playoff_teams object (standings) is undefined.");

         return false;
      }

      if ( (AFC_teams.standings[i] == undefined) || (NFC_teams.standings[i] == undefined) )
      {
         //JL alert("nfl_playoff_teams object (standings[i]) is undefined.");

         return false;
      }

      if ( (AFC_teams.standings[i].team == undefined) || (NFC_teams.standings[i].team == undefined) )
      {
         //JL alert("nfl_playoff_teams object (team) is undefined.");

         return false;
      }

      if ( (AFC_teams.standings[i].stats == undefined) || (NFC_teams.standings[i].stats == undefined) )
      {
         //JL alert("nfl_playoff_teams object (stats) is undefined.");

         return false;
      }

      if ( (AFC_teams.standings[i].team.shortDisplayName == undefined) || (NFC_teams.standings[i].team.shortDisplayName == undefined) )
      {
         //JL alert("nfl_playoff_teams object (shortDisplayName) is undefined.");

         return false;
      }

      if (NFC_teams.standings[i].team.shortDisplayName == "Washington")
      {
         if ( (year == 2020) || (year == 2021) )
         {
            NFC_teams.standings[i].team.shortDisplayName = "Football Team";
         }
         else
         {
            NFC_teams.standings[i].team.shortDisplayName = "Redskins";
         }
      }

      if ( (validate_team_name(AFC_teams.standings[i].team.shortDisplayName) == false) || (validate_team_name(NFC_teams.standings[i].team.shortDisplayName) == false) )
      {
         //JL alert("Error validating team name");

         return false;
      }

      // Identify which stats array element contains the team record.

      for (var j = 0; j < possible_team_record_indexes.length; j++)
      {
         team_record_index = null;

         // If the stats array element contains a "-" and is less than or equal to 6 characters, then it potentially contains the team record.

         if ( (AFC_teams.standings[i].stats[possible_team_record_indexes[j]] != undefined)       &&
              (AFC_teams.standings[i].stats[possible_team_record_indexes[j]].indexOf("-") != -1) &&
              (AFC_teams.standings[i].stats[possible_team_record_indexes[j]].length <= 6)           )
         {
            team_wins   = 0;
            team_losses = 0;
            team_ties   = 0;

            team_record = AFC_teams.standings[i].stats[possible_team_record_indexes[j]];

            // Set team_wins equal to the number before the first "-" in team_record.

            team_wins = team_record.substring(0,team_record.indexOf("-"));

            // Check to see if there's a second "-" in team_record.

            team_record = team_record.substring(team_record.indexOf("-")+1);

            if (team_record.indexOf("-") != -1)
            {
               // Set team_losses equal to the number before the second "-" in team_record.

               team_losses = team_record.substring(0,team_record.indexOf("-"));

               // Set team_ties equal to the number after the second "-" in team_record.

               team_ties = team_record.substring(team_record.indexOf("-")+1);
            }
            else
            {
               // Set team_losses equal to the number after the first "-" in team_record.

               team_losses = team_record;
            }

            // If total team record games is within one of number_of_rs_weeks_completed, then save the stats array element index in team_record_index.

            if ( (isNaN(team_wins) == false) && (isNaN(team_losses) == false) && (isNaN(team_ties) == false) )
            {
               total_team_record_games = parseInt(team_wins) + parseInt(team_losses) + parseInt(team_ties);

               if ( (year == 2022) && (AFC_teams.standings[i].team.shortDisplayName == "Bills" || AFC_teams.standings[i].team.shortDisplayName == "Bengals" ) )
               {
                  if ( total_team_record_games >= number_of_rs_weeks_completed - 2)
                  {
                     team_record_index = possible_team_record_indexes[j];

                     break;
                  }
               }
               else
               {
                  if ( total_team_record_games >= number_of_rs_weeks_completed - 1)
                  {
                     team_record_index = possible_team_record_indexes[j];

                     break;
                  }
               }
            }
         }
      }

      if (team_record_index == null)
      {
         //JL alert("Unable to identify which stats array element has the team record");

         return false;
      }

      // Update AFC and NFC HTML table cells with team logos and team records using team_record_index.

      tooltip = AFC_teams.standings[i].team.displayName;

      for (var j = tooltip_index_low; j <= tooltip_index_high; j++)
      {
         if ( (AFC_teams.standings[i].stats[j] != undefined) && (AFC_teams.standings[i].stats[j].toLowerCase().includes("wins tie break") == true) )
         {
            tooltip = tooltip + ":  " + AFC_teams.standings[i].stats[j];
            break;
         }
      }

      team_logo = AFC_teams.standings[i].team.shortDisplayName+".png"

      if (AFC_teams.standings[i].team.shortDisplayName == "Jets")
      {
         // Randomly pick 1 of 2 Jets logos.

         if (Math.floor(Math.random()*2)+1 == 2) team_logo = AFC_teams.standings[i].team.shortDisplayName+"2.png"
      }

      document.getElementById("AFC_"+(i+1)).innerHTML = "<img src=\"team_logos/"+team_logo+"\" title=\""+tooltip+"\"><p style=\"margin-top: -3px; margin-bottom: 0px\">"+AFC_teams.standings[i].stats[team_record_index]+"</p>";

      if (NFC_teams.standings[i].team.displayName == "Washington")
      {
         if ( (year == 2020) || (year == 2021) )
         {
            NFC_teams.standings[i].team.displayName = "Washington Football Team";
         }
         else
         {
            NFC_teams.standings[i].team.displayName = "Washington Redskins";
         }
      }

      tooltip = NFC_teams.standings[i].team.displayName;

      for (var j = tooltip_index_low; j <= tooltip_index_high; j++)
      {
         if ( (NFC_teams.standings[i].stats[j] != undefined) && (NFC_teams.standings[i].stats[j].toLowerCase().includes("wins tie break") == true) )
         {
            tooltip = tooltip + ":  " + NFC_teams.standings[i].stats[j];
            break;
         }
      }

      team_logo = NFC_teams.standings[i].team.shortDisplayName+".png"

      if ( (NFC_teams.standings[i].team.shortDisplayName == "Giants") || (NFC_teams.standings[i].team.shortDisplayName == "Rams") )
      {
         // Randomly pick 1 of 2 Giants or 1 of 2 Rams logos.

         if (Math.floor(Math.random()*2)+1 == 2) team_logo = NFC_teams.standings[i].team.shortDisplayName+"2.png"
      }

      document.getElementById("NFC_"+(i+1)).innerHTML = "<img src=\"team_logos/"+team_logo+"\" title=\""+tooltip+"\"><p style=\"margin-top: -3px; margin-bottom: 0px\">"+NFC_teams.standings[i].stats[team_record_index]+"</p>";
   }

   // Make AFC Playoff Teams and NFC Playoff Teams visible.

   document.getElementById("afc_playoff_teams").style.visibility="visible";
   document.getElementById("nfc_playoff_teams").style.visibility="visible";

   return true;
}


function validate_team_name(team_name)
{
   var team_names = ["49ers","Bears","Bengals","Bills","Broncos","Browns","Buccaneers","Cardinals","Chargers",
                     "Chiefs","Colts","Commanders","Cowboys","Dolphins","Eagles","Falcons","Football Team",
                     "Giants","Jaguars","Jets","Lions","Packers","Panthers","Patriots","Raiders","Rams",
                     "Ravens","Redskins","Saints","Seahawks","Steelers","Texans","Titans","Vikings"];


   for (var i = 0; i < team_names.length; i++)
   {
      if (team_name == team_names[i]) return true;
   }

   return false;
}
