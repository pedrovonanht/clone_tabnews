import retry from "async-retry"

async function waitForAllServices () {
  await waitForWebServices()

  async function waitForWebServices () {
    return retry(fetchStatusPage, {
      retries: 300,
      maxTimeout: 1000,
    }) 
    async function fetchStatusPage (bail, tryNumber) {
      console.log(tryNumber)
      const response = await fetch("http://localhost:3000/api/v1/status")
      if (response.status !== 200) {
        throw Error();
      }
    }
  }
 
}

export default {
  waitForAllServices,
}
