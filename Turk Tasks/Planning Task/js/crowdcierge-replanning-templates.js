var requestTitle = 	{
					"replace"       : "Replace Activity <b>{0}</b> in Itinerary",

                    "stuck"         : "Add Activities close to Traveler to Itinerary",
                    
                    "delayed"       : "Traveler is delayed",
                    
                    "addMoreLike"   : "Add more Activities like {0} to Itinerary",
                    
                    "addNow"        : "Add something to the Itinerary for the Traveler to do now",
                    
                    "cantGo"        : "Traveler can't get to {0}, add something else to Itinerary",
                    
                    "custom"        : "A Traveler needs your help! Click to read."
                    }

var requestText =   {
                    "replace"       : "A traveler wants something to do instead of <b>{0}</b>. <ul><li><b>First, remove {0} from the itinerary.</b>  This is the activity the traveler doesn't want to do anymore. </li><li><b>Next, add a different activity in its place.</b> You can suggest a new activity to add or add an existing activity suggestion from the Brainstream.</li></ul>",
					
					"stuck"       : "A traveler is stuck and can't get to his next activity, <b>{0}</b>. <ul><li><b>First, remove {0} from the itinerary.</b>  This is the activity the traveler can't get to. </li><li><b>Next, add a different activity in its place.</b> You can suggest a new activity to add or add an existing activity suggestion from the Brainstream.</li></ul>",
                    
					"delayed"       : "A traveler is delayed and can't get to his next activity on time. <ul><li><b>Make his upcoming activities start at least 30 minutes later in the day, either by changing them or removing them.</b></li></ul>",
                    
					"addMoreLike"       : "A traveler wants his plan changed to add more activities like <b>{0}</b>. <ul><li><b>Add activities like {0} to the itinerary.</b> You can suggest a new activity to add or add an existing activity suggestion from the Brainstream.</li><li><b>If needed, move or remove some activities from the itinerary to make space.</b>. </li></ul>",
                    
					"addNow"       : "A traveler wants something to do right now. <ul><li><b>Add an activity near the traveler on the map that starts very soon to the Current Time on the calendar.</b> You can suggest a new activity to add or add an existing activity suggestion from the Brainstream.</li><li><b>If needed, move or remove activities to make room.</b></li></ul>",
                    
					"cantGo"       : "A traveler can't do their next planned activity, <b>{0}</b>. <ul><li><b>First, remove {0} from the itinerary.</b>  This is the activity the traveler says is closed or unavailable.</li><li><b>Next, add a different activity in its place.</b> You can suggest a new activity to add or add an existing activity suggestion from the Brainstream.</li></ul>",
					
					"custom"       : "A traveler needs your help to fix his trip plan.  Follow his instructions below: <ul><li><b> {2} </b></li></ul>",
                    }

var requestCheck = 	{
					"replace"       : "A traveler wants something to do instead of <b>{0}</b>.  Once the final plan meets the criteria below, you'll be able to submit.  <br/> <br/> <input type='checkbox' class='submitCheck'> I have removed the activity <b>{0}</b>. </input> <br/> <br/> <input type='checkbox' class='submitCheck'> I have added a new activity in its place, taking into account that the traveler likes these things: {1}. </input><br/> <br/> <input type='checkbox' class='submitCheck'> I have placed the activity at a proper time and location based on where the traveler is right now. </input><br/> <br/> <input type='checkbox' class='submitCheck'> I made a reasonable effort to help this traveler. </input><br/> <br/> ",
					
					"stuck"       : "A traveler is stuck and can't get to his next activity, <b>{0}</b>.  Once the final plan meets the criteria below, you'll be able to submit.  <br/> <br/> <input type='checkbox' class='submitCheck'> I have removed the activity <b>{0}</b>. </input> <br/> <br/> <input type='checkbox' class='submitCheck'> I have added a new activity in its place, taking into account that the traveler likes these things: {1}. </input><br/> <br/> <input type='checkbox' class='submitCheck'> I have placed the activity at a proper time and location based on where the traveler is right now. </input><br/> <br/> <input type='checkbox' class='submitCheck'> I made a reasonable effort to help this traveler. </input><br/> <br/> ",
                    
					"delayed"       : "A traveler is delayed and can't get to his next activity on time.  Once the final plan meets the criteria below, you'll be able to submit.  <br/> <br/> <input type='checkbox' class='submitCheck'> I have removed the activity <b>{0}</b>. </input> <br/> <br/> <input type='checkbox' class='submitCheck'> I have added a new activity in its place, taking into account that the traveler likes these things: {1}. </input><br/> <br/> <input type='checkbox' class='submitCheck'> I have placed the activity at a proper time and location based on where the traveler is right now. </input><br/> <br/> <input type='checkbox' class='submitCheck'> I made a reasonable effort to help this traveler. </input><br/> <br/> ",
                    
					"addMoreLike"       : "A traveler wants his plan changed to add more activities like <b>{0}</b>.  Once the final plan meets the criteria below, you'll be able to submit.  <br/> <br/> <input type='checkbox' class='submitCheck'> I have removed the activity <b>{0}</b>. </input> <br/> <br/> <input type='checkbox' class='submitCheck'> I have added a new activity in its place, taking into account that the traveler likes these things: {1}. </input><br/> <br/> <input type='checkbox' class='submitCheck'> I have placed the activity at a proper time and location based on where the traveler is right now. </input><br/> <br/> <input type='checkbox' class='submitCheck'> I made a reasonable effort to help this traveler. </input><br/> <br/> ",
                    
					"addNow"       : "A traveler wants something to do right now.  Once the final plan meets the criteria below, you'll be able to submit.  <br/> <br/> <input type='checkbox' class='submitCheck'> I have removed the activity <b>{0}</b>. </input> <br/> <br/> <input type='checkbox' class='submitCheck'> I have added a new activity in its place, taking into account that the traveler likes these things: {1}. </input><br/> <br/> <input type='checkbox' class='submitCheck'> I have placed the activity at a proper time and location based on where the traveler is right now. </input><br/> <br/> <input type='checkbox' class='submitCheck'> I made a reasonable effort to help this traveler. </input><br/> <br/> ",
                    
					"cantGo"       : "A traveler can't do their next planned activity, <b>{0}</b>.  Once the final plan meets the criteria below, you'll be able to submit.  <br/> <br/> <input type='checkbox' class='submitCheck'> I have removed the activity <b>{0}</b>. </input> <br/> <br/> <input type='checkbox' class='submitCheck'> I have added a new activity in its place, taking into account that the traveler likes these things: {1}. </input><br/> <br/> <input type='checkbox' class='submitCheck'> I have placed the activity at a proper time and location based on where the traveler is right now. </input><br/> <br/> <input type='checkbox' class='submitCheck'> I made a reasonable effort to help this traveler. </input><br/> <br/> ",
					
					"custom"       : "A traveler needs your help to fix his trip plan.  Once the final plan meets the criteria below, you'll be able to submit.  <br/> <br/> <input type='checkbox' class='submitCheck'> I have removed the activity <b>{0}</b>. </input> <br/> <br/> <input type='checkbox' class='submitCheck'> I have added a new activity in its place, taking into account that the traveler likes these things: {1}. </input><br/> <br/> <input type='checkbox' class='submitCheck'> I have placed the activity at a proper time and location based on where the traveler is right now. </input><br/> <br/> <input type='checkbox' class='submitCheck'> I made a reasonable effort to help this traveler. </input><br/> <br/> ",
					}

var keepInMind = "Keep the following in mind while you do the task:<ul><li><b>The traveler is located at the orange pin <img style='vertical-align:text-bottom' src='img/pin-user-2.png'/> on the map, and the <span style='background-color: rgba(255, 165, 0, 0.6)'>Current Time</span> is marked on the calendar.</b></li><li><b>He likes the following things: {0}.  Click \"reveal mission details\" at the top to learn more.</b>  The mission details explain what the traveler originally wanted on their trip. </li><li> Any reasonable effort to resolve the conflict will result in payment for this task.  </ul>"

var submissionInstructions = 'When you are finished, click the Submit button to see this again and confirm you solved the problem.';