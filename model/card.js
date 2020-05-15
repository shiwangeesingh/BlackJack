const {mongoose,conn} = require('./../dbConnecions')

var cardsSchema = mongoose.Schema({

dealerName:{
    type:String,
    require:true,
    default:""
},
// userId: {     
//     type: mongoose.Schema.Types.ObjectId,
//             ref: 'user',
//             default : null
//     },

ace:{
    type:Number,
    require:true,
    default:12
},
king:{
    type:Number,
    require:true,
    default:12
},   
queen:{
    type:Number,
    require:true,
    default:12
},    
joker:{
    type:Number,
    require:true,
    default:12
},    

two:{
    type:Number,
    require:true,
    default:12
},    
three:{
    type:Number,
    require:true,
    default:12
},    
four:{
    type:Number,
    require:true,
    default:12
},    
five:{
    type:Number,
    require:true,
    default:12
},
six:{
    type:Number,
    require:true,
    default:12
},
seven:{
    type:Number,
    require:true,
    default:12
},
eight:{
    type:Number,
    require:true,
    default:12
},
nine:{
    type:Number,
    require:true,
    default:12
},
ten:{
    type:Number,
    require:true,
    default:12
}
// ,five:{
//     type:Number,
//     require:true,
//     default:12
// },
},{
    strict:true,
    versionKey: false,
    timestamps: true,
    colletion:'cards'
})
exports.CardsModel = conn.model('cards',cardsSchema)