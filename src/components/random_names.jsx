// RandomNames(#) : generate random names for # people without duplicates
const RandomNames = (num) => {
    const names = [
        "Tiger",
        "Wombat",
        "Opposum",
        "Dingo",
        "Stallion",
        "Jaguar",
        "Mustang",
        "Armadillo",
        "Camel",
        "Badger",
        "Addax",
        "Steer",
        "Lamb",
        "Snake",
        "Hamster",
        "Squirrel",
        "Hyena",
        "Fish",
        "Gazelle",
        "Dog",
        "Zebra",
        "Rat",
        "Mole",
        "Canary",
        "Ferret",
        "Impala",
        "Mare",
        "Hedgehog",
        "Nyancat",
        "Nupjuk"
    ]

    function randomNoRepeats(array) {
        var copy = array.slice(0);
        return function() {
          if (copy.length < 1) { copy = array.slice(0); }
          var index = Math.floor(Math.random() * copy.length);
          var item = copy[index];
          copy.splice(index, 1);
          return item;
        };
    }

    var uniqueNames = [];
    const newName = randomNoRepeats(names);
    for (var i=0; i<num; i++) {
        uniqueNames.push(newName());
    }

    return uniqueNames;
}

export default RandomNames