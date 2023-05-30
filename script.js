function createSlider() {
    const sliderContainer = document.querySelector('.slider-container');
    const slider = document.querySelector('.slider');
    const prevBtn = document.querySelector('.prev-btn');
    const prevImg = prevBtn.querySelector('img');
    const nextBtn = document.querySelector('.next-btn');
    const nextImg = nextBtn.querySelector('img');
    const scrollBar = document.querySelector('.scroll-bar');
    const scrollThumb = document.querySelector('.scroll-thumb');

    let slideWidth = 200;
    let slideCount = 0;
    let slidePerView = 4;
    let currentIndex = 0;
    let autoScrollInterval;
    let scrollBarWidth = 0;
    let thumbWidth = 0;

    function getSlidesData() {
        fetch('source.json')
            .then(response => response.json())
            .then(data => {
                slideCount = data.length;
                createSlides(data);
                updateScrollBar();
                autoSlide();
                calculateSliderHeight();
            })
            .catch(error => console.log(error));
    }

    function createSlides(slidesData) {
        slider.innerHTML = '';
        slidesData.forEach(slideData => {
            const slide = document.createElement('div');
            slide.className = 'slide';
            slide.innerHTML = `
        <img src="./img/Фото.jpg" alt="photo" />
        <h4>${slideData.dataTime}</h4>
        <h3>${slideData.title}</h3>
        <p>${slideData.description}</p>
      `;
            slider.appendChild(slide);
        });

        if (slideCount < slidePerView) {
            currentIndex = 0;
        } else if (currentIndex >= slideCount - slidePerView) {
            currentIndex = slideCount - slidePerView;
        }

        scrollToSlide(currentIndex);
    }

    function scrollToSlide(index) {
        const position = -index * slideWidth;
        slider.style.transform = `translateX(${position}px)`;
    }

    function prevSlide() {
        if (currentIndex > 0) {
            prevImg.src = './img/click-left.jpg';
            currentIndex--;
            scrollToSlide(currentIndex);
            updateScrollBar();
            setTimeout(()=>{
                prevImg.src = './img/arrow-left.jpg';
            },500);
        }
    }

    function nextSlide() {
        if (currentIndex < slideCount - slidePerView) {
            nextImg.src = './img/click-right.jpg';
            currentIndex++;
            scrollToSlide(currentIndex);
            updateScrollBar();
            setTimeout(()=>{
                nextImg.src = './img/arrow-right.jpg';
            },500);
        }
    }

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    function handleSwipeStart(event) {
        this.startX = event.touches[0].clientX;
        this.startY = event.touches[0].clientY;
    }

    function handleSwipeEnd(event) {
        const deltaX = event.changedTouches[0].clientX - this.startX;
        const deltaY = event.changedTouches[0].clientY - this.startY;
        const swipeThreshold = slideWidth * 0.2;

        if (Math.abs(deltaX) > swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        }
    }

    slider.addEventListener('touchstart', handleSwipeStart);
    slider.addEventListener('touchend', handleSwipeEnd);

    function autoSlide() {
        autoScrollInterval = setInterval(() => {
            nextSlide();
        }, 4000);
    }

    function resetAutoSlide() {
        clearInterval(autoScrollInterval);
        autoSlide();
    }

    sliderContainer.addEventListener('mouseenter', resetAutoSlide);
    sliderContainer.addEventListener('mouseleave', autoSlide);

    function updateScrollBar() {
        const scrollSize = document.querySelector('.scroll-size');
        scrollBarWidth = scrollSize.clientWidth;
        thumbWidth = (scrollBarWidth / slideCount) * slidePerView;
        scrollThumb.style.width = thumbWidth + 'px';
        scrollThumb.style.left = (currentIndex / slideCount) * (scrollBarWidth - thumbWidth) + 'px';
    }

    function scrollSlide(index) {
        currentIndex = index;
        scrollToSlide(currentIndex);
        updateScrollBar();
    }

    function handleThumbDrag(event) {
        event.preventDefault();

        const thumbPosition = event.clientX - scrollBar.getBoundingClientRect().left;
        const scrollPosition = (thumbPosition - thumbWidth / 2) / scrollBarWidth;

        currentIndex = Math.floor(scrollPosition * slideCount);
        currentIndex = Math.max(0, Math.min(currentIndex, slideCount - slidePerView));

        scrollToSlide(currentIndex);
        updateScrollBar();
    }

    scrollThumb.addEventListener('mousedown', () => {
        document.addEventListener('mousemove', handleThumbDrag);
    });

    document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', handleThumbDrag);
    });

    scrollThumb.addEventListener('touchstart', () => {
        document.addEventListener('touchmove', handleThumbDrag);
    });

    document.addEventListener('touchend', () => {
        document.removeEventListener('touchmove', handleThumbDrag);
    });

    function handleScrollBarClick(event) {
        const scrollPosition = event.clientX - scrollBar.getBoundingClientRect().left;
        const slideIndex = Math.floor((scrollPosition / scrollBarWidth) * slideCount);

        scrollSlide(slideIndex);
    }

    scrollBar.addEventListener('click', handleScrollBarClick);

    window.addEventListener('resize', calculateSliderHeight);

    function calculateSliderHeight() {
        const slides = document.querySelectorAll('.slide');
        let maxHeight = 0;

        slides.forEach(slide => {
            const slideHeight = slide.offsetHeight;
            if (slideHeight > maxHeight) {
                maxHeight = slideHeight;
            }
        });

        sliderContainer.style.height = maxHeight + 'px';
    }

    getSlidesData();
}

createSlider();
