interface Props {
  params: {
    id: string;
  };
}

export default function TestPage({
  params,
}: Props) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">
        Test {params.id}
      </h1>
    </div>
  );
}