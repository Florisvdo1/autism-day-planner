document.addEventListener('DOMContentLoaded', function () {
    const icons = document.querySelectorAll('.icon');
    const timeSlots = document.querySelectorAll('.time-slot');
    let draggedIcon = null;
    let plannerState = JSON.parse(localStorage.getItem('plannerState')) || {};

    // Save Planner State to localStorage
    function savePlannerState() {
        localStorage.setItem('plannerState', JSON.stringify(plannerState));
    }

    // Render planner from localStorage
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

    // Create a draggable icon element
    function createIconElement(activity) {
        const icon = document.createElement('div');
        icon.classList.add('icon');
        icon.draggable = true;
        icon.innerHTML = getActivitySymbol(activity);
        icon.setAttribute('data-activity', activity);
        attachDragHandlers(icon);
        return icon;
    }

    // Get the corresponding activity symbol (emoji)
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
            // Add more activities here
        };
        return activityIcons[activity] || '';
    }

    // Attach both touch and mouse drag events to icons
    function attachDragHandlers(icon) {
        icon.addEventListener('dragstart', dragStart);
        icon.addEventListener('dragend', dragEnd);

        // Touch events for mobile drag-and-drop
        icon.addEventListener('touchstart', touchStart, { passive: true });
        icon.addEventListener('touchmove', touchMove, { passive: false });
        icon.addEventListener('touchend', touchEnd);
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
        });
    }

    // Mouse drag-and-drop event handlers
    function dragStart(e) {
        draggedIcon = this;
        setTimeout(() => this.classList.add('dragging'), 0);
    }

    function dragEnd(e) {
        this.classList.remove('dragging');
        draggedIcon = null;
    }

    // Touch event handlers for mobile drag-and-drop
    function touchStart(e) {
        draggedIcon = this;
        this.classList.add('dragging');
    }

    function touchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);

        if (targetElement && targetElement.classList.contains('time-slot')) {
            targetElement.classList.add('drag-over');
        }
    }

    function touchEnd(e) {
        const touch = e.changedTouches[0];
        const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);

        if (targetElement && targetElement.classList.contains('time-slot')) {
            dropTouch(targetElement);
        }

        this.classList.remove('dragging');
    }

    function dropTouch(targetElement) {
        const activity = draggedIcon.getAttribute('data-activity');

        if (targetElement.querySelector('.icon')) {
            targetElement.querySelector('.icon').remove();
        }

        const iconClone = draggedIcon.cloneNode(true);
        iconClone.classList.remove('dragging');
        targetElement.appendChild(iconClone);

        attachDeleteButton(iconClone, targetElement);
        attachDragHandlers(iconClone);

        const day = targetElement.parentElement.id;
        const time = targetElement.getAttribute('data-time');
        if (!plannerState[day]) plannerState[day] = {};
        plannerState[day][time] = activity;
        savePlannerState();
    }

    // Drag and drop event handlers for time slots
    timeSlots.forEach(slot => {
        slot.addEventListener('dragover', dragOver);
        slot.addEventListener('dragenter', dragEnter);
        slot.addEventListener('dragleave', dragLeave);
        slot.addEventListener('drop', drop);
    });

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

            if (this.querySelector('.icon')) {
                this.querySelector('.icon').remove();
            }

            const iconClone = draggedIcon.cloneNode(true);
            iconClone.classList.remove('dragging');
            this.appendChild(iconClone);

            attachDeleteButton(iconClone, this);
            attachDragHandlers(iconClone);

            const day = this.parentElement.id;
            const time = this.getAttribute('data-time');
            if (!plannerState[day]) plannerState[day] = {};
            plannerState[day][time] = activity;
            savePlannerState();
        }
    }

    // Initialize planner with saved data
    renderPlanner();
});
