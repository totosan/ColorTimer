// Canvas Drawing System for Circular Timer
class CanvasTimer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.radius = Math.min(this.centerX, this.centerY) - 20;

        // Drawing properties
        this.lineWidth = 12;
        this.backgroundColor = '#f0f0f0';
        this.progressColor = '#ff4444';
        this.tickColor = '#333333';

        // Animation properties
        this.animationId = null;
        this.isAnimating = false;

        // Setup canvas for high DPI displays
        this.setupHighDPI();

        // Initial draw
        this.draw(0, 1, this.progressColor, 'Ready');
    }

    // Setup canvas for high DPI displays
    setupHighDPI() {
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        // Set actual size in memory (scaled to account for extra pixel density)
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;

        // Scale the drawing context so everything draws at the correct size
        this.ctx.scale(dpr, dpr);

        // Set display size (css pixels)
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';

        // Recalculate center and radius
        this.centerX = rect.width / 2;
        this.centerY = rect.height / 2;
        this.radius = Math.min(this.centerX, this.centerY) - 20;
    }

    // Main drawing function
    draw(progress, totalProgress, color, phase) {
        this.clearCanvas();
        this.drawBackground();
        this.drawTicks();
        this.drawProgress(progress, color);
        this.drawCenterCircle();

        // Add subtle glow effect when running
        if (progress > 0 && progress < 1) {
            this.drawGlow(color);
        }
    }

    // Clear the entire canvas
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Draw the background circle
    drawBackground() {
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
        this.ctx.strokeStyle = this.backgroundColor;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.stroke();
    }

    // Draw progress arc
    drawProgress(progress, color) {
        if (progress <= 0) return;

        this.ctx.beginPath();
        const startAngle = -Math.PI / 2; // Start at top
        const endAngle = startAngle + (2 * Math.PI * progress);

        this.ctx.arc(this.centerX, this.centerY, this.radius, startAngle, endAngle);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();
    }

    // Draw tick marks around the circle
    drawTicks() {
        const tickCount = 60; // One tick per second for a minute, or every minute for an hour
        this.ctx.strokeStyle = this.tickColor;
        this.ctx.lineWidth = 1;

        for (let i = 0; i < tickCount; i++) {
            const angle = (i / tickCount) * 2 * Math.PI - Math.PI / 2;
            const isMainTick = i % 5 === 0; // Every 5th tick is longer

            const innerRadius = this.radius - (isMainTick ? 15 : 8);
            const outerRadius = this.radius - 3;

            const x1 = this.centerX + Math.cos(angle) * innerRadius;
            const y1 = this.centerY + Math.sin(angle) * innerRadius;
            const x2 = this.centerX + Math.cos(angle) * outerRadius;
            const y2 = this.centerY + Math.sin(angle) * outerRadius;

            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }
    }

    // Draw center circle
    drawCenterCircle() {
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, 15, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#333333';
        this.ctx.fill();

        // Inner circle
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, 8, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fill();
    }

    // Draw glow effect
    drawGlow(color) {
        this.ctx.save();
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = 20;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius + 5, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.restore();
    }

    // Draw multiple color segments for events with gradients
    drawEventSegments(events, totalSeconds, elapsedSeconds) {
        this.clearCanvas();
        this.drawBackground();
        this.drawTicks();

        // Sort events by start time
        const sortedEvents = [...events].sort((a, b) => a.startTime - b.startTime);

        // Create segments with gradients
        const segments = this.createEventSegmentsWithGradients(sortedEvents, totalSeconds);

        // Draw each segment (only up to elapsed time)
        for (const segment of segments) {
            const startProgress = segment.startTime / totalSeconds;
            const endProgress = Math.min(segment.endTime / totalSeconds, elapsedSeconds / totalSeconds);

            // Only draw if there's actual progress to show
            if (endProgress > startProgress && elapsedSeconds > segment.startTime) {
                if (segment.isGradient) {
                    this.drawGradientSegment(startProgress, endProgress, segment.startColor, segment.endColor);
                } else {
                    this.drawSegment(startProgress, endProgress, segment.color);
                }
            }
        }

        // Draw current position indicator (black tick)
        this.drawCurrentPositionTick(elapsedSeconds, totalSeconds);

        this.drawCenterCircle();

        // Add start and end markers for events
        this.drawEventStartEndMarkers(sortedEvents, totalSeconds);

        // Add glow for current active segment
        const currentEvent = events.find(e =>
            elapsedSeconds >= e.startTime && elapsedSeconds < e.endTime
        );

        if (currentEvent && elapsedSeconds > 0) {
            this.drawGlow(currentEvent.color);
        }
   }

    // Draw a colored segment
    drawSegment(startProgress, endProgress, color) {
        if (endProgress <= startProgress) return;

        this.ctx.beginPath();
        const startAngle = -Math.PI / 2 + (2 * Math.PI * startProgress);
        const endAngle = -Math.PI / 2 + (2 * Math.PI * endProgress);

        this.ctx.arc(this.centerX, this.centerY, this.radius, startAngle, endAngle);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();
    }

    // Draw a gradient segment using canvas gradient
    drawGradientSegment(startProgress, endProgress, startColor, endColor) {
        if (endProgress <= startProgress) return;

        const startAngle = -Math.PI / 2 + (2 * Math.PI * startProgress);
        const endAngle = -Math.PI / 2 + (2 * Math.PI * endProgress);

        // For small segments, use simple color interpolation
        if (endProgress - startProgress < 0.02) { // Less than 2% of the circle
            const midColor = this.getGradientColor(startColor, endColor, 0.5);
            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY, this.radius, startAngle, endAngle);
            this.ctx.strokeStyle = midColor;
            this.ctx.lineWidth = this.lineWidth;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();
            return;
        }

        // For larger segments, use multiple small steps for smooth gradient
        const steps = Math.max(20, Math.floor((endProgress - startProgress) * 200));
        const angleStep = (endAngle - startAngle) / steps;

        this.ctx.lineWidth = this.lineWidth;
        this.ctx.lineCap = 'round';

        // Draw gradient by creating many small segments
        for (let i = 0; i < steps; i++) {
            const progress = i / (steps - 1);
            const segmentStartAngle = startAngle + (angleStep * i);
            const segmentEndAngle = startAngle + (angleStep * (i + 1));

            // Calculate gradient color for this segment
            const segmentColor = this.getGradientColor(startColor, endColor, progress);

            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY, this.radius, segmentStartAngle, segmentEndAngle);
            this.ctx.strokeStyle = segmentColor;
            this.ctx.stroke();
        }
    }

    // Animate completion
    animateCompletion(callback) {
        if (this.isAnimating) return;

        this.isAnimating = true;
        let pulseCount = 0;
        const maxPulses = 6;

        const pulse = () => {
            const scale = 1 + 0.1 * Math.sin(pulseCount * Math.PI);
            this.canvas.style.transform = `scale(${scale})`;

            pulseCount += 0.3;

            if (pulseCount < maxPulses) {
                this.animationId = requestAnimationFrame(pulse);
            } else {
                this.canvas.style.transform = 'scale(1)';
                this.isAnimating = false;
                if (callback) callback();
            }
        };

        pulse();
    }

    // Stop any ongoing animation
    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.isAnimating = false;
        this.canvas.style.transform = 'scale(1)';
    }

    // Update colors
    setColors(background, tick) {
        this.backgroundColor = background || '#f0f0f0';
        this.tickColor = tick || '#333333';
    }

    // Set progress color
    setProgressColor(color) {
        this.progressColor = color;
    }

    // Set event-based colors for the canvas
    setEventColors(eventColor) {
        if (eventColor) {
            // Use event color for progress and styling
            this.progressColor = eventColor;
            this.tickColor = this.darkenColor(eventColor, 0.3); // Darker for better contrast
            this.backgroundColor = this.lightenColor(eventColor, 0.8); // Light background ring
        } else {
            // Reset to neutral colors
            this.progressColor = '#ff4444';
            this.tickColor = '#333333';
            this.backgroundColor = '#f0f0f0';
        }

        // Force a redraw with current progress
        // This will be called by the main app during updates
    }

    // Darken a color by a given amount
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

    // Lighten a color by a given amount (move toward white)
    lightenColor(color, amount) {
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

    // Resize canvas (useful for responsive design)
    resize() {
        this.setupHighDPI();
    }

    // Convert hex color to RGB
    hexToRgb(hex) {
        // Handle different color formats
        if (hex.startsWith('rgb')) {
            const match = hex.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (match) {
                return {
                    r: parseInt(match[1], 10),
                    g: parseInt(match[2], 10),
                    b: parseInt(match[3], 10)
                };
            }
        }

        // Handle hex format
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // Create gradient color based on progress
    getGradientColor(startColor, endColor, progress) {
        const start = this.hexToRgb(startColor);
        const end = this.hexToRgb(endColor);

        if (!start || !end) return startColor;

        const r = Math.round(start.r + (end.r - start.r) * progress);
        const g = Math.round(start.g + (end.g - start.g) * progress);
        const b = Math.round(start.b + (end.b - start.b) * progress);

        return `rgb(${r}, ${g}, ${b})`;
    }

    // Draw with events - show event segments with gradients
    drawWithEvents(eventManager, elapsedSeconds, totalSeconds) {
        if (totalSeconds <= 0) {
            this.draw(0, 1, this.progressColor, 'Ready');
            return;
        }

        // Get events for the current duration
        const events = eventManager.getEventsForDuration(totalSeconds);

        if (events.length === 0) {
            // Fallback to simple progress if no events
            const overallProgress = elapsedSeconds / totalSeconds;
            this.draw(overallProgress, 1, this.progressColor, 'Timer');
            return;
        }

        // Use the new event segments with gradients
        this.drawEventSegments(events, totalSeconds, elapsedSeconds);
    }

    // Draw small markers to show where events begin/end
    drawEventMarkers(events, totalSeconds) {
        if (events.length === 0) return;

        this.ctx.save();

        events.forEach(event => {
            // Draw start marker
            this.drawEventMarker(event.startTime / totalSeconds, event.color, true);
            // Draw end marker
            this.drawEventMarker(event.endTime / totalSeconds, event.color, false);
        });

        this.ctx.restore();
    }

    // Draw a small marker at a specific position
    drawEventMarker(progress, color, isStart) {
        const angle = -Math.PI / 2 + (2 * Math.PI * progress);
        const markerRadius = this.radius + (isStart ? 8 : 5);
        const markerSize = isStart ? 4 : 2;

        const x = this.centerX + Math.cos(angle) * markerRadius;
        const y = this.centerY + Math.sin(angle) * markerRadius;

        this.ctx.beginPath();
        this.ctx.arc(x, y, markerSize, 0, 2 * Math.PI);
        this.ctx.fillStyle = color;
        this.ctx.fill();

        // Add a subtle outline for visibility
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }

    // Draw start and end markers for events
    drawEventStartEndMarkers(events, totalSeconds) {
        if (events.length === 0) return;

        this.ctx.save();

        events.forEach(event => {
            // Draw start marker (larger, filled circle)
            this.drawEventMarker(event.startTime / totalSeconds, event.color, true, 'start');
            // Draw end marker (smaller, outline circle)
            this.drawEventMarker(event.endTime / totalSeconds, event.color, false, 'end');
        });

        this.ctx.restore();
    }

    // Enhanced event marker drawing
    drawEventMarker(progress, color, isStart, type) {
        const angle = -Math.PI / 2 + (2 * Math.PI * progress);
        const markerRadius = this.radius + (isStart ? 15 : 12);
        const markerSize = isStart ? 6 : 4;

        const x = this.centerX + Math.cos(angle) * markerRadius;
        const y = this.centerY + Math.sin(angle) * markerRadius;

        this.ctx.beginPath();
        this.ctx.arc(x, y, markerSize, 0, 2 * Math.PI);

        if (isStart) {
            // Start marker: filled circle with border
            this.ctx.fillStyle = color;
            this.ctx.fill();
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        } else {
            // End marker: outline circle
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
            // Small inner dot
            this.ctx.beginPath();
            this.ctx.arc(x, y, 1, 0, 2 * Math.PI);
            this.ctx.fillStyle = color;
            this.ctx.fill();
        }

        // Add subtle shadow for depth
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        this.ctx.shadowBlur = 3;
        this.ctx.shadowOffsetX = 1;
        this.ctx.shadowOffsetY = 1;

        // Reset shadow
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
    }

    // Create segments with gradients for gaps and overlaps
    createEventSegmentsWithGradients(sortedEvents, totalSeconds) {
        const segments = [];

        // Handle the case when there are no events
        if (sortedEvents.length === 0) {
            return segments;
        }

        let currentTime = 0;
        const defaultColor = '#f0f0f0';

        for (let i = 0; i < sortedEvents.length; i++) {
            const currentEvent = sortedEvents[i];
            const nextEvent = i < sortedEvents.length - 1 ? sortedEvents[i + 1] : null;

            // Add gradient from current time to current event start if there's a gap
            if (currentTime < currentEvent.startTime) {
                const prevColor = i === 0 ? defaultColor : sortedEvents[i - 1].color;

                segments.push({
                    startTime: currentTime,
                    endTime: currentEvent.startTime,
                    isGradient: true,
                    startColor: prevColor,
                    endColor: currentEvent.color
                });
            }

            // Add the actual event (only non-overlapping part)
            const eventStart = Math.max(currentEvent.startTime, currentTime);
            let eventEnd = currentEvent.endTime;

            // Check for overlap with next event
            if (nextEvent && currentEvent.endTime > nextEvent.startTime) {
                // Event overlaps with next event
                eventEnd = nextEvent.startTime;

                // Add the non-overlapping part of current event
                if (eventEnd > eventStart) {
                    segments.push({
                        startTime: eventStart,
                        endTime: eventEnd,
                        isGradient: false,
                        color: currentEvent.color
                    });
                }

                // Add gradient for the overlapping region
                const overlapStart = nextEvent.startTime;
                const overlapEnd = Math.min(currentEvent.endTime, nextEvent.endTime);

                if (overlapEnd > overlapStart) {
                    segments.push({
                        startTime: overlapStart,
                        endTime: overlapEnd,
                        isGradient: true,
                        startColor: currentEvent.color,
                        endColor: nextEvent.color
                    });
                }

                currentTime = overlapEnd;
            } else {
                // No overlap, add the full event
                if (eventEnd > eventStart) {
                    segments.push({
                        startTime: eventStart,
                        endTime: eventEnd,
                        isGradient: false,
                        color: currentEvent.color
                    });
                }

                currentTime = eventEnd;
            }
        }

        // Add gradient from last event to end if needed
        if (currentTime < totalSeconds) {
            const lastEvent = sortedEvents[sortedEvents.length - 1];
            segments.push({
                startTime: currentTime,
                endTime: totalSeconds,
                isGradient: true,
                startColor: lastEvent.color,
                endColor: defaultColor
            });
        }

        return segments;
    }

    // Get current color at specific time position
    getCurrentColor(events, elapsedSeconds, totalSeconds) {
        if (totalSeconds <= 0) return this.progressColor;

        const sortedEvents = [...events].sort((a, b) => a.startTime - b.startTime);
        const segments = this.createEventSegmentsWithGradients(sortedEvents, totalSeconds);

        // Find the segment that contains the current time
        for (const segment of segments) {
            if (elapsedSeconds >= segment.startTime && elapsedSeconds < segment.endTime) {
                if (segment.isGradient) {
                    // Calculate position within gradient
                    const segmentProgress = (elapsedSeconds - segment.startTime) / (segment.endTime - segment.startTime);
                    return this.getGradientColor(segment.startColor, segment.endColor, segmentProgress);
                } else {
                    return segment.color;
                }
            }
        }

        // Fallback to default color
        return this.progressColor;
    }

    // Draw current position indicator (black tick)
    drawCurrentPositionTick(elapsedSeconds, totalSeconds) {
        if (totalSeconds <= 0 || elapsedSeconds <= 0) return;

        const progress = elapsedSeconds / totalSeconds;
        const angle = -Math.PI / 2 + (2 * Math.PI * progress);

        this.ctx.save();

        // Draw a prominent black tick at current position
        const innerRadius = this.radius - 25;
        const outerRadius = this.radius + 10;

        const x1 = this.centerX + Math.cos(angle) * innerRadius;
        const y1 = this.centerY + Math.sin(angle) * innerRadius;
        const x2 = this.centerX + Math.cos(angle) * outerRadius;
        const y2 = this.centerY + Math.sin(angle) * outerRadius;

        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 4;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();

        // Add a small circle at the tip for better visibility
        this.ctx.beginPath();
        this.ctx.arc(x2, y2, 3, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#000000';
        this.ctx.fill();

        this.ctx.restore();
    }
}
