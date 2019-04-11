window.onload = function() {
  let selector = document.getElementById("selector"),
    changer = document.getElementById("changer"),
    rh4 = document.getElementById("rh4");
  changer.onchange = function(e) {
    rh4.parentId = changer.value;
  };
  selector.removeAttribute("hidden");
};
