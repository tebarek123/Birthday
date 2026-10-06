const gameArea = document.querySelector('#game-area');
        const birthdayButton = document.querySelector('#birthday-button');
        const triesLabel = document.querySelector('#tries');
        const confirmationStep = document.querySelector('#confirmation-step');
        const card = document.querySelector('#card');
        const cardPhotoGrid = document.querySelector('#card-photo-grid');
        const confetti = document.querySelector('#confetti');
        const photoInput = document.querySelector('#photo-input');
        const photoPreview = document.querySelector('#photo-preview');
        const photoStatus = document.querySelector('#photo-status');
        const featuredPhoto = document.querySelector('#featured-photo');
        const heartPlaceholder = document.querySelector('#heart-placeholder');
        const colors = ['#ef765d', '#f4bd58', '#75a98e', '#162b28', '#e7a9a0'];
        let attempts = 0;
        let selectedPhotos = [];

        function clearPhotoPreviews() {
            selectedPhotos.forEach((photo) => URL.revokeObjectURL(photo.url));
            selectedPhotos = [];
            photoPreview.replaceChildren();
            featuredPhoto.removeAttribute('src');
            featuredPhoto.hidden = true;
            heartPlaceholder.hidden = false;
        }

        photoInput.addEventListener('change', () => {
            clearPhotoPreviews();
            const images = Array.from(photoInput.files).filter((file) => file.type.startsWith('image/'));
            selectedPhotos = images.slice(0, 12).map((file) => ({
                file,
                url: URL.createObjectURL(file)
            }));

            attempts = 0;
            birthdayButton.disabled = false;
            birthdayButton.textContent = 'Confirm photos';
            triesLabel.textContent = 'Attempts: 0 of 3';
            confirmationStep.hidden = selectedPhotos.length === 0;

            selectedPhotos.forEach(({ file, url }) => {
                const image = document.createElement('img');
                image.src = url;
                image.alt = file.name;
                photoPreview.appendChild(image);
            });

            if (selectedPhotos.length) {
                featuredPhoto.src = selectedPhotos[0].url;
                featuredPhoto.alt = selectedPhotos[0].file.name;
                featuredPhoto.hidden = false;
                heartPlaceholder.hidden = true;
            }

            if (images.length > 12) {
                photoStatus.textContent = 'Showing the first 12 photos. Choose fewer to change your selection.';
            } else {
                photoStatus.textContent = selectedPhotos.length
                    ? `${selectedPhotos.length} photo${selectedPhotos.length === 1 ? '' : 's'} ready. Catch the button below to confirm.`
                    : 'Your photos stay on this device. Choose them to begin.';
            }
        });

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
            cardPhotoGrid.replaceChildren();
            cardPhotoGrid.classList.toggle('is-single', selectedPhotos.length === 1);
            selectedPhotos.forEach(({ file, url }) => {
                const image = document.createElement('img');
                image.src = url;
                image.alt = file.name;
                cardPhotoGrid.appendChild(image);
            });
            card.classList.add('is-open');
            card.setAttribute('aria-hidden', 'false');
            document.querySelector('#close-card').focus();
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
            if (!selectedPhotos.length) return;
            attempts += 1;
            triesLabel.textContent = `Attempts: ${attempts} of 3`;

            if (attempts === 3) {
                birthdayButton.disabled = true;
                birthdayButton.textContent = 'Photos confirmed!';
                setTimeout(openCard, 450);
                return;
            }

            moveButton();
        });

        function closeCard() {
            card.classList.remove('is-open');
            card.setAttribute('aria-hidden', 'true');
            photoInput.focus();
        }

        document.querySelector('#close-card').addEventListener('click', closeCard);
        card.addEventListener('click', (event) => {
            if (event.target === card) closeCard();
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                if (card.classList.contains('is-open')) closeCard();
            }
        });

        window.addEventListener('beforeunload', clearPhotoPreviews);