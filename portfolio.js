(function () {
  "use strict";

  var page = document.body.getAttribute("data-page") || "";

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }
  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  /* Mobile nav */
  var navToggle = qs("#navToggle");
  var navLinks = qs("#navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      navLinks.classList.toggle("is-open");
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
      });
    });
  }

  function restartBoard(board) {
    if (!board) return;
    board.classList.remove("is-drawn");
    board.classList.remove("has-focus");
    board.querySelectorAll(".clue.is-focus").forEach(function (c) {
      c.classList.remove("is-focus");
      c.style.removeProperty("--fx");
      c.style.removeProperty("--fy");
    });
    var fd = board.querySelector("[data-focus-detail]");
    if (fd) fd.classList.remove("is-on");
    void board.offsetWidth;
    requestAnimationFrame(function () {
      board.classList.add("is-drawn");
    });
  }

  function setBoardLayoutMode() {
    var flow = window.innerWidth < 900;
    qsa(".board").forEach(function (b) {
      b.classList.toggle("is-flow", flow);
    });
  }

  function releaseFocus(board) {
    board.classList.remove("has-focus");
    board.querySelectorAll(".clue.is-focus").forEach(function (c) {
      c.classList.remove("is-focus");
      c.style.removeProperty("--fx");
      c.style.removeProperty("--fy");
    });
    var fd = board.querySelector("[data-focus-detail]");
    if (fd) fd.classList.remove("is-on");
  }

  function focusClue(board, clue) {
    var br = board.getBoundingClientRect();
    var cr = clue.getBoundingClientRect();
    var clueCx = cr.left + cr.width / 2;
    var clueCy = cr.top + cr.height / 2;
    var boardCx = br.left + br.width / 2;
    var boardCy = br.top + br.height * 0.42;
    var dx = boardCx - clueCx;
    var dy = boardCy - clueCy;
    clue.style.setProperty("--fx", dx + "px");
    clue.style.setProperty("--fy", dy + "px");
    clue.classList.add("is-focus");
    board.classList.add("has-focus");
    var fd = board.querySelector("[data-focus-detail]");
    if (fd) fd.classList.add("is-on");
  }

  function initBoards() {
    setBoardLayoutMode();
    window.addEventListener("resize", setBoardLayoutMode);

    document.addEventListener("click", function (ev) {
      var clue = ev.target.closest(".clue");
      var board = ev.target.closest(".board");
      if (!clue && board && board.classList.contains("has-focus")) {
        releaseFocus(board);
        return;
      }
      if (!clue || !board) return;
      if (clue.classList.contains("is-focus")) {
        releaseFocus(board);
        return;
      }
      releaseFocus(board);
      focusClue(board, clue);
    });

    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") {
        qsa(".board.has-focus").forEach(releaseFocus);
      }
    });
  }

  if (page === "about") {
    initBoards();
    var tabs = qsa(".tab");
    var panels = {
      pb: qs("#panel-pb"),
      skills: qs("#panel-skills"),
      edu: qs("#panel-edu"),
    };
    tabs.forEach(function (t) {
      t.addEventListener("click", function () {
        tabs.forEach(function (x) {
          x.classList.remove("is-active");
        });
        t.classList.add("is-active");
        Object.keys(panels).forEach(function (k) {
          if (panels[k]) panels[k].classList.add("is-hidden");
        });
        var key = t.getAttribute("data-tab");
        var target = panels[key];
        if (target) {
          target.classList.remove("is-hidden");
          var board = target.querySelector(".board");
          if (board) restartBoard(board);
        }
      });
    });
    var defaultBoard = qs("#panel-pb .board");
    setTimeout(function () {
      restartBoard(defaultBoard);
    }, 200);
  }

  if (page === "achievements") {
    initBoards();
    var achBoard = qs(".board.ach-board");
    setTimeout(function () {
      restartBoard(achBoard);
    }, 200);
  }

  if (page === "contact") {
    var form = qs("#contactForm");
    var successBox = qs("#successBox");
    var successName = qs("#successName");
    if (form && successBox && successName) {
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var ok = true;
        var values = {};
        qsa(".field", form).forEach(function (f) {
          var input = f.querySelector("input, textarea");
          if (!input) return;
          var v = (input.value || "").trim();
          values[input.name] = v;
          if (!v) {
            f.classList.add("has-error");
            ok = false;
          } else {
            f.classList.remove("has-error");
          }
        });
        if (!ok) {
          var firstErr = form.querySelector(".field.has-error input, .field.has-error textarea");
          if (firstErr) firstErr.focus();
          return;
        }
        successName.textContent = values.name || "friend";
        form.style.display = "none";
        successBox.removeAttribute("hidden");
        successBox.classList.remove("is-hidden");
      });
      qsa("input, textarea", form).forEach(function (input) {
        input.addEventListener("input", function () {
          var f = input.closest(".field");
          if (f && input.value.trim()) f.classList.remove("has-error");
        });
      });
    }
  }
})();
