import clsx from "clsx";
import { loginAction } from "./_action";

export default async function Page(props: {
  searchParams: Promise<{ code: string }>;
}) {
  const searchParams = await props.searchParams;
  console.log("props", searchParams);
  const code = searchParams.code;
  if (!code) {
    throw new Error("invalid code");
  }

  return (
    <div>
      <div>決済代行会社のログイン</div>
      <form action={loginAction}>
        <input hidden name="code" value={code} />
        <input
          placeholder="email"
          className={clsx("border border-form-border rounded-md px-2 py-1")}
          name="email"
        />
        <input
          placeholder="password"
          className={clsx("border border-form-border rounded-md px-2 py-1")}
          name="password"
        />
        <button type="submit">ログイン</button>
      </form>
    </div>
  );
}
