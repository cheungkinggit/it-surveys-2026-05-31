const classes = [
  "1A", "1B", "1C", "1D", "1E",
  "2A", "2B", "2C", "2D", "2E",
  "3A", "3B", "3C", "3D", "3E",
  "4A", "4B", "4C", "4D", "4E",
  "5A", "5B", "5C", "5D", "5E",
  "6A", "6B", "6C", "6D", "6E"
];

const teachers = [
  "01 黃惠玲", "02 蔡惠清", "03 張景", "04 顧冰", "05 梁浣儀",
  "06 吳樂彤", "07 陳式藩", "08 黎錦姿", "09 張鳳娣", "10 葉凱嘉",
  "11 吳校潔", "12 唐俊", "13 梁振邦", "14 馮惠儀", "15 廖嘉寶",
  "16 朱兆軒", "17 朱惠勤", "18 葉佩堯", "19 陳菁", "20 曹詠恩",
  "21 俞家欣", "22 李雅雅", "23 李偉樂", "24 庄婷婷", "25 駱慧英",
  "26 黃婉君", "27 林少洪", "28 李莉詩", "29 林敏", "30 鍾明心",
  "31 冼麗明", "32 鄭婉雯", "33 石浩傑", "34 廖宇青", "35 曾玉翠",
  "36 吳巧晴", "37 譚以靖", "38 盧子信", "39 洪楚童", "40 彭雅琳",
  "41 黃新采", "42 黃湘誼", "43 葉慧姍", "44 方韻瑤", "45 林晉暉",
  "46 溫梓薇", "47 何月驊", "48 黃慧儀", "49 陳澤陽", "50 許芷穎",
  "51 黃旭東", "52 傅小梅", "53 魏玉鳳", "54 余潤芳", "55 區嘉宜"
];

const studentQuestions = [
  "2. 我認為資訊科技能令學習變得更有趣。",
  "3. 我認為資訊科技能令我學習得更好和更有成效。",
  "4. 我曾經運用人工智能(A.I)進行學習活動（在家、在校 皆可）。",
  "5. 我的資訊科技素養有所提升。（注意網上言行、分辨假網站、保護個人資料等）",
  "6. 我認為校園電視台的節目有趣、吸引。（早會、週會、特備節目等）"
];

const teacherQuestions = [
  {
    text: "1. 我認為數字化學習能提升學生的學習動機。",
    choices: ["十分同意", "同意", "不同意", "十分不同意"]
  },
  {
    text: "2. 我認為數字化學習能提升學生的學習效能。",
    choices: ["十分同意", "同意", "不同意", "十分不同意"]
  },
  {
    text: "3. 我認為校園電視台的節目吸引。（如：早會、週會、節慶影片）",
    choices: ["十分同意", "同意", "不同意", "十分不同意"]
  },
  {
    text: "4. 我認為「BYOD計劃」有助學生運用數字化學習進行各種學習活動。（只供四、五、六年級老師填寫）",
    choices: ["我不是四、五、六年級老師", "十分同意", "同意", "不同意", "十分不同意"]
  },
  {
    text: "5. 我認為自己能應用A.I.在行政工作上。",
    choices: ["十分同意", "同意", "不同意", "十分不同意"]
  },
  {
    text: "6. 我認為自己能應用A.I.在教學工作上。",
    choices: ["十分同意", "同意", "不同意", "十分不同意"]
  }
];

const storage = {
  student: "it_student_survey_responses",
  teacher: "it_teacher_survey_responses"
};

function loadResponses(type) {
  return JSON.parse(localStorage.getItem(storage[type]) || "{}");
}

function saveResponses(type, data) {
  localStorage.setItem(storage[type], JSON.stringify(data));
}

function fillSelect(select, items, placeholder) {
  select.innerHTML = `<option value="">${placeholder}</option>`;
  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    select.appendChild(option);
  });
}

function renderPending(type, allItems, pendingEl, progressEl) {
  const responses = loadResponses(type);
  const completed = new Set(Object.keys(responses));
  const pending = allItems.filter((item) => !completed.has(item));
  progressEl.textContent = `已完成 ${completed.size} / ${allItems.length}`;
  pendingEl.innerHTML = "";

  if (pending.length === 0) {
    const chip = document.createElement("span");
    chip.className = "chip done";
    chip.textContent = "全部完成";
    pendingEl.appendChild(chip);
    return;
  }

  pending.forEach((item) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = item;
    pendingEl.appendChild(chip);
  });
}

function initStudent() {
  const form = document.querySelector("#studentForm");
  if (!form) return;

  const classSelect = document.querySelector("#studentClass");
  const countInput = document.querySelector("#studentCount");
  const questionsEl = document.querySelector("#studentQuestions");
  const pendingEl = document.querySelector("#studentPending");
  const progressEl = document.querySelector("#studentProgress");
  const messageEl = document.querySelector("#studentMessage");

  fillSelect(classSelect, classes, "請選擇班別");
  questionsEl.innerHTML = studentQuestions.map((question, index) => `
    <section class="question">
      <div class="question-title">${question}</div>
      <label class="student-answer">
        認同學生人數
        <input type="number" min="0" required data-student-answer="${index}" placeholder="0">
      </label>
    </section>
  `).join("");

  function syncAnswerMax() {
    const max = countInput.value || "";
    document.querySelectorAll("[data-student-answer]").forEach((input) => {
      input.max = max;
    });
  }

  countInput.addEventListener("input", syncAnswerMax);
  renderPending("student", classes, pendingEl, progressEl);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const total = Number(countInput.value);
    const answers = Array.from(document.querySelectorAll("[data-student-answer]")).map((input) => Number(input.value));
    const invalid = answers.some((answer) => answer < 0 || answer > total);

    if (invalid) {
      messageEl.textContent = "每題人數不可少於 0 或多於當天實際上課人數。";
      return;
    }

    const responses = loadResponses("student");
    responses[classSelect.value] = {
      className: classSelect.value,
      studentCount: total,
      answers,
      submittedAt: new Date().toISOString()
    };
    saveResponses("student", responses);
    renderPending("student", classes, pendingEl, progressEl);
    messageEl.textContent = `${classSelect.value} 已提交。`;
    form.reset();
    syncAnswerMax();
  });
}

function initTeacher() {
  const form = document.querySelector("#teacherForm");
  if (!form) return;

  const teacherSelect = document.querySelector("#teacherName");
  const questionsEl = document.querySelector("#teacherQuestions");
  const pendingEl = document.querySelector("#teacherPending");
  const progressEl = document.querySelector("#teacherProgress");
  const messageEl = document.querySelector("#teacherMessage");

  fillSelect(teacherSelect, teachers, "請選擇老師姓名");
  questionsEl.innerHTML = teacherQuestions.map((question, index) => `
    <section class="question">
      <div class="question-title">${question.text}</div>
      <div class="choice-row">
        ${question.choices.map((choice) => `
          <label>
            <input type="radio" name="teacher-q-${index}" value="${choice}" required>
            ${choice}
          </label>
        `).join("")}
      </div>
    </section>
  `).join("");

  renderPending("teacher", teachers, pendingEl, progressEl);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const answers = teacherQuestions.map((_, index) => {
      return document.querySelector(`input[name="teacher-q-${index}"]:checked`).value;
    });

    const responses = loadResponses("teacher");
    responses[teacherSelect.value] = {
      teacherName: teacherSelect.value,
      answers,
      submittedAt: new Date().toISOString()
    };
    saveResponses("teacher", responses);
    renderPending("teacher", teachers, pendingEl, progressEl);
    messageEl.textContent = `${teacherSelect.value} 已提交。`;
    form.reset();
  });
}

function downloadXls(type) {
  const responses = Object.values(loadResponses(type));
  if (responses.length === 0) {
    alert("暫時沒有提交紀錄可匯出。");
    return;
  }

  const headers = type === "student"
    ? ["班別", "當天實際上課人數", ...studentQuestions, "提交時間"]
    : ["老師姓名", ...teacherQuestions.map((q) => q.text), "提交時間"];

  const rows = responses.map((response) => {
    return type === "student"
      ? [response.className, response.studentCount, ...response.answers, response.submittedAt]
      : [response.teacherName, ...response.answers, response.submittedAt];
  });

  const escapeHtml = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
  const table = `
    <html>
      <head><meta charset="utf-8"></head>
      <body>
        <table border="1">
          <thead><tr>${headers.map((cell) => `<th>${escapeHtml(cell)}</th>`).join("")}</tr></thead>
          <tbody>
            ${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>
      </body>
    </html>
  `;
  const blob = new Blob(["\ufeff" + table], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${type}-survey-${new Date().toISOString().slice(0, 10)}.xls`;
  link.click();
  URL.revokeObjectURL(url);
}

function percent(value, total) {
  if (!total) return "--";
  return `${Math.round((value / total) * 100)}%`;
}

function renderBar(container, label, value, total, accent = "") {
  const row = document.createElement("div");
  row.className = "bar-row";
  const width = total ? Math.round((value / total) * 100) : 0;
  row.innerHTML = `
    <div class="bar-meta">
      <span>${label}</span>
      <strong>${value}${total ? ` / ${total}` : ""}</strong>
    </div>
    <div class="bar-track">
      <span class="bar-fill ${accent}" style="width: ${width}%"></span>
    </div>
  `;
  container.appendChild(row);
}

function initResults() {
  const studentStatsEl = document.querySelector("#studentStats");
  const teacherStatsEl = document.querySelector("#teacherStats");
  if (!studentStatsEl || !teacherStatsEl) return;

  const studentResponses = Object.values(loadResponses("student"));
  const teacherResponses = Object.values(loadResponses("teacher"));

  document.querySelector("#studentSummary").textContent = `${studentResponses.length} / ${classes.length}`;
  document.querySelector("#teacherSummary").textContent = `${teacherResponses.length} / ${teachers.length}`;
  document.querySelector("#studentResponseCount").textContent = `${studentResponses.length} 份回應`;
  document.querySelector("#teacherResponseCount").textContent = `${teacherResponses.length} 份回應`;

  const totalStudents = studentResponses.reduce((sum, response) => sum + Number(response.studentCount || 0), 0);
  const totalAgreed = studentResponses.reduce((sum, response) => {
    return sum + response.answers.reduce((inner, answer) => inner + Number(answer || 0), 0);
  }, 0);
  const possibleStudentAnswers = totalStudents * studentQuestions.length;
  document.querySelector("#studentAverage").textContent = percent(totalAgreed, possibleStudentAnswers);

  const positiveChoices = new Set(["十分同意", "同意"]);
  const teacherPositiveCount = teacherResponses.reduce((sum, response) => {
    return sum + response.answers.filter((answer) => positiveChoices.has(answer)).length;
  }, 0);
  const possibleTeacherAnswers = teacherResponses.length * teacherQuestions.length;
  document.querySelector("#teacherPositive").textContent = percent(teacherPositiveCount, possibleTeacherAnswers);

  studentStatsEl.innerHTML = "";
  studentQuestions.forEach((question, index) => {
    const agreed = studentResponses.reduce((sum, response) => sum + Number(response.answers[index] || 0), 0);
    const card = document.createElement("section");
    card.className = "stat-block";
    card.innerHTML = `
      <h3>${question}</h3>
      <p>${totalStudents ? `平均認同率 ${percent(agreed, totalStudents)}` : "暫未有學生回應"}</p>
    `;
    renderBar(card, "認同學生人數", agreed, totalStudents, "student-fill");
    studentStatsEl.appendChild(card);
  });

  teacherStatsEl.innerHTML = "";
  teacherQuestions.forEach((question, index) => {
    const card = document.createElement("section");
    card.className = "stat-block";
    card.innerHTML = `<h3>${question.text}</h3><p>${teacherResponses.length ? "選項分佈" : "暫未有教師回應"}</p>`;
    question.choices.forEach((choice) => {
      const count = teacherResponses.filter((response) => response.answers[index] === choice).length;
      renderBar(card, choice, count, teacherResponses.length, positiveChoices.has(choice) ? "teacher-fill" : "");
    });
    teacherStatsEl.appendChild(card);
  });
}

function bindUtilities() {
  document.querySelectorAll("[data-export]").forEach((button) => {
    button.addEventListener("click", () => downloadXls(button.dataset.export));
  });

  document.querySelectorAll("[data-reset-all]").forEach((button) => {
    button.addEventListener("click", () => {
      const confirmed = confirm("確定要重設問卷？這會清除這部電腦/瀏覽器內的學生及教師問卷紀錄。");
      if (!confirmed) return;
      localStorage.removeItem(storage.student);
      localStorage.removeItem(storage.teacher);
      location.reload();
    });
  });

  document.querySelectorAll("[data-reset]").forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.dataset.reset;
      const confirmed = confirm("確定要清除這部電腦/瀏覽器內的問卷紀錄？");
      if (!confirmed) return;
      localStorage.removeItem(storage[type]);
      location.reload();
    });
  });
}

initStudent();
initTeacher();
initResults();
bindUtilities();
