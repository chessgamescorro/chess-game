let selected = null

gameBoard.addEventListener('click', e => {
  const square = e.target.closest('.square')
  const piece = e.target.closest('.piece')

  if (!selected) {
    selected = piece                       // first click: pick up (null if empty square)
  } else {
    const target = square.querySelector('.piece')
    if (target !== selected) target?.remove()  // capture whatever is there
    square.append(selected)                // second click: put down
    selected = null
  }
})
