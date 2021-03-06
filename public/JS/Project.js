searchForm = document.querySelector('.search-form');

document.querySelector('#search-btn').onclick = () => {
  searchForm.classList.toggle('active');
}

// window.onscroll = () => {

//   searchForm.classList.remove('active');

//   if (window.scrollY > 80) {
//     document.querySelector('.header .header-2').classList.add('active');
//   } else {
//     document.querySelector('.header .header-2').classList.remove('active');
//   }

// }



window.onload = () => {

  if (window.scrollY > 80) {
    document.querySelector('.header .header-2').classList.add('active');
  } else {
    document.querySelector('.header .header-2').classList.remove('active');
  }

  const addcart=document.getElementsByClassName('addcart');
  if(addcart)
  {
    for(let i=0;i<addcart.length;i++)
    {
      addcart[i].addEventListener('click', async (e) => {
        console.log(e.target.getAttribute("iddata"));
        const rawResponse = await fetch('http://localhost:4000/addtocart', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ productid: e.target.getAttribute("iddata") })
        })
        window.location.reload();
      })
    }
  }


  fadeOut();

}

function loader() {
  document.querySelector('.loader-container').classList.add('active');
}

function fadeOut() {
  setTimeout(loader, 2000);
}

var swiper = new Swiper(".image-slider", {
  loop: true,
  centeredSlides: true,
  autoplay: {
    delay: 6500,
    disableOnInteraction: false,
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 1,
    },
    1024: {
      slidesPerView: 1,
    },
  },
});

var swiper = new Swiper(".featured-slider", {
  spaceBetween: 10,
  loop: true,
  centeredSlides: true,
  autoplay: {
    delay: 8500,
    disableOnInteraction: false,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    450: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 3,
    },
    1024: {
      slidesPerView: 4,
    },
  },
});



var swiper = new Swiper(".reviews-slider", {
  spaceBetween: 10,
  grabCursor: true,
  loop: true,
  centeredSlides: true,
  autoplay: {
    delay: 4500,
    disableOnInteraction: false,
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

