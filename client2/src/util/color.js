
export function hsl2rgb(h, s, l) {
    let a = s * Math.min(l, 1 - l);
    let f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return [f(0), f(8), f(4)];
}

export function isDark(r, g, b) {
    let hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b))
    if (hsp > 120.5)
        return false
    else
        return true
}


// input: r,g,b in [0,1], out: h in [0,360) and s,v in [0,1]
export function rgb2hsv(r, g, b) {
    let v = Math.max(r, g, b), c = v - Math.min(r, g, b);
    let h = c && ((v == r) ? (g - b) / c : ((v == g) ? 2 + (b - r) / c : 4 + (r - g) / c));
    return [60 * (h < 0 ? h + 6 : h), v && c / v, v];
}

// input: h in [0,360] and s,v in [0,1] - output: r,g,b in [0,1]
export function hsv2rgb(h, s, v) {
    let f = (n, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
    return [f(5), f(3), f(1)];
}

export function hsl2hsv(h, s, l, v = s * Math.min(l, 1 - l) + l) {
    return [h, v ? 2 - 2 * l / v : 0, v];
}

export function hsv2hsl(h, s, v, l = v - v * s / 2, m = Math.min(l, 1 - l)) {
    return [h, m ? (v - l) / m : 0, l];
}

export function hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
}

export function rgbNormalized(rgb) {
    rgb[0] = rgb[0] / 255;
    rgb[1] = rgb[1] / 255;
    rgb[2] = rgb[1] / 255;
    return rgb;
}

export function rgbToCSS(r, g, b, alpha) {

    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}