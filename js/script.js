      // Generate floating dust particles in the spotlight
        function createDust() {
            const spotlight = document.querySelector('.spotlight');
            const dust = document.createElement('div');
            dust.className = 'dust';
            
            // Random position within spotlight cone
            const left = 45 + Math.random() * 10;
            const delay = Math.random() * 3;
            const duration = 4 + Math.random() * 4;
            const size = 2 + Math.random() * 3;
            
            dust.style.left = left + '%';
            dust.style.bottom = '20vh';
            dust.style.width = size + 'px';
            dust.style.height = size + 'px';
            dust.style.animation = `float ${duration}s linear ${delay}s infinite`;
            
            spotlight.appendChild(dust);
        }

        // Create 20 dust particles
        for (let i = 0; i < 20; i++) {
            createDust();
        }

        // Optional: subtle mouse parallax on the spotlight
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const spotlight = document.querySelector('.spotlight');
            spotlight.style.transform = `translateX(calc(-50% + ${x}px))`;
        });
  