document.addEventListener("DOMContentLoaded", function() {
    const scaleFactor = 0.8445;
    const inverseScaleFactor = 1 / scaleFactor;
    const bodyElement = document.body;

    bodyElement.style.transform = `scale(${scaleFactor})`;
    bodyElement.style.transformOrigin = "0 0";
    bodyElement.style.width = `${inverseScaleFactor * 100}%`;
    bodyElement.style.height = `${inverseScaleFactor * 100}%`;
});