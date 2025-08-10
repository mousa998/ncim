$(function () {
  // Detect RTL from <html lang="">
  var lang = document.documentElement.lang.toLowerCase();
  var isRTL = lang.startsWith("ar") || lang === "fa" || lang === "he"; // Arabic, Persian, Hebrew

  let owl = $(".partners-carousel");

  owl.owlCarousel({
    loop: true,
    margin: 20,
    nav: false,
    autoplay: true,
    autoplayTimeout: 2500,
    autoplayHoverPause: true,
    rtl: isRTL,
    responsive: {
      0: { items: 2 },
      576: { items: 3 },
      768: { items: 4 },
      992: { items: 5 },
      1200: { items: 6 },
    },
  });

  // Update button state
  function updateNavButtons() {
    var info = owl.data("owl.carousel");
    $(".prev-btn").toggleClass("disabled", info.current() === 0);
    $(".next-btn").toggleClass(
      "disabled",
      info.current() === info.items().length - info.settings.items
    );
  }

  updateNavButtons();

  owl.on("changed.owl.carousel", function () {
    updateNavButtons();
  });

  $(".next-btn").on("click", function () {
    owl.trigger("next.owl.carousel");
  });

  $(".prev-btn").on("click", function () {
    owl.trigger("prev.owl.carousel");
  });
});
