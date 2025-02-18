document.addEventListener('DOMContentLoaded', function() {
    console.log('Calculator script geladen');
    
    // Basis elementen
    const calculator = document.getElementById('schadeCalculator');
    const stappen = {
        stap1: document.getElementById('stap1'),
        stap2: document.getElementById('stap2'),
        stap3: document.getElementById('stap3'),
        stap4: document.getElementById('stap4'),
        stap5: document.getElementById('stap5')
    };
    
    // Form elementen
    const elements = {
        ongevalType: document.getElementById('ongevalType'),
        ongevalDatum: document.getElementById('ongevalDatum'),
        letselErnst: document.getElementById('letselErnst'),
        werkSituatie: document.getElementById('werkSituatie'),
        inkomenVoor: document.getElementById('inkomenVoor'),
        inkomenVoorDetails: document.getElementById('inkomenVoorDetails'),
        arbeidsongeschikt: document.getElementById('arbeidsongeschikt'),
        berekenButton: document.getElementById('berekenButton'),
        resultaatDiv: document.getElementById('calculatorResult')
    };

    // Event Listeners voor stapsgewijze weergave
    elements.ongevalType.addEventListener('change', function() {
        if (this.value) {
            stappen.stap2.style.display = 'block';
            resetVolgendeStappen(2);
        }
    });

    elements.ongevalDatum.addEventListener('change', function() {
        if (this.value) {
            stappen.stap3.style.display = 'block';
            resetVolgendeStappen(3);
        }
    });

    elements.letselErnst.addEventListener('change', function() {
        if (this.value) {
            stappen.stap4.style.display = 'block';
            resetVolgendeStappen(4);
        }
    });

    elements.werkSituatie.addEventListener('change', function() {
        const toonInkomen = ['loondienst', 'zelfstandig'].includes(this.value);
        elements.inkomenVoorDetails.style.display = toonInkomen ? 'block' : 'none';
        if (this.value) {
            stappen.stap5.style.display = 'block';
            elements.berekenButton.style.display = 'block';
        }
    });

    // Reset functie voor volgende stappen
    function resetVolgendeStappen(huidigeStap) {
        for (let i = huidigeStap + 1; i <= 5; i++) {
            if (stappen[`stap${i}`]) {
                stappen[`stap${i}`].style.display = 'none';
            }
        }
        elements.berekenButton.style.display = 'none';
        elements.resultaatDiv.style.display = 'none';
    }

    // Berekeningsfunctie
    function berekenSchadevergoeding() {
        let basisBedrag = 0;
        let inkomensschade = 0;
        let extraKosten = 0;

        // Basis letselschade
        switch(elements.letselErnst.value) {
            case 'licht': basisBedrag = 2000; break;
            case 'matig': basisBedrag = 7500; break;
            case 'zwaar': basisBedrag = 20000; break;
            case 'blijvend': basisBedrag = 40000; break;
        }

        // Verbeterde inkomensschade berekening
        if (['loondienst', 'zelfstandig'].includes(elements.werkSituatie.value)) {
            let maandinkomen = 0;
            // Bepaal maandinkomen
            switch(elements.inkomenVoor.value) {
                case '0-1000': maandinkomen = 1000; break;
                case '1000-2000': maandinkomen = 1500; break;
                case '2000-3000': maandinkomen = 2500; break;
                case '3000-4000': maandinkomen = 3500; break;
                case '4000-5000': maandinkomen = 4500; break;
                case '5000+': maandinkomen = 6000; break;
                default: maandinkomen = 0;
            }

            // Bereken inkomensschade op basis van arbeidsongeschiktheid
            if (elements.arbeidsongeschikt.value !== 'nee' && maandinkomen > 0) {
                let duurFactor = 0;
                let verliesPercentage = 0;

                // Bepaal duur factor
                switch(elements.arbeidsongeschikt.value) {
                    case 'tijdelijk':
                        switch(elements.ongevalDatum.value) {
                            case '0-2': duurFactor = 2; break;
                            case '2-6': duurFactor = 6; break;
                            case '6-12': duurFactor = 12; break;
                            case '12+': duurFactor = 18; break;
                            default: duurFactor = 6;
                        }
                        verliesPercentage = 0.7; // 70% verlies bij tijdelijke arbeidsongeschiktheid
                        break;
                    case 'blijvend':
                        duurFactor = 48; // 4 jaar vooruit berekenen bij blijvende arbeidsongeschiktheid
                        verliesPercentage = 0.85; // 85% verlies bij blijvende arbeidsongeschiktheid
                        break;
                }

                // Basis inkomensschade berekening
                inkomensschade = maandinkomen * duurFactor * verliesPercentage;

                // Extra factoren
                if (elements.werkSituatie.value === 'zelfstandig') {
                    inkomensschade *= 1.4; // 40% extra voor ZZP'ers vanwege gemiste opdrachten en doorlopende kosten
                }

                // Ernst van letsel factor
                switch(elements.letselErnst.value) {
                    case 'licht': inkomensschade *= 0.8; break;
                    case 'matig': inkomensschade *= 1.0; break;
                    case 'zwaar': inkomensschade *= 1.2; break;
                    case 'blijvend': inkomensschade *= 1.5; break;
                }
            }
        }

        // Extra kosten berekening
        const extraKostenInputs = document.querySelectorAll('input[name="extraKosten"]:checked');
        extraKostenInputs.forEach(input => {
            switch(input.value) {
                case 'medisch': extraKosten += 2500; break;
                case 'hulp': extraKosten += 3500; break;
                case 'vervoer': extraKosten += 2000; break;
                case 'aanpassingen': extraKosten += 5000; break;
            }
        });

        // Totale berekening
        const totaalBedrag = basisBedrag + inkomensschade + extraKosten;

        return {
            min: Math.floor(totaalBedrag * 0.8),
            max: Math.ceil(totaalBedrag * 1.2),
            smartengeld: Math.round(basisBedrag),
            inkomensschade: Math.round(inkomensschade),
            extraKosten: Math.round(extraKosten)
        };
    }

    // Form submit handler
    calculator.addEventListener('submit', function(e) {
        e.preventDefault();
        const bedragen = berekenSchadevergoeding();
        
        const resultContent = elements.resultaatDiv.querySelector('.result-content');
        resultContent.innerHTML = `
            <p class="result-range">
                Geschatte schadevergoeding: € ${bedragen.min.toLocaleString('nl-NL')} - € ${bedragen.max.toLocaleString('nl-NL')}
            </p>
            <div class="result-details">
                <p>Deze schatting is opgebouwd uit:</p>
                <ul>
                    <li>Smartengeld: € ${bedragen.smartengeld.toLocaleString('nl-NL')}</li>
                    <li>Inkomensschade: € ${bedragen.inkomensschade.toLocaleString('nl-NL')}</li>
                    <li>Extra kosten: € ${bedragen.extraKosten.toLocaleString('nl-NL')}</li>
                </ul>
                <p class="result-disclaimer">
                    * Dit is een indicatie. Het werkelijke bedrag kan afwijken en is afhankelijk van vele factoren.
                </p>
            </div>
        `;
        
        elements.resultaatDiv.style.display = 'block';
        elements.resultaatDiv.scrollIntoView({ behavior: 'smooth' });
    });
});