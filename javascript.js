function selectPhase(element) {
    const cards = document.querySelectorAll('.phase-card');
    let foundActive = false;

    cards.forEach(card => {
        if (card === element) {
            card.className = 'phase-card active';
            foundActive = true;
        } else if (!foundActive) {
            card.className = 'phase-card completed';
        } else {
            card.className = 'phase-card';
        }
    });
}
