import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import { getUserById, login as apiLogin, extractApiError } from "@/lib/api";
import type { Role, User } from "@/types";

type AuthUser = (User & { role?: Role }) | null;

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser;
};

export type AuthContextValue = AuthState & {
  signIn: (name: string, password: string) => Promise<Error | void>;
  signOut: () => void;
};

const HANDLERS = {
  INITIALIZE: "INITIALIZE",
  SIGN_IN: "SIGN_IN",
  SIGN_OUT: "SIGN_OUT",
} as const;

type Action =
  | { type: typeof HANDLERS.INITIALIZE; payload?: AuthUser }
  | { type: typeof HANDLERS.SIGN_IN; payload: AuthUser }
  | { type: typeof HANDLERS.SIGN_OUT };

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

const reducer = (state: AuthState, action: Action): AuthState => {
  switch (action.type) {
    case HANDLERS.INITIALIZE: {
      const user = action.payload;
      return user
        ? { ...state, isAuthenticated: true, isLoading: false, user }
        : { ...state, isLoading: false };
    }
    case HANDLERS.SIGN_IN:
      return { ...state, isAuthenticated: true, user: action.payload };
    case HANDLERS.SIGN_OUT:
      return { ...state, isAuthenticated: false, user: null };
    default:
      return state;
  }
};

export const AuthContext = createContext<AuthContextValue>(
  {} as AuthContextValue
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    if (initialized.current) return;
    initialized.current = true;

    let authed = false;
    try {
      authed = !!window.sessionStorage.getItem("token");
    } catch (err) {
      console.error(err);
    }

    if (!authed) {
      dispatch({ type: HANDLERS.INITIALIZE });
      return;
    }

    const idRaw = window.sessionStorage.getItem("id");
    let user: AuthUser = state.user;
    if (!user && idRaw) {
      try {
        user = (await getUserById(Number(idRaw))) ?? null;
      } catch (err) {
        console.error(err);
      }
    }
    dispatch({ type: HANDLERS.INITIALIZE, payload: user });
  };

  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = async (
    name: string,
    password: string
  ): Promise<Error | void> => {
    try {
      const authData = await apiLogin(name, password);
      const user = authData.user;
      if (user.role?.name !== "admin") {
        return new Error("Пользователь не имеет необходимых прав");
      }
      window.sessionStorage.setItem("token", authData.token);
      window.sessionStorage.setItem("id", String(user.id));
      dispatch({ type: HANDLERS.SIGN_IN, payload: user });
    } catch (err) {
      throw new Error(extractApiError(err, "Ошибка авторизации"));
    }
  };

  const signOut = () => {
    window.sessionStorage.removeItem("token");
    window.sessionStorage.removeItem("id");
    dispatch({ type: HANDLERS.SIGN_OUT });
  };

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
