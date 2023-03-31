

const express = require('express')
const morgan = require('morgan');
const fs = require('fs');


const { ApolloServer, gql } = require('apollo-server-express')

const { PubSub } = require("graphql-subscriptions")
const mongoose = require('mongoose');
const bodyparser = require('body-parser');

const usertypedef = require('./User/user.cjs')
const getPropertiessquery = require('./Services/getProperty.cjs')
const getUsersquery = require('./Services/getUser.cjs')
const Propertytypedef = require('./Property/property.cjs')
const addPropertytypedef = require('./Services/createProperty.cjs')
const logintypedef = require('./Services/Login.cjs')
const registertypedef = require('./Services/RegisterUser.cjs')
const sendMail = require('./mail/sendMail.cjs');

const cors = require("cors")
const path = require('path')


// const typeDefs = require('./graphql/typedefs.cjs');
const resolvers = require('./graphql/resolver.cjs');
const connectdb = require('./db.cjs')




//Middleware
const multer = require('multer')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

const upload = multer({ storage: storage })



const baseTypeDefs = gql`
  type Query
  type Mutation
`
async function startApolloServer() {

  const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

  const app = express()
  // app.use(morgan('dev'));

  app.use(bodyparser.urlencoded({ extended: false }))

  // parse application/json
  app.use(bodyparser.json())

  connectdb()
  const pubsub = new PubSub();
  const server = new ApolloServer({
    typeDefs: [baseTypeDefs, addPropertytypedef, usertypedef, getUsersquery, Propertytypedef, logintypedef, registertypedef, getPropertiessquery],
    resolvers,
    context: ({ req }) => ({ req, pubsub })
  });
  await server.start()

  const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  }
  app.use(express.static('images'));
  app.use(cors(corsOptions))


  // app.use('/graphql',()=>{console.log("hit")})


  // to upload
  app.post('/uploadImage', upload.single('file'), (req, res) => {
    console.log(req.file)
    res.send(req.file);
  });

  app.post('/auth', (req, res) => {
    console.log(req.body.email);
    try {
      let s = req.body.email;
      let mail = sendMail(s);


      res.send(mail.toString());
    }
    catch (err) {
      throw new Error(err)
    }
  })


  server.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: "*"
    }
  })
  const PORT = process.env.port || 5000;
  app.listen(PORT, (req, res) => {
    console.log(`http://localhost:${PORT}`)
  })
  return { server, app }
}
startApolloServer()