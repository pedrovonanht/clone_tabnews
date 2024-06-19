const {exec} = require("node:child_process")

function verifyPostgressConection () {
  exec("docker exec postgress-dev pg_isready --host localhost", HandlerReturn)

  function HandlerReturn (error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".")
      verifyPostgressConection()
      return
    }
    console.log("\n 🟢 Conexão aberta e pronta para receber conexões! \n")
  }
}
process.stdout.write("🔴 aguardando conexão com postgress...")
verifyPostgressConection();