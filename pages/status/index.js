import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function statusPage() {
  return (
    <main
      style={{
        backgroundColor: "antiquewhite",
        width: "100vw",
        height: "100vh",
      }}
    >
      <style>{`
                body {
                    margin: 0;
                    padding: 0;
                }
                ul{
                  color: rgb(34, 34, 34);
                  font-family: Ubuntu, sans-serif;
                  font-size: 1.2em;
                  font-weight: normal;
                }

                span {
                color: black;
                font-weight: bold;
                }
                
            `}</style>
      <h1
        style={{
          textAlign: "center",
          marginTop: "0px",
          fontFamily: "Ubuntu, sans-serif;",
          fontSize: "3em",
          paddingTop: "30px",
        }}
      >
        Status
      </h1>
      <UpdatedAt />
    </main>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });
  let updatedAt = "Carregando...";
  let maxConnections = "Carregando...";
  let usedConnections = "Carregando...";
  let version = "Carregando...";
  if (isLoading === false) {
    updatedAt = new Date(data.updated_at);
    maxConnections = data.dependencies.database.max_connections;
    usedConnections = data.dependencies.database.used_connections;
    version = data.dependencies.database.version;
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.47)",
          blur: "100px",
          backgroundImage:
            "linear-gradient(to bottom right, rgba(255, 255, 255, 0.02), rgba(199, 199, 199, 0.1))",
          width: "400px",
          padding: "20px",
          borderRadius: "20px",
          boxShadow:
            "0px 0px 15px rgba(19, 18, 15, 0.47), inset 0px 0px 15px rgba(165, 165, 165, 0.48)",
          margin: "auto",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontFamily: "Ubuntu, sans-serif;",
            marginTop: "-5px",
          }}
        >
          Banco de dados
        </h2>
        <ul>
          Conexões Máximas:<span>{maxConnections}</span>
        </ul>
        <ul>
          Conexões Usadas: <span>{usedConnections}</span>
        </ul>
        <ul>
          Versão: <span>{version}</span>
        </ul>
      </div>
      <ul
        style={{
          color: " rgba(31, 31, 31, 0.95)",
          textAlign: "center",
          fontSize: "1em",
          marginRight: "3%",
        }}
      >
        ultima atualização:
        <span>
          {" "}
          {updatedAt instanceof Date
            ? `${updatedAt.toLocaleDateString("pt-br").toString()} às ${updatedAt.getHours()}:${updatedAt.getMinutes()}:${updatedAt.getSeconds()}`
            : updatedAt}
        </span>
      </ul>
    </div>
  );
}
