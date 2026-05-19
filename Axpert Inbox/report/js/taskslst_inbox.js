/* Task planner â€” consolidated script with taskplanner icon, balloon tooltip, and action checks */
(function () {
  debugger;
  const plannerStyles = `
  /* core */
  #plan-popup-root { font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; padding: 9px; box-sizing: border-box; max-height: 110vh; color:#0f1724; }
  .plan-grid{ display:flex; gap:0px; align-items:flex-start; }
  .left { width: 27%; background: #fff; border-radius:14px; padding:5px; box-shadow: 0 10px 30px rgba(2,6,23,0.04); min-height:420px; max-height: 72vh; overflow:auto; }
  .right { width: 75%; background: linear-gradient(180deg,#f8fbff,#ffffff); border-radius:14px; padding:5px; box-shadow: 0 10px 30px rgba(2,6,23,0.03); min-height:420px;overflow:auto; }
  .planner-controls{ display:flex; justify-content:space-between; align-items:center; gap:8px; }
  .planner-controls h3{ margin:0; font-size:18px; font-weight:700; color:#072a6b; display:flex; align-items:center; gap:8px; }
  .small-muted{ font-size:13px; color:#475569; opacity:0.95; }
  /* chips / calendar */
  .cal-chip { padding:3px 6px; border-radius:10px; background:linear-gradient(180deg,#eef6ff,#ffffff); border:1px solid rgba(11,105,255,0.08); font-size:12px; font-weight:600; color:#05264a; cursor:grab; box-shadow:0 6px 18px rgba(11,105,255,0.03); }
  .cal-chip.dragging{ opacity:0.6; transform:scale(.995); }
  .calendar-header { display:flex; justify-content:space-between; align-items:center; gap:12px;}
  .day-view-stacked { margin-top:5.calendar-headerpx; display:grid;grid-template-columns: repeat(4, 192px); gap:12px; max-height:76vh; overflow:auto; }
  .day-card { background:linear-gradient(180deg,#fff,#fbfdff); border-radius:12px; padding:12px; border:1px solid rgba(7,42,72,0.04); box-shadow:0 8px 24px rgba(2,6,23,0.03); }
  .day-card .day-header{ display:flex; justify-content:space-between; align-items:center; gap:10px; cursor:pointer; }
  .day-tasks { margin-top:8px; display:flex; flex-direction:column; gap:8px; max-height:220px; overflow:auto; padding:6px; }
  /* planner buttons */
  .btn-plan { padding:5px 8px; border-radius:10px; border:0; background:#0b69ff; color:#fff; cursor:pointer; font-weight:600; }
  .btn-ghost {
    padding: 5px 8px;
    border-radius: 10px;
    border: 1px solid rgba(2,6,23,0.06);
    color: black;
    cursor: pointer;
    font-weight: 600;
}
.cal-chip-id {
  font-weight: 600;
  font-size: 12px;
  margin-bottom: 2px;
  line-height: 1.2;
}
.cal-chip-name {
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
  display:none;
}
.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}
.status-pending {
  background-color: #dc3545; /* red */
}
.status-accepted {
  background-color: #198754; /* green */
}
.status-forwarded {
  background-color: #ffc107; /* yellow */
}
.status-unknown {
  background-color: #6c757d; /* gray */
}
  /* accordion / task list */
  #plan-popup-root .task-accordion { width:100%; }
  #plan-popup-root .task-accordion .accordion-item { border:0; }
  #plan-popup-root .task-accordion .accordion-button {
    padding: 5px;
    display:flex;
    align-items:center;
    gap:10px;
    border-radius:10px;
    background: linear-gradient(180deg,#fff,#fbfdff);
    border: 1px solid rgba(11,105,255,0.06);
    box-shadow: 0 6px 18px rgba(11,105,255,0.04);
    color: #05264a;
    font-weight:700;
  }
  #plan-popup-root .task-accordion .accordion-button:not(.collapsed) {
    background: linear-gradient(180deg,#eef6ff,#ffffff);
  }
  #plan-popup-root .task-accordion .accordion-button > div {
    min-width: 0; /* allows children to shrink inside flex column */
}
#plan-popup-root .task-accordion .title {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 13px;
    width:170px;
    font-weight: 600;
}
  #plan-popup-root .task-accordion .chev {
    width:22px;
    height:22px;
    display:inline-flex;
    align-items:center;
    justify-content:center;
    transition: transform .28s ease;
    flex-shrink:0;
    color:#0b69ff;
  }
  #plan-popup-root .task-accordion .accordion-button[aria-expanded="true"] .chev { transform: rotate(180deg); }
  #plan-popup-root .task-accordion .accordion-collapse .card-body {
    padding: 10px 12px;
    font-size:13px;
    color:#334155;
    line-height:1.28;
  }
  /* drag handle in header (distinct, draggable) */
  #plan-popup-root .task-accordion .drag-handle {
    width:20px;
    height:36px;
    min-width:20px;
    display:flex;
    align-items:center;
    justify-content:center;
    border-radius:8px;
    cursor:grab;
    user-select:none;
    margin-right:8px;
    color:#0b69ff;
  }
  #plan-popup-root .task-accordion .drag-handle:active { cursor:grabbing; }
  /* small responsive tweaks */
  @media (max-width: 900px){
    .plan-grid{ flex-direction:column; }
    .left{ width:100%; }
    .right{ width:100%; }
    .day-view-stacked { grid-template-columns: repeat(2, 1fr); }
  }
  .tab-header .btn-ghost {
    border-bottom: 2px solid transparent;
    font-weight: 600;
    color: #333;
    background: none;
  }
  
  .tab-header .btn-ghost.tab-active {
    border-bottom: 2px solid #0b69ff;
    color: #0b69ff;
  }
  /* move/copy popup */
.mc-popup {
  position: fixed;
  z-index: 99999;
  background: #ffffff;
  border: 1px solid rgba(2,6,23,0.08);
  padding: 6px;
  border-radius: 8px;
  box-shadow: 0 8px 30px rgba(2,6,23,0.12);
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 13px;
}
.mc-popup button {
  padding: 6px 8px;
  border-radius: 6px;
  border: 0;
  cursor: pointer;
  font-weight: 600;
}
.mc-popup button.btn-move { background: #0b69ff; color: #fff; }
.mc-popup button.btn-copy { background: #10b981; color: #fff; }
.mc-popup button.btn-cancel { background: transparent; border: 1px solid #e5e7eb; color: #111827; }
 /* Extra Large screens (1200px+) */
@media (min-width: 1200px) {
  .day-view-stacked {
    grid-template-columns: repeat(4, 1fr);
  }
}
/* Large screens (992px - 1199px) */
@media (max-width: 1199px) {
  .day-view-stacked {
    grid-template-columns: repeat(4, 1fr);
  }
}
/* Medium screens (768px - 991px) */
@media (max-width: 991px) {
  .day-view-stacked {
    grid-template-columns: repeat(2, 1fr);
  }
}
/* Small screens (mobile < 768px) */
@media (max-width: 767px) {
  .day-view-stacked {
    grid-template-columns: repeat(1, 1fr);
  }
}
 `;
  
  if (!document.querySelector('#plan-popup-styles')) {
    const styleTag = document.createElement('style');
    styleTag.setAttribute('id', 'plan-popup-styles');
    styleTag.innerHTML = plannerStyles;
    document.head.appendChild(styleTag);
  }
  /* ---------- helper utilities ---------- */
  function escapeHtml(s) {
    if (s === null || s === undefined) return '';
    return String(s).replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[m]);
  }
  function formatDateShort(d) {
    try {
      const dt = new Date(d);
      if (!isNaN(dt.getTime())) return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
    } catch (e) {}
    return '';
  }
  function getRandomColor() {
    const colors = ["#e0dbfe", "#dbeafe", "#dcfce7", "#fef9c3", "#fee2e2", "#fce7f3"];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  function isMeaningful(s) {
    if (s === null || s === undefined) return false;
    const t = String(s).trim();
    if (!t) return false;
    const lowered = t.toLowerCase();
    if (lowered === 'null' || lowered === '[null]') return false;
    return true;
  }
  /* ---------- bootstrap / iview integration ---------- */
  window.AxAfterIviewLoad = function () {
    const toolbar = document.querySelector(".toolbarRightMenu");
    if (!toolbar || !toolbar.parentNode) {
      console.warn("Toolbar not found - can't insert buttons");
      return;
    }
    // remove previous if present
    const existingPlansBtn = document.querySelector(".btn-plan-plans");
    if (existingPlansBtn) existingPlansBtn.remove();
    const existingPunchBtn = document.querySelector(".punch-btn");
    if (existingPunchBtn) existingPunchBtn.remove();
    const plansBtn = document.createElement("button");
    plansBtn.innerText = "SCHEDULE";
    plansBtn.className = "btn btn-primary p-3 punch-btn";
    plansBtn.style.marginRight = "8px";
    plansBtn.addEventListener("click", plansPopupHandler);
    const punchBtn = document.createElement("button");
    punchBtn.innerText = "PUNCH IN/OUT";
    punchBtn.className = "btn btn-primary p-3 punch-btn";
    punchBtn.addEventListener("click", popupHandler);
    if (toolbar.nextElementSibling) {
      toolbar.parentNode.insertBefore(plansBtn, toolbar.nextElementSibling);
      toolbar.parentNode.insertBefore(punchBtn, toolbar.nextElementSibling);
    } else {
      toolbar.parentNode.appendChild(plansBtn);
      toolbar.parentNode.appendChild(punchBtn);
    }
    const el = document.querySelector("#iconsNewOption");
    if (el) el.classList.toggle("d-none");
  };
  function popupHandler(e) {
    if (e && e.preventDefault) e.preventDefault();
    $('#btn_btn17').click();
  }
  // window.plansPopupHandler = function (e) {
  //   if (e && e.preventDefault) e.preventDefault();
  //   $('#btn_btn17').click();
  //   const pfContainer = document.getElementById("pf_content_container");
  
  //   if (pfContainer) pfContainer.classList.add("d-none");
  //   waitForModalElement(50, 3500).then(modalEl => {
  //     const modalBody = modalEl.querySelector('.modal-body') || modalEl;
  //     try {
        
  //       modalBody.innerHTML = '';
  //     } catch (err) {
  //       console.warn('clear failed', err);
  //     }
  //     window._tm_lastSelected = null;
  //     injectPlannerUI(modalBody, modalEl);
  //     // prepare footer submit button
  //     // const footer = modalEl.querySelector('.modal-footer');
  //     // if (footer) {
  //     //   footer.classList.remove('d-none');
  //     //   const cancelBtn = footer.querySelector('.modal-cancel');
  //     //   const okBtn = footer.querySelector('.modal-ok');
  //     //   if (cancelBtn) cancelBtn.style.display = 'none';
  //     //   if (okBtn) okBtn.style.display = 'none';
  //     //   let submitBtn = footer.querySelector('#plannerSubmitBtn');
  //     //   if (!submitBtn) {
  //     //     submitBtn = document.createElement('button');
  //     //     submitBtn.type = "button";
  //     //     submitBtn.id = "plannerSubmitBtn";
  //     //     submitBtn.className = "btn btn-primary";
  //     //     submitBtn.textContent = "Submit";
  //     //     submitBtn.addEventListener("click", () => {
  //     //       const dayCards = document.querySelectorAll('.day-view-stacked .day-card');
  //     //       const jsonData = [];
  //     //       dayCards.forEach(card => {
  //     //         const tasks = card.querySelectorAll('.cal-chip');
  //     //         if (tasks.length === 0) return;
  //     //         const dateStr = card.getAttribute('data-date');
  //     //         const [yyyy, mm, dd] = dateStr.split('-');
  //     //         const formattedDate = `${dd}/${mm}/${yyyy}`;
  //     //         tasks.forEach(task => {
  //     //           const taskId = task.getAttribute('data-taskid');
  //     //           if (taskId) jsonData.push({ newdate: formattedDate, taskid: taskId });
  //     //         });
  //     //       });
  //     //       if (jsonData.length === 0) { parent.showAlertDialog('warning', "No tasks to save!"); return; }
  //     //       parent.AxSetValue("tasku", "SavejsonData", "1", "0", JSON.stringify(jsonData));
  //     //       parent.AxSetValue("tasku", "taskid", "1", "0", jsonData[0].taskid);
  //     //       parent.AxSetValue("tasku", "newdate", "1", "0", jsonData[0].newdate);
  //     //       parent.AxSubmitData('tasku', '0');
  //     //       parent.showAlertDialog('success', "Task saved successfully!");
  //     //     });
  //     //     footer.appendChild(submitBtn);
  //     //   }
  //     // }
  //   }).catch(() => {
  //     injectPlannerUI(document.body, null);
  //   });
  // }
  window.plansPopupHandler = function (e) {
    if (e && e.preventDefault) e.preventDefault();
  
    const pfContainer = document.getElementById("pf_content_container");
    if (pfContainer) pfContainer.classList.add("d-none");
  
    const modalEl = document.getElementById("filterModal");
    if (!modalEl) {
      console.error("filterModal not found");
      return;
    }
  
    // ✅ Show modal directly
    $('#filterModal').modal({
      backdrop: "static",
      keyboard: false
    });
    $('#filterModal').modal('show');
  
    // ✅ Inject planner AFTER modal is visible
    setTimeout(() => {
      const modalBody =
        modalEl.querySelector(".modal-body") || modalEl;
  
      modalBody.innerHTML = "";
      modalBody.style.overflow="unset"
      window._tm_lastSelected = null;
  
    injectPlannerUI(modalBody, modalEl);
    }, 120);
  
    // ✅ Restore container on close
    $(modalEl)
      .off("hidden.bs.modal.restore")
      .on("hidden.bs.modal.restore", function () {
        if (pfContainer) pfContainer.classList.remove("d-none");
      });

      setTimeout(() => {
        const modal = document.getElementById("filterModal");
        if (!modal) return;
    
        const header = modal.querySelector(".modal-header");
    
        // ✅ Create header if missing
        if (!header) {
            const modalContent = modal.querySelector(".modal-content");
            const newHeader = document.createElement("div");
            newHeader.className = "modal-header border-0 p-2";
            newHeader.style.backgroundColor = "transparent";
            newHeader.style.width = "max-content";
            newHeader.style.position = "absolute";
            newHeader.style.right = "8px";
            newHeader.style.zIndex ="99999";
            newHeader.style.top = "15px";

            modalContent.prepend(newHeader);
        }
    
        const modalHeader = modal.querySelector(".modal-header");
    
        // ✅ Avoid duplicate button
        if (!modalHeader.querySelector(".custom-close-btn")) {
    
            const closeBtn = document.createElement("button");
            closeBtn.type = "button";
            closeBtn.className = "btn-close custom-close-btn";
            closeBtn.setAttribute("aria-label", "Close");
            closeBtn.style.marginLeft = "auto";
    
            modalHeader.appendChild(closeBtn);
    
            // ✅ Attach click logic
            closeBtn.addEventListener("click", function () {
    
                const iframe = modal.querySelector("#taskFrame");
                const planner = modal.querySelector("#plan-popup-root");
    
                // 🔥 If iframe open → go back to planner
                if (iframe && iframe.style.display === "block") {
                    iframe.style.display = "none";
                    iframe.src = "";
    
                    if (planner) planner.style.display = "block";
    
                    return; // ❌ stop closing modal
                }
    
                // ✅ Otherwise close modal
                if (window.jQuery && $(modal).modal) {
                    $(modal).modal("hide");
                } else {
                    modal.style.display = "none";
                }
            });
        }
    
    }, 150); 
  };
  
  function waitForModalElement(intervalMs = 50, timeoutMs = 3000) {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const timer = setInterval(() => {
        let el = document.querySelector('.modal.show') || document.querySelector('[role="dialog"].show');
        if (!el) {
          const c = document.querySelectorAll('.modal, [role="dialog"]');
          for (const x of c)
            if (x.querySelector && x.querySelector('.modal-body')) {
              el = x;
              break;
            }
        }
        if (el) {
          clearInterval(timer);
          resolve(el);
        }
        if (Date.now() - start > timeoutMs) {
          clearInterval(timer);
          reject(new Error('modal not found'));
        }
      }, intervalMs);
    });
  }
  function injectPlannerUI(container, modalEl) {
    try {
      const prev = container.querySelector && container.querySelector('#plan-popup-root');
      if (prev) prev.remove();
    } catch (e) {}
    const root = document.createElement('div');
    root.id = 'plan-popup-root';
    // main header: add taskplanner icon and balloon icon with tooltip (no subtitle text)
    root.innerHTML = `
  <div class="planner-controls">
    <div style="display:flex;align-items:center;gap:8px;">
      <h3>
        <!-- Task Planner icon (clipboard/calendar) -->
      
          <rect x="8" y="3" width="8" height="2" rx="1" fill="currentColor" />
          <path d="M7 7h10v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7z" stroke="currentColor" stroke-width="1.2" fill="none"/>
        </svg>
        Task Planner
      </h3>
      <!-- balloon icon: tooltip 'Drag and drop' -->
      <div style="margin-left:6px;">
        <span id="drag-tooltip-anchor" data-bs-toggle="tooltip" data-bs-placement="top" title="Drag and drop" style="display:inline-flex;align-items:center;justify-content:center;">
        
            <path d="M12 2c1.7 0 3 1.3 3 3 0 2-1 3.5-3 5-2-1.5-3-3-3-5 0-1.7 1.3-3 3-3z" stroke="currentColor" stroke-width="1.2" fill="none"/>
            <path d="M12 10v7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
            <path d="M10 20c1 1 3 1 4 0" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
        </span>
      </div>
    </div>
<div style="display:flex;gap:10px;align-items:center;position:relative;right:230px;" id="userDropdownContainer"></div> 
    <div style="display:flex;gap:10px;align-items:center;">
   
   
    </div>
  </div>
  <div class="plan-grid">
    <div class="left">
      <h4 style="font-size:15px; ">Tasks <span id="task-count" class="small-muted" style="font-weight:600;margin-left:8px;"></span></h4>
      <div id="task-list" aria-live="polite"></div>
    </div>
    <div class="right">
    
  
    <div id="tab-content">
      <div id="calendar-tab" class="tab-pane active">
        <div class="calendar-header">
          <div style="font-weight:600; color:black;font-size:15px;">
            Calendar - <span id="calendar-month-year"></span>
          </div>
          <div style="display:flex; gap:8px; align-items:center;">
           <button id="prev-month" class="btn-ghost">◀</button>
            <button id="next-month" class="btn-ghost">▶</button>
          </div>
        </div>
        <div id="calendar-area"></div>
      </div>
  
      
    </div>
  </div>
  
`;
    if (container.prepend) container.prepend(root);
    else container.appendChild(root);
    root._modalEl = modalEl || null;
    // root.querySelector('#close-planner').addEventListener('click', () => {
    //   const proflowDiv = document.getElementById("PROFLOW-overalldiv");
    //   if (proflowDiv) {
    //     proflowDiv.classList.remove("d-none");
    //   }
    
    //   closeModalFromRoot(root);
    // });
    
      
    //  root.querySelector('#refresh-planner').addEventListener('click', () => loadTasksAndRender(root));
    // Bind refresh to reload only calendar (right panel)
    // root.querySelector('#refresh-planner').addEventListener('click', () => {
    //   try {
    //    ;
    //   } catch (e) {}
    //   loadTasksData(root, () => {
    //     try {
    //       renderCalendarArea(root);
    //     } catch (e) {}
    //     try {
    //      
    //     } catch (e) {}
    //   });
    // });
    root.querySelector('#prev-month').addEventListener('click', () => changeMonth(-1, root));
    root.querySelector('#next-month').addEventListener('click', () => changeMonth(1, root));
    // initial state
    root._plannerState = {
      year: (new Date()).getFullYear(),
      month: (new Date()).getMonth(),
      tasks: [],
      assignQueue: {},
      selectedDay: null,
      _loading: true
    };
    if (root._modalEl) {
      try {
        if (window.jQuery && window.jQuery(root._modalEl).on) {
          window.jQuery(root._modalEl).off('hidden.bs.modal.planClean').on('hidden.bs.modal.planClean', function () {
            try {
              root.remove();
            } catch (e) {}
            window.jQuery(root._modalEl).off('hidden.bs.modal.planClean');
          });
        }
      } catch (e) {}
    }
    // initialize bootstrap tooltip for the balloon icon
    setTimeout(() => {
      try {
        const anchor = root.querySelector('#drag-tooltip-anchor');
        if (anchor && window.bootstrap && typeof window.bootstrap.Tooltip === 'function') {
          new bootstrap.Tooltip(anchor);
        }
      } catch (e) {}
    }, 120);
    //setupTabs(root);
    loadTasksAndRender(root);
  }
  function closeModalFromRoot(root) {
    const modalEl = root._modalEl;
    if (!modalEl) {
      try {
        root.remove();
      } catch (e) {};
      return;
    }
    const closeSel = '[data-bs-dismiss="modal"], [data-dismiss="modal"], .btn-close, .close';
    const closeBtn = modalEl.querySelector(closeSel);
    if (closeBtn) {
      try {
        closeBtn.click();
        return;
      } catch (e) {}
    }
    try {
      if (window.jQuery && window.jQuery(modalEl).modal) {
        window.jQuery(modalEl).modal('hide');
        return;
      }
    } catch (e) {}
    try {
      modalEl.parentNode && modalEl.parentNode.removeChild(modalEl);
    } catch (e) {}
  }
  function changeMonth(delta, root) {
    root._plannerState.month += delta;
    if (root._plannerState.month < 0) {
      root._plannerState.month = 11;
      root._plannerState.year -= 1;
    }
    if (root._plannerState.month > 11) {
      root._plannerState.month = 0;
      root._plannerState.year += 1;
    }
    renderCalendarArea(root);
  }
  /* ---------- load tasks and render ---------- */
  function loadTasksAndRender(root) {
    const username = (window.parent && window.parent.mainUserName) ? window.parent.mainUserName : (window.mainUserName || "");
    const person = username;
    const sqlParams = {
      "person": person,
      "username": username,
      "priority": 'ALL',
      "showtasks": 'Open',
      "ptaskid": 'ALL'
    };
    const taskList = root.querySelector('#task-list');
    root._plannerState._loading = true;
    if (taskList) taskList.innerHTML = "<div class='small-muted'>Loading tasks...</div>";
    // $.ajax({
    //   type: "POST",
    //   url: "../aspx/AxPEG.aspx/GetDataFromDataSource",
    //   data: JSON.stringify({ name: "Ds_taskplanner", sqlParams: sqlParams, refreshCache: false }),
    //   contentType: "application/json; charset=utf-8",
    //   dataType: "json",
    //   async: true,
    //   success: function (result) {
    //     let raw = [];
    //     try {
    //       let d = (result && result.d) ? result.d : null;
    //       if (typeof d === 'string') {
    //         try { d = JSON.parse(d); } catch (e) { try { d = JSON.parse(d.replace(/\\"/g, '"').replace(/\\n/g, '')); } catch (e2) { } }
    //       }
    //       if (d && d.result && Array.isArray(d.result.data) && d.result.data.length > 0) {
    //         d.result.data.forEach(entry => {
    //           if (entry && entry.data_json) {
    //             try { const parsed = JSON.parse(entry.data_json); if (Array.isArray(parsed)) raw = raw.concat(parsed); } catch (e) { console.warn('failed parse entry.data_json', e); }
    //           } else if (Array.isArray(entry)) raw = raw.concat(entry);
    //           else if (entry && entry.data) raw = raw.concat(entry.data);
    //         });
    //       } else if (Array.isArray(d)) raw = d;
    //       else if (d && d.data_json) {
    //         try { const parsed = JSON.parse(d.data_json); if (Array.isArray(parsed)) raw = raw.concat(parsed); } catch (e) { }
    //       } else if (d && d.d && Array.isArray(d.d)) raw = d.d;
    //       else {
    //         try {
    //           const parsed = JSON.parse(JSON.stringify(result));
    //           if (parsed && parsed.d) {
    //             const maybe = typeof parsed.d === 'string' ? JSON.parse(parsed.d) : parsed.d;
    //             if (Array.isArray(maybe)) raw = maybe;
    //           }
    //         } catch (e) { }
    //       }
    //     } catch (err) { console.error('Parsing ds result failed', err); }
    //     root._plannerState.tasks = (raw || []).map((t, idx) => {
    //       const pickDate = t.taskdate || t.duedate || t.scheduledDate || t.scheduled || null;
    //       let scheduledDate = null;
    //       if (pickDate) {
    //         const dt = new Date(String(pickDate));
    //         if (!isNaN(dt.getTime())) scheduledDate = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
    //         else {
    //           const m = String(pickDate).match(/(\d{4}-\d{2}-\d{2})/);
    //           if (m) scheduledDate = m[1];
    //         }
    //       }
    //       return {
    //         raw: t,
    //         taskid: t.taskid || t.taskId || t.TaskId || t.id || t.ID || ("t_" + idx),
    //         taskname: t.taskname || t.taskName || t.name || t.title || (t.action_detail ? t.action_detail : "No title"),
    //         customername: t.customername || t.customer || t.client || t.assignedTo || "",
    //         status: t.status || t.Status || "",
    //         priority: t.priority || "",
    //         action_detail: t.action_detail || t.actionDetail || t.ActionDetail || "",
    //         action_message: t.action_message || t.actionMessage || t.ActionMessage || "",
    //         remarks: t.remarks || "",
    //         duedateRaw: t.duedate || null,
    //         duedate: (t.duedate ? formatDateShort(t.duedate) : ""),
    //         scheduledDate: scheduledDate
    //       };
    //     });
    //     // build assignQueue
    //     root._plannerState.assignQueue = {};
    //     root._plannerState.tasks.forEach(task => {
    //       if (task.scheduledDate) {
    //         root._plannerState.assignQueue[task.scheduledDate] = root._plannerState.assignQueue[task.scheduledDate] || [];
    //         root._plannerState.assignQueue[task.scheduledDate].push(task.taskid);
    //       }
    //     });
    //     const countEl = root.querySelector('#task-count'); if (countEl) countEl.innerText = `${root._plannerState.tasks.length} total`;
    //     root._plannerState._loading = false;
    //     renderTaskList(root);
    //     renderCalendarArea(root);
    //   },
    //   error: function (error) {
    //     console.error("Ds_taskplanner error:", error);
    //     root._plannerState._loading = false;
    //     if (taskList) taskList.innerHTML = "<div class='small-muted'>Failed to load tasks. Check console.</div>";
    //   }
    // });
    var user_name = (window.parent && window.parent.mainUserName) ?
      window.parent.mainUserName :
      (window.mainUserName || "");
    loadEmployees(root, user_name)
  }
  /* ---------- fetch tasks only (used by Refresh to update right panel only) ---------- */
  function loadTasksData(root, callback) {
    const user_name = (window.parent && window.parent.mainUserName) ? window.parent.mainUserName : (window.mainUserName || "");
    // Build same params used elsewhere
    const params = {
      adsNames: ["TASKPLANNER"],
      refreshCache: false,
      sqlParams: {
        uname: user_name
      },
      keyField: "username",
      keyValue: "",
      props: {
        ADS: true,
        CachePermissions: true,
        getallrecordscount: true,
        pageno: 1,
        pagesize: 1000,
        sorting: [{
          fldname: "employee_code",
          sort_order: "asc"
        }],
        filters: []
      }
    };
    root._plannerState._loading = true;
  
     ;
  
    try {
      parent.GetDataFromAxList(params, function success(response) {
        let parsed = {};
        try {
          parsed = JSON.parse(response);
        } catch (e) {
          parsed = {};
        }
        const employees = parsed ?.result ?.data ?. [0] ?.data || [];
        // Update state (only what's needed for the calendar)
        root._plannerState.tasks = employees;
        const assignQueue = {};
        const unscheduled = [];
        employees.forEach(task => {
          const date = task.scheduleddate;
          if (date && date !== "null" && date !== "[null]") {
            assignQueue[date] = assignQueue[date] || [];
            assignQueue[date].push(task.taskid);
          } else {
            unscheduled.push(task);
          }
        });
        root._plannerState.assignQueue = assignQueue;
        root._plannerState.unscheduled = unscheduled;
        root._plannerState._loading = false;
        try {
          if (typeof callback === "function") callback();
        } catch (e) {}
        
      }, function error(err) {
        console.error("loadTasksData error", err);
        root._plannerState._loading = false;
        
        if (typeof callback === "function") callback();
      });
    } catch (ex) {
      console.error("Exception while calling GetDataFromAxList - loadTasksData", ex);
      root._plannerState._loading = false;
      
      if (typeof callback === "function") callback();
    }
  }
  function loadEmployees(root, user_name) {
    debugger
    let currentPage = 1;
    let pageSize = 10;
    let sorting = [{
      fldname: "employee_code",
      sort_order: "asc"
    }];
    let filters = [];
    let refreshCache = false;
    const params = {
      adsNames: ["TASKPLANNER"],
      refreshCache: refreshCache,
      sqlParams: {
        uname: user_name,
      },
      keyField: "username",
      keyValue: "",
      props: {
        ADS: true,
        CachePermissions: true,
        getallrecordscount: true,
        pageno: currentPage,
        pagesize: pageSize,
        keyfield: "",
        keyvalue: "",
        sorting: sorting,
        filters: filters,
      },
    };
    try {
      parent.GetDataFromAxList(
        params,
        function success(response) {
          let parsed = JSON.parse(response);
          let employees = parsed ?.result ?.data ?. [0] ?.data || [];
          // Convert to your task structure
          // let raw = employees.map((t, idx) => {
          //   const pickDate = t.taskdate || t.duedate || t.scheduledDate || t.scheduled || null;
          //   let scheduledDate = null;
          //   if (pickDate) {
          //     const dt = new Date(String(pickDate));
          //     if (!isNaN(dt.getTime())) {
          //       scheduledDate = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
          //     } else {
          //       const m = String(pickDate).match(/(\d{4}-\d{2}-\d{2})/);
          //       if (m) scheduledDate = m[1];
          //     }
          //   }
          //   return {
          //     raw: t,
          //     taskid: t.taskid || t.taskId || t.TaskId || t.id || t.ID || "t_" + idx,
          //     taskname: t.taskname || t.taskName || t.name || t.title || (t.action_detail ? t.action_detail : "No title"),
          //     customername: t.customername || t.customer || t.client || t.assignedTo || "",
          //     status: t.status || t.Status || "",
          //     priority: t.priority || "",
          //     action_detail: t.action_detail || t.actionDetail || t.ActionDetail || "",
          //     action_message: t.action_message || t.actionMessage || t.ActionMessage || "",
          //     remarks: t.remarks || "",
          //     duedateRaw: t.duedate || null,
          //     duedate: t.duedate ? formatDateShort(t.duedate) : "",
          //     scheduledDate: scheduledDate,
          //   };
          // });
          // Build assignQueue
          root._plannerState.tasks = employees
          const unscheduledTasks = [];
          const assignQueue = {};
          employees.forEach((task) => {
            const date = task.scheduleddate
            if (date && date !== "null" && date !== "[null]") {
              // Assign to that date
              assignQueue[date] = assignQueue[date] || [];
              assignQueue[date].push(task.taskid);
            } else {
              // No date â†’ put in unscheduled list (left panel)
              unscheduledTasks.push(task);
            }
          });
          root._plannerState.assignQueue = assignQueue;
          root._plannerState.unscheduled = unscheduledTasks;
          const countEl = root.querySelector("#task-count");
          if (countEl) countEl.innerText = `(${root._plannerState.unscheduled.length})`;
          root._plannerState._loading = false;
          // âœ… Render updated views
          renderTaskList(root);
          renderCalendarArea(root);
          // Notify that tasks are loaded and UI is ready
window.dispatchEvent(new Event("employeesLoaded"));
          refreshCache = false;
        },
        function error(err) {
          console.error("API error", err);
          root._plannerState._loading = false;
          const taskList = root.querySelector("#task-list");
          if (taskList) taskList.innerHTML = "<div class='small-muted'>Failed to load tasks. Check console.</div>";
        }
      );
    } catch (ex) {
      console.error("Exception while calling API", ex);
    }
   
  }
  (function () {
    window._tm_lastSelected = null;
    const MAIN_USER =
      parent?.mainUserName ||
      parent?.loggedUserName ||
      parent?.userName ||
      "";
  
    const DS_PARAMS = {
      adsNames: ['DS_TeamMember'],
      refreshCache: false,
      sqlParams: {}
    };
  
    const CSS = `
    .tm-user-dropdown-wrapper{ display:flex; justify-content:center; align-items:center; padding:6px 0; }
    .tm-user-dropdown{ font-size:13px; padding:6px 10px; border-radius:6px; border:1px solid rgba(0,0,0,0.15); background:#fff; }
    `;
    function injectStyles() {
      if (!document.getElementById('tm-user-dropdown-styles')) {
        const s = document.createElement('style');
        s.id = 'tm-user-dropdown-styles';
        s.innerHTML = CSS;
        document.head.appendChild(s);
      }
    }
  
    function extractRows(response) {
      try {
        const p = JSON.parse(response);
        return p?.result?.data?.[0]?.data || [];
      } catch { return []; }
    }
  
    function buildDropdown(rows) {
      const wrap = document.createElement("div");
      wrap.className = "tm-user-dropdown-wrapper";
    
      const select = document.createElement("select");
      select.className = "tm-user-dropdown";
    
      // Build options
      rows.forEach(r => {
        const username = r.username || r.user_name || r.UserName || "";
        const opt = document.createElement("option");
    
        opt.value = username;
        opt.textContent = r.displayname || username;
        opt.dataset.raw = JSON.stringify(r);
    
        select.appendChild(opt);
      });
    
      // ---- APPLY FINAL SELECTION ----
      if (window._tm_lastSelected) {
        // Keep user-selected value during refresh
        select.value = window._tm_lastSelected.value;
      } else {
        // Reset only when popup reopens (employeesLoaded fired)
        select.value = MAIN_USER;
        const row = rows.find(r =>
          (r.username || r.user_name || r.UserName || "") === MAIN_USER
        );
        window._tm_lastSelected = { value: MAIN_USER, row };
      }
    
      // Update stored row reference
      const opt = select.options[select.selectedIndex];
      if (opt) {
        window._tm_lastSelected.row = JSON.parse(opt.dataset.raw);
      }
    
      // On change
      select.addEventListener("change", (e) => {
        const opt = e.target.options[e.target.selectedIndex];
        const raw = JSON.parse(opt.dataset.raw);
    
        window._tm_lastSelected = { value: opt.value, row: raw };
    
        window.dispatchEvent(new CustomEvent("teamMemberChanged", {
          detail: { value: opt.value, row: raw }
        }));
      });
    
      wrap.appendChild(select);
      return wrap;
    }
    
  
    function insertDropdown(element) {
      const container = document.getElementById("userDropdownContainer");
      if (!container) return console.warn("Dropdown container missing");
      container.innerHTML = "";
      container.appendChild(element);
    }
  
    function fetchDropdown() {
      injectStyles();
      parent.GetDataFromAxList(
        DS_PARAMS,
        (res) => insertDropdown(buildDropdown(extractRows(res))),
        () => insertDropdown(buildDropdown([]))
      );
    }
  
    window.tm_refreshUserDropdown = fetchDropdown;
    window.addEventListener("employeesLoaded", () => {
      // Reset only on popup OPEN, not refresh
      if (window._tm_lastSelected?.source !== "userChange") {
         window._tm_lastSelected = null;
      }
      setTimeout(fetchDropdown, 150);
    });
    
  
    window.addEventListener("teamMemberChanged", (e) => {
      const username = e.detail.value;
    
      // ðŸ‘‰ Mark that the user manually changed selection
      if (window._tm_lastSelected) {
        window._tm_lastSelected.source = "userChange";
      }
    
      const root = document.getElementById("plan-popup-root");
      if (root && username) {
        console.log("ðŸ”„ Reload tasks for:", username);
        loadEmployees(root, username);
      }
    });
    
  
  })();
  
  /* ---------- render left as accordion (no unscheduled/scheduled split) ---------- */
  function renderTaskList(root) {
    debugger
    const listEl = root.querySelector('#task-list');
    if (!listEl) return;
    // loading placeholder
    if (root._plannerState && root._plannerState._loading) {
      listEl.innerHTML = "<div class='small-muted'>Loading tasks...</div>";
      return;
    }
    const tasks = Array.isArray(root._plannerState.unscheduled) ?
      root._plannerState.unscheduled : [];
    if (tasks.length === 0) {
      listEl.innerHTML = "<div class='small-muted'>No tasks</div>";
      return;
    }
    listEl.innerHTML = '';
    const accordion = document.createElement('div');
    accordion.className = 'task-accordion accordion';
    accordion.id = 'taskAccordion';
    tasks.forEach((task, idx) => {
      const safeId = `task-${String(task.taskid || idx).replace(/[^a-z0-9_-]/gi, '')}`;
      const item = document.createElement('div');
      item.className = 'accordion-item';
      // Build body sections only if meaningful
      const parts = [];
      if (isMeaningful(task.taskdescription)) {
        // Convert richtext HTML to plain text safely
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = task.taskdescription; // browser parses the HTML
        let plainText = tempDiv.textContent || tempDiv.innerText || "";
        // Clean up whitespace and line breaks
        plainText = plainText.replace(/\s+/g, " ").trim();
        // Wrap in single paragraph tag
        parts.push(`<p style="line-height:1.5;">${plainText}</p>`);
      }
      // if (isMeaningful(task.action_message)) parts.push(`<div style="margin-top:6px;"><strong>Message:</strong> ${escapeHtml(task.action_message)}</div>`);
      // if (isMeaningful(task.remarks)) parts.push(`<div style="margin-top:6px;"><strong>Remarks:</strong> ${escapeHtml(task.remarks)}</div>`);
      const bodyHtml = parts.length ? parts.join('') : `<div class="small-muted">No details</div>`;
      item.innerHTML = `
      <h2 class="accordion-header" id="${safeId}-h">
      <button
        class="accordion-button collapsed"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#${safeId}-collapse"
        aria-expanded="false"
        aria-controls="${safeId}-collapse"
      >
        <!-- Drag handle -->
        <span
          class="drag-handle"
          title="Drag to schedule"
          aria-label="Drag handle"
          role="button"
          draggable="true"
        >
          <span class="material-icons material-symbols-outlined">drag_indicator</span>
        </span>
    
        <!-- Task details -->
        <div style="flex:1; display:flex; flex-direction:column; overflow:hidden;line-height:1.6;">
          <!-- First line: title + status dot at the end -->
          <div style="display:flex; align-items:center; justify-content:space-between; gap:6px;">
            <span
              class="title fw-semibold text-truncate"
              data-bs-toggle="tooltip"
              data-bs-placement="bottom"
              title="${escapeHtml(task.taskname)}"
              style="flex:1;"
              data-recid="${task.taskf_hdrid}"
            >
              ${escapeHtml(task.taskname)}
            </span>
    
            <span
              class="status-dot ${getStatusDotClass(task.status)}"
              title="${escapeHtml(task.status || 'Unknown')}"
            ></span>
          </div>
    
          <!-- Second line: Task ID -->
          <div class="text-muted small">${escapeHtml(task.taskid)}</div>
        </div>
    
        <!-- Chevron -->
        
      </button>
    </h2>
    
    <div
    id="${safeId}-collapse"
    class="accordion-collapse collapse"
    aria-labelledby="${safeId}-h"
    data-bs-parent="#taskAccordion"
    >
      <div class="card-body">
        ${bodyHtml}
      </div>
    </div>
    
      `;
      // when header clicked -> open report tab
      const headerBtn = item.querySelector('.accordion-button');
      if (headerBtn) {
        // get collapse panel
        const collapseEl = item.querySelector(`#${safeId}-collapse`);
        if (collapseEl) {
          // 1ï¸âƒ£ When expanding (opening)
          collapseEl.addEventListener('show.bs.collapse', () => {
            // Highlight the active accordion
            root.querySelectorAll(".accordion-button.active").forEach(el => el.classList.remove("active"));
            const headerBtn = item.querySelector(".accordion-button");
            if (headerBtn) headerBtn.classList.add("active");
            // Show dimmer before loading
            ;
            // Open the report tab
            openTaskReport(root, task);
          });
          // 2ï¸âƒ£ When collapsing (closing)
          collapseEl.addEventListener('hide.bs.collapse', () => {
            // Remove highlight if you want
            const headerBtn = item.querySelector(".accordion-button");
            if (headerBtn) headerBtn.classList.remove("active");
          });
        }
      }
      // drag only from handle (left panel) â€” mark source as 'left'
// drag only from handle (left panel) â€” mark source as 'left'
const handle = item.querySelector('.drag-handle');
if (handle) {
  handle.addEventListener('dragstart', ev => {
    ev.dataTransfer.setData('text/plain', String(task.taskid));
    try { ev.dataTransfer.setData('text/source', 'left'); } catch (e) {}
    // pass fromDate (may be empty for unscheduled)
    try { ev.dataTransfer.setData('text/fromDate', String(task.scheduleddate || '')); } catch (e) {}
     // â FIND THE TITLE SPAN AND GET data-recid
     const titleSpan = item.querySelector(".title[data-recid]");
     const recId = titleSpan ? titleSpan.dataset.recid : "";
 
     // â store recid in drag event
     ev.dataTransfer.setData("text/recid", recId);
    handle.classList.add('dragging');
    root._dragging = true;
  });
  handle.addEventListener('dragend', () => {
    handle.classList.remove('dragging');
    setTimeout(() => root._dragging = false, 20);
  });
}
      accordion.appendChild(item);
    });
    listEl.appendChild(accordion);
    // initialize bootstrap tooltips inside this root (guarded)
    try {
      const tooltipTriggers = Array.from(listEl.querySelectorAll('[data-bs-toggle="tooltip"]'));
      if (tooltipTriggers.length && window.bootstrap && typeof window.bootstrap.Tooltip === 'function') {
        tooltipTriggers.forEach(el => new bootstrap.Tooltip(el));
      }
    } catch (e) {
      /* ignore if bootstrap not present */
    }
  }
  /* ---------- calendar area ---------- */
  function renderCalendarArea(root) {
    const area = root.querySelector('#calendar-area');
    if (!area) return;
  
    // 1ï¸âƒ£ Save scroll position before clearing
    const prevContainer = area.querySelector('.day-view-stacked');
    const prevScroll = prevContainer
      ? { top: prevContainer.scrollTop, left: prevContainer.scrollLeft }
      : { top: area.scrollTop, left: area.scrollLeft };
  
    // 2ï¸âƒ£ Re-render everything
    area.innerHTML = '';
    renderDayStack(root, area);
  
    // 3ï¸âƒ£ Restore scroll AFTER layout is ready
    requestAnimationFrame(() => {
      const newContainer = area.querySelector('.day-view-stacked');
      if (newContainer) {
        newContainer.scrollTop = prevScroll.top || 0;
        newContainer.scrollLeft = prevScroll.left || 0;
      } else {
        area.scrollTop = prevScroll.top || 0;
        area.scrollLeft = prevScroll.left || 0;
      }
    });
  }
  
  // function openTaskReport(root, task) {
  //   const tabCalendar = root.querySelector("#tab-calendar");
  //   //const tabReport = root.querySelector("#tab-report");
  //   const calendarTab = root.querySelector("#calendar-tab");
  // //  const reportTab = root.querySelector("#report-tab");
  //   //const reportFrame = root.querySelector("#report-frame");
  //  // if (!tabCalendar || !tabReport || !calendarTab || !reportTab || !reportFrame) return;
  //   // ðŸ”¹ Switch to Report tab
  //  // tabReport.classList.add("tab-active");
  //   tabCalendar.classList.remove("tab-active");
  //   calendarTab.style.display = "none";
  //   reportTab.style.display = "block";
  //   // ðŸ”¹ Load that task in tstruct.aspx
  //   if (task && task.taskid) {
  //     const taskid = encodeURIComponent(task.taskid);
  //     const taskname = encodeURIComponent(task.taskname);
  //     const recid = task.taskf_hdrid
  //     const url = `EntityForm.aspx?tstid=Taskm&recid=${recid}`;
      
  //  ///   reportFrame.src = url;
  //   } else {
  //   //  reportFrame.src = "";
  //   //  reportFrame.contentDocument ?.write("<p style='padding:10px;'>No record found.</p>");
  //     try {
  //       
  //     } catch (e) {}
  //   }
  // }
  // function setupTabs(root) {
  //   const tabCalendar = root.querySelector("#tab-calendar");
  //   //const tabReport = root.querySelector("#tab-report");
  // //  const calendarTab = root.querySelector("#calendar-tab");
  //  // const reportTab = root.querySelector("#report-tab");
  //   //const reportFrame = root.querySelector("#report-frame");
  //  // if (!tabCalendar || !tabReport || !calendarTab || !reportTab) return;
  //   // Default tab
  //   tabCalendar.classList.add("tab-active");
  //   calendarTab.style.display = "block";
  //   reportTab.style.display = "none";
  //   // Click handlers
  //   tabCalendar.addEventListener("click", () => {
  //     tabCalendar.classList.add("tab-active");
  //   //  tabReport.classList.remove("tab-active");
  //   //  calendarTab.style.display = "block";
  //    // reportTab.style.display = "none";
  //   });
  //   // tabReport.addEventListener("click", () => {
  //   //   tabReport.classList.add("tab-active");
  //   //   tabCalendar.classList.remove("tab-active");
  //   //   calendarTab.style.display = "none";
  //   //   reportTab.style.display = "block";
  //   //   // Load first record from left panel into tstruct
  //   //   const firstTask = root._plannerState ?.tasks ?. [0];
  //   //   if (firstTask) {
  //   //     const taskid = encodeURIComponent(firstTask.taskid);
  //   //     const taskname = encodeURIComponent(firstTask.taskname);
  //   //     const recid = firstTask.taskf_hdrid
  //   //     const url = `EntityForm.aspx?tstid=Taskm&recid=${recid}`;
  //   //       reportFrame.src = url;
  //   //   } else {
  //   //     reportFrame.src = "";
  //   //     reportFrame.contentDocument ?.write("<p style='padding:10px;'>No record found.</p>");
  //   //   }
  //   // });
  // }
  function formatDMY(date) {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }
  function addDays(date, n) {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
  }
  function genTempId(prefix = 'tmp') {
    return prefix + '_' + Date.now() + '_' + Math.floor(Math.random() * 1000000);
  }
  // function showMoveCopyPopup(x, y, onChoose) {
  //   // remove any existing popup
  //   const prev = document.querySelector('.mc-popup');
  //   if (prev) prev.remove();
  //   const popup = document.createElement('div');
  //   popup.className = 'mc-popup';
  //   popup.style.left = `${x}px`;
  //   popup.style.top = `${y}px`;
  //   popup.innerHTML = `
  //     <button class="btn-move" data-action="move">Move</button>
  //     <button class="btn-copy" data-action="copy">Copy</button>
  //     <button class="btn-cancel" data-action="cancel">Cancel</button>
  //   `;
  //   document.body.appendChild(popup);
  //   function cleanup() {
  //     try {
  //       popup.remove();
  //     } catch (e) {}
  //     document.removeEventListener('click', outsideHandler);
  //   }
  //   function outsideHandler(ev) {
  //     if (!popup.contains(ev.target)) cleanup();
  //   }
  //   document.addEventListener('click', outsideHandler);
  //   popup.addEventListener('click', ev => {
  //     const btn = ev.target.closest('button');
  //     if (!btn) return;
  //     const action = btn.dataset.action;
  //     if (action === 'cancel') {
  //       cleanup();
  //       return;
  //     }
  //     cleanup();
  //     if (typeof onChoose === 'function') onChoose(action);
  //   });


  //   return popup;
  // }
  function showMoveCopyPopup(x, y, onChoose, options = {}) {
    const { disableCopy = false } = options;
  
    // remove any existing popup
    const prev = document.querySelector('.mc-popup');
    if (prev) prev.remove();
  
    const popup = document.createElement('div');
    popup.className = 'mc-popup';
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
  
    popup.innerHTML = `
      <button class="btn-move" data-action="move">Move</button>
      <button class="btn-copy" data-action="copy" 
        ${disableCopy ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>
        Copy
      </button>
      <button class="btn-cancel" data-action="cancel">Cancel</button>
    `;
  
    document.body.appendChild(popup);
  
    function cleanup() {
      try { popup.remove(); } catch (e) {}
      document.removeEventListener('click', outsideHandler);
    }
  
    function outsideHandler(ev) {
      if (!popup.contains(ev.target)) cleanup();
    }
  
    document.addEventListener('click', outsideHandler);
  
    popup.addEventListener('click', ev => {
      const btn = ev.target.closest('button');
      if (!btn) return;
  
      const action = btn.dataset.action;
  
      // 🚫 prevent disabled copy click
      if (action === 'copy' && disableCopy) return;
  
      if (action === 'cancel') {
        cleanup();
        return;
      }
  
      cleanup();
  
      if (typeof onChoose === 'function') onChoose(action);
    });
  
    return popup;
  }
  function performMove(root, task, targetFullDate, opts = {}) {
    
  
    // ðŸ§  If the move came from the left, set estimateddays to 0
    if (opts.fromLeft) {
      try { task.estimateddays = 0; } catch (e) {}
    }
  
    // âœ… Check if same task already exists on target date
    const alreadyExists = root._plannerState.tasks.some(
      t => t.scheduleddate === targetFullDate && String(t.taskid) === String(task.taskid)
    );
    if (alreadyExists) {
      parent.showAlertDialog('info',`Task ${task.taskid} already exists on ${targetFullDate} â€” move prevented.`);
      
      return; // âŒ stop move
    }
  
    // ðŸ”¹ Remove from previous assignQueue (if any)
    try {
     // const prevDate = task.scheduleddate;
     const prevDate = opts['fromDate']
      if (prevDate && Array.isArray(root._plannerState.assignQueue?.[prevDate])) {
        root._plannerState.assignQueue[prevDate] =
          root._plannerState.assignQueue[prevDate].filter(id => id !== task.taskid);
      }
    } catch (e) {}
  
    // ðŸ”¹ Assign to new date
    task.scheduleddate = targetFullDate;
    root._plannerState.assignQueue[targetFullDate] =
      root._plannerState.assignQueue[targetFullDate] || [];
    if (!root._plannerState.assignQueue[targetFullDate].includes(task.taskid)) {
      root._plannerState.assignQueue[targetFullDate].push(task.taskid);
    }
  
    // ðŸ§¹ If moved from left, remove from unscheduled list
    if (opts.fromLeft) {
      try {
        if (Array.isArray(root._plannerState.unscheduled)) {
          root._plannerState.unscheduled = root._plannerState.unscheduled.filter(
            t => String(t.taskid) !== String(task.taskid)
          );
        }
  
        // Also remove old unscheduled version of the task
        root._plannerState.tasks = root._plannerState.tasks.filter(t => {
          if (String(t.taskid) === String(task.taskid)) {
            if (!t.scheduleddate || t.scheduleddate === 'null' || t.scheduleddate === '[null]') {
              return false;
            }
          }
          return true;
        });
      } catch (e) {
        console.warn('Failed to remove task from left list after move:', e);
      }
    }
   // const recid = task.taskf_hdrid
    // ðŸ’¾ Persist to backend (Ax)
    try {
      // prevDate was captured earlier:
      const prevDate = task.scheduleddateBeforeMove || task.scheduleddate || null;
      // prefer explicit option, else fallback to previously captured prevDate
      const fromDate = (opts && opts.fromDate) ? opts.fromDate : prevDate || '';
    
      parent.AxSetValue("tasku", "taskid", "1", "0", task.taskid);
      parent.AxSetValue("tasku", "newdate", "1", "0", targetFullDate);
      parent.AxSetValue("tasku", "moveflg", "1", "0", "T");
      parent.AxSetValue("tasku", "fromdate", "1", "0", fromDate);
      parent.AxSubmitData("tasku", "0");
    } catch (e) {
      console.warn('persist move failed:', e);
    }
  
    // ðŸ”„ Re-render both views
// Let UI finish rendering before hiding dimmer
setTimeout(() => {
    renderCalendarArea(root);
    renderTaskList(root);
    const container = document.getElementById('body_Container');
if (container) {
    container.scrollTop = root._savedScrollTop || 0;
}
    parent.ShowDimmer(false);
  }, 0);
   
  }
  function hideDimmerSafely() {
    try {
      
    } catch (e) {
      console.warn("Failed to hide dimmer", e);
    }
  }
  
  function performCopyRange(root, task, targetFullDate) {
    ;
  
    const srcStr = task.scheduleddate;
  
    // ðŸ§  If no source date, copy only to target (not same day)
    if (!srcStr) {
      const exists = root._plannerState.tasks.find(
        t => t.scheduleddate === targetFullDate && t.taskid === task.taskid
      );
      if (exists) {
        
        return;
      }
  
      const copy = { ...task };
      copy._uid = genTempId('copy');
      copy.origTaskId = task.taskid;
      copy.taskid = task.taskid; // keep visible ID same
      copy.scheduleddate = targetFullDate;
      copy._isCopy = true;
  
      root._plannerState.tasks.push(copy);
      root._plannerState.assignQueue[targetFullDate] =
        root._plannerState.assignQueue[targetFullDate] || [];
      root._plannerState.assignQueue[targetFullDate].push(copy._uid);
      
      // ðŸ§© Persist via parent Ax calls
      try {
        parent.AxSetValue("tasku", "taskid", "1", "0", task.taskid);
        parent.AxSetValue("tasku", "newdate", "1", "0", targetFullDate);
        parent.AxSubmitData("tasku", recid);
      } catch (err) {
        console.warn("Ax persistence failed for single copy:", err);
      }
  
      renderCalendarArea(root);
      
      return;
    }
  
    // ðŸ“… Range copy logic
    const srcDate = parseDMY(srcStr);
    const tgtDate = parseDMY(targetFullDate);
    if (!srcDate || !tgtDate) {
      
      return;
    }
  
    const start = new Date(Math.min(srcDate, tgtDate));
    const end = new Date(Math.max(srcDate, tgtDate));
    const copies = [];
  
    for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
      const dayStr = formatDMY(d);
      if (dayStr === srcStr) continue; // skip source
  
      // âœ… Skip if same taskid already exists on that day
      const alreadyExists = root._plannerState.tasks.some(
        t => t.scheduleddate === dayStr && t.taskid === task.taskid
      );
      if (alreadyExists) continue;
  
      const copy = { ...task };
      copy._uid = genTempId('copy');
      copy.origTaskId = task.taskid;
      copy.taskid = task.taskid;
      copy.scheduleddate = dayStr;
      copy._isCopy = true;
      copies.push(copy);
    }
  
    // ðŸ§© Add to plannerState and persist each via Ax
    copies.forEach(c => {
      root._plannerState.tasks.push(c);
      root._plannerState.assignQueue[c.scheduleddate] =
        root._plannerState.assignQueue[c.scheduleddate] || [];
      root._plannerState.assignQueue[c.scheduleddate].push(c._uid);
  
      // ðŸ’¾ Persist each copied record to backend
      try {
        parent.AxSetValue("tasku", "taskid", "1", "0", c.taskid);
        parent.AxSetValue("tasku", "newdate", "1", "0", c.scheduleddate);
        parent.AxSubmitData("tasku", "0");
        console.log(` Copied task ${c.taskid} to ${c.scheduleddate}`);
      } catch (err) {
        console.warn("Ax persistence failed for copy:", err);
      }
    });
  
    renderCalendarArea(root);
    
  }
  
  function parseDMY(dateStr) {
    if (!dateStr) return null;
    const [d, m, y] = dateStr.split('/');
    return new Date(Number(y), Number(m) - 1, Number(d)); // months are 0-based
  }
  function renderDayStack(root, area) {
    // remove previous stack
    const prev = area.querySelector('.day-view-stacked');
    if (prev) prev.remove();
  
    const container = document.createElement('div');
    container.className = 'day-view-stacked';
    area.appendChild(container);
  
    const date = new Date(root._plannerState.year, root._plannerState.month, 1);
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
  
    const monthLabel = root.querySelector('#calendar-month-year');
    if (monthLabel) {
      monthLabel.innerText = date.toLocaleString('default', { month: 'long' }) + ' ' + year;
    }
  
    // ðŸ‘‡ Only one loop now (handles both months)
    const daysPerRow = 4;
    const totalCells = Math.ceil(daysInMonth / daysPerRow) * daysPerRow;
    const nextMonth = month + 1;
    const nextYear = nextMonth > 11 ? year + 1 : year;
    const nextMonthIndex = nextMonth % 12;
  
    for (let cell = 1; cell <= totalCells; cell++) {
      let displayDate, displayMonth, displayYear;
  
      if (cell <= daysInMonth) {
        // Normal days of current month
        displayDate = cell;
        displayMonth = month;
        displayYear = year;
      } else {
        // Overflow from next month
        displayDate = cell - daysInMonth;
        displayMonth = nextMonthIndex;
        displayYear = nextYear;
      }
  
      const yyyy = displayYear;
      const mm = String(displayMonth + 1).padStart(2, '0');
      const dd = String(displayDate).padStart(2, '0');
      const fullDate = `${dd}/${mm}/${yyyy}`;
  
      const dayCard = document.createElement('div');
      dayCard.className = 'day-card';
      dayCard.dataset.date = fullDate;
  
      const weekday = new Date(displayYear, displayMonth, displayDate).toLocaleString('default', { weekday: 'short' });
  
      // Dim overflow days
      // if (cell > daysInMonth) {
      //   dayCard.style.opacity = '0.6';
      //   dayCard.style.background = '#f9f9f9';
      // }
  
      // ðŸ”¹ Fetch tasks for this date
      const allTasks = root._plannerState.tasks || [];
      const tasksForDate = allTasks.filter(task => {
        if (!task.scheduleddate) return false;
        const startDate = parseDMY(task.scheduleddate);
        if (!startDate) return false;
  
        const duration = Number(task.estimateddays) || 0;
        const current = new Date(displayYear, displayMonth, displayDate);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + duration);
  
        return current >= startDate && current <= endDate;
      });
  
      const tasksDisplayStyle =
        tasksForDate.length === 0
          ? 'display:flex;flex-direction:column;gap:6px;min-height:56px;align-items:flex-start;opacity:0.95;'
          : 'display:flex;flex-direction:column;gap:6px;';
  
      dayCard.innerHTML = `
        <div class="day-header" style="cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
          <div class="day-title" style="font-weight:600; font-size:14px;">
            ${displayDate} ${new Date(displayYear, displayMonth, displayDate).toLocaleString('default', { month: 'short' })} ${weekday}
          </div>
          <div class="day-count small-muted" style="font-size:12px; color:#666;">
            ${tasksForDate.length} ${tasksForDate.length === 1 ? 'task' : 'tasks'}
          </div>
        </div>
        <div class="day-tasks" data-date="${fullDate}" 
          style="${tasksDisplayStyle}; height:120px; overflow-y:auto; width:100%; padding:4px; box-sizing:border-box; border:1px solid #eee; border-radius:6px;">
        </div>
      `;
  
      const tasksEl = dayCard.querySelector('.day-tasks');
  
      // Attach drag/drop handlers (same as before)
dayCard.addEventListener('dragover', ev => {
    ev.preventDefault();
    // Prevents the container from collapsing if the items are moved
    ev.currentTarget.style.minHeight = ev.currentTarget.offsetHeight + 'px';
});     
 dayCard.addEventListener('drop', ev => {
    ev.preventDefault();

    // 1. CAPTURE SCROLL POSITION IMMEDIATELY
    // Using body_Container as it is the main wrapper in your inbox.js
    const scrollContainer = document.getElementById('body_Container');
    const savedScrollTop = scrollContainer ? scrollContainer.scrollTop : window.scrollY;

    // 2. READ DATA TRANSFER (Must be done before any timeouts)
    const draggedId = ev.dataTransfer.getData('text/plain');
    const fromDate  = ev.dataTransfer.getData('text/fromDate') || '';
    const src       = ev.dataTransfer.getData('text/source') || '';
    const recId     = ev.dataTransfer.getData('text/recid') || '';

    // 3. EXECUTE LOGIC
    setTimeout(() => {
        if (!draggedId) {
            parent.ShowDimmer(false);
            return;
        }

        const task = root._plannerState.tasks.find(t => t.taskid == draggedId);
        
        // Date Validation Logic
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [dd, mm, yyyy] = fullDate.split("/");
        const dropDate = new Date(yyyy, mm - 1, dd);
        dropDate.setHours(0, 0, 0, 0);

        const isPastDrop = dropDate < today;
        const isFromLeft = src === "left";
        const isFromPast = fromDate && new Date(fromDate.split("/").reverse().join("-")) < today;

        // Block Drops to Past
        if (isPastDrop) {
            parent.ShowDimmer(false);
            parent.showAlertDialog("warning", "Cannot move/copy to past dates.");
            return;
        }
  const restoreScroll = () => {
        setTimeout(() => {
            if (scrollContainer) {
                scrollContainer.scrollTop = savedScrollTop;
            } else {
                window.scrollTo(0, savedScrollTop);
            }
        }, 0); // ✅ runs AFTER render
    };
   const scrollContainer = document.getElementById('body_Container');
root._savedScrollTop = scrollContainer ? scrollContainer.scrollTop : window.scrollY;
        // Handle the Move/Copy
        if (isFromLeft) {
            performMove(root, task, fullDate, {
                fromLeft: true,
                fromDate
            });
             

        } else if (isFromPast) {
            performMove(root, task, fullDate, { fromDate });
        } else {
            showMoveCopyPopup(ev.clientX + 6, ev.clientY + 6, action => {
                if (action === 'move') {
                    performMove(root, task, fullDate, { fromDate });
                } else if (action === 'copy') {
                    performCopyRange(root, task, fullDate);
                } else {
                    parent.ShowDimmer(false);
                }
            });
        }

        // 4. RESTORE SCROLL POSITION
        // We wrap this in another small timeout or requestAnimationFrame 
        // to ensure it happens AFTER the DOM has finished re-rendering.
        // requestAnimationFrame(() => {
        //     if (scrollContainer) {
        //         scrollContainer.scrollTop = savedScrollTop;
        //     } else {
        //         window.scrollTo(0, savedScrollTop);
        //     }
        // });

    }, 0);
});
  
      // Render task cards inside
      tasksForDate.forEach(task => {
        const card = document.createElement('div');
        card.className = 'cal-chip';
        card.draggable = true;
        card.dataset.taskid = task.taskid;
        card.dataset.recid = task.taskf_hdrid;
        card.dataset.scheduleddate = task.scheduleddate;
        card.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; gap:6px;">
      <!-- LEFT SIDE: ID + Name -->
      <div style="flex:1; min-width:0;">
        <div class="cal-chip-id">${escapeHtml(task.taskid)}</div>
        <div class="cal-chip-name text-truncate">${escapeHtml(task.taskname || '')}</div>
      </div>
      <!-- RIGHT SIDE: ACTION ICONS -->
      <div style="display:flex; align-items:center; gap:2px;">
        <span class="material-icons chip-view"
              title="View"
              style="font-size:18px; cursor:pointer;">
          visibility
        </span>
        <span class="material-icons chip-delete"
              title="Delete"
              style="font-size:18px; cursor:pointer; color:#b30000;">
          delete
        </span>
      </div>
    </div>        `;
        card.style.background = getRandomColor();
  
        card.addEventListener('dragstart', ev => {
          ev.dataTransfer.setData('text/plain', String(task.taskid));
          ev.dataTransfer.setData('text/source', 'calendar');
          ev.dataTransfer.setData('text/fromDate', String(task.scheduleddate || ''));
        });
/* --------------------------------------------------------
   *   ð VIEW ICON â open task report, stop drag
     -------------------------------------------------------- */
    //  const viewIcon = card.querySelector(".chip-view");

    //  viewIcon.addEventListener("click", (ev) => {
    //      ev.stopPropagation();
    //      ev.preventDefault();
     
    //      const recid = task.recid || card.dataset.recid;
     
    //      if (!recid) {
    //          alert("No record ID available for this task.");
    //          return;
    //      }
     
    //      const url = `../../aspx/tstruct.aspx?transid=Taskm`
    //          + `&act=load`
    //          + `&recordid=${encodeURIComponent(recid)}`
    //          + `&calledFrom=TaskPlanner`; // ✅ fix
     
    //      if (createPopup) {
    //      createPopup(url);
    //      } 
         
    //  });
     const viewIcon = card.querySelector(".chip-view");

viewIcon.addEventListener("click", (ev) => {
    ev.stopPropagation();
    ev.preventDefault();
    const targetDiv = document.querySelector(".d-flex.align-items-center.flex-nowrap.text-nowrap");
    if (targetDiv) {
        targetDiv.style.position = "relative";
        targetDiv.style.right = "25px";
    }
    const recid = task.recid || card.dataset.recid;

    if (!recid) {
        alert("No record ID available for this task.");
        return;
    }

    const url = `../../aspx/tstruct.aspx?transid=Taskm`
        + `&act=load`
        + `&recordid=${encodeURIComponent(recid)}`
        + `&calledFrom=TaskPlanner`;

    const modal = document.getElementById("filterModal");
    const planner = modal?.querySelector("#plan-popup-root");

    if (!modal || !planner) return;

    let iframe = modal.querySelector("#taskFrame");

    // ✅ Create iframe only once
    if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.id = "taskFrame";

        Object.assign(iframe.style, {
            width: "100%",
            height: "100vh",
            border: "none",
            display: "none"
        });

        planner.parentElement.appendChild(iframe);
    }

    // 🔥 TOGGLE
    planner.style.display = "none";
    iframe.style.display = "block";
    iframe.src = url;
});
  /* --------------------------------------------------------
   *   ð DELETE ICON â remove task from date, stop drag
     -------------------------------------------------------- */
 // DELETE ICON CLICK
const deleteIcon = card.querySelector(".chip-delete");
deleteIcon.addEventListener("click", (ev) => {
  ev.stopPropagation();
  ev.preventDefault();
  openDeleteModal(() => {
      deleteTaskFromCalendar(ev,task, root);
  });
});
function deleteTaskFromCalendar(ev, task, root) {

    ev.stopPropagation();

    // 🔥 capture element immediately
    const chip = ev.target.closest("[data-taskid]");

    parent.ShowDimmer(true);

    const params2 = {
        adsNames: ["RECORDAFTERSAVE"],
        refreshCache: false,
        sqlParams: {
            taskid: String(task.taskid)
        }
    };

    parent.GetDataFromAxList(
        params2,
        (res) => {
            const recid = JSON.parse(res)?.result?.data?.[0]?.data?.[0]?.tasku1id;

            if (!recid) {
                console.error("No recid returned from ADS.");
                return;
            }

            parent.AxSetValue("tasku", "deletflg", "1", "0", "T");
            parent.AxSetValue("tasku", "taskid", "1", "0", `${task.taskid}`);
            parent.AxSetValue("tasku", "newdate", "1", "0", `${task.scheduleddate}`);

            parent.AxSubmitData("tasku", recid);

            // ✅ use stored reference (NOT ev.target again)
            if (chip) {
                chip.remove();
            }

           // 1. Update the global tasks array to clear the date for this specific task
root._plannerState.tasks = root._plannerState.tasks.map(t => {
    if (String(t.taskid) === String(task.taskid)) {
        return { ...t, scheduleddate: "" }; // Clear the date
    }
    return t;
});

// 2. Clear it from the assignQueue so the drop logic doesn't see it
Object.keys(root._plannerState.assignQueue || {}).forEach(date => {
    root._plannerState.assignQueue[date] = root._plannerState.assignQueue[date].filter(
        id => String(id) !== String(task.taskid)
    );
});

// 3. Update the unscheduled list for the UI
root._plannerState.unscheduled = root._plannerState.unscheduled.filter(
    t => String(t.taskid) !== String(task.taskid)
);
root._plannerState.unscheduled.unshift({ ...task, scheduleddate: "" });

parent.ShowDimmer(false);
parent.showAlertDialog("success", "Task deleted successfully.");

// 4. Refresh UI
renderTaskList(root);
renderCalendarArea(root); // Crucial to refresh the calendar state
        },
        (err) => {
            console.error("Delete failed", err);
            parent.ShowDimmer(false);
            alert("Failed to delete task.");
        }
    );
}
(function addModalCSS() {
  const css = `
  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; z-index:100000; }
  .modal-box { background:#fff; padding:20px 24px; border-radius:10px; width:320px; box-shadow:0 10px 30px rgba(0,0,0,0.2); font-family:Inter, sans-serif; }
  .modal-title { font-size:18px; font-weight:600; margin-bottom:10px; }
  .modal-message { font-size:15px; color:#444; margin-bottom:20px; }
  .modal-actions { display:flex; justify-content:flex-end; gap:10px; }
  .btn-cancel { background:#e5e7eb; padding:6px 14px; border-radius:6px; border:none; cursor:pointer; }
  .btn-delete { background:#ef4444; color:#fff; padding:6px 14px; border-radius:6px; border:none; cursor:pointer; }
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
})();
(function injectDeleteModal() {
  const modalHTML = `
  <div id="deleteModal" style="
      display:none; position:fixed; inset:0;
      background:rgba(0,0,0,0.4); 
      z-index:999999; 
      align-items:center; justify-content:center;
      font-family:Inter, sans-serif;">
      
      <div style="
          background:#fff; padding:20px; border-radius:10px; width:320px; 
          box-shadow:0 10px 25px rgba(0,0,0,0.2);">
          
          
          <div style="font-size:15px; color:#444; margin-bottom:20px;">
              Are you sure you want to delete this task?
          </div>
          <div style="display:flex; justify-content:flex-end; gap:10px;">
              <button id="modalCancel" style="
                  background:#e5e7eb; border:none; 
                  padding:6px 14px; border-radius:6px;
                  cursor:pointer;">Cancel</button>
              <button id="modalConfirm" style="
                  background:#ef4444; color:white; border:none;
                  padding:6px 14px; border-radius:6px;
                  cursor:pointer;">Delete</button>
          </div>
      </div>
  </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHTML);
})();
function openDeleteModal(onConfirm) {
  const modal = document.getElementById("deleteModal");
  modal.style.display = "flex";
  const cancelBtn = document.getElementById("modalCancel");
  const confirmBtn = document.getElementById("modalConfirm");
  // remove old listeners
  cancelBtn.onclick = () => { modal.style.display = "none"; };
  confirmBtn.onclick = () => {
      modal.style.display = "none";
      onConfirm(); // run actual delete
  };
}
        // ---------- Hover: show details by calling GetDataFromAxList ----------
(function() {
  // helper to strip tags (customer field may contain html)
  function stripHtmlTags(html) {
    if (!html) return '';
    try {
      // Remove all HTML tags
      html = html.replace(/<\/?[^>]+(>|$)/g, ' ');
      html = html.replace(/\s+/g, ' ').trim();
  
      // Decode HTML entities
      const txt = document.createElement('textarea');
      txt.innerHTML = html;
      let clean = txt.value.trim();
  
      // Remove any "Customer -" prefix (case-insensitive)
      clean = clean.replace(/^Customer\s*-\s*/i, '');
  
      return clean;
    } catch (e) {
      return html;
    }
  }
  // Build small details table HTML from a single row object
  function buildTaskDetailTableRow(row) {
    if (!row) return '<div class="small-muted">No details</div>';
    const dd = row.duedate ? formatDateShort(row.duedate) : '';
    // prefer plain text for customer
    const cust = stripHtmlTags(row.customer || row.customername || row.customer_name || '');
    return `
      <table style="font-size:13px; border-collapse:collapse; min-width:220px;">
        <tbody>
        <tr><td style="padding:6px 8px; font-weight:600; width:90px;">Task Name</td><td style="padding:6px 8px;">${escapeHtml(row.taskname || '')}</td></tr>
          <tr><td style="padding:6px 8px; font-weight:600; width:90px;">Assign By</td><td style="padding:6px 8px;">${escapeHtml(row.assignby || row.AssignBy || row.assign_by || '')}</td></tr>
          <tr><td style="padding:6px 8px; font-weight:600;">Assign To</td><td style="padding:6px 8px;">${escapeHtml(row.assignto || row.AssignTo || row.assigned_to || '')}</td></tr>
          <tr><td style="padding:6px 8px; font-weight:600;">Customer</td><td style="padding:6px 8px;">${escapeHtml(cust)}</td></tr>
          <tr><td style="padding:6px 8px; font-weight:600;">Priority</td><td style="padding:6px 8px;">${escapeHtml(row.priority || '')}</td></tr>
          <tr><td style="padding:6px 8px; font-weight:600;">Status</td><td style="padding:6px 8px;">${escapeHtml(row.status || row.sttaus || '')}</td></tr>
          <tr><td style="padding:6px 8px; font-weight:600;">Due</td><td style="padding:6px 8px;">${escapeHtml(dd)}</td></tr>
        </tbody>
      </table>
    `;
  }
  // create popup element
  function showTaskDetailPopup(targetEl, html) {
      
  
      const popup = document.createElement('div');
      popup.className = 'task-hover-popup';
      popup.style.cssText = `
          position:fixed;
          z-index:1000000;
          background:#fff;
          border:1px solid rgba(0,0,0,0.08);
          padding:8px;
          border-radius:8px;
          box-shadow:0 8px 24px rgba(2,6,23,0.12);
          font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
          font-size:13px;
          color:#0f1724;
          max-width:320px;
          pointer-events:auto;
      `;
      popup.innerHTML = html;
  
      document.body.appendChild(popup);
      popup._anchor = targetEl;
  // Keep popup open when hovered
popup.addEventListener("mouseenter", () => {
  popup._hovering = true;
});
popup.addEventListener("mouseleave", () => {
  popup._hovering = false;
  hideTaskDetailPopup();
});
      // --- CALCULATE POSITION (AFTER APPENDING POPUP) ---
      const rect = targetEl.getBoundingClientRect();
      const popupW = popup.offsetWidth;
      const popupH = popup.offsetHeight;
  
      // Horizontal center alignment
      let left = rect.left + rect.width / 2 - popupW / 2;
      left = Math.max(10, Math.min(left, window.innerWidth - popupW - 10));
  
      // Default BELOW
      let top = rect.bottom + window.scrollY + 8;
  
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;
  
      // --- DECIDE ONCE if popup is above or below ---
      let position = "below";
      if (spaceBelow < popupH && spaceAbove > popupH) {
          position = "above";
      }
      popup.dataset.position = position;
  
      // Apply the chosen direction
      if (position === "above") {
          top = rect.top + window.scrollY - popupH - 8;
      }
  
      // Clamp inside viewport (no flipping)
      top = Math.max(window.scrollY + 10,
          Math.min(top, window.scrollY + window.innerHeight - popupH - 10));
  
      popup.style.left = `${left}px`;
      popup.style.top = `${top}px`;
  
      return popup;
  }
  
  function hideTaskDetailPopup() {
    const prev = document.querySelector('.task-hover-popup');
    if (prev) try { prev.remove(); } catch (e) {}
  }
  // attach hover handlers to the `card` created in your loop
 // ---- Attach popup only when hovering the Task ID (.cal-chip-id) ----
const nameEl = card.querySelector(".cal-chip-id");
if (nameEl) {
  // Mouse Enter on ID
  nameEl.addEventListener('mouseenter', function (ev) {

    // ❌ BLOCK while dragging
    if (root._dragging) return;
  
    // ❌ BLOCK if mouse button pressed (drag/scroll)
    if (ev.buttons !== 0) return;
  
    if (card._hoverTimer) clearTimeout(card._hoverTimer);
  
    card._hoverTimer = setTimeout(() => {
  
      // ❌ DOUBLE SAFETY
      if (root._dragging) return;
  
      // // ❌ MUST STILL BE HOVERED
      // if (!nameEl.matches(':hover')) return;
  
      const params1 = {
        adsNames: ['Taskdetails'],
        refreshCache: false,
        sqlParams: { taskid: String(task.taskid) }
      };
  
      const loadingHtml = `<div style="padding:8px 4px;">Loading...</div>`;
      showTaskDetailPopup(nameEl, loadingHtml);
  
      try {
        parent.GetDataFromAxList(
          params1,
          (response) => {
  
           
  
            let parsed = {};
            try { parsed = JSON.parse(response); } catch (e) {}
  
            const row = parsed?.result?.data?.[0]?.data?.[0] || {};
  
            hideTaskDetailPopup();
            showTaskDetailPopup(nameEl, buildTaskDetailTableRow(row));
          },
          () => hideTaskDetailPopup()
        );
      } catch (ex) {
        hideTaskDetailPopup();
      }
  
    }, 250);
  });
  // Mouse Leave from ID
  nameEl.addEventListener("mouseleave", () => {
    if (card._hoverTimer) {
      clearTimeout(card._hoverTimer);
      card._hoverTimer = null;
    }
  
    hideTaskDetailPopup(); 
  });
}
//   card.addEventListener('mouseleave', function () {
//     if (card._hoverTimer) {
//         clearTimeout(card._hoverTimer);
//         card._hoverTimer = null;
//     }
//     setTimeout(() => {
//         const popup = document.querySelector('.task-hover-popup');
//         if (!popup) return;
//         // Do NOT hide if mouse is over popup
//         const r = popup.getBoundingClientRect();
//         let mx = 0, my = 0;

//         if (event && event.clientX !== undefined) {
//             mx = event.clientX;
//             my = event.clientY;
//         }
//         const inside =
//             mx >= r.left && mx <= r.right &&
//             my >= r.top  && my <= r.bottom;
//        // if (!inside) hideTaskDetailPopup();
//     }, 60);
// });
  // also hide popup on scroll or click elsewhere
 window.addEventListener("scroll", () => {
  const popup = document.querySelector(".task-hover-popup");
  if (!popup || !popup._anchor) return;
  const anchor = popup._anchor;
  const rect = anchor.getBoundingClientRect();
  const popupW = popup.offsetWidth;
  const popupH = popup.offsetHeight;
  let left = rect.left + rect.width / 2 - popupW / 2;
  left = Math.max(10, Math.min(left, window.innerWidth - popupW - 10));
  let top;
  if (popup.dataset.position === "above") {
      top = rect.top + window.scrollY - popupH - 8;
  } else {
      top = rect.bottom + window.scrollY + 8;
  }
  // clamp
  top = Math.max(
      window.scrollY + 10,
      Math.min(top, window.scrollY + window.innerHeight - popupH - 10)
  );
  popup.style.left = left + "px";
  popup.style.top  = top + "px";
});
  document.addEventListener('click', () => { hideTaskDetailPopup(); }, true);
})();
  
        tasksEl.appendChild(card);
      });
  
      container.appendChild(dayCard);
    }
  
    renderTaskList(root);

    // ✅ AUTO FOCUS TODAY
setTimeout(() => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();

  const todayStr = `${dd}/${mm}/${yyyy}`;

  const todayCard = container.querySelector(`.day-card[data-date="${todayStr}"]`);

  if (todayCard) {

    // 🔵 Add blue border highlight
    todayCard.style.border = "2px solid #0b69ff";
    todayCard.style.boxShadow = "0 0 0 2px rgba(11,105,255,0.2)";

    // 📍 Scroll into view (centered)
    todayCard.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center"
    });

  }
}, 100);
  }
  
  function opentstruct(elem) {
    var taskid = elem.dataset.taskid;
    var taskname = elem.dataset.taskname;
    const recid = elem.dataset.recid
    const url = `EntityForm.aspx?tstid=Taskm&recid=${recid}`;
    if (window.parent && typeof window.parent.LoadIframe === 'function') {
      window.parent.LoadIframe(url);
    }
  }
  /* ---------- assign/remove ---------- */
  // function assignTaskToDate(taskid, dateStr, root, opts) {
  //   const task = root._plannerState.tasks.find(t => t.taskid == taskid);
  //   if (!task) return;
  //   if (task.scheduledDate) {
  //     const prev = root._plannerState.assignQueue[task.scheduledDate] || [];
  //     root._plannerState.assignQueue[task.scheduledDate] = prev.filter(id => id !== taskid);
  //   }
  //   task.scheduledDate = dateStr;
  //   root._plannerState.assignQueue[dateStr] = root._plannerState.assignQueue[dateStr] || [];
  //   root._plannerState.assignQueue[dateStr].push(taskid);
  //   renderCalendarArea(root);
  // }
  function assignTaskToDate(taskid, dateStr, root, opts) {
    const task = root._plannerState.tasks.find(t => t.taskid == taskid);
    if (!task) return;
    // Remove from previous date
    if (task.scheduledDate) {
      const prev = root._plannerState.assignQueue[task.scheduledDate] || [];
      root._plannerState.assignQueue[task.scheduledDate] = prev.filter(id => id !== taskid);
    }
    // Assign to new date
    task.scheduledDate = dateStr;
    root._plannerState.assignQueue[dateStr] = root._plannerState.assignQueue[dateStr] || [];
    root._plannerState.assignQueue[dateStr].push(taskid);
    // âœ… Immediately save the change
    const [dd, mm, yyyy] = dateStr.split("/");
    const formattedDate = `${dd}/${mm}/${yyyy}`;
    try {
      parent.AxSetValue("tasku", "taskid", "1", "0", taskid);
      parent.AxSetValue("tasku", "newdate", "1", "0", formattedDate);
      parent.AxSubmitData("tasku", "0");
      //parent.showAlertDialog("success", "Task rescheduled successfully!");
      // const btn = document.querySelector('#refresh-planner');
      // btn.click();
    } catch (e) {
      console.error("Auto-save failed", e);
      parent.showAlertDialog("danger", "Failed to auto-save task update.");
    }
    // Re-render calendar UI
    renderCalendarArea(root);
  }
  function removeTaskFromDate(taskid, fromDate, root, opts) {
    if (!root._plannerState.assignQueue[fromDate]) return;
    root._plannerState.assignQueue[fromDate] = root._plannerState.assignQueue[fromDate].filter(id => id !== taskid);
    const task = root._plannerState.tasks.find(t => t.taskid == taskid);
    if (task) task.scheduledDate = opts && opts.unschedule ? null : task.scheduledDate;
    renderCalendarArea(root);
  }
  function getStatusDotClass(status) {
    switch ((status || "").toLowerCase()) {
      case "pending":
        return "status-pending"; // red
      case "accepted":
        return "status-accepted"; // green
      case "forwarded":
        return "status-forwarded"; // yellow
      default:
        return "status-unknown"; // gray
    }
  }
  // boot-up
  try {
    window.AxAfterIviewLoad();
  } catch (e) {
    /* ignore */
  }
})();
// Source file: /mnt/data/taskslst.js
// Adds a username dropdown populated from the DS call and places it centered above the calendar view name / in the header.
// Drop this file into your project (or merge the logic into your existing taskslst.js). It's defensive: it tries several header selectors
// and several possible username fields on the returned rows. It also emits a custom event when selection changes.


window.togglePlannerView = function () {
    const modal = document.getElementById("filterModal");
    if (!modal) return;

    const iframe = modal.querySelector("#taskFrame");
    const planner = modal.querySelector("#plan-popup-root");

    if (iframe) {
        iframe.style.display = "none";
        iframe.src = ""; // reset
    }

    if (planner) {
        planner.style.display = "block";
    }
};

function hideAllTooltips() {
  try {
      // Bootstrap tooltips
      document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
          const instance = bootstrap.Tooltip.getInstance(el);
          if (instance) {
              instance.hide();
              instance.dispose(); // important for your dynamic UI
          }
      });

      // Remove leftover tooltip DOM
      document.querySelectorAll('.tooltip').forEach(t => t.remove());

  } catch (e) {
      console.warn("Tooltip cleanup failed:", e);
  }
}
// function initTaskTooltips() {
//   const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
//   tooltipTriggerList.map(function (tooltipTriggerEl) {
//       // Dispose of old instance if it exists to prevent memory leaks
//       const oldInstance = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
//       if (oldInstance) oldInstance.dispose();
      
//       return new bootstrap.Tooltip(tooltipTriggerEl, {
//           boundary: document.body,
//           trigger: 'hover' // Explicitly set trigger to hover
//       });
//   });
// }
// ✅ GLOBAL EVENTS (ONLY ONCE)
// ✅ MODIFIED GLOBAL EVENTS
// Remove 'scroll' if you want tooltips to stay visible while scrolling the panel
// document.addEventListener("mousedown", (e) => {
//   // Only hide if we aren't clicking the tooltip itself
//   if (!e.target.closest('.tooltip')) {
//       hideAllTooltips();
//   }
// });

// Avoid 'scroll' listener if your tasks are in a scrollable div, 
// otherwise the tooltip will vanish the moment the user moves the mouse slightly.
document.addEventListener("scroll", hideAllTooltips, true);
// document.addEventListener("dragstart", hideAllTooltips);
// document.addEventListener("scroll", hideAllTooltips, true);
/** * STRONG FIX: Tooltip Cleanup
 * Ensures custom popups are destroyed on scroll or drag to prevent "ghost" tooltips
 */
(function() {

    let isDragging = false;

    const cleanupPopups = () => {
        document.querySelectorAll('.task-hover-popup').forEach(popup => popup.remove());
    };

    // 🔥 DRAG START
    document.addEventListener("dragstart", () => {
        isDragging = true;
        cleanupPopups();
    }, true);

    // 🔥 DRAG END
    document.addEventListener("dragend", () => {
        isDragging = false;
    }, true);

    // -------------------------------
    // SCROLL HANDLING (same as yours)
    // -------------------------------
    window.addEventListener('scroll', cleanupPopups, true);

    const scrollContainer = document.getElementById("plistContent");
    if (scrollContainer) {
        scrollContainer.addEventListener('scroll', cleanupPopups, { passive: true });
    }

    // -------------------------------
    // 🔥 BLOCK POPUP CREATION DURING DRAG
    // -------------------------------
    document.addEventListener("mouseover", function(e) {
        if (isDragging) {
            cleanupPopups(); // ensure nothing shows
            return;
        }
    }, true);

})();