$(function () {
  // Detect RTL from <html lang="">
  var lang = document.documentElement.lang.toLowerCase();
  var isRTL = lang.startsWith("ar") || lang === "fa" || lang === "he"; // Arabic, Persian, Hebrew

  let owl = $(".services-owl");

  owl.owlCarousel({
    loop: true,
    margin: 10,
    nav: false,
    rtl: isRTL,
    stagePadding: 100,
    responsive: {
      0: {
        items: 1,
        stagePadding: 40,
      },
      768: {
        items: 2,
        stagePadding: 60,
      },
      1200: {
        items: 3,
        stagePadding: 100,
      },
      1400: {
        items: 4,
        stagePadding: 100,
      },
    },
  });
});
