// Event Management System
class EventManager {
    constructor() {
        this.events = [];
        this.currentEvent = null;
        this.defaultEvents = [
            {
                id: 'default',
                name: 'Timer',
                startTime: 0,
                endTime: 300, // 5 minutes
                color: '#ff4444'
            }
        ];
        this.loadEvents();
    }

    // Add a new event
    addEvent(event) {
        const newEvent = {
            id: this.generateId(),
            name: event.name || 'Unnamed Event',
            startTime: Math.max(0, parseInt(event.startTime) || 0),
            endTime: Math.max(1, parseInt(event.endTime) || 60),
            color: event.color || '#ff4444'
        };

        // Validate that start time is less than end time
        if (newEvent.startTime >= newEvent.endTime) {
            newEvent.startTime = Math.max(0, newEvent.endTime - 1);
        }

        this.events.push(newEvent);
        this.sortEvents();
        this.saveEvents();
        return newEvent;
    }

    // Update an existing event
    updateEvent(id, updates) {
        const eventIndex = this.events.findIndex(e => e.id === id);
        if (eventIndex === -1) return null;

        const event = this.events[eventIndex];
        
        // Update properties
        if (updates.name !== undefined) event.name = updates.name;
        if (updates.startTime !== undefined) event.startTime = Math.max(0, parseInt(updates.startTime));
        if (updates.endTime !== undefined) event.endTime = Math.max(1, parseInt(updates.endTime));
        if (updates.color !== undefined) event.color = updates.color;

        // Validate that start time is less than end time
        if (event.startTime >= event.endTime) {
            event.startTime = Math.max(0, event.endTime - 1);
        }

        this.sortEvents();
        this.saveEvents();
        return event;
    }

    // Delete an event
    deleteEvent(id) {
        const initialLength = this.events.length;
        this.events = this.events.filter(e => e.id !== id);
        
        // Don't allow deleting all events
        if (this.events.length === 0) {
            this.events = [...this.defaultEvents];
        }
        
        this.saveEvents();
        return this.events.length < initialLength;
    }

    // Get event by ID
    getEvent(id) {
        return this.events.find(e => e.id === id) || null;
    }

    // Get all events
    getAllEvents() {
        return [...this.events];
    }

    // Get the current active event for a given time
    getCurrentEvent(elapsedSeconds, totalSeconds) {
        // Find the event that contains the current time
        for (const event of this.events) {
            if (elapsedSeconds >= event.startTime && elapsedSeconds < event.endTime) {
                return event;
            }
        }

        // If no event matches, return the first event or default
        return this.events[0] || this.defaultEvents[0];
    }

    // Get events that fit within a total duration
    getEventsForDuration(totalSeconds) {
        return this.events.filter(event => event.endTime <= totalSeconds);
    }

    // Generate events for a specific duration if none exist
    generateEventsForDuration(totalSeconds) {
        const validEvents = this.getEventsForDuration(totalSeconds);
        
        if (validEvents.length === 0) {
            // Create a default event that spans the entire duration
            return [{
                id: 'auto-generated',
                name: 'Timer',
                startTime: 0,
                endTime: totalSeconds,
                color: '#ff4444'
            }];
        }

        return validEvents;
    }

    // Sort events by start time
    sortEvents() {
        this.events.sort((a, b) => a.startTime - b.startTime);
    }

    // Generate a unique ID
    generateId() {
        return 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Save events to localStorage
    saveEvents() {
        try {
            localStorage.setItem('timerEvents', JSON.stringify(this.events));
        } catch (error) {
            console.error('Error saving events:', error);
        }
    }

    // Load events from localStorage
    loadEvents() {
        try {
            const savedEvents = localStorage.getItem('timerEvents');
            if (savedEvents) {
                this.events = JSON.parse(savedEvents);
                
                // Validate loaded events
                this.events = this.events.filter(event => 
                    event.id && 
                    event.name && 
                    typeof event.startTime === 'number' && 
                    typeof event.endTime === 'number' &&
                    event.color &&
                    event.startTime < event.endTime
                );
                
                // If no valid events, use defaults
                if (this.events.length === 0) {
                    this.events = [...this.defaultEvents];
                    this.saveEvents();
                }
                
                this.sortEvents();
                return true;
            }
        } catch (error) {
            console.error('Error loading events:', error);
        }
        
        // Use default events if loading fails
        this.events = [...this.defaultEvents];
        this.saveEvents();
        return false;
    }

    // Reset to default events
    resetToDefaults() {
        this.events = [...this.defaultEvents];
        this.saveEvents();
    }

    // Validate event data
    validateEvent(event) {
        const errors = [];
        
        if (!event.name || event.name.trim() === '') {
            errors.push('Event name is required');
        }
        
        if (typeof event.startTime !== 'number' || event.startTime < 0) {
            errors.push('Start time must be a non-negative number');
        }
        
        if (typeof event.endTime !== 'number' || event.endTime <= 0) {
            errors.push('End time must be a positive number');
        }
        
        if (event.startTime >= event.endTime) {
            errors.push('Start time must be less than end time');
        }
        
        if (!event.color || !/^#[0-9A-Fa-f]{6}$/.test(event.color)) {
            errors.push('Color must be a valid hex color');
        }
        
        return errors;
    }

    // Get event color for a specific time
    getColorForTime(elapsedSeconds, totalSeconds) {
        const event = this.getCurrentEvent(elapsedSeconds, totalSeconds);
        return event ? event.color : '#ff4444';
    }

    // Get event name for a specific time
    getNameForTime(elapsedSeconds, totalSeconds) {
        const event = this.getCurrentEvent(elapsedSeconds, totalSeconds);
        return event ? event.name : 'Timer';
    }

    // Check if events cover the full duration
    validateCoverage(totalSeconds) {
        const issues = [];
        const sortedEvents = [...this.events].sort((a, b) => a.startTime - b.startTime);
        
        // Check if we start from 0
        if (sortedEvents.length === 0 || sortedEvents[0].startTime > 0) {
            issues.push('No event covers the beginning of the timer');
        }
        
        // Check for gaps
        for (let i = 0; i < sortedEvents.length - 1; i++) {
            const current = sortedEvents[i];
            const next = sortedEvents[i + 1];
            
            if (current.endTime < next.startTime) {
                issues.push(`Gap between events at ${current.endTime}s - ${next.startTime}s`);
            }
        }
        
        // Check if we cover the full duration
        const lastEvent = sortedEvents[sortedEvents.length - 1];
        if (!lastEvent || lastEvent.endTime < totalSeconds) {
            issues.push('Events do not cover the full timer duration');
        }
        
        return issues;
    }
}
