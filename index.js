require('./src/json/pokemon.js');
require('./src/json/pokemon_species.js');
require('./src/json/pokemon_types.js');
require('./src/json/type_names.js');
require('./src/json/evolutions.js');
require('./src/json/evolution_triggers.js');
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
    if (pokemon.evolution) {
        pokemon.evolution = JSON.parse(JSON.stringify(pokemon.evolution));
        let evo_chain = []
        pokemon.evolution.forEach(element => {
            if (pokemon_species.find(specie => specie.id === element.evolves_from_species_id)) {
                element.evolves_from = pokemon_species.find(specie => specie.id === element.evolves_from_species_id);
                element.evolves_from = JSON.parse(JSON.stringify(element.evolves_from));

            }
            if (element.evolves_from) {
                element.evolves_from.details = evolutions.find(evo => evo.evolved_species_id === element.id);
                element.evolves_from.details = JSON.parse(JSON.stringify(element.evolves_from.details));
                element.evolves_from.details.evolution_trigger = evolution_triggers.find(trigger => trigger.id === element.evolves_from.details.evolution_trigger_id).identifier
                delete element.evolves_from.details.evolution_trigger_id
                Object.keys(element.evolves_from.details).forEach(key => {
                    if (!element.evolves_from.details[key]) delete element.evolves_from.details[key];
                });

            }
            element.types = pokemon_types.filter(
                type => type.pokemon_id === element.id
            );
            element.types = element.types.map(
                type => type_names.find(name => type.type_id === name.id).identifier
            );
            evo_chain.push(element)
        });
        evo_chain = evo_chain.slice(1);
        pokemon.evolution = evo_chain;
    }
});
let teste = []
pokemons.forEach(pokemon => {
    var obj = {};
    obj.id = pokemon.id;
    obj.number =('00' + pokemon.id).slice(-3),
    obj.name = pokemon.identifier;
    obj.type = pokemon.types;
    obj.evolution = pokemon.evolution ? pokemon.evolution.map(({ id, identifier, evolves_from, generation_id }) =>
        ({
            id,
            name: identifier,
            number: ('00' + id).slice(-3),
            generation: generation_id,
            evolves_from: evolves_from ? {
                id: evolves_from.id,
                details: evolves_from.details
            } : ''
        })) : ''
    teste.push(obj)
})
const formatted = JSON.stringify(teste, null, 4);

fs.writeFile('Output.txt', formatted, (err) => {
    if (err) throw err;
}) 