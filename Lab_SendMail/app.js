var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
    service : "gmail",
    auth:{
        user: "a0987631396@gmail.com",
        pass: "aA00152002"
    },
    tls:{
        rejectUnauthorized:false
    }
})

var mailOptions = {
    from : "a0987631396@gmail.com",
    to : "jammy83091@gmail.com",
    subject: "test mail",
    //text: "Mail body"
    html:"<h1>Heading</h1><a href='https://en.wikipedia.org/'>Wiki</a>"
};

transporter.sendMail(mailOptions, function(err,info){
    if(err){
        console.log(err);
    }else{
        console.log("訊息發送:" + info.response);
    }
})