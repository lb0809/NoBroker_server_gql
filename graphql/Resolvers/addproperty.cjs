const Property=require('../../models/Property.cjs')
const checkAuth=require('../../JWT/checkAuth.cjs')
module.exports={
    Mutation:{
        addproperty:async(_,args,context)=>{
            const user=checkAuth(context)
            console.log(user)
            const {propInput,addressInput,locationInput,dimensionsInput,areaInput,priceInput}=args
            const newProperty=new Property({
                ...propInput,
                user:user.id,
                address:{...addressInput},
                location:{...locationInput},
                price:{...priceInput},
                dimensions:{
                    ...dimensionsInput,
                    area:{
                        ...areaInput
                    }
                },
                createdAt:new Date().toISOString()
            })
            const prop=await newProperty.save()
            console.log(prop)
            return{
                id:prop._id,
                ...prop._doc,
                owner_name:user.username,
                owner_email:user.email
            }
        }   
    }
}