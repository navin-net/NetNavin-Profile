 document.getElementById('year').textContent = new Date().getFullYear();

  const burger = document.getElementById('burger');
  const navlinks = document.getElementById('navlinks');
  burger.addEventListener('click', () => navlinks.classList.toggle('open'));
  navlinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navlinks.classList.remove('open')));

  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.navlinks a[href^="#"]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 130) current = sec.getAttribute('id'); });
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
  });

  document.querySelectorAll('.filter-tabs button').forEach(btn=>{
    btn.addEventListener('click', function(){
      document.querySelectorAll('.filter-tabs button').forEach(b=>b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  document.getElementById('contactForm').addEventListener('submit', function(e){
    e.preventDefault();
    const btn = this.querySelector('button');
    const original = btn.textContent;
    btn.textContent = '✓ Message Sent';
    this.reset();
    setTimeout(()=>btn.textContent = original, 2500);
  });

  document.getElementById('downloadCv').addEventListener('click', function(e){
    e.preventDefault();
    alert('Add your CV file link here (e.g. href="cv.pdf" download).');
  });