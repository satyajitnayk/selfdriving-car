function lerp(a, b, t) {
  return a + (b - a) * t
}

// Arguments are vectors
function getIntersection(A, B, C, D) {
  const tNumerator = (D.x - C.x) * (A.y - C.y) - (A.x - C.x) * (D.y - C.y);
  const uNumerator = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const denominator = (B.x - A.x) * (D.y - C.y) - (D.x - C.x) * (B.y - A.y);

  const eps = 0.001;
  if (Math.abs(denominator) > eps) {
    const t = tNumerator / denominator;
    const u = uNumerator / denominator;

    // return only when lines intersect
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      // do linear interpolation on either A-B or C-D to get intersection point
      return {
        x: A.x + (B.x - A.x) * t,
        y: A.y + (B.y - A.y) * t,
        offset: t,
      };
    }
  }
  return null;
}

function polygonsIntersect(polygon1, polygon2) {
  for (let i = 0; i < polygon1.length; ++i) {
    for (let j = 0; j < polygon2.length; ++j) {
      const touch = getIntersection(
        polygon1[i],
        polygon1[(i + 1) % polygon1.length],
        polygon2[j],
        polygon2[(j + 1) % polygon2.length],
      )
      if (touch) {
        return true
      }
    }
  }
  return false
}
