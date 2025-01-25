export const COLORS = [
  "#3B82F6", // Blue
  "#22C55E", // Green
  "#EF4444", // Red
  "#F59E0B", // Orange
];

export const calculateFontSize = (nameCount) => {
  const baseFontSize = 24;
  const minFontSize = 10;
  return Math.max(minFontSize, baseFontSize - (nameCount - 10) * 0.5);
};

export const drawWheel = (
  canvas,
  names,
  ipsFilterEnabled,
  borderThickness = 2,
  showShadow = true,
  centerSizeRatio = 0.15
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 20;

  if (showShadow) {
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 5;
  } else {
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  const fontSize = calculateFontSize(names.length);

  names.forEach((name, index) => {
    const startAngle = (index / names.length) * Math.PI * 2;
    const endAngle = ((index + 1) / names.length) * Math.PI * 2;
    const midAngle = (startAngle + endAngle) / 2;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.fillStyle = COLORS[index % COLORS.length];
    ctx.fill();
    ctx.closePath();

    if (borderThickness > 0) {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = borderThickness;
      ctx.stroke();
      ctx.closePath();
    }

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(midAngle);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    const textDistance = radius * 0.85;
    ctx.fillText(name, textDistance, 0);
    ctx.restore();
  });

  ctx.shadowColor = "transparent";

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius * centerSizeRatio, 0, Math.PI * 2);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  if (borderThickness > 0) {
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = borderThickness;
    ctx.stroke();
  }
  ctx.closePath();
};
