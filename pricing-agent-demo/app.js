(function () {
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".panel");
  const recommendationBlock = document.getElementById("recommendation-block");
  const quickConfigBlock = document.getElementById("quick-config-block");

  // 仅两个 Tab：市场洞察、价格建议
  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const targetId = "panel-" + this.dataset.tab;
      tabs.forEach((t) => t.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active"));
      this.classList.add("active");
      const panel = document.getElementById(targetId);
      if (panel) panel.classList.add("active");
    });
  });

  // 生成建议 → 展示推荐结果（含定价逻辑解释）
  document.querySelectorAll(".js-generate").forEach((btn) => {
    btn.addEventListener("click", function () {
      if (recommendationBlock) {
        recommendationBlock.hidden = false;
        recommendationBlock.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // 确认应用方案 → 展示快速配置
  const applyBtn = document.querySelector(".js-apply");
  if (applyBtn) {
    applyBtn.addEventListener("click", function () {
      if (quickConfigBlock) {
        quickConfigBlock.hidden = false;
        quickConfigBlock.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }
})();
