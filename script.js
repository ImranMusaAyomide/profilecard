
  /*  State  */
  const COLLAPSE_THRESHOLD = 80;

  const state = {
    title:       'Design new landing page layout',
    description: 'Create a comprehensive redesign of the landing page that includes a new hero section with animated elements, updated typography, responsive grid layout for feature highlights, testimonials carousel, and a refreshed call-to-action section that better converts visitors to sign-ups. Must be mobile-first and accessible.',
    priority:    'High',
    status:      'Pending',
    tag:         'Design',
    dueDate:     new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hrs from now
    expanded:    false,
    editing:     false,
    draft:       {}
  };

  /*  Element refs  */
  const card              = document.getElementById('todo-card');
  const checkbox          = document.getElementById('todo-checkbox');
  const titleEl           = document.getElementById('todo-title');
  const descEl            = document.getElementById('todo-description');
  const statusBadge       = document.getElementById('status-badge');
  const statusControl     = document.getElementById('status-control');
  const priorityIndicator = document.getElementById('priority-indicator');
  const priorityLabel     = document.getElementById('priority-label');
  const timeDisplay       = document.getElementById('time-display');
  const overdueIndicator  = document.getElementById('overdue-indicator');
  const expandToggle      = document.getElementById('expand-toggle');
  const expandLabelEl     = document.getElementById('expand-label');
  const collapsible       = document.getElementById('collapsible-section');
  const editFormContainer = document.getElementById('edit-form');
  const editBtn           = document.getElementById('edit-btn');
  const deleteBtn         = document.getElementById('delete-btn');
  const saveBtn           = document.getElementById('save-btn');
  const cancelBtn         = document.getElementById('cancel-btn');
  const editTitleInput    = document.getElementById('edit-title-input');
  const editDescInput     = document.getElementById('edit-desc-input');
  const editPriorityInput = document.getElementById('edit-priority-input');
  const editDueInput      = document.getElementById('edit-due-input');
  const tagDisplay        = document.getElementById('tag-display');

  /*  Time helpers  */
  function formatTime(due) {
    const now  = new Date();
    const diff = due - now;
    const abs  = Math.abs(diff);
    const mins  = Math.floor(abs / 60000);
    const hours = Math.floor(abs / 3600000);
    const days  = Math.floor(abs / 86400000);

    if (diff < 0) {
      if (mins < 60)  return 'Overdue by ' + mins  + ' minute'  + (mins  !== 1 ? 's' : '');
      if (hours < 24) return 'Overdue by ' + hours + ' hour'    + (hours !== 1 ? 's' : '');
      return               'Overdue by ' + days  + ' day'     + (days  !== 1 ? 's' : '');
    }
    if (mins < 60)  return 'Due in ' + mins  + ' minute'  + (mins  !== 1 ? 's' : '');
    if (hours < 24) return 'Due in ' + hours + ' hour'    + (hours !== 1 ? 's' : '');
    return               'Due in ' + days  + ' day'     + (days  !== 1 ? 's' : '');
  }

  function isOverdue(due) { return new Date() > due; }

  /*  Priority  */
  function applyPriority(p) {
    card.classList.remove('priority-high', 'priority-medium', 'priority-low');
    priorityIndicator.classList.remove('pi-high', 'pi-medium', 'pi-low');
    const k = p.toLowerCase();
    card.classList.add('priority-' + k);
    priorityIndicator.classList.add('pi-' + k);
    priorityLabel.textContent = p;
    priorityIndicator.setAttribute('aria-label', p + ' priority');
  }

  /*  Status  */
  function applyStatus(s) {
    statusBadge.className = 'status-badge';
    card.classList.remove('done');
    titleEl.classList.remove('strikethrough');

    if (s === 'Done') {
      statusBadge.classList.add('s-done');
      statusBadge.textContent = 'Done';
      card.classList.add('done');
      titleEl.classList.add('strikethrough');
      checkbox.checked = true;
      timeDisplay.textContent = 'Completed';
      timeDisplay.classList.remove('overdue-text');
      overdueIndicator.style.display = 'none';
      card.classList.remove('overdue');
    } else if (s === 'In Progress') {
      statusBadge.classList.add('s-progress');
      statusBadge.textContent = 'In Progress';
      checkbox.checked = false;
      updateTime();
    } else {
      statusBadge.classList.add('s-pending');
      statusBadge.textContent = 'Pending';
      checkbox.checked = false;
      updateTime();
    }

    statusControl.value = s;
    state.status = s;
  }

  /*  Time display  */
  function updateTime() {
    if (state.status === 'Done') return;
    const over = isOverdue(state.dueDate);
    timeDisplay.textContent = formatTime(state.dueDate);
    if (over) {
      timeDisplay.classList.add('overdue-text');
      overdueIndicator.style.display = 'inline-flex';
      card.classList.add('overdue');
    } else {
      timeDisplay.classList.remove('overdue-text');
      overdueIndicator.style.display = 'none';
      card.classList.remove('overdue');
    }
  }

  /*  Collapsible  */
  function updateCollapsible() {
    descEl.textContent = state.description;
    const isLong = state.description.length > COLLAPSE_THRESHOLD;

    if (!isLong) {
      expandToggle.style.display = 'none';
      collapsible.style.maxHeight = collapsible.scrollHeight + 'px';
      expandToggle.setAttribute('aria-expanded', 'true');
      return;
    }

    expandToggle.style.display = 'inline-flex';
    if (state.expanded) {
      collapsible.style.maxHeight = (collapsible.scrollHeight + 200) + 'px';
      expandLabelEl.textContent = 'Hide description';
      expandToggle.setAttribute('aria-expanded', 'true');
    } else {
      collapsible.style.maxHeight = '0';
      expandLabelEl.textContent = 'Show description';
      expandToggle.setAttribute('aria-expanded', 'false');
    }
  }

  /*  Full render  */
  function render() {
    titleEl.textContent   = state.title;
    tagDisplay.textContent = state.tag;
    applyPriority(state.priority);
    applyStatus(state.status);
    updateCollapsible();
    if (state.status !== 'Done') updateTime();
  }

  /*  Date → datetime-local string */
  function toLocalDateString(d) {
    const pad = n => String(n).padStart(2, '0');
    return d.getFullYear() + '-' +
      pad(d.getMonth() + 1) + '-' +
      pad(d.getDate()) + 'T' +
      pad(d.getHours()) + ':' +
      pad(d.getMinutes());
  }

  /*  Edit mode  */
  function openEdit() {
    state.draft = {
      title:       state.title,
      description: state.description,
      priority:    state.priority,
      dueDate:     state.dueDate
    };
    editTitleInput.value    = state.title;
    editDescInput.value     = state.description;
    editPriorityInput.value = state.priority;
    editDueInput.value      = toLocalDateString(state.dueDate);
    editFormContainer.style.display = 'block';
    state.editing = true;
    editTitleInput.focus();
  }

  function closeEdit(restore) {
    if (restore) {
      state.title       = state.draft.title;
      state.description = state.draft.description;
      state.priority    = state.draft.priority;
      state.dueDate     = state.draft.dueDate;
    }
    editFormContainer.style.display = 'none';
    state.editing = false;
    editBtn.focus();
  }

  function saveEdit() {
    const newTitle = editTitleInput.value.trim();
    if (!newTitle) {
      editTitleInput.focus();
      editTitleInput.style.borderColor = 'var(--overdue-color)';
      editTitleInput.addEventListener('input', function fix() {
        editTitleInput.style.borderColor = '';
        editTitleInput.removeEventListener('input', fix);
      });
      return;
    }
    state.title       = newTitle;
    state.description = editDescInput.value.trim();
    state.priority    = editPriorityInput.value;
    if (editDueInput.value) state.dueDate = new Date(editDueInput.value);
    closeEdit(false);
    render();
    if (state.status !== 'Done') updateTime();
  }

  /* ─── Events ───────────────────────*/
  checkbox.addEventListener('change', () => {
    applyStatus(checkbox.checked ? 'Done' : 'Pending');
  });

  statusControl.addEventListener('change', () => {
    applyStatus(statusControl.value);
  });

  expandToggle.addEventListener('click', () => {
    state.expanded = !state.expanded;
    updateCollapsible();
  });

  expandToggle.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      expandToggle.click();
    }
  });

  editBtn.addEventListener('click', openEdit);

  saveBtn.addEventListener('click', saveEdit);

  cancelBtn.addEventListener('click', () => closeEdit(true));

  deleteBtn.addEventListener('click', () => {
    if (window.confirm('Delete this todo? This cannot be undone.')) {
      card.style.transition = 'opacity 0.3s, transform 0.3s';
      card.style.opacity    = '0';
      card.style.transform  = 'scale(0.97)';
      setTimeout(() => card.remove(), 300);
    }
  });

  /* Trap focus inside edit form */
  editFormContainer.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusable = editFormContainer.querySelectorAll(
      'input, textarea, select, button:not([disabled])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  });

  /* Escape closes edit form */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && state.editing) closeEdit(true);
  });

  render();
  updateTime();

  /* Update time every 30 seconds */
  setInterval(updateTime, 30000);