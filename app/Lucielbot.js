require("dotenv").config(".env")
const TelegramBot = require("node-telegram-bot-api");
const commands = require("../libs/command")
const {helpTextMessage, invalidCommandMessage} = require("../libs/constant")

class Lucielbot extends TelegramBot{
    constructor(token,options){
        super(token, options)
        this.on("message",(data)=>{            
            const isInCommand = Object.values(commands).some(keyword => keyword.test(data.text))

            if(!isInCommand){
                console.log(`invalid Command Executed By ${data.from.username} => ${data.text}`)
                this.sendMessage(data.from.id, invalidCommandMessage,{
                    reply_markup:{
                        inline_keyboard:[
                                    [
                                        {
                                            text: "panduan Pengguna",
                                            callback_data: "go_to_help"
                                        }
                                    ]
                                ]
                            }
                            
                        })
                    }
                })
                this.on("callback_query",(callback)=>{
                    const callbackName = callback.data
                    if(callbackName == "go_to_help"){
                        this.sendMessage(callback.from.id, helpTextMessage)
                    }
                })
    }
    getSticker(){
        this.on("sticker", (data) => {
            console.log("getSticker Executed By" + data.from.username)
            this.sendMessage(data.from.id, data.sticker.emoji)
        })
    }
    getGreeting(){
        this.onText(commands.greeting, (data) => {
            console.log("getGreeting Executed By " + data.from.username)
            this.sendMessage(data.from.id, "hallo juga!!")
        })
    }
    getQuotes() {
        this.onText(commands.quote, async (data) => {
            console.log("getQuotes Executed By " + data.from.username)
            const quoteEndpoint = process.env.QUOTEENDPOINT
            try {
                const apiCall = await fetch(quoteEndpoint)
                const { quote } = await apiCall.json()
                this.sendMessage(data.from.id, quote)
            } catch (error) {
                console.error(error)
                this.sendMessage(data.from.id, "maaf silahkan ulangi lagi 🙏")
            }
        })
    }
    getNews() {
        this.onText(commands.news, async (data) => {
            console.log("getNews Executed By " + data.from.username)
            const newsEndpoint = process.env.NEWSENDPOINT
            this.sendMessage(data.from.id, "mohon ditunggu...")
            try {
                const apiCall = await fetch(newsEndpoint)
                const response = await apiCall.json()
                const maxNews = 2

                for (let i = 0; i < maxNews; i++) {
                    const news = response.posts[i]
                    const { title, image, headline } = news
                    this.sendPhoto(data.from.id, image, { caption: `Judul: ${title} \n\nHeadline: ${headline}` })
                }
            } catch (error) {
                console.error(error)
            }
        })
    }
    getQuake() {
        const quakeEndpoint = process.env.QUAKEENDPOINT

        try {
            this.onText(commands.quake, async (data) => {
                console.log("getQuake Executed By " + data.from.username)
                const apiCall = await fetch(quakeEndpoint)
                const response = await apiCall.json()
                const { gempa } = response.Infogempa
                const { Wilayah, Magnitude, Tanggal, Jam, Kedalaman, Shakemap } = gempa

                const imgSourceUrl = process.env.QUAKEIMGENDPOINT + Shakemap

                this.sendPhoto(data.from.id, imgSourceUrl, {
                    caption: `Info gempa terbaru ${Tanggal} / ${Jam}:\n\nwilayah: ${Wilayah}\nBesaran: ${Magnitude} SR\nKedalaman: ${Kedalaman}\n\n`
                })
            })
        } catch (error) {
            console.error(error)
        }
    }
    getHelp(){
        this.onText(commands.help, async(data) =>{
            this.sendMessage(data.from.id, helpTextMessage)
        })
    }
}

module.exports = Lucielbot