// Timer Core Functionality
class Timer {
    constructor() {
        this.totalTime = 0; // Total timer duration in seconds
        this.remainingTime = 0; // Remaining time in seconds
        this.isRunning = false;
        this.isPaused = false;
        this.intervalId = null;
        this.startTime = null;
        this.pausedTime = 0;
        
        // Callbacks
        this.onTick = null; // Called every second
        this.onComplete = null; // Called when timer completes
        this.onStart = null; // Called when timer starts
        this.onPause = null; // Called when timer pauses
        this.onStop = null; // Called when timer stops
        this.onReset = null; // Called when timer resets
    }

    // Set the timer duration
    setTime(minutes, seconds = 0) {
        if (this.isRunning) {
            console.warn('Cannot set time while timer is running');
            return false;
        }
        
        this.totalTime = (minutes * 60) + seconds;
        this.remainingTime = this.totalTime;
        
        if (this.onTick) {
            this.onTick(this.remainingTime, this.totalTime);
        }
        
        return true;
    }

    // Start the timer
    start() {
        if (this.remainingTime <= 0) {
            console.warn('Cannot start timer with no time remaining');
            return false;
        }

        this.isRunning = true;
        this.isPaused = false;
        this.startTime = Date.now() - this.pausedTime;
        
        this.intervalId = setInterval(() => {
            this.tick();
        }, 1000);

        if (this.onStart) {
            this.onStart();
        }

        // Tick immediately
        this.tick();
        return true;
    }

    // Pause the timer
    pause() {
        if (!this.isRunning) {
            return false;
        }

        this.isRunning = false;
        this.isPaused = true;
        this.pausedTime = Date.now() - this.startTime;
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        if (this.onPause) {
            this.onPause();
        }

        return true;
    }

    // Stop the timer
    stop() {
        this.isRunning = false;
        this.isPaused = false;
        this.pausedTime = 0;
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        if (this.onStop) {
            this.onStop();
        }

        return true;
    }

    // Reset the timer
    reset() {
        this.stop();
        this.remainingTime = this.totalTime;
        this.pausedTime = 0;

        if (this.onReset) {
            this.onReset();
        }

        if (this.onTick) {
            this.onTick(this.remainingTime, this.totalTime);
        }

        return true;
    }

    // Internal tick function
    tick() {
        if (!this.isRunning) return;

        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        this.remainingTime = Math.max(0, this.totalTime - elapsed);

        if (this.onTick) {
            this.onTick(this.remainingTime, this.totalTime);
        }

        // Check if timer is complete
        if (this.remainingTime <= 0) {
            this.stop();
            if (this.onComplete) {
                this.onComplete();
            }
        }
    }

    // Get current progress as a percentage (0-1)
    getProgress() {
        if (this.totalTime === 0) return 0;
        return (this.totalTime - this.remainingTime) / this.totalTime;
    }

    // Get remaining time formatted as MM:SS
    getFormattedTime() {
        return Timer.formatTime(this.remainingTime);
    }

    // Get total time formatted as MM:SS
    getFormattedTotalTime() {
        return Timer.formatTime(this.totalTime);
    }

    // Static method to format seconds as MM:SS or HH:MM:SS
    static formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }

    // Get timer state
    getState() {
        return {
            totalTime: this.totalTime,
            remainingTime: this.remainingTime,
            isRunning: this.isRunning,
            isPaused: this.isPaused,
            progress: this.getProgress()
        };
    }

    // Save timer state to localStorage
    saveState() {
        const state = {
            totalTime: this.totalTime,
            remainingTime: this.remainingTime,
            isPaused: this.isPaused,
            pausedTime: this.pausedTime,
            startTime: this.startTime
        };
        localStorage.setItem('timerState', JSON.stringify(state));
    }

    // Load timer state from localStorage
    loadState() {
        try {
            const savedState = localStorage.getItem('timerState');
            if (savedState) {
                const state = JSON.parse(savedState);
                this.totalTime = state.totalTime || 0;
                this.remainingTime = state.remainingTime || 0;
                this.pausedTime = state.pausedTime || 0;
                this.startTime = state.startTime;
                this.isPaused = state.isPaused || false;
                
                // Don't auto-resume running timers
                this.isRunning = false;
                
                if (this.onTick) {
                    this.onTick(this.remainingTime, this.totalTime);
                }
                
                return true;
            }
        } catch (error) {
            console.error('Error loading timer state:', error);
        }
        return false;
    }
}
