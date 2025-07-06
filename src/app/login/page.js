import { login, signup, logout, signInWithGoogle } from "./actions";

export default function LoginPage() {
  return (
    <div>
      <form>
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required />
        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" required />
        <button formAction={login}>Log in</button>
        <button formAction={signup}>Sign up</button>
      </form>
      <form>
        <button formAction={logout}>Log Out</button>
      </form>
      <form>
        <button className="bg-blue-500 p-4" formAction={signInWithGoogle}>Login with GOOGLE</button>
      </form>
    </div>
  );
}
