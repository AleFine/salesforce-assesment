public with sharing class EngagementController {
    
    // método para estadisticas
    @AuraEnabled(cacheable=true)
    public static Map<String, Integer> getEngagementStats(Id engagementId) {
        Map<String, Integer> stats = new Map<String, Integer>();
        
        Integer completedTasks = [
            SELECT COUNT() 
            FROM Task 
            WHERE WhatId = :engagementId 
            AND Status = 'Completed'
        ];
        
        Integer upcomingEvents = [
            SELECT COUNT() 
            FROM Event 
            WHERE WhatId = :engagementId 
            AND StartDateTime > :Datetime.now()
        ];
        
        stats.put('completedTasks', completedTasks);
        stats.put('upcomingEvents', upcomingEvents);
        
        return stats;
    }
    
    // crear tarea de seguimiento
    @AuraEnabled
    public static Id createFollowUpTask(Id engagementId, String engagementName) {
        try {
            // calcular fecha de mañana
            Date tomorrow = Date.today().addDays(1);
            
            Task newTask = new Task();
            newTask.Subject = 'Follow-up on ' + engagementName;
            newTask.ActivityDate = tomorrow;
            newTask.WhatId = engagementId;  // relacionar al Engagement
            newTask.Type = 'Call';
            newTask.Status = 'Not Started';
            newTask.Priority = 'Normal';
            
            insert newTask;
            
            return newTask.Id;
            
        } catch (Exception e) {
            throw new AuraHandledException('Error creating task: ' + e.getMessage());
        }
    }
}