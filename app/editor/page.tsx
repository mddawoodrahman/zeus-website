import EditorPage from "@/routes/Editor";

interface EditorRoutePageProps {
  searchParams?: {
    id?: string;
  };
}

export default function EditorRoutePage({ searchParams }: EditorRoutePageProps) {
  const documentId = searchParams?.id || null;
  return <EditorPage documentId={documentId} />;
}
