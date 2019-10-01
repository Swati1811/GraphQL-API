const express=require('express');
const app=express();
const graphqlHttp=require('express-graphql');
const { buildSchema} =require('graphql');
const mongoose=require('mongoose');
const Events=require('./model/eventModel');
const User=require('./model/userModel');
const bcrypt=require('bcrypt');

app.use(express.json());

app.use('/graphql',graphqlHttp({
    schema: buildSchema(`
        type Event{
            _id:ID!
            title:String!
            price:Float!
            imageUrl:String!
        }

        type User{
            _id:ID!
            email:String!
            password:String
        }

        type RootQuery{
            events:[Event!]!
        } 
        
        input EventInput{
            title:String!
            price:Float!
            imageUrl:String!
        }

        input UserInput{
            email:String!
            password:String!
        }
        
        type RootMutation{
            createEvents(eventInput:EventInput):Event
            createUser(userInput:UserInput):User
        }

        schema{
            query:RootQuery
            mutation:RootMutation
        }
    `),
    rootValue:{
        events:async()=>{
            const event=await Events.find();
            return event;
        },

        createEvents:async(args)=>{
            let event=new Events({
                title:args.eventInput.title,
                price:args.eventInput.price,
                imageUrl:args.eventInput.imageUrl,
                creator:'5d88bc79a89e8c3a8c8d4f7a'
            });

            let user=await User.findById('5d88bc79a89e8c3a8c8d4f7a');
            if(!user) throw new Error('User not found..!');

            await user.createdEvents.push(event);
            event=await event.save();
            return event;
        },

        createUser:async(args)=>{
            let user=await User.findOne({email:args.userInput.email});
            if(user) throw new Error('User already registered..!');

            user=new User({
                email:args.userInput.email,
                password:args.userInput.password
            });

            const salt=await bcrypt.genSalt(10);
            user.password=await bcrypt.hash(user.password,salt);
            await user.save();
            return user;


        }
    },
    graphiql:true
}))

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@onlineorganicstore-fpv8x.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
    .then(()=>{
        console.log('Connected to the database..!!');
    })
    .catch((err)=>{
        console.log('Problem in connecting to the database..!',err);
    })
 
const PORT=process.env.PORT||3000;

app.listen(PORT,()=>{
    console.log('Listening on port 3000..!!');
});