const bookingMarkup = `<dialog class="booking-dialog" aria-labelledby="dialog-title"><form id="popup-booking"><button type="button" class="close" aria-label="Закрыть">×</button><h2 id="dialog-title">Записаться на полет</h2><p id="flight"></p><label>Ваше имя<input name="name" autocomplete="name" required></label><label>Телефон<input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+7 (999) 999-99-99" required></label><label class="check"><input type="checkbox" required><span>Я даю <a href="consent.html">согласие на обработку персональных данных</a> и ознакомлен с <a href="privacy.html">политикой конфиденциальности</a></span></label><button class="pill" type="submit">Записаться на полет</button><p class="result" role="status"></p></form></dialog>`;

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

const homeHero = document.querySelector('.hero-image');
const homeLink = homeHero ? '' : './';
const compactScreen = matchMedia('(max-width: 1439px)');
const sections = [
  ['about', 'О нас'],
  ['services', 'Услуги'],
  ['contact', 'Контакты'],
  ['gallery', 'Галерея']
];
const brandLink = '<a class="site-brand" href="./">PARAPLIN</a>';
const phoneLink = '<a class="nav-phone" href="tel:+74997655645">+7 499 765 56 45</a>';
const legalLinks = `
  <a href="privacy.html">Политика конфиденциальности</a>
  <a href="consent.html">Согласие на обработку персональных данных</a>`;

function sectionLinks(links, prefix = '') {
  return links.map(([id, text]) => `<a href="${homeLink}#${prefix}${id}">${text}</a>`).join('');
}

document.body.insertAdjacentHTML('afterbegin', `
  <header class="desktop-header">
    <div class="desktop-nav-frame">
      <nav class="flight-nav" aria-label="Основное меню">
        ${brandLink}<div>${sectionLinks(sections)}</div>${phoneLink}
      </nav>
    </div>
  </header>
  <header class="mobile-header${homeHero ? '' : ' is-scrolled'}">
    <div class="compact-grid compact-nav">
      ${brandLink}
      <button class="menu-toggle" type="button" aria-label="Открыть меню" aria-expanded="false" aria-haspopup="dialog" aria-controls="flight-menu">
        <span></span><span></span>
      </button>
    </div>
  </header>`);

const footer = document.createElement('footer');
footer.className = 'site-footer';
footer.innerHTML = `
  <div class="desktop-footer">
    <div class="desktop-footer-grid">
      ${brandLink}
      <nav aria-label="Навигация в подвале">${sectionLinks(sections.slice(0, 3))}</nav>
      <div class="footer-legal">${legalLinks}</div>
      <a class="pill footer-cta" href="mailto:paraplin@gmail.com">Написать нам</a>
    </div>
  </div>
  <div class="compact-footer"><div class="compact-grid">
    ${brandLink}
    <nav aria-label="Навигация в подвале">${sectionLinks(sections, 'small-')}</nav>
    <a href="mailto:paraplin@gmail.com">Написать нам</a>
    ${legalLinks}
  </div></div>`;
document.body.append(footer);

document.body.insertAdjacentHTML('beforeend', bookingMarkup);
const bookingDialog = document.querySelector('.booking-dialog');
const popup = document.getElementById('popup-booking');
const flightNames = ['', 'Полет для новичков', 'Экстрим-полет'];

function openBooking(index = 0) {
  popup.reset();
  popup.elements.phone.setCustomValidity('');
  document.getElementById('flight').textContent = flightNames[index];
  popup.querySelector('.result').replaceChildren();
  bookingDialog.showModal();
}

configureBooking(popup);
bookingDialog.querySelector('.close').addEventListener('click', () => bookingDialog.close());
bookingDialog.addEventListener('click', event => {
  if (event.target === bookingDialog) bookingDialog.close();
});

const desktopHeader = document.querySelector('.desktop-header');
const mobileHeader = document.querySelector('.mobile-header');
if (homeHero) {
  const sticky = desktopHeader.cloneNode(true);
  sticky.className = 'flight-sticky';
  sticky.inert = true;
  desktopHeader.after(sticky);
  new IntersectionObserver(([entry]) => {
    const visible = !entry.isIntersecting;
    sticky.classList.toggle('is-visible', visible);
    sticky.inert = !visible;
    desktopHeader.inert = visible;
  }).observe(homeHero);

}

const menuToggle = mobileHeader.querySelector('.menu-toggle');
const menu = document.createElement('dialog');
menu.id = 'flight-menu';
menu.className = 'flight-drawer';
menu.setAttribute('aria-label', 'Меню');
menu.innerHTML = `
  <div class="drawer-header">
    ${brandLink}<button class="drawer-close" type="button" aria-label="Закрыть меню" autofocus></button>
  </div>
  <nav aria-label="Основное меню">${sectionLinks(sections, 'small-')}</nav>
  <div class="drawer-actions">${phoneLink}<button type="button" class="pill">Записаться на полет</button></div>`;
bookingDialog.before(menu);

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
compactScreen.addEventListener('change', () => {
  if (!compactScreen.matches && menu.open) menu.close();
});
