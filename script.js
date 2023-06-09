function createSlider() {
    const sliderContainer = document.querySelector('.slider-container');
    const slider = document.querySelector('.slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let slideWidth = 200;
    let slideCount = 4;
    let slidePerView = 4;
    let currentIndex = 0;
    let slidesData = [];
    let intervalId;

    const scrollBar = document.querySelector('.scroll-bar');
    const scrollThumb = document.querySelector('.scroll-thumb');

    function getSlidesData() {
        fetch('./source.json')
            .then(response => response.json())
            .then(data => {
                slidesData = data;
                slideCount = slidesData.length;
                createSlides();
                updateScrollThumbPosition();
            })
            .catch(error => console.log(error));
    }

    function createSlides() {
        const start = currentIndex;
        const end = currentIndex + slidePerView;
        const slicedSlidesData = slidesData.slice(start, end);

        slider.innerHTML = '';
        slicedSlidesData.forEach((slideData, index) => {
            const slide = document.createElement('div');
            slide.className = 'slide';
            slide.innerHTML = `
        <img src="./img/Фото.jpg" alt="photo" />
        <div class="slide_data"><p>${slideData.dataTime}</p></div>
        <div class="slide_title dynamic-height"><p>${slideData.title}</p></div>
        <div class="slide_description"><p>${slideData.description}</p></div>
      `;
            if (index === slidePerView - 1) {
                slide.classList.add('active');
            }
            slider.appendChild(slide);

            setTimeout(() => {
                slide.classList.add('active');
            }, 0);
        });

        setSlideTitleHeight();
    }

    function setSlideTitleHeight() {
        const slideTitleElements = document.querySelectorAll('.dynamic-height');
        let maxHeight = 0;

        slideTitleElements.forEach(element => {
            const slideTitleHeight = element.offsetHeight;
            if (slideTitleHeight > maxHeight) {
                maxHeight = slideTitleHeight;
            }
        });

        slideTitleElements.forEach(element => {
            element.style.height = `${maxHeight}px`;
        });
    }

    function prevSlide() {
        if (currentIndex > 0) {
            clearInterval(intervalId);
            prevBtn.style.backgroundColor = '#C8D9FB';
            currentIndex--;
            createSlides();
            setTimeout(() => {
                prevBtn.style.backgroundColor = '#FFFFFF';
            }, 300);
            avtoSlide();
            updateScrollThumbPosition();
        }
    }

    function nextSlide() {
        if (currentIndex < slideCount - slidePerView) {
            clearInterval(intervalId);
            nextBtn.style.backgroundColor = '#C8D9FB';
            currentIndex++;
            createSlides();
            setTimeout(() => {
                nextBtn.style.backgroundColor = '#FFFFFF';
            }, 300);
            avtoSlide();
            updateScrollThumbPosition();
        }
    }

    function getTallestSlideHeight() {
        let maxHeight = 0;
        slidesData.forEach(slideData => {
            const slide = document.createElement('div');
            slide.className = 'slide';
            slide.innerHTML = `
        <img src="./img/Фото.jpg" alt="photo" />
        <div class="slide_data"><p>${slideData.dataTime}</p></div>
        <div class="slide_title"><p>${slideData.title}</p></div>
        <div class="slide_description"><p>${slideData.description}</p></div>
      `;
            slide.style.visibility = 'hidden';
            document.body.appendChild(slide);
            const slideHeight = slide.clientHeight;
            if (slideHeight > maxHeight) {
                maxHeight = slideHeight;
            }
            document.body.removeChild(slide);
        });
        return maxHeight;
    }

    function updateScrollThumbPosition() {
        const totalSlides = slidesData.length;
        const visibleSlides = slidePerView;
        const scrollBarWidth = scrollBar.offsetWidth;
        const scrollThumbWidth = scrollThumb.offsetWidth;
        const maxThumbPosition = scrollBarWidth - scrollThumbWidth;
        const thumbPosition = (currentIndex / (totalSlides - visibleSlides)) * maxThumbPosition;

        scrollThumb.style.transform = `translateX(${thumbPosition}px)`;
    }

    function avtoSlide() {
        if (slideCount >= slidesData.length) {
            intervalId = setInterval(() => {
                nextSlide();
            }, 4000);
        }
    }

    function handleTouchStart(event) {
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
    }

    function handleTouchEnd(event) {
        const endX = event.changedTouches[0].clientX;
        const endY = event.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    slider.addEventListener('touchstart', handleTouchStart);
    slider.addEventListener('touchend', handleTouchEnd);

    getSlidesData();
    const maxHeight = getTallestSlideHeight();
    avtoSlide();
}

createSlider();
