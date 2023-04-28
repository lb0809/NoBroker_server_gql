
require('dotenv').config()
const express = require('express')
const morgan = require('morgan');
const fs = require('fs');


const { ApolloServer, gql } = require('apollo-server-express')

const { PubSub } = require("graphql-subscriptions")
const mongoose = require('mongoose');
const bodyparser = require('body-parser');

//a
const sendMail = require('./mail/sendMail.cjs');

const usertypedef = require('./typedefs/User/user.cjs')
const chattypedef = require('./typedefs/Chat/chat.cjs')
const conversationtypedef = require('./typedefs/Services/conversation.cjs')
const messagetypedef = require('./typedefs/Services/message.cjs')
const getPropertiessquery = require('./typedefs/Services/getProperty.cjs')
const getUsersquery = require('./typedefs/Services/getUser.cjs')
const Propertytypedef = require('./typedefs/Property/property.cjs')
const addPropertytypedef = require('./typedefs/Services/createProperty.cjs')
const logintypedef = require('./typedefs/Services/Login.cjs')
const registertypedef = require('./typedefs/Services/RegisterUser.cjs')
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
const app = express()
async function startApolloServer() {

  const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

  // const app = express()
  app.use(morgan('dev'));

  app.use(bodyparser.urlencoded({ extended: false }))

  // parse application/json
  app.use(bodyparser.json())

  connectdb()
  const pubsub = new PubSub();
  const server = new ApolloServer({
    typeDefs: [baseTypeDefs,chattypedef,conversationtypedef,messagetypedef, addPropertytypedef, usertypedef, getUsersquery, Propertytypedef, logintypedef, registertypedef, getPropertiessquery],
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

  //added
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
    console.log(`http://localhost:${PORT}/graphql`)
  })
  return {server}
}
let{server}=startApolloServer()
module.exports=app