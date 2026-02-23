function setupsockets(io)
{
    io.on("connection",(socket)=>
    {
        console.log("the user has been connected",socket.id)
        //when the user joins in
        socket.on("join-room",({username,room})=>
        {
            socket.join(room)
            socket.data.username=username
            socket.data.room=room
            io.to(room).emit("messages",`${username} has joined the group`)
        })
        //when the user will disconnect this particular logic will run
        socket.on("disconnect",()=>
        {
            const username=socket.data.username
            const room=socket.data.room
            io.to(room).emit("messages",`${username} has left the chat`)
        })
        socket.on("send-message", ({ message, username, room }) => 
            {
                io.to(room).emit("messages", `${username}: ${message}`);
            });
    })
    

}
module.exports={setupsockets}
//objects and de structuring {} and socket.join simply creates room 
//so your saying that a server can only know the person who connected to that particular server .so when someone sends message to any server my works to send it first to the redis and redis will send it ti everyone else right simple.but will redis send it to the same server that sends the message because thats a pronblem
//so basically you take a huge computer and download this redis in it and you send any request or storing thing and it stores in its ram itself but i guess because of this you can only store limited things and there can be performace issue
//ok so it has a feature called pub sub meaning servers can subscribe to some particular information from redis .so if the data gets updated in that particular thing channel the the server gets the message automatically
//ok so it doesnt store anything it just remembers who subscribed and if someone send that to it quicly send it to everyone and vanish
//ok see so pub sub model is nothing but bunch of servers subscribe to redis right for some event information and publishing means we are sending info to the redis in our code here we are making our server both and saying every emit message as publish and every io.on as recieves right
//so can i say it only sends or recieves message form others server where when we right io.to().emit thing
//ok so sticky session is need so imagine this you send request and it first goes to the nginx server right it sends you to server A and connection happens of websockets now maybe the server A sends you and message this works ig but then when you send a message again it routes you to server B it has no idea so sticky session are super important right