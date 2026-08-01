// Radar polygon geometry — shared by the OG renderer and the gate teaser silhouette.

export function radarPolygonPoints(
  values: number[],
  cx: number,
  cy: number,
  radius: number,
): string {
  const n = values.length;
  return values
    .map((v, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const r = (Math.max(0, Math.min(100, v)) / 100) * radius;
      return `${(cx + Math.cos(angle) * r).toFixed(1)},${(cy + Math.sin(angle) * r).toFixed(1)}`;
    })
    .join(' ');
}

export function radarGridPoints(cx: number, cy: number, radius: number, n: number): string {
  return radarPolygonPoints(Array(n).fill(100), cx, cy, radius);
}
