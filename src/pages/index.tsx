import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "../utils/api";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  const { data: secretAdminMessage } =
    api.example.getAdminSecretMessage.useQuery(
      undefined, // no input
      { enabled: sessionData?.user !== undefined }
    );

  return (
    <>
      <Head>
        <title>9tool</title>
        <meta name="description" content="9tool" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            9tool
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-8">
            {secretAdminMessage && (
              <Link
                className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                href="/overlays"
              >
                <h2 className="text-xl font-bold">Manage Overlays (Admin)</h2>
                {/* <div className="text-lg">
                Just the basics - Everything you need to know to set up your
                database and authentication.
              </div> */}
              </Link>
            )}
            {sessionData && !secretAdminMessage && (
              <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
                <h3 className="text-2xl font-bold">
                  Non-admin features coming soon!
                </h3>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center gap-2">
            {/* <p className="text-2xl text-white">
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p> */}
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  const { data: secretAdminMessage } =
    api.example.getAdminSecretMessage.useQuery(
      undefined, // no input
      { enabled: sessionData?.user !== undefined }
    );

  const { data: isDiscordConncected } =
    api.example.getIsDiscordConnected.useQuery(undefined, {
      enabled: sessionData?.user !== undefined,
    });

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && (
          <div>
            Logged in as
            <span className="ml-2 rounded bg-white/10 p-2">
              {sessionData.user?.name}
            </span>
          </div>
        )}
        {/* {sessionData && (
          <div>
            {isDiscordConncected ? (
              "Discord Already Connected"
            ) : (
              <>
                Discord Not Connected{" "}
                <button
                  onClick={() => signIn("discord")}
                  className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                >
                  Connect Discord Account
                </button>
              </>
            )}
          </div>
        )}
        {secretMessage && <div>{secretMessage}</div>}
        {secretAdminMessage && <div>{secretAdminMessage}</div>} */}
      </p>
      <button
        className="mt-4 rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
