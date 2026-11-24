document.fonts.ready.then(() => {
  const context = document.createElement('canvas').getContext('2d');
  for (const item of document.querySelectorAll('.copy')) {
    const style = getComputedStyle(item);
    const size = parseFloat(style.fontSize);
    context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const metrics = context.measureText('Hg');
    const baseline = (metrics.fontBoundingBoxAscent - metrics.fontBoundingBoxDescent + size) / 2;
    item.style.top = (parseFloat(item.style.top) - baseline) + 'px';
    const lines = [...item.children];
    lines.forEach((line, index) => {
      const next = lines[index + 1];
      if (next) line.style.lineHeight = (parseFloat(next.style.top) - parseFloat(line.style.top)) + 'px';
      line.style.marginLeft = line.style.left;
    });
  }
});
const dialog = document.querySelector('dialog');
const popup = document.getElementById('popup-booking');
const flightNames = ['', 'Полет для новичков', 'Экстрим-полет'];
document.querySelectorAll('[data-book]').forEach((button, index) => {
  button.addEventListener('click', () => {
    popup.reset();
    popup.elements.phone.setCustomValidity('');
    document.getElementById('flight').textContent = flightNames[index];
    popup.querySelector('.result').replaceChildren();
    dialog.showModal();
  });
});
dialog.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});
for (const form of [document.getElementById('booking'), popup]) {
  const phone = [...form.elements].find(input => input.type === 'tel');
  phone.addEventListener('input', () => {
    phone.value = phone.value.replace(/[^+0-9 ()-]/g, '');
    phone.setCustomValidity('');
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (phone.value.replace(/[^0-9]/g, '').length !== 11) {
      phone.setCustomValidity('Введите номер телефона из 11 цифр.');
      phone.reportValidity();
      return;
    }
    const message = form.querySelector('[role="status"]');
    const call = document.createElement('a');
    call.href = 'tel:+74958746021';
    call.textContent = '+7 (495) 874-60-21';
    message.replaceChildren('Для записи позвоните: ', call);
  });
}
