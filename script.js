const toolButtons = document.querySelectorAll(".tool-btn");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const modeLabel = document.getElementById("modeLabel");
const statusLabel = document.getElementById("statusLabel");
const polylineCount = document.getElementById("polylineCount");

const MAX_POLYLINES = 100;
const POINT_RADIUS = 5;
const HIT_RADIUS = 12;

let polylines = [];
let currentMode = "begin";
let currentPolyline = null;
let selectedPoint = null;
let hoveredPoint = null;
let isDragging = false;
let editorActive = true;

function setMode(mode) {
  currentMode = mode;
  hoveredPoint = null;
  selectedPoint = null;
  isDragging = false;

  updateModeUI();

  if (mode === "begin") {
    setStatus("Begin mode active. Click on canvas to add points.");
    currentPolyline = null;
  } else if (mode === "move") {
    setStatus("Move mode active. Drag a nearby point.");
  } else if (mode === "delete") {
    setStatus("Delete mode active. Click near a point to delete it.");
  } else if (mode === "refresh") {
    setStatus("Refresh mode selected.");
  } else if (mode === "clear") {
    setStatus("Clear mode selected.");
  } else if (mode === "quit") {
    setStatus("Editor disabled.");
  }

  drawAll();
}

function updateModeUI() {
  modeLabel.textContent = currentMode.toUpperCase();
  modeLabel.className = "";

  if (currentMode === "begin") modeLabel.classList.add("mode-begin");
  if (currentMode === "move") modeLabel.classList.add("mode-move");
  if (currentMode === "delete") modeLabel.classList.add("mode-delete");
  if (currentMode === "refresh") modeLabel.classList.add("mode-refresh");
  if (currentMode === "clear") modeLabel.classList.add("mode-clear");
  if (currentMode === "quit") modeLabel.classList.add("mode-quit");

  toolButtons.forEach((btn) => {
    const btnMode = btn.dataset.mode;
    btn.classList.toggle("active", btnMode === currentMode);
  });
}

function setStatus(message) {
  statusLabel.textContent = message;
}

function updatePolylineCount() {
  polylineCount.textContent = polylines.length;
}

function getMousePos(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * (canvas.width / rect.width),
    y: (event.clientY - rect.top) * (canvas.height / rect.height),
  };
}

function drawAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  polylines.forEach((polyline) => {
    if (polyline.length === 0) return;

    if (polyline.length >= 2) {
      ctx.beginPath();
      ctx.moveTo(polyline[0].x, polyline[0].y);

      for (let i = 1; i < polyline.length; i++) {
        ctx.lineTo(polyline[i].x, polyline[i].y);
      }

      ctx.strokeStyle = "#111827";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    polyline.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, POINT_RADIUS, 0, Math.PI * 2);

      let fillColor = "#2563eb";

      if (hoveredPoint && hoveredPoint.point === point) {
        fillColor = "#f59e0b";
      }

      if (selectedPoint && selectedPoint.point === point) {
        fillColor = "#10b981";
      }

      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  });

  if (selectedPoint) {
    ctx.beginPath();
    ctx.arc(selectedPoint.point.x, selectedPoint.point.y, 10, 0, Math.PI * 2);
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2;
    ctx.stroke();
  } else if (hoveredPoint) {
    ctx.beginPath();
    ctx.arc(hoveredPoint.point.x, hoveredPoint.point.y, 9, 0, Math.PI * 2);
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function addPointToCurrentPolyline(point) {
  if (!currentPolyline) {
    if (polylines.length >= MAX_POLYLINES) {
      setStatus("Maximum number of polylines reached.");
      return;
    }

    currentPolyline = [];
    polylines.push(currentPolyline);
    updatePolylineCount();
  }

  currentPolyline.push(point);
  setStatus(`Point added at (${Math.round(point.x)}, ${Math.round(point.y)}).`);
  drawAll();
}

function findNearestPoint(pos) {
  let nearest = null;
  let minDistance = Infinity;

  polylines.forEach((polyline, polylineIndex) => {
    polyline.forEach((point, pointIndex) => {
      const dx = point.x - pos.x;
      const dy = point.y - pos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < minDistance) {
        minDistance = distance;
        nearest = {
          polylineIndex,
          pointIndex,
          point,
          distance,
        };
      }
    });
  });

  if (nearest && nearest.distance <= HIT_RADIUS) {
    return nearest;
  }

  return null;
}

function deleteNearestPoint(pos) {
  const nearest = findNearestPoint(pos);
  hoveredPoint = null;

  if (!nearest) {
    setStatus("No nearby point found to delete.");
    return;
  }

  const polyline = polylines[nearest.polylineIndex];
  polyline.splice(nearest.pointIndex, 1);

  if (polyline.length === 0) {
    polylines.splice(nearest.polylineIndex, 1);
    currentPolyline = null;
  }

  updatePolylineCount();
  selectedPoint = null;
  setStatus("Point deleted successfully.");
  drawAll();
}

function clearCanvas() {
  polylines = [];
  currentPolyline = null;
  selectedPoint = null;
  hoveredPoint = null;
  isDragging = false;
  updatePolylineCount();
  drawAll();
  setStatus("Canvas cleared successfully.");
}

toolButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const mode = btn.dataset.mode;

    if (mode === "refresh") {
      if (!editorActive) return;
      currentMode = "refresh";
      updateModeUI();
      drawAll();
      setStatus("Canvas refreshed.");
      return;
    }

    if (mode === "clear") {
      if (!editorActive) return;
      currentMode = "clear";
      updateModeUI();
      clearCanvas();
      return;
    }

    if (mode === "quit") {
      editorActive = false;
      setMode("quit");
      return;
    }

    editorActive = true;
    setMode(mode);
  });
});

canvas.addEventListener("click", (event) => {
  if (!editorActive) return;

  const pos = getMousePos(event);

  if (currentMode === "begin") {
    addPointToCurrentPolyline(pos);
  } else if (currentMode === "delete") {
    deleteNearestPoint(pos);
  }
});

canvas.addEventListener("mousedown", (event) => {
  if (!editorActive || currentMode !== "move") return;

  const pos = getMousePos(event);
  const nearest = findNearestPoint(pos);

  if (nearest) {
    selectedPoint = nearest;
    isDragging = true;
    setStatus("Point selected. Drag to move.");
    drawAll();
  } else {
    setStatus("No nearby point found to move.");
  }
});

canvas.addEventListener("mousemove", (event) => {
  if (!editorActive) return;

  const pos = getMousePos(event);

  if (currentMode === "move" && isDragging && selectedPoint) {
    selectedPoint.point.x = pos.x;
    selectedPoint.point.y = pos.y;
    drawAll();
    return;
  }

  if (currentMode === "move" || currentMode === "delete") {
    hoveredPoint = findNearestPoint(pos);
    canvas.style.cursor = hoveredPoint ? "pointer" : "crosshair";
    drawAll();
  } else {
    hoveredPoint = null;
    canvas.style.cursor = "crosshair";
    drawAll();
  }
});

canvas.addEventListener("mouseleave", () => {
  hoveredPoint = null;
  canvas.style.cursor = "crosshair";
  drawAll();
});

window.addEventListener("mouseup", () => {
  if (!editorActive) return;

  if (isDragging && selectedPoint) {
    setStatus("Point moved successfully.");
  }

  isDragging = false;
  selectedPoint = null;
  drawAll();
});

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();

  if (key === "b") {
    editorActive = true;
    setMode("begin");
  } else if (key === "m") {
    editorActive = true;
    setMode("move");
  } else if (key === "d") {
    editorActive = true;
    setMode("delete");
  } else if (key === "r") {
    if (!editorActive) return;
    currentMode = "refresh";
    updateModeUI();
    drawAll();
    setStatus("Canvas refreshed.");
  } else if (key === "q") {
    editorActive = false;
    setMode("quit");
  } else if (key === "enter") {
    if (currentMode === "begin") {
      currentPolyline = null;
      setStatus("Polyline completed. Press B and click to start a new polyline.");
    }
  }
});

updateModeUI();
updatePolylineCount();
drawAll();