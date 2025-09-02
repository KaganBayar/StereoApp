/*import { createContext, useContext } from "react";

type RefreshContextType = {
  refreshPlaylists: () => Promise<void>;
};

const RefreshContext = createContext<RefreshContextType | null>(null);

export const usePlaylistRefresh = () => useContext(RefreshContext);

export const PlaylistRefreshProvider = ({
  children,
  refreshFunction,
}: {
  children: React.ReactNode;
  refreshFunction: () => Promise<void>;
}) => {
  return (
    <RefreshContext.Provider value={{ refreshPlaylists: refreshFunction }}>
      {children}
    </RefreshContext.Provider>
  );
};
*/
