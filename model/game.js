const {mongoose,conn} = require('./../dbConnecions')

var gameSchema = mongoose.Schema({

userName:{
    type:String,
    require:true,
    default:""
},
// userId: {     
//     type: mongoose.Schema.Types.ObjectId,
//             ref: 'user',
//             default : null
//     },
dealerName:{
    type:String,
    require:true,
    default:""
},
userCards:{
    type:Array,
    require:true,
    default:[]
},
dealerCards:{
    type:Array,
    require:true,
    default:[]
},
userStatus:{
    type:Number,
    require:true,
    default:0
},
dealerStatus:{
    type:Number,
    require:true,
    default:0
},
},
{
    strict:true,
    versionKey: false,
    timestamps: true,
    colletion:'game'
})
exports.GameModel = conn.model('game',gameSchema)