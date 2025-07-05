import Chat from "@/components/Chat";

export default function ChatPage() {
return (
<main className="flex flex-col h-screen">
<header className="p-4 shadow bg-white">
<h1 className="text-xl font-semibold">SourceField Chat</h1>
</header>
<div className="flex-1 overflow-hidden">
<Chat />
</div>
</main>
);
}
