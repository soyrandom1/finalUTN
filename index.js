const express = require('express')

const passport = require('passport')
const cookieParser = require("cookie-parser")
const session = require('express-session')
const passportLocal = require('passport-local').Strategy

const Datastore = require('nedb')

const path = require('path')
const store = new session.MemoryStore()

var md5 = require('md5')

const configs = require('./common/Configurations.js')

const app = express()

const indexDB = new Datastore('index.db')
const linksDB = new Datastore('links.db')
const gamesDB = new Datastore('games.db')
const noticiasDB = new Datastore('noticias.db')
const whitelistDB = new Datastore('whitelist.db')

let secrets = require('./secrets')


app.listen(configs.PORT, () => console.log("listening at " + configs.PORT))

// testeo para posible migracion
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/public/views'));
//

app.use(express.static('public'))
app.use(express.json(configs.LIMIT))

app.use(express.urlencoded({
        extended: true
    })) // nos permite leer los datos enviados por un formulario

app.use(cookieParser(secrets.cookies())) // el hash deberia estar oculto por obvias razones. 
app.use(session({
        secret: secrets.session(), // el hash deberia estar oculto por obvias razones. 
        cookie: {
            maxAge: 100000
        },
        saveUninitialized: true, // Si esta true, si inicializamos una sesion en una peticion y no guardamos nada, igual se va a guardar
        store,
        resave: true, // Si la sesion no fue modificada, la vuelve a guardar
    }))
    // done primer parametro es el error
app.use(passport.initialize())
app.use(passport.session())

gamesDB.loadDatabase()
noticiasDB.loadDatabase()
indexDB.loadDatabase()
linksDB.loadDatabase()
whitelistDB.loadDatabase()

passport.use(new passportLocal(function(username, password, done) {
    whitelistDB.find({
        username: username
    }, (error, data) => {
        if (error) {
            done(error, false)
        }
        if (md5(password) === data[0].password) {
            return done(null, {
                id: data[0]._id,
                name: data[0].username
            })
        }
        done(null, false)
    })


}))

passport.serializeUser(function(user, done) {
    done(null, user.id)
})

passport.deserializeUser(function(id, done) {
    whitelistDB.find({
        _id: id
    }, (error, data) => {
        if (error) {
            done(error, false)
        }
        done(null, {
            id: data[0]._id,
            name: data[0].username
        })
    })

})


app.get('/', (request, response) => {
    responseManager(response, '../index')

})
app.get('/index', (request, response) => {
    responseManager(response, '../index')
})
app.get('/links', (request, response) => {
    responseManager(response, '../links')
})
app.get('/manifesto', (request, response) => {
    responseManager(response, '../manifesto')
})
app.get('/games', (request, response) => {
    responseManager(response, '../games')
})
app.get('/noticias', (request, response) => {
    responseManager(response, '../noticias')
})
app.get('/login', (request, response) => {
    response.render('login')
})

app.post('/login', passport.authenticate('local', {
    successRedirect: "index",
    failureRedirect: "login"
}))

app.post('/logout', (request, response) => {
    request.session.destroy()
    response.redirect("/index")
})

app.get('/api/index', (request, response) => {
    indexDB.find({}, (error, data) => {
        if (error) {
            response.end()
        }
        if (request.isAuthenticated()) {
            data.push({
                credential: 'true'
            })
        }
        response.json(data)
    })
})

app.get('/api/links', (request, response) => {
    linksDB.find({}, (error, data) => {
        if (error) {
            response.end()
        }
        if (request.isAuthenticated()) {
            data.push({
                credential: 'true'
            })
        }
        response.json(data)
    })
})

app.get('/api/noticias', (request, response) => {
    noticiasDB.find({}, (error, data) => {
        if (error) {
            response.end()
        }
        if (request.isAuthenticated()) {
            data.push({
                credential: 'true'
            })
        }
        response.json(data)
    })
})

app.get('/api/games', (request, response) => {
    gamesDB.find({}, (error, data) => {
        if (error) {
            response.end()
        }
        if (request.isAuthenticated()) {
            data.push({
                credential: 'true'
            })
        }
        response.json(data)
    })
})
app.post('/api/modals/index', (request, response) => {
    if (request.isAuthenticated()) {
        let data = request.body.content
        indexDB.update({
            identifier: data[1]
        }, {
            content: data[0],
            identifier: data[1]
        }, {}, function(err, numReplaced) {
            if (err) {
                console.error('Unexpected error at DB update')
            } else {
                console.log('Replaced: ', numReplaced)
            }
        })
    }
    response.redirect("/index")
})

app.post('/api/games/edit', (request, response) => {
    if (request.isAuthenticated()) {
        let data = request.body
        gamesDB.update({
            _id: data.gameId,
        }, {
            gameName: data.gameNameEdit,
            gameDescriptionLong: data.gameDescriptionLongEdit,
            gameDescriptionShort: data.gameDescriptionShortEdit,
            altFoto: data.altFotoEdit,
            gameLink: data.gameLinkEdit,
            gameImage: data.gameImageEdit
        }, {}, function(err, numReplaced) {
            if (err) {
                console.error('Unexpected error at DB update')
            } else {
                console.log('Replaced: ', numReplaced)
            }
        })
    }
    response.redirect("/games")
})

app.post('/api/games/delete', (request, response) => {
    console.log(request.body)
    if (request.isAuthenticated()) {
        var data = request.body
        gamesDB.remove(data, {}, function(err, numRemoved) {
            if(err) {
                console.error(err)
            }
        })
    }
    response.redirect("/games")
})


app.post('/api/links/edit', (request, response) => {
    console.log(request.body)
    if (request.isAuthenticated()) {
        let data = request.body
        linksDB.update({
            identifier: data.identifier,
        }, {
            gameName: data.gameNameEdit,
            linkName: data.linkNameEdit,
            linkLink: data.linkLinkEdit
        }, {}, function(err, numReplaced) {
            if (err) {
                console.error('Unexpected error at DB update')
            } else {
                console.log('Replaced: ', numReplaced)
            }
        })
    }
    response.redirect("/links")
})

app.post('/api/links/add', (request, response) => {
    if (request.isAuthenticated()) {
        let data = request.body
        data.identifier = Date.now() + data.linkName // Genera un ID unico
        if (data.linkName && data.linkLink) {
            linksDB.insert(data)
        }
    }
    response.redirect("/links")
    response.end()
})

app.post('/api/setters/games', (request, response) => {
    const data = request.body
    console.log(data)
    if (data.gameDescriptionLong && data.gameDescriptionShort && data.altFoto && data.gameLink && data.gameName && data.gameImage) {
        gamesDB.insert(data)
    }
    response.redirect("/games")
})

app.post('/api/setters/new', (request, response) => {
    const newData = request.body
    if (newData.newContent && newData.newTitle && request.isAuthenticated()) {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yyyy = today.getFullYear();
        today = mm + '/' + dd + '/' + yyyy;
        newData.date = today
        noticiasDB.insert(newData)
    }
    response.redirect("/noticias")
})


// Este metodo redirecciona a una pagina y cierra la sesion
function responseManager(response, root) {
    response.redirect(root)
    response.end()
    console.log(root)
}
let user = {
    username: "admin",
    password: 'nacho'
}

function createUser(user) {
    console.log('user')
    user.password = md5(user.password)
    whitelistDB.insert(user)
}