const {mongoose,conn} = require('./../dbConnecions')

var userHistorySchema = mongoose.Schema({
userName:{
    type:String,
    require:true,
    default:""
},
status:{
    type:String,
    require:true,
    default:""
}
},{
    strict:true,
    versionKey: false,
    timestamps: true,
    colletion:'userHistory'
})
exports.UserHistoryModel = conn.model('userHistory',userHistorySchema)