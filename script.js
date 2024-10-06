document.addEventListener('DOMContentLoaded', function () {
    const icons = document.querySelectorAll('.icon');
    const timeSlots = document.querySelectorAll('.time-slot');
    let draggedIcon = null;
    let plannerState = JSON.parse(localStorage.getItem('plannerState')) || {};

    // Save Planner State
    function savePlannerState() {
        localStorage.setItem('plannerState', JSON.stringify(plannerState));
    }

    // Render Planner from Local Storage
    function renderPlanner() {
        Object.keys(plannerState).forEach(day => {
            Object.keys(plannerState[day]).forEach(time => {
                const slot = document.querySelector(`#${day} .time-slot[data-time="${time}"]`);
                const activity = plannerState[day][time];
                const icon = createIconElement(activity);
                slot.appendChild(icon);
                attachDeleteButton(icon, slot);
                attachDragHandlers(icon);
            });
        });
    }

    // Create Icon Element
    function createIconElement(activity) {
        const icon = document.createElement('div');
        icon.classList.add('icon');
        icon.draggable = true;
        icon.innerHTML = getActivitySymbol(activity);
        icon.setAttribute('data-activity', activity);

        return icon;
    }

    // Get Activity Symbol
    function getActivitySymbol(activity) {
        const activityIcons = {
            'sport': '⚽',
            'eating': '🍽️',
            'drinking': '☕',
            'reading': '📖',
            'sleeping': '🛌',
            'working': '💼',
            'shopping': '🛒',
            'exercise': '🏋️',
            'music': '🎵',
            'meditation': '🧘',
            'movie': '🎬',
            'travel': '✈️',
            'gaming': '🎮',
            'cooking': '🍳',
            'painting': '🎨',
            'cycling': '🚴',
            'yoga': '🧘‍♀️',
            'dance': '💃',
            'hiking': '🥾',
            'photography': '📷',
            'gardening': '🌱',
            'writing': '✍️',
            'volunteering': '🤝',
            'knitting': '🧶',
            'surfing': '🏄‍♂️',
            'swimming': '🏊',
            'skiing': '🎿',
            'rock_climbing': '🧗',
            'fishing': '🎣',
            'running': '🏃',
            'basketball': '🏀',
            'tennis': '🎾',
            'badminton': '🏸',
            'boxing': '🥊',
            'baseball': '⚾',
            'golf': '⛳',
            'karate': '🥋',
            'jogging': '🏃‍♂️',
            'pilates': '🤸‍♀️',
            'salsa': '💃',
            'kitesurfing': '🪁',
            'snowboarding': '🏂',
            'ice_skating': '⛸️',
            'martial_arts': '🥋',
            'climbing': '🧗‍♂️',
            'rowing': '🚣',
            'trampoline': '🤸‍♂️'
        };
        return activityIcons[activity];
    }

    // Attach Drag and Delete Handlers
    function attachDragHandlers(icon) {
        icon.addEventListener('dragstart', dragStart);
        icon.addEventListener('dragend', dragEnd);
    }

    function attachDeleteButton(icon, slot) {
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = '✕';
        icon.appendChild(deleteBtn);

        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            icon.remove();
            const day = slot.parentElement.id;
            const time = slot.getAttribute('data-time');
            delete plannerState[day][time];
            savePlannerState();
            console.log(`Removed activity from ${day} at ${time}`);
        });
    }

    // Drag and Drop Event Listeners for Icons
    icons.forEach(icon => {
        attachDragHandlers(icon);
    });

    // Drag and Drop Event Listeners for Time Slots
    timeSlots.forEach(slot => {
        slot.addEventListener('dragover', dragOver);
        slot.addEventListener('dragenter', dragEnter);
        slot.addEventListener('dragleave', dragLeave);
        slot.addEventListener('drop', drop);
    });

    // Drag and Drop Handlers
    function dragStart(e) {
        draggedIcon = this;
        setTimeout(() => this.classList.add('dragging'), 0);
        console.log("Drag started:", this.getAttribute('data-activity'));
    }

    function dragEnd(e) {
        this.classList.remove('dragging');
        draggedIcon = null;
        console.log("Drag ended");
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragEnter(e) {
        e.preventDefault();
        this.classList.add('drag-over');
    }

    function dragLeave(e) {
        this.classList.remove('drag-over');
    }

    function drop(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        
        if (draggedIcon) {
            const activity = draggedIcon.getAttribute('data-activity');
            
            // Check if an icon already exists in the time slot and remove it
            if (this.querySelector('.icon')) {
                this.querySelector('.icon').remove();
            }

            // Clone the dragged icon and append it to the new time slot
            const iconClone = draggedIcon.cloneNode(true);
            iconClone.classList.remove('dragging');
            this.appendChild(iconClone);

            attachDeleteButton(iconClone, this);
            attachDragHandlers(iconClone);

            // Save the activity to the new planner state
            const day = this.parentElement.id;
            const time = this.getAttribute('data-time');
            if (!plannerState[day]) plannerState[day] = {};
            plannerState[day][time] = activity;
            savePlannerState();

            console.log(`Dropped ${activity} into ${day} at ${time}`);
        }
    }

    // Initialize Planner with Stored Data
    renderPlanner();
});
