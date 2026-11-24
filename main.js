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
const dialog = document.querySelector('.booking-dialog');
const popup = document.getElementById('popup-booking');
const flightNames = ['', 'Полет для новичков', 'Экстрим-полет'];
function openBooking(index = 0) {
  popup.reset();
  popup.elements.phone.setCustomValidity('');
  document.getElementById('flight').textContent = flightNames[index];
  popup.querySelector('.result').replaceChildren();
  dialog.showModal();
}
document.querySelectorAll('[data-book]').forEach((button, index) => {
  button.addEventListener('click', () => openBooking(index));
});
dialog.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});
function configureBooking(form) {
  const phone = form.elements.phone;
  phone.addEventListener('input', () => {
    const digits = phone.value.replace(/\D/g, '').replace(/^[78]/, '').slice(0, 10);
    const formatted = digits ? '+7 (' + digits.slice(0, 3)
      + (digits.length > 3 ? ') ' + digits.slice(3, 6) : '')
      + (digits.length > 6 ? '-' + digits.slice(6, 8) : '')
      + (digits.length > 8 ? '-' + digits.slice(8) : '') : '';
    if (formatted !== phone.value) phone.value = formatted;
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

const desktop = document.querySelector('.desktop-layout');
const assetDirectory = new URL(document.querySelector('.art').getAttribute('data'), document.baseURI);
const photo = (number, alt) => `<img src="${new URL('photo-' + number + '.jpg', assetDirectory)}" alt="${alt}" loading="lazy">`;
function readCopy(group) {
  return [...desktop.querySelectorAll(`[data-copy="${group}"]`)]
    .map(node => [...node.children].map(line => line.textContent.trim()));
}
const desktopHeader = document.querySelector('.desktop-header');
const sticky = desktopHeader.cloneNode(true);
sticky.className = 'flight-sticky';
sticky.inert = true;
desktopHeader.after(sticky);
const hero = document.querySelector('.hero-image');
new IntersectionObserver(([entry]) => {
  const visible = !entry.isIntersecting;
  sticky.classList.toggle('is-visible', visible);
  sticky.inert = !visible;
  desktopHeader.inert = visible;
}).observe(hero);

const compactLogo = desktopHeader.querySelector('.site-brand').outerHTML;
const compactPhone = desktopHeader.querySelector('.nav-phone').outerHTML;
const compactLinks = [...desktopHeader.querySelectorAll('a[href^="#"]')].map(link =>
  `<a href="#small-${link.hash.slice(1)}">${link.textContent}</a>`
).join('');
const compact = document.createElement('main');
compact.className = 'compact-layout';
const advantages = [['experience', 4], ['instructors', 1], ['equipment', 5], ['safety', 0]];
const plans = ['beginner', 'extreme'];
compact.innerHTML = `
  <section class="compact-hero">
    <header><div class="compact-grid compact-nav">${compactLogo}<button class="menu-toggle" type="button" aria-label="Открыть меню" aria-expanded="false" aria-haspopup="dialog" aria-controls="flight-menu"><span></span><span></span></button></div></header>
    <div class="compact-grid hero-content"><h1>Полеты на параплане</h1><p>Испытай незабываемые эмоции, летая над горами</p><button type="button" class="pill" data-plan="0">Записаться на полет</button></div>
  </section>
  <section id="small-about" class="flight-section">
    <h2>Воплощаем мечты о полете</h2>
    <div class="about-grid"><div>${readCopy('about').map(lines => `<p>${lines.join(' ')}</p>`).join('')}
    <div class="photo-grid">${photo(3,'Параплан на закате')}${photo(4,'Параплан над горным лесом')}</div></div>${photo(2,'Пилот с парапланом на закате')}</div>
  </section>
  <section class="flight-section"><h2>Ты в руках профессионалов</h2><div class="photo-grid advantages">${advantages.map(([group, number]) => {
    const [title] = readCopy(group + '-title');
    const [description] = readCopy(group + '-description');
    return `<article>${photo(number, '')}<div><h3 class="advantage-title">${title.join(' ')}</h3><p class="advantage-description">${description.join(' ')}</p></div></article>`;
  }).join('')}</div></section>
  <section id="small-services" class="flight-section"><h2>Выбери свой стиль полета</h2><div class="photo-grid plans">${plans.map((group, index) => {
    const [title] = readCopy(group + '-title');
    const [description] = readCopy(group + '-description');
    const [details] = readCopy(group + '-details');
    return `<article><h3>${title.join(' ')}</h3><p>${description.join(' ')}</p><p>${details.join('<br>')}</p><button type="button" class="pill" data-plan="${index + 1}">Записаться на полет</button></article>`;
  }).join('')}</div></section>
  <section id="small-gallery" class="flight-section"><h2>Моменты, которые остаются с тобой навсегда</h2><div class="photo-grid flight-gallery">${[3,4,5,6,7,8,9].map(n=>photo(n,'Полет на параплане')).join('')}</div></section>
  <section id="small-contact" class="flight-section"><h2>Контакты</h2><p>Мы всегда готовы ответить на ваши вопросы и помочь в организации полета.</p><div class="photo-grid contact-grid"><article class="contact-card">${photo(0,'')}<div><h3>Напишите нам</h3><p><a href="tel:+74958746021">+7 (495) 874-60-21</a></p><p><a href="mailto:paraplin@gmail.com">paraplin@gmail.com</a></p><p>Москва, ул. Ленина, д. 89, офис 12</p></div></article><article class="contact-form"><h3>Хочу летать</h3></article></div></section>
  <footer class="compact-footer"><div class="compact-grid">
    ${compactLogo}<nav aria-label="Навигация в подвале">${compactLinks}</nav>
    <a href="mailto:paraplin@gmail.com">Написать нам</a><a href="privacy.html">Политика конфиденциальности</a><a href="consent.html">Согласие на обработку персональных данных</a>
  </div></footer>`;
document.body.insertBefore(compact, dialog);
const compactForm = document.getElementById('booking').cloneNode(true);
compactForm.id = 'compact-booking';
compact.querySelector('.contact-form').append(compactForm);
for (const form of [document.getElementById('booking'), popup, compactForm]) configureBooking(form);
compact.querySelectorAll('[data-plan]').forEach(button => button.addEventListener('click', () => openBooking(Number(button.dataset.plan))));
const compactHeader = compact.querySelector('header');
const menuToggle = compact.querySelector('.menu-toggle');
const menu = document.createElement('dialog');
menu.id = 'flight-menu';
menu.className = 'flight-drawer';
menu.setAttribute('aria-label', 'Меню');
menu.innerHTML = `
  <div class="drawer-header">${compactLogo}<button class="drawer-close" type="button" aria-label="Закрыть меню" autofocus></button></div>
  <nav aria-label="Основное меню">${compactLinks}</nav>
  <div class="drawer-actions">${compactPhone}<button type="button" class="pill">Записаться на полет</button></div>`;
dialog.before(menu);
menuToggle.addEventListener('click', () => {
  menu.showModal();
  menuToggle.setAttribute('aria-expanded', 'true');
});
menu.addEventListener('close', () => menuToggle.setAttribute('aria-expanded', 'false'));
menu.querySelector('.drawer-close').addEventListener('click', () => menu.close());
menu.querySelectorAll('nav a').forEach(link => link.addEventListener('click', () => menu.close()));
menu.querySelector('.pill').addEventListener('click', () => {
  menu.close();
  openBooking();
});
menu.addEventListener('click', event => {
  if (event.target === menu && event.clientX < menu.getBoundingClientRect().left) menu.close();
});
new IntersectionObserver(([entry]) => {
  compactHeader.classList.toggle('is-scrolled', !entry.isIntersecting);
}).observe(compact.querySelector('.compact-hero'));
const compactScreen = matchMedia('(max-width: 1439px)');
function currentAnchor() {
  const id = location.hash.slice(1).replace(/^small-/, '');
  if (!['about','services','gallery','contact'].includes(id)) return;
  const target = document.getElementById((compactScreen.matches ? 'small-' : '') + id);
  if (target.id !== location.hash.slice(1)) {
    history.replaceState(null, '', '#' + target.id);
    target.scrollIntoView({behavior:'instant'});
  }
}
addEventListener('hashchange', currentAnchor);
compactScreen.addEventListener('change', () => {
  if (!compactScreen.matches && menu.open) menu.close();
  currentAnchor();
});
currentAnchor();
