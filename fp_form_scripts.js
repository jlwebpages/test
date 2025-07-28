
function adjust_mobile_viewport_height(document,form)
{
   var iPad = false;


   if ( (navigator.platform.toLowerCase().indexOf("ipad") != -1) || ((navigator.platform.toLowerCase().indexOf("macintel") != -1) && (navigator.maxTouchPoints > 1)) )
   {
      iPad = true;
   }

   if ( (top.gv.mobile == true) && (iPad == false) )
   {
      if ( (window.screen.height > window.screen.width) && (top.document.getElementById("viewport") != null) )
      {
         var pad = 10;

         var document_height = document.body.scrollHeight + pad;

         if ( (form == "postseason") && (document_height < 600) ) document_height = 600;

         var viewport_scale   = window.screen.height/document_height;
         var viewport_content = "height=" + document_height + "px, initial-scale=" + viewport_scale;

         top.document.getElementById("viewport").setAttribute("content",viewport_content);
      }
   }

   return;
}


function build_postseason_form()
{
   if (check_for_opener() == false)
   {
      window.top.close();

      return false;
   }

   var bullet_color                  = "";
   var color_black                   = "black";
   var color_red                     = "red";
   var current_picks_week            = false;
   var document_heading              = "";
   var home_team_possession_flag     = "";
   var input_field_size              = 1;
   var input_tag_class               = "";
   var mode                          = window.top.gv.mode;
   var mode_string                   = "";
   var number_of_rs_weeks            = window.top.gv.number_of_rs_weeks;
   var victors                       = "";
   var visiting_team_possession_flag = "";
   var week                          = window.top.gv.current_input_week - number_of_rs_weeks;

   var decimal_count      = window.top.gv.decimal_count;
   var number_of_ps_games = window.top.gv.number_of_ps_games;
   var w1_start           = window.top.gv.w1_start;
   var w1_end             = window.top.gv.w1_end;
   var w2_start           = window.top.gv.w2_start;
   var w2_end             = window.top.gv.w2_end;
   var w3_start           = window.top.gv.w3_start;
   var w3_end             = window.top.gv.w3_end;
   var w4_start           = window.top.gv.w4_start;
   var w4_end             = window.top.gv.w4_end;

   if (mode == "picks")
   {
      mode_string                 = "Picks";
      postseason_possession_teams = window.top.gv.postseason_possession_teams;
      postseason_red_zone_flags   = window.top.gv.postseason_red_zone_flags;
      victors                     = window.top.gv.postseason_victors;
      week                        = week - 1;
   }
   else if (mode == "results")
   {
      mode_string = "Results";
      week        = week - 2;

      if (window.top.gv.games_over == true) week = week + 1;
   }
   else if (mode == "results_archive")
   {
      mode_string = "Results";
      week        = 4;
   }

   if (week < 1) week = 1;
   if (week > 4) week = 4;

   if (postseason_winners.length == 11)
   {
      decimal_count      = 0;
      number_of_ps_games = 11;
      w1_start           = 1;
      w1_end             = 4;
      w2_start           = 5;
      w2_end             = 8;
      w3_start           = 9;
      w3_end             = 10;
      w4_start           = 11;
      w4_end             = 11;
   }
 
   // Force this week's visitor and home scores to be zero if the mode is picks.

   for (var gi = 1; gi <= number_of_ps_games; gi++)
   {
      if ( ( (week == 1) && (mode == "picks") && (gi >= w1_start && gi <= w1_end) ) ||
           ( (week == 2) && (mode == "picks") && (gi >= w2_start && gi <= w2_end) ) ||
           ( (week == 3) && (mode == "picks") && (gi >= w3_start && gi <= w3_end) ) ||
           ( (week == 4) && (mode == "picks") && (gi >= w4_start && gi <= w4_end) )    )
      {
         excel_visitor_scores[gi-1] = "";
         excel_home_scores[gi-1]    = "";
      }
   }

   // Initialize the visitor and home scores global arrays from the excel data.

   if (window.top.gv.scores_already_assigned == false)
   {
      window.top.gv.home_scores             = excel_home_scores;
      window.top.gv.visitor_scores          = excel_visitor_scores;
      window.top.gv.scores_already_assigned = true;
   }

   // Now define a host of variables and arrays needed to build the form.

   var number_of_ps_players       = window.top.gv.ps_players.length;

   var adjusted_score             = 0;
   var background_color_class     = "";
   var best_player_win_count      = 0;
   var best_total_points_count    = 0;
   var best_total_points_score    = null_score;
   var border_style               = "no_border";
   var current_week_scores        = 0;
   var form_view                  = window.top.gv.form_view;
   var game_state                 = "at";
   var heading_colspan            = 53;
   var high_score_count           = 0;
   var high_score_players         = Array(number_of_ps_players).fill(null);
   var home_scores                = window.top.gv.home_scores;
   var null_score                 = 9999;
   var number_of_games_to_display = 0;
   var order_by                   = window.top.gv.order_by;
   var overall_ranks              = Array(number_of_ps_players).fill(1);
   var overall_scores             = Array(number_of_ps_players).fill(null_score);
   var percent_wins               = "";
   var player_colspan             = 4;
   var player_index               = Array(number_of_ps_players).fill().map((_,i) => i);  // Sets player_index = [0,1,2,3,4,5,6,7,8,9,10,11]
   var player_pick_valid          = true;
   var player_win_count           = Array(number_of_ps_players).fill(0);
   var points                     = "";
   var possible_win_count         = 0;
   var ps_players                 = window.top.gv.ps_players;
   var sorted_overall_scores      = Array(number_of_ps_players).fill(null_score);
   var sorted_week_1_scores       = Array(number_of_ps_players).fill(null_score);
   var sorted_week_2_scores       = Array(number_of_ps_players).fill(null_score);
   var sorted_week_3_scores       = Array(number_of_ps_players).fill(null_score);
   var sorted_week_4_scores       = Array(number_of_ps_players).fill(null_score);
   var total_points               = "";
   var total_points_game_index    = -1;
   var total_points_label         = "";
   var total_points_score         = "<br>";
   var total_points_scores        = Array(number_of_ps_players).fill(null_score);
   var use_player_points          = true;
   var visitor_scores             = window.top.gv.visitor_scores;
   var week_1_high_score_count    = 0;
   var week_1_high_score_players  = Array(number_of_ps_players).fill(null);
   var week_1_ranks               = Array(number_of_ps_players).fill(1);
   var week_1_scores              = Array(number_of_ps_players).fill(null_score);
   var week_1_valid_game_cnt      = 4;
   var week_2_high_score_count    = 0;
   var week_2_high_score_players  = Array(number_of_ps_players).fill(null);
   var week_2_ranks               = Array(number_of_ps_players).fill(1);
   var week_2_scores              = Array(number_of_ps_players).fill(null_score);
   var week_2_valid_game_cnt      = 4;
   var week_3_high_score_count    = 0;
   var week_3_high_score_players  = Array(number_of_ps_players).fill(null);
   var week_3_ranks               = Array(number_of_ps_players).fill(1);
   var week_3_scores              = Array(number_of_ps_players).fill(null_score);
   var week_3_valid_game_cnt      = 2;
   var week_4_high_score_count    = 0;
   var week_4_high_score_players  = Array(number_of_ps_players).fill(null);
   var week_4_ranks               = Array(number_of_ps_players).fill(1);
   var week_4_scores              = Array(number_of_ps_players).fill(null_score);
   var week_4_valid_game_cnt      = 1;

   // Set the number of games to display on the form.

   if (week == 1) number_of_games_to_display = w1_end;
   if (week == 2) number_of_games_to_display = w2_end;
   if (week == 3) number_of_games_to_display = w3_end;
   if (week == 4) number_of_games_to_display = w4_end;

   // Only use player points as a tie breaker if the player_points array exists.

   if (typeof player_points == "undefined") use_player_points = false;

   // Set column spans for expanded or compact view.

   if (form_view == "expanded")
   {
      player_colspan  = 4;
   }
   else
   {
      player_colspan  = 1;
   }

   heading_colspan = (number_of_ps_players * player_colspan) + 5;

   // Build document heading.

   if (mode == "picks")
   {
      document_heading = "Postseason - Week " + week + " Picks";
   }
   else if (mode == "results")
   {
      document_heading = "Postseason - Week " + week + " Results";
   }
   else if (mode == "results_archive")
   {
      document_heading = window.top.gv.archive_year + " Postseason Results";
   }

   // Calculate the postseason winners and margins of victory.

   for (var gi = 1; gi <= number_of_ps_games; gi++)
   {
      // Force visiting team names, home team names, player picks,
      // players spreads, and player points to be blank for future weeks.

      if ( ( (week ==  1) && (gi > w1_end) ) ||
           ( (week ==  2) && (gi > w2_end) ) ||
           ( (week ==  3) && (gi > w3_end) ) ||
           ( (week ==  4) && (gi > w4_end) )    )
      {
         visiting_teams[gi-1] = "";
         home_teams[gi-1]     = "";

         for (var pi = 1; pi <= number_of_ps_players; pi++)
         {
            player_picks[pi-1][gi-1]   = "";
            player_spreads[pi-1][gi-1] = "";

            if (use_player_points == true) player_points[pi-1][gi-1]  = "";
         }
      }

      // Force all postseason game attributes to be blank if at least one attribute is invalid.
        
      if ( (isNaN(visitor_scores[gi-1]) == true) ||
           (isNaN(home_scores[gi-1])    == true) ||
           (visiting_teams[gi-1]        ==   "") ||
           (home_teams[gi-1]            ==   "")    )
      {
         visitor_scores[gi-1] = "<br>";
         home_scores[gi-1]    = "<br>";
         visiting_teams[gi-1] = "<br>";
         home_teams[gi-1]     = "<br>";

         if ( (gi >= w1_start) && (gi <= w1_end) ) week_1_valid_game_cnt--;
         if ( (gi >= w2_start) && (gi <= w2_end) ) week_2_valid_game_cnt--;
         if ( (gi >= w3_start) && (gi <= w3_end) ) week_3_valid_game_cnt--;
         if ( (gi >= w4_start) && (gi <= w4_end) ) week_4_valid_game_cnt--;
      }
      else
      {
         // All postseason game attributes are valid, so make sure visitor and home scores are integers.

         visitor_scores[gi-1] = visitor_scores[gi-1] - 0;
         home_scores[gi-1]    = home_scores[gi-1]    - 0;
      }

      // Calculate the postseason game winner (V or H).

      postseason_winners[gi-1] = "";

      if (visitor_scores[gi-1] > home_scores[gi-1])
      {
         postseason_winners[gi-1] = "V";
      }
      else if (home_scores[gi-1] > visitor_scores[gi-1])
      {
         postseason_winners[gi-1] = "H";
      }

      // Calculate the postseason game spread (margin of victory).

      winner_spreads[gi-1] = Math.abs(visitor_scores[gi-1]-home_scores[gi-1]);

      if (winner_spreads[gi-1] == 0)           winner_spreads[gi-1] = "";
      if (isNaN(winner_spreads[gi-1]) == true) winner_spreads[gi-1] = "";
   }

   // Calculate the player scores.

   for (var pi = 1; pi <= number_of_ps_players; pi++)
   {
      current_week_scores  = 0;
      overall_scores[pi-1] = 0;
      possible_win_count   = 0;
      week_1_scores[pi-1]  = 0;
      week_2_scores[pi-1]  = 0;
      week_3_scores[pi-1]  = 0;
      week_4_scores[pi-1]  = 0;

      for (var gi = 1; gi <= number_of_ps_games; gi++)
      {
         // Check to see if the player pick (H or V), player spread (margin of victory),
         // and player points (total points prediction for final game of the week) are valid.

         player_pick_valid = true;

         if ( (player_picks[pi-1][gi-1] != "V") && (player_picks[pi-1][gi-1] != "H") )
         {
            player_picks[pi-1][gi-1]   = "<br>";
            player_spreads[pi-1][gi-1] = "<br>";

            if (use_player_points == true) player_points[pi-1][gi-1]  = "<br>";

            player_scores[pi-1][gi-1]  = "<br>";
            player_pick_valid          = false;
            current_week_scores        = null_score;
         }

         if ( (player_spreads[pi-1][gi-1] == "") || (isNaN(player_spreads[pi-1][gi-1]) == true) )
         {
            player_picks[pi-1][gi-1]   = "<br>";
            player_spreads[pi-1][gi-1] = "<br>";

            if (use_player_points == true) player_points[pi-1][gi-1]  = "<br>";

            player_scores[pi-1][gi-1]  = "<br>";
            player_pick_valid          = false;
            current_week_scores        = null_score;
         }
         else
         {
            // Player pick and spread are valid, so make sure the player spread and the player points are integers.

            player_spreads[pi-1][gi-1] = player_spreads[pi-1][gi-1] - 0;

            if (use_player_points == true) player_points[pi-1][gi-1] = player_points[pi-1][gi-1] - 0;
         }

         // Check to see if there is a winner for this postseason game and if the player pick is valid.

         if ( (postseason_winners[gi-1] == "V") || (postseason_winners[gi-1] == "H") )
         {
            possible_win_count += 1;

            if (player_pick_valid == true)
            {
               // Calculate the player score for this postseason game.

               if (player_picks[pi-1][gi-1] == postseason_winners[gi-1])
               {
                  player_scores[pi-1][gi-1] = Math.abs(player_spreads[pi-1][gi-1]-winner_spreads[gi-1]);
                  player_win_count[pi-1]   += 1;
               }
               else
               {
                  player_scores[pi-1][gi-1] = Math.abs(player_spreads[pi-1][gi-1]+winner_spreads[gi-1]) + wrong_pick_penalty;
               }

               // Only add the player score for this postseason game if the player
               // score for the previous postseason games in the same week are valid.

               if (current_week_scores != null_score)
               {
                  current_week_scores = current_week_scores + player_scores[pi-1][gi-1];
               }
            }
            else
            {
               // Since one player score for this postseason week is invalid,
               // then the combined score for the postseason week is also invalid.

               current_week_scores = null_score;
            }
         }
         else
         {
            // There is no winner for the postseason game, so set the player score to blank.

            player_scores[pi-1][gi-1] = "<br>";
         }

         // If a player's combined score for a postseason week is valid, then multiply it
         // by the postseason week multiplier and add it to the player's overall score.

         if (gi == w1_end)
         {
            week_1_scores[pi-1] = current_week_scores;

            if (week_1_scores[pi-1] != null_score) 
            {
               adjusted_score = (week_1_scores[pi-1] * week_1_score_multiplier) - week_1_scores[pi-1];
               week_1_scores[pi-1]  = week_1_scores[pi-1] + adjusted_score;
               overall_scores[pi-1] = overall_scores[pi-1] + week_1_scores[pi-1];
            }

            // Reset the current week scores for the next week.

            current_week_scores = 0;
         }

         if (gi == w2_end)
         {
            week_2_scores[pi-1] = current_week_scores;

            if (week_2_scores[pi-1] != null_score) 
            {
               adjusted_score = (week_2_scores[pi-1] * week_2_score_multiplier) - week_2_scores[pi-1];
               week_2_scores[pi-1]  = week_2_scores[pi-1] + adjusted_score;
               overall_scores[pi-1] = overall_scores[pi-1] + week_2_scores[pi-1];
            }

            // Reset the current week scores for the next week.

            current_week_scores = 0;
         }

         if (gi == w3_end)
         {
            week_3_scores[pi-1] = current_week_scores;

            if (week_3_scores[pi-1] != null_score) 
            {
               adjusted_score = (week_3_scores[pi-1] * week_3_score_multiplier) - week_3_scores[pi-1];
               week_3_scores[pi-1]  = week_3_scores[pi-1] + adjusted_score;
               overall_scores[pi-1] = overall_scores[pi-1] + week_3_scores[pi-1];
            }

            // Reset the current week scores for the next week.

            current_week_scores = 0;
         }

         if (gi == w4_end)
         {
            week_4_scores[pi-1] = current_week_scores;

            if (week_4_scores[pi-1] != null_score) 
            {
               adjusted_score = (week_4_scores[pi-1] * week_4_score_multiplier) - week_4_scores[pi-1];
               week_4_scores[pi-1]  = week_4_scores[pi-1] + adjusted_score;
               overall_scores[pi-1] = overall_scores[pi-1] + week_4_scores[pi-1];
            }

            // Reset the current week scores for the next week.

            current_week_scores = 0;
         }
      }

      // If a player's score for a postseason week is invalid and there is at least one
      // postseason game winner for that week, then the player's overall is set to invalid.

      if ( (week_1_scores[pi-1] == null_score) && (week_1_valid_game_cnt > 0) )
      {
         overall_scores[pi-1] = null_score;
      }

      if ( (week_2_scores[pi-1] == null_score) && (week_2_valid_game_cnt > 0) )
      {
         overall_scores[pi-1] = null_score;
      }

      if ( (week_3_scores[pi-1] == null_score) && (week_3_valid_game_cnt > 0) )
      {
         overall_scores[pi-1] = null_score;
      }

      if ( (week_4_scores[pi-1] == null_score) && (week_4_valid_game_cnt > 0) )
      {
         overall_scores[pi-1] = null_score;
      }
   }

   // Sort scores and determine best player win count.

   best_player_win_count = 0;

   for (var pi = 1; pi <= number_of_ps_players; pi++)
   {
      sorted_overall_scores[pi-1] = overall_scores[pi-1];
      sorted_week_1_scores[pi-1]  = week_1_scores[pi-1];
      sorted_week_2_scores[pi-1]  = week_2_scores[pi-1];
      sorted_week_3_scores[pi-1]  = week_3_scores[pi-1];
      sorted_week_4_scores[pi-1]  = week_4_scores[pi-1];

      if (player_win_count[pi-1] > best_player_win_count) best_player_win_count = player_win_count[pi-1];
   }

   sorted_overall_scores.sort(function(sorted_overall_scores,b){return sorted_overall_scores-b;});
   sorted_week_1_scores.sort(function(sorted_week_1_scores,b){return sorted_week_1_scores-b;});
   sorted_week_2_scores.sort(function(sorted_week_2_scores,b){return sorted_week_2_scores-b;});
   sorted_week_3_scores.sort(function(sorted_week_3_scores,b){return sorted_week_3_scores-b;});
   sorted_week_4_scores.sort(function(sorted_week_4_scores,b){return sorted_week_4_scores-b;});

   // Determine the player rankings.

   for (var pi = 1; pi <= number_of_ps_players; pi++)
   {
      // Determine the player rankings for week 1.

      for (var pii = 1; pii <= number_of_ps_players; pii++)
      {
         if (week_1_scores[pi-1] == sorted_week_1_scores[pii-1])
         {
            week_1_ranks[pi-1] = pii;

            if (pii == 1)
            {
               // If the current player has a high score, save the current
               // player's index and increment the high score count.

               week_1_high_score_players[week_1_high_score_count] = pi-1;
               week_1_high_score_count++;
            }
            break;
         }
      }

      // Determine the player rankings for week 2.

      for (var pii = 1; pii <= number_of_ps_players; pii++)
      {
         if (week_2_scores[pi-1] == sorted_week_2_scores[pii-1])
         {
            week_2_ranks[pi-1] = pii;

            if (pii == 1)
            {
               // If the current player has a high score, save the current
               // player's index and increment the high score count.

               week_2_high_score_players[week_2_high_score_count] = pi-1;
               week_2_high_score_count++;
            }
            break;
         }
      }

      // Determine the player rankings for week 3.

      for (var pii = 1; pii <= number_of_ps_players; pii++)
      {
         if (week_3_scores[pi-1] == sorted_week_3_scores[pii-1])
         {
            week_3_ranks[pi-1] = pii;

            if (pii == 1)
            {
               // If the current player has a high score, save the current
               // player's index and increment the high score count.

               week_3_high_score_players[week_3_high_score_count] = pi-1;
               week_3_high_score_count++;
            }
            break;
         }
      }

      // Determine the player rankings for week 4.

      for (var pii = 1; pii <= number_of_ps_players; pii++)
      {
         if (week_4_scores[pi-1] == sorted_week_4_scores[pii-1])
         {
            week_4_ranks[pi-1] = pii;

            if (pii == 1)
            {
               // If the current player has a high score, save the current
               // player's index and increment the high score count.

               week_4_high_score_players[week_4_high_score_count] = pi-1;
               week_4_high_score_count++;
            }
            break;
         }
      }

      // Determine the player rankings based on the overall scores.

      for (var pii = 1; pii <= number_of_ps_players; pii++)
      {
         if (overall_scores[pi-1] == sorted_overall_scores[pii-1])
         {
            overall_ranks[pi-1] = pii;
            break;
         }
      }
   }

   // If this is a footall pool year that has the postseason tie breaker in place,
   // then use the total points predictions to break any ties that my exist.

   if (use_player_points == true)
   {
      for (var postseason_week = 1; postseason_week <= 4; postseason_week++)
      {
         if (postseason_week == 1)
         {
            high_score_count        = week_1_high_score_count;
            high_score_players      = week_1_high_score_players;
            total_points_game_index = w1_end-1;
         }

         if (postseason_week == 2)
         {
            high_score_count        = week_2_high_score_count;
            high_score_players      = week_2_high_score_players;
            total_points_game_index = w2_end-1;
         }

         if (postseason_week == 3)
         {
            high_score_count        = week_3_high_score_count;
            high_score_players      = week_3_high_score_players;
            total_points_game_index = w3_end-1;
         }

         if (postseason_week == 4)
         {
            high_score_count        = week_4_high_score_count;
            high_score_players      = week_4_high_score_players;
            total_points_game_index = w4_end-1;
         }

         // Calcuate the total points of the last game played in this week.

         total_points = visitor_scores[total_points_game_index] + home_scores[total_points_game_index];

         // If visitor and home team scores for the last game of this week are different, and if
         // more than one player has the high score for this week, then we need to break the tie.

         if ( (visitor_scores[total_points_game_index] != home_scores[total_points_game_index]) && (high_score_count > 1) )
         {
            // Calculate the total points score for each player that has a high score this week.

            for (var index = 1; index <= high_score_count; index++)
            {
               // If the current player that has a high score didn't submit a total points prediction, then
               // assign the player a null_score which will effectively eliminate the player from being ranked 1.

               if (player_points[high_score_players[index-1]][total_points_game_index] == 0)
               {
                  player_points[high_score_players[index-1]][total_points_game_index] = null_score;
               }

               // Calculate the difference between the actual total points and the current players predicted total points.

               total_points_scores[high_score_players[index-1]] = total_points - player_points[high_score_players[index-1]][total_points_game_index];

               // If the total points score is negative, this means the current player's total points prediction
               // exceeded the actual total points.  In this case, penalize the player by a tenth of a point in
               // case another player has the same total points score but did not exceed the actual total points.

               if (total_points_scores[high_score_players[index-1]] < 0 )
               {
                  total_points_scores[high_score_players[index-1]] = total_points_scores[high_score_players[index-1]] - .1;
               }

               // Calculate the absolute value of the total points score.

               total_points_scores[high_score_players[index-1]] = Math.abs(total_points_scores[high_score_players[index-1]]);
            }

            // Determine the best total points score.  Those players that don't have the
            // high score for this week have been assigned a total point score of null_score.

            best_total_points_score = null_score;

            for (var pi = 1; pi <= number_of_ps_players; pi++)
            {
               if (total_points_scores[pi-1] < best_total_points_score)
               {
                  best_total_points_score = total_points_scores[pi-1];
               }
            }

            // Adjust the rank of each player that has a high score for this week but not the best total points score.

            best_total_points_count = 0;

            for (var pi = 1; pi <= number_of_ps_players; pi++)
            {
               if (total_points_scores[pi-1] == best_total_points_score) best_total_points_count++;
            }

            for (var pi = 1; pi <= number_of_ps_players; pi++)
            {
               if (postseason_week == 1)
               {
                  if ( (week_1_ranks[pi-1] == 1) && (total_points_scores[pi-1] != best_total_points_score) )
                  {
                     week_1_ranks[pi-1] = 1 + best_total_points_count;
                  }
               }

               if (postseason_week == 2)
               {
                  if ( (week_2_ranks[pi-1] == 1) && (total_points_scores[pi-1] != best_total_points_score) )
                  {
                     week_2_ranks[pi-1] = 1 + best_total_points_count;
                  }
               }

               if (postseason_week == 3)
               {
                  if ( (week_3_ranks[pi-1] == 1) && (total_points_scores[pi-1] != best_total_points_score) )
                  {
                     week_3_ranks[pi-1] = 1 + best_total_points_count;
                  }
               }

               if (postseason_week == 4)
               {
                  if ( (week_4_ranks[pi-1] == 1) && (total_points_scores[pi-1] != best_total_points_score) )
                  {
                     week_4_ranks[pi-1] = 1 + best_total_points_count;
                  }
               }

               // If the current player was assigned a null_score because the total points prediction was not
               // submitted, then undo the null_score assignment in order to suppress the player points display.

               if (player_points[pi-1][total_points_game_index] == null_score)
               {
                  player_points[pi-1][total_points_game_index] = "<br>";
               }
            }
         }

         // Re-initialize total_points_scores for the next for loop iteration.

         total_points_scores.fill(null_score);
      }
   }

   // Calculate player index for order by players or scores

   for (var pi = 1; pi <= number_of_ps_players; pi++)
   {
      if (order_by == "players")
      {
         player_index[pi-1] = pi-1;
      }
      else
      {
         var order_by_ranks = overall_ranks;

         if (order_by ==  "week_1_scores") order_by_ranks = week_1_ranks;
         if (order_by ==  "week_2_scores") order_by_ranks = week_2_ranks;
         if (order_by ==  "week_3_scores") order_by_ranks = week_3_ranks;
         if (order_by ==  "week_4_scores") order_by_ranks = week_4_ranks;
         if (order_by == "overall_scores") order_by_ranks = overall_ranks;
         
         duplicates = 0;

         for (var pii = 1; pii <= number_of_ps_players; pii++)
         {
            if (pi == order_by_ranks[pii-1])
            {
               player_index[(pi+duplicates)-1] = pii-1;

               duplicates++;
            }
         }

         pi = pi + duplicates - 1;
      }
   }

   document.open();

   var d = document;

   d.writeln('<html>');
   d.writeln('');

   d.writeln('<head>');
   d.writeln('   <title>NFL Football Pool</title>');
   d.writeln('   <style type="text/css">');
   d.writeln('   <!--');
   d.writeln('      TD              {border-style:        solid;');
   d.writeln('                       border-color:    lightgray;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    0px;');
   d.writeln('                       border-bottom-width:   0px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .b3_border      {border: 3px solid    black}');
   d.writeln('      .bb1_border     {border-style:        solid;');
   d.writeln('                       border-color:        black;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    0px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .bb2_border     {border-style:        solid;');
   d.writeln('                       border-color:        black;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    0px;');
   d.writeln('                       border-bottom-width:   2px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .br2_border     {border-style:        solid;');
   d.writeln('                       border-color:        black;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    2px;');
   d.writeln('                       border-bottom-width:   0px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .br2_bb1_border {border-style:        solid;');
   d.writeln('                       border-color: white black black white;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    2px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .br2_bb2_border {border-style:        solid;');
   d.writeln('                       border-color: white black black white;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    2px;');
   d.writeln('                       border-bottom-width:   2px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .br2_gb1_border {border-style:        solid;');
   d.writeln('                       border-color: white black lightgray white;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    2px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .gb1_border     {border-style:        solid;');
   d.writeln('                       border-color:    lightgray;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    0px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .gr1_border     {border-style:        solid;');
   d.writeln('                       border-color:    lightgray;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    1px;');
   d.writeln('                       border-bottom-width:   0px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .gr1_bb1_border {border-style:        solid;');
   d.writeln('                       border-color: white lightgray black white;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    1px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .gr1_bb2_border {border-style:        solid;');
   d.writeln('                       border-color: white lightgray black white;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    1px;');
   d.writeln('                       border-bottom-width:   2px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .gr1_gb1_border {border-style:        solid;');
   d.writeln('                       border-color: white lightgray lightgray white;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    1px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .no_border      {border-style:        solid;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    0px;');
   d.writeln('                       border-bottom-width:   0px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('   -->');
   d.writeln('   </style>');
   d.writeln('</head>');
   d.writeln('');

   d.writeln('<body>');
   d.writeln('');
   d.writeln('');

   d.writeln('<script language="JavaScript">');
   d.writeln('');

   d.writeln('function calculate_postseason_scores(document)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   clear_get_scores_data();');
   d.writeln('');
   d.writeln('   var error_message  = "Invalid input.\\n\\nEnter a number between 0 and 99 for the ";');
   d.writeln('   var select_element = "";');
   d.writeln('   var input_score    = 0;');
   d.writeln('   var scores         = document.fp_scores;');
   d.writeln('   var team           = "";');
   d.writeln('');
   d.writeln('');
   d.writeln('   for (var ei = 0; ei < scores.elements.length; ei++)');
   d.writeln('   {');
   d.writeln('      for (var gi = 1; gi <= '+number_of_ps_games+'; gi++)');
   d.writeln('      {');
   d.writeln('         if (scores.elements[ei].name == "visitor"+gi+"_score")');
   d.writeln('         {');
   d.writeln('            input_score = scores.elements[ei].value;');
   d.writeln('');
   d.writeln('            if (isNaN(input_score) == true)');
   d.writeln('            {');
   d.writeln('               if (team == "")');
   d.writeln('               {');
   d.writeln('                  select_element = scores.elements[ei];');
   d.writeln('                  team           = visiting_teams[gi-1];');
   d.writeln('               }');
   d.writeln('            }');
   d.writeln('            else');
   d.writeln('            {');
   d.writeln('               input_score = input_score - 0;');
   d.writeln('');
   d.writeln('               if ( (input_score < 0) || (input_score > 99) )');
   d.writeln('               {');
   d.writeln('                  if (team == "")');
   d.writeln('                  {');
   d.writeln('                     select_element = scores.elements[ei];');
   d.writeln('                     team           = visiting_teams[gi-1];');
   d.writeln('                  }');
   d.writeln('               }');
   d.writeln('               else');
   d.writeln('               {');
   d.writeln('                  window.top.gv.visitor_scores[gi-1] = input_score;');
   d.writeln('               }');
   d.writeln('            }');
   d.writeln('         }');
   d.writeln('');
   d.writeln('         if (scores.elements[ei].name == "home"+gi+"_score")');
   d.writeln('         {');
   d.writeln('            input_score = scores.elements[ei].value;');
   d.writeln('');
   d.writeln('            if (isNaN(input_score) == true)');
   d.writeln('            {');
   d.writeln('               if (team == "")');
   d.writeln('               {');
   d.writeln('                  select_element = scores.elements[ei];');
   d.writeln('                  team           = home_teams[gi-1];');
   d.writeln('               }');
   d.writeln('            }');
   d.writeln('            else');
   d.writeln('            {');
   d.writeln('               input_score = input_score - 0;');
   d.writeln('');
   d.writeln('               if ( (input_score < 0) || (input_score > 99) )');
   d.writeln('               {');
   d.writeln('                  if (team == "")');
   d.writeln('                  {');
   d.writeln('                     select_element = scores.elements[ei];');
   d.writeln('                     team           = home_teams[gi-1];');
   d.writeln('                  }');
   d.writeln('               }');
   d.writeln('               else');
   d.writeln('               {');
   d.writeln('                  window.top.gv.home_scores[gi-1] = input_score;');
   d.writeln('               }');
   d.writeln('            }');
   d.writeln('         }');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (team != "")');
   d.writeln('   {');
   d.writeln('      alert(error_message+team+" score.");');
   d.writeln('      select_element.select();');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   document.location.href = "fp_postseason_form.html";');
   d.writeln('');
   d.writeln('   return true;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function change_order(document)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   var order_by_menu = document.fp_scores.order_by_menu;');
   d.writeln('   var menu_index    = order_by_menu.selectedIndex;');
   d.writeln('');
   d.writeln('');
   d.writeln('   window.top.gv.order_by = order_by_menu.options[menu_index].value;');
   d.writeln('');
   d.writeln('   if (window.top.gv.mode == "results_archive")');
   d.writeln('   {');
   d.writeln('      document.location.href = "fp_forms_"+window.top.gv.archive_year+".html";');
   d.writeln('   }');
   d.writeln('   else');
   d.writeln('   {');
   d.writeln('      var refresh_scores = window.top.gv.refresh_scores;'); // Need to save refresh_scores because "clear_get_scores_data" will reset it.
   d.writeln('');
   d.writeln('      clear_get_scores_data();');
   d.writeln('');
   d.writeln('      if (window.top.gv.get_scores_state == "on" && refresh_scores == true)');
   d.writeln('      {');
   d.writeln('         get_nfl_scores(document,false,"");');
   d.writeln('      }');
   d.writeln('      else');
   d.writeln('      {');
   d.writeln('         document.location.href = "fp_postseason_form.html";');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   return true;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function change_view(document)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (window.top.gv.form_view == "expanded")');
   d.writeln('   {');
   d.writeln('      window.top.gv.form_view = "compact";');
   d.writeln('   }');
   d.writeln('   else if (window.top.gv.form_view == "compact")');
   d.writeln('   {');
   d.writeln('      window.top.gv.form_view = "expanded";');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (window.top.gv.mode == "results_archive")');
   d.writeln('   {');
   d.writeln('      document.location.href = "fp_forms_"+window.top.gv.archive_year+".html";');
   d.writeln('   }');
   d.writeln('   else');
   d.writeln('   {');
   d.writeln('      var refresh_scores = window.top.gv.refresh_scores;'); // Need to save refresh_scores because "clear_get_scores_data" will reset it.
   d.writeln('');
   d.writeln('      clear_get_scores_data();');
   d.writeln('');
   d.writeln('      if (window.top.gv.get_scores_state == "on" && refresh_scores == true)');
   d.writeln('      {');
   d.writeln('         get_nfl_scores(document,false,"");');
   d.writeln('      }');
   d.writeln('      else');
   d.writeln('      {');
   d.writeln('         document.location.href = "fp_postseason_form.html";');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   return true;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function clear_get_scores_data()');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   // Clear information set by "Get NFL Scores".');
   d.writeln('');
   d.writeln('   for (var i = 0; i < '+number_of_ps_games+'; i++)');
   d.writeln('   {');
   d.writeln('      window.top.gv.postseason_game_states[i]      = "at";');
   d.writeln('      window.top.gv.postseason_possession_teams[i] = "";');
   d.writeln('      window.top.gv.postseason_red_zone_flags[i]   = false;');
   d.writeln('      window.top.gv.postseason_victors[i]          = "";');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   window.top.gv.refresh_scores = false;');
   d.writeln('');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function clear_scores(document)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   clear_get_scores_data();');
   d.writeln('');
   d.writeln('   window.top.gv.scores_already_assigned = false;');
   d.writeln('');
   d.writeln('   document.location.href = "fp_postseason_form.html";');
   d.writeln('');
   d.writeln('   return true;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function get_nfl_scores(document,display_dialog,command)');
   d.writeln('{');
   d.writeln('   var nfl_connection = null;');
   d.writeln('   var nfl_scores     = null;');
   d.writeln('   var nfl_scores_url = "site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";');
   d.writeln('   var request_url    = "https://www.scrappintwins.com/cors/" + nfl_scores_url + "?" + (new Date()).getTime();'); // scrappintwins.com provided by Dan M.
   d.writeln('   var user_message   = "\\"Get NFL Scores\\" failed.";');
   d.writeln('');
   d.writeln('');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (window.top.gv.get_scores_state == "on") user_message += "  \\"Auto Refresh\\" will be stopped."');
   d.writeln('');
   d.writeln('   // Get the NFL scores from the internet.');
   d.writeln('');
   d.writeln('   nfl_connection = new XMLHttpRequest();');
   d.writeln('');
   d.writeln('   nfl_connection.open("GET",request_url,true);');
   d.writeln('');
   d.writeln('   nfl_connection.onload = function(e)');
   d.writeln('   {');
   d.writeln('      if (nfl_connection.readyState === 4) // Is XMLHttpRequest complete?');
   d.writeln('      {');
   d.writeln('         if (nfl_connection.status === 200) // Was the XMLHttpRequest successful?');
   d.writeln('         {');
   d.writeln('            nfl_scores = nfl_connection.responseText;');
   d.writeln('');
   d.writeln('            process_nfl_scores(document,display_dialog,command,nfl_scores);');
   d.writeln('         }');
   d.writeln('         else // XMLHttpRequest was unsuccessful.');
   d.writeln('         {');
   d.writeln('            alert(user_message);');
   d.writeln('');
   d.writeln('            // Force Auto Refresh to be off and refresh the picks form.');
   d.writeln('');
   d.writeln('            get_scores_auto_refresh(document,"stop");');
   d.writeln('');
   d.writeln('            document.location.href="fp_postseason_form.html";');
   d.writeln('         }');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      return;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   nfl_connection.onerror = function(e)');
   d.writeln('   {');
   d.writeln('      alert(user_message);');
   d.writeln('');
   d.writeln('      // Force Auto Refresh to be off and refresh the picks form.');
   d.writeln('');
   d.writeln('      get_scores_auto_refresh(document,"stop");');
   d.writeln('');
   d.writeln('      document.location.href="fp_postseason_form.html";');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   };');
   d.writeln('');
   d.writeln('   nfl_connection.send(null);');
   d.writeln('');
   d.writeln('   return;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function get_scores_auto_refresh(document,command)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   clear_get_scores_data();');
   d.writeln('');
   d.writeln('   if (command == "start")');
   d.writeln('   {');
   d.writeln('      if (window.top.gv.get_scores_state == "off")');
   d.writeln('      {');
   d.writeln('         window.top.gv.get_scores_state = "on";');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('   else  // command must equal "stop".');
   d.writeln('   {;');
   d.writeln('      if (window.top.gv.get_scores_state == "on")');
   d.writeln('      {');
   d.writeln('         clearInterval(window.top.gv.get_scores_timer);');
   d.writeln('');
   d.writeln('         window.top.gv.get_scores_state = "off";');
   d.writeln('         window.top.gv.get_scores_timer = null;');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function process_nfl_scores(document,display_dialog,command,nfl_scores)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   clear_get_scores_data();');
   d.writeln('');
   d.writeln('   window.top.gv.refresh_scores = true;');
   d.writeln('');
   d.writeln('   var game                     = "";');
   d.writeln('   var game_clock_integer       = "";');
   d.writeln('   var game_clock_string        = "";');
   d.writeln('   var game_list                = "";');
   d.writeln('   var game_state               = "";');
   d.writeln('   var game_status              = "game_not_started";');
   d.writeln('   var games_in_progress        = false;');
   d.writeln('   var home_score               = "";');
   d.writeln('   var home_team                = "";');
   d.writeln('   var home_team_id             = "";');
   d.writeln('   var nfl_team_names           = ["49ers","Bears","Bengals","Bills","Broncos","Browns","Buccaneers","Cardinals","Chargers","Chiefs","Colts","Cowboys","Dolphins","Eagles","Falcons","Commanders","Giants","Jaguars","Jets","Lions","Packers","Panthers","Patriots","Raiders","Rams","Ravens","Saints","Seahawks","Steelers","Texans","Titans","Vikings"];');
   d.writeln('   var possession_team          = "";');
   d.writeln('   var possession_teams_index   = 0;');
   d.writeln('   var postseason_victors_index = 0;');
   d.writeln('   var scores_index_start       = null;');
   d.writeln('   var scores_index_stop        = null;');
   d.writeln('   var temp_string              = "";');
   d.writeln('   var user_message             = "";');
   d.writeln('   var visiting_score           = "";');
   d.writeln('   var visiting_team            = "";');
   d.writeln('   var visiting_team_id         = "";');
   d.writeln('   var week                     = '+week+'');
   d.writeln('');
   d.writeln('');
   d.writeln('   if (command != "Start")');
   d.writeln('   {');
   d.writeln('      command = "Get NFL Scores";');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (display_dialog == true)');
   d.writeln('   {');
   d.writeln('      user_message = "\\""+ command + "\\" will:\\n\\n";');
   d.writeln('      user_message = user_message + "   - Clear the scores on the Picks Form\\n";');
   d.writeln('      user_message = user_message + "   - Get all in progress and final scores from the internet\\n";');
   d.writeln('      user_message = user_message + "   - Populate the Picks Form using the scores from the internet";');
   d.writeln('      if (command == "Start")');
   d.writeln('      {');
   d.writeln('         user_message = user_message + "\\n   - Automatically update the Picks Form every 10 seconds\\n";');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      if (confirm(user_message) == false) return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (week == 1)');
   d.writeln('   {');
   d.writeln('      scores_index_start = '+w1_start+'-1;');
   d.writeln('      scores_index_stop  = '+w1_end+'-1;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (week == 2)');
   d.writeln('   {');
   d.writeln('      scores_index_start = '+w2_start+'-1;');
   d.writeln('      scores_index_stop  = '+w2_end+'-1;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (week == 3)');
   d.writeln('   {');
   d.writeln('      scores_index_start = '+w3_start+'-1;');
   d.writeln('      scores_index_stop  = '+w3_end+'-1;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (week == 4)');
   d.writeln('   {');
   d.writeln('      scores_index_start = '+w4_start+'-1;');
   d.writeln('      scores_index_stop  = '+w4_end+'-1;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   // Convert nfl_scores string to a JavaScript object.');
   d.writeln('');
   d.writeln('   nfl_scores = JSON.parse(nfl_scores);');
   d.writeln('');
   d.writeln('   // Get the game list pointer from nfl_scores.');
   d.writeln('');
   d.writeln('   game_list = nfl_scores.events;');
   d.writeln('');
   d.writeln('   // Loop through the game list and get information for each valid game.');
   d.writeln('');
   d.writeln('   for (var i = 0; i < game_list.length; i++)');
   d.writeln('   {');
   d.writeln('      // Get the game pointer from game_list.');
   d.writeln('');
   d.writeln('      game = game_list[i].competitions[0];');
   d.writeln('');
   d.writeln('      // Get the team names and scores.');
   d.writeln('');
   d.writeln('      if (game.competitors[0].homeAway == "home")');
   d.writeln('      {');
   d.writeln('         home_team    = game.competitors[0].team.name;');
   d.writeln('         home_team_id = game.competitors[0].id;');
   d.writeln('         home_score   = game.competitors[0].score - 0;');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      if (game.competitors[1].homeAway == "home")');
   d.writeln('      {');
   d.writeln('         home_team    = game.competitors[1].team.name;');
   d.writeln('         home_team_id = game.competitors[1].id;');
   d.writeln('         home_score   = game.competitors[1].score - 0;');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      if (game.competitors[0].homeAway == "away")');
   d.writeln('      {');
   d.writeln('         visiting_team    = game.competitors[0].team.name;');
   d.writeln('         visiting_team_id = game.competitors[0].id;');
   d.writeln('         visiting_score   = game.competitors[0].score - 0;');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      if (game.competitors[1].homeAway == "away")');
   d.writeln('      {');
   d.writeln('         visiting_team    = game.competitors[1].team.name;');
   d.writeln('         visiting_team_id = game.competitors[1].id;');
   d.writeln('         visiting_score   = game.competitors[1].score - 0;');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      // Loop through this week\'s games.');
   d.writeln('');
   d.writeln('      for (var j = scores_index_start; j <= scores_index_stop; j++)');
   d.writeln('      {');
   d.writeln('         // If the home and visiting teams from the game information match one of this week\'s games, then get the game information.');
   d.writeln('');
   d.writeln('         if ( (home_team.toLowerCase() != home_teams[j].toLowerCase()) || (visiting_team.toLowerCase() != visiting_teams[j].toLowerCase()) )');
   d.writeln('         {');
   d.writeln('            // No match, so skip this game.');
   d.writeln('');
   d.writeln('            continue;');
   d.writeln('         }');
   d.writeln('');
   d.writeln('         // Determine the status and state of the current game.');
   d.writeln('');
   d.writeln('         if (game.status.type.state == "pre")');
   d.writeln('         {');
   d.writeln('            game_status = "game_not_started";');
   d.writeln('            game_state  = "";');
   d.writeln('         }');
   d.writeln('         else if (game.status.type.description == "Halftime")');
   d.writeln('         {');
   d.writeln('            game_status = "halftime";');
   d.writeln('            game_state  = "H";');
   d.writeln('         }');
   d.writeln('         else if (game.status.type.description == "Final")');
   d.writeln('         {');
   d.writeln('            game_status = "game_over";');
   d.writeln('            game_state  = "F";');
   d.writeln('');
   d.writeln('            if (game.status.period >= 5) game_state = "F OT";');
   d.writeln('         }');
   d.writeln('         else');
   d.writeln('         {');
   d.writeln('            game_status = "game_in_progress";');
   d.writeln('');
   d.writeln('            // Set the game state to the game quarter or overtime.');
   d.writeln('');
   d.writeln('            if (game.status.period == 1) game_state = "1st";');
   d.writeln('            if (game.status.period == 2) game_state = "2nd";');
   d.writeln('            if (game.status.period == 3) game_state = "3rd";');
   d.writeln('            if (game.status.period == 4) game_state = "4th";');
   d.writeln('            if (game.status.period >= 5) game_state = "OT" + (game.status.period-4);');
   d.writeln('');
   d.writeln('            // Set the game clock string.');
   d.writeln('');
   d.writeln('            game_clock_string = game.status.displayClock;');
   d.writeln('');
   d.writeln('            // Determine if there are two minutes or less to play in the 2nd quarter, 4th quarter, or overtime.');
   d.writeln('');
   d.writeln('            if ( (game_state.substring(0,1) == "2") || (game_state.substring(0,1) == "4") )');
   d.writeln('            {');
   d.writeln('               if (game_clock_string != "")');
   d.writeln('               {');
   d.writeln('                  game_clock_integer = game_clock_string;');
   d.writeln('                  game_clock_integer = game_clock_integer.replace(/:/g,"");  // Remove the ":".');
   d.writeln('                  game_clock_integer = game_clock_integer - 0;               // Make sure game_clock is an integer.');
   d.writeln('');
   d.writeln('                  if (game_clock_integer <= 200)');
   d.writeln('                  {');
   d.writeln('                     // Set the color of the game clock string to red to indicate two minutes or less to go.');
   d.writeln('');
   d.writeln('                     game_clock_string = "<font color=red>" + game_clock_string + "</font>";');
   d.writeln('                  }');
   d.writeln('               }');
   d.writeln('            }');
   d.writeln('');
   d.writeln('            // Remove leading zero in the game_clock_string.');
   d.writeln('');
   d.writeln('            if (game_clock_string.charAt(game_clock_string.indexOf(":")-2) == "0")');
   d.writeln('            {');
   d.writeln('               temp_string  = game_clock_string.substring(0,game_clock_string.indexOf(":")-2);');
   d.writeln('               temp_string += game_clock_string.substring(game_clock_string.indexOf(":")-1);');
   d.writeln('');
   d.writeln('               game_clock_string = temp_string;');
   d.writeln('            }');
   d.writeln('');
   d.writeln('            // Add the game clock to the game state.');
   d.writeln('');
   d.writeln('            game_state = game_state + " " + game_clock_string;');
   d.writeln('');
   d.writeln('            // Add the down, yards to go, and yard line to the game state.');
   d.writeln('');
   d.writeln('            if (game.situation.downDistanceText != undefined) game_state = game_state + "<br><font size=-2>" + game.situation.downDistanceText + "</font>";');
   d.writeln('');
   d.writeln('            // Determine which team has possession of the ball and if they\'re in the red zone.');
   d.writeln('');
   d.writeln('            possession_team = "";');
   d.writeln('');
   d.writeln('            if (game.situation.possession != undefined)');
   d.writeln('            {');
   d.writeln('               if (game.situation.possession == home_team_id    ) possession_team = home_team;');
   d.writeln('               if (game.situation.possession == visiting_team_id) possession_team = visiting_team;');
   d.writeln('            }');
   d.writeln('');
   d.writeln('            if (possession_team != "")');
   d.writeln('            {');
   d.writeln('               window.top.gv.postseason_possession_teams[possession_teams_index] = possession_team;');
   d.writeln('');
   d.writeln('               if ( (game.situation.isRedZone != undefined) && (game.situation.isRedZone == true) )');
   d.writeln('               {');
   d.writeln('                  window.top.gv.postseason_red_zone_flags[possession_teams_index] = true;');
   d.writeln('               }');
   d.writeln('');
   d.writeln('               possession_teams_index++;');
   d.writeln('            }');
   d.writeln('         }');
   d.writeln('');
   d.writeln('         //JL alert(":"+visiting_team+":"+visiting_score+":"+home_team+":"+home_score+":"+game_status+":"+game_state);');
   d.writeln('');
   d.writeln('         // Reset the scores of this game to zero.');
   d.writeln('');
   d.writeln('         window.top.gv.visitor_scores[j] = 0;');
   d.writeln('         window.top.gv.home_scores[j]    = 0;');
   d.writeln('');
   d.writeln('         // If this game is in progress remember the scores.');
   d.writeln('');
   d.writeln('         if (game_status != "game_not_started")');
   d.writeln('         {');
   d.writeln('            games_in_progress = true;');
   d.writeln('');
   d.writeln('            window.top.gv.visitor_scores[j]         = visiting_score;');
   d.writeln('            window.top.gv.home_scores[j]            = home_score;');
   d.writeln('            window.top.gv.postseason_game_states[j] = "<font style=\\"font-size: 8pt\\">" + game_state + "</font>";');
   d.writeln('         }');
   d.writeln('');
   d.writeln('         // If this game is over remember the winner.');
   d.writeln('');
   d.writeln('         if (game_status == "game_over")');
   d.writeln('         {');
   d.writeln('            if (visiting_score > home_score)');
   d.writeln('            {');
   d.writeln('               window.top.gv.postseason_victors[postseason_victors_index] = visiting_team;');
   d.writeln('');
   d.writeln('               postseason_victors_index++;');
   d.writeln('            }');
   d.writeln('            else if (home_score > visiting_score)');
   d.writeln('            {');
   d.writeln('               window.top.gv.postseason_victors[postseason_victors_index] = home_team;');
   d.writeln('');
   d.writeln('               postseason_victors_index++;');
   d.writeln('            }');
   d.writeln('         }');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (games_in_progress == false)');
   d.writeln('   {');
   d.writeln('      alert("There are no Postseason Week " + week + " games in progress yet.");');
   d.writeln('');
   d.writeln('      // Force auto refresh to be off if no games are in progress.');
   d.writeln('');
   d.writeln('      window.top.gv.get_scores_state = "off";');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   // Redisplay the picks form.');
   d.writeln('');
   d.writeln('   document.location.href = "fp_postseason_form.html";');
   d.writeln('');
   d.writeln('   return true;');
   d.writeln('}');
   d.writeln('');
   d.writeln('</'+'script>');
   d.writeln('');
   d.writeln('');
   d.writeln('<center>');
   d.writeln('');
   if ( (top.gv.mobile == false) || (navigator.platform.toLowerCase().indexOf("ipad") != -1) || ((navigator.platform.toLowerCase().indexOf("macintel") != -1) && (navigator.maxTouchPoints > 1)) )
   {
      d.writeln('<div style="margin: 10px 0px 10px 0px"><font style="font-family: Calibri; font-size: 16pt; font-weight: bold">'+document_heading+'</font></div>');
      d.writeln('');
   }
   d.writeln('<form name="fp_scores">');
   d.writeln('');

   d.writeln('<table align=center');
   d.writeln('       class="b3_border"');
   d.writeln('      border=0');
   d.writeln('     bgcolor=white');
   d.writeln(' cellpadding=2');
   d.writeln(' cellspacing=0');
   d.writeln('          id="postseason_table">');
   d.writeln('');

   d.writeln('<tr class="header_one" style="line-height: 21px">');
   d.writeln('<td nowrap class="br2_bb2_border" colspan=5>');
   d.writeln('<font style="font-size: 14pt">Week '+week+' '+mode_string+'</font>');
   d.writeln('</td>');
   for (var pi = 1; pi <= number_of_ps_players; pi++)
   {
      if (pi == number_of_ps_players)
      {
         d.writeln('<td class="bb2_border" colspan='+player_colspan+'>'+ps_players[player_index[pi-1]]+'</td>');
      }
      else
      {
         d.writeln('<td class="br2_bb2_border" colspan='+player_colspan+'>'+ps_players[player_index[pi-1]]+'</td>');
      }
   }
   d.writeln('</tr>');

   for (var gi = 1; gi <= number_of_games_to_display; gi++)
   {
      // Determine if this game falls within the current picks week.

      current_picks_week = false;

      if ( ( (week == 1) && (gi >= w1_start && gi <= w1_end) ) ||
           ( (week == 2) && (gi >= w2_start && gi <= w2_end) ) ||
           ( (week == 3) && (gi >= w3_start && gi <= w3_end) ) ||
           ( (week == 4) && (gi >= w4_start && gi <= w4_end) )    )
      {
         if (mode == "picks") current_picks_week = true;
      }

      if ( (gi == w1_start) || (gi == w2_start) || (gi == w3_start) || (gi == w4_start) )
      {
         d.writeln('');
         d.writeln('<tr style="line-height: 2px">');
         d.writeln('<td class="bb2_border" colspan='+(5+player_colspan*12)+'>&nbsp</td>');
         d.writeln('</tr>');
         d.writeln('');
         d.writeln('<tr class="header_two" style="line-height: 18px">');

         if (gi == w1_start)
         {
            d.writeln('<td class="br2_bb2_border" colspan=5><font style="font-size: 11pt">Wild Card Weekend</font></td>');
         }
         else if (gi == w2_start)
         {
            d.writeln('<td class="br2_bb2_border" colspan=5><font style="font-size: 11pt">Divisional Playoffs</font></td>');
         }
         else if (gi == w3_start)
         {
            d.writeln('<td class="br2_bb2_border" colspan=5><font style="font-size: 11pt">Conference Championships</font></td>');
         }
         else if (gi == w4_start)
         {
            d.writeln('<td class="br2_bb2_border" colspan=5><font style="font-size: 11pt">Super Bowl</font></td>');
         }

         for (var pi = 1; pi <= number_of_ps_players; pi++)
         {
            if (form_view == "expanded")
            {
               d.writeln('<td class="gr1_bb2_border" colspan=3><font style="font-size: 10.5pt">Pick</font></td>');
            }
            if (pi == number_of_ps_players)
            {
               d.writeln('<td class="bb2_border"><font style="font-size: 10.5pt" color=blue>Score</font></td>');
            }
            else
            {
               d.writeln('<td class="br2_bb2_border"><font style="font-size: 10.5pt" color=blue>Score</font></td>');
            }
         }
         d.writeln('</tr>');
      }

      d.writeln('');
      d.writeln('<tr align=center style="line-height: 15px">');

      border_style = "gr1_gb1_border";

      if (use_player_points == false) border_style = "gr1_bb1_border";

      if (current_picks_week == true)
      {
         for (var j = 1; j <= number_of_ps_games; j++)
         {
            input_tag_class = " class=\"default_text border_radius\" ";

            if ( (visiting_teams[gi-1] == victors[j-1]) || (home_teams[gi-1] == victors[j-1]) )
            {
               // Highlight the background of the scores to signify that the game has concluded.

               input_tag_class = " class=\"default_text header_two_background border_radius\" ";

               break;
            }
         }

         // Determine which team (if any) has possession of the ball and if they're in the red zone.

         bullet_color                  = color_black;
         home_team_possession_flag     = "";
         visiting_team_possession_flag = "";

         for (var j = 1; j <= number_of_ps_games; j++)
         {
            if (postseason_possession_teams[j-1] == visiting_teams[gi-1])
            {
               // Set the visiting team possession flag.

               if (postseason_red_zone_flags[j-1] == true) bullet_color = color_red;

               visiting_team_possession_flag = "<span style='font-weight:bold; color:"+bullet_color+"'>\u2022&nbsp;</span>";

               break;
            }
            else if (postseason_possession_teams[j-1] == home_teams[gi-1])
            {
               // Set the home team possession flag.

               if (postseason_red_zone_flags[j-1] == true) bullet_color = color_red;

               home_team_possession_flag = "<span style='font-weight:bold; color:"+bullet_color+"'>\u2022&nbsp;</span>";

               break;
            }
         }

         // Set the game state flag (quarter, halftime, or overtime) if the game is in progress.

         game_state = window.top.gv.postseason_game_states[gi-1];

         if ( (gi == w1_end) || (gi == w2_end) || (gi == w3_end) || (gi == w4_end) )
         {
            d.writeln('<td style="padding: 0px" class="'+border_style+'">');
         }
         else
         {
            d.writeln('<td style="padding: 0px" class="gr1_border">');
         }

         d.writeln('<input type=text'+input_tag_class+'style="border-radius: 0px; font-size: 10pt; width: 25px" value='+visitor_scores[gi-1]+' size="'+input_field_size+'" maxlength="2" name="visitor'+gi+'_score">');
         d.writeln('</td>');
      }
      else
      {
         // Make sure possession flags are cleared for games not being played this week.

         home_team_possession_flag     = "";
         visiting_team_possession_flag = "";
         game_state                    = "at";

         if ( (gi == w1_end) || (gi == w2_end) || (gi == w3_end) || (gi == w4_end) )
         {
            d.writeln('<td style="padding:2px 4px 2px 4px" class="'+border_style+'"><font style="font-size: 10pt">'+visitor_scores[gi-1]+'</font></td>');
         }
         else
         {
            d.writeln('<td style="padding:2px 4px 2px 4px" class="gr1_border"><font style="font-size: 10pt" >'+visitor_scores[gi-1]+'</font></td>');
         }
      }

      border_style = "gb1_border"; if (current_picks_week == true) border_style = "gr1_gb1_border";

      if (use_player_points == false) {border_style = "bb1_border"; if (current_picks_week == true) border_style = "gr1_bb1_border";}

      if ( (gi != w1_end) && (gi != w2_end) && (gi != w3_end) && (gi != w4_end) )
      {
         border_style = "no_border"; if (current_picks_week == true) border_style = "gr1_border";
      }

      if (postseason_winners[gi-1] == "V")
      {
         d.writeln('<td nowrap class="'+border_style+'"><font style="font-size: 10pt; color: blue">'+visiting_team_possession_flag+visiting_teams[gi-1]+'</font></td>');
      }
      else
      {
         d.writeln('<td nowrap class="'+border_style+'"><font style="font-size: 10pt">'+visiting_team_possession_flag+visiting_teams[gi-1]+'</font></td>');
      }

      d.writeln('<td nowrap class="'+border_style+'" style="min-width: 15px"><div style="line-height: 11px"><font style="font-size: 10pt">'+game_state+'</font></div></td>');

      border_style = "gr1_gb1_border";

      if (use_player_points == false) border_style = "gr1_bb1_border";

      if (postseason_winners[gi-1] == "H")
      {
         if ( (gi == w1_end) || (gi == w2_end) || (gi == w3_end) || (gi == w4_end) )
         {
            d.writeln('<td nowrap class="'+border_style+'"><font style="font-size: 10pt; color: blue">'+home_team_possession_flag+home_teams[gi-1]+'</font></td>');
         }
         else
         {
            d.writeln('<td nowrap class="gr1_border"><font style="font-size: 10pt; color: blue">'+home_team_possession_flag+home_teams[gi-1]+'</font></td>');
         }
      }
      else
      {
         if ( (gi == w1_end) || (gi == w2_end) || (gi == w3_end) || (gi == w4_end) )
         {
            d.writeln('<td nowrap class="'+border_style+'"><font style="font-size: 10pt">'+home_team_possession_flag+home_teams[gi-1]+'</font></td>');
         }
         else
         {
            d.writeln('<td nowrap class="gr1_border"><font style="font-size: 10pt">'+home_team_possession_flag+home_teams[gi-1]+'</font></td>');
         }
      }

      border_style = "br2_gb1_border";

      if (use_player_points == false) border_style = "br2_bb1_border";

      if (current_picks_week == true)
      {
         if ( (gi == w1_end) || (gi == w2_end) || (gi == w3_end) || (gi == w4_end) )
         {
            d.writeln('<td style="padding: 0px" class="'+border_style+'">');
         }
         else
         {
            d.writeln('<td style="padding: 0px" class="br2_border">');
         }
         d.writeln('<input type=text'+input_tag_class+'style="border-radius: 0px; font-size: 10pt; width: 25px" value='+home_scores[gi-1]+' size="'+input_field_size+'" maxlength="2" name="home'+gi+'_score">');
         d.writeln('</td>');
      }
      else
      {
         if ( (gi == w1_end) || (gi == w2_end) || (gi == w3_end) || (gi == w4_end) )
         {
            d.writeln('<td style="padding:2px 4px 2px 4px" class="'+border_style+'"><font style="font-size: 10pt">'+home_scores[gi-1]+'</font></td>');
         }
         else
         {
            d.writeln('<td style="padding:2px 4px 2px 4px" class="br2_border"><font style="font-size: 10pt">'+home_scores[gi-1]+'</font></td>');
         }
      }

      for (var pi = 1; pi <= number_of_ps_players; pi++)
      {
         var score_color = "class=blue_color";

         if (player_picks[player_index[pi-1]][gi-1] != postseason_winners[gi-1])
         {
            score_color = "class=black_color";
         }
         if (form_view == "expanded")
         {
            if ( (gi == w1_end) || (gi == w2_end) || (gi == w3_end) || (gi == w4_end) )             
            {
               border_style = "gb1_border";

               if (use_player_points == false) border_style = "bb1_border";

               d.writeln('<td class="'+border_style+'" style="min-width: 15px"><font style="font-size: 10pt">'+player_picks[player_index[pi-1]][gi-1]+'</font></td>');
               d.writeln('<td class="'+border_style+'" style="min-width: 15px"><font style="font-size: 10pt">by</font></td>');

               border_style = "gr1_gb1_border";

               if (use_player_points == false) border_style = "gr1_bb1_border";

               d.writeln('<td class="'+border_style+'" style="min-width: 15px"><font style="font-size: 10pt">'+player_spreads[player_index[pi-1]][gi-1]+'</font></td>');
            }
            else
            {
               d.writeln('<td style="min-width: 15px"><font style="font-size: 10pt">'+player_picks[player_index[pi-1]][gi-1]+'</font></td>');
               d.writeln('<td style="min-width: 15px"><font style="font-size: 10pt">by</font></td>');  
               d.writeln('<td class="gr1_border" style="min-width: 15px"><font style="font-size: 10pt">'+player_spreads[player_index[pi-1]][gi-1]+'</font></td>');
            } 
         }

         if (pi == number_of_ps_players)
         {
            if ( (gi == w1_end) || (gi == w2_end) || (gi == w3_end) || (gi == w4_end) )
            {
               border_style = "gb1_border";

               if (use_player_points == false) border_style = "bb1_border";

               d.writeln('<td class="'+border_style+'"><font style="font-size: 10pt" '+score_color+'>'+player_scores[player_index[pi-1]][gi-1]+'</font></td>');
            }
            else
            {
               d.writeln('<td><font style="font-size: 10pt" '+score_color+'>'+player_scores[player_index[pi-1]][gi-1]+'</font></td>');
            }
         }
         else
         {
            if ( (gi == w1_end) || (gi == w2_end) || (gi == w3_end) || (gi == w4_end) )
            {
               border_style = "br2_gb1_border";

               if (use_player_points == false) border_style = "br2_bb1_border";

               d.writeln('<td class="'+border_style+'"><font style="font-size: 10pt" '+score_color+'>'+player_scores[player_index[pi-1]][gi-1]+'</font></td>');
            }
            else
            {
               d.writeln('<td class="br2_border"><font style="font-size: 10pt" '+score_color+'>'+player_scores[player_index[pi-1]][gi-1]+'</font></td>');
            }
         }
      }

      d.writeln('</tr>');  

      if ( (gi == w1_end) || (gi == w2_end) || (gi == w3_end) || (gi == w4_end) )
      {
         if (use_player_points == true)
         {
            total_points_label = "Total Points:";

            if (gi == w1_end)
            {
               high_score_count   = week_1_high_score_count;
               high_score_players = week_1_high_score_players;

               if (week >= 1) total_points_label = "\"" + visiting_teams[gi-1] + " at " + home_teams[gi-1] + "\" " + total_points_label;
            }
            if (gi == w2_end)
            {
               high_score_count   = week_2_high_score_count;
               high_score_players = week_2_high_score_players;

               if (week >= 2) total_points_label = "\"" + visiting_teams[gi-1] + " at " + home_teams[gi-1] + "\" " + total_points_label;
            }
            if (gi == w3_end)
            {
               high_score_count   = week_3_high_score_count;
               high_score_players = week_3_high_score_players;

               if (week >= 3) total_points_label = "\"" + visiting_teams[gi-1] + " at " + home_teams[gi-1] + "\" " + total_points_label;
            }
            if (gi == w4_end)
            {
               high_score_count   = week_4_high_score_count;
               high_score_players = week_4_high_score_players;

               if (week >= 4) total_points_label = "\"" + visiting_teams[gi-1] + " at " + home_teams[gi-1] + "\" " + total_points_label;
            }

            total_points = visitor_scores[gi-1] + home_scores[gi-1];

            if (isNaN(total_points) == true) total_points = "<br>";

            d.writeln('');
            d.writeln('<tr align=center style="line-height: 15px">');

            d.writeln('<td align=right class="bb1_border" colspan=4 style="padding:0px" nowrap><font style="font-size: 8pt">'+total_points_label+'</font></td>');
            d.writeln('<td class="br2_bb1_border" style="padding:0px"><font style="font-size: 8pt">'+total_points+'</font></td>');

            for (var pi = 1; pi <= number_of_ps_players; pi++)
            {
               if (form_view == "expanded")
               {
                  points = player_points[player_index[pi-1]][gi-1];

                  if (points == 0) points = "<br>";

                  d.writeln('<td class="gr1_bb1_border" colspan=3 style="padding:0px"><font style="font-size: 8pt">Points:&nbsp;&nbsp'+points+'</font></td>');
               }

               total_points_score = "<br>";

               if ( (high_score_count > 1) && (total_points > 0) )
               {
                  for (var index = 1; index <= high_score_count; index++)
                  {
                     if (high_score_players[index-1] == player_index[pi-1])
                     {
                        if (isNaN(player_points[player_index[pi-1]][gi-1]) == false)
                        {
                           total_points_score = total_points - player_points[player_index[pi-1]][gi-1];

                           if (total_points_score > 0) 
                           {
                              total_points_score = Math.abs(total_points_score) + " under";
                           }
                           else if (total_points_score < 0) 
                           {
                              total_points_score = Math.abs(total_points_score) + " over";
                           }
                           else
                           {
                              total_points_score = "exact";
                           }
                        }
                     }
                  }
               }

               if (pi == number_of_ps_players)
               {
                  d.writeln('<td class="bb1_border" colspan=1 style="padding:0px" nowrap><font style="font-size: 8pt">'+total_points_score+'</font></td>');
               }
               else
               {
                  d.writeln('<td class="br2_bb1_border" colspan=1 style="padding:0px" nowrap><font style="font-size: 8pt">'+total_points_score+'</font></td>');
               }
            }

            d.writeln('</tr>');
         }

         d.writeln('');
         d.writeln('<tr align=center style="line-height: 17px">');

         if (gi == w1_end)
         {
            d.writeln('<td nowrap class="br2_bb2_border" align=right colspan=5><font style="font-size: 11pt"><b>Week 1 Scores:&nbsp;</b></font></td>');
         }
         if (gi == w2_end)
         {
            d.writeln('<td nowrap class="br2_bb2_border" align=right colspan=5><font style="font-size: 11pt"><b>Week 2 Scores:&nbsp;</b></font></td>');
         }
         if (gi == w3_end)
         {
            d.writeln('<td nowrap class="br2_bb2_border" align=right colspan=5><font style="font-size: 11pt"><b>Week 3 Scores:&nbsp;</b></font></td>');
         }
         if (gi == w4_end)
         {
            d.writeln('<td nowrap class="br2_bb2_border" align=right colspan=5><font style="font-size: 11pt"><b>Week 4 Scores:&nbsp;</b></font></td>');
         }

         for (var pi = 1; pi <= number_of_ps_players; pi++)
         {
            if (week_1_scores[player_index[pi-1]] == null_score)
            {
               week_1_ranks[player_index[pi-1]]  = "<br>";
               week_1_scores[player_index[pi-1]] = "<br>";
            }

            if (week_2_scores[player_index[pi-1]] == null_score)
            {
               week_2_ranks[player_index[pi-1]]  = "<br>";
               week_2_scores[player_index[pi-1]] = "<br>";
            }

            if (week_3_scores[player_index[pi-1]] == null_score)
            {
               week_3_ranks[player_index[pi-1]]  = "<br>";
               week_3_scores[player_index[pi-1]] = "<br>";
            }

            if (week_4_scores[player_index[pi-1]] == null_score)
            {
               week_4_ranks[player_index[pi-1]]  = "<br>";
               week_4_scores[player_index[pi-1]] = "<br>";
            }

            background_color_class = "";

            if ( (gi == w1_end) && (week_1_valid_game_cnt > 0) )
            {
               if (week_1_ranks[player_index[pi-1]] == 1) background_color_class = " header_two_background";
            }
            if ( (gi == w2_end) && (week_2_valid_game_cnt > 0) )
            {
               if (week_2_ranks[player_index[pi-1]] == 1) background_color_class = " header_two_background";
            }
            if ( (gi == w3_end) && (week_3_valid_game_cnt > 0) )
            {
               if (week_3_ranks[player_index[pi-1]] == 1) background_color_class = " header_two_background";
            }
            if ( (gi == w4_end) && (week_4_valid_game_cnt > 0) )
            {
               if (week_4_ranks[player_index[pi-1]] == 1) background_color_class = " header_two_background";
            }

            if (form_view == "expanded")
            {
               d.writeln('<td nowrap class="gr1_bb2_border'+background_color_class+'" colspan=3><font style="font-size: 9pt" color=blue>Rank = ');
               if (gi == w1_end)
               {
                  if (week_1_valid_game_cnt > 0)
                  {
                     d.writeln(week_1_ranks[player_index[pi-1]]);
                  }
                  else
                  {
                     d.writeln('<br>');
                  }
               }
               else if (gi == w2_end)
               {
                  if (week_2_valid_game_cnt > 0)
                  {
                     d.writeln(week_2_ranks[player_index[pi-1]]);
                  }
                  else
                  {
                     d.writeln('<br>');
                  }
               }
               else if (gi == w3_end)
               {
                  if (week_3_valid_game_cnt > 0)
                  {
                     d.writeln(week_3_ranks[player_index[pi-1]]);
                  }
                  else
                  {
                     d.writeln('<br>');
                  }
               }
               else if (gi == w4_end)
               {
                  if (week_4_valid_game_cnt > 0)
                  {
                     d.writeln(week_4_ranks[player_index[pi-1]]);
                  }
                  else
                  {
                     d.writeln('<br>');
                  }
               }
               d.writeln('</font></td>');
            }
            if (pi == number_of_ps_players)
            {
               d.writeln('<td class="bb2_border'+background_color_class+'"><font style="font-size: 11pt" color=blue><b>');
            }
            else
            {
               d.writeln('<td class="br2_bb2_border'+background_color_class+'"><font style="font-size:11pt" color=blue><b>');
            }
            if (gi == w1_end)
            {
               if (week_1_valid_game_cnt > 0)
               {
                  score = week_1_scores[player_index[pi-1]];
                  if (isNaN(score) == false) score = week_1_scores[player_index[pi-1]].toFixed(decimal_count);
                  d.writeln(score);
               }
               else
               {
                  d.writeln('<br>');
               }
            }
            else if (gi == w2_end)
            {
               if (week_2_valid_game_cnt > 0)
               {
                  score = week_2_scores[player_index[pi-1]];
                  if (isNaN(score) == false) score = week_2_scores[player_index[pi-1]].toFixed(decimal_count);
                  d.writeln(score);
               }
               else
               {
                  d.writeln('<br>');
               }
            }
            else if (gi == w3_end)
            {
               if (week_3_valid_game_cnt > 0)
               {
                  score = week_3_scores[player_index[pi-1]];
                  if (isNaN(score) == false) score = week_3_scores[player_index[pi-1]].toFixed(decimal_count);
                  d.writeln(score);
               }
               else
               {
                  d.writeln('<br>');
               }
            }
            else if (gi == w4_end)
            {
               if (week_4_valid_game_cnt > 0)
               {
                  score = week_4_scores[player_index[pi-1]];
                  if (isNaN(score) == false) score = week_4_scores[player_index[pi-1]].toFixed(decimal_count);
                  d.writeln(score);
               }
               else
               {
                  d.writeln('<br>');
               }
            }
            d.writeln('</b></font></td>');
         }
         d.writeln('</tr>');
      }
   }

   d.writeln('');
   d.writeln('<tr style="line-height: 2px">');
   d.writeln('<td class="bb2_border" colspan='+(5+player_colspan*12)+'>&nbsp</td>');
   d.writeln('</tr>');
   d.writeln('');
   d.writeln('<tr class="header_two" style="line-height: 18px">');
   d.writeln('<td class="br2_bb2_border" colspan=5><font style="font-size: 11pt">Cumulative Results</font></td>');
   for (var pi = 1; pi <= number_of_ps_players; pi++)
   {
      if (form_view == "expanded")
      {
         d.writeln('<td class="gr1_bb2_border" colspan=3><font style="font-size: 10.5pt">Rank</font></td>');
      }
      if (pi == number_of_ps_players)
      {
         d.writeln('<td class="bb2_border"><font style="font-size: 10.5pt" color=blue>Score</font></td>');
      }
      else
      {
         d.writeln('<td class="br2_bb2_border"><font style="font-size: 10.5pt" color=blue>Score</font></td>');
      }
   }
   d.writeln('</tr>');

   d.writeln('');
   d.writeln('<tr align=center style="line-height: 20px">');
   d.writeln('<td nowrap class="br2_bb1_border" align=right colspan=5><font style="font-size: 11pt"><b>Scores:&nbsp;</b></font></td>');
   for (var pi = 1; pi <= number_of_ps_players; pi++)
   {
      if (overall_scores[player_index[pi-1]] == null_score)
      {
         overall_ranks[player_index[pi-1]]  = "<br>";
         overall_scores[player_index[pi-1]] = "<br>";
      }

      background_color_class = "";

      if (overall_ranks[player_index[pi-1]] == 1) background_color_class = " header_two_background";

      if (form_view == "expanded")
      {
         d.writeln('<td nowrap class="gr1_bb1_border'+background_color_class+'" colspan=3><font style="font-size: 9pt" color=blue>Rank = '+overall_ranks[player_index[pi-1]]+'</font></td>');
      }
      if (pi == number_of_ps_players)
      {
         score = overall_scores[player_index[pi-1]];
         if (isNaN(score) == false) score = overall_scores[player_index[pi-1]].toFixed(decimal_count);
         d.writeln('<td class="bb1_border'+background_color_class+'"><font style="font-size: 11pt" color=blue><b>'+score+'</b></font></td>');
      }
      else
      {
         score = overall_scores[player_index[pi-1]];
         if (isNaN(score) == false) score = overall_scores[player_index[pi-1]].toFixed(decimal_count);
         d.writeln('<td class="br2_bb1_border'+background_color_class+'"><font style="font-size: 11pt" color=blue><b>'+score+'</b></font></td>');
      }
   }
   d.writeln('</tr>');

   d.writeln('');
   d.writeln('<tr align=center style="line-height: 20px">');
   d.writeln('<td nowrap class="br2_border" align=right colspan=5><font style="font-size: 11pt"><b>Wins:&nbsp;</b></font></td>');
   for (var pi = 1; pi <= number_of_ps_players; pi++)
   {
      if ( (overall_scores[player_index[pi-1]] == null_score) || (overall_scores[player_index[pi-1]] == "<br>") )
      {
         percent_wins                         = "<br>";
         player_win_count[player_index[pi-1]] = "<br>";
      }
      else if (possible_win_count < 1)
      {
         percent_wins                         = "<br>";
         player_win_count[player_index[pi-1]] = 0;
      }
      else
      {
         percent_wins = Math.round((player_win_count[player_index[pi-1]]/possible_win_count)*100) + "%";
      }

      background_color_class = "";

      if (player_win_count[player_index[pi-1]] == best_player_win_count) background_color_class = " header_two_background";

      if (form_view == "expanded")
      {
         d.writeln('<td nowrap class="gr1_border'+background_color_class+'" colspan=3><font style="font-size: 9pt" color=blue>Wins = '+player_win_count[player_index[pi-1]]+'</font></td>');
      }
      else
      {
         percent_wins = player_win_count[player_index[pi-1]];
      }

      if (pi == number_of_ps_players)
      {
         d.writeln('<td class="'+background_color_class+'"><font style="font-size: 9pt" color=blue>'+percent_wins+'</font></td>');
      }
      else
      {
         d.writeln('<td class="br2_border'+background_color_class+'"><font style="font-size: 9pt" color=blue>'+percent_wins+'</font></td>');
      }
   }
   d.writeln('</tr>');

   d.writeln('');
   d.writeln('</table>');

   d.writeln('');
   d.writeln('<table cols=1 align=center>');
   d.writeln('');

   d.writeln('<tr><td class="no_border" style="font-size: 2pt"><br></td></tr>');
   d.writeln('');
   if (mode == "picks")
   {
      d.writeln('<tr align=center>');
      d.writeln('<td nowrap valign=middle class="no_border">');
      d.writeln('<input type="button" class="default_button border_radius" name="get_scores_button" value="Get NFL Scores"');
      d.writeln('    onClick=get_nfl_scores(document,false,"");>');
      d.writeln('&nbsp;');
      d.writeln('<font face="Calibri" color=black style="font-size: 12pt">Auto Refresh:</font>&nbsp;');
      if (window.top.gv.get_scores_state == "off")
      {
         d.writeln('<input type="button" class="default_button border_radius" name="get_scores_start_button" value="Start"');
         d.writeln('    onClick=get_scores_auto_refresh(document,"start");get_nfl_scores(document,false,"Start");>');
      }
      else
      {
         d.writeln('<input type="button" class="default_button border_radius" name="get_scores_stop_button" value="Stop"');
         d.writeln('    onClick=get_scores_auto_refresh(document,"stop");document.location.href="fp_postseason_form.html";>');
      }
      d.writeln('</td>');
      d.writeln('</tr>');
      d.writeln('<tr><td class="no_border" style="font-size: 2pt"><br></td></tr>');
   }
   d.writeln('<tr align=center>');
   d.writeln('<td nowrap class="no_border">');
   if (mode == "picks")
   {
      d.writeln('<input type="button" class="default_button border_radius" name="calculate_scores_button" value="Calculate Player Scores"');
      d.writeln('    onClick="calculate_postseason_scores(document);return true;">');
      d.writeln('&nbsp;');
      d.writeln('<input type="button" class="default_button border_radius" name="clear_scores_button" value="Clear Scores"');
      d.writeln('    onClick="clear_scores(document);return true;">');
      d.writeln('&nbsp;');
   }
   d.writeln('<select class="default_select border_radius" name="order_by_menu" size=1');
   d.writeln('        onChange="change_order(document);return true;">');
   if (order_by == "players")
   {
      d.writeln('   <option selected value="players">Order By Player');
   }
   else
   {
      d.writeln('   <option value="players">Order By Player');

   }
   for (var wi = 1; wi <= week; wi++)
   {
      if (order_by == "week_"+wi+"_scores")
      {
         d.writeln('   <option selected value="week_'+wi+'_scores">Order By Week '+wi+' Score');
      }
      else
      {
         d.writeln('   <option value="week_'+wi+'_scores">Order By Week '+wi+' Score');
      }
   }
   if (order_by == "overall_scores")
   {
      d.writeln('   <option selected value="overall_scores">Order By Overall Score');   }
   else
   {
      d.writeln('   <option value="overall_scores">Order By Overall Score');
   }
   d.writeln('</select>');
   d.writeln('&nbsp;');
   if (form_view == "expanded")
   {
      d.writeln('<input type="button" class="default_button border_radius" name="view_button" value="Hide Picks"');
   }
   else
   {
      d.writeln('<input type="button" class="default_button border_radius" name="view_button" value="Show Picks"');
   }
   d.writeln('    onClick="change_view(document);return true;">');
   d.writeln('&nbsp;');
   d.writeln('<input type="button" class="default_button border_radius" name="close_button" value="Close"');
   d.writeln('    onClick="javascript:window.top.close();">');
   d.writeln('</td>');
   d.writeln('</tr>');
   d.writeln('');

   d.writeln('</table>');
   d.writeln('');

   d.writeln('</form>');
   d.writeln('');

   d.writeln('</center>');
   d.writeln('');

   if (mode == "picks")
   {
      if (window.top.gv.get_scores_timer != null)
      {
         clearInterval(window.top.gv.get_scores_timer);
      }

      if (window.top.gv.get_scores_state == "on")
      {
         window.top.gv.get_scores_timer = setInterval('get_nfl_scores(document,false,"");',10000);
      }
   }

   d.writeln('');

   d.writeln('</body>');
   d.writeln('');

   d.writeln('</html>');

   d.getElementById("postseason_table").scrollIntoView({block: "start", inline: "start"});

   adjust_mobile_viewport_height(d,"postseason");

   d.close();

   return true;
}


function build_regular_season_form()
{
   if (check_for_opener() == false)
   {
      window.top.close();

      return false;
   }

   var best_mn_points_delta          = 1000;
   var best_outcome_tooltip          = "&quot;Best Outcome&quot; will figure out the best possible outcome for the selected Player.  Look under &quot;FORMS:  Picks&quot; on the Help page for more information.";
   var bullet_color                  = "";
   var color_black                   = "black";
   var color_red                     = "red";
   var document_heading              = "";
   var duplicates                    = 0;
   var form_view                     = window.top.gv.form_view;
   var game_state                    = "at";
   var input_tag_class               = "";
   var home_team_possession_flag     = "";
   var max_number_of_rs_games        = window.top.gv.max_number_of_rs_games;
   var mn_points_delta_string        = "";
   var mn_points_string              = " ";
   var mode                          = window.top.gv.mode;
   var mode_string                   = "";
   var order_by                      = window.top.gv.order_by;
   var player_colspan                = 3;
   var rs_players                    = window.top.gv.rs_players;
   var number_of_rs_players          = rs_players.length;
   var number_of_rs_weeks            = window.top.gv.number_of_rs_weeks;
   var tie_breaker_needed            = false;
   var unaltered_week                = 0;
   var victors                       = "";
   var visiting_team_possession_flag = "";
   var week                          = window.top.gv.current_input_week;
   var winners                       = "";

   if ( (mode == "summary") || (mode == "summary_archive") )
   {
      build_regular_season_summary();
      return true;
   }

   if (mode == "picks")
   {
      mode_string             = "Picks";
      prelim_possession_teams = window.top.gv.prelim_possession_teams;
      prelim_red_zone_flags   = window.top.gv.prelim_red_zone_flags;
      victors                 = window.top.gv.prelim_victors;
      week                    = week - 1;
      winners                 = window.top.gv.prelim_winners;
   }
   else if (mode == "results")
   {
      mode_string = "Results";
      week        = week - 2;

      if (window.top.gv.games_over == true) week = week + 1;
   }
   else if (mode == "weekly_results_archive")
   {
      max_number_of_rs_games = 16;
      mode_string            = "Results";
      number_of_rs_weeks     = window.top.gv.all_home_teams.length;
      week                   = number_of_rs_weeks;

      window.top.gv.home_scores     = Array(max_number_of_rs_games).fill("");
      window.top.gv.visiting_scores = Array(max_number_of_rs_games).fill("");
   }

   if (week <  1)                 week =  1;
   if (week > number_of_rs_weeks) week = number_of_rs_weeks;

   // Override "week" if the user selected a "week" from the results form.

   unaltered_week = week;

   if (window.top.gv.selected_week > 0) week = window.top.gv.selected_week;

   // Declare some more variables

   var home_scores           = window.top.gv.home_scores;
   var home_teams            = window.top.gv.all_home_teams[week-1];
   var visiting_scores       = window.top.gv.visiting_scores;
   var visiting_teams        = window.top.gv.all_visiting_teams[week-1];
   var open_date             = window.top.gv.all_open_dates[week-1];
   var picks                 = all_picks[week-1];
   var weights               = all_weights[week-1];
   var mn_points             = all_mn_points[week-1];
   var actual_mn_points      = all_actual_mn_points[week-1];
   var in_progress_mn_points = 0;

   if ( (mode == "results") || (mode == "weekly_results_archive") )
   {
      winners = all_winners[week-1];
   }

   var high_score         = 0;
   var high_score_count   = 0;
   var number_of_rs_games = home_teams.length;
   var max_scores         = Array(max_number_of_rs_games).fill().map((_,i) => (max_number_of_rs_games)*(max_number_of_rs_games+1)/2-(i-max_number_of_rs_games)*(i-max_number_of_rs_games+1)/2, max_number_of_rs_games);
   var max_score          = max_scores[number_of_rs_games-1];
   var mn_points_delta    = Array(number_of_rs_players).fill("N/A");
   var player_index       = Array(number_of_rs_players).fill().map((_,i) => i);  // Sets player_index = [0,1,2,3,4,5,6,7,8,9,10,11]
   var ranks              = Array(number_of_rs_players).fill(1);
   var ranks_adjust       = Array(number_of_rs_players).fill(0);
   var scores             = Array(number_of_rs_players).fill(max_score);
   var sorted_scores      = Array(number_of_rs_players).fill(1);

   // See above:  Assuming max_number_of_rs_games = 16, max_scores = [16,31,45,58,70,81,91,100,108,115,121,126,130,133,135,136]

   if (window.top.gv.mn_points_entered > 0)
   {
      // Override actual_mn_points with points entered on the picks form.

      actual_mn_points = window.top.gv.mn_points_entered;
   }

   in_progress_mn_points = parseInt(home_scores[number_of_rs_games-1].replace(/&nbsp;/g,"")) + parseInt(visiting_scores[number_of_rs_games-1].replace(/&nbsp;/g,""));

   if (isNaN(in_progress_mn_points) == true) in_progress_mn_points = 0;

   if (in_progress_mn_points > 0)
   {
      // Override actual_mn_points with actual Total Points from get_nfl_scores.

      actual_mn_points = in_progress_mn_points;
   }

   if (form_view == "expanded")
   {
      player_colspan = 3;
   }
   else
   {
      player_colspan = 1;
   }

   // Build document heading.

   if (mode == "picks")
   {
      document_heading = "Regular Season - Week " + week + " Picks";
   }
   else if (mode == "results")
   {
      document_heading = "Regular Season - Week " + week + " Results";
   }
   else if (mode == "weekly_results_archive")
   {
      document_heading = window.top.gv.archive_year + " Regular Season Weekly Results";
   }

   // Calculate scores.

   for (var i = 1; i <= number_of_rs_games; i++)
   {
      // Determine if any game from get_nfl_scores has ended in a tie.

      for (var j = 1; j <= number_of_rs_games; j++)
      {
         if ( (visiting_teams[i-1] == victors[j-1]) || (home_teams[i-1] == victors[j-1]) )
         {
            if (visiting_scores[i-1] == home_scores[i-1]) winners[i-1] = "Tie";
         }
      }

      // Continue calculating scores.

      for (var ii = 1; ii <= number_of_rs_players; ii++)
      {
         if (picks[ii-1].length > 0)
         {
            if ( (winners[i-1] != "0") && (picks[ii-1][i-1] != winners[i-1]) )
            {
               scores[ii-1] = scores[ii-1] - weights[ii-1][i-1];
            }
         }
         else
         {
            scores[ii-1] = 0;
         }
      }
   }

   for (var i = 1; i <= number_of_rs_players; i++)
   {
      sorted_scores[i-1] = scores[i-1];
   }

   sorted_scores.sort(function(sorted_scores,b){return sorted_scores-b;});
   sorted_scores.reverse();

   // Determine how many players have the high score and calculate their Total Points delta.
 
   high_score       = sorted_scores[0];
   high_score_count = 0;

   for (var i = 1; i <= number_of_rs_players; i++)
   {
      if (scores[i-1] == high_score)
      {
         high_score_count++;

         mn_points_delta[i-1] = mn_points[i-1] - actual_mn_points;
      }
   }

   // If more than one player has the high score, try to break the tie using using their Total Points delta.

   if (high_score_count > 1)
   {
      tie_breaker_needed = true;

      // If the winner of at least one game is not known, then there's no need to break the tie.

      for (var i = 0; i < number_of_rs_games; i++)
      {
         if ((winners[i] != "H") && (winners[i] != "V") && (winners[i] != "Tie"))
         {
            tie_breaker_needed = false;
         }
      }

      // If needed, attempt to break the tie if actual Total Points are known.

      if ( (tie_breaker_needed == true) && (actual_mn_points > 0) )
      {
         // Build the string for dislaying the actual Total Points on the webpage.

         mn_points_string = actual_mn_points + "&nbsp;&nbsp";

         // Determine the best Total Points delta (difference between best prediction and actual).

         best_mn_points_delta = 1000;

         for (var i = 1; i <= number_of_rs_players; i++)
         {
            if (mn_points_delta[i-1] != "N/A")
            {
               if ( Math.abs(mn_points_delta[i-1]) < Math.abs(best_mn_points_delta) )
               {
                  best_mn_points_delta = mn_points_delta[i-1];
               }
               else if ( Math.abs(mn_points_delta[i-1]) == Math.abs(best_mn_points_delta) )
               {
                  if (mn_points_delta[i-1] < best_mn_points_delta)
                  {
                     best_mn_points_delta = mn_points_delta[i-1];
                  }
               }
            }
         }

         // Determine how many players have the high score and the same Total Points delta.

         high_score_count = 0;

         for (var i = 1; i <= number_of_rs_players; i++)
         {
            if ( (mn_points_delta[i-1] != "N/A") && (mn_points_delta[i-1] == best_mn_points_delta) )
            {
               high_score_count++;
            }
         }

         // Adjust the ranks of the players who have the high score but don't have the best Total Points delta.

         for (var i = 1; i <= number_of_rs_players; i++)
         {
            if ((scores[i-1] == high_score) && (mn_points_delta[i-1] != best_mn_points_delta))
            {
               ranks_adjust[i-1] = high_score_count; 
            }
         }
      }
   }

   // Calculate ranks.

   for (var i = 1; i <= number_of_rs_players; i++)
   {
      for (var ii = 1; ii <= number_of_rs_players; ii++)
      {
         if (scores[i-1] == sorted_scores[ii-1])
         {
            ranks[i-1] = ii + ranks_adjust[i-1];
            break;
         }
      }
   }

   // Calculate player index for order by players or scores

   for (var i = 1; i <= number_of_rs_players; i++)
   {
      if (order_by == "players")
      {
         player_index[i-1] = i-1;
      }
      else
      {
         duplicates = 0;

         for (var ii = 1; ii <= number_of_rs_players; ii++)
         {
            if (i == ranks[ii-1])
            {
               player_index[(i+duplicates)-1] = ii-1;

               duplicates++;
            }
         }

         i = i + duplicates - 1;
      }
   }

   document.open();

   var d = document;

   d.writeln('<html>');
   d.writeln('');

   d.writeln('<head>');
   d.writeln('   <title>NFL Football Pool</title>');
   d.writeln('   <style type="text/css">');
   d.writeln('   <!--');
   d.writeln('      TD              {border-style:        solid;');
   d.writeln('                       border-color:    lightgray;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    1px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .b3_border      {border: 3px solid    black}');
   d.writeln('      .no_border      {border-style:        solid;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    0px;');
   d.writeln('                       border-bottom-width:   0px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .bb1_border     {border-style:        solid;');
   d.writeln('                       border-color:        black;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    0px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .bb2_border     {border-style:        solid;');
   d.writeln('                       border-color:        black;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    0px;');
   d.writeln('                       border-bottom-width:   2px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .br2_border     {border-style:        solid;');
   d.writeln('                       border-color:        black;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    2px;');
   d.writeln('                       border-bottom-width:   0px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .br2_bb1_border {border-style:        solid;');
   d.writeln('                       border-color: white black black white;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    2px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .br2_bb2_border {border-style:        solid;');
   d.writeln('                       border-color: white black black white;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    2px;');
   d.writeln('                       border-bottom-width:   2px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .br2_gb1_border {border-style:        solid;');
   d.writeln('                       border-color: white black lightgray white;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    2px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .bt2_border     {border-style:        solid;');
   d.writeln('                       border-color:        black;');
   d.writeln('                       border-top-width:      2px;');
   d.writeln('                       border-right-width:    0px;');
   d.writeln('                       border-bottom-width:   0px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .bt2_br2_border {border-style:        solid;');
   d.writeln('                       border-color: black black white white;');
   d.writeln('                       border-top-width:      2px;');
   d.writeln('                       border-right-width:    2px;');
   d.writeln('                       border-bottom-width:   0px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .bt2_gr1_border {border-style:        solid;');
   d.writeln('                       border-color: black lightgray white white;');
   d.writeln('                       border-top-width:      2px;');
   d.writeln('                       border-right-width:    1px;');
   d.writeln('                       border-bottom-width:   0px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .gb1_border     {border-style:        solid;');
   d.writeln('                       border-color:    lightgray;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    0px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .gr1_border     {border-style:        solid;');
   d.writeln('                       border-color:    lightgray;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    1px;');
   d.writeln('                       border-bottom-width:   0px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .gr1_bb1_border {border-style:        solid;');
   d.writeln('                       border-color: white lightgray black white;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    1px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .gr1_bb2_border {border-style:        solid;');
   d.writeln('                       border-color: white lightgray black white;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    1px;');
   d.writeln('                       border-bottom-width:   2px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('   -->');
   d.writeln('   </style>');
   d.writeln('</head>');
   d.writeln('');

   d.writeln('<body>');
   d.writeln('');
   d.writeln('');

   d.writeln('<script language="JavaScript">');
   d.writeln('');
   d.writeln('function build_player_name(player_menu_index,long_description)');
   d.writeln('{');
   d.writeln('   if ( (player_menu_index < 0) || (player_menu_index > window.top.gv.rs_players.length) )');
   d.writeln('   {');
   d.writeln('      player_menu_index = window.top.gv.player_index;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (player_menu_index > 0)');
   d.writeln('   {');
   d.writeln('      if (long_description == true)');
   d.writeln('      {');
   d.writeln('         return window.top.gv.rs_players_description[player_menu_index-1]+" ("+window.top.gv.rs_players[player_menu_index-1]+")";');
   d.writeln('      }');
   d.writeln('      else');
   d.writeln('      {');
   d.writeln('         return window.top.gv.rs_players[player_menu_index-1];');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('   else');
   d.writeln('   {');
   d.writeln('      return "";');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   return "";  // Should never get here.');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function calculate_prelim_scores(document)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   clear_get_scores_data();');
   d.writeln('');
   d.writeln('   get_selected_winners(document);');
   d.writeln('');
   d.writeln('   document.location.href = "fp_regular_season_form.html";');
   d.writeln('');
   d.writeln('   return true;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function change_order(document)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (window.top.gv.order_by == "players")');
   d.writeln('   {');
   d.writeln('      window.top.gv.order_by = "scores";');
   d.writeln('   }');
   d.writeln('   else if (window.top.gv.order_by == "scores")');
   d.writeln('   {');
   d.writeln('      window.top.gv.order_by = "players";');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (window.top.gv.mode == "weekly_results_archive")');
   d.writeln('   {');
   d.writeln('      document.location.href = "fp_forms_"+window.top.gv.archive_year+".html";');
   d.writeln('   }');
   d.writeln('   else');
   d.writeln('   {');
   d.writeln('      var refresh_scores = window.top.gv.refresh_scores;'); // Need to save refresh_scores because "clear_get_scores_data" will reset it.
   d.writeln('');
   d.writeln('      clear_get_scores_data();');
   d.writeln('');
   d.writeln('      if (window.top.gv.get_scores_state == "on" && refresh_scores == true)');
   d.writeln('      {');
   d.writeln('         get_nfl_scores(document,false,"");');
   d.writeln('      }');
   d.writeln('      else');
   d.writeln('      {');
   d.writeln('         document.location.href = "fp_regular_season_form.html";');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   return true;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function change_view(document)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (window.top.gv.form_view == "expanded")');
   d.writeln('   {');
   d.writeln('      window.top.gv.form_view = "compact";');
   d.writeln('   }');
   d.writeln('   else if (window.top.gv.form_view == "compact")');
   d.writeln('   {');
   d.writeln('      window.top.gv.form_view = "expanded";');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (window.top.gv.mode == "weekly_results_archive")');
   d.writeln('   {');
   d.writeln('      document.location.href = "fp_forms_"+window.top.gv.archive_year+".html";');
   d.writeln('   }');
   d.writeln('   else');
   d.writeln('   {');
   d.writeln('      var refresh_scores = window.top.gv.refresh_scores;'); // Need to save refresh_scores because "clear_get_scores_data" will reset it.
   d.writeln('');
   d.writeln('      clear_get_scores_data();');
   d.writeln('');
   d.writeln('      if (window.top.gv.get_scores_state == "on" && refresh_scores == true)');
   d.writeln('      {');
   d.writeln('         get_nfl_scores(document,false,"");');
   d.writeln('      }');
   d.writeln('      else');
   d.writeln('      {');
   d.writeln('         document.location.href = "fp_regular_season_form.html";');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   return true;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function change_week(document)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   var results             = document.fp_results;');
   d.writeln('   var selected_week_index = 0;');
   d.writeln('   var selected_week       = 0;');
   d.writeln('');
   d.writeln('');
   d.writeln('   for (var i = 0; i < results.elements.length; i++)');
   d.writeln('   {');
   d.writeln('      if (results.elements[i].name == "selected_week_menu")');
   d.writeln('      {');
   d.writeln('         selected_week               = results.elements[i];');
   d.writeln('         selected_week_index         = selected_week.selectedIndex;');
   d.writeln('         window.top.gv.selected_week = selected_week.options[selected_week_index].value;');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (window.top.gv.mode == "weekly_results_archive")');
   d.writeln('   {');
   d.writeln('      document.location.href = "fp_forms_"+window.top.gv.archive_year+".html";');
   d.writeln('   }');
   d.writeln('   else');
   d.writeln('   {');
   d.writeln('      document.location.href = "fp_regular_season_form.html";');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   return true;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function clear_get_scores_data()');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   // Clear information set by "Get NFL Scores".');
   d.writeln('');
   d.writeln('   for (var i = 0; i < '+number_of_rs_games+'; i++)');
   d.writeln('   {');
   d.writeln('      window.top.gv.home_scores[i]             = "";');
   d.writeln('      window.top.gv.prelim_game_states[i]      = "at";');
   d.writeln('      window.top.gv.prelim_possession_teams[i] = "";');
   d.writeln('      window.top.gv.prelim_red_zone_flags[i]   = false;');
   d.writeln('      window.top.gv.prelim_victors[i]          = "";');
   d.writeln('      window.top.gv.visiting_scores[i]         = "";');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   window.top.gv.refresh_scores = false;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function clear_winners(document)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   clear_get_scores_data();');
   d.writeln('');
   d.writeln('   for (var i = 0; i < '+number_of_rs_games+'; i++)');
   d.writeln('   {');
   d.writeln('      window.top.gv.prelim_winners[i] = "0";');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   document.location.href = "fp_regular_season_form.html";');
   d.writeln('');
   d.writeln('   return true;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function determine_best_outcome(document)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      // Make sure cursor is not set to "wait".');
   d.writeln('');
   d.writeln('      document.body.style.cursor = "auto";');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   var abort                   = false;');
   d.writeln('   var all_winners_specified   = true;');
   d.writeln('   var binary_winners          = "";');
   d.writeln('   var games_won               = 0;');
   d.writeln('   var max_opponent_score      = 0;');
   d.writeln('   var max_score_difference    = -1000;');
   d.writeln('   var most_games_won          = 0;');
   d.writeln('   var name_index              = 0;');
   d.writeln('   var name_menu               = 0;');
   d.writeln('   var number_of_rs_games      = 0;');
   d.writeln('   var number_of_rs_players    = window.top.gv.rs_players.length;');
   d.writeln('   var number_of_rs_weeks      = window.top.gv.number_of_rs_weeks;');
   d.writeln('   var opponent_score          = 0;');
   d.writeln('   var picks                   = "";');
   d.writeln('   var score_difference        = 0;');
   d.writeln('   var selected_opponent_index = window.top.gv.opponent_index-1;');
   d.writeln('   var selected_player_index   = window.top.gv.player_index-1;');
   d.writeln('   var selected_player_score   = 0;');
   d.writeln('   var selected_player_win     = false;');
   d.writeln('   var skip_iteration          = false;');
   d.writeln('   var specified_winner_count  = 0;');
   d.writeln('   var temp_name               = "";');
   d.writeln('   var week                    = window.top.gv.current_input_week - 1;');
   d.writeln('   var weights                 = "";');
   d.writeln('');
   d.writeln('');
   d.writeln('   // Adjust week, in case it is invalid for some reason.');
   d.writeln('');
   d.writeln('   if (week <  1)                 week = 1;');
   d.writeln('   if (week > number_of_rs_weeks) week = number_of_rs_weeks;');
   d.writeln('');
   d.writeln('   // Assign number_of_rs_games, picks, and weights based on week.  Create arrays based on number_of_rs_games.');
   d.writeln('');
   d.writeln('   number_of_rs_games = window.top.gv.all_home_teams[week-1].length;');
   d.writeln('   picks              = all_picks[week-1];');
   d.writeln('   weights            = all_weights[week-1];');
   d.writeln('');
   d.writeln('   var best_winners            = Array(number_of_rs_games).fill("");');
   d.writeln('   var selected_player_picks   = Array(number_of_rs_games).fill("");');
   d.writeln('   var selected_player_weights = Array(number_of_rs_games).fill("");');
   d.writeln('   var selected_winners        = Array(number_of_rs_games).fill("");');
   d.writeln('   var winners_iteration       = Array(number_of_rs_games).fill("");');
   d.writeln('');
   d.writeln('   // Get selected winners from the picks form.');
   d.writeln('');
   d.writeln('   all_winners_specified = true;');
   d.writeln('');
   d.writeln('   get_selected_winners(document);');
   d.writeln('');
   d.writeln('   for (var game_index = 0; game_index < number_of_rs_games; game_index++)');
   d.writeln('   {');
   d.writeln('      selected_winners[game_index] = window.top.gv.prelim_winners[game_index];');
   d.writeln('');
   d.writeln('      if ( (selected_winners[game_index] == "H") || (selected_winners[game_index] == "V") || (selected_winners[game_index] == "Tie") )');
   d.writeln('      {');
   d.writeln('         if (selected_winners[game_index] != "Tie") specified_winner_count++;');
   d.writeln('      }');
   d.writeln('      else');
   d.writeln('      {');
   d.writeln('         all_winners_specified = false;');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   // Validate selections before proceeding.');
   d.writeln('');
   d.writeln('   if (all_winners_specified == true)');
   d.writeln('   {');
   d.writeln('      alert("\\"Best Outcome\\" cannot be performed if winners have already been specified for every game.");');
   d.writeln('');
   d.writeln('      abort = true;');
   d.writeln('   }');
   d.writeln('   else if (selected_player_index < 0)');
   d.writeln('   {');
   d.writeln('      alert("Select a player for \\"Best Outcome\\".");');
   d.writeln('');
   d.writeln('      window.top.gv.focus_element(document.fp_results.player_name_menu);');
   d.writeln('');
   d.writeln('      abort = true;');
   d.writeln('   }');
   d.writeln('   else if (selected_player_index == selected_opponent_index)');
   d.writeln('   {');
   d.writeln('      alert("Player and opponent for \\"Best Outcome\\" cannot be the same.");');
   d.writeln('');
   d.writeln('      window.top.gv.focus_element(document.fp_results.opponent_name_menu);');
   d.writeln('');
   d.writeln('      abort = true;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (abort == true)');
   d.writeln('   {');
   d.writeln('      // Make sure cursor is not set to "wait".');
   d.writeln('');
   d.writeln('      document.body.style.cursor = "auto";');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   clear_get_scores_data();');
   d.writeln('');
   d.writeln('   // Assign selected_player_picks and selected_player_weights.');
   d.writeln('');
   d.writeln('   for (var game_index = 0; game_index < number_of_rs_games; game_index++)');
   d.writeln('   {');
   d.writeln('      selected_player_picks[game_index]   = picks[selected_player_index][game_index];');
   d.writeln('      selected_player_weights[game_index] = weights[selected_player_index][game_index];');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   // Loop through for every possible win/loss combination for those games that do not already have a winner specified.');
   d.writeln('   // Games can end in a "Tie", but were are not going to take a "Tie" into account, unless the user specified a "Tie".');
   d.writeln('');
   d.writeln('   for (var i = 0; i < Math.pow(2,number_of_rs_games); i++)');
   d.writeln('   {');
   d.writeln('      // Convert i into a binary string.');
   d.writeln('');
   d.writeln('      binary_winners = i.toString(2);'); 
   d.writeln('');
   d.writeln('      // Add leading zeros as needed to get the length to equal sixteen.');
   d.writeln('');
   d.writeln('      for (var j = (number_of_rs_games-binary_winners.length); j > 0; j--)');
   d.writeln('      {');
   d.writeln('         binary_winners = "0" + binary_winners;');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      // Assign the winners for this iteration based on the binary_winners string.');
   d.writeln('');
   d.writeln('      for (var game_index = 0; game_index < number_of_rs_games; game_index++)');
   d.writeln('      {');
   d.writeln('         if (binary_winners.slice(game_index,game_index+1) == 0)');
   d.writeln('         {');
   d.writeln('            winners_iteration[game_index] = "H";');
   d.writeln('         }');
   d.writeln('         else');
   d.writeln('         {');
   d.writeln('            winners_iteration[game_index] = "V";');
   d.writeln('         }');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      // Set a flag to skip this iteration if a game outcome in this iteration disagrees with a game outcome specified by the user.');
   d.writeln('');
   d.writeln('      skip_iteration = false;');
   d.writeln('');
   d.writeln('      for (var game_index = 0; game_index < number_of_rs_games; game_index++)');
   d.writeln('      {');
   d.writeln('         if ( (selected_winners[game_index] == "H") || (selected_winners[game_index] == "V") )');
   d.writeln('         {');
   d.writeln('            if (winners_iteration[game_index] != selected_winners[game_index])');
   d.writeln('            {');
   d.writeln('               skip_iteration = true;');
   d.writeln('               break;');
   d.writeln('            }');
   d.writeln('         }');
   d.writeln('         else if (selected_winners[game_index] == "Tie")');
   d.writeln('         {');
   d.writeln('            winners_iteration[game_index] = selected_winners[game_index];');
   d.writeln('         }');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      if (skip_iteration == false)');
   d.writeln('      {');
   d.writeln('         // Determine the best outcome for the selected player.');
   d.writeln('');
   d.writeln('         games_won          = 0;');
   d.writeln('         max_opponent_score = 0;');
   d.writeln('         games_won          = 0;');
   d.writeln('         score_difference   = -1000;');
   d.writeln('');
   d.writeln('         selected_player_score = calculate_score(selected_player_picks,selected_player_weights,winners_iteration,number_of_rs_games)');
   d.writeln('');
   d.writeln('         for (var opponent_player_index = 0; opponent_player_index < number_of_rs_players; opponent_player_index++)');
   d.writeln('         {');
   d.writeln('            // Do not compare scores if this iteration of opponent_player_index happens to be the selected_player_index.');
   d.writeln('');
   d.writeln('            if (opponent_player_index != selected_player_index)');
   d.writeln('            {');
   d.writeln('               // Compare scores only if no specific opponent was selected or if a specific opponent was selected and this iteration of opponent_player_index matches the specific opponent.');
   d.writeln('');
   d.writeln('               if ( (selected_opponent_index < 0) || (selected_opponent_index == opponent_player_index) )');
   d.writeln('               {');
   d.writeln('                  opponent_score     = calculate_score(picks[opponent_player_index],weights[opponent_player_index],winners_iteration,number_of_rs_games)');
   d.writeln('                  max_opponent_score = Math.max(max_opponent_score,opponent_score);');  
   d.writeln('                  score_difference   = selected_player_score-max_opponent_score;'); 
   d.writeln('               }');
   d.writeln('            }');
   d.writeln('         }');
   d.writeln('');
   d.writeln('         if (score_difference > max_score_difference)');
   d.writeln('         {');
   d.writeln('            max_score_difference = score_difference;');
   d.writeln('            most_games_won       = calculate_games_won(selected_player_picks,selected_player_weights,winners_iteration,number_of_rs_games);');
   d.writeln('');
   d.writeln('            // Set the winners to reflect the best win for the selected player.');
   d.writeln('');
   d.writeln('            for (var game_index = 0; game_index < number_of_rs_games; game_index++)');
   d.writeln('            {');
   d.writeln('               best_winners[game_index] = winners_iteration[game_index];');
   d.writeln('            }');
   d.writeln('         }');
   d.writeln('         else if (score_difference == max_score_difference)');
   d.writeln('         {');
   d.writeln('            games_won = calculate_games_won(selected_player_picks,selected_player_weights,winners_iteration,number_of_rs_games);');
   d.writeln('');
   d.writeln('            if (games_won > most_games_won)');
   d.writeln('            {');   
   d.writeln('               most_games_won = games_won;');
   d.writeln('');
   d.writeln('               // Set the winners to reflect the best win for the selected player.');
   d.writeln('');
   d.writeln('               for (var game_index = 0; game_index < number_of_rs_games; game_index++)');
   d.writeln('               {');
   d.writeln('                  best_winners[game_index] = winners_iteration[game_index];');
   d.writeln('               }');
   d.writeln('            }');
   d.writeln('         }');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   // Assign the preliminary winners to the best winners so when we redisplay the picks form it will reflect the best outcome for the selected player.');
   d.writeln('');
   d.writeln('   for (var game_index = 0; game_index < number_of_rs_games; game_index++)');
   d.writeln('   {');
   d.writeln('      window.top.gv.prelim_winners[game_index] = best_winners[game_index];');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   // Redisplay the picks form with the win/loss combination that reflects the best outcome for the selected player.');
   d.writeln('');
   d.writeln('   document.location.href = "fp_regular_season_form.html";');
   d.writeln('');
   d.writeln('   // Make sure cursor is not set to "wait".');
   d.writeln('');
   d.writeln('   document.body.style.cursor = "auto";');
   d.writeln('');
   d.writeln('   return true;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function get_mn_points(document)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   var results   = document.fp_results;');
   d.writeln('   var mn_points = results.mn_points;');
   d.writeln('');
   d.writeln('');
   d.writeln('   if (mn_points == undefined) return true;');
   d.writeln('');
   d.writeln('   if (isNaN(mn_points.value) == true)');
   d.writeln('   {');
   d.writeln('      mn_points.value = window.top.gv.mn_points_entered;');
   d.writeln('      if (mn_points.value == 0) mn_points.value = " ";');
   d.writeln('      return true;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   // Allow "0" so that the user can clear the field.');
   d.writeln('');
   d.writeln('   if ( (mn_points.value < 0) || (mn_points.value > 999) )');
   d.writeln('   {');
   d.writeln('      mn_points.value = window.top.gv.mn_points_entered;');
   d.writeln('      if (mn_points.value == 0) mn_points.value = " ";');
   d.writeln('      return true;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   window.top.gv.mn_points_entered = mn_points.value;');
   d.writeln('');
   d.writeln('   return true;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function get_nfl_scores(document,display_dialog,command)');
   d.writeln('{');
   d.writeln('   var nfl_connection = null;');
   d.writeln('   var nfl_scores     = null;');
   d.writeln('   var nfl_scores_url = "site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";');
   d.writeln('   var request_url    = "https://www.scrappintwins.com/cors/" + nfl_scores_url + "?" + (new Date()).getTime();'); // scrappintwins.com provided by Dan M.
   d.writeln('   var user_message   = "\\"Get NFL Scores\\" failed.";');
   d.writeln('');
   d.writeln('');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (window.top.gv.get_scores_state == "on") user_message += "  \\"Auto Refresh\\" will be stopped."');
   d.writeln('');
   d.writeln('   // Get the NFL scores from the internet.');
   d.writeln('');
   d.writeln('   nfl_connection = new XMLHttpRequest();');
   d.writeln('');
   d.writeln('   nfl_connection.open("GET",request_url,true);');
   d.writeln('');
   d.writeln('   nfl_connection.onload = function(e)');
   d.writeln('   {');
   d.writeln('      if (nfl_connection.readyState === 4) // Is XMLHttpRequest complete?');
   d.writeln('      {');
   d.writeln('         if (nfl_connection.status === 200) // Was the XMLHttpRequest successful?');
   d.writeln('         {');
   d.writeln('            nfl_scores = nfl_connection.responseText;');
   d.writeln('');
   d.writeln('            process_nfl_scores(document,display_dialog,command,nfl_scores);');
   d.writeln('         }');
   d.writeln('         else // XMLHttpRequest was unsuccessful.');
   d.writeln('         {');
   d.writeln('            alert(user_message);');
   d.writeln('');
   d.writeln('            // Force Auto Refresh to be off and refresh the picks form.');
   d.writeln('');
   d.writeln('            get_scores_auto_refresh(document,"stop");');
   d.writeln('');
   d.writeln('            document.location.href="fp_regular_season_form.html";');
   d.writeln('         }');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      return;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   nfl_connection.onerror = function(e)');
   d.writeln('   {');
   d.writeln('      alert(user_message);');
   d.writeln('');
   d.writeln('      // Force Auto Refresh to be off and refresh the picks form.');
   d.writeln('');
   d.writeln('      get_scores_auto_refresh(document,"stop");');
   d.writeln('');
   d.writeln('      document.location.href="fp_regular_season_form.html";');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   };');
   d.writeln('');
   d.writeln('   nfl_connection.send(null);');
   d.writeln('');
   d.writeln('   return;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function get_scores_auto_refresh(document,command)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   clear_get_scores_data();');
   d.writeln('');
   d.writeln('   if (command == "start")');
   d.writeln('   {');
   d.writeln('      if (window.top.gv.get_scores_state == "off")');
   d.writeln('      {');
   d.writeln('         window.top.gv.get_scores_state = "on";');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('   else  // command must equal "stop".');
   d.writeln('   {;');
   d.writeln('      if (window.top.gv.get_scores_state == "on")');
   d.writeln('      {');
   d.writeln('         clearInterval(window.top.gv.get_scores_timer);');
   d.writeln('');
   d.writeln('         window.top.gv.get_scores_state = "off";');
   d.writeln('         window.top.gv.get_scores_timer = null;');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function get_selected_opponent(document)');
   d.writeln('{');
   d.writeln('   var opponent_menu            = document.fp_results.opponent_name_menu;');
   d.writeln('   var opponent_index           = opponent_menu.selectedIndex;');
   d.writeln('   window.top.gv.opponent_index = opponent_menu.options[opponent_index].value;');
   d.writeln('');
   d.writeln('   return true;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function get_selected_player(document)');
   d.writeln('{');
   d.writeln('   var player_menu            = document.fp_results.player_name_menu;');
   d.writeln('   var player_index           = player_menu.selectedIndex;');
   d.writeln('   window.top.gv.player_index = player_menu.options[player_index].value;');
   d.writeln('');
   d.writeln('   return true;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function get_selected_winners(document)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   var results        = document.fp_results;');
   d.writeln('   var winner_index   = 0;');
   d.writeln('   var winners_select = 0;');
   d.writeln('');
   d.writeln('');
   d.writeln('   for (var i = 0; i < '+number_of_rs_games+'; i++)');
   d.writeln('   {');
   d.writeln('      for (var j = 0; j < results.elements.length; j++)');
   d.writeln('      {');
   d.writeln('         if (results.elements[j].name == "winner"+(i+1))');
   d.writeln('         {');
   d.writeln('            winners_select                  = results.elements[j];');
   d.writeln('            winners_index                   = winners_select.selectedIndex;');
   d.writeln('            window.top.gv.prelim_winners[i] = winners_select.options[winners_index].value;');
   d.writeln('         }');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   return true;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function process_nfl_scores(document,display_dialog,command,nfl_scores)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   clear_get_scores_data();');
   d.writeln('');
   d.writeln('   window.top.gv.refresh_scores = true;');
   d.writeln('');
   d.writeln('   var game                   = "";');
   d.writeln('   var game_clock_integer     = "";');
   d.writeln('   var game_clock_string      = "";');
   d.writeln('   var game_list              = "";');
   d.writeln('   var game_state             = "";');
   d.writeln('   var game_status            = "game_not_started";');
   d.writeln('   var games_in_progress      = false;');
   d.writeln('   var home_score             = "";');
   d.writeln('   var home_team              = "";');
   d.writeln('   var home_team_id           = "";');
   d.writeln('   var home_teams             = "";');
   d.writeln('   var nfl_team_names         = ["49ers","Bears","Bengals","Bills","Broncos","Browns","Buccaneers","Cardinals","Chargers","Chiefs","Colts","Cowboys","Dolphins","Eagles","Falcons","Commanders","Giants","Jaguars","Jets","Lions","Packers","Panthers","Patriots","Raiders","Rams","Ravens","Saints","Seahawks","Steelers","Texans","Titans","Vikings"];');
   d.writeln('   var number_of_rs_games     = '+number_of_rs_games+';');
   d.writeln('   var possession_team        = "";');
   d.writeln('   var possession_teams_index = 0;');
   d.writeln('   var prelim_victors_index   = 0;');
   d.writeln('   var temp_string            = "";');
   d.writeln('   var user_message           = "";');
   d.writeln('   var visiting_score         = "";');
   d.writeln('   var visiting_team          = "";');
   d.writeln('   var visiting_team_id       = "";');
   d.writeln('   var visiting_teams         = "";');
   d.writeln('   var week                   = window.top.gv.current_input_week-1;');
   d.writeln('   var winning_teams_index    = 0;');
   d.writeln('   var winning_teams          = Array(number_of_rs_games).fill("");');
   d.writeln('');
   d.writeln('');
   d.writeln('   if (command != "Start")');
   d.writeln('   {');
   d.writeln('      command = "Get NFL Scores";');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (display_dialog == true)');
   d.writeln('   {');
   d.writeln('      user_message = "\\""+ command + "\\" will:\\n\\n";');
   d.writeln('      user_message = user_message + "   - Clear the winners on the Picks Form\\n";');
   d.writeln('      user_message = user_message + "   - Get all in progress and final scores from the internet\\n";');
   d.writeln('      user_message = user_message + "   - Populate the Picks Form using the scores from the internet";');
   d.writeln('      if (command == "Start")');
   d.writeln('      {');
   d.writeln('         user_message = user_message + "\\n   - Automatically update the Picks Form every 10 seconds\\n";');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      if (confirm(user_message) == false) return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   home_teams     = window.top.gv.all_home_teams[week-1];');
   d.writeln('   visiting_teams = window.top.gv.all_visiting_teams[week-1];');
   d.writeln('');
   d.writeln('   // Convert nfl_scores string to a JavaScript object.');
   d.writeln('');
   d.writeln('   nfl_scores = JSON.parse(nfl_scores);');
   d.writeln('');
   d.writeln('   // Get the game list pointer from nfl_scores.');
   d.writeln('');
   d.writeln('   game_list = nfl_scores.events;');
   d.writeln('');
   d.writeln('   // Loop through the game list and get information for each valid game.');
   d.writeln('');
   d.writeln('   for (var i = 0; i < game_list.length; i++)');
   d.writeln('   {');
   d.writeln('      // Get the game pointer from game_list.');
   d.writeln('');
   d.writeln('      game = game_list[i].competitions[0];');
   d.writeln('');
   d.writeln('      // Get the team names and scores.');
   d.writeln('');
   d.writeln('      if (game.competitors[0].homeAway == "home")');
   d.writeln('      {');
   d.writeln('         home_team    = game.competitors[0].team.name;');
   d.writeln('         home_team_id = game.competitors[0].id;');
   d.writeln('         home_score   = game.competitors[0].score - 0;');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      if (game.competitors[1].homeAway == "home")');
   d.writeln('      {');
   d.writeln('         home_team    = game.competitors[1].team.name;');
   d.writeln('         home_team_id = game.competitors[1].id;');
   d.writeln('         home_score   = game.competitors[1].score - 0;');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      if (game.competitors[0].homeAway == "away")');
   d.writeln('      {');
   d.writeln('         visiting_team    = game.competitors[0].team.name;');
   d.writeln('         visiting_team_id = game.competitors[0].id;');
   d.writeln('         visiting_score   = game.competitors[0].score - 0;');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      if (game.competitors[1].homeAway == "away")');
   d.writeln('      {');
   d.writeln('         visiting_team    = game.competitors[1].team.name;');
   d.writeln('         visiting_team_id = game.competitors[1].id;');
   d.writeln('         visiting_score   = game.competitors[1].score - 0;');
   d.writeln('      }');
   d.writeln('');
   d.writeln('      // Loop through this week\'s games.');
   d.writeln('');
   d.writeln('      for (var j = 0; j < number_of_rs_games; j++)');
   d.writeln('      {');
   d.writeln('         // If the home and visiting teams from the game information match one of this week\'s games, then get the game information.');
   d.writeln('');
   d.writeln('         if ( (home_team.toLowerCase() != home_teams[j].toLowerCase()) || (visiting_team.toLowerCase() != visiting_teams[j].toLowerCase()) )');
   d.writeln('         {');
   d.writeln('            // No match, so skip this game.');
   d.writeln('');
   d.writeln('            continue;');
   d.writeln('         }');
   d.writeln('');
   d.writeln('         // Determine the status and state of the current game.');
   d.writeln('');
   d.writeln('         if (game.status.type.state == "pre")');
   d.writeln('         {');
   d.writeln('            game_status = "game_not_started";');
   d.writeln('            game_state  = "";');
   d.writeln('         }');
   d.writeln('         else if (game.status.type.description == "Halftime")');
   d.writeln('         {');
   d.writeln('            game_status = "halftime";');
   d.writeln('            game_state  = "H";');
   d.writeln('         }');
   d.writeln('         else if (game.status.type.description == "Final")');
   d.writeln('         {');
   d.writeln('            game_status = "game_over";');
   d.writeln('            game_state  = "F";');
   d.writeln('');
   d.writeln('            if (game.status.period >= 5) game_state = "F OT";');
   d.writeln('         }');
   d.writeln('         else');
   d.writeln('         {');
   d.writeln('            game_status = "game_in_progress";');
   d.writeln('');
   d.writeln('            // Set the game state to the game quarter or overtime.');
   d.writeln('');
   d.writeln('            if (game.status.period == 1) game_state = "1st";');
   d.writeln('            if (game.status.period == 2) game_state = "2nd";');
   d.writeln('            if (game.status.period == 3) game_state = "3rd";');
   d.writeln('            if (game.status.period == 4) game_state = "4th";');
   d.writeln('            if (game.status.period >= 5) game_state = "OT";');
   d.writeln('');
   d.writeln('            // Set the game clock string.');
   d.writeln('');
   d.writeln('            game_clock_string = game.status.displayClock;');
   d.writeln('');
   d.writeln('            // Determine if there are two minutes or less to play in the 2nd quarter, 4th quarter, or overtime.');
   d.writeln('');
   d.writeln('            if ( (game_state.substring(0,1) == "2") || (game_state.substring(0,1) == "4") || (game_state.substring(0,1) == "O") )');
   d.writeln('            {');
   d.writeln('               if (game_clock_string != "")');
   d.writeln('               {');
   d.writeln('                  game_clock_integer = game_clock_string;');
   d.writeln('                  game_clock_integer = game_clock_integer.replace(/:/g,"");  // Remove the ":".');
   d.writeln('                  game_clock_integer = game_clock_integer - 0;               // Make sure game_clock is an integer.');
   d.writeln('');
   d.writeln('                  if (game_clock_integer <= 200)');
   d.writeln('                  {');
   d.writeln('                     // Set the color of the game clock string to red to indicate two minutes or less to go.');
   d.writeln('');
   d.writeln('                     game_clock_string = "<font color=red>" + game_clock_string + "</font>";');
   d.writeln('                  }');
   d.writeln('               }');
   d.writeln('            }');
   d.writeln('');
   d.writeln('            // Remove leading zero in the game_clock_string.');
   d.writeln('');
   d.writeln('            if (game_clock_string.charAt(game_clock_string.indexOf(":")-2) == "0")');
   d.writeln('            {');
   d.writeln('               temp_string  = game_clock_string.substring(0,game_clock_string.indexOf(":")-2);');
   d.writeln('               temp_string += game_clock_string.substring(game_clock_string.indexOf(":")-1);');
   d.writeln('');
   d.writeln('               game_clock_string = temp_string;');
   d.writeln('            }');
   d.writeln('');
   d.writeln('            // Add the game clock to the game state.');
   d.writeln('');
   d.writeln('            game_state = game_state + " " + game_clock_string;');
   d.writeln('');
   d.writeln('            // Add the down, yards to go, and yard line to the game state.');
   d.writeln('');
   d.writeln('            if (game.situation.downDistanceText != undefined) game_state = game_state + "<br><font size=-2>" + game.situation.downDistanceText + "</font>";');
   d.writeln('');
   d.writeln('            // Determine which team has possession of the ball and if they\'re in the red zone.');
   d.writeln('');
   d.writeln('            possession_team = "";');
   d.writeln('');
   d.writeln('            if (game.situation.possession != undefined)');
   d.writeln('            {');
   d.writeln('               if (game.situation.possession == home_team_id    ) possession_team = home_team;');
   d.writeln('               if (game.situation.possession == visiting_team_id) possession_team = visiting_team;');
   d.writeln('            }');
   d.writeln('');
   d.writeln('            if (possession_team != "")');
   d.writeln('            {');
   d.writeln('               window.top.gv.prelim_possession_teams[possession_teams_index] = possession_team;');
   d.writeln('');
   d.writeln('               if ( (game.situation.isRedZone != undefined) && (game.situation.isRedZone == true) )');
   d.writeln('               {');
   d.writeln('                  window.top.gv.prelim_red_zone_flags[possession_teams_index] = true;');
   d.writeln('               }');
   d.writeln('');
   d.writeln('               possession_teams_index++;');
   d.writeln('            }');
   d.writeln('         }');
   d.writeln('');
   d.writeln('         //JL alert(":"+visiting_team+":"+visiting_score+":"+home_team+":"+home_score+":"+game_status+":"+game_state);');
   d.writeln('');
   d.writeln('         // If the current game is over or in progress, determine who the winning team is and save it.');
   d.writeln('');
   d.writeln('         if (game_status != "game_not_started")');
   d.writeln('         {');
   d.writeln('            games_in_progress = true;');
   d.writeln('');
   d.writeln('            if (visiting_score > home_score)');
   d.writeln('            {');
   d.writeln('               winning_teams[winning_teams_index] = visiting_team;');
   d.writeln('');
   d.writeln('               winning_teams_index++;');
   d.writeln('');
   d.writeln('               if (game_status == "game_over")');
   d.writeln('               {');
   d.writeln('                  window.top.gv.prelim_victors[prelim_victors_index] = visiting_team;');
   d.writeln('');
   d.writeln('                  prelim_victors_index++;');
   d.writeln('               }');
   d.writeln('            }');
   d.writeln('            else if (home_score > visiting_score)');
   d.writeln('            {');
   d.writeln('               winning_teams[winning_teams_index] = home_team;');
   d.writeln('');
   d.writeln('               winning_teams_index++;');
   d.writeln('');
   d.writeln('               if (game_status == "game_over")');
   d.writeln('               {');
   d.writeln('                  window.top.gv.prelim_victors[prelim_victors_index] = home_team;');
   d.writeln('');
   d.writeln('                  prelim_victors_index++;');
   d.writeln('               }');
   d.writeln('            }');
   d.writeln('            else if ( (home_score == visiting_score) && (game_status == "game_over") )');
   d.writeln('            {');
   d.writeln('               // Must put either the home or visitor team in the prelim_victors array so we know later that this "Tie" game is over.');
   d.writeln('');
   d.writeln('               window.top.gv.prelim_victors[prelim_victors_index] = home_team;');
   d.writeln('');
   d.writeln('               prelim_victors_index++;');
   d.writeln('            }');
   d.writeln('');
   d.writeln('            for (var k = 0; k < number_of_rs_games; k++)');
   d.writeln('            {');
   d.writeln('               // The visiting_scores array, home_scores array, and game_state are strictly for display purposes only.');
   d.writeln('');
   d.writeln('               if ( (visiting_teams[k] == visiting_team) && (home_teams[k] == home_team) )');
   d.writeln('               {');
   d.writeln('                  window.top.gv.visiting_scores[k]    = "&nbsp;&nbsp;" + visiting_score;');
   d.writeln('                  window.top.gv.home_scores[k]        = "&nbsp;&nbsp;" + home_score;');
   d.writeln('                  window.top.gv.prelim_game_states[k] = "<font size=-1>" + game_state + "</font>";');
   d.writeln('               }');
   d.writeln('            }');
   d.writeln('         }');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (games_in_progress == false)');
   d.writeln('   {');
   d.writeln('      alert("There are no Week " + week + " games in progress yet.");');
   d.writeln('');
   d.writeln('      // Force auto refresh to be off if no games are in progress.');
   d.writeln('');
   d.writeln('      window.top.gv.get_scores_state = "off";');
   d.writeln('   }');
   d.writeln('   else');
   d.writeln('   {');
   d.writeln('      // Update window.top.gv.prelim_winners so that the winners will appear on the form when it is redisplayed.');
   d.writeln('');
   d.writeln('      for (var i = 0; i < number_of_rs_games; i++)');
   d.writeln('      {');
   d.writeln('         window.top.gv.prelim_winners[i] = "0";');
   d.writeln('');
   d.writeln('         for (var j = 0; j < number_of_rs_games; j++)');
   d.writeln('         {');
   d.writeln('            if (visiting_teams[i] == winning_teams[j])');
   d.writeln('            {');
   d.writeln('               window.top.gv.prelim_winners[i] = "V";');
   d.writeln('            }');
   d.writeln('            else if (home_teams[i] == winning_teams[j])');
   d.writeln('            {');
   d.writeln('               window.top.gv.prelim_winners[i] = "H";');
   d.writeln('            }');
   d.writeln('         }');
   d.writeln('      }');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   // Redisplay the picks form.');
   d.writeln('');
   d.writeln('   document.location.href = "fp_regular_season_form.html";');
   d.writeln('');
   d.writeln('   return true;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function respond_to_best_outcome_button(document)');
   d.writeln('{');
   d.writeln('   // Set cursor to "wait" (busy).');
   d.writeln('');
   d.writeln('   document.body.style.cursor = "wait";');
   d.writeln('');
   d.writeln('   // Use setTimeout to call determine_best_outcome so busy cursor will be active.');
   d.writeln('');
   d.writeln('   // Before every return call in determine_best_outcome there must be a call to:  document.body.style.cursor = "auto";');
   d.writeln('');
   d.writeln('   setTimeout("determine_best_outcome(document)",500);');
   d.writeln('}');
   d.writeln('');
   d.writeln('</'+'script>');
   d.writeln('');
   d.writeln('');
   d.writeln('<center>');
   d.writeln('');
   if ( (top.gv.mobile == false) || (navigator.platform.toLowerCase().indexOf("ipad") != -1) || ((navigator.platform.toLowerCase().indexOf("macintel") != -1) && (navigator.maxTouchPoints > 1)) )
   {
      d.writeln('<div style="margin: 10px 0px 10px 0px"><font style="font-family: Calibri; font-size: 16pt; font-weight: bold">'+document_heading+'</font></div>');
      d.writeln('');
   }
   d.writeln('<form name="fp_results">');
   d.writeln('');

   d.writeln('<table align=center');
   d.writeln('       class="b3_border"');
   d.writeln('      border=0');
   d.writeln('     bgcolor=white');
   d.writeln(' cellpadding=2');
   d.writeln(' cellspacing=0');
   d.writeln('          id="regular_season_table">');
   d.writeln('');

   d.writeln('<tr class="header_one" style="line-height: 22px">');
   if (mode == "picks")
   {
      d.writeln('<td class="bb2_border" colspan=3>');
      d.writeln('<font style="font-size: 13pt">Week&nbsp;&nbsp;'+week+'&nbsp;&nbsp;'+mode_string+'</font>');
      d.writeln('<td class="br2_bb2_border">');
   }
   else
   {
      d.writeln('<td class="br2_bb2_border" colspan=4>');
      d.writeln('<select class="default_select header_one_background border_radius" style="font-size: 13pt; font-weight: bold; border: 1px solid gray" name="selected_week_menu" size=1');
      d.writeln('  onChange="change_week(document); return true;">');
      for (var i = 1; i <= unaltered_week; i++)
      {
         if (i == week)
         {
            d.writeln('   <option selected value="'+i+'">&nbsp;&nbsp;Week&nbsp;&nbsp;'+i+'&nbsp;&nbsp;Results&nbsp;&nbsp;');
         }
         else
         {
            d.writeln('   <option          value="'+i+'">&nbsp;&nbsp;Week&nbsp;&nbsp;'+i+'&nbsp;&nbsp;Results&nbsp;&nbsp;');
         }
      }
      d.writeln('</select>');
   }
   d.writeln('</td>');
   for (var i = 1; i <= number_of_rs_players; i++)
   {
      if (i == number_of_rs_players)
      {
         d.writeln('<td class="bb2_border" colspan='+player_colspan+'><font style="font-size: 13pt">'+rs_players[player_index[i-1]]+'</font></td>');
      }
      else
      {
         d.writeln('<td class="br2_bb2_border" colspan='+player_colspan+'><font style="font-size: 13pt">'+rs_players[player_index[i-1]]+'</font></td>');
      }
   }
   d.writeln('</tr>');
   d.writeln('');

   d.writeln('<tr class="header_two" style="line-height: 22px">');
   d.writeln('<td class="bb2_border">Visitor</td>');
   d.writeln('<td class="bb2_border">vs</td>');
   d.writeln('<td class="gr1_bb2_border">Home</td>');
   d.writeln('<td class="br2_bb2_border">Winner</td>');
   for (var i = 1; i <= number_of_rs_players; i++)
   {
      if (form_view == "expanded")
      {
         d.writeln('<td class="gr1_bb2_border" colspan=2><font style="font-size: 11pt">Pick</font></td>');
      }
      if (i == number_of_rs_players)
      {
         d.writeln('<td class="bb2_border"><font style="font-size: 11pt">Score</font></td>');
      }
      else
      {
         d.writeln('<td class="br2_bb2_border"><font style="font-size: 11pt">Score</font></td>');
      }
   }
   d.writeln('</tr>');
   d.writeln('');

   for (var i = 1; i <= number_of_rs_games; i++)
   {
      if (mode == "picks")
      {
         for (var j = 1; j <= number_of_rs_games; j++)
         {
            input_tag_class = " class=\"default_select white_background border_radius\" ";

            if ( (visiting_teams[i-1] == victors[j-1]) || (home_teams[i-1] == victors[j-1]) )
            {
               // Highlight the background of the pick to signify that the game has concluded.

               input_tag_class = " class=\"default_select header_two_background border_radius\" ";

               // Check for a game ending in a tie.

               if (visiting_scores[i-1] == home_scores[i-1]) winners[i-1] = "Tie";

               break;
            }
         }

         // Determine which team (if any) has possession of the ball and if they're in the red zone.

         bullet_color                  = color_black;
         home_team_possession_flag     = "";
         visiting_team_possession_flag = "";

         for (var j = 1; j <= number_of_rs_games; j++)
         {
            if (prelim_possession_teams[j-1] == visiting_teams[i-1])
            {
               // Set the visiting team possession flag.

               if (prelim_red_zone_flags[j-1] == true) bullet_color = color_red;

               visiting_team_possession_flag = "<span style='font-weight:bold; color:"+bullet_color+"'>\u2022&nbsp;</span>";

               break;
            }
            else if (prelim_possession_teams[j-1] == home_teams[i-1])
            {
               // Set the home team possession flag.

               if (prelim_red_zone_flags[j-1] == true) bullet_color = color_red;

               home_team_possession_flag = "<span style='font-weight:bold; color:"+bullet_color+"'>\u2022&nbsp;</span>";

               break;
            }
         }

         // Set the game state flag (quarter, halftime, or overtime) if the game is in progress.

         game_state = window.top.gv.prelim_game_states[i-1];
      }

      d.writeln('<tr align=center style="line-height: 19px">');
      if (winners[i-1] == "V")
      {
         if (i == number_of_rs_games)
         {
            d.writeln('<td nowrap class="gr1_bb1_border"><font style="font-size: 12pt" color=blue>'+visiting_team_possession_flag+visiting_teams[i-1]+visiting_scores[i-1]+'</font></td>');
         }
         else
         {
            d.writeln('<td nowrap><font style="font-size: 12pt" color=blue>'+visiting_team_possession_flag+visiting_teams[i-1]+visiting_scores[i-1]+'</font></td>');
         }
      }
      else
      {
         if (i == number_of_rs_games)
         {
            d.writeln('<td nowrap class="gr1_bb1_border"><font style="font-size: 12pt">'+visiting_team_possession_flag+visiting_teams[i-1]+visiting_scores[i-1]+'</font></td>');
         }
         else
         {
            d.writeln('<td nowrap><font style="font-size: 12pt">'+visiting_team_possession_flag+visiting_teams[i-1]+visiting_scores[i-1]+'</font></td>');
         }
      }
      if (i == number_of_rs_games)
      {
         d.writeln('<td nowrap class="gr1_bb1_border"><div style="line-height: 12px"><font style="font-size: 12pt">'+game_state+'</font></div></td>');
      }
      else
      {
         d.writeln('<td nowrap><div style="line-height: 12px"><font style="font-size: 12pt">'+game_state+'</font></div></td>');
      }
      if (winners[i-1] == "H")
      {
         if (i == number_of_rs_games)
         {
            d.writeln('<td nowrap class="gr1_bb1_border"><font style="font-size: 12pt" color=blue>'+home_team_possession_flag+home_teams[i-1]+home_scores[i-1]+'</font></td>');
         }
         else
         {
            d.writeln('<td nowrap><font style="font-size: 12pt" color=blue>'+home_team_possession_flag+home_teams[i-1]+home_scores[i-1]+'</font></td>');
         }
      }
      else
      {
         if (i == number_of_rs_games)
         {
            d.writeln('<td nowrap class="gr1_bb1_border"><font style="font-size: 12pt">'+home_team_possession_flag+home_teams[i-1]+home_scores[i-1]+'</font></td>');
         }
         else
         {
            d.writeln('<td nowrap><font style="font-size: 12pt">'+home_team_possession_flag+home_teams[i-1]+home_scores[i-1]+'</font></td>');
         }
      }
      if (mode == "picks")
      {
         if (i == number_of_rs_games)
         {
            d.writeln('<td class="br2_bb1_border"><select'+input_tag_class+'style="border: 1px solid lightgray" name="winner'+i+'" size=1>');
         }
         else
         {
            d.writeln('<td class="br2_gb1_border"><select'+input_tag_class+'style="border: 1px solid lightgray" name="winner'+i+'" size=1>');
         }
         if (winners[i-1] == "0")
         {
            d.writeln('       <option selected value="0"> ');
         }
         else
         {
            d.writeln('       <option          value="0"> ');
         }
         if (winners[i-1] == "H")
         {
            d.writeln('       <option selected value="H">H');
         }
         else
         {
            d.writeln('       <option          value="H">H');
         }
         if (winners[i-1] == "V")
         {
            d.writeln('       <option selected value="V">V');
         }
         else
         {
            d.writeln('       <option          value="V">V');
         }
         if (winners[i-1] == "Tie")
         {
            d.writeln('       <option selected value="Tie">Tie');
         }
         else
         {
            d.writeln('       <option          value="Tie">Tie');
         }
         d.writeln('    </select></td>');
      }
      else
      {
         if (i == number_of_rs_games)
         {
            d.writeln('<td class="br2_bb1_border"><font style="font-size: 12pt">'+winners[i-1]+'</font></td>');
         }
         else
         {
            d.writeln('<td class="br2_gb1_border"><font style="font-size: 12pt">'+winners[i-1]+'</font></td>');
         }
      }
      for (var ii = 1; ii <= number_of_rs_players; ii++)
      {
         if (form_view == "expanded")
         {
            if (picks[player_index[ii-1]].length > 0)
            {
               if (i == number_of_rs_games)
               {
                  d.writeln('<td class="gr1_bb1_border"><font style="font-size: 12pt">'+picks[player_index[ii-1]][i-1]+'</font></td>');  
                  d.writeln('<td class="gr1_bb1_border"><font style="font-size: 12pt">'+weights[player_index[ii-1]][i-1]+'</font></td>');
               }
               else
               {
                  d.writeln('<td><font style="font-size: 12pt">'+picks[player_index[ii-1]][i-1]+'</font></td>');  
                  d.writeln('<td><font style="font-size: 12pt">'+weights[player_index[ii-1]][i-1]+'</font></td>');
               }
            }
            else
            {
               if (i == number_of_rs_games)
               {
                  d.writeln('<td class="gr1_bb1_border"><font style="font-size: 12pt"><br></font></td>');
                  d.writeln('<td class="gr1_bb1_border"><font style="font-size: 12pt"><br></font></td>');
               }
               else
               {
                  d.writeln('<td><font style="font-size: 12pt"><br></font></td>');
                  d.writeln('<td><font style="font-size: 12pt"><br></font></td>');
               }
            }  
         }
         if (picks[player_index[ii-1]].length > 0)
         {
            if ( (winners[i-1] != "0") && (picks[player_index[ii-1]][i-1] != winners[i-1]) )
            {
               if (ii == number_of_rs_players)
               {
                  if (i == number_of_rs_games)
                  {
                     d.writeln('<td class="bb1_border"><font style="font-size: 12pt" color=red>-'+weights[player_index[ii-1]][i-1]+'</font></td>');
                  }
                  else
                  {
                     d.writeln('<td class="gb1_border"><font style="font-size: 12pt" color=red>-'+weights[player_index[ii-1]][i-1]+'</font></td>');
                  }
               }
               else
               {
                  if (i == number_of_rs_games)
                  {
                     d.writeln('<td class="br2_bb1_border"><font style="font-size: 12pt" color=red>-'+weights[player_index[ii-1]][i-1]+'</font></td>');
                  }
                  else
                  {
                     d.writeln('<td class="br2_gb1_border"><font style="font-size: 12pt" color=red>-'+weights[player_index[ii-1]][i-1]+'</font></td>');
                  }
               }
            }
            else
            {
               if (ii == number_of_rs_players)
               {
                  if (i == number_of_rs_games)
                  {
                     d.writeln('<td class="bb1_border"><font style="font-size: 12pt"><br></font></td>');
                  }
                  else
                  {
                     d.writeln('<td class="gb1_border"><font style="font-size: 12pt"><br></font></td>');
                  }
               }
               else
               {
                  if (i == number_of_rs_games)
                  {
                     d.writeln('<td class="br2_bb1_border"><font style="font-size: 12pt"><br></font></td>');
                  }
                  else
                  {
                     d.writeln('<td class="br2_gb1_border"><font style="font-size: 12pt"><br></font></td>');
                  }
               }
            }
         }
         else
         {
            if (ii == number_of_rs_players)
            {
               if (i == number_of_rs_games)
               {
                  d.writeln('<td class="bb1_border"><font style="font-size: 12pt"><br></font></td>');
               }
               else
               {
                  d.writeln('<td class="gb1_border"><font style="font-size: 12pt"><br></font></td>');
               }
            }
            else
            {
               if (i == number_of_rs_games)
               {
                  d.writeln('<td class="br2_bb1_border"><font style="font-size: 12pt"><br></font></td>');
               }
               else
               {
                  d.writeln('<td class="br2_gb1_border"><font style="font-size: 12pt"><br></font></td>');
               }
            }
         }
      }
      d.writeln('</tr>');  
      d.writeln('');
   }
   d.writeln('');

   d.writeln('<tr align=center style="line-height: 17px">');
   d.writeln('<td class="br2_border" align=right colspan=4 nowrap>');
   d.writeln('<font style="font-size: 10pt">\"'+visiting_teams[number_of_rs_games-1]+' at '+home_teams[number_of_rs_games-1]+'\" Total Points:&nbsp;&nbsp;'+mn_points_string+'</font>');
   d.writeln('</td>');
   for (var i = 1; i <= number_of_rs_players; i++)
   {
      if (mn_points[player_index[i-1]].length == 0) mn_points[player_index[i-1]] = "<br>";

      if ( (tie_breaker_needed == true) && (actual_mn_points > 0) && (mn_points_delta[player_index[i-1]] != "N/A") )
      {
         if (mn_points_delta[player_index[i-1]] > 0) 
         {
            mn_points_delta_string = Math.abs(mn_points_delta[player_index[i-1]]) + " over";
         }
         else if (mn_points_delta[player_index[i-1]] < 0) 
         {
            mn_points_delta_string = Math.abs(mn_points_delta[player_index[i-1]]) + " under";
         }
         else
         {
            mn_points_delta_string = "exact";
         }
      }
      else
      {
         mn_points_delta_string = "<br>";
      }

      if (form_view == "expanded")
      {
         if (picks[player_index[i-1]].length > 0)
         {
            d.writeln('<td class="gr1_border" align=right><font style="font-size: 9pt">Pts:</font></td>');
         }
         else
         {
            d.writeln('<td class="gr1_border" align=right><font style="font-size: 9pt"><br></font></td>');
         }
         d.writeln('<td class="gr1_border"><font style="font-size: 9pt">'+mn_points[player_index[i-1]]+'</font></td>');
         if (i == number_of_rs_players)
         {
            d.writeln('<td class="no_border" nowrap><font style="font-size: 9pt">'+mn_points_delta_string+'</font></td>');
         }
         else
         {
            d.writeln('<td class="br2_border" nowrap><font style="font-size: 9pt">'+mn_points_delta_string+'</font></td>');
         }
      }
      else
      {
         if (i == number_of_rs_players)
         {
            d.writeln('<td class="no_border"><font style="font-size: 9pt">'+mn_points[player_index[i-1]]+'</font></td>');
         }
         else
         {
            d.writeln('<td class="br2_border"><font style="font-size: 9pt">'+mn_points[player_index[i-1]]+'</font></td>');
         }
      }
   }
   d.writeln('</tr>');
   d.writeln('');

   d.writeln('<tr align=center style="line-height: 21px">');
   d.writeln('<td class="bt2_br2_border" align=right colspan=4>');
   d.writeln('<font style="font-size: 12pt"><b>Scores:&nbsp;</b></font>');
   d.writeln('</td>');
   for (var i = 1; i <= number_of_rs_players; i++)
   {
      if (form_view == "expanded")
      {
         d.writeln('<td class="bt2_gr1_border" colspan=2 align=center><font style="font-size: 12pt" color=blue>'+ranks[player_index[i-1]]+'</font></td>');
      }
      if (picks[player_index[i-1]].length > 0)
      {
         if (ranks[player_index[i-1]] == 1)
         {
            if (i == number_of_rs_players)
            {
               d.writeln('<td class="bt2_border header_two_background"><font style="font-size: 12pt" color=blue>'+scores[player_index[i-1]]+'</font></td>');
            }
            else
            {
               d.writeln('<td class="bt2_br2_border header_two_background"><font style="font-size: 12pt" color=blue>'+scores[player_index[i-1]]+'</font></td>');
            }
         }
         else
         {
            if (i == number_of_rs_players)
            {
               d.writeln('<td class="bt2_border"><font style="font-size: 12pt" color=blue>'+scores[player_index[i-1]]+'</font></td>');
            }
            else
            {
               d.writeln('<td class="bt2_br2_border"><font style="font-size: 12pt" color=blue>'+scores[player_index[i-1]]+'</font></td>');
            }
         }
      }
      else
      {
         if (i == number_of_rs_players)
         {
            d.writeln('<td class="bt2_border"><font style="font-size: 12pt" color=blue>0</font></td>');
         }
         else
         {
            d.writeln('<td class="bt2_br2_border"><font style="font-size: 12pt" color=blue>0</font></td>');
         }
      }
   }
   d.writeln('</tr>');
   d.writeln('');

   d.writeln('</table>');
   d.writeln('');

   if (mode == "picks")
   {
      if ( (tie_breaker_needed == true) && (in_progress_mn_points < 1) )
      {
         var mn_pts_value        = window.top.gv.mn_points_entered;
         var tie_breaker_message = "Enter \"" + visiting_teams[number_of_rs_games-1] + " at " + home_teams[number_of_rs_games-1] + "\" Total Points to break the tie:&nbsp;&nbsp;";

         if (mn_pts_value < 1) mn_pts_value = "";

         d.writeln('<table align=center>');
         d.writeln('<tr><td class="no_border" style="font-size: 2pt">&nbsp;</td></tr>');
         d.writeln('<tr><td class="no_border" nowrap><font style="font-size: 13pt">'+tie_breaker_message+'</font>');
         d.writeln('<input type=text class="default_text border_radius" style="border: 1px solid black; width: 35px" name="mn_points" size="3" maxlength="3" value="'+mn_pts_value+'"');
         d.writeln('              onChange="get_mn_points(document);return true;"');
         d.writeln('            onKeyPress="if (window.event.keyCode==13) {window.event.keyCode=0; get_mn_points(document); calculate_prelim_scores(document); return true;}">');
         d.writeln('</td></tr></table>');
      }
      else
      {
         window.top.gv.mn_points_entered = 0;
      }
   }

   d.writeln('<table cols=1 align=center>');
   d.writeln('');

   d.writeln('<tr><td class="no_border" style="font-size: 2pt">&nbsp;</td></tr>');
   d.writeln('');
   if (mode == "picks")
   {
      d.writeln('<tr align=center>');
      d.writeln('<td nowrap valign=middle class="no_border">');
      d.writeln('<input type="button" class="default_button border_radius" name="get_scores_button" value="Get NFL Scores"');
      d.writeln('    onClick=get_nfl_scores(document,false,"");>');
      d.writeln('&nbsp;');
      d.writeln('<font style="font-size: 12pt">Auto Refresh:</font>&nbsp;');
      if (window.top.gv.get_scores_state == "off")
      {
         d.writeln('<input type="button" class="default_button border_radius" name="get_scores_start_button" value="Start"');
         d.writeln('    onClick=get_scores_auto_refresh(document,"start");get_nfl_scores(document,false,"Start");>');
      }
      else
      {
         d.writeln('<input type="button" class="default_button border_radius" name="get_scores_stop_button" value="Stop"');
         d.writeln('    onClick=get_scores_auto_refresh(document,"stop");document.location.href="fp_regular_season_form.html";>');
      }
      d.writeln('</td>');
      d.writeln('</tr>');
      d.writeln('<tr><td class="no_border" style="font-size: 2pt">&nbsp;</td></tr>');
   }
   d.writeln('<tr align=center>');
   d.writeln('<td nowrap valign=middle class="no_border">');
   if (mode == "picks")
   {
      d.writeln('<input type="button" class="default_button border_radius" name="calculate_scores_button" value="Calculate Player Scores"');
      d.writeln('    onClick="calculate_prelim_scores(document);return true;">');
      d.writeln('&nbsp;');
      d.writeln('<input type="button" class="default_button border_radius" name="clear_winners_button" value="Clear Winners"');
      d.writeln('    onClick="clear_winners(document);return true;">');
      d.writeln('&nbsp;');
   }
   if (order_by == "players")
   {
      d.writeln('<input type="button" class="default_button border_radius" name="order_by_button" value="Order By Score"');
   }
   else
   {
      d.writeln('<input type="button" class="default_button border_radius" name="order_by_button" value="Order By Player"');
   }
   d.writeln('    onClick="change_order(document);return true;">');
   d.writeln('&nbsp;');
   if (form_view == "expanded")
   {
      d.writeln('<input type="button" class="default_button border_radius" name="view_button" value="Hide Picks"');
   }
   else
   {
      d.writeln('<input type="button" class="default_button border_radius" name="view_button" value="Show Picks"');
   }
   d.writeln('    onClick="change_view(document);return true;">');
   d.writeln('&nbsp;');
   d.writeln('<input type="button" class="default_button border_radius" name="close_button" value="Close"');
   d.writeln('    onClick="javascript:window.top.close();">');
   d.writeln('</td>');
   d.writeln('</tr>');
   d.writeln('');
   if (mode == "picks")
   {
      d.writeln('<tr><td class="no_border" style="font-size: 2pt">&nbsp;</td></tr>');
      d.writeln('<tr align=center>');
      d.writeln('<td nowrap valign=middle class="no_border">');
      d.writeln('<input type="button" class="default_button border_radius" name="best_outcome" value="Best Outcome:"');
      d.writeln('     onClick="respond_to_best_outcome_button(document);return true;" title="'+best_outcome_tooltip+'">');
      d.writeln('&nbsp;');
      d.writeln('<font style="font-size: 12pt">Player:</font>&nbsp;');
      d.writeln('<select class="default_select border_radius" name="player_name_menu" size=1');
      d.writeln('     onChange="get_selected_player(document);return true;">');
      for (var player_index = 0; player_index <= number_of_rs_players; player_index++)
      {
         // Only add players to the menu if they submitted their picks.

         if ( (player_index == 0) || ((player_index > 0) && (picks[player_index-1].length > 0)) )
         {
            temp_name = build_player_name(player_index,true);

            if (player_index == window.top.gv.player_index)
            {
                  d.writeln('   <option selected value="'+player_index+'">'+temp_name);
            }
            else
            {
                  d.writeln('   <option          value="'+player_index+'">'+temp_name);
            }
         }
      }
      d.writeln('</select>');
      d.writeln('&nbsp;');
      d.writeln('<font style="font-size: 12pt">Opponent:</font>&nbsp;');
      d.writeln('<select class="default_select border_radius" name="opponent_name_menu" size=1');
      d.writeln('     onChange="get_selected_opponent(document);return true;">');
      for (var opponent_index = 0; opponent_index <= number_of_rs_players; opponent_index++)
      {
         // Only add opponents to the menu if they submitted their picks.

         if ( (opponent_index == 0) || ((opponent_index > 0) && (picks[opponent_index-1].length > 0)) )
         {
            temp_name = build_player_name(opponent_index,true);

            if (opponent_index == 0) temp_name = "All";

            if (opponent_index == window.top.gv.opponent_index)
            {
                  d.writeln('   <option selected value="'+opponent_index+'">'+temp_name);
            }
            else
            {
                  d.writeln('   <option          value="'+opponent_index+'">'+temp_name);
            }
         }
      }
      d.writeln('</select>');
      d.writeln('</td>');
      d.writeln('</tr>');
      d.writeln('');
   }

   d.writeln('</table>');
   d.writeln('');

   d.writeln('</form>');
   d.writeln('');

   if (number_of_rs_games < max_number_of_rs_games)
   {
      d.writeln('<div style="margin: 20px 5px 5px 5px; max-width: '+(window.screen.width-60)+'px">');
      d.writeln('<font style="font-family: Calibri; font-size: 12pt"><b>Open Date:</b>&nbsp;&nbsp;'+open_date+'</font>');
      d.writeln('</div>');
   }

   d.writeln('</center>');
   d.writeln('');

   if (mode == "picks")
   {
      if ( (tie_breaker_needed == true) && (in_progress_mn_points < 1) )
      {
         if (d.fp_results.mn_points != undefined) window.top.gv.focus_element(d.fp_results.mn_points);
      }

      if (window.top.gv.get_scores_timer != null)
      {
         clearInterval(window.top.gv.get_scores_timer);
      }

      if (window.top.gv.get_scores_state == "on")
      {
         window.top.gv.get_scores_timer = setInterval('get_nfl_scores(document,false,"");',10000);
      }
   }
   d.writeln('');

   d.writeln('</body>');
   d.writeln('');

   d.writeln('</html>');

   d.getElementById("regular_season_table").scrollIntoView({block: "start", inline: "start"});

   adjust_mobile_viewport_height(d,"regular_season");

   d.close();

   return true;
}


function build_regular_season_summary()
{
   if (check_for_opener() == false)
   {
      window.top.close();

      return false;
   }

   var rs_players           = window.top.gv.rs_players;
   var number_of_rs_players = rs_players.length;
   var number_of_rs_weeks   = window.top.gv.all_home_teams.length;

   var actual_mn_points          = "";
   var background_color_class    = "";
   var all_games_won             = Array(number_of_rs_weeks);
   var all_ranks                 = Array(number_of_rs_weeks);
   var all_scores                = Array(number_of_rs_weeks);
   var best_mn_points_delta      = 1000;
   var best_total_average_ranks  = 12.0;
   var best_total_games_won      = 0;
   var best_total_scores         = 0;
   var bold_end                  = "";
   var bold_start                = "";
   var border_class_1            = "";
   var border_class_2            = "";
   var border_class_3            = "";
   var color_blue                = "blue";
   var color_green               = "#008800";
   var color_red                 = "red";
   var column_span               = 3;
   var document_heading          = "Regular Season Summary";
   var font_color                = "";
   var form_view                 = window.top.gv.form_view;
   var high_score                = 0;
   var high_score_count          = 0;
   var max_1st_places            = 0;
   var max_2nd_places            = 0;
   var max_3rd_places            = 0;
   var max_last_places           = 0;
   var max_missed_weeks          = 0;
   var mn_points                 = "";
   var mn_points_delta           = Array(number_of_rs_players).fill("N/A");
   var number_of_rs_games        = 0;
   var order_by                  = window.top.gv.order_by;
   var player_low_scores         = Array(number_of_rs_players).fill(999);
   var player_total_average_rank = "<br>";
   var player_total_games_won    = 0;
   var player_total_score        = 0;
   var ranks_adjust              = Array(number_of_rs_players).fill(0);
   var ranks_sum                 = 0;
   var sort_index                = Array(number_of_rs_players).fill().map((_,i) => i);  // Sets sort_index = [0,1,2,3,4,5,6,7,8,9,10,11]
   var sorted_scores             = Array(number_of_rs_players).fill(1);
   var summary_title             = "";
   var table_data                = "";
   var total_1st_places          = Array(number_of_rs_players).fill(0);
   var total_2nd_places          = Array(number_of_rs_players).fill(0);
   var total_3rd_places          = Array(number_of_rs_players).fill(0);
   var total_average_ranks       = Array(number_of_rs_players).fill(12);
   var total_games_played        = 0;
   var total_games_won           = Array(number_of_rs_players).fill(0);
   var total_last_places         = Array(number_of_rs_players).fill(0);
   var total_missed_weeks        = Array(number_of_rs_players).fill(0);
   var total_ranks               = Array(number_of_rs_players).fill(1);
   var total_scores              = Array(number_of_rs_players).fill(0);
   var week                      = window.top.gv.current_input_week - 1;
   var weekly_last_place_scores  = Array(number_of_rs_weeks).fill(999);
   var weekly_max_games_won      = 0;
   var weekly_max_score          = 0;
   var weekly_picks              = "";
   var weekly_weights            = "";
   var weekly_winners            = "";
   var weeks_played              = 0;


   if (window.top.gv.games_over == false)       week--;
   if (week <  1)                               week = 1;
   if (week > number_of_rs_weeks)               week = number_of_rs_weeks;
   if (window.top.gv.mode == "summary_archive") week = number_of_rs_weeks;

   summary_title     = "Week&nbsp;&nbsp;"+week+"&nbsp;&nbsp;Results";

   // Build document header.

   if (window.top.gv.mode == "summary_archive")
   {
      document_heading = window.top.gv.archive_year + " " + document_heading;
   }

   if (form_view == "expanded")
   {
      column_span = 3;
   }
   else
   {
      column_span = 1;
   }

   for (var week_index = 0; week_index < week; week_index++)
   {
      actual_mn_points          = all_actual_mn_points[week_index];
      all_games_won[week_index] = Array(12).fill(0);
      all_ranks[week_index]     = Array(12).fill(1);
      all_scores[week_index]    = Array(12).fill(0);
      mn_points                 = all_mn_points[week_index];
      number_of_rs_games        = window.top.gv.all_home_teams[week_index].length;
      ranks_adjust              = Array(number_of_rs_players).fill(0);
      sorted_scores             = Array(number_of_rs_players).fill(1);
      weekly_picks              = all_picks[week_index];
      weekly_weights            = all_weights[week_index];
      weekly_winners            = all_winners[week_index];

      // Calculate scores for the current week.

      for (var player_index = 0; player_index < number_of_rs_players; player_index++)
      {
         if (weekly_picks[player_index].length > 0)
         {
            for (var game_index = 0; game_index < number_of_rs_games; game_index++)
            {
               if ( (weekly_winners[game_index] != "0") && (weekly_picks[player_index][game_index] == weekly_winners[game_index]) )
               {
                  all_games_won[week_index][player_index]++;
                  all_scores[week_index][player_index] = all_scores[week_index][player_index] + (weekly_weights[player_index][game_index]-0);
               }
            }
         }
         else
         {
            all_games_won[week_index][player_index] = 0;
            all_scores   [week_index][player_index] = 0;

            total_missed_weeks[player_index]++;
         }

         total_games_won[player_index] = total_games_won[player_index] + all_games_won[week_index][player_index];
         total_scores[player_index]    = total_scores[player_index]    + all_scores[week_index][player_index];

         if (weekly_picks[player_index].length > 0)
         {
            weekly_last_place_scores[week_index] = Math.min(weekly_last_place_scores[week_index],all_scores[week_index][player_index]);
         }
      }

      // Determine if there's a tie this week.
 
      for (var player_index = 0; player_index < number_of_rs_players; player_index++)
      {
         sorted_scores[player_index] = all_scores[week_index][player_index];
      }

      sorted_scores.sort(function(sorted_scores,b){return sorted_scores-b;});
      sorted_scores.reverse();

      high_score       = sorted_scores[0];
      high_score_count = 0;

      for (var player_index = 0; player_index < number_of_rs_players; player_index++)
      {
         if (all_scores[week_index][player_index] == high_score)
         {
            high_score_count++;

            mn_points_delta[player_index] = mn_points[player_index] - actual_mn_points;
         }
         else
         {
            mn_points_delta[player_index] = "N/A";
         }
      }

      // If there's a tie, try to break the tie.

      if ( (high_score_count > 1) && (actual_mn_points > 0) )
      {
         // Determine the best Total Points delta (difference between best prediction and actual).

         best_mn_points_delta = 1000;

         for (var player_index = 0; player_index < number_of_rs_players; player_index++)
         {
            if (mn_points_delta[player_index] != "N/A")
            {
               if ( Math.abs(mn_points_delta[player_index]) < Math.abs(best_mn_points_delta) )
               {
                  best_mn_points_delta = mn_points_delta[player_index];
               }
               else if ( Math.abs(mn_points_delta[player_index]) == Math.abs(best_mn_points_delta) )
               {
                  if (mn_points_delta[player_index] < best_mn_points_delta)
                  {
                     best_mn_points_delta = mn_points_delta[player_index];
                  }
               }
            }
         }

         // Determine how many players have the high score and the same Total Points delta.

         high_score_count = 0;

         for (var player_index = 0; player_index < number_of_rs_players; player_index++)
         {
            if ( (mn_points_delta[player_index] != "N/A") && (mn_points_delta[player_index] == best_mn_points_delta) )
            {
               high_score_count++;
            }
         }

         // Adjust the ranks of the players who have the high score but don't have the best Total Points delta.

         for (var player_index = 0; player_index < number_of_rs_players; player_index++)
         {
            if ((all_scores[week_index][player_index] == high_score) && (mn_points_delta[player_index] != best_mn_points_delta))
            {
               ranks_adjust[player_index] = high_score_count; 
            }
         }
      }

      // Calculate ranks for the current week.

      for (var player_index_1 = 0; player_index_1 < number_of_rs_players; player_index_1++)
      {
         for (var player_index_2 = 0; player_index_2 < number_of_rs_players; player_index_2++)
         {
            if (all_scores[week_index][player_index_1] == sorted_scores[player_index_2])
            {
               all_ranks[week_index][player_index_1] = (player_index_2 + 1) + ranks_adjust[player_index_1];
               break;
            }
         }
      }
   }

   // Calculate average ranks for each player (don't include weeks that player's missed).

   best_total_average_ranks = 12.0;

   for (var player_index = 0; player_index < number_of_rs_players; player_index++)
   {
      ranks_sum    = 0;
      weeks_played = 0;

      for (var week_index = 0; week_index < week; week_index++)
      {
         weekly_picks   = all_picks[week_index];
         weekly_winners = all_winners[week_index];

         if ( (weekly_winners.length > 0) && (weekly_picks[player_index].length > 0) )
         {
            weeks_played++;

            ranks_sum = ranks_sum + all_ranks[week_index][player_index];
         }
      }

      if (weeks_played > 0)
      {
         total_average_ranks[player_index] = ranks_sum / weeks_played;

         best_total_average_ranks = Math.min(best_total_average_ranks,total_average_ranks[player_index]);
      }
      else
      {
         total_average_ranks[player_index] = "<br>";
      }
   }

   for (var player_index = 0; player_index < number_of_rs_players; player_index++)
   {
      if (week > 1)
      {
         // Determine each player's low score and subtract it from each player's total score if we've played at least 2 weeks.

         for (var week_index = 0; week_index < week; week_index++)
         {
            player_low_scores[player_index] = Math.min(player_low_scores[player_index],all_scores[week_index][player_index]);
         }

         total_scores[player_index] = total_scores[player_index] - player_low_scores[player_index];
      }

      // Determine who has won the most games and who has the highest total score (not including the low score).

      best_total_games_won = Math.max(best_total_games_won,total_games_won[player_index]);
      best_total_scores    = Math.max(best_total_scores,total_scores[player_index]);
   }

   // Calculate total ranks.

   sorted_scores.fill(1);

   for (var player_index = 0; player_index < number_of_rs_players; player_index++)
   {
      sorted_scores[player_index] = total_scores[player_index];
   }

   sorted_scores.sort(function(sorted_scores,b){return sorted_scores-b;});
   sorted_scores.reverse();

   for (var player_index_1 = 0; player_index_1 < number_of_rs_players; player_index_1++)
   {
      for (var player_index_2 = 0; player_index_2 < number_of_rs_players; player_index_2++)
      {
         if (total_scores[player_index_1] == sorted_scores[player_index_2])
         {
            total_ranks[player_index_1] = (player_index_2 + 1);
            break;
         }
      }
   }

   // Determine 1st place, 2nd place, 3rd place, last place, and missed week counts for each player.

   for (var player_index = 0; player_index < number_of_rs_players; player_index++)
   {
      for (var week_index = 0; week_index < week; week_index++)
      {
         if (all_ranks[week_index][player_index] == 1) total_1st_places[player_index]++;
         if (all_ranks[week_index][player_index] == 2) total_2nd_places[player_index]++;
         if (all_ranks[week_index][player_index] == 3) total_3rd_places[player_index]++;
         if (all_scores[week_index][player_index] == weekly_last_place_scores[week_index]) total_last_places[player_index]++;
      }
   }

   for (var player_index = 0; player_index < number_of_rs_players; player_index++)
   {
      max_1st_places   = Math.max(max_1st_places,total_1st_places[player_index]);
      max_2nd_places   = Math.max(max_2nd_places,total_2nd_places[player_index]);
      max_3rd_places   = Math.max(max_3rd_places,total_3rd_places[player_index]);
      max_last_places  = Math.max(max_last_places,total_last_places[player_index]);
      max_missed_weeks = Math.max(max_missed_weeks,total_missed_weeks[player_index]);
   }

   // Calculate sort index.

   for (var player_index_1 = 1; player_index_1 <= number_of_rs_players; player_index_1++)
   {
      if (order_by == "players")
      {
         sort_index[player_index_1-1] = player_index_1-1;
      }
      else
      {
         var duplicates = 0;

         for (var player_index_2 = 1; player_index_2 <= number_of_rs_players; player_index_2++)
         {
            if (player_index_1 == total_ranks[player_index_2-1])
            {
               sort_index[(player_index_1+duplicates)-1] = player_index_2-1;

               duplicates++;
            }
         }

         player_index_1 = player_index_1 + duplicates - 1;
      }
   }

   document.open();

   var d = document;

   d.writeln('<html>');
   d.writeln('');

   d.writeln('<head>');
   d.writeln('   <title>NFL Football Pool</title>');
   d.writeln('   <style type="text/css">');
   d.writeln('   <!--');
   d.writeln('      TD              {border-style:        solid;');
   d.writeln('                       border-color:    lightgray;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    1px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .b3_border      {border: 3px solid    black}');
   d.writeln('      .no_border      {border-style:        solid;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    0px;');
   d.writeln('                       border-bottom-width:   0px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .bb1_border     {border-style:        solid;');
   d.writeln('                       border-color:        black;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    0px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .bb2_border     {border-style:        solid;');
   d.writeln('                       border-color:        black;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    0px;');
   d.writeln('                       border-bottom-width:   2px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .br2_border     {border-style:        solid;');
   d.writeln('                       border-color:        black;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    2px;');
   d.writeln('                       border-bottom-width:   0px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .br2_bb1_border {border-style:        solid;');
   d.writeln('                       border-color: white black black white;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    2px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .br2_bb2_border {border-style:        solid;');
   d.writeln('                       border-color: white black black white;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    2px;');
   d.writeln('                       border-bottom-width:   2px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .br2_gb1_border {border-style:        solid;');
   d.writeln('                       border-color: white black lightgray white;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    2px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .bt2_border     {border-style:        solid;');
   d.writeln('                       border-color:        black;');
   d.writeln('                       border-top-width:      2px;');
   d.writeln('                       border-right-width:    0px;');
   d.writeln('                       border-bottom-width:   0px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .bt2_br2_border {border-style:        solid;');
   d.writeln('                       border-color: black black white white;');
   d.writeln('                       border-top-width:      2px;');
   d.writeln('                       border-right-width:    2px;');
   d.writeln('                       border-bottom-width:   0px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .bt2_gr1_border {border-style:        solid;');
   d.writeln('                       border-color: black lightgray white white;');
   d.writeln('                       border-top-width:      2px;');
   d.writeln('                       border-right-width:    1px;');
   d.writeln('                       border-bottom-width:   0px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .gb1_border     {border-style:        solid;');
   d.writeln('                       border-color:    lightgray;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    0px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .gr1_border     {border-style:        solid;');
   d.writeln('                       border-color:    lightgray;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    1px;');
   d.writeln('                       border-bottom-width:   0px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .gr1_bb1_border {border-style:        solid;');
   d.writeln('                       border-color: white lightgray black white;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    1px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .gr1_bb2_border {border-style:        solid;');
   d.writeln('                       border-color: white lightgray black white;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    1px;');
   d.writeln('                       border-bottom-width:   2px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('      .gr1_gb1_border {border-style:        solid;');
   d.writeln('                       border-color: white lightgray lightgray white;');
   d.writeln('                       border-top-width:      0px;');
   d.writeln('                       border-right-width:    1px;');
   d.writeln('                       border-bottom-width:   1px;');
   d.writeln('                       border-left-width:     0px}');
   d.writeln('   -->');
   d.writeln('   </style>');
   d.writeln('</head>');
   d.writeln('');

   d.writeln('<body>');
   d.writeln('');
   d.writeln('');

   d.writeln('<script language="JavaScript">');
   d.writeln('');
   d.writeln('function change_order(document)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (window.top.gv.order_by == "players")');
   d.writeln('   {');
   d.writeln('      window.top.gv.order_by = "scores";');
   d.writeln('   }');
   d.writeln('   else if (window.top.gv.order_by == "scores")');
   d.writeln('   {');
   d.writeln('      window.top.gv.order_by = "players";');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (window.top.gv.mode == "summary_archive")');
   d.writeln('   {');
   d.writeln('      document.location.href = "fp_forms_"+window.top.gv.archive_year+".html";');
   d.writeln('   }');
   d.writeln('   else');
   d.writeln('   {');
   d.writeln('      document.location.href = "fp_regular_season_form.html";');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   return true;');
   d.writeln('}');
   d.writeln('');
   d.writeln('');
   d.writeln('function change_view(document)');
   d.writeln('{');
   d.writeln('   if (check_for_opener() == false)');
   d.writeln('   {');
   d.writeln('      window.top.close();');
   d.writeln('');
   d.writeln('      return false;');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (window.top.gv.form_view == "expanded")');
   d.writeln('   {');
   d.writeln('      window.top.gv.form_view = "compact";');
   d.writeln('   }');
   d.writeln('   else if (window.top.gv.form_view == "compact")');
   d.writeln('   {');
   d.writeln('      window.top.gv.form_view = "expanded";');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   if (window.top.gv.mode == "summary_archive")');
   d.writeln('   {');
   d.writeln('      document.location.href = "fp_forms_"+window.top.gv.archive_year+".html";');
   d.writeln('   }');
   d.writeln('   else');
   d.writeln('   {');
   d.writeln('      document.location.href = "fp_regular_season_form.html";');
   d.writeln('   }');
   d.writeln('');
   d.writeln('   return true;');
   d.writeln('}');
   d.writeln('');
   d.writeln('</'+'script>');
   d.writeln('');
   d.writeln('');
   d.writeln('<center>');
   d.writeln('');
   if ( (top.gv.mobile == false) || (navigator.platform.toLowerCase().indexOf("ipad") != -1) || ((navigator.platform.toLowerCase().indexOf("macintel") != -1) && (navigator.maxTouchPoints > 1)) )
   {
      d.writeln('<div style="margin: 10px 0px 10px 0px"><font style="font-family: Calibri; font-size: 16pt; font-weight: bold">'+document_heading+'</font></div>');
      d.writeln('');
   }
   d.writeln('<form name="fp_results">');
   d.writeln('');

   d.writeln('<table align=center');
   d.writeln('       class="b3_border"');
   d.writeln('      border=0');
   d.writeln('     bgcolor=white');
   d.writeln(' cellpadding=2');
   d.writeln(' cellspacing=0');
   d.writeln('          id="season_summary">');
   d.writeln('');

   d.writeln('<tr class="header_one" style="line-height: 22px">');
   d.writeln('<td class="br2_bb2_border" colspan=3>');
   d.writeln('<font style="font-size: 13pt">'+summary_title+'</font>');
   d.writeln('</td>');
   for (var player_index = 0; player_index < number_of_rs_players; player_index++)
   {
      if ((player_index + 1) == number_of_rs_players)
      {
         border_class_1 = "bb2_border";
      }
      else
      {
         border_class_1 = "br2_bb2_border";
      }

      d.writeln('<td class='+border_class_1+' colspan='+column_span+'>'+rs_players[sort_index[player_index]]+'</td>');
   }
   d.writeln('</tr>');
   d.writeln('');

   d.writeln('<tr class="header_two" style="line-height: 14px">');
   d.writeln('<td class="gr1_bb2_border"><font style="font-size: 10pt">Week</font></td>');
   d.writeln('<td class="gr1_bb2_border"><font style="font-size: 10pt">Games<br>Scheduled</font></td>');
   d.writeln('<td class="br2_bb2_border"><font style="font-size: 10pt">Games<br>Played</font></td>');

   for (var i = 1; i <= number_of_rs_players; i++)
   {
      if (form_view == "expanded")
      {
         d.writeln('<td class="gr1_bb2_border"><font style="font-size: 10pt">Rank</font></td>');
         d.writeln('<td class="gr1_bb2_border"><font style="font-size: 10pt">Games<br>Won</font></td>');
      }
      if (i == number_of_rs_players)
      {
         border_class_1 = "bb2_border";
      }
      else
      {
         border_class_1 = "br2_bb2_border";
      }

      d.writeln('<td class='+border_class_1+'><font style="font-size: 10pt">Score</font></td>');
   }
   d.writeln('</tr>');
   d.writeln('');

   for (var week_index = 0; week_index < number_of_rs_weeks; week_index++)
   {
      weekly_picks = all_picks[week_index];

      if (week_index == (number_of_rs_weeks-1))
      {
         border_class_1 = "gr1_bb2_border";
         border_class_2 = "br2_bb2_border";
      }
      else
      {
         border_class_1 = "gr1_gb1_border";
         border_class_2 = "br2_gb1_border";
      }

      d.writeln('<tr align=center style="line-height: 18px">');
      d.writeln('<td class='+border_class_1+'><font style="font-size: 11pt"><b>'+(week_index+1)+'</b></font></td>');
      d.writeln('<td class='+border_class_1+'><font style="font-size: 11pt">'+window.top.gv.all_home_teams[week_index].length+'</font></td>');

      if (week_index < week)
      {
         d.writeln('<td class='+border_class_2+'><font style="font-size: 11pt">'+window.top.gv.all_home_teams[week_index].length+'</font></td>');

         total_games_played = total_games_played + window.top.gv.all_home_teams[week_index].length;
      }
      else
      {
         d.writeln('<td class='+border_class_2+'><font style="font-size: 11pt"><br></font></td>');
      }

      for (var player_index = 0; player_index < number_of_rs_players; player_index++)
      {
         if (week_index == (number_of_rs_weeks-1))
         {
            if ((player_index + 1) == number_of_rs_players)
            {
               border_class_3 = "bb2_border";
            }
            else
            {
               border_class_3 = "br2_bb2_border";
            }
         }
         else
         {
            if ((player_index + 1) == number_of_rs_players)
            {
               border_class_3 = "gb1_border";
            }
            else
            {
               border_class_3 = "br2_gb1_border";
            }
         }

         if (week_index < week)
         {
            weekly_max_games_won = 0;
            weekly_max_score     = 0;

            for (var player_index2 = 0; player_index2 < number_of_rs_players; player_index2++)
            {
               // JL Move these above?
               weekly_max_games_won = Math.max(weekly_max_games_won,all_games_won[week_index][player_index2]);
               weekly_max_score     = Math.max(weekly_max_score,all_scores[week_index][player_index2]);
            }

            if (form_view == "expanded")
            {
               if (all_ranks[week_index][sort_index[player_index]] == 1)
               {
                  background_color_class = " header_two_background";
                  bold_end               = "</B>";
                  bold_start             = "<B>";
                  font_color             = "color=" + color_blue;
               }
               else
               {
                  background_color_class = "";
                  bold_end               = "";
                  bold_start             = "";
                  font_color             = "";
               }

               if (weekly_picks[sort_index[player_index]].length > 0)
               {
                  d.writeln('<td class="'+border_class_1+background_color_class+'"><font style="font-size: 11pt" '+font_color+'>'+bold_start+all_ranks[week_index][sort_index[player_index]]+bold_end+'</font></td>');
               }
               else
               {
                  d.writeln('<td class="'+border_class_1+background_color_class+'"><font style="font-size: 11pt"><br></font></td>');
               }

               if (all_games_won[week_index][sort_index[player_index]] == weekly_max_games_won)
               {
                  background_color_class = " header_two_background";
                  bold_end               = "";
                  bold_start             = "";

                  // Change the background color if the player had a perfect score for the week (picked all games correctly).

                  if (all_games_won[week_index][sort_index[player_index]] == window.top.gv.all_home_teams[week_index].length)
                  {
                     background_color_class = " perfect_score_background";
                  }
               }
               else
               {
                  background_color_class = "";
                  bold_end               = "";
                  bold_start             = "";
               }

               d.writeln('<td class="'+border_class_1+background_color_class+'"><font style="font-size: 11pt">'+bold_start+all_games_won[week_index][sort_index[player_index]]+bold_end+'</font></td>');
            }

            if (all_scores[week_index][sort_index[player_index]] == player_low_scores[sort_index[player_index]])
            {
               background_color_class = " low_score_background";
               bold_end               = "";
               bold_start             = "";

               // Do this so that we only change the background color on the first occurrence of the low score.

               player_low_scores[sort_index[player_index]] = 999;
            }
            else if (all_scores[week_index][sort_index[player_index]] == weekly_max_score)
            {
               background_color_class = " header_two_background";
               bold_end               = "";
               bold_start             = "";
            }
            else
            {
               background_color_class = "";
               bold_end               = "";
               bold_start             = "";
            }

            d.writeln('<td class="'+border_class_3+background_color_class+'"><font style="font-size: 11pt">'+bold_start+all_scores[week_index][sort_index[player_index]]+bold_end+'</font></td>');
         }
         else
         {
            if (form_view == "expanded")
            {
               d.writeln('<td class='+border_class_1+'><font style="font-size: 11pt"><br></font></td>');
               d.writeln('<td class='+border_class_1+'><font style="font-size: 11pt"><br></font></td>');
            }

            d.writeln('<td class='+border_class_3+'><font style="font-size: 11pt"><br></font></td>');
         }
      }

      d.writeln('</tr>');  
      d.writeln('');    
   }

   d.writeln('<tr align=center style="line-height: 18px">');
   d.writeln('<td class="gb1_border" align=center nowrap><font style="font-size: 11pt"><b><br></b></font></td>');
   d.writeln('<td class="gr1_gb1_border" align=right  nowrap><font style="font-size: 11pt"><b>Totals:&nbsp;&nbsp;</b></font></td>');
   d.writeln('<td class="br2_gb1_border" align=center nowrap><font style="font-size: 11pt">'+total_games_played+'</font></td>');

   for (var player_index = 0; player_index < number_of_rs_players; player_index++)
   {
      if ((player_index + 1) == number_of_rs_players)
      {
         border_class_1 = "gb1_border";
      }
      else
      {
         border_class_1 = "br2_gb1_border";
      }

      if (form_view == "expanded")
      {
         background_color_class = "";
         bold_end               = "";
         bold_start             = "";
         font_color             = "color=black";

         if (total_ranks[sort_index[player_index]] == 1)
         {
            background_color_class = " header_two_background";
            bold_end      = "</b>";
            bold_start    = "<b>";
            font_color    = "color=" + color_blue;
         }

         d.writeln('<td class="gr1_gb1_border'+background_color_class+'"><font style="font-size: 11pt" '+font_color+'>'+bold_start+total_ranks[sort_index[player_index]]+bold_end+'</font></td>');

         background_color_class = "";
         bold_end               = "";
         bold_start             = "";

         player_total_games_won = total_games_won[sort_index[player_index]];

         if (player_total_games_won == best_total_games_won)
         {
            background_color_class = " header_two_background";
            bold_end               = "</b>";
            bold_start             = "<b>";
         }

         d.writeln('<td class="gr1_gb1_border'+background_color_class+'"><font style="font-size: 11pt">'+bold_start+player_total_games_won+bold_end+'</font></td>');
      }

      background_color_class = "";
      bold_end               = "";
      bold_start             = "";

      player_total_score = total_scores[sort_index[player_index]];

      if (player_total_score == best_total_scores)
      {
         background_color_class = " header_two_background";
         bold_end               = "</b>";
         bold_start             = "<b>";
      }

      d.writeln('<td class="'+border_class_1+background_color_class+'"><font style="font-size: 11pt">'+bold_start+player_total_score+bold_end+'</font></td>');
   }
   d.writeln('</tr>');
   d.writeln('');

   d.writeln('<tr align=center style="line-height: 18px">');
   d.writeln('<td class="bb2_border" align=center nowrap><font style="font-size: 11pt"><b><br></b></font></td>');
   d.writeln('<td class="br2_bb2_border" align=right colspan=2 nowrap><font style="font-size: 11pt"><b>Averages:&nbsp;&nbsp;</b></font></td>');

   for (var player_index = 0; player_index < number_of_rs_players; player_index++)
   {
      if ((player_index + 1) == number_of_rs_players)
      {
         border_class_1 = "bb2_border";
      }
      else
      {
         border_class_1 = "br2_bb2_border";
      }

      if (form_view == "expanded")
      {
         background_color_class = "";
         bold_end               = "";
         bold_start             = "";

         player_total_average_rank = total_average_ranks[sort_index[player_index]];

         if (player_total_average_rank == best_total_average_ranks)
         {
            background_color_class = " header_two_background";
            bold_end               = "</b>";
            bold_start             = "<b>";
         }

         if (player_total_average_rank != "<br>")
         {
            player_total_average_rank = normalize_float_value(player_total_average_rank);
         }

         d.writeln('<td class="gr1_bb2_border'+background_color_class+'"><font style="font-size: 11pt">'+bold_start+player_total_average_rank+bold_end+'</font></td>');

         background_color_class = "";
         bold_end               = "";
         bold_start             = "";

         player_total_games_won = total_games_won[sort_index[player_index]];

         if (player_total_games_won == best_total_games_won)
         {
            background_color_class = " header_two_background";
            bold_end               = "</b>";
            bold_start             = "<b>";
         }

         table_data = player_total_games_won / week;

         table_data = normalize_float_value(table_data);

         d.writeln('<td class="gr1_bb2_border'+background_color_class+'"><font style="font-size: 11pt">'+bold_start+table_data+bold_end+'</font></td>');
      }

      background_color_class = "";
      bold_end               = "";
      bold_start             = "";

      player_total_score = total_scores[sort_index[player_index]];

      if (player_total_score == best_total_scores)
      {
         background_color_class = " header_two_background";
         bold_end               = "</b>";
         bold_start             = "<b>";
      }

      if (week > 1)
      {
         // The low score has not been subtracted from the total score yet.

         table_data = player_total_score / (week - 1);
      }
      else
      {
         table_data = player_total_score / week;
      }

      table_data = normalize_float_value(table_data);

      d.writeln('<td class="'+border_class_1+background_color_class+'"><font style="font-size: 11pt">'+bold_start+table_data+bold_end+'</b></font></td>');
   }
   d.writeln('</tr>');
   d.writeln('');

   d.writeln('<tr align=right style="line-height: 16px">');
   d.writeln('<td class="br2_gb1_border" colspan=3><font style="font-size: 10pt">1st place count =&nbsp;</font></td>');
   for (var player_index = 0; player_index < number_of_rs_players; player_index++)
   {
      if ((player_index + 1) == number_of_rs_players)
      {
         border_class_1 = "gb1_border";
         border_class_2 = "gb1_border";
      }
      else
      {
         border_class_1 = "br2_gb1_border";
         border_class_2 = "br2_gb1_border";
      }

      if (form_view == "expanded")
      {
         border_class_1 = "gr1_gb1_border";
      }

      table_data = "<br>";

      if (total_1st_places[sort_index[player_index]] > 0) table_data = total_1st_places[sort_index[player_index]];

      if (table_data == max_1st_places)
      {
         bold_end   = "</b>";
         bold_start = "<b>";
         font_color = "color=" + color_green;
      }
      else
      {
         bold_end   = "";
         bold_start = "";
         font_color = "";
      }

      d.writeln('<td align=center class='+border_class_1+'><font style="font-size: 10pt" '+font_color+'>'+bold_start+table_data+bold_end+'</font></td>');

      if (form_view == "expanded")
      {
         d.writeln('<td><font style="font-size: 10pt"><br></font></td>');
         d.writeln('<td class='+border_class_2+'><font style="font-size: 10pt"><br></font></td>');
      }
   }
   d.writeln('</tr>');
   d.writeln('');

   d.writeln('<tr align=right style="line-height: 16px">');
   d.writeln('<td class="br2_gb1_border" colspan=3><font style="font-size: 10pt">2nd place count =&nbsp;</font></td>');
   for (var player_index = 0; player_index < number_of_rs_players; player_index++)
   {
      if ((player_index + 1) == number_of_rs_players)
      {
         border_class_1 = "gb1_border";
         border_class_2 = "gb1_border";
      }
      else
      {
         border_class_1 = "br2_gb1_border";
         border_class_2 = "br2_gb1_border";
      }

      if (form_view == "expanded")
      {
         border_class_1 = "gr1_gb1_border";
      }

      table_data = "<br>";

      if (total_2nd_places[sort_index[player_index]] > 0) table_data = total_2nd_places[sort_index[player_index]];

      if (table_data == max_2nd_places)
      {
         bold_end   = "</b>";
         bold_start = "<b>";
         font_color = "color=" + color_green;
      }
      else
      {
         bold_end   = "";
         bold_start = "";
         font_color = "";
      }

      d.writeln('<td align=center class='+border_class_1+'><font style="font-size: 10pt" '+font_color+'>'+bold_start+table_data+bold_end+'</font></td>');

      if (form_view == "expanded")
      {
         d.writeln('<td><font style="font-size: 10pt"><br></font></td>');
         d.writeln('<td class='+border_class_2+'><font style="font-size: 10pt"><br></font></td>');
      }
   }
   d.writeln('</tr>');
   d.writeln('');

   d.writeln('<tr align=right style="line-height: 16px">');
   d.writeln('<td class="br2_gb1_border" colspan=3><font style="font-size: 10pt">3rd place count =&nbsp;</font></td>');
   for (var player_index = 0; player_index < number_of_rs_players; player_index++)
   {
      if ((player_index + 1) == number_of_rs_players)
      {
         border_class_1 = "gb1_border";
         border_class_2 = "gb1_border";
      }
      else
      {
         border_class_1 = "br2_gb1_border";
         border_class_2 = "br2_gb1_border";
      }

      if (form_view == "expanded")
      {
         border_class_1 = "gr1_gb1_border";
      }

      table_data = "<br>";

      if (total_3rd_places[sort_index[player_index]] > 0) table_data = total_3rd_places[sort_index[player_index]];

      if (table_data == max_3rd_places)
      {
         bold_end   = "</b>";
         bold_start = "<b>";
         font_color = "color=" + color_green;
      }
      else
      {
         bold_end   = "";
         bold_start = "";
         font_color = "";
      }

      d.writeln('<td align=center class='+border_class_1+'><font style="font-size: 10pt" '+font_color+'>'+bold_start+table_data+bold_end+'</font></td>');

      if (form_view == "expanded")
      {
         d.writeln('<td><font style="font-size: 10pt"><br></font></td>');
         d.writeln('<td class='+border_class_2+'><font style="font-size: 10pt"><br></font></td>');
      }
   }
   d.writeln('</tr>');
   d.writeln('');

   d.writeln('<tr align=right style="line-height: 16px">');
   d.writeln('<td class="br2_gb1_border" colspan=3><font style="font-size: 10pt">Last place count =&nbsp;</font></td>');
   for (var player_index = 0; player_index < number_of_rs_players; player_index++)
   {
      if ((player_index + 1) == number_of_rs_players)
      {
         border_class_1 = "gb1_border";
         border_class_2 = "gb1_border";
      }
      else
      {
         border_class_1 = "br2_gb1_border";
         border_class_2 = "br2_gb1_border";
      }

      if (form_view == "expanded")
      {
         border_class_1 = "gr1_gb1_border";
      }

      table_data = "<br>";

      if (total_last_places[sort_index[player_index]] > 0) table_data = total_last_places[sort_index[player_index]];

      if (table_data == max_last_places)
      {
         bold_end   = "</b>";
         bold_start = "<b>";
         font_color = "color=" + color_red;
      }
      else
      {
         bold_end   = "";
         bold_start = "";
         font_color = "";
      }

      d.writeln('<td align=center class='+border_class_1+'><font style="font-size: 10pt" '+font_color+'>'+bold_start+table_data+bold_end+'</font></td>');

      if (form_view == "expanded")
      {
         d.writeln('<td><font style="font-size: 10pt"><br></font></td>');
         d.writeln('<td class='+border_class_2+'><font style="font-size: 10pt"><br></font></td>');
      }
   }
   d.writeln('</tr>');
   d.writeln('');

   d.writeln('<tr align=right style="line-height: 16px">');
   d.writeln('<td class="br2_border" colspan=3><font style="font-size: 10pt">Missed week count =&nbsp;</font></td>');
   for (var player_index = 0; player_index < number_of_rs_players; player_index++)
   {
      if ((player_index + 1) == number_of_rs_players)
      {
         border_class_1 = "no_border";
         border_class_2 = "no_border";
      }
      else
      {
         border_class_1 = "br2_border";
         border_class_2 = "br2_border";
      }

      if (form_view == "expanded")
      {
         border_class_1 = "gr1_border";
      }

      table_data = "<br>";

      if (total_missed_weeks[sort_index[player_index]] > 0) table_data = total_missed_weeks[sort_index[player_index]];

      if (table_data == max_missed_weeks)
      {
         bold_end   = "</b>";
         bold_start = "<b>";
         font_color = "color=" + color_red;
      }
      else
      {
         bold_end   = "";
         bold_start = "";
         font_color = "";
      }

      d.writeln('<td align=center class='+border_class_1+'><font style="font-size: 10pt" '+font_color+'>'+bold_start+table_data+bold_end+'</font></td>');

      if (form_view == "expanded")
      {
         d.writeln('<td class="gr1_border"><font style="font-size: 10pt"><br></font></td>');
         d.writeln('<td class='+border_class_2+'><font style="font-size: 10pt"><br></font></td>');
      }
   }
   d.writeln('</tr>');
   d.writeln('');

   d.writeln('</table>');
   d.writeln('');

   d.writeln('<table cols=1 align=center>');
   d.writeln('');

   d.writeln('<tr><td class="no_border" style="font-size: 2pt">&nbsp;</td></tr>');
   d.writeln('');

   d.writeln('<tr align=center>');
   d.writeln('<td nowrap class="no_border">');
   if (order_by == "players")
   {
      d.writeln('<input type="button" class="default_button border_radius" name="order_by_button" value="Order By Score"');
   }
   else
   {
      d.writeln('<input type="button" class="default_button border_radius" name="order_by_button" value="Order By Player"');
   }
   d.writeln('    onClick="change_order(document);return true;">');
   d.writeln('&nbsp;');
   if (form_view == "expanded")
   {
      d.writeln('<input type="button" class="default_button border_radius" name="view_button" value="Hide Rank and Games Won"');
   }
   else
   {
      d.writeln('<input type="button" class="default_button border_radius" name="view_button" value="Show Rank and Games Won"');
   }
   d.writeln('    onClick="change_view(document);return true;">');
   d.writeln('&nbsp;');
   d.writeln('<input type="button" class="default_button border_radius" name="close_button" value="Close"');
   d.writeln('    onClick="javascript:window.top.close();">');
   d.writeln('</td>');
   d.writeln('</tr>');
   d.writeln('');

   d.writeln('</table>');
   d.writeln('');

   d.writeln('</form>');
   d.writeln('');

   d.writeln('</center>');
   d.writeln('');
   d.writeln('');

   d.writeln('</body>');
   d.writeln('');

   d.writeln('</html>');

   d.getElementById("season_summary").scrollIntoView({block: "start", inline: "start"});

   adjust_mobile_viewport_height(d,"summary");

   d.close();

   return true;
}


function calculate_games_won(picks,weights,winners,number_of_rs_games)
{
   var games_won = 0;

   // Calculate number of games won for the current week.

   if (picks.length > 0)
   {
      for (var game_index = 0; game_index < number_of_rs_games; game_index++)
      {
         if ( (winners[game_index] != "0") && (picks[game_index] == winners[game_index]) )
         {
            games_won++;
         }
      }
   }
   else
   {
      games_won = 0;
   }

   return games_won;
}


function calculate_score(picks,weights,winners,number_of_rs_games)
{
   var score = 0;

   // Calculate scores for the current week.

   if (picks.length > 0)
   {
      for (var game_index = 0; game_index < number_of_rs_games; game_index++)
      {
         if ( (winners[game_index] != "0") && (picks[game_index] == winners[game_index]) )
         {
            score = score + (weights[game_index]-0);
         }
      }
   }
   else
   {
      score = 0;
   }

   return score;
}


function check_for_opener()
{
   var undefined;

   if ( (!window.top.gv) || window.top.gv == null || window.top.gv == undefined)
   {
      alert("This page will only work if it is opened from the Football Pool 'FORMS' page.\n" +
            "You will now be redirected to the Football Pool home page.  Once you're\n" +
            "there, click on 'FORMS', and then click on the desired link.");

      window.open("fp.html");

      return false;
   }

   return true;
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

   nfl_connection.open("GET","https://www.scrappintwins.com/cors/"+nfl_playoff_teams_url+"?nocache="+(new Date()).getTime(),true); // scrappintwins.com provided by Dan M.

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
                  alert("Unable to retrieve "+year+" NFL Playoff Teams.");

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


function normalize_float_value(received_float_value)
{
   var float_value         = received_float_value;
   var float_value_integer = "";
   var float_value_decimal = "";


   float_value = " " + float_value;

   decimal_position = float_value.indexOf(".") - 1;

   if (decimal_position > 0)
   {
      float_value = float_value.slice(1,float_value.length+1) + "#";

      pound_position = float_value.indexOf("#");

      if (pound_position-decimal_position == 3)
      {
         float_value = float_value.slice(0,float_value.length-1);
      }
      else if (pound_position-decimal_position == 2)
      {
         float_value = float_value.slice(0,float_value.length-1) + "0";
      }
      else if (pound_position-decimal_position == 1)
      {
         float_value = float_value.slice(0,float_value.length-1) + "00";
      }
      else if (pound_position-decimal_position > 3)
      {
         if (float_value.slice(decimal_position+3,decimal_position+4) >= 5)
         {
            if (float_value.slice(decimal_position+1,decimal_position+3) == 99)
            {
               float_value = ((float_value.slice(0,decimal_position) - 0) + 1) + ".00";
            }
            else
            {
               // Save the integer part of the float value (including the decimal point).

               float_value_integer = float_value.slice(0,decimal_position+1);

               // Save the two-digit decimal part of the float value.

               float_value_decimal = ((float_value.slice(decimal_position+1,decimal_position+3) - 0) + 1);

               // If the two-digit decimal value is less than ten, avoid losing the leading "0".

               if (float_value_decimal < 10) float_value_decimal = "0" + float_value_decimal;

               // Put the integer and decimal parts of the float value together.

               float_value = float_value_integer + float_value_decimal;
            }
         }
         else
         {
            float_value = float_value.slice(0,decimal_position+3);
         }
      }
   }
   else
   {
      float_value = float_value + ".00";
   }

   return float_value;
}


function process_nfl_playoff_teams(nfl_playoff_teams,year)
{
   var AFC_teams                    = null;
   var index_end                    = -1;
   var index_start                  = -1;
   var NFC_teams                    = null;
   var number_of_playoff_teams      = 0;
   var number_of_rs_weeks_completed = 0;
   var possible_team_record_indexes = [36,37,38,46,47,48,49,50];
   var team_losses                  = 0;
   var team_record                  = "";
   var team_record_index            = null;
   var team_ties                    = 0;
   var team_wins                    = 0;
   var tooltip                      = "";
   var tooltip_index_high           = 60;
   var tooltip_index_low            = 0;
   var total_team_record_games      = 0;


   // Special handling of playoff years 2011 and 2012 since the ESPN website says "No Data Available".

   if ( (year == 2011) || (year == 2012) )
   {
      var _2011_AFC_team_names   = ["New England Patriots","Baltimore Ravens","Houston Texans","Denver Broncos","Pittsburgh Steelers","Cincinnati Bengals"];
      var _2011_AFC_team_records = ["13-3",                "12-4",            "10-6",          "8-8",           "12-4",               "9-7"               ];
      var _2011_NFC_team_names   = ["Green Bay Packers","San Francisco 49ers","New Orleans Saints","New York Giants","Atlanta Falcons","Detroit Lions"];
      var _2011_NFC_team_records = ["15-1",             "13-3",               "13-3",              "9-7",            "10-6",           "10-6"         ];
      var _2012_AFC_team_names   = ["Denver Broncos","New England Patriots","Houston Texans","Baltimore Ravens","Indianapolis Colts","Cincinnati Bengals"];
      var _2012_AFC_team_records = ["13-3",          "12-4",                "12-4",          "10-6",            "11-5",              "10-6"              ];
      var _2012_NFC_team_names   = ["Atlanta Falcons","San Francisco 49ers","Green Bay Packers","Washington Redskins","Seattle Seahawks","Minnesota Vikings"];
      var _2012_NFC_team_records = ["13-3",           "11-4-1",             "11-5",             "10-6",               "11-5",            "10-6"             ];
      var AFC_team_names         = "";
      var AFC_team_records       = "";
      var NFC_team_names         = "";
      var NFC_team_records       = "";
      var short_team_name        = "";


      if (year == 2011)
      {
         AFC_team_names   = _2011_AFC_team_names;
         AFC_team_records = _2011_AFC_team_records;
         NFC_team_names   = _2011_NFC_team_names;
         NFC_team_records = _2011_NFC_team_records;
      }
      else
      {
         AFC_team_names   = _2012_AFC_team_names;
         AFC_team_records = _2012_AFC_team_records;
         NFC_team_names   = _2012_NFC_team_names;
         NFC_team_records = _2012_NFC_team_records;
      }

      for (var i = 0; i < AFC_team_names.length; i++)
      {
         // Update AFC and NFC HTML table cells with team logos and team records.

         short_team_name = AFC_team_names[i].split(" ").pop();
         tooltip         = AFC_team_names[i]

         document.getElementById("AFC_"+(i+1)).innerHTML = "<img src=\"Team Logos/"+short_team_name+".png\" title=\""+tooltip+"\"><br><span style=\"text-align: center\">"+AFC_team_records[i];

         short_team_name = NFC_team_names[i].split(" ").pop();
         tooltip         = NFC_team_names[i];

         document.getElementById("NFC_"+(i+1)).innerHTML = "<img src=\"Team Logos/"+short_team_name+".png\" title=\""+tooltip+"\"><br><span style=\"text-align: center\">"+NFC_team_records[i];
      }

      // Make AFC Playoff Teams and NFC Playoff Teams visible.

      document.getElementById("AFC_Playoff_Teams").style.visibility="visible";
      document.getElementById("NFC_Playoff_Teams").style.visibility="visible";

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

      document.getElementById("AFC_"+(i+1)).innerHTML = "<img src=\"Team Logos/"+AFC_teams.standings[i].team.shortDisplayName+".png\" title=\""+tooltip+"\"><br><span style=\"text-align: center\">"+
                                                        AFC_teams.standings[i].stats[team_record_index];

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

      document.getElementById("NFC_"+(i+1)).innerHTML = "<img src=\"Team Logos/"+NFC_teams.standings[i].team.shortDisplayName+".png\" title=\""+tooltip+"\"><br><span style=\"text-align: center\">"+
                                                        NFC_teams.standings[i].stats[team_record_index];
   }

   // Make AFC Playoff Teams and NFC Playoff Teams visible.

   document.getElementById("AFC_Playoff_Teams").style.visibility="visible";
   document.getElementById("NFC_Playoff_Teams").style.visibility="visible";

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
