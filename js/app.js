// Main Application Controller
class ColorTimerApp {
    constructor() {
        this.timer = new Timer();
        this.eventManager = new EventManager();
        this.canvas = new CanvasTimer('timerCanvas');

        // UI Elements
        this.timeDisplay = document.getElementById('timeDisplay');
        this.phaseDisplay = document.getElementById('phaseDisplay');

        // Control buttons
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.resetBtn = document.getElementById('resetBtn');

        // Settings
        this.settingsBtn = document.getElementById('settingsBtn');
        this.settingsPanel = document.getElementById('settingsPanel');
        this.closeSettings = document.getElementById('closeSettings');

        // Timer inputs
        this.minutesInput = document.getElementById('minutesInput');
        this.secondsInput = document.getElementById('secondsInput');
        this.setCustomTimeBtn = document.getElementById('setCustomTime');

        // Events
        this.eventsList = document.getElementById('eventsList');
        this.addEventBtn = document.getElementById('addEventBtn');
        this.eventModal = document.getElementById('eventModal');
        this.closeModal = document.getElementById('closeModal');

        // Event form
        this.eventName = document.getElementById('eventName');
        this.eventStart = document.getElementById('eventStart');
        this.eventEnd = document.getElementById('eventEnd');
        this.eventColor = document.getElementById('eventColor');
        this.saveEvent = document.getElementById('saveEvent');
        this.cancelEvent = document.getElementById('cancelEvent');
        this.deleteEvent = document.getElementById('deleteEvent');

        // State
        this.currentEditingEvent = null;
        this.currentTimeUnit = null;
        this.isComplete = false;

        this.init();
    }

    init() {
        this.setupTimerCallbacks();
        this.bindEvents();
        this.loadInitialState();
        this.renderEventsList();
        this.updateDisplay();

        // Setup responsive canvas
        window.addEventListener('resize', () => {
            this.canvas.resize();
            this.updateCanvas();
        });

        console.log('Color Timer App initialized');
    }

    setupTimerCallbacks() {
        this.timer.onTick = (remaining, total) => {
            this.updateDisplay();
            this.updateCanvas();
            this.saveState();
        };

        this.timer.onComplete = () => {
            this.onTimerComplete();
        };

        this.timer.onStart = () => {
            this.updateControlButtons();
            document.body.classList.add('timer-running');
        };

        this.timer.onPause = () => {
            this.updateControlButtons();
            document.body.classList.remove('timer-running');
        };

        this.timer.onStop = () => {
            this.updateControlButtons();
            document.body.classList.remove('timer-running');
        };

        this.timer.onReset = () => {
            this.updateControlButtons();
            this.isComplete = false;
            document.body.classList.remove('timer-running', 'timer-finished');
            this.updateBackgroundColor(); // Update background when timer is reset
        };
    }

    bindEvents() {
        // Control buttons
        this.startBtn.addEventListener('click', () => this.startTimer());
        this.pauseBtn.addEventListener('click', () => this.pauseTimer());
        this.stopBtn.addEventListener('click', () => this.stopTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());

        // Settings
        this.settingsBtn.addEventListener('click', () => this.openSettings());
        this.closeSettings.addEventListener('click', () => this.closeSettingsPanel());

        // Custom time
        this.setCustomTimeBtn.addEventListener('click', () => this.setCustomTime());

        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const minutes = parseInt(e.target.dataset.minutes);
                const seconds = parseInt(e.target.dataset.seconds);
                this.setTimerTime(minutes, seconds);
                this.updatePresetButtons(e.target);
            });
        });

        // Events
        this.addEventBtn.addEventListener('click', () => this.openEventModal());
        this.closeModal.addEventListener('click', () => this.closeEventModal());
        this.saveEvent.addEventListener('click', () => this.saveEventData());
        this.cancelEvent.addEventListener('click', () => this.closeEventModal());
        this.deleteEvent.addEventListener('click', () => this.deleteEventData());

        // Color presets
        document.querySelectorAll('.color-preset').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const color = e.target.dataset.color;
                this.eventColor.value = color;
                this.updateColorPresets(e.target);
            });
        });

        // Close modals on backdrop click
        this.settingsPanel.addEventListener('click', (e) => {
            if (e.target === this.settingsPanel) {
                this.closeSettingsPanel();
            }
        });

        this.eventModal.addEventListener('click', (e) => {
            if (e.target === this.eventModal) {
                this.closeEventModal();
            }
        });

        // Close settings panel when clicking on main content area
        document.querySelector('.main-content').addEventListener('click', (e) => {
            // If event modal is open, close it
            if (!this.eventModal.classList.contains('hidden')) {
                this.closeEventModal();
            }
            // Otherwise, if settings panel is open, close it
            else if (!this.settingsPanel.classList.contains('hidden')) {
                this.closeSettingsPanel();
            }
        });

        // Also close settings panel when clicking on header (except settings button)
        document.querySelector('.header').addEventListener('click', (e) => {
            // Don't close if clicking the settings button itself
            if (!e.target.closest('#settingsBtn')) {
                // If event modal is open, close it
                if (!this.eventModal.classList.contains('hidden')) {
                    this.closeEventModal();
                }
                // Otherwise, if settings panel is open, close it
                else if (!this.settingsPanel.classList.contains('hidden')) {
                    this.closeSettingsPanel();
                }
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !e.target.matches('input, textarea')) {
                e.preventDefault();
                if (this.timer.isRunning) {
                    this.pauseTimer();
                } else if (this.timer.isPaused || this.timer.remainingTime > 0) {
                    this.startTimer();
                }
            }

            // ESC key to close modals
            if (e.code === 'Escape') {
                if (!this.eventModal.classList.contains('hidden')) {
                    this.closeEventModal();
                } else if (!this.settingsPanel.classList.contains('hidden')) {
                    this.closeSettingsPanel();
                }
            }
        });
    }

    loadInitialState() {
        // Load timer state
        this.timer.loadState();

        // Set default time if none loaded
        if (this.timer.totalTime === 0) {
            this.setTimerTime(30, 0); // Default 30 minutes - should show minutes unit
        }

        // Update inputs with current timer time
        const minutes = Math.floor(this.timer.totalTime / 60);
        const seconds = this.timer.totalTime % 60;
        this.minutesInput.value = minutes;
        this.secondsInput.value = seconds;

        // Initialize background color
        this.updateBackgroundColor();
    }

    // Timer control methods
    startTimer() {
        if (this.timer.remainingTime <= 0) {
            // Reset and start
            this.resetTimer();
        }
        this.timer.start();
    }

    pauseTimer() {
        this.timer.pause();
    }

    stopTimer() {
        this.timer.stop();
    }

    resetTimer() {
        this.timer.reset();
        // Clear any special content styling when resetting
        this.setNeutralContentColor();
    }

    setTimerTime(minutes, seconds) {
        this.timer.setTime(minutes, seconds);

        // Update event end times if they exceed new duration
        const totalSeconds = this.timer.totalTime;
        const events = this.eventManager.getAllEvents();
        let needsUpdate = false;

        events.forEach(event => {
            if (event.endTime > totalSeconds) {
                event.endTime = totalSeconds;
                needsUpdate = true;
            }
        });

        if (needsUpdate) {
            this.eventManager.saveEvents();
            this.renderEventsList();
        }
    }

    setCustomTime() {
        const minutes = parseInt(this.minutesInput.value) || 0;
        const seconds = parseInt(this.secondsInput.value) || 0;

        if (minutes === 0 && seconds === 0) {
            alert('Please enter a valid time');
            return;
        }

        this.setTimerTime(minutes, seconds);
        this.closeSettingsPanel();
        this.updatePresetButtons(null); // Clear preset selection
    }

    // Display update methods
    updateDisplay() {
        this.timeDisplay.textContent = this.timer.getFormattedTime();

        const elapsed = this.timer.totalTime - this.timer.remainingTime;
        const currentEvent = this.eventManager.getCurrentEvent(elapsed, this.timer.totalTime);
        this.phaseDisplay.textContent = currentEvent ? currentEvent.name : 'Ready';

        // Update page title
        if (this.timer.isRunning && this.timer.remainingTime > 0) {
            document.title = `${this.timer.getFormattedTime()} - Color Timer`;
        } else {
            document.title = 'Color Timer';
        }
    }

    updateCanvas() {
        const elapsed = this.timer.totalTime - this.timer.remainingTime;
        this.canvas.drawWithEvents(this.eventManager, elapsed, this.timer.totalTime);

        // Update background color based on current event
        this.updateBackgroundColor();
    }

    updateBackgroundColor() {
        // Keep background neutral - we'll color the main content instead
        this.resetBackgroundColor();

        // Update main content colors based on current event
        this.updateMainContentColors();
    }

    updateMainContentColors() {
        if (this.timer.isRunning && this.timer.totalTime > 0) {
            const elapsed = this.timer.totalTime - this.timer.remainingTime;
            const currentEvent = this.eventManager.getCurrentEvent(elapsed, this.timer.totalTime);

            if (currentEvent) {
                this.setMainContentColor(currentEvent.color);
            } else {
                // Timer running but no current event
                this.setNeutralContentColor();
            }
        } else {
            // Timer not running - neutral colors
            this.setNeutralContentColor();
        }
    }

    setMainContentColor(eventColor) {
        // Change the main app container to the current event color
        // For stage presentations - need strong, visible colors from distance
        const app = document.querySelector('.app');

        if (app) {
            // Use much more vibrant colors for stage visibility
            const lightColor = this.lightenColor(eventColor, 0.6); // More saturated - was 0.85
            const veryLightColor = this.lightenColor(eventColor, 0.75); // More saturated - was 0.95

            // Strong, visible gradient for stage use
            app.style.background = `linear-gradient(135deg, ${veryLightColor} 0%, ${lightColor} 100%)`;
            app.style.transition = 'background 0.8s ease-in-out';
            app.style.borderLeft = `8px solid ${eventColor}`; // Thicker border - was 6px
            app.style.boxShadow = `0 0 25px ${this.lightenColor(eventColor, 0.5)}`; // More prominent glow
        }

        // Keep canvas neutral but with accent color
        this.setCanvasAccentColor(eventColor);

        // Update header and other elements for better contrast with stronger colors
        this.updateElementsForEventColor(eventColor);
    }

    setCanvasAccentColor(eventColor) {
        // Canvas shows neutral colors but with event color accents
        if (this.canvas) {
            // Use a neutral gray for the main progress, but event color for accents
            this.canvas.progressColor = '#4a5568'; // Neutral gray
            this.canvas.backgroundColor = this.lightenColor(eventColor, 0.9); // Very subtle event color
            this.canvas.tickColor = this.darkenColor(eventColor, 0.2); // Event color for ticks
        }
    }

    updateElementsForEventColor(eventColor) {
        // Ensure text remains readable with stronger background colors
        const header = document.querySelector('.header');
        const timeDisplay = document.getElementById('timeDisplay');
        const phaseDisplay = document.getElementById('phaseDisplay');

        // Stronger header background for better contrast with vibrant colors
        if (header) {
            header.style.background = 'rgba(255, 255, 255, 0.98)'; // More opaque - was 0.95
            header.style.backdropFilter = 'blur(15px)'; // Stronger blur
            header.style.borderBottom = '1px solid rgba(0, 0, 0, 0.1)'; // Add separator
        }

        // Enhanced timer display contrast for stage visibility
        if (timeDisplay) {
            timeDisplay.style.color = '#1a202c'; // Darker text - was #2d3748
            timeDisplay.style.textShadow = '0 2px 4px rgba(255, 255, 255, 0.9)'; // Stronger shadow
            timeDisplay.style.fontWeight = 'bold'; // Make timer text bold
        }

        // Make phase display more prominent
        if (phaseDisplay) {
            phaseDisplay.style.color = this.darkenColor(eventColor, 0.3); // Darker version for contrast
            phaseDisplay.style.fontWeight = 'bold';
            phaseDisplay.style.fontSize = '1.1em'; // Slightly larger
            phaseDisplay.style.textShadow = '0 1px 2px rgba(255, 255, 255, 0.8)';
        }
    }

    setNeutralContentColor() {
        const app = document.querySelector('.app');
        const header = document.querySelector('.header');
        const timeDisplay = document.getElementById('timeDisplay');
        const phaseDisplay = document.getElementById('phaseDisplay');

        if (app) {
            app.style.background = 'rgba(255, 255, 255, 0.95)';
            app.style.transition = 'background 1s ease-in-out';
            app.style.borderLeft = 'none';
            app.style.boxShadow = '0 0 30px rgba(0, 0, 0, 0.1)';
        }

        // Reset header styling
        if (header) {
            header.style.background = 'rgba(255, 255, 255, 0.9)';
            header.style.backdropFilter = 'blur(10px)';
            header.style.borderBottom = '';
        }

        // Reset text styling
        if (timeDisplay) {
            timeDisplay.style.color = '';
            timeDisplay.style.textShadow = '';
            timeDisplay.style.fontWeight = '';
        }

        if (phaseDisplay) {
            phaseDisplay.style.color = '';
            phaseDisplay.style.fontWeight = '';
            phaseDisplay.style.fontSize = '';
            phaseDisplay.style.textShadow = '';
        }

        // Reset canvas colors
        if (this.canvas) {
            this.canvas.progressColor = '#ff4444';
            this.canvas.tickColor = '#333333';
            this.canvas.backgroundColor = '#f0f0f0';
        }
    }

    resetBackgroundColor() {
        // Keep neutral background always
        document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        document.body.style.transition = 'background 1s ease-in-out';
        document.body.style.animation = ''; // Clear any animations
    }

    lightenColor(color, amount) {
        // Convert hex color to RGB and lighten it
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        // Lighten by mixing with white
        const newR = Math.round(r + (255 - r) * amount);
        const newG = Math.round(g + (255 - g) * amount);
        const newB = Math.round(b + (255 - b) * amount);

        return `rgb(${newR}, ${newG}, ${newB})`;
    }

    darkenColor(color, amount) {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        // Darken by reducing RGB values
        const newR = Math.round(r * (1 - amount));
        const newG = Math.round(g * (1 - amount));
        const newB = Math.round(b * (1 - amount));

        return `rgb(${newR}, ${newG}, ${newB})`;
    }

    updateControlButtons() {
        this.startBtn.disabled = this.timer.isRunning;
        this.pauseBtn.disabled = !this.timer.isRunning;
        this.stopBtn.disabled = !this.timer.isRunning && !this.timer.isPaused;

        // Update button text
        if (this.timer.isPaused) {
            this.startBtn.textContent = 'Resume';
        } else if (this.timer.remainingTime <= 0 && !this.timer.isRunning) {
            this.startBtn.textContent = 'Start';
        } else {
            this.startBtn.textContent = 'Start';
        }
    }

    updatePresetButtons(activeBtn) {
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    // Settings panel methods
    openSettings() {
        this.settingsPanel.classList.remove('hidden');
        this.renderEventsList();
    }

    closeSettingsPanel() {
        this.settingsPanel.classList.add('hidden');
    }

    // Event management methods
    renderEventsList() {
        const events = this.eventManager.getAllEvents();
        this.eventsList.innerHTML = '';

        // Add bulk delete controls if there are multiple events
        if (events.length > 3) {
            this.addBulkDeleteControls();
        }

        events.forEach(event => {
            const eventEl = this.createEventElement(event);
            this.eventsList.appendChild(eventEl);
        });
    }

    createEventElement(event) {
        const eventEl = document.createElement('div');
        eventEl.className = 'event-item';
        eventEl.style.borderLeftColor = event.color;
        eventEl.dataset.eventId = event.id;

        eventEl.innerHTML = `
            <div class="event-content">
                <div class="event-info">
                    <div class="event-name">${event.name}</div>
                    <div class="event-time">${Timer.formatTime(event.startTime)} - ${Timer.formatTime(event.endTime)}</div>
                </div>
                <div class="event-color" style="background-color: ${event.color}"></div>
                <button class="quick-delete-btn" aria-label="Delete event">×</button>
            </div>
            <div class="delete-action">
                <button class="swipe-delete-btn">Delete</button>
            </div>
        `;

        this.setupEventInteractions(eventEl, event);
        return eventEl;
    }

    setupEventInteractions(eventEl, event) {
        const eventContent = eventEl.querySelector('.event-content');
        const deleteBtn = eventEl.querySelector('.quick-delete-btn');
        const swipeDeleteBtn = eventEl.querySelector('.swipe-delete-btn');

        // Quick delete button (desktop hover)
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.quickDeleteEvent(event);
        });

        // Swipe delete button
        swipeDeleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.quickDeleteEvent(event);
        });

        // Touch interactions for mobile
        this.setupTouchInteractions(eventEl, eventContent, event);

        // Click to edit (only if not swiped)
        eventContent.addEventListener('click', (e) => {
            if (!eventEl.classList.contains('swiped')) {
                this.editEvent(event);
            }
        });
    }

    setupTouchInteractions(eventEl, eventContent, event) {
        let startX = 0;
        let currentX = 0;
        let startTime = 0;
        let longPressTimer = null;
        let isDragging = false;

        // Touch start
        eventContent.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            currentX = startX;
            startTime = Date.now();
            isDragging = false;

            // Long press detection
            longPressTimer = setTimeout(() => {
                if (!isDragging && Math.abs(currentX - startX) < 10) {
                    this.handleLongPress(event);
                }
            }, 500);
        }, { passive: false });

        // Touch move
        eventContent.addEventListener('touchmove', (e) => {
            currentX = e.touches[0].clientX;
            const deltaX = currentX - startX;

            if (Math.abs(deltaX) > 10) {
                isDragging = true;
                clearTimeout(longPressTimer);

                // Only allow left swipe
                if (deltaX < 0) {
                    const swipeDistance = Math.min(Math.abs(deltaX), 80);
                    eventContent.style.transform = `translateX(-${swipeDistance}px)`;
                    eventContent.style.transition = 'none';

                    // Show delete action when swiped enough
                    if (swipeDistance > 40) {
                        eventEl.classList.add('swiped');
                    } else {
                        eventEl.classList.remove('swiped');
                    }
                }
            }
        }, { passive: false });

        // Touch end
        eventContent.addEventListener('touchend', (e) => {
            clearTimeout(longPressTimer);

            const deltaX = currentX - startX;
            const swipeThreshold = 60;

            if (deltaX < -swipeThreshold) {
                // Commit swipe
                eventContent.style.transform = 'translateX(-80px)';
                eventContent.style.transition = 'transform 0.2s ease';
                eventEl.classList.add('swiped');
            } else {
                // Reset position
                eventContent.style.transform = 'translateX(0)';
                eventContent.style.transition = 'transform 0.2s ease';
                eventEl.classList.remove('swiped');
            }
        });

        // Click outside to close swipe
        document.addEventListener('click', (e) => {
            if (!eventEl.contains(e.target)) {
                this.closeSwipedEvent(eventEl);
            }
        });
    }

    handleLongPress(event) {
        // Haptic feedback on mobile
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }

        // Show quick confirmation
        if (confirm(`Delete "${event.name}"?`)) {
            this.deleteEventQuickly(event);
        }
    }

    closeSwipedEvent(eventEl) {
        const eventContent = eventEl.querySelector('.event-content');
        eventContent.style.transform = 'translateX(0)';
        eventContent.style.transition = 'transform 0.2s ease';
        eventEl.classList.remove('swiped');
    }

    quickDeleteEvent(event) {
        // Visual feedback first
        const eventEl = document.querySelector(`[data-event-id="${event.id}"]`);
        if (eventEl) {
            eventEl.style.opacity = '0.5';
        }

        // Simple confirmation with undo option
        const confirmed = confirm(`Delete "${event.name}"?`);

        if (confirmed) {
            this.deleteEventQuickly(event);
        } else {
            // Restore visual state
            if (eventEl) {
                eventEl.style.opacity = '1';
                this.closeSwipedEvent(eventEl);
            }
        }
    }

    deleteEventQuickly(event) {
        // Store for potential undo
        this.lastDeletedEvent = event;

        // Delete the event
        this.eventManager.deleteEvent(event.id);
        this.renderEventsList();
        this.updateCanvas();

        // Show undo notification
        this.showUndoNotification();
    }

    showUndoNotification() {
        // Create undo toast
        const toast = document.createElement('div');
        toast.className = 'undo-toast';
        toast.innerHTML = `
            <span>Event deleted</span>
            <button class="undo-btn">Undo</button>
        `;

        document.body.appendChild(toast);

        // Position and show
        setTimeout(() => toast.classList.add('show'), 10);

        // Undo functionality
        const undoBtn = toast.querySelector('.undo-btn');
        undoBtn.addEventListener('click', () => {
            if (this.lastDeletedEvent) {
                this.eventManager.addEvent(this.lastDeletedEvent);
                this.renderEventsList();
                this.updateCanvas();
                this.lastDeletedEvent = null;
            }
            this.hideUndoNotification(toast);
        });

        // Auto hide after 4 seconds
        setTimeout(() => {
            this.hideUndoNotification(toast);
        }, 4000);
    }

    hideUndoNotification(toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    addBulkDeleteControls() {
        const bulkControls = document.createElement('div');
        bulkControls.className = 'bulk-controls';
        bulkControls.innerHTML = `
            <button class="bulk-delete-btn">Delete All Events</button>
        `;

        const deleteAllBtn = bulkControls.querySelector('.bulk-delete-btn');
        deleteAllBtn.addEventListener('click', () => {
            this.handleBulkDelete();
        });

        this.eventsList.appendChild(bulkControls);
    }

    handleBulkDelete() {
        const events = this.eventManager.getAllEvents();
        const confirmed = confirm(`Delete all ${events.length} events? This cannot be undone.`);

        if (confirmed) {
            // Store all events for potential undo
            this.lastDeletedEvents = [...events];

            // Clear all events
            events.forEach(event => {
                this.eventManager.deleteEvent(event.id);
            });

            this.renderEventsList();
            this.updateCanvas();

            // Show bulk undo notification
            this.showBulkUndoNotification();
        }
    }

    showBulkUndoNotification() {
        const toast = document.createElement('div');
        toast.className = 'undo-toast bulk-undo';
        toast.innerHTML = `
            <span>All events deleted</span>
            <button class="undo-btn">Undo All</button>
        `;

        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);

        const undoBtn = toast.querySelector('.undo-btn');
        undoBtn.addEventListener('click', () => {
            if (this.lastDeletedEvents) {
                this.lastDeletedEvents.forEach(event => {
                    this.eventManager.addEvent(event);
                });
                this.renderEventsList();
                this.updateCanvas();
                this.lastDeletedEvents = null;
            }
            this.hideUndoNotification(toast);
        });

        setTimeout(() => this.hideUndoNotification(toast), 5000);
    }

    openEventModal(event = null) {
        this.currentEditingEvent = event;

        // Determine the optimal time unit based on total timer duration
        // Ensure we have a reasonable minimum timer duration for unit calculation
        let totalSeconds = this.timer.totalTime;
        if (!totalSeconds || totalSeconds <= 0) {
            // If no timer is set, set a default 30-minute timer
            this.setTimerTime(30, 0);
            totalSeconds = this.timer.totalTime;
        }

        const timeUnit = this.getOptimalTimeUnit(totalSeconds);
        this.updateTimeUnitLabels(timeUnit);

        if (event) {
            document.getElementById('modalTitle').textContent = 'Edit Event';
            this.eventName.value = event.name;
            // Convert event times to relative units
            this.eventStart.value = this.convertSecondsToRelativeUnit(event.startTime, timeUnit);
            this.eventEnd.value = this.convertSecondsToRelativeUnit(event.endTime, timeUnit);
            this.eventColor.value = event.color;
            this.deleteEvent.classList.remove('hidden');
        } else {
            document.getElementById('modalTitle').textContent = 'Add Event';
            this.eventName.value = '';
            this.eventStart.value = 0;
            this.eventEnd.value = this.convertSecondsToRelativeUnit(totalSeconds, timeUnit);
            this.eventColor.value = '#ff4444';
            this.deleteEvent.classList.add('hidden');
        }

        // Store the current time unit for use in saveEventData
        this.currentTimeUnit = timeUnit;

        this.updateColorPresets();
        this.eventModal.classList.remove('hidden');
    }

    closeEventModal() {
        this.eventModal.classList.add('hidden');
        this.currentEditingEvent = null;
        this.currentTimeUnit = null;
    }

    editEvent(event) {
        this.openEventModal(event);
    }

    saveEventData() {
        const eventData = {
            name: this.eventName.value.trim(),
            // Convert relative unit values back to seconds
            startTime: this.convertRelativeUnitToSeconds(parseFloat(this.eventStart.value) || 0, this.currentTimeUnit),
            endTime: this.convertRelativeUnitToSeconds(parseFloat(this.eventEnd.value) || 0.1, this.currentTimeUnit),
            color: this.eventColor.value
        };

        // Ensure minimum values
        eventData.startTime = Math.max(0, eventData.startTime);
        eventData.endTime = Math.max(1, eventData.endTime);

        // Validate
        const errors = this.eventManager.validateEvent(eventData);
        if (errors.length > 0) {
            alert('Validation errors:\n' + errors.join('\n'));
            return;
        }

        if (this.currentEditingEvent) {
            this.eventManager.updateEvent(this.currentEditingEvent.id, eventData);
        } else {
            this.eventManager.addEvent(eventData);
        }

        this.renderEventsList();
        this.updateCanvas();
        this.closeEventModal();
    }

    deleteEventData() {
        if (this.currentEditingEvent && confirm('Are you sure you want to delete this event?')) {
            this.eventManager.deleteEvent(this.currentEditingEvent.id);
            this.renderEventsList();
            this.updateCanvas();
            this.closeEventModal();
        }
    }

    updateColorPresets(activeBtn = null) {
        document.querySelectorAll('.color-preset').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.color === this.eventColor.value) {
                btn.classList.add('active');
            }
        });
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    // Timer completion
    onTimerComplete() {
        this.isComplete = true;
        document.body.classList.add('timer-finished');

        // Special completion background color
        this.setCompletionBackground();

        // Play notification sound (if browser supports it)
        this.playNotificationSound();

        // Show browser notification
        this.showNotification();

        // Animate canvas
        this.canvas.animateCompletion();

        // Vibrate on mobile devices
        if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200, 100, 200]);
        }
    }

    setCompletionBackground() {
        // Keep background neutral, but make completion VERY visible for stage use
        this.resetBackgroundColor();

        // Make the app container unmistakably show completion
        const app = document.querySelector('.app');
        if (app) {
            // Strong completion colors - easily visible from distance
            app.style.background = 'linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 50%, #34d399 100%)';
            app.style.transition = 'background 0.5s ease-in-out';
            app.style.borderLeft = '10px solid #10b981'; // Very thick success border
            app.style.boxShadow = '0 0 40px rgba(16, 185, 129, 0.7)'; // Strong glow
            app.style.animation = 'completionPulse 2s ease-in-out infinite';
        }

        // Make completion text very prominent
        const phaseDisplay = document.getElementById('phaseDisplay');
        const timeDisplay = document.getElementById('timeDisplay');

        if (phaseDisplay) {
            phaseDisplay.style.color = '#065f46'; // Dark green
            phaseDisplay.style.fontWeight = 'bold';
            phaseDisplay.style.fontSize = '1.2em'; // Larger
        }

        if (timeDisplay) {
            timeDisplay.style.color = '#065f46'; // Dark green
            timeDisplay.style.fontWeight = 'bold';
        }

        // Set completion colors on canvas
        if (this.canvas) {
            this.canvas.progressColor = '#10b981';
            this.canvas.backgroundColor = '#a7f3d0';
            this.canvas.tickColor = '#065f46';
        }
    }

    playNotificationSound() {
        try {
            // Create a simple beep sound using Web Audio API
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.log('Could not play notification sound:', error);
        }
    }

    showNotification() {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Timer Complete!', {
                body: 'Your timer has finished.',
                icon: 'icons/icon-192x192.png',
                badge: 'icons/icon-192x192.png'
            });
        } else if ('Notification' in window && Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    this.showNotification();
                }
            });
        }
    }

    saveState() {
        this.timer.saveState();
    }

    // Helper functions for relative time units
    getOptimalTimeUnit(totalSeconds) {
        // Determine the best unit based on total timer duration
        // Examples:
        // - Timer 1min (60s) -> use seconds (mid event: start=30s, end=30s)
        // - Timer 30min (1800s) -> use minutes (mid event: start=15min, end=15min)
        // - Timer 1h (3600s) -> use minutes (quarter event: start=15min, end=15min)
        if (totalSeconds <= 120) { // 2 minutes or less
            return { unit: 'seconds', divisor: 1, label: 'seconds' };
        } else if (totalSeconds <= 7200) { // 2 hours or less
            return { unit: 'minutes', divisor: 60, label: 'minutes' };
        } else {
            return { unit: 'hours', divisor: 3600, label: 'hours' };
        }
    }

    convertSecondsToRelativeUnit(seconds, unit) {
        const { divisor, unit: unitType } = unit;
        const value = seconds / divisor;

        // Use different precision based on unit type
        if (unitType === 'seconds') {
            return Math.round(value); // Whole seconds
        } else {
            return Math.round(value * 10) / 10; // 1 decimal place for minutes/hours
        }
    }

    convertRelativeUnitToSeconds(value, unit) {
        const { divisor } = unit;
        return Math.round(value * divisor);
    }

    updateTimeUnitLabels(unit) {
        // Use setTimeout to ensure DOM is ready
        setTimeout(() => {
            const startLabel = document.getElementById('startTimeUnit');
            const endLabel = document.getElementById('endTimeUnit');
            const totalSeconds = this.timer.totalTime || 300;
            const totalInUnit = this.convertSecondsToRelativeUnit(totalSeconds, unit);

            if (startLabel) {
                startLabel.textContent = `(${unit.label}, total: ${totalInUnit}${unit.label === 'seconds' ? 's' : unit.label === 'minutes' ? 'm' : 'h'})`;
            }
            if (endLabel) {
                endLabel.textContent = `(${unit.label}, total: ${totalInUnit}${unit.label === 'seconds' ? 's' : unit.label === 'minutes' ? 'm' : 'h'})`;
            }

            // Update input step values based on unit
            const stepValue = unit.unit === 'seconds' ? '1' : '0.1';
            if (this.eventStart) {
                this.eventStart.step = stepValue;
                this.eventStart.min = '0';
            }
            if (this.eventEnd) {
                this.eventEnd.step = stepValue;
                this.eventEnd.min = unit.unit === 'seconds' ? '1' : '0.1';
            }
        }, 0);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.colorTimer = new ColorTimerApp();

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
});
