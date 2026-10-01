(function () {
  "use strict";

  var statusEl = document.getElementById("status");
  function setStatus(msg, kind) {
    statusEl.textContent = msg || "";
    statusEl.className = "status" + (kind ? " " + kind : "");
  }

  var left = new JSONEditor(document.getElementById("jsoneditor"), {
    mode: "code",
    modes: ["code", "text"],
    indentation: 2,
    onError: function (err) { setStatus(err.toString(), "err"); }
  });

  var right = new JSONEditor(document.getElementById("jsoneditor-right"), {
    mode: "tree",
    modes: ["tree", "code", "form", "text", "view", "preview"],
    indentation: 2,
    onError: function (err) { setStatus(err.toString(), "err"); }
  });

  var indentSelect = document.getElementById("tab-value");

  if (left.aceEditor && left.aceEditor.session && left.aceEditor.session.setUseWorker) {
    left.aceEditor.session.setUseWorker(false);
  }

  function parse(text) {
    return JSON.parse(text);
  }

  function tabIndent() {
    return Number(indentSelect.options[indentSelect.selectedIndex].value) || 2;
  }

  function parseLeftToRight() {
    var text = left.getText();
    if (!text || !text.trim()) {
      setStatus("Left editor is empty", "err");
      return;
    }
    var data;
    try {
      data = parse(text);
    } catch (e) {
      setStatus("Invalid JSON: " + e.message, "err");
      return;
    }
    var pretty = JSON.stringify(data, null, tabIndent());
    left.setText(pretty);
    right.set(data);
    setStatus("Parsed OK", "ok");
  }

  function formatRightToLeft() {
    try {
      var data = right.get();
      left.set(data);
      setStatus("Copied tree to raw", "ok");
    } catch (e) {
      setStatus("Invalid tree data: " + e.message, "err");
    }
  }

  document.getElementById("beautifyRToL").addEventListener("click", parseLeftToRight);
  document.getElementById("beautifyLToR").addEventListener("click", formatRightToLeft);

  indentSelect.addEventListener("change", function () {
    left.setOptions({ indentation: tabIndent() });
    right.setOptions({ indentation: tabIndent() });
    if (left.getText().trim()) parseLeftToRight();
  });

  document.getElementById("btn-new").addEventListener("click", function () {
    left.set({});
    right.set({});
    setStatus("Ready");
  });

  function copyText(text, okMsg) {
    function done() { setStatus(okMsg, "ok"); }
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      if (ok) done(); else setStatus("Clipboard unavailable in this context", "err");
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else {
      fallback();
    }
  }

  document.getElementById("btn-copy").addEventListener("click", function () {
    copyText(left.getText(), "Copied left editor to clipboard");
  });

  document.getElementById("btn-download").addEventListener("click", function () {
    var text = left.getText();
    var blob = new Blob([text], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  });

  function loadFile(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (ev) {
      try {
        var data = parse(ev.target.result);
        left.set(data);
        right.set(data);
        setStatus("Loaded " + file.name, "ok");
      } catch (err) {
        left.setText(ev.target.result);
        setStatus("Loaded " + file.name + " (invalid JSON: " + err.message + ")", "err");
      }
    };
    reader.readAsText(file);
  }

  document.getElementById("fileToLoad").addEventListener("change", function (e) {
    loadFile(e.target.files && e.target.files[0]);
    e.target.value = "";
  });

  var pageDrop = document.getElementById("page-drop");
  function hasFiles(e) {
    var t = e.dataTransfer && e.dataTransfer.types;
    return !!t && Array.prototype.indexOf.call(t, "Files") !== -1;
  }
  var dragDepth = 0;
  window.addEventListener("dragenter", function (e) {
    if (!hasFiles(e)) return;
    e.preventDefault();
    dragDepth++;
    pageDrop.classList.add("show");
  }, true);
  window.addEventListener("dragover", function (e) {
    if (!hasFiles(e)) return;
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
  }, true);
  window.addEventListener("dragleave", function (e) {
    if (!hasFiles(e)) return;
    dragDepth--;
    if (dragDepth <= 0) { dragDepth = 0; pageDrop.classList.remove("show"); }
  }, true);
  window.addEventListener("drop", function (e) {
    if (!hasFiles(e)) return;
    e.preventDefault();
    e.stopPropagation();
    dragDepth = 0;
    pageDrop.classList.remove("show");
    var file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) loadFile(file);
  }, true);

  document.getElementById("btn-url").addEventListener("click", function () {
    var url = window.prompt("Enter a public URL (must allow CORS):");
    if (!url) return;
    setStatus("Loading " + url + " ...");
    fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.text();
      })
      .then(function (text) {
        try {
          var data = parse(text);
          left.set(data);
          right.set(data);
          setStatus("Loaded URL", "ok");
        } catch (e) {
          left.setText(text);
          setStatus("Loaded URL (invalid JSON: " + e.message + ")", "err");
        }
      })
      .catch(function (e) {
        setStatus("Fetch failed (CORS or network): " + e.message, "err");
      });
  });

  left.set({ firstnam: "James", surname: "Bond", mobile: ["007-700-007", "001-007-007-0007"] });
  right.set({ firstnam: "James", surname: "Bond", mobile: ["007-700-007", "001-007-007-0007"] });

  window.addEventListener("resize", function () {
    left.resize();
    right.resize();
  });
})();
