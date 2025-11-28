# Salesforce Engagement Management Solution - EN

## Author
Kevin E. Parimango Gómez  

keving.kpg@gmail.com  

+51 929686486

## 1. What I Built

### Custom Objects
- **Engagement__c**: Custom object to manage consulting engagements

  - Fields: Account, Primary Contact, Related Opportunity, Status, Start Date, End Date, Budget  
  - Activities enabled to log calls, emails, and events  
  - A custom tab was added to the Sales app  

    <img src="screenshoots/general/engagement-object.png" alt="Engagement Object Model" width="600">

### Lightning Web Component (LWC)
- **engagementSummary**: Displays a summary of the engagement  
  - Shows the amount of the Related Opportunity  
  - Counts completed tasks and upcoming events  
  - Includes a **Quick Follow-Up Call** button to create follow-up tasks  
  - Location: [Go to the LWC directory](force-app/main/default/lwc/engagementSummary/)

    <img src="screenshoots/general/lwc-engagement-summary.png" alt="Engagement Object Model" width="600">

### Apex Classes
- **EngagementController**: Logic and data provider for the LWC  
  - Methods:
    - `getEngagementStats()`: Retrieves engagement data, opportunity amount, and counts of tasks/events  
    - `createFollowUpTask()`: Creates a follow-up task  
  - Location: [Go to EngagementController.cls](force-app/main/default/classes/EngagementController.cls)

### Flow Automation
- **Opportunity_Stage_Change_Create_Task**: Record-triggered Flow

  - **Trigger**: When the Stage changes to **Negotiation/Review** and the Opportunity has a related Engagement  
  - **Action**: Create a high-priority task assigned to the opportunity owner  
  - **Due Date**: Today + 2 days  
  - Includes a fault path for error handling  

    <img src="screenshoots/general/flow-opportunity-stage.png" alt="Flow Automation" width="500">

### Reports and Report Types
- **Custom Report Type**: *Engagements with Opportunities*  
  - Primary: Engagement  
  - Related: Opportunity and Account  

- **Report**: *Engagement Pipeline*  
  - Shows: Engagement Name, Account, Opportunity Name, Opportunity > Amount, Opportunity > Stage, Amount, Start Date
  - Chart: Bar chart showing Sum(Amount) by Status  

- **Dashboard**: *Engagement Analytics*  
  -  Vertical Bar Chart and Donut Chart
 
  [Go to Engagement Pipeline Report](#4-report--chart)

### List Views
- **My Open Engagements**: Engagements where Status ≠ Completed and Owner = current user  
- **Q Engagements by Account**: Engagements grouped by Account with a donut chart (Sum of Budget by Account)


  [Go to List Views](#5-list-view-chart)

### Lightning Record Page
- **Engagement Record Page**: Customized record page  
  - Includes: Highlights Panel, Related Lists (Activities), LWC engagementSummary  
  - Activated as default record page for the Engagement object  

  [Go to Lightning Record Page](#1-engagement-record-page--LWC)


## 2. Assumptions

1. **Opportunity Stage**: Using “Negotiation/Review”.  
2. **Business Days**: Adding 2 calendar days for simplicity; real business days would be handled with Apex.  
3. **Currency**: Default is USD.  

## 5. Manual Test Screenshots

## 1. Engagement record page + LWC

  <img src="screenshoots/assesment/1-engagement-record-page-lwc.png" alt="Engagement record page + LWC" width="900">

## 2. Activity Timeline (Logging a call / email / event)

  <img src="screenshoots/assesment/2-activity-timeline.png" alt="Activity Timeline" height="700">

## 3. Flow firing

Changing any Stage to **“Negotiation/Review”** triggers a Flow that creates a Task scheduled for 2 days later.

  ### Flow Debug:
  <img src="screenshoots/assesment/3-flow-a.png" alt="Flow debug" width="900">

  ### Successful execution (debug):
  ![Success flow execution](screenshoots/assesment/3-flow-b.png)

  ### Real test:

  #### Stage change: “Need Analysis” → “Negotiation/Review”
  ![Success flow execution](screenshoots/assesment/3-flow-c.png)

  #### Successful Task creation (Current date: 27/11; Scheduled for 29/11):
  ![Success flow execution](screenshoots/assesment/3-flow-d.png)

## 4. Report + Chart
  <img src="screenshoots/assesment/4-chart-1.png" alt="Report + Chart">

  ### Dashboard:
  <img src="screenshoots/assesment/4-chart-2.png" alt="Dashboard">

## 5. List view chart

  ### My Open Engagements 

  <img src="screenshoots/assesment/5-list-view-1.png" alt="My Open Engagements">

  ### Q Engagements by Account:

  <img src="screenshoots/assesment/5-list-view-2.png" alt="Engagements by Account">
