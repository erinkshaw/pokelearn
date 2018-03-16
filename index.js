(function onLoad() {
  let pokemon = []
  let matches
  const searchInput = document.querySelector('.search');
  const searchForm = document.querySelector('.search-form');
  const suggestions = document.querySelector('#suggestions');

  fetch('poke.json')
    .then(blob => blob.json())
    .then(poke => {
      pokemon = poke
      return poke
    })
    .then(poke => {
      const ul = poke.map(poke => {
        return `<li id=${poke.name}>${poke.name}</li>`
      }).join('')
      suggestions.innerHTML = ul;
    })

  function findMatches(wordToMatch, pokeArr) {
    return pokeArr.filter(pokemon => {
      const regex = new RegExp(wordToMatch, 'gi');
      return pokemon.name.match(regex)
    });
  }

  function findPoke() {
    if (!this.value) {
      document.querySelectorAll('ul li').forEach(li => li.removeAttribute('class'))
    }
    matches = findMatches(this.value, pokemon)
    document.querySelectorAll('ul li').forEach(li => {
      const isMatch = po => po.name === li.id
      if (!matches.find(isMatch)) li.setAttribute('class', 'hide')
      else if (matches.find(isMatch)) li.removeAttribute('class')
    })
  }

  function showPoke() {
    suggestions.removeAttribute('class')
  }

  function getPoke(e) {
    e.preventDefault()
    const insertPokeInfo = document.querySelector('#poke-info')
    const match = matches[0]
    const loading = `
      <div>
          <img src="img/pokeball.png" id="load"/>
          <p>Loading ${match.name}...
      </div>
    `
    insertPokeInfo.innerHTML = loading
    const apiUri = pokemon.find((poke) => match.name === poke.name).url
    fetch(apiUri)
    .then(blob => blob.json())
    .then(poke => {
      console.log(poke)
      const stats = poke.stats.map(stat => {
        return `
          <tr>
            <td>${stat.stat.name}<td>
            <td>${stat.effort}<td>
          <tr>
        `
      }).join('')
      const abilities = poke.abilities.map(ability => {
        if (ability.length) return `<li>${ability.ability.name}<li>`
        else return ''
      }).join('')
      const moves = poke.moves.map(move => `<option>${move.move.name}</option>`).join()
      const addPoke = `
      <div>
        <div>
          <img src="img/${poke.name}.png"/>
          <h1>${poke.name} (${poke.types[0].type.name})</h1>
        </div>
        <div>
        <h2>Moves</h2>
        <select>
          ${moves}
        </select>
        </div>
        <div>
        <h2>Abilities</h2>
        <ol>
          ${abilities}
        </ol>
        <div>
        <h2>Stats</h2>
        <table>
          ${stats}
        </table>
        </div>
        <div>
      </div>
      `
      insertPokeInfo.innerHTML = addPoke
    })
    .catch(console.error)
  }

  searchInput.addEventListener('click', showPoke);
  searchInput.addEventListener('change', findPoke);
  searchInput.addEventListener('keyup', findPoke);
  searchForm.addEventListener('submit', getPoke);
})()

