function generateHammingCode() {
  let dataInput = document.getElementById('dataInput').value;
  if (!/^[01]+$/.test(dataInput)) {
      alert("Lütfen geçerli bir binary sayı giriniz.");
      return;
  }

  let dataBits = dataInput.split('').map(Number);
  let m = dataBits.length;
  let r = 0;

  while ((1 << r) < m + r + 1) {
      r++;
  }

  let hammingCode = new Array(m + r + 1).fill(0);

  let j = 0;
  for (let i = 1; i < hammingCode.length; i++) {
      if (Math.log2(i) % 1 !== 0) {
          hammingCode[i] = dataBits[j++];
      }
  }

  for (let i = 0; i < r; i++) {
      let position = 1 << i;
      let value = 0;

      for (let j = 1; j < hammingCode.length; j++) {
          if (j & position) {
              value ^= hammingCode[j];
          }
      }

      hammingCode[position] = value;
  }

  displayCode(hammingCode.slice(1), 'hammingOutput', 'Hamming Kodu: ');
  clearExplanation();
}

function introduceError() {
  let errorPosition = parseInt(document.getElementById('errorPosition').value);
  let hammingOutput = document.getElementById('hammingOutput').textContent.split(": ")[1];

  if (isNaN(errorPosition) || errorPosition < 1 || errorPosition > hammingOutput.length) {
      alert("Geçerli bir hata pozisyonu giriniz.");
      return;
  }

  let hammingCode = hammingOutput.split('').map(Number);
  hammingCode[errorPosition - 1] ^= 1;

  displayCode(hammingCode, 'errorOutput', 'Hatalı Hamming Kodu: ', errorPosition - 1);
  clearExplanation();
}

function detectAndCorrectError() {
  let hammingOutput = document.getElementById('errorOutput').textContent.split(": ")[1];

  if (!hammingOutput) {
      alert("Önce bir hata oluşturunuz.");
      return;
  }

  let hammingCode = hammingOutput.split('').map(Number);
  let r = Math.floor(Math.log2(hammingCode.length)) + 1;

  let errorPosition = 0;

  let explanation = document.getElementById('explanation');
  explanation.innerHTML = "<strong>Hata Tespit ve Düzeltme Süreci:</strong><br><br>";

  for (let i = 0; i < r; i++) {
      let position = 1 << i;
      let value = 0;

      for (let j = 1; j <= hammingCode.length; j++) {
          if (j & position) {
              value ^= hammingCode[j - 1];
          }
      }

      explanation.innerHTML += `<div class="step">
                                  <span class="position">Kontrol biti pozisyonu: ${position}</span>
                                  <div class="code-block">${generateVisualHammingCode(hammingCode, position)}</div>
                                  <span class="result">Kontrol biti değeri: ${value}</span>
                                </div><br>`;

      if (value) {
          errorPosition += position;
      }
  }

  if (errorPosition === 0) {
      document.getElementById('correctionOutput').textContent = "Hata bulunamadı.";
      explanation.innerHTML += "<br><strong>Sonuç:</strong> Hata bulunamadı.";
  } else {
      explanation.innerHTML += `<br><strong>Hata Pozisyonu:</strong> ${errorPosition}<br>`;
      hammingCode[errorPosition - 1] ^= 1;
      displayCode(hammingCode, 'correctionOutput', 'Düzeltilmiş Hamming Kodu: ', errorPosition - 1);
      explanation.innerHTML += "Hata düzeltildi.";
  }
}

function displayCode(codeArray, elementId, message, errorIndex = -1) {
  let outputElement = document.getElementById(elementId);
  outputElement.innerHTML = message;

  codeArray.forEach((bit, index) => {
      let span = document.createElement('span');
      span.textContent = bit;
      if (index === errorIndex) {
          span.classList.add('error');
      } else {
          span.classList.add('correct');
      }
      outputElement.appendChild(span);
  });
}

function clearExplanation() {
  document.getElementById('explanation').innerHTML = '';
}

function generateVisualHammingCode(hammingCode, position) {
  return hammingCode.map((bit, index) => {
      let bitClass = (index + 1) & position ? 'highlight' : '';
      return `<span class="${bitClass}">${bit}</span>`;
  }).join('');
}
