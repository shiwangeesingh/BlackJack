/* Description-: This app consists of a dealer and a player when game starts both the dealer and the player will get 2 
 cards if any of them scores 21 then that particular person wins, if in case both of them gets 21, it's a draw, otherwise 
 the player have 2 options either he can hit or stand, each time  the player hits, he will get one more card and if the player
 stands then his total value will be compared to the dealer's total value. In case of stand if the player gets value higher than the dealer
 he wins and in case lesser than player loose, if player reaches above 21 the plyaer automatically loose

card values - :
ace -: 1 or 11
2-10 -: face value
rest face cards -: 10 */


const express = require('express');
const app = express();
const bodyParser = require ('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
let server = app.listen((8080));
const { UserHistoryModel } = require("./model/userHistory")
const { GameModel } = require("./model/game")
module.exports = app;

// ***************************************** APIS ********************************

//************************************* Start Game ************************** */

app.get('/startGame', async(req,res)=>{
    let assignedCards = [];
    let userCards = [];
    let dealerCards = [];
    let userName = "Shiwangee";
    let dealerName = "Shivam";
    let checkInitialData = await GameModel.findOneAndRemove({dealerName})
    let dealerCrd1 = await generateRandomCard()
    let value1 = await assignValue(dealerCrd1)
    let dealerCrd2 = await generateRandomCard()
    let value2 = await assignValue(dealerCrd2)
    let dealerStatus = await calculateFinalValue(value2,value1)
     dealerCards.push(dealerCrd1,dealerCrd2)
        let userCrd1 = await generateRandomCard()
        let userValue1 = await assignValue(userCrd1)
        let userCrd2 = await generateRandomCard()
        let userValue2 = await assignValue(userCrd2)
        let userStatus = await calculateFinalValue(userValue1,userValue2)
        userCards.push(userCrd2,userCrd1)
        if(dealerStatus == userStatus == 21)
        {
            let updateUserHistory = await UserHistoryModel.create({userName,status:"Draw"})
            let removeGame = await GameModel.findOneAndRemove({_id:req.body.gameId})
            res.status(200).json({response:{dealerStatus,dealerCards,userStatus,userCards:updatedUserCards},message:"Match Draw!"});
            return
        }
        else if(dealerStatus == 21)
        {
            let updateUserHistory = await UserHistoryModel.create({userName,status:"Lost"})
            let removeGame = await GameModel.findOneAndRemove({_id:req.body.gameId})
            res.status(200).json({response:{dealerStatus,dealerCards,userStatus,userCards:updatedUserCards},message:"Dealer Wins!"});
            return
        }
        else if(userStatus == 21)
        {
            let updateUserHistory = await UserHistoryModel.create({userName,status:"Win"})
            let removeGame = await GameModel.findOneAndRemove({_id:req.body.gameId})
            res.status(200).json({response:{dealerStatus,dealerCards,userStatus,userCards:updatedUserCards},message:"Player Wins!"});
            return
        }
        else{
            let updateCard = await GameModel.create({userCards,userName:userName,dealerCards,dealerName,userStatus,dealerStatus})
            if(updateCard)
            res.status(200).json({updateCard});
            else
            res.status(403).json({updateCard});
        }
  })
 
//******************************************* Hit ******************************************** */  
app.post('/hit', async(req,res)=>{
    try{
    let gameData = await GameModel.findOne({_id:req.body.gameId})
    if(!gameData)
    throw new Error("Match not found!")
    let userName = gameData.userName
    let userInitialValue = gameData.userStatus
    let dealerCards = gameData.dealerCards;
    let dealerStatus = gameData.dealerStatus;
    let userCards = gameData.userCards;
    let assignedCards = [...dealerCards,...userCards];
    let card = await generateRandomCard(assignedCards)
    let cardValue = await assignValue(card)
    let userValue = await calculateFinalValue(userInitialValue,cardValue)
    let updatedUserCards = [...userCards,card]
    if(userValue > 21)
    {
        let updateUserHistory = await UserHistoryModel.create({userName,status:"Lost"})
        let removeGame = await GameModel.findOneAndRemove({_id:req.body.gameId})
        res.status(200).json({response:{dealerStatus,dealerCards,userStatus:userValue,userCards:updatedUserCards},message:"Dealer Wins!"});
    }
    else{
        let updateGameData = await GameModel.findOneAndUpdate({_id:req.body.gameId},{$set:{userStatus:userValue,userCards:updatedUserCards}},{new:true})
        res.status(200).json({updateGameData});
    }
}
    catch(err){
        res.status(403).json({error:err.message});
    
    }
})

// ****************************************** Stand ***************************
app.post('/stand', async(req,res)=>{
try{
 let gameData =  await GameModel.findOne({_id:req.body.gameId})
 if(!gameData)
 throw new Error("Match not found!")
 let userName = gameData.userName
 let userCards = gameData.userCards
 let userStatus = gameData.userStatus
 let dealerCards = gameData.dealerCards
 let value1 = await assignValue(dealerCards[0]) 
 let value2 = await assignValue(dealerCards[1])
 let dealerValue = await calculateFinalValue(value1,value2)
 if(dealerValue > userStatus){
    let updateUserHistory = await UserHistoryModel.create({userName,status:"Lost"})
    let removeGame = await GameModel.findOneAndRemove({_id:req.body.gameId})
    res.status(200).json({response:{dealerStatus:dealerValue,dealerCards,userStatus,userCards},message:"Dealer Wins!"});
    return
 }
 else if(dealerValue == userStatus){
    let updateUserHistory = await UserHistoryModel.create({userName,status:"Draw"});
    let removeGame = await GameModel.findOneAndRemove({_id:req.body.gameId})
    res.status(200).json({response:{dealerStatus:dealerValue,dealerCards,userStatus,userCards},message:"Match Draw!"});
    return
 }
 else 
 {
    let updateUserHistory = await UserHistoryModel.create({userName,status:"Win"})
    let removeGame = await GameModel.findOneAndRemove({_id:req.body.gameId})
    res.status(200).json({response:{dealerStatus:dealerValue,dealerCards,userStatus,userCards},message:"User Wins!"});
    return
 }}
catch(err){
    res.status(403).json({error:err.message});
}
})

// ****************************************** Stand ***************************
app.post('/history', async(req,res)=>{
    try{
 let userHistory =  await UserHistoryModel.find({userName:req.body.userName})
 if(!userHistory)
 throw new Error("User does not exist")
    res.status(200).json(userHistory);
 }
catch(err){
    res.status(403).json({error:err});
}
})
//*********************************************** Common Functions *****************************  */

//******************************************** Assign Card Value *************************** */
 function assignValue(value){
       if(value){
        if(value == "two")
        return 2
        else if(value == "three")
        return 3
        else if(value == "four")
        return 4
        else if(value == "five")
        return 5
        else if(value == "six")
        return 6
        else if(value == "seven")
        return 7
        else if(value == "eight")
        return 8
        else if(value == "nine")
        return 9
        else if(value == "ace")
        return 1
        else
        return 10
    }
    else
    console.log("Please select a card");
}

//******************************************** Calculate Value of the cards *************************** */

function calculateFinalValue(value1, value2){
    if(value1 == value2 == 1){
       return 12
    }
    else if((value1 == 1 && value2 == 10) || (value2 == 1 && value1 == 10))
    return 21
    else{
      return (value1==1? 11 : value1) +  (value2==1? 11 : value2) 
    }
}

//***************************************** Assign Random Card ************************* */

function generateRandomCard(assignedCards=[]){
    let availCardList = []
    let cards = ["ace","king","queen","joker","one","two","three","four","five","six","seven","eight","nine","ten"]
    for(let list of cards){
        let count = 0;
        assignedCards.forEach((v) =>{
             (v == list)
             count++ } )
             if(count < 12)
             availCardList.push(list)
    }
    let randomCard = availCardList[Math.floor(Math.random() * availCardList.length)];
    return randomCard
}
