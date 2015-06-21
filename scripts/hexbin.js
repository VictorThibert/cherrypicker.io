(function() {

d3.hexbin = function() {
  var width = 1,
      height = 1,
      r,
      x = function(d) { return d[0]; },
      y = function(d) { return d[1]; },
      made = function(d) { return d[2]; }, //added function for third var
      dx,
      dy,
      d3_hexbinAngles = d3.range(0, 2 * Math.PI, Math.PI / 3);

  function hexbin(points) {
    var binsById = {};

    points.forEach(function(point, i) {
      var py = y.call(hexbin, point) / dy, 
          pj = Math.round(py), //call function y on point,i with hexbin as owner //cycles through all 
          px = x.call(hexbin, point) / dx - (pj & 1 ? .5 : 0), 
          pi = Math.round(px),
          pmade = parseInt(made.call(hexbin, point)),///fix this
          py1 = py - pj;

      if (Math.abs(py1) * 3 > 1) { //Setting the boundary conditions
        var px1 = px - pi,
            pi2 = pi + (px < pi ? -1 : 1) / 2,
            pj2 = pj + (py < pj ? -1 : 1),
            px2 = px - pi2,
            py2 = py - pj2;
        if (px1 * px1 + py1 * py1 > px2 * px2 + py2 * py2) pi = pi2 + (pj & 1 ? 1 : -1) / 2, pj = pj2;
      }

      var id = pi + "-" + pj, 
          bin = binsById[id];
      if (bin) { //push points for that bin, and update global bin properties
        bin.push(point);
        bin.totalShot++;
        bin.totalMade = bin.totalMade + pmade;
      } else { //if bin didn't exist already, create new one //set bin properties
        bin = binsById[id] = [point];
        bin.i = pi;
        bin.j = pj;
        bin.x = (pi + (pj & 1 ? 1 / 2 : 0)) * dx;
        bin.y = pj * dy;
        bin.totalMade = pmade;
        bin.totalShot = 1;
      }
    });

    return d3.values(binsById);
  }

  function hexagon(radius) {
    var x0 = 0, y0 = 0;
    return d3_hexbinAngles.map(
      function(angle) {
        var x1 = Math.sin(angle) * radius,
            y1 = -Math.cos(angle) * radius,
            dx = x1 - x0,
            dy = y1 - y0;
        x0 = x1, y0 = y1;
        return [dx, dy];});
  }

  hexbin.hexagon = function(radius, number) {
      if (arguments.length < 1) radius = r;
      return {dpoints:"m" + hexagon(radius).join("l") + "z", number: number};
    };

  hexbin.x = function(_) {
    if (!arguments.length) return x;
    x = _;
    return hexbin;
  };

  hexbin.y = function(_) {
    if (!arguments.length) return y;
    y = _;
    return hexbin;
  };

  hexbin.centers = function() {
    var centers = [];
    for (var y = 0, odd = false, j = 0; y < height + r; y += dy, odd = !odd, ++j) {
      for (var x = odd ? dx / 2 : 0, i = 0; x < width + dx / 2; x += dx, ++i) {
        var center = [x, y];
        center.i = i;
        center.j = j;
        centers.push(center);
      }
    }
    return centers;
  };

  hexbin.mesh = function() {
    var fragment = hexagon(r).slice(0, 4).join("l");
    return hexbin.centers().map(function(p) { return "M" + p + "m" + fragment; }).join("");
  };

  hexbin.size = function(_) {
    if (!arguments.length) return [width, height];
    width = +_[0], height = +_[1];
    return hexbin;
  };

  hexbin.radius = function(_) {
    if (!arguments.length) return r;
    r = +_;
    dx = r * 2 * Math.sin(Math.PI / 3);
    dy = r * 1.5;
    return hexbin;
  };

  return hexbin.radius(1);
};
})();
