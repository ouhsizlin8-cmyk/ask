const survey = [
  {
    name: "集群配置",
    title: "集群配置：现在如何确定部署方式？",
    description: "请对照当前页面与过去页面，回忆准备安装包和配置集群时的判断。",
    images: [["当前 · 集群设置", "cluster-now.png"], ["过去 · 集群设置", "cluster-before.png"]],
    groups: [
      { title: "针对两个客户，分别选择部署方式", fields: [
        ["clusterA", "客户 A：只部署一个安全应用，资源规模有限。", ["分离式部署", "一体化部署", "无法判断"]],
        ["clusterB", "客户 B：需要支持多个安全应用。", ["分离式部署", "一体化部署", "无法判断"]]
      ] },
      { title: "页面说明是否帮助您做判断？", fields: [
        ["clusterBasis", "您主要依据什么做出上述选择？", ["页面信息足够独立判断", "页面信息和过往经验都需要", "主要依靠过往经验", "主要靠猜测或无法判断"]],
        ["clusterBasisText", "如果参考了页面，哪条信息最有帮助？（选填）"]
      ] },
      { title: "安装包准备方式", fields: [
        ["clusterPackage", "为客户 A 和 B 准备集群安装包，您认为需要准备什么？", ["同一个安装包，部署方式在页面选择", "两种部署方式各有一个安装包", "无法判断"]]
      ] },
      { title: "效率与信息缺口", fields: [
        ["clusterEfficiency", "只比较准备安装包和确定部署方式，新流程相对旧流程的效率如何？", ["明显降低", "略有降低", "差不多", "略有提高", "明显提高"]],
        ["clusterMissing", "当前页面还缺少哪条会影响您判断的信息？（选填）"]
      ] }
    ]
  },
  {
    name: "首次安装应用",
    title: "首次安装：导入到安装的过程清楚吗？",
    description: "左侧可依次查看应用管理、导入应用包、选择应用和安装页面。",
    images: [["应用管理", "apps-now.png"], ["导入应用包", "import.png"], ["选择安装应用", "select-app.png"], ["安装应用", "install-progress.png"]],
    groups: [
      { title: "操作顺序", fields: [
        ["installOrder", "客户首次安装一个应用，您理解的操作顺序是？", ["导入应用包 → 选择应用 → 安装 → 查看结果", "导入应用包后就算安装完成", "需要先升级整个系统再安装"]]
      ] },
      { title: "独立完成的把握", fields: [
        ["installConfidence", "您有多大把握根据当前页面独立完成首次安装？", ["1 完全没有把握", "2 把握较小", "3 一般", "4 比较有把握", "5 完全有把握"]]
      ] },
      { title: "效率变化", fields: [
        ["installEfficiency", "与熟悉的旧流程相比，当前首次安装流程的效率如何？", ["明显降低", "略有降低", "差不多", "略有提高", "明显提高"]]
      ] },
      { title: "整体感受", fields: [
        ["installSatisfaction", "您对首次安装应用这段流程的满意度是？", ["1 非常不满意", "2 不满意", "3 一般", "4 满意", "5 非常满意"]],
        ["installReason", "最影响您评分的一个操作或页面信息是？（选填）"]
      ] }
    ]
  },
  {
    name: "升级应用",
    title: "升级应用：只更新需要更新的部分",
    description: "先看当前的应用管理、导入和安装，再对比过去的系统升级。",
    images: [["当前 · 应用管理", "apps-now.png"], ["导入应用包", "import.png"], ["选择应用", "select-app.png"], ["安装应用", "install-progress.png"], ["过去 · 系统升级", "upgrade-before.png"]],
    groups: [
      { title: "升级方式的理解", fields: [
        ["upgradeMethod", "客户已安装多个应用，现在只想更新其中一个。您理解应该如何处理？", ["导入目标应用的新版本包，选择该应用升级", "需要重新升级整个系统", "需要重新安装全部应用"]]
      ] },
      { title: "预期的交付帮助", fields: [
        ["upgradeValue", "如果未来只更新一个应用，您预计这种方式对交付有多大帮助？", ["1 完全没有帮助", "2 帮助较小", "3 不确定", "4 比较有帮助", "5 非常有帮助"]]
      ] }
    ]
  }
];
const names = ["开始", "集群配置", "首次安装应用", "升级应用", "提交"];
let step = 0, page = 0, image = 0, answers = {}, error = "", done = false, busy = false;
try { answers = JSON.parse(sessionStorage.getItem("delivery-survey-v2") || "{}"); } catch {}
for (const key of ["clusterType", "installExposure", "upgradeExposure", "upgradeConcern"]) delete answers[key];
for (const section of survey) for (const group of section.groups) for (const [id, , options] of group.fields) {
  if (options && answers[id] && !options.includes(answers[id])) delete answers[id];
}
const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fields = n => survey[n - 1].groups.flatMap(group => group.fields);
const pages = n => survey[n - 1].groups.length > 3 ? [survey[n - 1].groups.slice(0, 2), survey[n - 1].groups.slice(2)] : [survey[n - 1].groups];
const pageFields = () => pages(step)[page].flatMap(group => group.fields);
const save = () => sessionStorage.setItem("delivery-survey-v2", JSON.stringify(answers));
const needsClusterReason = () => answers.clusterA === "无法判断" || answers.clusterB === "无法判断" || answers.clusterBasis === "主要靠猜测或无法判断";
function renderField(field) {
  const [id, originalLabel, options] = field;
  const label = id === "clusterBasisText" && needsClusterReason() ? "若无法判断或主要靠猜测，请说明原因（必填）" : originalLabel;
  if (!options) return '<div class="field field-text"><label for="' + id + '">' + esc(label) + '</label><textarea id="' + id + '" data-text="' + id + '" maxlength="500" placeholder="请在这里填写">' + esc(answers[id]) + '</textarea></div>';
  const compact = options.every(option => option.length <= 8), wide = options.some(option => option.length > 18);
  return '<div class="field"><div class="field-label">' + esc(label) + '</div><div class="answer-options ' + (compact ? "compact" : wide ? "wide" : "") + '" role="radiogroup" aria-label="' + esc(label) + '">' + options.map((option, index) => '<button type="button" data-answer="' + id + '" data-option="' + index + '" class="' + (answers[id] === option ? "selected" : "") + '" role="radio" aria-checked="' + (answers[id] === option) + '"><i></i>' + esc(option) + '</button>').join("") + '</div></div>';
}
function renderGroup(group, index) { return '<article class="question-group"><div class="group-heading"><span>' + String(index + 1).padStart(2, "0") + '</span><h3>' + esc(group.title) + '</h3></div>' + group.fields.map(renderField).join("") + '</article>'; }
function renderTabs() { return '<nav class="survey-tabs" aria-label="问卷步骤">' + names.map((name, index) => '<button type="button" data-tab="' + index + '" class="' + (step === index ? "current" : "") + '" ' + (done ? "disabled" : "") + '>' + esc(name) + '</button>').join("") + '</nav>'; }
function renderStart() { return '<section class="start-panel"><div class="start-mark">交付体验调研</div><h1>体验调研问卷</h1><p>本次优化主要围绕软件化部署：用页面配置确定集群部署方式，按需安装与升级应用。我们希望了解您对体验改进的感知程度，也收集当前流程中仍存在的问题。</p><div class="employee-field"><label for="employee-id">工号 <span>必填</span></label><input id="employee-id" data-employee maxlength="30" autocomplete="off" placeholder="请输入您的工号" value="' + esc(answers.employeeId) + '"><small>仅用于区分答卷，不会展示给其他填写人。</small></div>' + (error ? '<p class="form-error" role="alert">' + esc(error) + '</p>' : "") + '<button class="primary start-button" data-next>开始填写 <span>→</span></button></section>'; }
function renderSurvey() {
  const section = survey[step - 1], selected = section.images[image], groupPages = pages(step), currentGroups = groupPages[page], lastPage = page === groupPages.length - 1;
  return '<section class="survey-stage"><div class="stage-heading"><div><span>0' + step + ' / 03 · ' + section.name + '</span><h1>' + section.title + '</h1><p>' + section.description + '</p></div></div><div class="split-layout"><section class="visual-panel"><div class="visual-heading"><div><small>页面参考</small><h2>' + esc(selected[0]) + '</h2></div><button data-zoom>放大查看 ↗</button></div><div class="visual-frame" data-zoom role="button" tabindex="0"><img src="./screens/' + selected[1] + '" alt="' + esc(selected[0]) + '"></div><div class="image-switcher">' + section.images.map((entry, index) => '<button data-image="' + index + '" class="' + (index === image ? "active" : "") + '">' + esc(entry[0]) + '</button>').join("") + '</div><p class="image-hint">点击截图放大查看页面细节</p></section><section class="form-panel"><div class="form-panel-head"><span>问卷 / ' + section.name + '</span><strong>第 ' + (page + 1) + ' / ' + groupPages.length + ' 页</strong></div><div class="question-scroll">' + currentGroups.map((group, index) => renderGroup(group, index + page * 2)).join("") + '</div><div class="form-footer"><button class="back" data-back>← ' + (page ? "上一页" : "上一步") + '</button><div>' + (error ? '<span class="form-error" role="alert">' + esc(error) + '</span>' : "") + '<button class="primary" data-next>' + (!lastPage ? "下一页" : step === 3 ? "查看并下载" : "下一步") + ' <span>→</span></button></div></div></section></div></section>';
}
function renderReview() {
  return '<section class="review-panel"><div class="start-mark">完成填写</div><h1>下载答卷文件</h1><p>工号：<strong>' + esc(answers.employeeId) + '</strong>。当前是静态网页，点击下方按钮会将答卷下载到您的设备，<strong>不会自动发送给问卷发起人</strong>。</p><div class="review-list">' + survey.map((section, index) => '<div><span>0' + (index + 1) + '</span><strong>' + section.name + '</strong><button data-tab="' + (index + 1) + '">修改回答 ↗</button></div>').join("") + '</div>' + (error ? '<p class="form-error" role="alert">' + esc(error) + '</p>' : "") + '<div class="review-actions"><button class="back" data-back>← 上一步</button><button class="primary" data-submit>下载答卷 CSV <span>↓</span></button></div></section>';
}
function render(resetScroll = false) {
  const oldScroll = document.querySelector(".question-scroll")?.scrollTop || 0;
  document.querySelector("#app").innerHTML = '<div class="survey-app"><header class="survey-header"><a href="./" class="survey-brand"><span>▦</span>交付体验调研</a><small>软件化部署 · 体验反馈</small></header>' + renderTabs() + '<main class="survey-main">' + (done ? '<section class="done-panel"><div>↓</div><h1>答卷文件已下载</h1><p>请将下载的 CSV 文件交给问卷发起人。下载文件不等于在线提交。</p></section>' : step === 0 ? renderStart() : step < 4 ? renderSurvey() : renderReview()) + '</main></div>';
  if (!resetScroll && document.querySelector(".question-scroll")) document.querySelector(".question-scroll").scrollTop = oldScroll;
}
function validateStep(n) { if (n === 0) return Boolean(answers.employeeId?.trim()); return fields(n).every(field => !field[2] || answers[field[0]]) && (n !== 1 || !needsClusterReason() || Boolean(answers.clusterBasisText?.trim())); }
function go(n) { step = n; page = 0; image = 0; error = ""; render(true); window.scrollTo({ top: 0, behavior: "smooth" }); }
function next() {
  if (step === 0) { answers.employeeId = String(answers.employeeId || "").trim(); if (!answers.employeeId) { error = "请先填写工号。"; render(); return; } if (answers.employeeId.length > 30) { error = "工号不能超过 30 个字符。"; render(); return; } save(); return go(1); }
  const missing = pageFields().filter(field => (field[2] && !answers[field[0]]) || (field[0] === "clusterBasisText" && needsClusterReason() && !answers.clusterBasisText?.trim()));
  if (missing.length) { error = "还有 " + missing.length + " 道必答题未完成。"; render(); return; }
  if (page < pages(step).length - 1) { page++; error = ""; render(true); return; }
  go(step + 1);
}
function back() { if (step > 0 && step < 4 && page > 0) { page--; error = ""; render(true); } else go(step - 1); }
function chooseTab(n) { if (n <= step) return go(n); if (!validateStep(0)) { error = "请先填写工号。"; render(); return; } for (let i = 1; i < n; i++) if (!validateStep(i)) { error = "请先完成当前环节的必答题。"; render(); return; } go(n); }
function csvCell(value) {
  let text = String(value ?? "");
  if (/^\s*[=+\-@]/.test(text)) text = "'" + text;
  return '"' + text.replaceAll('"', '""') + '"';
}
function submit() {
  if (![0, 1, 2, 3].every(validateStep)) { error = "还有必填内容未完成。"; render(); return; }
  try {
    const columns = [["employeeId", "工号"], ...survey.flatMap(section => section.groups.flatMap(group => group.fields.map(([id, label]) => [id, label])))];
    const rows = [["下载时间", ...columns.map(([, label]) => label)], [new Date().toLocaleString("zh-CN"), ...columns.map(([id]) => answers[id] || "")]];
    const content = "\ufeff" + rows.map(row => row.map(csvCell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "交付体验调研答卷-" + String(answers.employeeId).replace(/[^\w-]/g, "_") + ".csv";
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    done = true; error = ""; render(true);
  } catch { error = "下载失败，请重试。"; render(); }
}
document.addEventListener("click", event => {
  const target = event.target.closest("button,[data-zoom]"); if (!target) return;
  if (target.dataset.answer) { const field = fields(step).find(item => item[0] === target.dataset.answer); const reasonRequiredBefore = needsClusterReason(); answers[field[0]] = field[2][Number(target.dataset.option)]; if (reasonRequiredBefore !== needsClusterReason()) delete answers.clusterBasisText; error = ""; save(); render(); }
  else if (target.dataset.image !== undefined) { image = Number(target.dataset.image); render(); }
  else if (target.dataset.tab !== undefined) chooseTab(Number(target.dataset.tab));
  else if (target.hasAttribute("data-next")) next();
  else if (target.hasAttribute("data-back")) back();
  else if (target.hasAttribute("data-submit")) submit();
  else if (target.hasAttribute("data-zoom")) { const entry = survey[step - 1].images[image], overlay = document.createElement("div"); overlay.className = "lightbox"; overlay.innerHTML = '<button aria-label="关闭大图">×</button><img src="./screens/' + entry[1] + '" alt="页面截图放大">'; overlay.addEventListener("click", e => { if (e.target.tagName !== "IMG") overlay.remove(); }); document.body.append(overlay); }
});
document.addEventListener("input", event => { if (event.target.dataset.employee !== undefined) { answers.employeeId = event.target.value; save(); } else if (event.target.dataset.text) { answers[event.target.dataset.text] = event.target.value; save(); } });
document.addEventListener("keydown", event => { if (event.key === "Escape") document.querySelector(".lightbox")?.remove(); if (event.key === "Enter" && event.target.classList?.contains("visual-frame")) event.target.click(); });
render(true);
