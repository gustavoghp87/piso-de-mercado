export let server:string

const local = true

if (local) server = 'http://localhost:3000'
else server = 'https://piso-de-mercado-restful.herokuapp.com'

console.log(server)
