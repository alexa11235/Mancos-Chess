export const players = {
  "Lalo Barajas": { 
    inicial: "L", 
    modalidad: ["Presencial sin carro", "En línea"], 
    disponibilidad: "Sábados y domingos; y entre semana podría empezar a las 7" 
  },
  "Carlos Imanol": { 
    inicial: "C", 
    modalidad: ["Presencial con carro", "En línea"], 
    disponibilidad: "Viernes, sábados y domingos después de las 5pm" 
  },
  "Fernando Vasquez": { 
    inicial: "F", 
    modalidad: ["Presencial con carro"], 
    disponibilidad: "Fines de semana, lunes o miercoles en la tarde noche." 
  },
  "Albert AA": { 
    inicial: "A", 
    modalidad: ["Presencial con carro"], 
    disponibilidad: "Domingos por la mañana" 
  },
  "Noé Santos": { 
    inicial: "N", 
    modalidad: ["Presencial con carro"], 
    disponibilidad: "Cualquier día por las tardes menos" 
  },
  "Diego Pérez": { 
    inicial: "D", 
    modalidad: ["Presencial con carro"], 
    disponibilidad: "Entre semana por la tarde" 
  },
  "Doc. Abraham": { 
    inicial: "Ab", 
    modalidad: ["Pendiente"], 
    disponibilidad: "Aún no contesta la encuesta" 
  },
  "Mike Alex": { 
    inicial: "M", 
    modalidad: ["Presencial con carro", "En línea", "Casa de Noé"], 
    disponibilidad: "Sabados y Domingos, Entre semana por las tardes pero preferiria que sea los findes" 
  },
  "Ferny Barreda": { 
    inicial: "Fe", 
    modalidad: ["Presencial con carro", "En línea"], 
    disponibilidad: "Sábados por la tarde y domingos por la mañana." 
  },
};

export const pairings = {
  "Ronda 1": [
    { white: "Lalo Barajas", black: "Carlos Imanol" },
    { white: "Fernando Vasquez", black: "Albert AA" },
    { white: "Noé Santos", black: "Diego Pérez" },
    { white: "Doc. Abraham", black: "Mike Alex" },
    { bye: "Ferny Barreda" }
  ],
  "Ronda 2": [
    { white: "Ferny Barreda", black: "Noé Santos" },
    { white: "Albert AA", black: "Lalo Barajas" },
    { white: "Diego Pérez", black: "Carlos Imanol" },
    { white: "Mike Alex", black: "Fernando Vasquez" },
    { bye: "Doc. Abraham" }
  ],
  "Ronda 3": [
    { white: "Carlos Imanol", black: "Ferny Barreda" },
    { white: "Noé Santos", black: "Doc. Abraham" },
    { white: "Lalo Barajas", black: "Diego Pérez" },
    { white: "Albert AA", black: "Mike Alex" },
    { bye: "Fernando Vasquez" }
  ],
  "Ronda 4": [
    { white: "Ferny Barreda", black: "Diego Pérez" },
    { white: "Doc. Abraham", black: "Carlos Imanol" },
    { white: "Noé Santos", black: "Fernando Vasquez" },
    { white: "Mike Alex", black: "Lalo Barajas" },
    { bye: "Albert AA" }
  ],
  "Ronda 5": [
    { white: "Lalo Barajas", black: "Ferny Barreda" },
    { white: "Diego Pérez", black: "Doc. Abraham" },
    { white: "Albert AA", black: "Noé Santos" },
    { white: "Carlos Imanol", black: "Fernando Vasquez" },
    { bye: "Mike Alex" }
  ],
  "Ronda 6": [
    { white: "Doc. Abraham", black: "Ferny Barreda" },
    { white: "Noé Santos", black: "Mike Alex" },
    { white: "Fernando Vasquez", black: "Diego Pérez" },
    { white: "Carlos Imanol", black: "Albert AA" },
    { bye: "Lalo Barajas" }
  ],
  "Ronda 7": [
    { white: "Lalo Barajas", black: "Doc. Abraham" },
    { white: "Ferny Barreda", black: "Fernando Vasquez" },
    { white: "Mike Alex", black: "Carlos Imanol" },
    { white: "Diego Pérez", black: "Albert AA" },
    { bye: "Noé Santos" }
  ],
  "Ronda 8": [
    { white: "Noé Santos", black: "Lalo Barajas" },
    { white: "Fernando Vasquez", black: "Doc. Abraham" },
    { white: "Albert AA", black: "Ferny Barreda" },
    { white: "Diego Pérez", black: "Mike Alex" },
    { bye: "Carlos Imanol" }
  ],
  "Ronda 9": [
    { white: "Lalo Barajas", black: "Fernando Vasquez" },
    { white: "Noé Santos", black: "Carlos Imanol" },
    { white: "Doc. Abraham", black: "Albert AA" },
    { white: "Ferny Barreda", black: "Mike Alex" },
    { bye: "Diego Pérez" }
  ]
};