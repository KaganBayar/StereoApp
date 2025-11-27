import { UserFrontend } from "@/lib/shared/Types/userTypes";

type UserSession = { user: UserFrontend; hasFetched: boolean };
/*
export function useUserSession(): UserSession {
  const [authenticatedUser, setAuthenticatedUser] =
    useState<UserFrontend>(initialUser);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    let ignore = false;
    getUserFromSession()
      .then((user) => {
        if (!ignore) {
          setHasFetched(true);
          setAuthenticatedUser(user);
        }
      })
      .catch((error) => {
        if (!ignore) {
          setHasFetched(true);
          console.error("Failed to get user session:", error);
          setAuthenticatedUser(initialUser);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  return { user: authenticatedUser, hasFetched: hasFetched };
}
*/
