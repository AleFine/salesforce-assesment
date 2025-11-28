import { LightningElement, api, wire, track } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { RefreshEvent } from 'lightning/refresh'; 
import { refreshApex } from '@salesforce/apex';

import getEngagementStats from '@salesforce/apex/EngagementController.getEngagementStats';
import createFollowUpTask from '@salesforce/apex/EngagementController.createFollowUpTask';

import ENGAGEMENT_NAME from '@salesforce/schema/Engagement__c.Name';

const FIELDS = [
    'Engagement__c.Name', 
    'Engagement__c.Related_Opportunity__r.Amount'
];

export default class EngagementSummary extends LightningElement {
    @api recordId;
    @track isProcessing = false;
    wiredEngagementResult;
    wiredStatsResult;

    // Wire para obtener datos del Engagement
    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredEngagement(result) {
        // gurdar el objeto completo
        this.wiredEngagementResult = result; 
    }

    // Wire para obtener estadísticas
    @wire(getEngagementStats, { engagementId: '$recordId' })
    wiredStats(result) {
        this.wiredStatsResult = result; 
    }

    // acceso a datos del engagement
    get engagement() {
        return this.wiredEngagementResult;
    }

    // acceso a las estadísticas
    get stats() {
        return this.wiredStatsResult;
    }

    // extraer monto del opportunity relacionado
    get oppAmount() {
        return getFieldValue(this.wiredEngagementResult.data, 'Engagement__c.Related_Opportunity__r.Amount');
    }
    
    get engagementName() {
        return getFieldValue(this.wiredEngagementResult.data, ENGAGEMENT_NAME);
    }

    async handleQuickFollowUp() {
        this.isProcessing = true;
        
        try {
            // crear la tarea
            await createFollowUpTask({ 
                engagementId: this.recordId,
                engagementName: this.engagementName || 'Engagement'
            });
            
            // mensaje de éxito
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Follow-up task created successfully',
                    variant: 'success',
                })
            );

            // refrescar componentes estándar
            this.dispatchEvent(new RefreshEvent());
            
            // refreshApex para actualizar los datos del wire
            await refreshApex(this.wiredStatsResult);
            
        } catch (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error creating task',
                    message: error.body ? error.body.message : error.message,
                    variant: 'error',
                })
            );
        } finally {
            this.isProcessing = false;
        }
    }
}