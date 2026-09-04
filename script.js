const gameArea = document.querySelector('#game-area');
        const birthdayButton = document.querySelector('#birthday-button');
        const triesLabel = document.querySelector('#tries');
        const card = document.querySelector('#card');
        const confetti = document.querySelector('#confetti');
        const colors = ['#ef765d', '#f4bd58', '#75a98e', '#162b28', '#e7a9a0'];
        let attempts = 0;

        function celebrate() {
            confetti.innerHTML = '';
            for (let index = 0; index < 70; index += 1) {
                const piece = document.createElement('i');
                piece.className = 'piece';
                piece.style.left = `${Math.random() * 100}%`;
                piece.style.background = colors[index % colors.length];
                piece.style.animationDelay = `${Math.random() * 0.7}s`;
                piece.style.setProperty('--drift', `${(Math.random() - 0.5) * 240}px`);
                piece.style.transform = `rotate(${Math.random() * 180}deg)`;
                confetti.appendChild(piece);
            }
        }

        function openCard() {
            card.classList.add('is-open');
            card.setAttribute('aria-hidden', 'false');
            celebrate();
        }

        function moveButton() {
            const buttonWidth = birthdayButton.offsetWidth;
            const buttonHeight = birthdayButton.offsetHeight;
            const maxX = gameArea.clientWidth - buttonWidth - 18;
            const maxY = gameArea.clientHeight - buttonHeight - 18;
            birthdayButton.style.left = `${18 + Math.random() * Math.max(maxX - 18, 0)}px`;
            birthdayButton.style.top = `${18 + Math.random() * Math.max(maxY - 18, 0)}px`;
            birthdayButton.style.transform = 'none';
        }

        birthdayButton.addEventListener('click', () => {
            attempts += 1;
            triesLabel.textContent = `Attempts: ${attempts} of 3`;

            if (attempts === 3) {
                birthdayButton.disabled = true;
                birthdayButton.textContent = 'You found it!';
                setTimeout(openCard, 450);
                return;
            }

            moveButton();
        });

        document.querySelector('#close-card').addEventListener('click', () => {
            card.classList.remove('is-open');
            card.setAttribute('aria-hidden', 'true');
        });
        card.addEventListener('click', (event) => {
            if (event.target === card) {
                card.classList.remove('is-open');
                card.setAttribute('aria-hidden', 'true');
            }
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                card.classList.remove('is-open');
                card.setAttribute('aria-hidden', 'true');
            }
        });