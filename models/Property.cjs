const mongoose = require("mongoose")
const {Schema}=mongoose
const PropSchema=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    address:{
        apartment_society:{
            type:String,
            required:true
        },
        locality:{
            type:String,
            required:true
        },
        houseno:{
            type:String
        },
        city:{
            type:String,
            required:true
        },
        floorno:{
            type:String
        },
        sublocality:{
            type:String,
            required:false                  
        }},
    dimensions:{
        area:{
            unit:{
                type:String,
                required:true
            },
            value:{
                type:Number,
                required:true
            }
        },
        balconies:{
            type:Number,
        },
        bathrooms:{
            type:Number,
        },
        bedrooms:{
            type:Number,
        }
    },
    description:{
        type:String,
        required:false
    },
    
    imgname:
    {
        type:String
    },
    image:
    {
        data: Buffer,
        contentType: String
    },

    isimg:{
        type:Boolean,
        default:false
    },
    location:{
        latitude:{
            type:Number,
            required:true
        },
        longitude:{
            type:Number,
            required:true
        }
    },
    category:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    title:{
        type:String,
        required:false
    },
    purpose:{
        type:String,
        required:true
    },
    price:{
        value:{
            type:Number,
            required:true
        },
        currency:{
            type:String,
            required:true
        }
    },
    createdAt:{
        type:String,
    }
    // {
    //     "Apartment_society": "block 5, lane 5",
    //     'Area_Unit': "sq.yards",
    //     'Balconies': "5",
    //     'Bathrooms': "5",
    //     'Locality': "Pune",
    //     'abt_property': "This property is located in Pune",
    //     'area': "3446",
    //     'bedrooms': "5",
    //     'city': "Pune",
    //     'floorno': "3",
    //     'houseno': "123",
    //     'image': "https://source.unsplash.com/360x360/?land",
    //     'image_file': new File(["https://source.unsplash.com/360x360/?land"], {
    //       lastModified
    //         :
    //         1667150766044,
    //       lastModifiedDate
    //         :
    //         'Sun Oct 30 2022 22:56:06 GMT+0530 (India Standard Time)',
    //       name
    //         :
    //         "vodycard1.jpg",
    //       size
    //         :
    //         1489373,
    //       type
    //         :
    //         "image/jpeg",
    //       webkitRelativePath
    //         :
    //         ""
    //     }),
    //     'isimg': 1,
    //     'lat': 28.5,
    //     'lng': 76.9,
    //     'owner_name': "Bhagwan Das",
    //     'phoneno': "1556879",
    //     'price': "12352355",
    //     'prop_cat': "Land",
    //     'property_age': "22",
    //     'property_title': "Pune Property",
    //     'purpose': "sell",
    //     'sublocality': "Neighbour 4"
    //   }
})
PropSchems.index({title:'text'})
const Property=mongoose.model('prop',PropSchema)
module.exports=Property