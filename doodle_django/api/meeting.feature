Feature: Meeting Creation
  Scenario: Creating a Meeting Successfully
    Given the user has access to the application
    When the user selects the option to create a new meeting
    Then the user should see a form to enter meeting details
    And the user can provide information, including:
      | Field              | Description                  | Requirement       |
      |--------------------|------------------------------|-------------------|
      | Title              | Meeting title                | Required          |
      | Description        | Meeting Description          | Not Required      |
      | Location           | Meeting Location             | Not Required      |
      | Video conferencing | Meeting Online               | Required          |
      | Duration           | Meeting Duration             | Required          |
      | Final Date         | Meeting Final Date Time      | Not Required      |
      | Start Date         | Meeting Start Date Time      | Required          |
      | End Date           | Meeting End Date Time        | Required          |
      | Creation Date      | Meeting Creation Date Time   | Server Generated  |
      | Passcode           | Meeting Owner Passcode       | Server Generated  |
      | TimeSlots          | Meeting Initial Timeslots    | Required          |
    When the user submits the form
    Then the meeting should be successfully created
    And the user should receive a confirmation message
  Scenario: Creating a Meeting Unsuccessfully with Incomplete Information
    Given the user has access to the application
    When the user selects the option to create a new meeting
    Then the user should see a form to enter meeting details
    And the user provides incomplete information, including:
      | Field              | Description                  | Provided          |
      |--------------------|------------------------------|-------------------|
      | Title              | Meeting title                | no                |
      | Description        | Meeting Description          | yes               |
      | Location           | Meeting Location             | yes               |
      | Video conferencing | Meeting Online               | yes               |
      | Duration           | Meeting Duration             | yes               |
      | Final Date         | Meeting Final Date Time      | no                |
      | Deadline           | Meeting Deadline             | yes               |
      | Creation Date      | Meeting Creation Date Time   | no                |
      | Passcode           | Meeting Owner Passcode       | no                |
      | TimeSlots          | Meeting Initial Timeslots    | yes               |
    When the user submits the form
    Then the user should see validation errors
    And the meeting should not be created
  Scenario: Creating a Meeting Unsuccessfully with a Past Deadline
    Given the user has access to the application
    When the user selects the option to create a new meeting
    And the user fills the deadline field with an already passed date
    When the user submits the form
    Then the user should see a validation error
    And the meeting should not be created
Feature: Meeting Modification
  Scenario: Modifying Meeting Details Successfully
    Given the user has access to the application
    When the user selects a meeting to modify
    Then the user should see a form pre-filled with the existing meeting details for editing
    And the user can make necessary corrections or updates
    When the user submits the form
    Then the meeting details should be updated successfully
  Scenario: Modifying Meeting Details Unsuccessfully with missing Required Information
    Given the user has access to the application
    When the user selects a meeting to modify
    Then the user should see a form pre-filled with the existing meeting details for editing
    And the user removes oen or more required field/s without providing new information
    When the user submits the form
    Then the modification should fail with validation errors
    And the meeting details should not be updated
Feature: Meeting Deletion
  Scenario: Deleting a Meeting Successfully
    Given the user has access to the application
    When the user selects a meeting to delete
    Then the user should see a confirmation prompt
    And the user confirms the deletion
    Then the meeting should be deleted from the system
  Scenario: Deleting a Meeting Unsuccessfully
    Given the user has access to the application
    When the user selects a meeting to delete
    Then the user should see a confirmation prompt
    And the user confirms the deletion
    Then the meeting should not be deleted from the system
    And the meeting is still visible in the user's dashboard
  Scenario: Deleting a Meeting Successfully Canceling
    Given the user has access to the application
    When the user selects a meeting to delete
    Then the user should see a confirmation prompt
    And the user cancels the deletion
    Then the meeting should not be deleted
Feature: Select the Final Date and Time for a Meeting
  Scenario: Selecting the Final Date and Time Successfully
    Given the user has access to the application
    When the user chooses a meeting to set the final date and time
    Then the user should see a list of available date and time options for the meeting, along with the corresponding number of participants who are available, unavailable, and may attend
    And the user can select the desired date and time for the meeting
    When the user submits the selection
    Then the meeting's date and time should be successfully updated
    And other participants should be restricted from making further changes
    And the meeting plan is finalized
  Scenario: Selecting the Final Date and Time Successfully but User Can Change Availability
    Given the user has access to the application
    When the user chooses a meeting to set the final date and time
    Then the user should see a list of available date and time options for the meeting, along with the corresponding number of participants who are available, unavailable, and may attend
    And the user can select the desired date and time for the meeting
    When the user submits the selection
    Then the meeting's date and time should be successfully updated
    And other participants should be notified of the new date and time
    And the user and other participants can still change their availability for the meeting
    And the meeting plan remains open for updates