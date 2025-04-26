// ==UserScript==
// @name         Rel Monitores
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Mostra relatórios na ação dos Monitores, agora com dropdown para esconder/mostrar.
// @author       Você
// @match        https://ofc.exbrhabbo.com/externos/e34ee431-8e67-456d-8216-fce1b8a9a60b/central
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  loadStyle(
    "https://cdn.jsdelivr.net/npm/tailwindcss@3.3.2/dist/tailwind.min.css"
  );
  loadScript("https://unpkg.com/react@18/umd/react.development.js", () => {
    loadScript(
      "https://unpkg.com/react-dom@18/umd/react-dom.development.js",
      () => {
        loadScript("https://unpkg.com/@babel/standalone/babel.min.js", () => {
          initialize();
        });
      }
    );
  });

  function loadScript(src, callback) {
    const script = document.createElement("script");
    script.src = src;
    script.onload = callback;
    document.head.appendChild(script);
  }

  function loadStyle(href) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }

  let reactContainer = null;

  function initialize() {
    monitorDialogVisibility();

    document.addEventListener("click", (e) => {
      const target = e.target.closest(
        "body > div > section > main > section > main > div > div.p-6.pt-0 > section > section > div.space-y-4 > div > div > button"
      );

      if (target) {
        const buttons = document.querySelectorAll(
          "body > div > section > main > section > main > div > div.p-6.pt-0 > section > section > div.space-y-4 > div > div > button"
        );
        const index = Array.from(buttons).indexOf(target);

        if (index !== -1) {
          console.log("Índice do botão clicado:", index);
          fetchPegarNick(index);
        }
      }
    });
  }

  function injectReact(relatoriosTreinadores, isLoading) {
    const targetDiv = document.querySelector("#radix-\\:r3\\:");
    if (!targetDiv) {
      console.warn("A div #radix-\\:r3\\: não foi encontrada.");
      return;
    }

    targetDiv.className =
      "fixed left-[50%] top-[50%] z-50 grid translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg max-h-[80vh] overflow-none scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-900";
    targetDiv.style.width = "90%";

    if (reactContainer) {
      reactContainer.remove();
      reactContainer = null;
    }

    const jsxCode = `
      const App = () => {
        const [isDropdownOpen, setDropdownOpen] = React.useState(true);

        return (
          <div className="overflow-auto rounded-lg shadow-md text-slate-900 w-full z-50" style={{
            height: '400px',
            scrollbarWidth: 'thin',
            scrollbarColor: '#2c2c2c #09090b',
          }}>
            <div className="mb-4 flex justify-end">
              <button
                className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition"
                onClick={() => setDropdownOpen(!isDropdownOpen)}
              >
                {isDropdownOpen ? 'Ocultar Relatórios' : 'Mostrar Relatórios'}
              </button>
            </div>
            {isDropdownOpen && (
              <DadosRelatorio relatoriosTreinadores={${JSON.stringify(
                relatoriosTreinadores
              )}} isLoading={${isLoading}} />
            )}
          </div>
        );
      };

      const DadosRelatorio = ({ relatoriosTreinadores, isLoading }) => {
        const [expandedItems, setExpandedItems] = React.useState({});

        const toggleExpansion = (id) => {
          setExpandedItems((prev) => {
            const newExpandedItems = { ...prev };
            if (newExpandedItems[id]) {
              delete newExpandedItems[id];
            } else {
              Object.keys(newExpandedItems).forEach((key) => {
                delete newExpandedItems[key];
              });
              newExpandedItems[id] = true;
            }
            return newExpandedItems;
          });
        };

        return (
          <div className="space-y-4">
            {isLoading ? (
              <p className="text-lg">Loading...</p>
            ) : Array.isArray(relatoriosTreinadores) && relatoriosTreinadores.length > 0 ? (
              relatoriosTreinadores.map((relatorio) => (
                <div
                  key={relatorio.id}
                  className="border border-y-slate-700 px-2 transition-all duration-300 ease-in-out cursor-pointer"
                  onClick={() => toggleExpansion(relatorio.id)}
                >
                  <h3 className="flex items-center justify-between text-sm font-medium py-2 hover:underline">
                    <span className="text-[#E2F4E0]">
                      {relatorio.type?.name || 'Unknown Type'}
                      <span className="ml-2 text-muted-foreground">
                        aceito por {relatorio.accepted_by?.nickname || 'Unknown'}
                      </span>
                    </span>
                    <span className="ml-auto mr-2 block size-2 rounded-full bg-emerald-400"></span>
                    <svg
                      className="size-4 shrink-0 text-muted-foreground transition-transform"
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      />
                    </svg>
                  </h3>
                  {expandedItems[relatorio.id] && (
                    <div className="overflow-hidden text-sm py-4 space-y-4">
                      <h3 className="font-semibold leading-none tracking-tight">
                        Relatório #{relatorio.id} - {relatorio.branch?.name}
                      </h3>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Responsável: {relatorio.responsible?.role?.name},{" "}
                          {relatorio.responsible?.nickname}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Treinador: {relatorio.handler?.role?.name},{" "}
                          {relatorio.handler?.nickname}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Auxiliar: {relatorio.secondary?.role?.name},{" "}
                          {relatorio.secondary?.nickname}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Tipo de relatório: {relatorio.type?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Sala: {relatorio.room}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Data de início: {new Date(relatorio.started).toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Data de término: {new Date(relatorio.ended).toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Data de criação: {new Date(relatorio.created_at).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Treinados: {relatorio.students?.join(", ")}
                      </p>
                      {relatorio.failed?.length > 0 && (
                        <section className="space-y-3 border-slate-700 box-border rounded border px-2 py-2">
                          <h3 className="font-semibold leading-none tracking-tight">
                            Reprovados
                          </h3>
                          {relatorio.failed.map((fail, index) => (
                            <div key={index}>
                              <p className="text-sm text-muted-foreground">
                                Nickname: {fail.student}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Motivo: {fail.reason}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Data: {new Date(fail.date).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </section>
                      )}
                      <p className="text-sm text-muted-foreground">
                        Aprovados: {relatorio.approveds?.join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-lg">No data available.</p>
            )}
          </div>
        );
      };

      const container = document.createElement('div');
      container.id = 'react-container';
      container.style.width = '100%';
      container.className = 'flex items-center justify-center';
      targetDiv.appendChild(container);

      const root = ReactDOM.createRoot(container);
      root.render(<App />);
      reactContainer = container;
    `;

    const compiledCode = Babel.transform(jsxCode, { presets: ["react"] }).code;
    eval(compiledCode);
  }

  function monitorDialogVisibility() {
    const observer = new MutationObserver(() => {
      const dialog = document.querySelector("#radix-\\:r3\\:");

      if (dialog && dialog.getAttribute("data-state") === "closed") {
        cleanUpReact();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  function cleanUpReact() {
    if (reactContainer) {
      reactContainer.remove();
      reactContainer = null;
    }
  }

  const originalFetch = window.fetch;

  function fetchPegarNick(i) {
    fetch(
      "https://supabase.exbrhabbo.com/rest/v1/clusters_reports?select=*%2Cmember%3Aenrollments%21clusters_reports_member_fkey%28id%2Cnickname%29%2Creport_model%3Acluster_report_models%28*%29&order=created_at.desc&accepted=is.null&cluster=eq.e34ee431-8e67-456d-8216-fce1b8a9a60b&offset=0&limit=25",
      {
        method: "GET",
        headers: {
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTcyODc0Njc2MCwiZXhwIjo0ODg0NDIwMzYwLCJyb2xlIjoiYW5vbiJ9.PfUXWWBShhau-OE27c8GbPuIP8p3afvItzxi0Xpel0E",
          apikey:
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTcyODc0Njc2MCwiZXhwIjo0ODg0NDIwMzYwLCJyb2xlIjoiYW5vbiJ9.PfUXWWBShhau-OE27c8GbPuIP8p3afvItzxi0Xpel0E",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        testarFetch(data[i].member.id);
      })
      .catch((error) => console.error("Erro ao buscar dados:", error));
  }

  async function testarFetch(idMonitor) {
    let isLoading = true;
    injectReact([], isLoading);

    try {
      const response = await fetch(
        `https://supabase.exbrhabbo.com/rest/v1/reports?select=*%2Chandler%28id%2Cnickname%2Crole%3Aroles%28id%2Cname%29%29%2Csecondary%28id%2Cnickname%2Crole%3Aroles%28id%2Cname%29%29%2Cresponsible%28id%2Cnickname%2Crole%3Aroles%28id%2Cname%29%29%2Cbranch%3Abranches%28*%29%2Ctype%3Areport_types%28*%29%2Caccepted_by%28id%2Cnickname%2Crole%3Aroles%28id%2Cname%29%29&order=created_at.desc&offset=0&limit=25&branch=eq.895039c4-2473-494c-b293-5506e1d8152c&handler=eq.${idMonitor}`,
        {
          method: "GET",
          headers: {
            Authorization:
              "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTcyODc0Njc2MCwiZXhwIjo0ODg0NDIwMzYwLCJyb2xlIjoiYW5vbiJ9.PfUXWWBShhau-OE27c8GbPuIP8p3afvItzxi0Xpel0E",
            apikey:
              "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTcyODc0Njc2MCwiZXhwIjo0ODg0NDIwMzYwLCJyb2xlIjoiYW5vbiJ9.PfUXWWBShhau-OE27c8GbPuIP8p3afvItzxi0Xpel0E",
          },
        }
      );
      const json = await response.json();
      injectReact(json, false);
    } catch (error) {
      console.error(error);
      injectReact([], false);
    }
  }
})();
