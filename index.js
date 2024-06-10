import express from "express"
import fs from 'fs'
import path from "path"

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(express.json())

app.get('/',(req,res)=>{
    const filepPath = path.resolve("index.html")
    res.sendFile(filepPath)
})

//listar
app.get("/canciones", (req, res) => {
    const canciones = JSON.parse(fs.readFileSync('./repertorio.json','utf-8'))
    res.json(canciones)
})

// agregar
app.post("/canciones", (req, res) => {
    try{
        const {id,titulo,artista,tono} = req.body
        const nva_cancion = {id,titulo,artista,tono}
        const canciones = JSON.parse(fs.readFileSync('./repertorio.json','utf-8'))
        if (!nva_cancion.titulo || !nva_cancion.artista || !nva_cancion.tono || !nva_cancion.titulo){
            return res.status(401).json({message:'Falta llenar algún dato para ingresar la canción'})
            //return console.log('Falta llenar algún dato para ingresar la canción')
        }
        const existe = canciones.some((cancion) => cancion.id ==nva_cancion.id)
        if (existe){
            console.log('ya existe lo que quiere ingresar')
        }
        canciones.push(nva_cancion)
        fs.writeFileSync('./repertorio.json',JSON.stringify(canciones))
        res.send("Datos guardados")
    } catch(error) {
        console.log('error', error)
    }

})

// eliminar
app.delete("/canciones", (req, res) => {
    try{
        const { id } = req.query
        const canciones = JSON.parse(fs.readFileSync('./repertorio.json','utf-8'))
        const index = canciones.findIndex(p => p.id.toString() == id)
        canciones.splice(index, 1)
        fs.writeFileSync('./repertorio.json',JSON.stringify(canciones))
        res.send("Canción eliminada")
    } catch(error) {
        console.log('error', error)
    }

})

//modificar
app.put("/canciones/:id", (req, res) => {
    try{
        const { id } = req.params
        const cancion = req.body
        const canciones = JSON.parse(fs.readFileSync('./repertorio.json','utf-8'))
        const index = canciones.findIndex(p => p.id == id)
        console.log(cancion)
        canciones[index] = cancion
        fs.writeFileSync('./repertorio.json',JSON.stringify(canciones))
        res.send("Canción modificada exitosamente")
    } catch(error) {
        console.log('error', error)
    }
})


app.listen(PORT, () => {console.log("¡Servidor encendido!")})

export default app
