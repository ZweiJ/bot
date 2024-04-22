require("dotenv").config(".env")
const Lucielbot = require("./app/Lucielbot")

const token = process.env.TELEGRAM_TOKEN
const options = {
    polling: true
}

console.log("starting lucielbot......")
const lucielbot = new Lucielbot(token, options)

const main = () => {
    console.log("checking feature...")
    lucielbot.getHelp()
    lucielbot.getSticker()
    lucielbot.getGreeting()
    lucielbot.getQuotes()
    lucielbot.getNews()
    lucielbot.getQuake()
    console.log('feature ready!')
}
main()
console.log("bot is ready!")