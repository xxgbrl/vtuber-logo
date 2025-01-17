let letterColorPickers = [];

function createLetterColorPickers(text) {
    const container = document.getElementById('letterColors');
    container.innerHTML = '';
    letterColorPickers = [];

    for (let i = 0; i < text.length; i++) {
        const div = document.createElement('div');
        div.className = 'letter-color';
        
        const label = document.createElement('label');
        label.textContent = text[i];
        
        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = '#000000';
        colorInput.addEventListener('input', generateLogo);

        const hexInput = document.createElement('input');
        hexInput.type = 'text';
        hexInput.value = '#000000';
        hexInput.addEventListener('input', () => {
            colorInput.value = hexInput.value;
            generateLogo();
        });

        colorInput.addEventListener('input', () => {
            hexInput.value = colorInput.value;
        });

        div.appendChild(label);
        div.appendChild(colorInput);
        div.appendChild(hexInput);
        container.appendChild(div);
        letterColorPickers.push(colorInput);
    }

    container.style.display = 'block';
}

function updateSliderValue(sliderId, valueId) {
    const slider = document.getElementById(sliderId);
    const valueDisplay = document.getElementById(valueId);
    slider.addEventListener('input', () => {
        valueDisplay.textContent = slider.value;
        generateLogo();
    });
}

function generateInitialLogo() {
    const text = document.getElementById('logoText').value;
    if (text) {
        createLetterColorPickers(text);
        generateLogo();
    }
}

function generateLogo() {
    const canvas = document.getElementById('logoCanvas');
    const ctx = canvas.getContext('2d');
    const text = document.getElementById('logoText').value;
    const fontSize = document.getElementById('fontSize').value;
    const bgColor = document.getElementById('bgColor').value;
    const bgColorHex = document.getElementById('bgColorHex').value;
    const letterSpacing = parseInt(document.getElementById('letterSpacing').value, 10);
    const shadowX = parseInt(document.getElementById('shadowX').value, 10);
    const shadowY = parseInt(document.getElementById('shadowY').value, 10);
    const strokeOuter = parseInt(document.getElementById('strokeOuter').value, 10);
    const strokeInner = parseInt(document.getElementById('strokeInner').value, 10);

    // Update background color from hex input
    if (bgColor !== bgColorHex) {
        document.getElementById('bgColor').value = bgColorHex;
    }

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (text) {
        ctx.font = `${fontSize}px VtuberFont`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const totalWidth = Array.from(text).reduce((acc, letter) => {
            return acc + ctx.measureText(letter).width + letterSpacing;
        }, -letterSpacing);

        let currentX = (canvas.width - totalWidth) / 2;

        for (let i = 0; i < text.length; i++) {
            const letter = text[i];
            const letterWidth = ctx.measureText(letter).width;
            const x = currentX + letterWidth / 2;
            const y = canvas.height / 2;
            const color = letterColorPickers[i].value;

            // Draw shadow
            ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = shadowX;
            ctx.shadowOffsetY = shadowY;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.fillText(letter, x, y);

            // Draw strokes and letters
            ctx.shadowColor = 'transparent';

            // Outer stroke
            ctx.strokeStyle = 'white';
            ctx.lineWidth = strokeOuter;
            ctx.strokeText(letter, x, y);

            // Inner stroke
            ctx.strokeStyle = 'black';
            ctx.lineWidth = strokeInner;
            ctx.strokeText(letter, x, y);

            // Fill letter
            ctx.fillStyle = color;
            ctx.fillText(letter, x, y);

            currentX += letterWidth + letterSpacing;
        }
    }
}

function downloadLogo() {
    const canvas = document.getElementById('logoCanvas');
    const link = document.createElement('a');
    link.download = 'logo.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Attach event listeners
document.getElementById('logoText').addEventListener('input', generateInitialLogo);
document.getElementById('fontSize').addEventListener('input', generateLogo);
document.getElementById('bgColor').addEventListener('input', generateLogo);
document.getElementById('bgColorHex').addEventListener('input', generateLogo);
document.getElementById('letterSpacing').addEventListener('input', generateLogo);
document.getElementById('shadowX').addEventListener('input', generateLogo);
document.getElementById('shadowY').addEventListener('input', generateLogo);
document.getElementById('strokeOuter').addEventListener('input', generateLogo);
document.getElementById('strokeInner').addEventListener('input', generateLogo);

// Initialize sliders with value displays
updateSliderValue('fontSize', 'fontSizeValue');
updateSliderValue('letterSpacing', 'letterSpacingValue');
updateSliderValue('shadowX', 'shadowXValue');
updateSliderValue('shadowY', 'shadowYValue');
updateSliderValue('strokeOuter', 'strokeOuterValue');
updateSliderValue('strokeInner', 'strokeInnerValue');

window.onload = function () {
    generateInitialLogo();
};