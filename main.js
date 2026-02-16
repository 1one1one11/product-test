const menuPool = {
  lunch: [
    { name: "김치찌개 정식", moods: ["comfort", "boost"], budget: "low", spicy: 3, party: ["solo", "group"], tags: ["국물", "한식"] },
    { name: "마제소바", moods: ["trendy", "boost"], budget: "mid", spicy: 2, party: ["solo", "group"], tags: ["일식", "면"] },
    { name: "포케볼", moods: ["healthy", "trendy"], budget: "mid", spicy: 1, party: ["solo", "group"], tags: ["가벼움", "샐러드"] },
    { name: "제육덮밥", moods: ["comfort", "boost"], budget: "low", spicy: 4, party: ["solo", "group"], tags: ["든든", "불향"] },
    { name: "에그인헬 브런치", moods: ["trendy"], budget: "mid", spicy: 2, party: ["group"], tags: ["브런치", "감성"] },
    { name: "순두부찌개", moods: ["comfort", "healthy"], budget: "low", spicy: 2, party: ["solo", "group"], tags: ["따뜻함", "한식"] },
    { name: "탄탄멘", moods: ["boost", "trendy"], budget: "mid", spicy: 4, party: ["solo", "group"], tags: ["면", "중독성"] }
  ],
  dinner: [
    { name: "삼겹살 + 된장찌개", moods: ["comfort", "boost"], budget: "high", spicy: 2, party: ["group"], tags: ["회식", "고기"] },
    { name: "마라샹궈", moods: ["trendy", "boost"], budget: "high", spicy: 5, party: ["group"], tags: ["얼얼", "중식"] },
    { name: "초밥 세트", moods: ["healthy", "trendy"], budget: "high", spicy: 1, party: ["solo", "group"], tags: ["깔끔", "일식"] },
    { name: "닭갈비", moods: ["boost", "comfort"], budget: "mid", spicy: 4, party: ["group"], tags: ["철판", "매콤"] },
    { name: "쌀국수", moods: ["healthy", "comfort"], budget: "mid", spicy: 2, party: ["solo", "group"], tags: ["국물", "가벼움"] },
    { name: "트러플 크림 파스타", moods: ["trendy"], budget: "high", spicy: 1, party: ["group"], tags: ["데이트", "양식"] },
    { name: "떡볶이 + 튀김", moods: ["boost", "comfort"], budget: "low", spicy: 4, party: ["solo", "group"], tags: ["분식", "추억"] }
  ]
};

const state = {
  meal: "lunch",
  mood: "comfort",
  budget: "any",
  spicy: 3,
  party: "solo",
  lastResult: null,
  theme: "light"
};

const elements = {
  themeToggle: document.getElementById("theme-toggle"),
  mealButtons: document.querySelectorAll(".switch-btn"),
  mood: document.getElementById("mood"),
  budget: document.getElementById("budget"),
  spicy: document.getElementById("spicy"),
  spicyValue: document.getElementById("spicy-value"),
  partyWrap: document.getElementById("party"),
  recommendBtn: document.getElementById("recommend-btn"),
  rerollBtn: document.getElementById("reroll-btn"),
  resultCard: document.getElementById("result-card")
};

function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  elements.themeToggle.textContent = theme === "dark" ? "☀ Light" : "🌙 Dark";
  elements.themeToggle.setAttribute("aria-label", theme === "dark" ? "화이트 모드 전환" : "다크 모드 전환");
}

function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    applyTheme(savedTheme);
    return;
  }
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(prefersDark ? "dark" : "light");
}

function pickWeighted(candidates) {
  const scored = candidates.map((item) => {
    let score = 1;
    if (item.moods.includes(state.mood)) score += 3;
    if (state.budget !== "any" && item.budget === state.budget) score += 2;
    if (Math.abs(item.spicy - state.spicy) <= 1) score += 2;
    if (item.party.includes(state.party)) score += 2;
    return { item, score };
  });

  const total = scored.reduce((sum, current) => sum + current.score, 0);
  let random = Math.random() * total;

  for (const option of scored) {
    random -= option.score;
    if (random <= 0) return option.item;
  }
  return scored[scored.length - 1].item;
}

function filterByParty(items) {
  return items.filter((item) => item.party.includes(state.party));
}

function getCandidates() {
  const base = menuPool[state.meal];
  let candidates = filterByParty(base);
  if (state.budget !== "any") {
    const byBudget = candidates.filter((item) => item.budget === state.budget);
    if (byBudget.length) candidates = byBudget;
  }
  return candidates.length ? candidates : base;
}

function budgetText(value) {
  if (value === "low") return "1만원 이하";
  if (value === "mid") return "1~2만원";
  if (value === "high") return "2만원 이상";
  return "상관없음";
}

function mealText(value) {
  return value === "lunch" ? "점심" : "저녁";
}

function renderResult(item) {
  state.lastResult = item;
  const spicyEmoji = "🌶".repeat(Math.max(1, item.spicy));
  const tags = item.tags.concat([state.party === "solo" ? "혼밥 가능" : "함께 먹기 좋음"]);

  elements.resultCard.innerHTML = `
    <h2 class="menu-name">${item.name}</h2>
    <p class="menu-meta">${mealText(state.meal)} 추천 · 맵기 ${spicyEmoji} · 예산 ${budgetText(item.budget)}</p>
    <div class="tag-row">
      ${tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
    </div>
  `;
}

function recommend() {
  const candidates = getCandidates().filter((item) => item.name !== state.lastResult?.name);
  const pool = candidates.length ? candidates : getCandidates();
  const picked = pickWeighted(pool);
  renderResult(picked);
}

function syncSwitchButtons() {
  elements.mealButtons.forEach((button) => {
    const active = button.dataset.meal === state.meal;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
}

elements.mealButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.meal = button.dataset.meal;
    syncSwitchButtons();
    recommend();
  });
});

elements.mood.addEventListener("change", (event) => {
  state.mood = event.target.value;
});

elements.budget.addEventListener("change", (event) => {
  state.budget = event.target.value;
});

elements.spicy.addEventListener("input", (event) => {
  state.spicy = Number(event.target.value);
  elements.spicyValue.textContent = String(state.spicy);
});

elements.partyWrap.addEventListener("click", (event) => {
  const target = event.target.closest("button[data-party]");
  if (!target) return;
  state.party = target.dataset.party;
  Array.from(elements.partyWrap.querySelectorAll(".chip")).forEach((chip) => {
    chip.classList.toggle("active", chip === target);
  });
});

elements.recommendBtn.addEventListener("click", recommend);
elements.rerollBtn.addEventListener("click", recommend);
elements.themeToggle.addEventListener("click", () => {
  applyTheme(state.theme === "dark" ? "light" : "dark");
});

initTheme();
syncSwitchButtons();
