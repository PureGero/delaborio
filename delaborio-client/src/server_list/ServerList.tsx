import { useContext, useEffect, useState } from "react";
import { Server, pingServers } from "../net/servers";
import { AccountContext } from "../auth/AccountContext";
import PingIcon from "./PingIcon";

export default function ServerList() {
  const account = useContext(AccountContext);
  const [servers, setServers] = useState<Server[]>([]);

  useEffect(() => {
    pingServers(account.userid, servers => setServers([...servers])); // Need to clone the servers into a new object so that React knows to reender
  }, [account.userid]);

  return (
    <div className="py-6">
      <p className="text-center">Choose a server</p>
      {
        servers.filter(server => server.ping).map(server => (
          <button key={server.name} className="flex items-center flow-root w-80 bg-white border border-gray-300 rounded-lg shadow-md px-6 py-2 m-3 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            <span className="float-left">{server.name}</span>
            <span className="float-right"><PingIcon ping={server.ping || -1} /></span>
            <span className="float-right mx-2" id="playercount">{server.players === undefined ? 'x' : server.players}</span>
          </button>
        ))
      }
    </div>
  )
}