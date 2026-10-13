      if (index <= 15) {
        square.querySelector('svg').classList.add('black')
      } else if (index >= 48) {
        square.querySelector('svg').classList.add('white')
      }


css
  .white {
      fill: white;

  }
  .black {
      fill: black;
      outline: white;
      outline-offset: -2px;
  }
