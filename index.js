require('./src/json/pokemon.js');
require('./src/json/pokemon_species.js');
require('./src/json/pokemon_types.js');
require('./src/json/type_names.js');
require('./src/json/evolutions.js');
const fs = require('fs') 

pokemons.map(pokemon => {
    pokemon.specie = pokemon_species.find(spec => spec.id === pokemon.id);
    pokemon.types = pokemon_types.filter(
      type => type.pokemon_id === pokemon.id
    );
    pokemon.types = pokemon.types.map(
      type => type_names.find(name => type.type_id === name.id).identifier
    );

    pokemon.specie
      ? (pokemon.evolution = pokemon_species.filter(specie => 
          specie.evolution_chain_id === pokemon.specie.evolution_chain_id)
           )
      : "";
  if(pokemon.evolution){
    let evo_chain = []
    pokemon.evolution.forEach(element => {
      if(pokemon_species.find(specie=> specie.id === element.evolves_from_species_id)){
        element.evolves_from = pokemon_species.find(specie=> specie.id === element.evolves_from_species_id);
      }
      if(element.evolves_from){
       element.evolves_from.details = evolutions.find(evo => evo.evolved_species_id === element.id);
      }
      evo_chain.push(element)
    });
    pokemon.evolution = evo_chain;
  }
  });

  const formatted = JSON.stringify(pokemons, null, 4);

fs.writeFile('Output.txt',formatted , (err) => { 
    if (err) throw err; 
}) 