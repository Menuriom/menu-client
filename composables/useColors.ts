export const hexToHSL = (hexColor: string) => {
    hexColor = hexColor.replace("#", "");

    // Parse the alpha channel and convert it to a decimal value
    const alpha = hexColor.length === 8 ? parseInt(hexColor.substring(6, 8), 16) / 255 : 1;

    const red = parseInt(hexColor.substring(0, 2), 16) / 255;
    const green = parseInt(hexColor.substring(2, 4), 16) / 255;
    const blue = parseInt(hexColor.substring(4, 6), 16) / 255;

    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const diff = max - min;

    // Calculate the lightness (L) value
    const lightness = (max + min) / 2;

    // Calculate the saturation (S) value
    const saturation = max === min ? 0 : lightness > 0.5 ? diff / (2 - diff) : diff / (max + min);

    // Calculate the hue (H) value
    let hue;
    if (max === min) hue = 0;
    else if (max === red) hue = (green - blue) / diff;
    else if (max === green) hue = 2 + (blue - red) / diff;
    else hue = 4 + (red - green) / diff;

    hue = Math.round(hue * 60);
    if (hue < 0) hue += 360;

    return { h: hue, s: saturation, l: lightness, a: alpha };
};

export const lightnessLVL = (hexColor: string) => {
    hexColor = hexColor.replace("#", "");
    const red = parseInt(hexColor.substring(0, 2), 16) / 255;
    const green = parseInt(hexColor.substring(2, 4), 16) / 255;
    const blue = parseInt(hexColor.substring(4, 6), 16) / 255;

    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);

    const lightness = (max + min) / 2;
    return lightness;
};

export const textColor = (hexColor: string) => {
    hexColor = hexColor.replace("#", "");
    const red = parseInt(hexColor.substring(0, 2), 16) / 255;
    const green = parseInt(hexColor.substring(2, 4), 16) / 255;
    const blue = parseInt(hexColor.substring(4, 6), 16) / 255;

    const brightness = Math.round((red * 299 + green * 587 + blue * 114) / 1000);
    const textColor = brightness > 125 ? "black" : "white";

    return textColor;
};
