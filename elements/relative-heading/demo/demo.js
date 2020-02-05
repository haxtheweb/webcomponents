window.onload = function() {
  let changer = document.getElementById("changer"),
    changer2 = document.getElementById("changer2"),
    changer3 = document.getElementById("changer3"),
    sapien = document.getElementById("sapien"),
    volutpat = document.getElementById("volutpat"),
    remover = document.getElementById("remover"),
    lorem = document.getElementById("lorem"),
    praesent = document.getElementById("praesent"),
    p = lorem.nextElementSibling,
    randomHeading = () => {
      let h = Math.floor(Math.random() * Math.floor(6)),
        options = [
          "aliquam",
          "justo",
          "nec",
          "iaculis",
          "viverra",
          "dignissim"
        ],
        text = options[Math.floor(Math.random() * Math.floor(5))],
        tag = h > 0 ? `h${h}` : "p";
      return `<${tag}>Praesent ${text}</${tag}>`;
    };

  changer.onchange = e => {
    console.log("change", sapien, sapien.parent, changer.value);
    sapien.parent = changer.value;
    console.log("change 2", sapien, sapien.parent, changer.value);
  };
  changer2.onchange = e => (volutpat.parent = changer2.value);
  changer3.onclick = e => (praesent.innerHTML = randomHeading());
  remover.onclick = e => {
    if (remover.innerHTML === "Remove lorem") {
      lorem.remove();
      p.remove();
      remover.innerHTML = "Add lorem";
    } else {
      praesent.parentNode.insertBefore(lorem, praesent);
      praesent.parentNode.insertBefore(p, praesent);
      remover.innerHTML = "Remove lorem";
    }
  };
};
