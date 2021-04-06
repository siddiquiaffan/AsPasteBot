const {Telegraf} = require('telegraf');
const axios = require('axios');
const validUrl = require('valid-url');
const token = process.env.BOT_TOKEN;
const default_btn = [
    { text: "Join Channel", url: "https://t.me/asprojects" },
    { text: "Support Group", url: "https://t.me/assupportchat" },
  ];
  
const bot = new Telegraf(token);

const paste = (ctx , text) => {
    if(text.length > 0) {
        text += '\n\nPasted by https://t.me/AsPasteBot'
        ctx.replyWithMarkdown('`Hang on! Pasting your text...`' , {
            reply_to_message_id: ctx.update.message.message_id,
            allow_sending_without_reply: true,})
            .then((msgInfo) => {
                axios.get(`https://deldog.herokuapp.com/api/paste/?text=${encodeURIComponent(text)}`).then(res => {
                    try{
                        const message = "Here's the pasted URL\n\n👉 " + res.data.dogbinUrl
                        bot.telegram.editMessageText(msgInfo.chat.id, msgInfo.message_id, undefined, message , 
                            {disable_web_page_preview: true,
                            reply_markup: {
                            inline_keyboard: [[{text:'Open URL' , url:res.data.dogbinUrl},
                                              {text:'Share' , url:`https://t.me/share/url?url=${res.data.dogbinUrl}&text=%0APasted%20By%20@AsPasteBot`}]],
                            }}
                        )
                    }
                    catch(err){
                        ctx.replyWithMarkdown("An error has been occurred, Please try again later.", {
                            reply_to_message_id: ctx.update.message.message_id, allow_sending_without_reply: true,})
                    }
                })
            })
        }else{
            ctx.replyWithMarkdown('Please provide valid code/text to paste!', {
                reply_to_message_id: ctx.update.message.message_id, allow_sending_without_reply: true,})
        }
}

const getPaste = (ctx , url) => {
    ctx.replyWithMarkdown('`Hang on! Getting pasted content ...`' , {
        reply_to_message_id: ctx.update.message.message_id,
        allow_sending_without_reply: true,})
        .then((msgInfo) => {
            axios.get(`https://deldog.herokuapp.com/api/getpaste/?url=${url}`).then(res => {
                try{
                    const message = "Here's the pasted content\n👇👇👇\n\n" + res.data.text  
                    bot.telegram.editMessageText(msgInfo.chat.id, msgInfo.message_id, undefined, message , 
                        {disable_web_page_preview: true}
                    )
                }
                catch(err){
                    ctx.replyWithMarkdown("An error has been occurred, Please try again later.", {
                        reply_to_message_id: ctx.update.message.message_id, allow_sending_without_reply: true,})
                }
            })
        })
}

bot.start((ctx) =>
  ctx.replyWithMarkdown(
    `Hey **${ctx.message.from.first_name}**, Welcome! \nI can paste/getPaste text to https://del.dog, I can also short URLs using del.dog. Check /help to get started. \n\nMade with ❤ by [𝔄𝔉𝔉𝔄𝔑](https://t.me/AffanTheBest)`,
    {
      reply_to_message_id: ctx.update.message.message_id,
      allow_sending_without_reply: true,
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [default_btn],
      },
    }
  )
);
//! Start Message Ends.

//! Help Message Starts.
bot.help((ctx) =>
  ctx.replyWithMarkdown(
    "Hey " +
      ctx.message.from.first_name +
      ", Welcome! Happy to help you.\n\n`/help` : Get this Message. \n\nSend any text to get pasted on `https://del.dog` OR \n\n`/paste `: Paste on `https://del.dog`. (Eg. `/paste Hello`) \n`/getpaste `: Get pasted content from `https://del.dog`. (Eg. `/getpaste https://del.dog/elyzaco`)\n\n For more help join support Group.",
    {
      reply_to_message_id: ctx.update.message.message_id,
      allow_sending_without_reply: true,
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [default_btn],
      },
    }
  )
);
//! Help Message Ends.

//! /Paste command
bot.command('paste', ctx => {
    const text = ctx.message.text.split("/paste")[1];
    paste(ctx , text);
})

//! /getpaste command
bot.command("/getpaste" , ctx => {
    const url = ctx.message.text.split("/getpaste ")[1];
    validUrl.isUri(url) && url.includes("del.dog/") ? console.log(url) :console.log("not valid");
    validUrl.isUri(url) && url.includes("del.dog/") ?
     getPaste(ctx , url) : 
     ctx.replyWithMarkdown("Please send a valid url to get pasted content.", {
        reply_to_message_id: ctx.update.message.message_id, allow_sending_without_reply: true,})
})

bot.on("text" , ctx => {
    const text = ctx.message.text;
    paste(ctx , text);
})
bot.launch()