const { gql } = require('apollo-server');
module.exports=gql`
    extend type Query{
        getusers:[User]!    
    }
`;