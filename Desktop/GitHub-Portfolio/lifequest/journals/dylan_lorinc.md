## 09/03/24
Final touches to visual design, code clean up, testing on all machines, documentation and linting for submission.

## 09/02/24
We met to flesh out some visual design choices and to clean up some code together

## 08/29/24
We continued to test our front-end from a users perspective and adjusting routing and error handling to ensure a smooth experience. Added a filtering method to our task list that removes a completed task from the default display and then when clicked shows all the completed tasks instead. Cleaned up code and errors/console logs. Feeling confident about our application thus far.

## 08/28/24
We updated some of our front end error handling, started adjusting the look and feel of componenets and incorporated custom fonts. Major modifications to the css and testing the user experience.

## 08/27/24
We fixed the issue with information persisting by having the front end explicitly fetch the users details when a component loads and explicitly dump them from the component when they signout. Adjusted routing for auth users and auth users to be more logical. Started adding CSS!

## 08/26/24
We got all of our components set up in the front end and tested their functionality thoroughly, did some stylization and changed our task detail form into a editing form component instead. Found error with old users information still persisting in some pages; began debugging and will resolve tomorrow.

## 08/23/24
We started working on our nav components and handling how people are routed around the application. Task list, task detail and creation and login/signup forms are in base structure established. Also established a testing container in docker that runs our tests when the container spins. Finished my unit tests which are ensuring the create a task route works and explicitly that if the user is not validate the request will be unsuccesful

## 08/22/24
Got our logout function working, thoroughly tested our front-end components and noticed that they were not persisting on refresh - resolved this issue and now user data correctly persists through refresh as long as they still have a valid cookie. Cleaned up some code. Adding the rest of our components over the enxt couple days and then stylizing.

## 08/21/24
We finished setting up our react/redux - all working correctly. SignIn, SignUp, TaskList and CreateTask components working correctly. Verified through database that all endpoints are working. added window confirm for delete and also tasks (to create more or be redirected to task list) modified update function to keep values the same if they are not changed.

## 08/20/24
We updated our backend to include "description" in our task tables and models, created a new request model to handle updates and implemented "COALESCE" into our db commands to handle updates better. We began installing and setting up redux and react and ironing out some front end design decisions; organizing our components to make more progress tomorrow.

## 08/19/24
We planned our front-end development for the week, double checked and tested our backend, implemented a delete function to delete user tasks and watched some tutorials together.

## 08/16/24
We resolved our issue with listing the tasks for a user by removing a redundant "UserTaskModel" model and schema that we had established in favor of "TaskResponse" and referenced the user by their "UserResponse" JWT data. Now in swagger, the function requires no parameters to "try" and returns an error if no user is logged in or they have no tasks. We updated the task detail to function similarly and be a nested route of "/tasks/mine" and adjusted our user detail view to use the JWT cookie as well. Then we implemented a task put function, borrowing logic from the create_task to update the tasks assigned to a user.

## 08/15/2024
Worked with the team to begin implementing a function that returns all of the tasks associated with a logged in user - still currently under construction with the intent of fixing and finishing tomorrow.

## 08/14/2024
Updated the task router to handle assignment to a user - the user must be logged in and authenticated to create a task. Tomorrow we focus on creating a function that returns all of the tasks registered to a user and begin working on implementing categories. Also updated task and user "get_by_id" functions to "get_user_by_id" and "get_task_by_id"

## 08/13/2024
Got our task router, query, model and schema implemented - tomorrow we focus on handling ensuring the task is assigned to the logged in and authenticated user

## 08/12/2024
Worked with the team to resolve the Get.Aethentication path error - was sending 500 internal server error. Originally we modified UserResponse to hold more parameters, today we reverted back to its original state and created a new FullUserResponse to hande detail driven fetches and views while leaving UserResponse specifically for auth and signin. Began working on the next big chunk: tasks. The team implemented a basic mode, and started on the router and query files. More on that tomorrow.

## 08/11/2024
Did some playing around with the endpoints in swagger and noticed that signin was not functioning correctly-- after some debugging found that after updating our models to contain more parameters, this was not reflected in the user response of the signin feature. Updated user response and after vigorous testing the function now works correctly.

## 08/09/2024
Worked with the team to resolve our issues regarding the signup function in our API - succesfully created a user and prepared our plan of attack for next week. Learned a lot about how our database works, a clearer idea of best practices going forward, and learned how to use PGAdmin to assist us with managing our database.

## 08/08/2024
Worked with the team on defining some of our database models and structures, began writing code for a route that allows us to view user detail(currently not functioning) and referenced routers/queries into relevant main - got access to our fastapi docs. Currently cannot create user... goal for tomorrow!

## 08/07/2024
Assisted solving the issue with getting our docker containers to run by creating our .env file and calling it in the environment function, establishing db user parameters for development


## 08/06/2024
From the fires of VSCode this journal was forged
