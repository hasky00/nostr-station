(() => {
  const buttons = Array.from(document.querySelectorAll('[data-filter]'));
  const services = Array.from(document.querySelectorAll('[data-scope]'));

  for (const button of buttons) {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;

      for (const candidate of buttons) {
        const selected = candidate === button;
        candidate.classList.toggle('active', selected);
        candidate.setAttribute('aria-pressed', selected ? 'true' : 'false');
      }

      for (const service of services) {
        service.hidden = filter !== 'all' && service.dataset.scope !== filter;
      }
    });
  }
})();
